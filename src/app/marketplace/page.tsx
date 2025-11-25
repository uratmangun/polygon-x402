'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';

const MOCK_PRODUCTS = [
    {
        id: 1,
        title: 'Sony WH-1000XM5 Headphones',
        price: '349',
        seller: 'TechStore',
        sellerAddress: '0x1234...5678',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
        stock: 12,
        description: 'Premium noise-canceling wireless headphones',
    },
    {
        id: 2,
        title: 'Apple MacBook Pro 14"',
        price: '1,999',
        seller: 'AppleReseller',
        sellerAddress: '0xabcd...efgh',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',
        stock: 5,
        description: 'M3 Pro chip, 18GB RAM, 512GB SSD',
    },
    {
        id: 3,
        title: 'Nike Air Max 90',
        price: '129',
        seller: 'SneakerHub',
        sellerAddress: '0x9876...4321',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
        stock: 28,
        description: 'Classic sneakers, multiple sizes available',
    },
    {
        id: 4,
        title: 'Canon EOS R6 Camera',
        price: '2,499',
        seller: 'PhotoPro',
        sellerAddress: '0xfedc...ba98',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop',
        stock: 3,
        description: 'Full-frame mirrorless camera body',
    },
    {
        id: 5,
        title: 'Herman Miller Aeron Chair',
        price: '1,395',
        seller: 'OfficeFurniture',
        sellerAddress: '0x5555...6666',
        image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=800&fit=crop',
        stock: 8,
        description: 'Ergonomic office chair, size B',
    },
    {
        id: 6,
        title: 'iPad Pro 12.9" M2',
        price: '1,099',
        seller: 'GadgetWorld',
        sellerAddress: '0x7777...8888',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop',
        stock: 15,
        description: '256GB, Wi-Fi, Space Gray',
    },
];

export default function MarketplacePage() {
    const [showSellModal, setShowSellModal] = useState(false);

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MOCK_PRODUCTS.map((product) => (
                            <div key={product.id} className="glass-card rounded-2xl overflow-hidden group">
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
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
                                        <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-400">Sold by</span>
                                            <span className="text-sm text-cyan-400 font-medium">{product.seller}</span>
                                            <span className="text-xs text-gray-500 font-mono">({product.sellerAddress})</span>
                                        </div>
                                    </div>

                                    {/* Price & Action */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400 mb-1">Price</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-bold text-white">{product.price}</span>
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
                            </div>
                        ))}
                    </div>
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
                        
                        <form className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Item Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., iPhone 15 Pro"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
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
                                        placeholder="0.00"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Stock Quantity</label>
                                    <input
                                        type="number"
                                        placeholder="1"
                                        min="1"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg hover:shadow-[0_0_30px_-5px_#10b981] transition-all duration-300"
                            >
                                List Item for Sale
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}
