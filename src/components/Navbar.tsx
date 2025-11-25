'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center glow-primary">
                            <span className="text-white font-bold text-lg">X</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">
                            x402
                        </span>
                    </div>

                    {/* Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="#" className="text-cyan-400 hover:text-cyan-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Marketplace
                            </Link>
                            <Link href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Drops
                            </Link>
                            <Link href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Activity
                            </Link>
                            <Link href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Community
                            </Link>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end mr-4">
                            <span className="text-xs text-gray-400">Gas Saved</span>
                            <span className="text-sm font-mono text-emerald-400 font-bold">$1,240.50</span>
                        </div>
<ConnectButton />
                    </div>
                </div>
            </div>
        </nav>
    );
}
