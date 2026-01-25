import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Layers, Box, Hexagon, Network } from "lucide-react";

export function PolygonSection() {
  const techs = [
    {
      name: "MATIC Vault",
      desc: "Native Deposits",
      icon: Hexagon,
      color: "text-purple-500"
    },
    {
      name: "USDC Vault",
      desc: "ERC-4626 Standard",
      icon: Box,
      color: "text-purple-400"
    },
    {
      name: "Real-Time TVL",
      desc: "On-Chain Data",
      icon: Layers,
      color: "text-indigo-400"
    },
    {
      name: "Full History",
      desc: "Every Transaction",
      icon: Network,
      color: "text-blue-400"
    }
  ];

  return (
    <section className="py-20 bg-black/20 border-y border-white/5">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Built on Polygon</h2>
              <p className="text-muted-foreground">
                Production-ready vaults deployed on Polygon with real-time data directly from smart contracts.
              </p>
            </motion.div>
          </div>
          
          <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-4">
            {techs.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-white/5 border-white/5 hover:bg-white/10 transition-colors text-center h-full">
                  <CardContent className="pt-6 flex flex-col items-center justify-center h-full">
                    <tech.icon className={`h-8 w-8 ${tech.color} mb-3`} />
                    <h3 className="font-bold text-sm">{tech.name}</h3>
                    <p className="text-xs text-muted-foreground">{tech.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
