import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Purchase endpoint - decreases stock after successful payment
 * This endpoint is called after a successful USDC payment
 */
export async function POST(request: NextRequest, context: RouteContext) {
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
        const { txHash, buyerAddress } = body;

        // Verify the product exists
        const [existingProduct] = await db.select().from(products).where(eq(products.id, productId));

        if (!existingProduct) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Check stock availability
        if (existingProduct.stock <= 0) {
            return NextResponse.json(
                { error: 'Product is out of stock' },
                { status: 400 }
            );
        }

        // Decrease stock by 1
        const [updatedProduct] = await db.update(products)
            .set({
                stock: existingProduct.stock - 1,
                updatedAt: new Date(),
            })
            .where(eq(products.id, productId))
            .returning();

        console.log(`[Purchase] Product ${productId} purchased by ${buyerAddress}. Tx: ${txHash}. New stock: ${updatedProduct.stock}`);

        return NextResponse.json({
            success: true,
            product: updatedProduct,
            message: 'Purchase completed successfully',
        });
    } catch (error) {
        console.error('Error processing purchase:', error);
        return NextResponse.json(
            { error: 'Failed to process purchase' },
            { status: 500 }
        );
    }
}
