import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { comments, products } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

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

        // Verify product exists
        const [product] = await db.select().from(products).where(eq(products.id, productId));
        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        const productComments = await db
            .select()
            .from(comments)
            .where(eq(comments.productId, productId))
            .orderBy(desc(comments.createdAt));

        return NextResponse.json(productComments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch comments' },
            { status: 500 }
        );
    }
}

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
        const { authorAddress, authorName, content } = body;

        // Validate required fields
        if (!authorAddress || !content) {
            return NextResponse.json(
                { error: 'Missing required fields: authorAddress and content are required' },
                { status: 400 }
            );
        }

        // Validate author address format
        if (!/^0x[a-fA-F0-9]{40}$/.test(authorAddress)) {
            return NextResponse.json(
                { error: 'Invalid author address format' },
                { status: 400 }
            );
        }

        // Verify product exists
        const [product] = await db.select().from(products).where(eq(products.id, productId));
        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Insert the comment
        const [newComment] = await db.insert(comments).values({
            productId,
            authorAddress,
            authorName: authorName || null,
            content,
        }).returning();

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json(
            { error: 'Failed to create comment' },
            { status: 500 }
        );
    }
}
