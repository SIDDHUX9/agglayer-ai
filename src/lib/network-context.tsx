import { createContext, useContext, useState, ReactNode } from "react";

export type NetworkMode = "testnet" | "mainnet";

interface NetworkContextType {
  networkMode: NetworkMode;
  setNetworkMode: (mode: NetworkMode) => void;
  isMainnet: boolean;
  isTestnet: boolean;
}

const NetworkContext = createContext<NetworkContextType | null>(null);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [networkMode, setNetworkMode] = useState<NetworkMode>(() => {
    const saved = localStorage.getItem("agglayer-network-mode");
    return (saved as NetworkMode) || "testnet";
  });

  const handleSetNetworkMode = (mode: NetworkMode) => {
    localStorage.setItem("agglayer-network-mode", mode);
    setNetworkMode(mode);
  };

  return (
    <NetworkContext.Provider
      value={{
        networkMode,
        setNetworkMode: handleSetNetworkMode,
        isMainnet: networkMode === "mainnet",
        isTestnet: networkMode === "testnet",
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error("useNetwork must be used within NetworkProvider");
  return ctx;
}
