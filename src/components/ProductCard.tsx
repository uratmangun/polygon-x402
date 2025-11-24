import Image from 'next/image';

interface ProductCardProps {
    title: string;
    price: string;
    image: string;
    seller: string;
    gasFreeBadge?: boolean;
}

export default function ProductCard({ title, price, image, seller, gasFreeBadge = true }: ProductCardProps) {
    return (
        <div className="glass-card rounded-2xl overflow-hidden group cursor-pointer">
            {/* Image */}
            <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {gasFreeBadge && (
                    <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-emerald-500/90 backdrop-blur-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-xs font-bold text-white">Gas Free</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-400">Sold by {seller}</p>
                    </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 mb-1">Price</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-white">{price}</span>
                            <span className="text-sm text-gray-400">USDC</span>
                        </div>
                    </div>
                    <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-[0_0_20px_-5px_var(--primary)] transition-all duration-300 transform hover:-translate-y-0.5">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}
