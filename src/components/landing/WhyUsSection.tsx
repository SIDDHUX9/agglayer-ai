import { motion } from "framer-motion";
import { Shield, Cpu, TrendingUp, Lock } from "lucide-react";

const reasons = [
  {
    icon: Shield,
    title: "Production-Ready Vaults",
    description: "Deployed smart contracts on Polygon with ERC-4626 standard and non-reentrant security.",
    accent: "text-primary",
    tag: "SECURITY",
  },
  {
    icon: Cpu,
    title: "Real-Time Updates",
    description: "All TVL and balance data pulled directly from blockchain with zero delay or caching.",
    accent: "text-blue-400",
    tag: "PERFORMANCE",
  },
  {
    icon: TrendingUp,
    title: "Dual Asset Support",
    description: "Choose native POL deposits (1 tx) or USDC deposits (ERC-20 standard). Both fully tracked.",
    accent: "text-cyan-400",
    tag: "FLEXIBILITY",
  },
  {
    icon: Lock,
    title: "Complete Transparency",
    description: "Every deposit recorded with timestamp, tx hash, and direct PolygonScan verification links.",
    accent: "text-yellow-400",
    tag: "TRUST",
  },
];

export function WhyUsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-border" />
            <span className="font-mono-data text-xs text-muted-foreground tracking-widest uppercase">
              05 / Why Us
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid md:grid-cols-2 gap-4 items-end">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              WHY CHOOSE
              <br />
              <span className="text-primary">AGGLAYER AI?</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We combine cutting-edge technology with user-centric design to deliver the best yield aggregation experience on Polygon.
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-px bg-border">
          {reasons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background p-10 group hover:bg-card transition-colors flex gap-6"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 border border-border group-hover:border-primary/30 transition-colors flex items-center justify-center">
                  <item.icon className={`h-5 w-5 ${item.accent}`} />
                </div>
              </div>
              <div>
                <div className={`font-mono-data text-[10px] tracking-widest ${item.accent} mb-2 uppercase`}>
                  {item.tag}
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}