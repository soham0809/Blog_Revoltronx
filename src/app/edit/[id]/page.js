'use client';

import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import BlogEditor from '@/components/BlogEditor';
import { useParams } from 'next/navigation';

export default function EditBlogPage() {
    const router = useRouter();
    const params = useParams();
    const blogId = params?.id;

    const handleSave = (blog) => {
        // We don't need to navigate since we're already on the edit page
    };

    if (!blogId) {
        return (
            <main className="min-h-screen bg-gray-50">
                <Toaster position="bottom-right" />
                <div className="container mx-auto py-8">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">Blog ID is missing</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Toaster position="bottom-right" />
            <div className="container mx-auto py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-center">Edit Blog</h1>
                </div>
                <BlogEditor blogId={blogId} onSave={handleSave} />
            </div>
        </main>
    );
} 