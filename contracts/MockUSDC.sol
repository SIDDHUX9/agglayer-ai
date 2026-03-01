// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @dev Mock USDC token for testing on testnets
 */
contract MockUSDC is ERC20, Ownable {
    constructor() ERC20("Mock USDC", "mUSDC") Ownable(msg.sender) {
        // Mint 1 million tokens to deployer for testing
        _mint(msg.sender, 1_000_000 * 10**decimals());
    }

    function decimals() public pure override returns (uint8) {
        return 6; // USDC has 6 decimals
    }

    // Allow anyone to mint tokens for testing
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    // Faucet function - anyone can get 1000 USDC for testing
    function faucet() external {
        _mint(msg.sender, 1000 * 10**decimals());
    }
}
