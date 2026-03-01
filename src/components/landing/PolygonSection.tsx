import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { TESTNET_CONTRACTS, MAINNET_CONTRACTS } from "@/lib/contracts";

export function PolygonSection() {
  const mainnetContracts = [
    { name: "MasterVault", addr: MAINNET_CONTRACTS.MASTER_VAULT.address, link: MAINNET_CONTRACTS.MASTER_VAULT.explorer },
    { name: "POLVault", addr: MAINNET_CONTRACTS.POL_VAULT.address, link: MAINNET_CONTRACTS.POL_VAULT.explorer },
    { name: "RebalanceExecutor", addr: MAINNET_CONTRACTS.REBALANCE_EXECUTOR.address, link: MAINNET_CONTRACTS.REBALANCE_EXECUTOR.explorer },
    { name: "USDC (PoS)", addr: MAINNET_CONTRACTS.MOCK_USDC.address, link: MAINNET_CONTRACTS.MOCK_USDC.explorer },
  ];

  const testnetContracts = [
    { name: "MasterVault", addr: TESTNET_CONTRACTS.MASTER_VAULT.address, link: TESTNET_CONTRACTS.MASTER_VAULT.explorer },
    { name: "POLVault", addr: TESTNET_CONTRACTS.POL_VAULT.address, link: TESTNET_CONTRACTS.POL_VAULT.explorer },
    { name: "RebalanceExecutor", addr: TESTNET_CONTRACTS.REBALANCE_EXECUTOR.address, link: TESTNET_CONTRACTS.REBALANCE_EXECUTOR.explorer },
    { name: "MockUSDC", addr: TESTNET_CONTRACTS.MOCK_USDC.address, link: TESTNET_CONTRACTS.MOCK_USDC.explorer },
  ];

  return (
    <section className="py-24 relative border-y border-border">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-border" />
            <span className="font-mono-data text-xs text-muted-foreground tracking-widest uppercase">
              01 / Contracts
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            DEPLOYED &
            <br />
            <span className="text-primary">VERIFIED</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-px bg-border">
          {/* Mainnet */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-background p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-sm">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="font-mono-data text-xs text-green-400 uppercase tracking-wider">Mainnet</span>
              </div>
              <span className="font-mono-data text-xs text-muted-foreground">Chain ID: 137</span>
            </div>
            <div className="space-y-3">
              {mainnetContracts.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between p-3 border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <div>
                    <div className="text-xs font-medium mb-0.5">{c.name}</div>
                    <div className="font-mono-data text-[11px] text-muted-foreground">
                      {c.addr.slice(0, 10)}...{c.addr.slice(-8)}
                    </div>
                  </div>
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-primary"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testnet */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-background p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-sm">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                <span className="font-mono-data text-xs text-yellow-400 uppercase tracking-wider">Testnet</span>
              </div>
              <span className="font-mono-data text-xs text-muted-foreground">Polygon Amoy — Chain ID: 80002</span>
            </div>
            <div className="space-y-3">
              {testnetContracts.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between p-3 border border-border hover:border-yellow-400/30 hover:bg-yellow-400/5 transition-all group"
                >
                  <div>
                    <div className="text-xs font-medium mb-0.5">{c.name}</div>
                    <div className="font-mono-data text-[11px] text-muted-foreground">
                      {c.addr.slice(0, 10)}...{c.addr.slice(-8)}
                    </div>
                  </div>
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-yellow-400"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}