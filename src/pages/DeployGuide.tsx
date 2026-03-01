import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, AlertTriangle, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/deploy-guide/DeployShared";
import { SetupSection } from "@/components/deploy-guide/SetupSection";
import { ContractsSection } from "@/components/deploy-guide/ContractsSection";
import { DeploySection } from "@/components/deploy-guide/DeploySection";
import { UpdateConfigSection } from "@/components/deploy-guide/UpdateConfigSection";
import { VerifySection } from "@/components/deploy-guide/VerifySection";

const sections = [
  { id: "setup", label: "1. Setup VS Code & Hardhat" },
  { id: "contracts", label: "2. Smart Contract Code" },
  { id: "deploy", label: "3. Deploy with Hardhat" },
  { id: "update", label: "4. Update Frontend Config" },
  { id: "verify", label: "5. Verify on PolygonScan" },
];

export default function DeployGuide() {
  const [expandedSection, setExpandedSection] = useState<string | null>("setup");

  const toggle = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container py-10 px-4 md:px-8 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Mainnet Deployment</Badge>
              <Badge variant="outline" className="text-yellow-400 border-yellow-500/30">
                <AlertTriangle className="h-3 w-3 mr-1" /> Use real funds carefully
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-500/30">VS Code + Hardhat</Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
              <Rocket className="h-9 w-9 text-primary" />
              Mainnet Deployment Guide
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Step-by-step guide to deploy all AggLayer Yield AI smart contracts to Polygon Mainnet using VS Code and Hardhat.
            </p>
          </div>

          <Separator className="mb-8" />

          {/* Accordion Sections */}
          <div className="space-y-4">
            {sections.map((sec) => (
              <Card key={sec.id} className="border-border/60">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold hover:bg-muted/30 transition-colors rounded-t-lg"
                  onClick={() => toggle(sec.id)}
                >
                  <span>{sec.label}</span>
                  {expandedSection === sec.id
                    ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>

                {expandedSection === sec.id && (
                  <CardContent className="pt-0 pb-6 px-6 space-y-6">
                    <Separator className="mb-4" />
                    {sec.id === "setup" && <SetupSection />}
                    {sec.id === "contracts" && <ContractsSection />}
                    {sec.id === "deploy" && <DeploySection />}
                    {sec.id === "update" && <UpdateConfigSection />}
                    {sec.id === "verify" && <VerifySection />}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Quick Reference */}
          <Card className="mt-8 border-primary/20 bg-primary/5">
            <div className="px-6 py-4 font-semibold text-base">Quick Reference — Mainnet Addresses</div>
            <CardContent className="space-y-2 text-sm font-mono">
              {[
                { label: "Real USDC (Polygon):", value: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174" },
                { label: "WPOL (Polygon):", value: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270" },
                { label: "Chain ID:", value: "137" },
                { label: "Solidity:", value: "0.8.20 + Optimization 200" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center flex-wrap gap-2">
                  <span className="text-muted-foreground">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">{value}</span>
                    <CopyButton text={value} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}