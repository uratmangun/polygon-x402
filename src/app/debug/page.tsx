'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useConnection, useReadContract } from 'wagmi';
import { polygon, polygonAmoy } from 'wagmi/chains';
import { formatUnits } from 'viem';
import Link from 'next/link';
import { UsdcTransfer } from '@/components/UsdcTransfer';

// USDC contract addresses
const USDC_ADDRESSES = {
    [polygon.id]: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359' as `0x${string}`, // USDC on Polygon
    [polygonAmoy.id]: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582' as `0x${string}`, // USDC on Polygon Amoy
};

// ERC20 balanceOf ABI
const erc20BalanceOfAbi = [
    {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
] as const;

export default function DebugPage() {
    const { address, isConnected, chainId } = useConnection();

    // Get USDC contract address for current chain
    const usdcAddress = chainId ? USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES] : undefined;

    // Read USDC balance using viem via useReadContract (uses custom RPC from wagmi config)
    const { data: usdcBalance, refetch: refetchBalance, isFetching } = useReadContract({
        address: usdcAddress,
        abi: erc20BalanceOfAbi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: isConnected && !!usdcAddress && !!address,
            refetchInterval: 10000, // Refresh every 10 seconds
        },
    });

    const formatBalance = (balance: bigint | undefined) => {
        if (!balance) return '0.00';
        const value = parseFloat(formatUnits(balance, 6)); // USDC has 6 decimals
        return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <main className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/" className="text-cyan-400 hover:text-cyan-300 text-sm mb-2 inline-flex items-center gap-2 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Home
                        </Link>
                        <h1 className="text-3xl font-bold text-white">
                            <span className="text-gradient">Debug</span> Page
                        </h1>
                    </div>
                    <ConnectButton />
                </div>

                {/* Wallet Info */}
                <div className="glass-card rounded-2xl p-6 mb-6">
                    <h2 className="text-xl font-bold text-white mb-4">Wallet Status</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-gray-400">Connected</span>
                            <span className={`font-mono ${isConnected ? 'text-emerald-400' : 'text-red-400'}`}>
                                {isConnected ? 'Yes' : 'No'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-gray-400">Address</span>
                            <span className="font-mono text-cyan-400 text-sm">
                                {address || 'Not connected'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-gray-400">Chain ID</span>
                            <span className="font-mono text-white">
                                {chainId || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* USDC Balance */}
                <div className="glass-card rounded-2xl p-6 mb-6">
                    <h2 className="text-xl font-bold text-white mb-4">USDC Balance</h2>
                    {isConnected ? (
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 mb-1">Balance</span>
                                <span className="text-2xl font-mono text-emerald-400 font-bold">
                                    ${formatBalance(usdcBalance)}
                                </span>
                            </div>
                            <button
                                onClick={() => refetchBalance()}
                                disabled={isFetching}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50 flex items-center gap-2"
                                title="Refresh balance"
                            >
                                <svg 
                                    className={`w-5 h-5 text-gray-400 ${isFetching ? 'animate-spin' : ''}`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span className="text-sm text-gray-400">Refresh</span>
                            </button>
                        </div>
                    ) : (
                        <p className="text-gray-400">Connect wallet to view balance</p>
                    )}
                </div>

                {/* USDC Transfer (Base Sepolia) */}
                <UsdcTransfer />
            </div>
        </main>
    );
}
