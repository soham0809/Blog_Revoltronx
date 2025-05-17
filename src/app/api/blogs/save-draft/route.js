import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();

        if (!data.title || !data.content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        // If an ID is provided, update existing blog, otherwise create new
        if (data._id) {
            const updatedBlog = await Blog.findByIdAndUpdate(
                data._id,
                {
                    title: data.title,
                    content: data.content,
                    tags: data.tags || [],
                    status: 'draft',
                    updatedAt: new Date()
                },
                { new: true }
            );

            if (!updatedBlog) {
                return NextResponse.json(
                    { error: 'Blog not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { message: 'Draft updated successfully', blog: updatedBlog },
                { status: 200 }
            );
        } else {
            // Create new blog draft
            const newBlog = new Blog({
                title: data.title,
                content: data.content,
                tags: data.tags || [],
                status: 'draft'
            });

            await newBlog.save();

            return NextResponse.json(
                { message: 'Draft created successfully', blog: newBlog },
                { status: 201 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
} 