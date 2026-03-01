import { Link } from "react-router";
import { ExternalLink } from "lucide-react";
import { MAINNET_CONTRACTS, TESTNET_CONTRACTS } from "@/lib/contracts";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card relative">
      {/* Top section */}
      <div className="container px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src="/agg.png" alt="AggLayer AI" className="h-8 w-8 object-contain" />
              <span className="font-black text-lg tracking-tight">
                AGGLAYER <span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-xs">
              AI-driven cross-chain yield aggregator for Polygon. ERC-4626 compliant vaults with automated rebalancing.
            </p>
            <div className="flex items-center gap-2 font-mono-data text-xs text-primary">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              LIVE ON POLYGON
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-mono-data text-xs text-muted-foreground uppercase tracking-widest mb-4">Product</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Dashboard", to: "/dashboard" },
                { label: "Vaults", to: "/vaults" },
                { label: "Strategies", to: "/strategies" },
                { label: "Whitepaper", to: "/whitepaper" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mainnet Contracts */}
          <div>
            <h3 className="font-mono-data text-xs text-muted-foreground uppercase tracking-widest mb-4">
              Mainnet <span className="text-green-400">(137)</span>
            </h3>
            <ul className="space-y-2.5 text-xs font-mono-data">
              {[
                { name: "MasterVault", link: MAINNET_CONTRACTS.MASTER_VAULT.explorer },
                { name: "POLVault", link: MAINNET_CONTRACTS.POL_VAULT.explorer },
                { name: "RebalanceExec", link: MAINNET_CONTRACTS.REBALANCE_EXECUTOR.explorer },
              ].map((c) => (
                <li key={c.name}>
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {c.name}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Testnet Contracts */}
          <div>
            <h3 className="font-mono-data text-xs text-muted-foreground uppercase tracking-widest mb-4">
              Testnet <span className="text-yellow-400">(80002)</span>
            </h3>
            <ul className="space-y-2.5 text-xs font-mono-data">
              {[
                { name: "MasterVault", link: TESTNET_CONTRACTS.MASTER_VAULT.explorer },
                { name: "POLVault", link: TESTNET_CONTRACTS.POL_VAULT.explorer },
                { name: "RebalanceExec", link: TESTNET_CONTRACTS.REBALANCE_EXECUTOR.explorer },
              ].map((c) => (
                <li key={c.name}>
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-yellow-400 transition-colors flex items-center gap-1"
                  >
                    {c.name}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-mono-data text-xs text-muted-foreground">
            © 2025 AggLayer Yield AI — All rights reserved
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground font-mono-data">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Twitter</a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Discord</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}