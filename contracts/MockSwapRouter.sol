// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title MockSwapRouter
 * @notice Simple swap router for testnet demonstration
 * @dev Simulates MATIC → USDC swap with fixed 1:1 rate for buildathon demo
 *
 * WARNING: This is a TESTNET-ONLY contract for demonstration purposes.
 * For mainnet, use QuickSwap at 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff
 */
contract MockSwapRouter {
    IERC20 public immutable usdc;

    // Events
    event Swap(
        address indexed user,
        uint256 maticIn,
        uint256 usdcOut,
        address indexed recipient
    );

    constructor(address _usdc) {
        require(_usdc != address(0), "Invalid USDC address");
        usdc = IERC20(_usdc);
    }

    /**
     * @notice Simulates swapping MATIC for USDC
     * @dev Fixed rate: 1 MATIC = 1 USDC (simplified for testnet)
     * @param amountOutMin Minimum amount of USDC to receive
     * @param path [WMATIC, USDC] (ignored in mock, here for API compatibility)
     * @param to Recipient address
     * @param deadline Transaction deadline (ignored in mock)
     */
    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts) {
        require(msg.value > 0, "Must send MATIC");
        require(to != address(0), "Invalid recipient");
        require(block.timestamp <= deadline, "Transaction expired");

        // Calculate USDC output (1:1 rate for demo)
        // MATIC has 18 decimals, USDC has 6 decimals
        // 1 MATIC (1e18) = 1 USDC (1e6)
        uint256 usdcAmount = msg.value / 1e12; // Convert 18 decimals to 6 decimals

        require(usdcAmount >= amountOutMin, "Insufficient output amount");
        require(usdc.balanceOf(address(this)) >= usdcAmount, "Insufficient USDC liquidity");

        // Transfer USDC to recipient
        require(usdc.transfer(to, usdcAmount), "USDC transfer failed");

        emit Swap(msg.sender, msg.value, usdcAmount, to);

        // Return amounts array for compatibility with real DEX interface
        amounts = new uint256[](2);
        amounts[0] = msg.value;
        amounts[1] = usdcAmount;

        return amounts;
    }

    /**
     * @notice Get expected output amount for given input
     * @param amountIn Amount of MATIC to swap
     */
    function getAmountOut(uint256 amountIn) external pure returns (uint256) {
        return amountIn / 1e12; // 1:1 rate, adjusted for decimals
    }

    /**
     * @notice Withdraw USDC (owner only - for refilling liquidity)
     */
    function withdraw(uint256 amount) external {
        require(usdc.transfer(msg.sender, amount), "Withdrawal failed");
    }

    /**
     * @notice Check available USDC liquidity
     */
    function getReserve() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }

    /**
     * @notice Accept MATIC deposits for liquidity
     */
    receive() external payable {}
}
