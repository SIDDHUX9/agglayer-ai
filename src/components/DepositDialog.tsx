import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Loader2, Wallet, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatEther, parseEther, formatUnits, parseUnits } from "viem";
import { useAccount, useWriteContract, useReadContract, useBalance } from "wagmi";
import { getContracts, MASTER_VAULT_ABI, MOCK_USDC_ABI, POL_VAULT_ABI } from "@/lib/contracts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNetwork } from "@/lib/network-context";
import { Badge } from "@/components/ui/badge";

interface DepositDialogProps {
  vaultId: Id<"vaults">;
  vaultName: string;
}

export function DepositDialog({ vaultId, vaultName }: DepositDialogProps) {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositToken, setDepositToken] = useState<"USDC" | "POL">("USDC");

  const { networkMode, isMainnet } = useNetwork();
  const ACTIVE_CONTRACTS = getContracts(networkMode);

  const { address, chainId } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { data: balance } = useBalance({ address: address as `0x${string}` });
  const depositMutation = useMutation(api.vaults.deposit);

  // Read USDC balance
  const { data: usdcBalance } = useReadContract({
    address: ACTIVE_CONTRACTS.MOCK_USDC.address as `0x${string}`,
    abi: MOCK_USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: ACTIVE_CONTRACTS.MOCK_USDC.chainId,
  });

  const isContractConfigured = ACTIVE_CONTRACTS.MASTER_VAULT.address.length > 0;
  const isPolVaultConfigured = ACTIVE_CONTRACTS.POL_VAULT.address.length > 0;
  const isCorrectChain = chainId === ACTIVE_CONTRACTS.MASTER_VAULT.chainId;
  const formattedBalance = usdcBalance ? formatUnits(usdcBalance as bigint, 6) : "0";

  const handleGetUSDC = async () => {
    if (!address || !isCorrectChain) {
      toast.error("Please connect wallet and switch to the correct network first");
      return;
    }

    if (isMainnet) {
      toast.info("On mainnet, use real USDC from an exchange or bridge.");
      return;
    }

    try {
      toast.info("Calling USDC faucet...");
      const faucetTx = await writeContractAsync({
        address: ACTIVE_CONTRACTS.MOCK_USDC.address as `0x${string}`,
        abi: MOCK_USDC_ABI,
        functionName: 'faucet',
        chainId: ACTIVE_CONTRACTS.MOCK_USDC.chainId,
      });

      console.log("Faucet tx:", faucetTx);
      toast.success("Successfully claimed test USDC! Check your balance in a moment.");
    } catch (error: any) {
      console.error("Faucet failed:", error);
      if (error.message?.includes("already claimed")) {
        toast.error("You've already claimed from the faucet. Wait for cooldown period.");
      } else if (error.message?.includes("User rejected")) {
        toast.error("Transaction cancelled");
      } else {
        toast.error(error.shortMessage || error.message || "Failed to claim from faucet");
      }
    }
  };

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount))) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!isContractConfigured) {
      toast.error(
        isMainnet
          ? "Mainnet contracts not yet deployed. Please check back after mainnet launch."
          : "Contract not configured. Please deploy contracts first."
      );
      return;
    }

    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!isCorrectChain) {
      toast.error(
        isMainnet
          ? "Please switch to Polygon Mainnet (Chain ID: 137) in your wallet"
          : "Please switch to Polygon Amoy Testnet (Chain ID: 80002) in your wallet"
      );
      return;
    }

    setIsDepositing(true);
    try {
      if (depositToken === "POL") {
        const polAmount = parseEther(amount);

        if (!balance || polAmount > balance.value) {
          toast.error(`Insufficient POL balance. You have ${balance ? formatEther(balance.value) : "0"} POL`);
          setIsDepositing(false);
          return;
        }

        if (!isPolVaultConfigured) {
          toast.error("POL Vault not deployed yet");
          setIsDepositing(false);
          return;
        }

        toast.info("Depositing POL to vault...");

        try {
          const depositTx = await writeContractAsync({
            address: ACTIVE_CONTRACTS.POL_VAULT.address as `0x${string}`,
            abi: POL_VAULT_ABI,
            functionName: 'deposit',
            value: polAmount,
            chainId: ACTIVE_CONTRACTS.POL_VAULT.chainId,
          });

          toast.success(`Successfully deposited ${amount} POL!`);

          await depositMutation({
            vaultId,
            amount: Number(amount),
            walletAddress: address,
            token: "POL",
            txHash: depositTx,
          });

          setAmount("");
          setIsOpen(false);
          toast.success("Deposit recorded successfully!");
        } catch (depositError: any) {
          console.error("Deposit failed:", depositError);
          toast.error(depositError.shortMessage || depositError.message || "Failed to deposit POL");
        } finally {
          setIsDepositing(false);
        }
        return;
      }

      // USDC deposits
      const finalUsdcAmount = parseUnits(amount, 6);

      if (!usdcBalance || usdcBalance === 0n) {
        toast.error(
          isMainnet
            ? "You don't have any USDC. Please acquire USDC on Polygon Mainnet."
            : "You don't have any USDC. Click 'Get Test USDC' button first."
        );
        setIsDepositing(false);
        return;
      }

      if (finalUsdcAmount > (usdcBalance as bigint)) {
        toast.error(`Insufficient USDC balance. You have ${formattedBalance} USDC`);
        setIsDepositing(false);
        return;
      }

      toast.info("Step 1/2: Approving USDC...");

      try {
        const approvalTx = await writeContractAsync({
          address: ACTIVE_CONTRACTS.MOCK_USDC.address as `0x${string}`,
          abi: MOCK_USDC_ABI,
          functionName: 'approve',
          args: [ACTIVE_CONTRACTS.MASTER_VAULT.address as `0x${string}`, finalUsdcAmount],
          chainId: ACTIVE_CONTRACTS.MOCK_USDC.chainId,
          gas: 100000n,
        });
        console.log("Approval tx:", approvalTx);
        toast.success("USDC approved!");
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (approvalError: any) {
        console.error("Approval failed:", approvalError);
        const isRpcError = approvalError.message?.includes('JSON-RPC') ||
                          approvalError.message?.includes('Internal error');
        if (isRpcError) {
          toast.error("Network error - RPC is having issues. Try again in a few seconds.");
        } else {
          toast.error(
            approvalError.shortMessage ||
            approvalError.message?.split('\n')[0] ||
            "Failed to approve USDC"
          );
        }
        throw approvalError;
      }

      toast.info("Step 2/2: Depositing to vault...");
      let depositTx: string;
      try {
        depositTx = await writeContractAsync({
          address: ACTIVE_CONTRACTS.MASTER_VAULT.address as `0x${string}`,
          abi: MASTER_VAULT_ABI,
          functionName: 'deposit',
          args: [finalUsdcAmount, address as `0x${string}`],
          chainId: ACTIVE_CONTRACTS.MASTER_VAULT.chainId,
        });

        toast.success(`Transaction submitted: ${depositTx.slice(0, 10)}...`);
      } catch (txError: any) {
        console.error("Deposit transaction failed:", txError);
        toast.error(txError.message || "Deposit transaction failed");
        throw txError;
      }

      await depositMutation({
        vaultId,
        amount: Number(amount),
        walletAddress: address,
        token: "USDC",
        txHash: depositTx,
      });

      toast.success(`Successfully deposited ${amount} USDC into ${vaultName}`);
      setIsOpen(false);
      setAmount("");
    } catch (error: any) {
      console.error(error);
      if (!error.message?.includes("User rejected") && !error.message?.includes("denied")) {
        toast.error(error.message || "Failed to deposit");
      }
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Wallet className="mr-2 h-4 w-4" />
          Deposit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Deposit into {vaultName}
            <Badge
              variant="outline"
              className={`text-xs ${
                isMainnet
                  ? "border-green-500/40 text-green-400"
                  : "border-yellow-500/40 text-yellow-400"
              }`}
            >
              {isMainnet ? "Mainnet" : "Testnet"}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {isMainnet
              ? "Add USDC liquidity to the AggLayer Master Vault on Polygon Mainnet."
              : "Add USDC liquidity to the AggLayer Master Vault on Polygon Amoy Testnet."}
            {address && (
              <span className="block mt-1 text-xs">
                Balance: {formattedBalance} USDC
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {isMainnet && !isContractConfigured && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Mainnet contracts are not yet deployed. The team is working on mainnet deployment. Stay tuned!
            </AlertDescription>
          </Alert>
        )}

        {!isMainnet && usdcBalance === 0n && address && isCorrectChain && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                You don't have any testnet USDC. Get 1000 USDC from the faucet to test deposits.
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleGetUSDC}
                className="ml-2"
              >
                Get Test USDC
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!isMainnet && !isContractConfigured && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Contract not deployed yet. Please deploy MasterVault on Amoy testnet and update the address in <code>src/lib/contracts.ts</code>
            </AlertDescription>
          </Alert>
        )}

        {!isCorrectChain && isContractConfigured && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Wrong network detected. Please manually switch to{" "}
              <strong>
                {isMainnet
                  ? "Polygon Mainnet (Chain ID: 137)"
                  : "Polygon Amoy Testnet (Chain ID: 80002)"}
              </strong>{" "}
              in your wallet before depositing.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 py-4">
          {/* Token Selector */}
          <div className="space-y-2">
            <Label>Select Token</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={depositToken === "USDC" ? "default" : "outline"}
                size="sm"
                onClick={() => setDepositToken("USDC")}
                className="flex-1"
              >
                USDC
              </Button>
              <Button
                type="button"
                variant={depositToken === "POL" ? "default" : "outline"}
                size="sm"
                onClick={() => setDepositToken("POL")}
                className="flex-1"
              >
                POL
              </Button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount">Amount</Label>
              {depositToken === "USDC" && usdcBalance && (
                <span className="text-xs text-muted-foreground">
                  Balance: {formattedBalance} USDC
                </span>
              )}
              {depositToken === "POL" && balance && (
                <span className="text-xs text-muted-foreground">
                  Balance: {Number(formatEther(balance.value)).toFixed(4)} POL
                </span>
              )}
            </div>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-20"
              />
              <span className="absolute right-3 top-2.5 text-sm text-muted-foreground font-medium">
                {depositToken}
              </span>
            </div>
          </div>

          {depositToken === "POL" && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {isPolVaultConfigured
                  ? "POL will be deposited directly to the native POL vault. No conversion needed!"
                  : "POL Vault not deployed yet. Deploy it to enable POL deposits."}
              </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleDeposit}
            disabled={isDepositing || !isContractConfigured}
          >
            {isDepositing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {!isCorrectChain ? "Switching Network..." : "Depositing..."}
              </>
            ) : (
              "Confirm Deposit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}