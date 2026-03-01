import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNetwork } from "@/lib/network-context";
import { LogOut, Wallet, FlaskConical, Globe, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router";
import { toast } from "sonner";
import { useState } from "react";

export function Navbar() {
  const { isAuthenticated, signOut, address, signIn } = useAuth();
  const { networkMode, setNetworkMode, isMainnet } = useNetwork();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleNetworkToggle = () => {
    const next = networkMode === "testnet" ? "mainnet" : "testnet";
    setNetworkMode(next);
    if (next === "mainnet") {
      toast.warning("Switched to Mainnet mode. Ensure your wallet is on Polygon Mainnet (Chain ID: 137).", { duration: 5000 });
    } else {
      toast.info("Switched to Testnet mode (Polygon Amoy).");
    }
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/vaults", label: "Vaults" },
    { to: "/strategies", label: "Strategies" },
    { to: "/whitepaper", label: "Whitepaper" },
  ];

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-black text-base tracking-tight">
          <img src="/agg.png" alt="AggLayer AI" className="h-8 w-8 object-contain" />
          <span>
            AGGLAYER <span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-sm ${
                  location.pathname === l.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Network toggle */}
          <button
            onClick={handleNetworkToggle}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 border rounded-sm font-mono-data text-[11px] font-semibold transition-all duration-200 cursor-pointer uppercase tracking-wider ${
              isMainnet
                ? "border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                : "border-yellow-500/40 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
            }`}
            title={`Click to switch to ${isMainnet ? "Testnet" : "Mainnet"}`}
          >
            {isMainnet ? <Globe className="h-3 w-3" /> : <FlaskConical className="h-3 w-3" />}
            {isMainnet ? "Mainnet" : "Testnet"}
          </button>

          {isAuthenticated && address ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-border rounded-sm font-mono-data text-xs">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                {formatAddress(address)}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-xs rounded-sm"
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" />
                Disconnect
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="rounded-sm text-xs font-bold tracking-wider uppercase h-8 px-4">
                <Wallet className="mr-1.5 h-3.5 w-3.5" />
                Connect
              </Button>
            </Link>
          )}

          {/* Mobile menu toggle */}
          {isAuthenticated && (
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && isAuthenticated && (
        <div className="md:hidden border-t border-border bg-background">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 text-sm font-medium border-b border-border/50 transition-colors ${
                location.pathname === l.to ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="px-4 py-3">
            <button
              onClick={handleNetworkToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-sm font-mono-data text-[11px] font-semibold uppercase tracking-wider ${
                isMainnet
                  ? "border-green-500/40 bg-green-500/10 text-green-400"
                  : "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
              }`}
            >
              {isMainnet ? <Globe className="h-3 w-3" /> : <FlaskConical className="h-3 w-3" />}
              {isMainnet ? "Mainnet" : "Testnet"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}