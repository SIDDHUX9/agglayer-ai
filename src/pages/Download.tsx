import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  ExternalLink,
  Loader2,
  Terminal,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { toast } from "sonner";

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group">
      {label && (
        <div className="text-[10px] font-mono text-muted-foreground mb-1 uppercase tracking-wider">
          {label}
        </div>
      )}
      <div className="bg-[#050a05] border border-primary/20 rounded-sm p-3 font-mono text-xs text-green-400 flex items-start justify-between gap-2">
        <pre className="whitespace-pre-wrap break-all flex-1">{code}</pre>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors mt-0.5"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

export default function DownloadPage() {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const convexUrl = import.meta.env.VITE_CONVEX_URL as string;
      // Convert https://xxx.convex.cloud to https://xxx.convex.site
      const siteUrl = convexUrl.replace(".convex.cloud", ".convex.site");
      const response = await fetch(`${siteUrl}/download-source`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "agglayer-yield-ai.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("ZIP downloaded! Extract and follow SETUP.md to run locally.");
    } catch (err) {
      console.error(err);
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const setupSteps = [
    {
      step: "01",
      title: "Extract ZIP",
      commands: ["unzip agglayer-yield-ai.zip", "cd agglayer-yield-ai"],
    },
    {
      step: "02",
      title: "Install Dependencies",
      commands: ["pnpm install"],
      note: "Requires Node.js 18+ and pnpm. Install pnpm: npm i -g pnpm",
    },
    {
      step: "03",
      title: "Set Up Environment",
      commands: ["cp .env.example .env.local", "# Edit .env.local with your keys"],
      note: "Get Convex URL at convex.dev and WalletConnect ID at cloud.walletconnect.com",
    },
    {
      step: "04",
      title: "Start Convex Backend",
      commands: ["npx convex dev"],
      note: "Run in a separate terminal. Starts the Convex dev server and pushes schema.",
    },
    {
      step: "05",
      title: "Start Frontend",
      commands: ["pnpm dev"],
      note: "App runs at http://localhost:5173",
    },
  ];

  const included = [
    "React + Vite frontend",
    "Convex backend functions",
    "Solidity smart contracts",
    "Wagmi / Viem Web3 hooks",
    "ERC-4626 MasterVault",
    "POLVault (native POL)",
    "RebalanceExecutor",
    "AI yield model (Python)",
    "All UI components",
    "Full documentation",
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/5 rounded-sm font-mono text-xs text-primary mb-4">
            <Terminal className="h-3 w-3" />
            LOCAL SETUP GUIDE
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            RUN <span className="text-primary">LOCALLY</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Download the full source code and run the complete stack on your machine
          </p>
        </div>

        {/* Security Warning */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-sm bg-red-500/10 border border-red-500/30 mb-6"
        >
          <div className="flex items-center gap-2 text-red-400 font-semibold text-sm mb-1">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            Critical Security Notice
          </div>
          <p className="text-xs text-red-300/80 leading-relaxed">
            Never commit{" "}
            <code className="bg-red-900/30 px-1 rounded">.env</code> or{" "}
            <code className="bg-red-900/30 px-1 rounded">.env.local</code> files
            to git. If a private key is ever exposed, immediately transfer all
            funds and rotate the key.
          </p>
        </motion.div>

        {/* Primary Download Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <Button
            onClick={handleDownloadZip}
            disabled={downloading}
            className="w-full h-14 text-sm font-bold tracking-widest uppercase rounded-sm gap-2 hover:shadow-[0_0_30px_rgba(0,232,122,0.3)] transition-all"
            size="lg"
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Building ZIP...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" /> Download Full Source Code (.zip)
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2 font-mono">
            All source files · contracts · schema · hooks · config · components
          </p>
        </motion.div>

        {/* Setup Steps */}
        <div className="space-y-4 mb-8">
          <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Setup Steps
          </h2>
          {setupSteps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="border border-border bg-card rounded-sm p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs text-primary font-bold">
                  {s.step}
                </span>
                <span className="text-sm font-semibold">{s.title}</span>
              </div>
              <div className="space-y-2">
                {s.commands.map((cmd, j) => (
                  <CodeBlock key={j} code={cmd} />
                ))}
              </div>
              {s.note && (
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {s.note}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Env vars */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="border border-border bg-card rounded-sm p-4 mb-8"
        >
          <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">
            Required Environment Variables (.env.local)
          </h2>
          <CodeBlock
            code={`VITE_CONVEX_URL=https://your-project.convex.cloud\nVITE_WALLETCONNECT_PROJECT_ID=your_project_id`}
          />
          <div className="mt-3 space-y-1">
            {[
              {
                key: "VITE_CONVEX_URL",
                desc: "From your Convex dashboard at convex.dev",
              },
              {
                key: "VITE_WALLETCONNECT_PROJECT_ID",
                desc: "Free at cloud.walletconnect.com",
              },
            ].map((v) => (
              <div key={v.key} className="flex items-start gap-2 text-xs">
                <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>
                  <span className="font-mono text-primary">{v.key}</span> —{" "}
                  {v.desc}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What's included */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="border border-border bg-card rounded-sm p-4 mb-8"
        >
          <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">
            What's Included
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {included.map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs">
                <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
          <Link
            to="/deploy-guide"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            View Deployment Guide
            <ExternalLink className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}