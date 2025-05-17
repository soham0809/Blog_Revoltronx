'use client';

import BlogList from '@/components/BlogList';

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">Blog Editor Platform</h1>
                    <p className="text-gray-600">Write, edit, and publish your blog posts</p>
                </div>
                <BlogList />
            </div>
        </main>
    );
} 