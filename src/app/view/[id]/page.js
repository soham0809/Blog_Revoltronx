'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import API from '@/lib/api';
import { useParams } from 'next/navigation';

export default function ViewBlogPage() {
    const router = useRouter();
    const params = useParams();
    const blogId = params?.id;
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!blogId) {
                setError('Blog ID is missing');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log('Fetching blog with ID:', blogId);
                const blogData = await API.getBlogById(blogId);
                console.log('Blog data received:', blogData);
                setBlog(blogData);
            } catch (error) {
                console.error('Error fetching blog:', error);
                setError('Failed to load blog');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [blogId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto">
                    <div className="max-w-3xl mx-auto p-4">
                        <div className="flex justify-center">
                            <p className="text-lg">Loading blog...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto">
                    <div className="max-w-3xl mx-auto p-4">
                        <div className="text-center">
                            <p className="text-red-500 text-lg mb-4">{error || 'Blog not found'}</p>
                            <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                                Back to Blogs
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <Toaster position="bottom-right" />
            <div className="container mx-auto">
                <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
                            <div className="flex items-center text-sm text-gray-500">
                                <span className="mr-4">
                                    {blog.status === 'published' ? 'Published' : 'Draft'} {new Date(blog.updatedAt).toLocaleDateString()}
                                </span>
                                {blog.tags && blog.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {blog.tags.map(tag => (
                                            <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="prose prose-lg max-w-none mb-8">
                            <div
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                                className="blog-content"
                            />
                        </div>

                        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                            <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                                Back to Blogs
                            </Link>
                            <Link href={`/edit/${blog._id}`} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Edit This Blog
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
} 