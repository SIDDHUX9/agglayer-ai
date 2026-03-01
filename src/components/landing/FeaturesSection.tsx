import { motion } from "framer-motion";
import { RefreshCw, Layers, BrainCircuit, Zap, ShieldCheck, Coins } from "lucide-react";

const features = [
  {
    icon: RefreshCw,
    tag: "CORE",
    title: "Automated Rebalancing",
    description: "RebalanceExecutor manages yield strategies across vaults, automatically allocating funds to MockAaveAdapter for 5% APY generation.",
    accent: "text-primary",
    border: "border-primary/20",
    bg: "bg-primary/5",
  },
  {
    icon: Layers,
    tag: "ARCHITECTURE",
    title: "Dual Vault System",
    description: "MasterVault (USDC) with ERC-4626 standard + POLVault for native deposits. Both connected to RebalanceExecutor for yield optimization.",
    accent: "text-blue-400",
    border: "border-blue-400/20",
    bg: "bg-blue-400/5",
  },
  {
    icon: BrainCircuit,
    tag: "AI",
    title: "Real-Time On-Chain Data",
    description: "Live TVL tracking from smart contracts using Wagmi hooks. No caching, no simulation — every number comes directly from Polygon blockchain.",
    accent: "text-cyan-400",
    border: "border-cyan-400/20",
    bg: "bg-cyan-400/5",
  },
  {
    icon: Zap,
    tag: "YIELD",
    title: "5% APY Strategy",
    description: "MockAaveAdapter provides consistent 5% APY on deposited funds. RebalanceExecutor moves assets between idle and yield-generating positions.",
    accent: "text-yellow-400",
    border: "border-yellow-400/20",
    bg: "bg-yellow-400/5",
  },
  {
    icon: ShieldCheck,
    tag: "SECURITY",
    title: "Complete Transparency",
    description: "All 5 contracts deployed and verified on PolygonScan. Track rebalancing transactions, deposit history, and vault allocations in real-time.",
    accent: "text-purple-400",
    border: "border-purple-400/20",
    bg: "bg-purple-400/5",
  },
  {
    icon: Coins,
    tag: "CROSS-CHAIN",
    title: "AggLayer Ready",
    description: "Architecture designed for AggLayer integration. Current deployment on Polygon demonstrates rebalancing — production spans PoS + zkEVM.",
    accent: "text-orange-400",
    border: "border-orange-400/20",
    bg: "bg-orange-400/5",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative" id="features">
      {/* Section label */}
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-border" />
            <span className="font-mono-data text-xs text-muted-foreground tracking-widest uppercase">
              02 / Features
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid md:grid-cols-2 gap-4 items-end">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              YIELD OPTIMIZATION
              <br />
              <span className="text-primary">INFRASTRUCTURE</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Automated rebalancing architecture with RebalanceExecutor managing yield strategies across dual vaults. Real-time on-chain data and complete transparency.
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-background p-8 group hover:bg-card transition-colors duration-300 relative overflow-hidden"
            >
              {/* Hover accent line */}
              <div className={`absolute top-0 left-0 right-0 h-px ${feature.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                style={{ background: `linear-gradient(90deg, transparent, currentColor, transparent)` }}
              />
              
              <div className="flex items-start justify-between mb-6">
                <div className={`p-2.5 rounded-sm ${feature.bg} ${feature.border} border`}>
                  <feature.icon className={`h-5 w-5 ${feature.accent}`} />
                </div>
                <span className={`font-mono-data text-[10px] tracking-widest ${feature.accent} opacity-60`}>
                  {feature.tag}
                </span>
              </div>
              
              <h3 className="text-lg font-bold mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>

              {/* Bottom accent */}
              <div className={`absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-500 ${feature.accent}`}
                style={{ background: "currentColor", opacity: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}