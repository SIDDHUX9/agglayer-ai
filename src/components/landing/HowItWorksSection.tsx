import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function HowItWorksSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple, transparent deposits with real-time tracking and complete transaction history.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Connect", desc: "Connect your wallet and choose between MATIC or USDC vault." },
            { step: "02", title: "Deposit", desc: "Deposit assets with instant confirmation and real-time balance updates." },
            { step: "03", title: "Track", desc: "View complete deposit history with timestamps and transaction links." },
            { step: "04", title: "Monitor", desc: "Watch your vault shares grow with live TVL data from smart contracts." }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className="text-6xl font-bold text-primary/5 mb-4 absolute -top-8 -left-4 select-none">
                {item.step}
              </div>
              <Card className="bg-background/50 backdrop-blur border-primary/10 h-full relative z-10 hover:border-primary/30 transition-colors hover:bg-background/60">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
              {i < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t border-dashed border-primary/30 transform -translate-y-1/2 z-0" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
