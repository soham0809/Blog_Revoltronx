'use client';

import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import BlogEditor from '@/components/BlogEditor';

export default function NewBlogPage() {
    const router = useRouter();

    const handleSave = (blog) => {
        // Optionally redirect after first save
        if (blog && blog._id) {
            router.push(`/edit/${blog._id}`);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Toaster position="bottom-right" />
            <div className="container mx-auto py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-center">Create New Blog</h1>
                </div>
                <BlogEditor onSave={handleSave} />
            </div>
        </main>
    );
} 