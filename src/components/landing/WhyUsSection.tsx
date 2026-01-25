import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Shield, Zap, Globe, Lock, TrendingUp, Cpu } from "lucide-react";

export function WhyUsSection() {
  const reasons = [
    {
      icon: Shield,
      title: "Production-Ready Vaults",
      description: "Deployed smart contracts on Polygon with ERC-4626 standard and non-reentrant security.",
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      icon: Cpu,
      title: "Real-Time Updates",
      description: "All TVL and balance data pulled directly from blockchain with zero delay or caching.",
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      icon: TrendingUp,
      title: "Dual Asset Support",
      description: "Choose native MATIC deposits (1 tx) or USDC deposits (ERC-20 standard). Both fully tracked.",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: Lock,
      title: "Complete Transparency",
      description: "Every deposit recorded with timestamp, tx hash, and direct PolygonScan verification links.",
      color: "text-yellow-500",
      bg: "bg-yellow-500/10"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 -z-10" />
      
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose AggLayer AI?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We combine cutting-edge technology with user-centric design to deliver the best yield aggregation experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full bg-background/40 backdrop-blur-sm border-white/5 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className={`h-14 w-14 rounded-2xl ${item.bg} flex items-center justify-center mb-6 transform rotate-3 transition-transform group-hover:rotate-6`}>
                    <item.icon className={`h-7 w-7 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
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
