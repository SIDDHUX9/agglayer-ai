import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Terminal, Activity, Cpu } from "lucide-react";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { MAINNET_CONTRACTS } from "@/lib/contracts";

const TICKER_ITEMS = [
  { label: "USDC VAULT APY", value: "5.00%", change: "+0.12%" },
  { label: "POL VAULT TVL", value: "$11.00", change: "LIVE" },
  { label: "REBALANCE EXECUTOR", value: "ACTIVE", change: "ON-CHAIN" },
  { label: "POLYGON MAINNET", value: "CHAIN 137", change: "CONNECTED" },
  { label: "AGGLAYER", value: "INTEGRATED", change: "CROSS-CHAIN" },
  { label: "ERC-4626", value: "STANDARD", change: "COMPLIANT" },
  { label: "MASTER VAULT", value: "DEPLOYED", change: "VERIFIED" },
];

function TickerBar() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="border-y border-primary/20 bg-primary/5 overflow-hidden py-2 relative">
      <div className="flex animate-ticker whitespace-nowrap" style={{ width: "max-content" }}>
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-8 font-mono-data text-xs">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="text-primary font-bold">{item.value}</span>
            <span className="text-green-400 text-[10px]">{item.change}</span>
            <span className="text-border mx-2">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function TerminalBlock() {
  const [lines, setLines] = useState<string[]>([]);
  const allLines = [
    "$ agglayer-yield init --network polygon-mainnet",
    "> Connecting to RPC endpoint...",
    "> Loading MasterVault @ 0x3D1dCb13...",
    "> Loading POLVault @ 0xd8ab58A9...",
    "> RebalanceExecutor @ 0x39A80059...",
    "> Fetching on-chain TVL...",
    "> TVL: $11.00 USDC | APY: 5.00%",
    "> AI yield model: ACTIVE",
    "✓ System ready. Optimizing yields...",
  ];

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < allLines.length) {
        setLines(prev => [...prev, allLines[i]]);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="relative bg-[#050a05] border border-primary/30 rounded-sm overflow-hidden font-mono-data text-xs"
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border-b border-primary/20">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-muted-foreground text-[10px] ml-2 flex items-center gap-1">
          <Terminal className="w-3 h-3" /> agglayer-yield-ai — bash
        </span>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          <span className="text-primary text-[10px]">LIVE</span>
        </div>
      </div>
      {/* Terminal body */}
      <div className="p-4 space-y-1 min-h-[200px]">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={`${
              line?.startsWith("✓") ? "text-primary" :
              line?.startsWith(">") ? "text-muted-foreground" :
              line?.startsWith("$") ? "text-cyan-400" :
              "text-foreground"
            }`}
          >
            {line}
          </motion.div>
        ))}
        {lines.length < allLines.length && (
          <span className="text-primary animate-blink">█</span>
        )}
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 100 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) * 0.05);
    mouseY.set((e.clientY - rect.top - rect.height / 2) * 0.05);
  };

  return (
    <>
      <TickerBar />
      <section
        className="relative min-h-[90vh] flex items-center overflow-hidden scanline-overlay"
        onMouseMove={handleMouseMove}
      >
        {/* Animated grid */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,232,122,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,232,122,0.15) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
        </div>

        {/* Glow orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0,232,122,0.08) 0%, transparent 70%)",
            x: useTransform(x, v => v * 2),
            y: useTransform(y, v => v * 2),
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0,136,255,0.06) 0%, transparent 70%)",
            x: useTransform(x, v => -v * 1.5),
            y: useTransform(y, v => -v * 1.5),
          }}
        />

        <div className="container relative z-10 px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="flex items-center gap-2 px-3 py-1 border border-primary/40 bg-primary/5 rounded-sm font-mono-data text-xs text-primary">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  SYSTEM ONLINE
                </div>
                <div className="flex items-center gap-2 px-3 py-1 border border-border rounded-sm font-mono-data text-xs text-muted-foreground">
                  <Activity className="w-3 h-3" />
                  POLYGON MAINNET
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="font-mono-data text-xs text-muted-foreground mb-3 tracking-widest uppercase">
                  // AggLayer Yield AI v2.0
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.9] mb-6">
                  <span className="block text-foreground">CROSS-CHAIN</span>
                  <span className="block text-foreground">YIELD</span>
                  <span className="block text-glow" style={{ color: "oklch(0.82 0.22 145)" }}>
                    OPTIMIZER
                  </span>
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg font-light">
                  AI-driven rebalancing across Polygon vaults. ERC-4626 compliant USDC vault + native POL vault. 
                  Real-time on-chain data. Zero simulation.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="h-12 px-8 text-sm font-bold tracking-widest uppercase rounded-sm border-0 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:shadow-[0_0_30px_rgba(0,232,122,0.4)]"
                  >
                    Launch App
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/whitepaper">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 text-sm font-bold tracking-widest uppercase rounded-sm border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                  >
                    Read Whitepaper
                  </Button>
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 gap-4 border-t border-border pt-8"
              >
                {[
                  { label: "APY", value: "5.00%", sub: "Current" },
                  { label: "VAULTS", value: "2", sub: "Active" },
                  { label: "CHAINS", value: "2", sub: "Supported" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="font-mono-data text-2xl font-bold text-primary">{s.value}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.sub} {s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Terminal */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ x, y }}
            >
              <TerminalBlock />

              {/* Contract addresses card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-4 border border-border bg-card rounded-sm p-4 font-mono-data text-xs"
              >
                <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                  <Cpu className="w-3 h-3" />
                  <span className="uppercase tracking-wider text-[10px]">Deployed Contracts — Mainnet</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { name: "MasterVault", addr: MAINNET_CONTRACTS.MASTER_VAULT.address },
                    { name: "POLVault", addr: MAINNET_CONTRACTS.POL_VAULT.address },
                    { name: "RebalanceExec", addr: MAINNET_CONTRACTS.REBALANCE_EXECUTOR.address },
                  ].map((c, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-muted-foreground">{c.name}</span>
                      <span className="text-primary">{c.addr.slice(0, 10)}...{c.addr.slice(-6)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}