// Smart Contract Addresses - DEPLOYED AND VERIFIED
// Deployed on: January 13, 2026
// Network: Polygon Amoy Testnet & zkEVM Cardona

export type NetworkMode = "testnet" | "mainnet";

// Testnet contracts (Polygon Amoy)
export const TESTNET_CONTRACTS = {
  MASTER_VAULT: {
    address: "0x831F6F30cc0Aa68a9541B79c2289BF748DEC4a2a",
    chainId: 80002,
    explorer: "https://amoy.polygonscan.com/address/0x831F6F30cc0Aa68a9541B79c2289BF748DEC4a2a",
  },
  MOCK_USDC: {
    address: "0x2E4D2a90965178C0208927510D62F8aC4fC79321",
    chainId: 80002,
    explorer: "https://amoy.polygonscan.com/address/0x2E4D2a90965178C0208927510D62F8aC4fC79321",
  },
  AAVE_ADAPTER: {
    address: "0x320A2dC1b4a56D13438578e3aC386ed90Ca21D27",
    chainId: 80002,
    explorer: "https://amoy.polygonscan.com/address/0x320A2dC1b4a56D13438578e3aC386ed90Ca21D27",
  },
  POL_VAULT: {
    address: "0xd399F27f84A5928460b8f9f222EBcb4438F716b5",
    chainId: 80002,
    explorer: "https://amoy.polygonscan.com/address/0xd399F27f84A5928460b8f9f222EBcb4438F716b5",
  },
  REBALANCE_EXECUTOR: {
    address: "0xFBbcC8BC3351Db781A3250De99099A03f73C8563",
    chainId: 80002,
    explorer: "https://amoy.polygonscan.com/address/0xFBbcC8BC3351Db781A3250De99099A03f73C8563",
  },
  MOCK_SWAP_ROUTER: {
    address: "",
    chainId: 80002,
    explorer: "https://amoy.polygonscan.com",
  },
  WPOL: {
    address: "0x0ae690aad8663aab12a671a6a0d74242332de85f",
    chainId: 80002,
    explorer: "https://amoy.polygonscan.com/address/0x0ae690aad8663aab12a671a6a0d74242332de85f",
  },
} as const;

// Mainnet contracts (Polygon Mainnet - Chain ID: 137)
export const MAINNET_CONTRACTS = {
  MASTER_VAULT: {
    address: "0x3D1dCb13A9E2AE1a0B87b9aE3C898b3840C68d61",
    chainId: 137,
    explorer: "https://polygonscan.com/address/0x3D1dCb13A9E2AE1a0B87b9aE3C898b3840C68d61",
  },
  MOCK_USDC: {
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    chainId: 137,
    explorer: "https://polygonscan.com/address/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  },
  AAVE_ADAPTER: {
    address: "",
    chainId: 137,
    explorer: "https://polygonscan.com",
  },
  POL_VAULT: {
    address: "0xd8ab58A9E355456A7c977551a3BB1B2eD9e61068",
    chainId: 137,
    explorer: "https://polygonscan.com/address/0xd8ab58A9E355456A7c977551a3BB1B2eD9e61068",
  },
  REBALANCE_EXECUTOR: {
    address: "0x39A80059BB3a9ca1Af6703B069B5fA40Ab78DE04",
    chainId: 137,
    explorer: "https://polygonscan.com/address/0x39A80059BB3a9ca1Af6703B069B5fA40Ab78DE04",
  },
  MOCK_SWAP_ROUTER: {
    address: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
    chainId: 137,
    explorer: "https://polygonscan.com",
  },
  WPOL: {
    address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    chainId: 137,
    explorer: "https://polygonscan.com/address/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  },
} as const;

// Legacy export for backward compatibility (defaults to testnet)
export const CONTRACTS = TESTNET_CONTRACTS;

// Helper to get contracts by network mode
export function getContracts(mode: NetworkMode) {
  return mode === "mainnet" ? MAINNET_CONTRACTS : TESTNET_CONTRACTS;
}

// Complete ABI for MasterVault
export const MASTER_VAULT_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "assets", "type": "uint256" },
      { "internalType": "address", "name": "receiver", "type": "address" }
    ],
    "name": "deposit",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "shares", "type": "uint256" },
      { "internalType": "address", "name": "receiver", "type": "address" },
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "withdraw",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTVL",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalAssets",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "asset",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }],
    "name": "convertToAssets",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "assets", "type": "uint256" }],
    "name": "convertToShares",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// ABI for MockUSDC
export const MOCK_USDC_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "faucet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// ABI for MockSwapRouter
export const MOCK_SWAP_ROUTER_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" },
      { "internalType": "address[]", "name": "path", "type": "address[]" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "swapExactETHForTokens",
    "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }],
    "name": "getAmountOut",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getReserve",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// ABI for POLVault (native POL deposits)
export const POL_VAULT_ABI = [
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }],
    "name": "withdraw",
    "outputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "balanceOfAssets",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "name": "previewDeposit",
    "outputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }],
    "name": "previewWithdraw",
    "outputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalAssets",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalValueLocked",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Keep MATIC_VAULT_ABI as alias for backward compatibility
export const MATIC_VAULT_ABI = POL_VAULT_ABI;

// Real deployment data
export const DEPLOYMENT_INFO = {
  timestamp: "2026-01-13T20:30:00Z",
  deployer: "0xA41Dbf17f2610086e7679348b268B67EF06B7b89",
  network: "Polygon Amoy Testnet",
  transactions: {
    deposit: "0xdc0777d1e85f162932f17cc3bb34f9924ac9a650a44bf50fb3df32146612e403",
    rebalance: "0x968cee2afe6c30bfe9a867c2c8e26f1e6c9fe8ac4fa9a94842ff9a2fcd4fedd4",
    withdraw: "0x4c0be3ae9314243be86638e2bd9a8a1867cddf0e0adf9e09f85cc901ac5f0b99",
    linkExecutor: "0x072c2770d5c62297695a3a36feeafb8c04b16f90f8875efd51c3d7af766fe51a",
  },
  metrics: {
    tvl: "1000.0",
    shares: "0.000000001",
    interestEarned: "0.000007",
  }
} as const;