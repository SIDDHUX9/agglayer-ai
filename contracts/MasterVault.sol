// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MasterVault
 * @dev Main vault deployed on Polygon PoS (Amoy testnet)
 * Accepts user deposits and manages cross-chain yield strategies
 */
contract MasterVault is ERC20, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // The underlying asset (e.g., USDC)
    IERC20 public immutable asset;

    // Strategy adapters (could be on this chain or referenced for cross-chain)
    address public aaveAdapter;
    address public rebalanceExecutor; // Cross-chain executor on zkEVM

    // TVL tracking
    uint256 public totalValueLocked;

    // Strategy allocations (in basis points, 10000 = 100%)
    mapping(address => uint256) public strategyAllocations;

    // Events
    event Deposited(address indexed user, uint256 assets, uint256 shares);
    event Withdrawn(address indexed user, uint256 assets, uint256 shares);
    event Rebalanced(address indexed strategy, uint256 amount, uint256 timestamp);
    event StrategyAdded(address indexed strategy, uint256 allocation);
    event CrossChainRebalanceInitiated(bytes32 indexed messageId, uint256 amount);

    constructor(
        address _asset,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) Ownable(msg.sender) {
        asset = IERC20(_asset);
    }

    /**
     * @dev Set Aave adapter address
     */
    function setAaveAdapter(address _aaveAdapter) external onlyOwner {
        require(_aaveAdapter != address(0), "Invalid address");
        aaveAdapter = _aaveAdapter;
        emit StrategyAdded(_aaveAdapter, 0);
    }

    /**
     * @dev Set RebalanceExecutor address (on zkEVM)
     */
    function setRebalanceExecutor(address _executor) external onlyOwner {
        require(_executor != address(0), "Invalid address");
        rebalanceExecutor = _executor;
    }

    /**
     * @dev Deposit assets and receive vault shares
     */
    function deposit(uint256 assets, address receiver) external nonReentrant returns (uint256 shares) {
        require(assets > 0, "Cannot deposit 0");
        require(receiver != address(0), "Invalid receiver");

        // Calculate shares to mint
        shares = totalSupply() == 0 ? assets : (assets * totalSupply()) / totalAssets();

        // Transfer assets from user
        asset.safeTransferFrom(msg.sender, address(this), assets);

        // Mint vault shares
        _mint(receiver, shares);

        // Update TVL
        totalValueLocked += assets;

        emit Deposited(receiver, assets, shares);

        return shares;
    }

    /**
     * @dev Withdraw assets by burning vault shares
     */
    function withdraw(
        uint256 shares,
        address receiver,
        address owner
    ) external nonReentrant returns (uint256 assets) {
        require(shares > 0, "Cannot withdraw 0");
        require(receiver != address(0), "Invalid receiver");

        // Check allowance if caller is not owner
        if (msg.sender != owner) {
            uint256 allowed = allowance(owner, msg.sender);
            require(allowed >= shares, "Insufficient allowance");
            _approve(owner, msg.sender, allowed - shares);
        }

        // Calculate assets to return
        assets = (shares * totalAssets()) / totalSupply();

        // Burn shares
        _burn(owner, shares);

        // Transfer assets to receiver
        asset.safeTransfer(receiver, assets);

        // Update TVL
        totalValueLocked -= assets;

        emit Withdrawn(receiver, assets, shares);

        return assets;
    }

    /**
     * @dev Rebalance funds into Aave adapter
     */
    function rebalanceToAave(uint256 amount) external onlyOwner nonReentrant {
        require(aaveAdapter != address(0), "Aave adapter not set");
        require(amount > 0 && amount <= asset.balanceOf(address(this)), "Invalid amount");

        // Approve adapter to spend tokens
        asset.approve(aaveAdapter, amount);

        // Call the adapter's deposit function
        (bool success, ) = aaveAdapter.call(
            abi.encodeWithSignature("deposit(uint256)", amount)
        );
        require(success, "Aave deposit failed");

        emit Rebalanced(aaveAdapter, amount, block.timestamp);
    }

    /**
     * @dev Withdraw from Aave adapter back to vault
     */
    function withdrawFromAave(uint256 amount) external onlyOwner nonReentrant {
        require(aaveAdapter != address(0), "Aave adapter not set");

        (bool success, ) = aaveAdapter.call(
            abi.encodeWithSignature("withdraw(uint256)", amount)
        );
        require(success, "Aave withdrawal failed");

        emit Rebalanced(aaveAdapter, amount, block.timestamp);
    }

    /**
     * @dev Initiate cross-chain rebalance (simulated for testnet)
     * In production, this would use Polygon AggLayer messaging
     */
    function initiateCrossChainRebalance(uint256 amount, bytes calldata data) external onlyOwner {
        require(rebalanceExecutor != address(0), "Executor not set");
        require(amount > 0, "Invalid amount");

        // For testnet: just emit event showing intent
        // In production: call AggLayer bridge contract
        bytes32 messageId = keccak256(abi.encodePacked(block.timestamp, amount, data));

        emit CrossChainRebalanceInitiated(messageId, amount);
    }

    /**
     * @dev Get total assets under management (TVL)
     */
    function totalAssets() public view returns (uint256) {
        uint256 idle = asset.balanceOf(address(this));

        // In production, query Aave adapter balance
        // For now, return idle + TVL
        return idle + totalValueLocked - idle;
    }

    /**
     * @dev Convert shares to assets
     */
    function convertToAssets(uint256 shares) external view returns (uint256) {
        uint256 supply = totalSupply();
        return supply == 0 ? shares : (shares * totalAssets()) / supply;
    }

    /**
     * @dev Convert assets to shares
     */
    function convertToShares(uint256 assets) external view returns (uint256) {
        uint256 supply = totalSupply();
        return supply == 0 ? assets : (assets * supply) / totalAssets();
    }

    /**
     * @dev Get vault TVL (same as totalAssets)
     */
    function getTVL() external view returns (uint256) {
        return totalAssets();
    }

    /**
     * @dev Emergency withdraw - owner only
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }
}
