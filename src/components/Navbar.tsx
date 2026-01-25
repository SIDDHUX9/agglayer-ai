import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, LogOut, Wallet } from "lucide-react";
import { Link, useLocation } from "react-router";

export function Navbar() {
  const { isAuthenticated, signOut, address, signIn } = useAuth();
  const location = useLocation();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <img src="/agg.png" alt="AggLayer AI" className="h-10 w-10 object-contain" />
          <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            AggLayer AI
          </span>
        </Link>
        
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground absolute left-1/2 transform -translate-x-1/2">
            <Link 
              to="/dashboard" 
              className={`hover:text-primary transition-colors ${location.pathname === '/dashboard' ? 'text-foreground' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/vaults" 
              className={`hover:text-primary transition-colors ${location.pathname === '/vaults' ? 'text-foreground' : ''}`}
            >
              Vaults
            </Link>
            <Link 
              to="/strategies" 
              className={`hover:text-primary transition-colors ${location.pathname === '/strategies' ? 'text-foreground' : ''}`}
            >
              Strategies
            </Link>
            <Link 
              to="/whitepaper" 
              className={`hover:text-primary transition-colors ${location.pathname === '/whitepaper' ? 'text-foreground' : ''}`}
            >
              Whitepaper
            </Link>
          </div>
        )}

        <div className="flex items-center gap-4">
          {isAuthenticated && address ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border text-xs font-mono">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                {formatAddress(address)}
              </div>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}