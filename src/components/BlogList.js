import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import API from '@/lib/api';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'published', or 'drafts'

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching blogs...');
            const blogsData = await API.getAllBlogs();
            console.log('Blogs received:', blogsData);
            setBlogs(blogsData || []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setError('Failed to fetch blogs. Please try again later.');
            toast.error('Failed to fetch blogs');
        } finally {
            setLoading(false);
        }
    };

    // Group blogs by status
    const draftBlogs = blogs.filter(blog => blog.status === 'draft');
    const publishedBlogs = blogs.filter(blog => blog.status === 'published');

    // Determine which blogs to display based on active tab
    const displayBlogs =
        activeTab === 'published' ? publishedBlogs :
            activeTab === 'drafts' ? draftBlogs :
                blogs; // 'all' tab

    if (loading) {
        return <div className="flex justify-center p-8">Loading blogs...</div>;
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={fetchBlogs}
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (blogs.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No blogs found</p>
                <Link
                    href="/new"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Create New Blog
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Blogs</h1>
                <Link
                    href="/new"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Create New Blog
                </Link>
            </div>

            {/* Tab navigation */}
            <div className="flex border-b mb-6">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-500'}`}
                >
                    All Blogs ({blogs.length})
                </button>
                <button
                    onClick={() => setActiveTab('published')}
                    className={`px-4 py-2 ${activeTab === 'published' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-500'}`}
                >
                    Published ({publishedBlogs.length})
                </button>
                <button
                    onClick={() => setActiveTab('drafts')}
                    className={`px-4 py-2 ${activeTab === 'drafts' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-500'}`}
                >
                    Drafts ({draftBlogs.length})
                </button>
            </div>

            {/* Blog list */}
            {displayBlogs.length === 0 ? (
                <p className="text-gray-500 py-4">No blogs to display in this category</p>
            ) : (
                <div className="space-y-4">
                    {displayBlogs.map(blog => (
                        <div
                            key={blog._id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-medium text-lg line-clamp-1">{blog.title}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full ${blog.status === 'published'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {blog.status === 'published' ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {blog.status === 'published'
                                            ? `Published: ${new Date(blog.updatedAt).toLocaleDateString()}`
                                            : `Last edited: ${new Date(blog.updatedAt).toLocaleDateString()}`}
                                    </div>
                                    {blog.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {blog.tags.map(tag => (
                                                <span key={tag} className="mr-1 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 self-start shrink-0">
                                    <Link
                                        href={`/view/${blog._id}`}
                                        className="px-3 py-1.5 bg-green-100 text-green-600 rounded-md hover:bg-green-200 text-sm font-medium whitespace-nowrap"
                                    >
                                        Read
                                    </Link>
                                    <Link
                                        href={`/edit/${blog._id}`}
                                        className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 text-sm font-medium whitespace-nowrap"
                                    >
                                        {blog.status === 'published' ? 'Edit' : 'Continue'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogList; 