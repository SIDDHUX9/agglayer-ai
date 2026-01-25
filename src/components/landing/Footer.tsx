import { Wallet } from "lucide-react";
import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="py-12 border-t backdrop-blur-sm bg-background/80 relative z-10">
      <div className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight mb-4">
              <img src="/agg.png" alt="AggLayer AI" className="h-10 w-10 object-contain" />
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                AggLayer AI
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              AI-driven yield optimization across the Polygon AggLayer ecosystem.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link to="/vaults" className="hover:text-primary transition-colors">Vaults</Link></li>
              <li><Link to="/strategies" className="hover:text-primary transition-colors">Strategies</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
              <li><Link to="/whitepaper" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link to="/whitepaper" className="hover:text-primary transition-colors">Whitepaper</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Governance</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Polygon</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 AggLayer Yield AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs">Live on Polygon</span>
            </div>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}