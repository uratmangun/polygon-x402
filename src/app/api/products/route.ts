import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        const { title, description, price, stock, imageUrl, sellerAddress, sellerName } = body;

        // Validate required fields
        if (!title || !price || !sellerAddress) {
            return NextResponse.json(
                { error: 'Missing required fields: title, price, and sellerAddress are required' },
                { status: 400 }
            );
        }

        // Validate seller address format (basic Ethereum address validation)
        if (!/^0x[a-fA-F0-9]{40}$/.test(sellerAddress)) {
            return NextResponse.json(
                { error: 'Invalid seller address format' },
                { status: 400 }
            );
        }

        // Validate price is a positive number
        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum <= 0) {
            return NextResponse.json(
                { error: 'Price must be a positive number' },
                { status: 400 }
            );
        }

        // Insert the product
        const [newProduct] = await db.insert(products).values({
            title,
            description: description || null,
            price: price.toString(),
            stock: stock ? parseInt(stock, 10) : 1,
            imageUrl: imageUrl || null,
            sellerAddress,
            sellerName: sellerName || null,
        }).returning();

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const allProducts = await db.select().from(products);
        return NextResponse.json(allProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}
