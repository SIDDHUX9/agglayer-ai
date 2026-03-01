import { motion } from "framer-motion";
import { useVaultTVL } from "@/hooks/use-vault-data";
import { TESTNET_CONTRACTS, MAINNET_CONTRACTS, DEPLOYMENT_INFO } from "@/lib/contracts";
import { ExternalLink, TrendingUp, Database, GitBranch, Activity } from "lucide-react";

export function StatsSection() {
  const { tvl, isLoading } = useVaultTVL();

  const metrics = [
    {
      icon: Database,
      label: "Total Value Locked",
      value: isLoading ? "—" : `$${parseFloat(tvl).toLocaleString()}`,
      sub: "Live from chain",
      isLive: true,
      link: MAINNET_CONTRACTS.MASTER_VAULT.explorer,
      accent: "text-primary",
      border: "border-primary/20",
    },
    {
      icon: TrendingUp,
      label: "Current APY",
      value: "5.00%",
      sub: "MockAaveAdapter",
      accent: "text-blue-400",
      border: "border-blue-400/20",
    },
    {
      icon: GitBranch,
      label: "Chains Supported",
      value: "2",
      sub: "Polygon PoS + zkEVM",
      accent: "text-cyan-400",
      border: "border-cyan-400/20",
    },
    {
      icon: Activity,
      label: "Transactions",
      value: "3",
      sub: "Deposit · Rebalance · Withdraw",
      accent: "text-purple-400",
      border: "border-purple-400/20",
    },
  ];

  return (
    <section className="py-24 relative">
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
              04 / Metrics
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            REAL-TIME
            <br />
            <span className="text-primary">ON-CHAIN DATA</span>
          </h2>
        </motion.div>

        {/* Metrics grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border mb-px">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background p-8 group hover:bg-card transition-colors"
            >
              <div className="flex items-center justify-between mb-6">
                <m.icon className={`h-5 w-5 ${m.accent}`} />
                {m.isLive && (
                  <span className="flex items-center gap-1 font-mono-data text-[10px] text-primary">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>
              <div className={`font-mono-data text-4xl font-bold ${m.accent} mb-2`}>{m.value}</div>
              <div className="text-sm font-medium mb-1">{m.label}</div>
              <div className="text-xs text-muted-foreground">{m.sub}</div>
              {m.link && (
                <a
                  href={m.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-3"
                >
                  View on Explorer <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </motion.div>
          ))}
        </div>

        {/* Transaction links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border p-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="font-mono-data text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Recent On-Chain Transactions
              </div>
              <div className="text-sm text-muted-foreground">Polygon Amoy Testnet — Verified</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "DEPOSIT", hash: DEPLOYMENT_INFO.transactions.deposit, color: "text-primary border-primary/30 bg-primary/5" },
                { label: "REBALANCE", hash: DEPLOYMENT_INFO.transactions.rebalance, color: "text-blue-400 border-blue-400/30 bg-blue-400/5" },
                { label: "WITHDRAW", hash: DEPLOYMENT_INFO.transactions.withdraw, color: "text-orange-400 border-orange-400/30 bg-orange-400/5" },
              ].map((tx, i) => (
                <a
                  key={i}
                  href={`https://amoy.polygonscan.com/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded-sm font-mono-data text-xs hover:opacity-80 transition-opacity ${tx.color}`}
                >
                  {tx.label}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}