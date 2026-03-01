"use node";
import { httpAction } from "./_generated/server";
import * as fs from "fs";
import * as path from "path";
// @ts-ignore
import JSZip from "jszip";

const FILES_TO_INCLUDE = [
  // Root config files
  "package.json",
  "tsconfig.json",
  "tsconfig.app.json",
  "tsconfig.node.json",
  "vite.config.ts",
  "index.html",
  "components.json",
  "README.md",
  "ARCHITECTURE.md",
  "WAVE6.md",
  // Source files
  "src/main.tsx",
  "src/index.css",
  "src/vite-env.d.ts",
  "src/types/global.d.ts",
  "src/instrumentation.tsx",
  // Pages
  "src/pages/Landing.tsx",
  "src/pages/Auth.tsx",
  "src/pages/Dashboard.tsx",
  "src/pages/Vaults.tsx",
  "src/pages/Strategies.tsx",
  "src/pages/Whitepaper.tsx",
  "src/pages/Download.tsx",
  "src/pages/DeployGuide.tsx",
  "src/pages/NotFound.tsx",
  // Components
  "src/components/Navbar.tsx",
  "src/components/DepositDialog.tsx",
  "src/components/DepositHistory.tsx",
  "src/components/LiveActivityFeed.tsx",
  "src/components/LogoDropdown.tsx",
  // Landing components
  "src/components/landing/HeroSection.tsx",
  "src/components/landing/FeaturesSection.tsx",
  "src/components/landing/HowItWorksSection.tsx",
  "src/components/landing/StatsSection.tsx",
  "src/components/landing/WhyUsSection.tsx",
  "src/components/landing/PolygonSection.tsx",
  "src/components/landing/CTASection.tsx",
  "src/components/landing/Footer.tsx",
  // Deploy guide components
  "src/components/deploy-guide/ContractsSection.tsx",
  "src/components/deploy-guide/DeploySection.tsx",
  "src/components/deploy-guide/DeployShared.tsx",
  "src/components/deploy-guide/SetupSection.tsx",
  "src/components/deploy-guide/UpdateConfigSection.tsx",
  "src/components/deploy-guide/VerifySection.tsx",
  // Convex backend
  "src/convex/schema.ts",
  "src/convex/vaults.ts",
  "src/convex/ai.ts",
  "src/convex/users.ts",
  "src/convex/http.ts",
  "src/convex/auth.config.ts",
  "src/convex/auth.ts",
  "src/convex/auth/emailOtp.ts",
  // Lib
  "src/lib/contracts.ts",
  "src/lib/web3-config.ts",
  "src/lib/network-context.tsx",
  "src/lib/utils.ts",
  "src/lib/vly-integrations.ts",
  // Hooks
  "src/hooks/use-auth.ts",
  "src/hooks/use-vault-data.ts",
  "src/hooks/use-mobile.ts",
  // Contracts
  "src/contracts/MasterVault.sol",
  "src/contracts/RebalanceExecutor.sol",
  // AI
  "src/ai/model.py",
];

export const downloadZip = httpAction(async (_ctx, _req) => {
  // Find the project root (two levels up from convex/)
  const convexDir = __dirname;
  const projectRoot = path.resolve(convexDir, "..", "..");

  const zip = new JSZip();
  const folder = zip.folder("agglayer-yield-ai");

  for (const relPath of FILES_TO_INCLUDE) {
    const absPath = path.join(projectRoot, relPath);
    try {
      if (fs.existsSync(absPath)) {
        const content = fs.readFileSync(absPath);
        folder!.file(relPath, content);
      }
    } catch {
      // skip files that can't be read
    }
  }

  // Add a setup guide
  folder!.file(
    "SETUP.md",
    `# AggLayer Yield AI — Local Setup

## Prerequisites
- Node.js 18+
- pnpm (npm i -g pnpm)
- MetaMask or compatible wallet

## Steps

1. Install dependencies:
   pnpm install

2. Copy env file:
   cp .env.example .env.local
   # Edit .env.local with your keys

3. Start Convex backend (separate terminal):
   npx convex dev

4. Start frontend:
   pnpm dev
   # App runs at http://localhost:5173

## Environment Variables
- VITE_CONVEX_URL: From convex.dev dashboard
- VITE_WALLETCONNECT_PROJECT_ID: From cloud.walletconnect.com

## Deployed Contracts
### Polygon Mainnet (137)
- MasterVault: 0x3D1dCb13A9E2AE1a0B87b9aE3C898b3840C68d61
- POLVault: 0xd8ab58A9E355456A7c977551a3BB1B2eD9e61068
- RebalanceExecutor: 0x39A80059BB3a9ca1Af6703B069B5fA40Ab78DE04

### Polygon Amoy Testnet (80002)
- MasterVault: 0x831F6F30cc0Aa68a9541B79c2289BF748DEC4a2a
- MockUSDC: 0x2E4D2a90965178C0208927510D62F8aC4fC79321
- POLVault: 0xd399F27f84A5928460b8f9f222EBcb4438F716b5
- RebalanceExecutor: 0xFBbcC8BC3351Db781A3250De99099A03f73C8563
`
  );

  const zipBuffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  return new Response(zipBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="agglayer-yield-ai.zip"',
      "Access-Control-Allow-Origin": "*",
    },
  });
});
