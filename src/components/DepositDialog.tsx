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
import { CONTRACTS, MASTER_VAULT_ABI, MOCK_USDC_ABI, MATIC_VAULT_ABI } from "@/lib/contracts";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DepositDialogProps {
  vaultId: Id<"vaults">;
  vaultName: string;
}

export function DepositDialog({ vaultId, vaultName }: DepositDialogProps) {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositToken, setDepositToken] = useState<"USDC" | "MATIC">("USDC");

  const { address, chainId } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { data: balance } = useBalance({ address: address as `0x${string}` });
  const depositMutation = useMutation(api.vaults.deposit);

  // Read USDC balance
  const { data: usdcBalance } = useReadContract({
    address: CONTRACTS.MOCK_USDC.address as `0x${string}`,
    abi: MOCK_USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: CONTRACTS.MOCK_USDC.chainId,
  });

  const isContractConfigured = CONTRACTS.MASTER_VAULT.address.length > 0;
  const isMaticVaultConfigured = CONTRACTS.MATIC_VAULT.address.length > 0;
  const isCorrectChain = chainId === CONTRACTS.MASTER_VAULT.chainId;
  const formattedBalance = usdcBalance ? formatUnits(usdcBalance as bigint, 6) : "0";

  const handleGetUSDC = async () => {
    if (!address || !isCorrectChain) {
      toast.error("Please connect wallet and switch to Polygon Amoy Testnet first");
      return;
    }

    try {
      toast.info("Calling USDC faucet...");
      const faucetTx = await writeContractAsync({
        address: CONTRACTS.MOCK_USDC.address as `0x${string}`,
        abi: MOCK_USDC_ABI,
        functionName: 'faucet',
        chainId: CONTRACTS.MOCK_USDC.chainId,
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
    console.log("=== Deposit Started ===");
    console.log("Amount:", amount);
    console.log("Token:", depositToken);
    console.log("Address:", address);
    console.log("Chain ID:", chainId);
    console.log("Is correct chain:", isCorrectChain);

    if (!amount || isNaN(Number(amount))) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!isContractConfigured) {
      toast.error("Contract not configured. Please deploy contracts first.");
      return;
    }

    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    // Check if on correct chain
    if (!isCorrectChain) {
      toast.error("Please switch to Polygon Amoy Testnet (Chain ID: 80002) in your wallet first");
      return;
    }

    setIsDepositing(true);
    try {
      // Handle MATIC deposits - direct to MATIC vault
      if (depositToken === "MATIC") {
        const maticAmount = parseEther(amount);

        // Check MATIC balance
        if (!balance || maticAmount > balance.value) {
          toast.error(`Insufficient MATIC balance. You have ${balance ? formatEther(balance.value) : "0"} MATIC`);
          setIsDepositing(false);
          return;
        }

        // Check if MATIC vault is deployed
        if (!isMaticVaultConfigured) {
          toast.error("MATIC Vault not deployed yet");
          toast.info("Run: npx hardhat run scripts/deploy_matic_vault.cjs --network polygonAmoy");
          setIsDepositing(false);
          return;
        }

        // Deposit MATIC directly to MATIC vault
        toast.info("Depositing MATIC to vault...");
        console.log("=== MATIC Deposit Started ===");
        console.log("Amount:", formatEther(maticAmount), "MATIC");
        console.log("MATIC Vault:", CONTRACTS.MATIC_VAULT.address);

        try {
          const depositTx = await writeContractAsync({
            address: CONTRACTS.MATIC_VAULT.address as `0x${string}`,
            abi: MATIC_VAULT_ABI,
            functionName: 'deposit',
            value: maticAmount,
            chainId: CONTRACTS.MATIC_VAULT.chainId,
          });

          console.log("Deposit tx:", depositTx);
          toast.success(`Successfully deposited ${amount} MATIC!`);

          // Update backend database
          await depositMutation({
            vaultId,
            amount: Number(amount),
            walletAddress: address,
            token: "MATIC",
            txHash: depositTx,
          });

          setAmount("");
          setIsOpen(false);
          toast.success("Deposit recorded successfully!");

        } catch (depositError: any) {
          console.error("Deposit failed:", depositError);
          toast.error(depositError.shortMessage || depositError.message || "Failed to deposit MATIC");
        } finally {
          setIsDepositing(false);
        }
        return; // Exit early for MATIC deposits
      }

      // USDC deposits to USDC vault
      const finalUsdcAmount = parseUnits(amount, 6);
        console.log("Amount in USDC (with decimals):", finalUsdcAmount.toString());

        // Check if user has USDC at all
        if (!usdcBalance || usdcBalance === 0n) {
          toast.error("You don't have any USDC. Click 'Get Test USDC' button first.");
          setIsDepositing(false);
          return;
        }

        // Check if user has enough USDC
        if (finalUsdcAmount > (usdcBalance as bigint)) {
          toast.error(`Insufficient USDC balance. You have ${formattedBalance} USDC`);
          setIsDepositing(false);
          return;
        }

      // Step 1: Approve USDC spending
      toast.info("Step 1/2: Approving USDC...");
      console.log("Approving:", {
        usdcContract: CONTRACTS.MOCK_USDC.address,
        vaultContract: CONTRACTS.MASTER_VAULT.address,
        amount: finalUsdcAmount.toString(),
        chainId: CONTRACTS.MOCK_USDC.chainId,
      });

      try {
        const approvalTx = await writeContractAsync({
          address: CONTRACTS.MOCK_USDC.address as `0x${string}`,
          abi: MOCK_USDC_ABI,
          functionName: 'approve',
          args: [CONTRACTS.MASTER_VAULT.address as `0x${string}`, finalUsdcAmount],
          chainId: CONTRACTS.MOCK_USDC.chainId,
          gas: 100000n, // Explicit gas limit for approve
        });
        console.log("Approval tx:", approvalTx);
        toast.success("USDC approved!");

        // Wait a bit for approval to be mined
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (approvalError: any) {
        console.error("Approval failed:", approvalError);
        console.error("Error details:", {
          message: approvalError.message,
          shortMessage: approvalError.shortMessage,
          cause: approvalError.cause,
          details: approvalError.details,
          name: approvalError.name,
          code: approvalError.code,
        });

        // Check if it's an RPC error
        const isRpcError = approvalError.message?.includes('JSON-RPC') ||
                          approvalError.message?.includes('Internal error');

        if (isRpcError) {
          toast.error("Network error - Polygon Amoy RPC is having issues. Try again in a few seconds.");
        } else {
          toast.error(
            approvalError.shortMessage ||
            approvalError.message?.split('\n')[0] ||
            "Failed to approve USDC"
          );
        }
        throw approvalError;
      }

      // Step 2: Deposit to vault
      toast.info("Step 2/2: Depositing to vault...");
      let depositTx: string;
      try {
        depositTx = await writeContractAsync({
          address: CONTRACTS.MASTER_VAULT.address as `0x${string}`,
          abi: MASTER_VAULT_ABI,
          functionName: 'deposit',
          args: [finalUsdcAmount, address as `0x${string}`],
          chainId: CONTRACTS.MASTER_VAULT.chainId,
        });

        console.log("Deposit tx:", depositTx);
        toast.success(`Transaction submitted: ${depositTx.slice(0, 10)}...`);
      } catch (txError: any) {
        console.error("Deposit transaction failed:", txError);
        toast.error(txError.message || "Deposit transaction failed");
        throw txError;
      }

      // Step 3: Update Backend
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
          <DialogTitle>Deposit into {vaultName}</DialogTitle>
          <DialogDescription>
            Add USDC liquidity to the AggLayer Master Vault on Polygon Amoy Testnet.
            {address && (
              <span className="block mt-1 text-xs">
                Balance: {formattedBalance} USDC
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {usdcBalance === 0n && address && isCorrectChain && (
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

        {!isContractConfigured && (
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
              Wrong network detected. Please manually switch to <strong>Polygon Amoy Testnet (Chain ID: 80002)</strong> in your wallet before depositing.
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
                variant={depositToken === "MATIC" ? "default" : "outline"}
                size="sm"
                onClick={() => setDepositToken("MATIC")}
                className="flex-1"
              >
                MATIC
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
              {depositToken === "MATIC" && balance && (
                <span className="text-xs text-muted-foreground">
                  Balance: {Number(formatEther(balance.value)).toFixed(4)} MATIC
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

          {depositToken === "MATIC" && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {isMaticVaultConfigured
                  ? "MATIC will be deposited directly to the native MATIC vault. No conversion needed!"
                  : "MATIC Vault not deployed yet. Deploy it to enable MATIC deposits."}
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