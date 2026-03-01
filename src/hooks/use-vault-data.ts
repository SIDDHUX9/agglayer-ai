import { useReadContract, useBalance } from "wagmi";
import { TESTNET_CONTRACTS, MAINNET_CONTRACTS, MASTER_VAULT_ABI } from "@/lib/contracts";
import { formatUnits } from "viem";
import { useNetwork } from "@/lib/network-context";
import { polygonMainnet, polygonAmoy } from "@/lib/web3-config";

function useContracts() {
  const { isMainnet } = useNetwork();
  return isMainnet ? MAINNET_CONTRACTS : TESTNET_CONTRACTS;
}

export function useVaultTVL() {
  const contracts = useContracts();
  const { data: tvl, isLoading, error } = useReadContract({
    address: contracts.MASTER_VAULT.address as `0x${string}`,
    abi: MASTER_VAULT_ABI,
    functionName: "getTVL",
    chainId: contracts.MASTER_VAULT.chainId,
  });

  return {
    tvl: tvl ? formatUnits(tvl as bigint, 6) : "0",
    isLoading,
    error,
    raw: tvl,
  };
}

export function useVaultTotalAssets() {
  const contracts = useContracts();
  const { data: totalAssets, isLoading, error } = useReadContract({
    address: contracts.MASTER_VAULT.address as `0x${string}`,
    abi: MASTER_VAULT_ABI,
    functionName: "totalAssets",
    chainId: contracts.MASTER_VAULT.chainId,
  });

  return {
    totalAssets: totalAssets ? formatUnits(totalAssets as bigint, 6) : "0",
    isLoading,
    error,
    raw: totalAssets,
  };
}

export function useVaultTotalSupply() {
  const contracts = useContracts();
  const { data: totalSupply, isLoading, error } = useReadContract({
    address: contracts.MASTER_VAULT.address as `0x${string}`,
    abi: MASTER_VAULT_ABI,
    functionName: "totalSupply",
    chainId: contracts.MASTER_VAULT.chainId,
  });

  return {
    totalSupply: totalSupply ? formatUnits(totalSupply as bigint, 18) : "0",
    isLoading,
    error,
    raw: totalSupply,
  };
}

export function useUserVaultBalance(address: `0x${string}` | undefined) {
  const contracts = useContracts();
  const { data: balance, isLoading, error } = useReadContract({
    address: contracts.MASTER_VAULT.address as `0x${string}`,
    abi: MASTER_VAULT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: contracts.MASTER_VAULT.chainId,
    query: {
      enabled: !!address,
    },
  });

  return {
    balance: balance ? formatUnits(balance as bigint, 18) : "0",
    isLoading,
    error,
    raw: balance,
  };
}

export function useConvertToAssets(shares: bigint | undefined) {
  const contracts = useContracts();
  const { data: assets, isLoading, error } = useReadContract({
    address: contracts.MASTER_VAULT.address as `0x${string}`,
    abi: MASTER_VAULT_ABI,
    functionName: "convertToAssets",
    args: shares ? [shares] : undefined,
    chainId: contracts.MASTER_VAULT.chainId,
    query: {
      enabled: !!shares,
    },
  });

  return {
    assets: assets ? formatUnits(assets as bigint, 6) : "0",
    isLoading,
    error,
    raw: assets,
  };
}

// Hook to get native POL/MATIC balance for the connected wallet on the correct chain
export function useNativeBalance(address: `0x${string}` | undefined) {
  const { isMainnet } = useNetwork();
  const chainId = isMainnet ? polygonMainnet.id : polygonAmoy.id;

  const { data, isLoading, error } = useBalance({
    address,
    chainId,
    query: {
      enabled: !!address,
    },
  });

  return {
    balance: data ? formatUnits(data.value, 18) : "0",
    formatted: data ? formatUnits(data.value, data.decimals) : "0",
    symbol: data?.symbol ?? (isMainnet ? "POL" : "MATIC"),
    isLoading,
    error,
    raw: data,
  };
}