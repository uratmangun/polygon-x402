import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
    try {
        // Get 6 random products
        const featuredProducts = await db
            .select()
            .from(products)
            .orderBy(sql`RANDOM()`)
            .limit(6);

        return NextResponse.json(featuredProducts);
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch featured products' },
            { status: 500 }
        );
    }
}
