'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import type { Product } from '@/db/schema';

export default function MarketplacePage() {
    const [showSellModal, setShowSellModal] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { address, isConnected } = useAccount();

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        stock: '1',
        imageUrl: '',
    });

    // Fetch products from API
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/api/products');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isConnected || !address) {
            alert('Please connect your wallet first');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    sellerAddress: address,
                }),
            });

            if (response.ok) {
                const newProduct = await response.json();
                setProducts(prev => [newProduct, ...prev]);
                setShowSellModal(false);
                setFormData({ title: '', description: '', price: '', stock: '1', imageUrl: '' });
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to list item');
            }
        } catch (error) {
            console.error('Error listing item:', error);
            alert('Failed to list item');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            
            <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                        <div>
                            <Link href="/" className="text-cyan-400 hover:text-cyan-300 text-sm mb-4 inline-flex items-center gap-2 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Home
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                                <span className="text-gradient">Marketplace</span>
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Buy and sell products with zero gas fees
                            </p>
                        </div>

                        {/* Sell Button */}
                        <button
                            onClick={() => setShowSellModal(true)}
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg hover:shadow-[0_0_30px_-5px_#10b981] transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Sell an Item
                        </button>
                    </div>

                    {/* Products Grid */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg">No products listed yet. Be the first to sell!</p>
                        </div>
                    ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <Link href={`/marketplace/${product.id}`} key={product.id} className="glass-card rounded-2xl overflow-hidden group cursor-pointer">
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                                    {product.imageUrl && (
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    )}
                                    <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-emerald-500/90 backdrop-blur-sm flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                        <span className="text-xs font-bold text-white">Gas Free</span>
                                    </div>
                                    {/* Stock Badge */}
                                    <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full backdrop-blur-sm ${
                                        product.stock <= 5 
                                            ? 'bg-red-500/90 text-white' 
                                            : product.stock <= 10 
                                                ? 'bg-amber-500/90 text-white' 
                                                : 'bg-slate-800/90 text-gray-200'
                                    }`}>
                                        <span className="text-xs font-bold">
                                            {product.stock} in stock
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="mb-3">
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                                            {product.title}
                                        </h3>
                                        {product.description && <p className="text-sm text-gray-500 mb-2">{product.description}</p>}
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-400">Sold by</span>
                                            {product.sellerName && <span className="text-sm text-cyan-400 font-medium">{product.sellerName}</span>}
                                            <span className="text-xs text-gray-500 font-mono">({product.sellerAddress.slice(0, 6)}...{product.sellerAddress.slice(-4)})</span>
                                        </div>
                                    </div>

                                    {/* Price & Action */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400 mb-1">Price</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-bold text-white">{parseFloat(product.price).toLocaleString()}</span>
                                                <span className="text-sm text-gray-400">USDC</span>
                                            </div>
                                        </div>
                                        <button 
                                            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-[0_0_20px_-5px_var(--primary)] transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                            disabled={product.stock === 0}
                                        >
                                            {product.stock === 0 ? 'Sold Out' : 'Buy Now'}
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    )}
                </div>
            </div>

            {/* Sell Modal */}
            {showSellModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowSellModal(false)}
                    />
                    <div className="relative bg-slate-900 rounded-3xl p-8 max-w-lg w-full border border-white/10">
                        <button
                            onClick={() => setShowSellModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-6">List an Item for Sale</h2>
                        
                        {!isConnected ? (
                            <div className="text-center py-8">
                                <p className="text-gray-400 mb-4">Please connect your wallet to list items for sale.</p>
                            </div>
                        ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Item Name</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., iPhone 15 Pro"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your item..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Price (USDC)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0.01"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Stock Quantity</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        placeholder="1"
                                        min="1"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                                Listing as: <span className="text-cyan-400 font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg hover:shadow-[0_0_30px_-5px_#10b981] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Listing...' : 'List Item for Sale'}
                            </button>
                        </form>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}
