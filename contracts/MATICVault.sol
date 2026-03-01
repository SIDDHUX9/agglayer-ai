// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MATICVault
 * @dev Vault that accepts native MATIC deposits directly (no conversion)
 * Perfect for Polygon buildathon - native token support!
 */
contract MATICVault is ERC20, Ownable, ReentrancyGuard {

    // TVL tracking
    uint256 public totalValueLocked;

    // Strategy adapters
    address public aaveAdapter;
    address public rebalanceExecutor;

    // Events
    event Deposited(address indexed user, uint256 amount, uint256 shares);
    event Withdrawn(address indexed user, uint256 amount, uint256 shares);
    event Rebalanced(address indexed strategy, uint256 amount, uint256 timestamp);

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) Ownable(msg.sender) {}

    /**
     * @dev Deposit native MATIC and receive vault shares
     * @return shares The amount of vault shares minted
     */
    function deposit() external payable nonReentrant returns (uint256 shares) {
        require(msg.value > 0, "Must deposit MATIC");

        // Calculate shares to mint (1:1 ratio initially)
        // For a more sophisticated vault, use: shares = (msg.value * totalSupply()) / totalValueLocked
        if (totalSupply() == 0) {
            shares = msg.value; // Initial deposit: 1:1 ratio
        } else {
            shares = (msg.value * totalSupply()) / totalValueLocked;
        }

        // Update TVL
        totalValueLocked += msg.value;

        // Mint shares to depositor
        _mint(msg.sender, shares);

        emit Deposited(msg.sender, msg.value, shares);

        return shares;
    }

    /**
     * @dev Withdraw MATIC by burning vault shares
     * @param shares The amount of vault shares to burn
     * @return amount The amount of MATIC withdrawn
     */
    function withdraw(uint256 shares) external nonReentrant returns (uint256 amount) {
        require(shares > 0, "Must withdraw shares");
        require(balanceOf(msg.sender) >= shares, "Insufficient shares");

        // Calculate MATIC amount to return
        amount = (shares * totalValueLocked) / totalSupply();
        require(amount > 0, "Zero withdrawal amount");
        require(address(this).balance >= amount, "Insufficient vault balance");

        // Update TVL
        totalValueLocked -= amount;

        // Burn shares
        _burn(msg.sender, shares);

        // Transfer MATIC to user
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "MATIC transfer failed");

        emit Withdrawn(msg.sender, amount, shares);

        return amount;
    }

    /**
     * @dev Get user's MATIC balance in the vault
     * @param user The user address
     * @return The MATIC value of user's shares
     */
    function balanceOfAssets(address user) external view returns (uint256) {
        uint256 userShares = balanceOf(user);
        if (userShares == 0 || totalSupply() == 0) return 0;
        return (userShares * totalValueLocked) / totalSupply();
    }

    /**
     * @dev Preview how many shares would be minted for a deposit
     * @param amount The MATIC amount to deposit
     * @return shares The shares that would be minted
     */
    function previewDeposit(uint256 amount) external view returns (uint256 shares) {
        if (totalSupply() == 0) {
            return amount;
        }
        return (amount * totalSupply()) / totalValueLocked;
    }

    /**
     * @dev Preview how much MATIC would be received for burning shares
     * @param shares The shares to burn
     * @return amount The MATIC that would be received
     */
    function previewWithdraw(uint256 shares) external view returns (uint256 amount) {
        if (totalSupply() == 0) return 0;
        return (shares * totalValueLocked) / totalSupply();
    }

    /**
     * @dev Get vault total assets (TVL in MATIC)
     */
    function totalAssets() external view returns (uint256) {
        return totalValueLocked;
    }

    /**
     * @dev Set Aave adapter address
     */
    function setAaveAdapter(address _aaveAdapter) external onlyOwner {
        require(_aaveAdapter != address(0), "Invalid address");
        aaveAdapter = _aaveAdapter;
    }

    /**
     * @dev Set rebalance executor address
     */
    function setRebalanceExecutor(address _rebalanceExecutor) external onlyOwner {
        require(_rebalanceExecutor != address(0), "Invalid address");
        rebalanceExecutor = _rebalanceExecutor;
    }

    /**
     * @dev Allow contract to receive MATIC
     */
    receive() external payable {
        totalValueLocked += msg.value;
    }

    /**
     * @dev Fallback function
     */
    fallback() external payable {
        totalValueLocked += msg.value;
    }
}
