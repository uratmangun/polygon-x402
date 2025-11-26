'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract } from 'wagmi';
import { polygon, polygonAmoy } from 'wagmi/chains';
import { formatUnits } from 'viem';

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

export default function Navbar() {
    const { address, isConnected, chainId } = useAccount();
    
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
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center glow-primary">
                            <span className="text-white font-bold text-lg">X</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">
                            x402
                        </span>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* USDC Balance Display */}
                        {isConnected && usdcBalance !== undefined && (
                            <div className="hidden md:flex items-center gap-2 mr-2">
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-gray-400">USDC Balance</span>
                                    <span className="text-sm font-mono text-emerald-400 font-bold">
                                        ${formatBalance(usdcBalance)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => refetchBalance()}
                                    disabled={isFetching}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
                                    title="Refresh balance"
                                >
                                    <svg 
                                        className={`w-4 h-4 text-gray-400 ${isFetching ? 'animate-spin' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        <ConnectButton showBalance={false} />
                    </div>
                </div>
            </div>
        </nav>
    );
}
