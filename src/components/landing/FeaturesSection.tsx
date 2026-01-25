import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BrainCircuit, Layers, ShieldCheck, Zap, RefreshCw, Coins } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: RefreshCw,
      title: "Automated Rebalancing",
      description: "RebalanceExecutor manages yield strategies across vaults, automatically allocating funds to MockAaveAdapter for 5% APY generation.",
      bgClass: "bg-primary/10",
      textClass: "text-primary",
      delay: 0,
    },
    {
      icon: Layers,
      title: "Dual Vault Architecture",
      description: "MasterVault (USDC) with ERC-4626 standard + MATICVault for native deposits. Both connected to RebalanceExecutor for yield optimization.",
      bgClass: "bg-blue-500/10",
      textClass: "text-blue-500",
      delay: 0.1,
    },
    {
      icon: BrainCircuit,
      title: "Real-Time On-Chain Data",
      description: "Live TVL tracking from smart contracts using Wagmi hooks. No caching, no simulation - every number comes directly from Polygon blockchain.",
      bgClass: "bg-green-500/10",
      textClass: "text-green-500",
      delay: 0.2,
    },
    {
      icon: Zap,
      title: "5% APY Yield Strategy",
      description: "MockAaveAdapter provides consistent 5% APY on deposited funds. RebalanceExecutor moves assets between idle and yield-generating positions.",
      bgClass: "bg-yellow-500/10",
      textClass: "text-yellow-500",
      delay: 0.3,
    },
    {
      icon: ShieldCheck,
      title: "Complete Transparency",
      description: "All 5 contracts deployed and verified on PolygonScan. Track rebalancing transactions, deposit history, and vault allocations in real-time.",
      bgClass: "bg-purple-500/10",
      textClass: "text-purple-500",
      delay: 0.4,
    },
    {
      icon: Coins,
      title: "Cross-Chain Ready",
      description: "Architecture designed for AggLayer integration. Current deployment on Polygon Amoy demonstrates rebalancing - production will span PoS + zkEVM.",
      bgClass: "bg-red-500/10",
      textClass: "text-red-500",
      delay: 0.5,
    },
  ];

  return (
    <section className="py-20 bg-muted/30 relative" id="features">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Cross-Chain Yield Optimization Platform</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Automated rebalancing architecture with RebalanceExecutor managing yield strategies across dual vaults. Real-time on-chain data and complete transparency.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay, duration: 0.5 }}
              whileHover={{ 
                y: -10, 
                scale: 1.02,
                rotateX: 5,
                rotateY: 5,
                transition: { duration: 0.2 } 
              }}
              style={{ perspective: 1000 }}
            >
              <Card className="bg-background/50 backdrop-blur-md border-primary/10 h-full hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
                <CardContent className="pt-6">
                  <motion.div 
                    className={`h-12 w-12 rounded-lg ${feature.bgClass} flex items-center justify-center mb-4 group-hover:bg-opacity-80 transition-colors`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.textClass}`} />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}