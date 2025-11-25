import Link from 'next/link';

export default function Hero() {
    return (
        <div className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fade-in-up">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm text-gray-300">Powered by Polygon x402</span>
                </div>

                {/* Headline */}
                <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
                    Peer to Peer <br />
                    <span className="text-gradient glow-primary">Marketplace</span>
                </h1>

                <p className="text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
                    Experience the first truly gasless marketplace. Buy and sell everyday products using USDC. No MATIC needed.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link href="/marketplace" className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:shadow-[0_0_30px_-5px_var(--primary)] transition-all duration-300 transform hover:-translate-y-1">
                        Explore Marketplace
                    </Link>
                    <Link href="/marketplace" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                        Start Selling
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 w-full max-w-4xl">
                    {[
                        { label: 'Total Volume', value: '$402M+' },
                        { label: 'Gas Saved', value: '$12.5M' },
                        { label: 'Active Traders', value: '85K+' },
                        { label: 'Items', value: '2.4M' },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <span className="text-3xl font-bold text-white mb-1">{stat.value}</span>
                            <span className="text-sm text-gray-400">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
