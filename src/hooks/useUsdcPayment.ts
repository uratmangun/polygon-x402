"use client";

import axios from "axios";
import { useState } from "react";
import {
  createWalletClient,
  custom,
} from "viem";
import { useWalletClient, useAccount } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { withPaymentInterceptor } from "x402-axios";

/**
 * Custom hook for USDC payments using x402 protocol
 * Handles gasless USDC transfers on Polygon Amoy
 */

export function useUsdcPayment() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setIsSuccess(false);
    setTxHash(null);
    setError(null);
  };

  const sendPayment = async (recipient: string, amount: string): Promise<{ success: boolean; txHash?: string }> => {
    resetState();

    if (!isConnected || !address) {
      setError("Please connect your wallet");
      return { success: false };
    }

    setIsPending(true);

    try {
      let signingClient: ReturnType<typeof createWalletClient> | undefined;

      if (
        typeof window !== "undefined" &&
        (window as unknown as { ethereum?: object }).ethereum
      ) {
        console.log("[useUsdcPayment] Using external wallet with x402-axios");

        // Check current chain and switch to Polygon Amoy if needed
        const ethereum = (window as unknown as { ethereum: {
          request: (args: { method: string; params?: unknown[] }) => Promise<string>;
        } }).ethereum;
        const currentChainId = await ethereum.request({
          method: "eth_chainId",
        });
        const targetChainId = `0x${polygonAmoy.id.toString(16)}`;

        if (currentChainId !== targetChainId) {
          console.log(`[useUsdcPayment] Chain mismatch. Switching to Polygon Amoy...`);
          try {
            await ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: targetChainId }],
            });
          } catch (switchError: unknown) {
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
            } else {
              throw switchError;
            }
          }
        }

        signingClient = createWalletClient({
          account: address as `0x${string}`,
          chain: polygonAmoy,
          transport: custom(ethereum),
        });
      } else if (walletClient) {
        console.log("[useUsdcPayment] Using wagmi wallet client");
        signingClient = walletClient;
      } else {
        throw new Error("No wallet client available");
      }

      // Create axios instance with x402 payment interceptor
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
        return { success: true, txHash: response.data.transaction };
      }

      return { success: true };
    } catch (err) {
      console.error("USDC payment error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { error?: string } } })?.response
              ?.data?.error ||
            (err as { message?: string })?.message ||
            "Failed to process payment";

      if (
        errorMessage.toLowerCase().includes("timeout") ||
        errorMessage.toLowerCase().includes("timed out")
      ) {
        setError("Payment authorization timed out. Please try again.");
      } else {
        setError(errorMessage);
      }
      return { success: false };
    } finally {
      setIsPending(false);
    }
  };

  return {
    sendPayment,
    isPending,
    isSuccess,
    txHash,
    error,
    resetState,
    isConnected,
    address,
  };
}
