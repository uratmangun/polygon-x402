import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const productId = parseInt(id, 10);

        if (isNaN(productId)) {
            return NextResponse.json(
                { error: 'Invalid product ID' },
                { status: 400 }
            );
        }

        const [product] = await db.select().from(products).where(eq(products.id, productId));

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const productId = parseInt(id, 10);

        if (isNaN(productId)) {
            return NextResponse.json(
                { error: 'Invalid product ID' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { title, description, price, stock, imageUrl, sellerAddress } = body;

        // Verify the product exists and belongs to the seller
        const [existingProduct] = await db.select().from(products).where(eq(products.id, productId));

        if (!existingProduct) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Check if the requester is the owner
        if (existingProduct.sellerAddress.toLowerCase() !== sellerAddress?.toLowerCase()) {
            return NextResponse.json(
                { error: 'Unauthorized: Only the product owner can edit this product' },
                { status: 403 }
            );
        }

        // Update the product
        const [updatedProduct] = await db.update(products)
            .set({
                title: title || existingProduct.title,
                description: description !== undefined ? description : existingProduct.description,
                price: price ? price.toString() : existingProduct.price,
                stock: stock !== undefined ? parseInt(stock, 10) : existingProduct.stock,
                imageUrl: imageUrl !== undefined ? imageUrl : existingProduct.imageUrl,
                updatedAt: new Date(),
            })
            .where(eq(products.id, productId))
            .returning();

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const productId = parseInt(id, 10);

        if (isNaN(productId)) {
            return NextResponse.json(
                { error: 'Invalid product ID' },
                { status: 400 }
            );
        }

        const { searchParams } = new URL(request.url);
        const sellerAddress = searchParams.get('sellerAddress');

        if (!sellerAddress) {
            return NextResponse.json(
                { error: 'Seller address is required' },
                { status: 400 }
            );
        }

        // Verify the product exists and belongs to the seller
        const [existingProduct] = await db.select().from(products).where(eq(products.id, productId));

        if (!existingProduct) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Check if the requester is the owner
        if (existingProduct.sellerAddress.toLowerCase() !== sellerAddress.toLowerCase()) {
            return NextResponse.json(
                { error: 'Unauthorized: Only the product owner can delete this product' },
                { status: 403 }
            );
        }

        // Delete the product (comments will be cascade deleted)
        await db.delete(products).where(eq(products.id, productId));

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
