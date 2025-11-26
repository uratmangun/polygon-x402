'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import type { Product, Comment } from '@/db/schema';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;
    
    const [product, setProduct] = useState<Product | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isPostingComment, setIsPostingComment] = useState(false);
    const { address, isConnected } = useAccount();

    // Edit form state
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
    });

    const isOwner = product && address && product.sellerAddress.toLowerCase() === address.toLowerCase();

    // Fetch product and comments
    useEffect(() => {
        async function fetchData() {
            try {
                const [productRes, commentsRes] = await Promise.all([
                    fetch(`/api/products/${productId}`),
                    fetch(`/api/products/${productId}/comments`),
                ]);

                if (productRes.ok) {
                    const productData = await productRes.json();
                    setProduct(productData);
                    setEditForm({
                        title: productData.title,
                        description: productData.description || '',
                        price: productData.price,
                        stock: productData.stock.toString(),
                        imageUrl: productData.imageUrl || '',
                    });
                }

                if (commentsRes.ok) {
                    const commentsData = await commentsRes.json();
                    setComments(commentsData);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [productId]);

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...editForm,
                    sellerAddress: address,
                }),
            });

            if (response.ok) {
                const updatedProduct = await response.json();
                setProduct(updatedProduct);
                setIsEditing(false);
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!address || !confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`/api/products/${productId}?sellerAddress=${address}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/marketplace');
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address || !commentText.trim()) return;

        setIsPostingComment(true);
        try {
            const response = await fetch(`/api/products/${productId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    authorAddress: address,
                    content: commentText.trim(),
                }),
            });

            if (response.ok) {
                const newComment = await response.json();
                setComments(prev => [newComment, ...prev]);
                setCommentText('');
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to post comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment');
        } finally {
            setIsPostingComment(false);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!address || !confirm('Delete this comment?')) return;

        try {
            const response = await fetch(`/api/comments/${commentId}?authorAddress=${address}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setComments(prev => prev.filter(c => c.id !== commentId));
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to delete comment');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment');
        }
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center py-20">
                        <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
                        <Link href="/marketplace" className="text-cyan-400 hover:text-cyan-300">
                            Back to Marketplace
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            
            <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Back Link */}
                    <Link href="/marketplace" className="text-cyan-400 hover:text-cyan-300 text-sm mb-6 inline-flex items-center gap-2 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Marketplace
                    </Link>

                    {/* Product Card */}
                    <div className="glass-card rounded-3xl overflow-hidden mt-4">
                        {/* Image */}
                        <div className="relative h-80 md:h-96 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                            {product.imageUrl && (
                                <Image
                                    src={product.imageUrl}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                />
                            )}
                            <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-emerald-500/90 backdrop-blur-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                <span className="text-sm font-bold text-white">Gas Free</span>
                            </div>
                            <div className={`absolute top-4 left-4 px-4 py-2 rounded-full backdrop-blur-sm ${
                                product.stock <= 5 
                                    ? 'bg-red-500/90 text-white' 
                                    : product.stock <= 10 
                                        ? 'bg-amber-500/90 text-white' 
                                        : 'bg-slate-800/90 text-gray-200'
                            }`}>
                                <span className="text-sm font-bold">{product.stock} in stock</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {isEditing ? (
                                <form onSubmit={handleEditSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={editForm.title}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                        <textarea
                                            value={editForm.description}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Price (USDC)</label>
                                            <input
                                                type="number"
                                                value={editForm.price}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                                                step="0.01"
                                                min="0.01"
                                                required
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Stock</label>
                                            <input
                                                type="number"
                                                value={editForm.stock}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, stock: e.target.value }))}
                                                min="0"
                                                required
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                                        <input
                                            type="url"
                                            value={editForm.imageUrl}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-[0_0_20px_-5px_var(--primary)] transition-all duration-300 disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h1 className="text-3xl font-bold text-white mb-2">{product.title}</h1>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">Sold by</span>
                                                {product.sellerName && <span className="text-cyan-400 font-medium">{product.sellerName}</span>}
                                                <span className="text-sm text-gray-500 font-mono">
                                                    ({product.sellerAddress.slice(0, 6)}...{product.sellerAddress.slice(-4)})
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm text-gray-400">Price</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl font-bold text-white">{parseFloat(product.price).toLocaleString()}</span>
                                                <span className="text-gray-400">USDC</span>
                                            </div>
                                        </div>
                                    </div>

                                    {product.description && (
                                        <div className="mb-8">
                                            <h2 className="text-lg font-semibold text-white mb-3">Description</h2>
                                            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button 
                                            className="flex-1 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:shadow-[0_0_30px_-5px_var(--primary)] transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                            disabled={product.stock === 0}
                                        >
                                            {product.stock === 0 ? 'Sold Out' : 'Buy Now'}
                                        </button>
                                        
                                        {isOwner && (
                                            <>
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={handleDelete}
                                                    className="px-6 py-4 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 font-bold hover:bg-red-500/30 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-white mb-6">Comments ({comments.length})</h2>

                        {/* Comment Form */}
                        {isConnected ? (
                            <form onSubmit={handlePostComment} className="mb-8">
                                <div className="glass-card rounded-2xl p-6">
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Write a comment..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none mb-4"
                                    />
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            Posting as: <span className="text-cyan-400 font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                                        </span>
                                        <button
                                            type="submit"
                                            disabled={isPostingComment || !commentText.trim()}
                                            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-[0_0_20px_-5px_var(--primary)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isPostingComment ? 'Posting...' : 'Post Comment'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="glass-card rounded-2xl p-6 mb-8 text-center">
                                <p className="text-gray-400">Connect your wallet to post a comment</p>
                            </div>
                        )}

                        {/* Comments List */}
                        {comments.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-400">No comments yet. Be the first to comment!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="glass-card rounded-2xl p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">
                                                        {comment.authorAddress.slice(2, 4).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    {comment.authorName && (
                                                        <span className="text-cyan-400 font-medium text-sm">{comment.authorName}</span>
                                                    )}
                                                    <span className="text-xs text-gray-500 font-mono ml-2">
                                                        {comment.authorAddress.slice(0, 6)}...{comment.authorAddress.slice(-4)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-gray-500">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                                {address && comment.authorAddress.toLowerCase() === address.toLowerCase() && (
                                                    <button
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
