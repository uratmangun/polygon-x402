import ProductCard from './ProductCard';

const FEATURED_ITEMS = [
    {
        id: 1,
        title: 'Sony WH-1000XM5 Headphones',
        price: '349',
        seller: 'TechStore',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
    },
    {
        id: 2,
        title: 'Apple MacBook Pro 14"',
        price: '1,999',
        seller: 'AppleReseller',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',
    },
    {
        id: 3,
        title: 'Nike Air Max 90',
        price: '129',
        seller: 'SneakerHub',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
    },
    {
        id: 4,
        title: 'Canon EOS R6 Camera',
        price: '2,499',
        seller: 'PhotoPro',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop',
    },
    {
        id: 5,
        title: 'Herman Miller Aeron Chair',
        price: '1,395',
        seller: 'OfficeFurniture',
        image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=800&fit=crop',
    },
    {
        id: 6,
        title: 'iPad Pro 12.9" M2',
        price: '1,099',
        seller: 'GadgetWorld',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop',
    },
];

export default function MarketplaceGrid() {
    return (
        <section className="relative py-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
                            Featured <span className="text-gradient">Marketplace</span>
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Discover top products from trusted sellers, pay with USDC
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="hidden md:flex gap-2 glass-panel px-2 py-2 rounded-full">
                        <button className="px-6 py-2 rounded-full bg-white/10 text-white font-medium text-sm transition-all">
                            All
                        </button>
                        <button className="px-6 py-2 rounded-full text-gray-400 hover:text-white font-medium text-sm transition-all">
                            Electronics
                        </button>
                        <button className="px-6 py-2 rounded-full text-gray-400 hover:text-white font-medium text-sm transition-all">
                            Fashion
                        </button>
                        <button className="px-6 py-2 rounded-full text-gray-400 hover:text-white font-medium text-sm transition-all">
                            Home
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURED_ITEMS.map((item) => (
                        <ProductCard
                            key={item.id}
                            title={item.title}
                            price={item.price}
                            seller={item.seller}
                            image={item.image}
                        />
                    ))}
                </div>

                {/* Load More Button */}
                <div className="flex justify-center mt-12">
                    <button className="px-10 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:border-cyan-500/50">
                        Load More Items
                    </button>
                </div>
            </div>
        </section>
    );
}
