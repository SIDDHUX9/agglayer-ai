// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title RebalanceExecutor
 * @dev Deployed on zkEVM Cardona to execute AI-driven reallocations
 * Receives messages from MasterVault on Polygon PoS via AggLayer
 */
contract RebalanceExecutor is Ownable {
    using SafeERC20 for IERC20;

    address public masterVault;
    address public zkevmStrategy; // Local strategy on zkEVM (e.g., Aave on zkEVM)

    // Track executed rebalances
    struct Rebalance {
        bytes32 messageId;
        uint256 amount;
        address strategy;
        uint256 timestamp;
        bool executed;
    }

    mapping(bytes32 => Rebalance) public rebalances;
    bytes32[] public rebalanceHistory;

    event ExecutionReceived(bytes32 indexed messageId, bytes data);
    event RebalanceExecuted(bytes32 indexed messageId, address strategy, uint256 amount);
    event StrategySet(address indexed strategy);

    constructor(address _masterVault) Ownable(msg.sender) {
        masterVault = _masterVault;
    }

    /**
     * @dev Set the local zkEVM strategy address
     */
    function setZkevmStrategy(address _strategy) external onlyOwner {
        require(_strategy != address(0), "Invalid strategy");
        zkevmStrategy = _strategy;
        emit StrategySet(_strategy);
    }

    /**
     * @dev Execute rebalance strategy
     * In production, this would be called by AggLayer bridge
     * For testnet, owner can call directly to simulate
     */
    function executeStrategy(bytes calldata data) external onlyOwner {
        // Decode the AI instructions
        (bytes32 messageId, address strategy, uint256 amount) = abi.decode(
            data,
            (bytes32, address, uint256)
        );

        require(!rebalances[messageId].executed, "Already executed");

        // Store rebalance record
        rebalances[messageId] = Rebalance({
            messageId: messageId,
            amount: amount,
            strategy: strategy,
            timestamp: block.timestamp,
            executed: true
        });

        rebalanceHistory.push(messageId);

        emit ExecutionReceived(messageId, data);
        emit RebalanceExecuted(messageId, strategy, amount);
    }

    /**
     * @dev Execute rebalance with token transfer
     * Simulates moving funds to a strategy on zkEVM
     */
    function executeRebalanceWithTransfer(
        address token,
        address strategy,
        uint256 amount
    ) external onlyOwner {
        require(strategy != address(0), "Invalid strategy");
        require(amount > 0, "Invalid amount");

        bytes32 messageId = keccak256(abi.encodePacked(block.timestamp, strategy, amount));

        // Transfer tokens to strategy
        IERC20(token).safeTransfer(strategy, amount);

        // Record the rebalance
        rebalances[messageId] = Rebalance({
            messageId: messageId,
            amount: amount,
            strategy: strategy,
            timestamp: block.timestamp,
            executed: true
        });

        rebalanceHistory.push(messageId);

        emit RebalanceExecuted(messageId, strategy, amount);
    }

    /**
     * @dev Get total number of rebalances executed
     */
    function getRebalanceCount() external view returns (uint256) {
        return rebalanceHistory.length;
    }

    /**
     * @dev Get rebalance by index
     */
    function getRebalanceByIndex(uint256 index) external view returns (
        bytes32 messageId,
        uint256 amount,
        address strategy,
        uint256 timestamp,
        bool executed
    ) {
        require(index < rebalanceHistory.length, "Index out of bounds");
        bytes32 id = rebalanceHistory[index];
        Rebalance memory r = rebalances[id];
        return (r.messageId, r.amount, r.strategy, r.timestamp, r.executed);
    }

    /**
     * @dev Get all rebalance history
     */
    function getAllRebalances() external view returns (bytes32[] memory) {
        return rebalanceHistory;
    }

    /**
     * @dev Update master vault address
     */
    function setMasterVault(address _masterVault) external onlyOwner {
        require(_masterVault != address(0), "Invalid address");
        masterVault = _masterVault;
    }
}
