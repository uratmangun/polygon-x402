'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import type { Product } from '@/db/schema';

export default function MarketplaceGrid() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchFeaturedProducts() {
            try {
                const response = await fetch('/api/products/featured');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Failed to fetch featured products:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchFeaturedProducts();
    }, []);

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

                
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No products available yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                title={product.title}
                                price={parseFloat(product.price).toLocaleString()}
                                seller={product.sellerName || product.sellerAddress.slice(0, 6) + '...' + product.sellerAddress.slice(-4)}
                                image={product.imageUrl || ''}
                            />
                        ))}
                    </div>
                )}

                {/* Load More Button */}
                <div className="flex justify-center mt-12">
                    <Link
                        href="/marketplace"
                        className="px-10 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:border-cyan-500/50"
                    >
                        Load More Items
                    </Link>
                </div>
            </div>
        </section>
    );
}
