"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  isAddress,
  http as viemHttp,
} from "viem";
import { useWalletClient, useAccount } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { withPaymentInterceptor } from "x402-axios";

/**
 * USDC Transfer Component for Polygon Amoy
 *
 * This component handles GASLESS USDC transfers using x402 payment interceptor.
 * Note: Payment authorization signing has a 30-second timeout.
 */

const USDC_POLYGON_AMOY = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582";

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
] as const;

export function UsdcTransfer() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [usdcBal, setUsdcBal] = useState<bigint | undefined>(undefined);
  const [loadingBal, setLoadingBal] = useState(false);

  // Fetch USDC balance on Polygon Amoy for connected user
  const fetchBalance = async () => {
    if (!address) return;

    try {
      setLoadingBal(true);
      const publicClient = createPublicClient({
        chain: polygonAmoy,
        transport: viemHttp(
          process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC ||
            "https://rpc-amoy.polygon.technology",
        ),
      });

      const balance = await publicClient.readContract({
        address: USDC_POLYGON_AMOY as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      });

      setUsdcBal(balance as bigint);
    } catch (err) {
      console.error("Balance fetch error:", err);
    } finally {
      setLoadingBal(false);
    }
  };

  // Fetch balance when address changes or user connects
  useEffect(() => {
    if (address && isConnected) {
      fetchBalance();
    }
  }, [address, isConnected]);

  const formatUsdc = (bal: bigint | undefined) => {
    if (!bal) return "0.00";
    return (Number(bal) / 1e6).toFixed(2);
  };

  const handleSend = async () => {
    setLocalError(null);
    setIsSuccess(false);
    setTxHash(null);

    if (!isConnected || !address) {
      setLocalError("Please connect your wallet");
      return;
    }

    if (!recipient || !isAddress(recipient)) {
      setLocalError("Enter a valid recipient address");
      return;
    }

    const amountFloat = parseFloat(amount || "0");
    if (isNaN(amountFloat) || amountFloat <= 0) {
      setLocalError("Enter a valid amount");
      return;
    }

    setIsPending(true);

    try {
      let signingClient: ReturnType<typeof createWalletClient> | undefined;

      if (
        typeof window !== "undefined" &&
        (window as unknown as { ethereum?: object }).ethereum
      ) {
        console.log(
          "[UsdcTransfer] Using external wallet (via window.ethereum) with x402-axios",
        );

        // Check current chain and switch to Polygon Amoy if needed
        const ethereum = (window as unknown as { ethereum: {
          request: (args: { method: string; params?: unknown[] }) => Promise<string>;
        } }).ethereum;
        const currentChainId = await ethereum.request({
          method: "eth_chainId",
        });
        const targetChainId = `0x${polygonAmoy.id.toString(16)}`; // Polygon Amoy chain ID in hex

        if (currentChainId !== targetChainId) {
          console.log(
            `[UsdcTransfer] Chain mismatch. Current: ${currentChainId}, Expected: ${targetChainId}`,
          );
          try {
            // Try to switch to Polygon Amoy
            await ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: targetChainId }],
            });
            console.log("[UsdcTransfer] Switched to Polygon Amoy");
          } catch (switchError: unknown) {
            // Chain not added to wallet, try to add it
            if ((switchError as { code?: number })?.code === 4902) {
              await ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: targetChainId,
                    chainName: "Polygon Amoy",
                    nativeCurrency: {
                      name: "POL",
                      symbol: "POL",
                      decimals: 18,
                    },
                    rpcUrls: ["https://rpc-amoy.polygon.technology"],
                    blockExplorerUrls: ["https://amoy.polygonscan.com"],
                  },
                ],
              });
              console.log("[UsdcTransfer] Added and switched to Polygon Amoy");
            } else {
              throw switchError;
            }
          }
        }

        // Create viem wallet client from window.ethereum provider
        signingClient = createWalletClient({
          account: address as `0x${string}`,
          chain: polygonAmoy,
          transport: custom(ethereum),
        });
      } else if (walletClient) {
        // Fallback to wagmi wallet client if available
        console.log("[UsdcTransfer] Using wagmi wallet client with x402-axios");
        console.log(
          "[UsdcTransfer] Chain:",
          walletClient.chain?.id,
          walletClient.chain?.name,
        );
        console.log("[UsdcTransfer] Account:", walletClient.account?.address);
        signingClient = walletClient;
      } else {
        throw new Error("No wallet client available");
      }

      // Create axios instance with x402 payment interceptor
      // This automatically handles: 402 response -> sign payment -> retry with X-Payment header
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosInstance = withPaymentInterceptor(
        axios.create(),
        signingClient as any,
      );

      // Make request - x402 interceptor handles payment flow automatically
      const response = await axiosInstance.post("/api/usdc-pay", {
        to: recipient,
        amount: amount,
      });

      // Payment successful
      setIsSuccess(true);
      if (response.data?.transaction) {
        setTxHash(response.data.transaction);
      }

      // Reset form
      setAmount("");
      setRecipient("");

      // Refresh balance after gasless transaction
      setTimeout(() => fetchBalance(), 2000);
    } catch (err) {
      console.error("USDC transfer error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { error?: string } } })?.response
              ?.data?.error ||
            (err as { message?: string })?.message ||
            "Failed to process gasless transfer";

      // Check if it's a timeout error
      if (
        errorMessage.toLowerCase().includes("timeout") ||
        errorMessage.toLowerCase().includes("timed out")
      ) {
        setLocalError(
          "Payment authorization timed out. Please try again and approve the payment promptly (within 30 seconds).",
        );
      } else {
        setLocalError(errorMessage);
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">
          USDC Transfer (Polygon Amoy)
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            {loadingBal ? (
              "Loading..."
            ) : (
              `Balance: ${formatUsdc(usdcBal)} USDC`
            )}
          </span>
          <button
            type="button"
            onClick={fetchBalance}
            disabled={loadingBal}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
            title="Refresh balance"
          >
            <svg 
              className={`w-4 h-4 text-gray-400 ${loadingBal ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x…"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-400">
            Amount (USDC)
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "" || /^\d*\.?\d*$/.test(v)) setAmount(v);
            }}
            placeholder="0.00"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          />
        </div>
      </div>

      {localError && (
        <div className="mb-4 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-400 break-words">
          {localError}
        </div>
      )}
      {isSuccess && txHash && (
        <div className="mb-4 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-sm text-emerald-400 break-words">
          Sent! Tx: {String(txHash ?? "")}
        </div>
      )}

      <button
        type="button"
        onClick={handleSend}
        disabled={isPending || !isConnected}
        className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {!isConnected
          ? "Connect Wallet"
          : isPending
            ? "Sending…"
            : isSuccess
              ? "Sent ✓"
              : "Send USDC"}
      </button>
    </div>
  );
}
