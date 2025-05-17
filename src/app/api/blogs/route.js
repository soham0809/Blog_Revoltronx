import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function GET() {
    try {
        console.log('Fetching all blogs...');
        await connectDB();
        const blogs = await Blog.find({}).sort({ updatedAt: -1 });
        console.log(`Found ${blogs.length} blogs`);

        return NextResponse.json({ blogs }, { status: 200 });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 