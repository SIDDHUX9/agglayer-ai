const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Real USDC on Polygon Mainnet
  const REAL_USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  
  // AggLayer Bridge address (use zero address as placeholder until AggLayer mainnet is live)
  const AGG_LAYER_BRIDGE = "0x0000000000000000000000000000000000000000";

  console.log("\n--- Deploying MasterVault ---");
  const MasterVault = await ethers.getContractFactory("MasterVault");
  const masterVault = await MasterVault.deploy(REAL_USDC, AGG_LAYER_BRIDGE);
  await masterVault.waitForDeployment();
  const masterVaultAddress = await masterVault.getAddress();
  console.log("MasterVault deployed to:", masterVaultAddress);

  console.log("\n--- Deploying RebalanceExecutor ---");
  const RebalanceExecutor = await ethers.getContractFactory("RebalanceExecutor");
  const rebalanceExecutor = await RebalanceExecutor.deploy(masterVaultAddress);
  await rebalanceExecutor.waitForDeployment();
  const rebalanceExecutorAddress = await rebalanceExecutor.getAddress();
  console.log("RebalanceExecutor deployed to:", rebalanceExecutorAddress);

  console.log("\n--- Granting REBALANCER_ROLE to RebalanceExecutor ---");
  const REBALANCER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("REBALANCER_ROLE"));
  const tx = await masterVault.grantRole(REBALANCER_ROLE, rebalanceExecutorAddress);
  await tx.wait();
  console.log("REBALANCER_ROLE granted.");

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log("MasterVault:        ", masterVaultAddress);
  console.log("RebalanceExecutor:  ", rebalanceExecutorAddress);
  console.log("\nUpdate src/lib/contracts.ts MAINNET_CONTRACTS with these addresses!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
