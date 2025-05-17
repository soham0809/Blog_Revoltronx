import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function GET(request, context) {
    try {
        await connectDB();
        // Get the ID from the context params
        const id = context.params.id;
        console.log('Fetching blog with ID:', id);

        const blog = await Blog.findById(id);

        if (!blog) {
            console.log('Blog not found for ID:', id);
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        console.log('Blog found:', blog.title);
        return NextResponse.json({ blog }, { status: 200 });
    } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 