import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { comments } from '@/db/schema';
import { eq } from 'drizzle-orm';

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const commentId = parseInt(id, 10);

        if (isNaN(commentId)) {
            return NextResponse.json(
                { error: 'Invalid comment ID' },
                { status: 400 }
            );
        }

        const { searchParams } = new URL(request.url);
        const authorAddress = searchParams.get('authorAddress');

        if (!authorAddress) {
            return NextResponse.json(
                { error: 'Author address is required' },
                { status: 400 }
            );
        }

        // Verify the comment exists and belongs to the author
        const [existingComment] = await db.select().from(comments).where(eq(comments.id, commentId));

        if (!existingComment) {
            return NextResponse.json(
                { error: 'Comment not found' },
                { status: 404 }
            );
        }

        // Check if the requester is the author
        if (existingComment.authorAddress.toLowerCase() !== authorAddress.toLowerCase()) {
            return NextResponse.json(
                { error: 'Unauthorized: Only the comment author can delete this comment' },
                { status: 403 }
            );
        }

        // Delete the comment
        await db.delete(comments).where(eq(comments.id, commentId));

        return NextResponse.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json(
            { error: 'Failed to delete comment' },
            { status: 500 }
        );
    }
}
