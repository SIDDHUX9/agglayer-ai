import { motion } from "framer-motion";
import { useVaultTVL } from "@/hooks/use-vault-data";
import { CONTRACTS, DEPLOYMENT_INFO } from "@/lib/contracts";
import { ExternalLink } from "lucide-react";

export function StatsSection() {
  const { tvl, isLoading } = useVaultTVL();

  const stats = [
    {
      value: isLoading ? "Loading..." : `$${parseFloat(tvl).toLocaleString()}`,
      label: "Total Value Locked",
      isLive: true,
      link: CONTRACTS.MASTER_VAULT.explorer,
      delay: 0
    },
    { value: "5.0%", label: "Current APY", delay: 0.1 },
    { value: "2", label: "Chains Supported", subtext: "Polygon PoS + zkEVM", delay: 0.2 },
    { value: "3", label: "Transactions", subtext: "Deposit, Rebalance, Withdraw", delay: 0.3 },
  ];

  return (
    <section className="py-20 bg-secondary/20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Real-Time On-Chain Metrics</h2>
          <p className="text-muted-foreground">
            All data pulled directly from deployed smart contracts on Polygon - updated in real-time
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-4 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: stat.delay, duration: 0.5, type: "spring" }}
              whileHover={{ scale: 1.05 }}
              className="relative p-6 rounded-2xl bg-background/50 backdrop-blur border border-border"
            >
              {stat.isLive && (
                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-1 text-xs text-green-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    LIVE
                  </span>
                </div>
              )}

              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                {stat.label}
              </div>

              {stat.subtext && (
                <div className="text-xs text-muted-foreground/70">{stat.subtext}</div>
              )}

              {stat.link && (
                <a
                  href={stat.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                >
                  View on Explorer
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col gap-2 p-4 rounded-xl bg-background/50 backdrop-blur border border-border">
            <p className="text-sm font-medium">Recent Transactions</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <a
                href={`https://amoy.polygonscan.com/tx/${DEPLOYMENT_INFO.transactions.deposit}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
              >
                Deposit ↓
              </a>
              <a
                href={`https://amoy.polygonscan.com/tx/${DEPLOYMENT_INFO.transactions.rebalance}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
              >
                Rebalance ⟳
              </a>
              <a
                href={`https://amoy.polygonscan.com/tx/${DEPLOYMENT_INFO.transactions.withdraw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-colors"
              >
                Withdraw ↑
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
