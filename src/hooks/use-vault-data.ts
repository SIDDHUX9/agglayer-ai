import { useReadContract } from "wagmi";
import { CONTRACTS, MASTER_VAULT_ABI } from "@/lib/contracts";
import { formatUnits } from "viem";

export function useVaultTVL() {
  const { data: tvl, isLoading, error } = useReadContract({
    address: CONTRACTS.MASTER_VAULT.address as `0x${string}`,
    abi: MASTER_VAULT_ABI,
    functionName: "getTVL",
    chainId: CONTRACTS.MASTER_VAULT.chainId,
  });

  return {
    tvl: tvl ? formatUnits(tvl as bigint, 6) : "0", // USDC has 6 decimals
    isLoading,
    error,
    raw: tvl,
  };
}

export function useVaultTotalAssets() {
  const { data: totalAssets, isLoading, error } = useReadContract({
    address: CONTRACTS.MASTER_VAULT.address as `0x${string}`,
    abi: MASTER_VAULT_ABI,
    functionName: "totalAssets",
    chainId: CONTRACTS.MASTER_VAULT.chainId,
  });

  return {
    totalAssets: totalAssets ? formatUnits(totalAssets as bigint, 6) : "0",
    isLoading,
    error,
    raw: totalAssets,
  };
}

export function useVaultTotalSupply() {
  const { data: totalSupply, isLoading, error } = useReadContract({
    address: CONTRACTS.MASTER_VAULT.address as `0x${string}`,
    abi: MASTER_VAULT_ABI,
    functionName: "totalSupply",
    chainId: CONTRACTS.MASTER_VAULT.chainId,
  });

  return {
    totalSupply: totalSupply ? formatUnits(totalSupply as bigint, 18) : "0", // ERC20 shares are 18 decimals
    isLoading,
    error,
    raw: totalSupply,
  };
}

export function useUserVaultBalance(address: `0x${string}` | undefined) {
  const { data: balance, isLoading, error } = useReadContract({
    address: CONTRACTS.MASTER_VAULT.address as `0x${string}`,
    abi: MASTER_VAULT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: CONTRACTS.MASTER_VAULT.chainId,
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
  const { data: assets, isLoading, error } = useReadContract({
    address: CONTRACTS.MASTER_VAULT.address as `0x${string}`,
    abi: MASTER_VAULT_ABI,
    functionName: "convertToAssets",
    args: shares ? [shares] : undefined,
    chainId: CONTRACTS.MASTER_VAULT.chainId,
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
