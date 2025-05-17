import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import API from '@/lib/api';

// Use a simple textarea instead of ReactQuill to avoid compatibility issues
const BlogEditor = ({ blogId, onSave }) => {
    const [blog, setBlog] = useState({
        _id: null,
        title: '',
        content: '',
        tags: '',
        status: 'draft'
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const timerRef = useRef(null);
    const lastSavedRef = useRef(null);
    const typingTimerRef = useRef(null);

    // Fetch blog data if editing an existing blog
    useEffect(() => {
        const fetchBlog = async () => {
            if (blogId) {
                try {
                    setLoading(true);
                    const blogData = await API.getBlogById(blogId);

                    setBlog({
                        _id: blogData._id,
                        title: blogData.title,
                        content: blogData.content,
                        tags: blogData.tags.join(', '),
                        status: blogData.status
                    });

                    // Store initial state for comparison during auto-save
                    lastSavedRef.current = {
                        title: blogData.title,
                        content: blogData.content,
                        tags: blogData.tags.join(', ')
                    };
                } catch (error) {
                    toast.error('Error loading blog');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchBlog();

        // Clear any timers when unmounting
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        };
    }, [blogId]);

    // Start auto-save timer
    useEffect(() => {
        // Auto-save every 30 seconds
        timerRef.current = setInterval(() => {
            handleAutoSave();
        }, 30000); // 30 seconds

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [blog]);

    // Check if content has changed
    const hasChanged = () => {
        if (!lastSavedRef.current) return blog.title || blog.content;

        return (
            blog.title !== lastSavedRef.current.title ||
            blog.content !== lastSavedRef.current.content ||
            blog.tags !== lastSavedRef.current.tags
        );
    };

    // Auto-save when user stops typing for 5 seconds
    const handleContentChange = (e) => {
        const value = e.target.value;
        setBlog(prev => ({ ...prev, content: value }));

        // Clear previous timer
        if (typingTimerRef.current) {
            clearTimeout(typingTimerRef.current);
        }

        // Set new timer - will auto-save after 5 seconds of inactivity
        typingTimerRef.current = setTimeout(() => {
            handleAutoSave();
        }, 5000); // 5 seconds
    };

    const handleTitleChange = (e) => {
        setBlog(prev => ({ ...prev, title: e.target.value }));

        // Clear previous timer
        if (typingTimerRef.current) {
            clearTimeout(typingTimerRef.current);
        }

        // Set new timer - will auto-save after 5 seconds of inactivity
        typingTimerRef.current = setTimeout(() => {
            handleAutoSave();
        }, 5000); // 5 seconds
    };

    const handleTagsChange = (e) => {
        setBlog(prev => ({ ...prev, tags: e.target.value }));
    };

    // Auto-save draft function
    const handleAutoSave = async () => {
        // Only save if there are changes and we have content
        if (hasChanged() && blog.title && blog.content) {
            try {
                setSaving(true);

                // Prepare data for API
                const blogData = {
                    ...blog,
                    tags: blog.tags ? blog.tags.split(',').map(tag => tag.trim()) : []
                };

                const response = await API.saveDraft(blogData);

                // Update the blog ID if this was a new blog
                if (!blog._id && response.blog._id) {
                    setBlog(prev => ({ ...prev, _id: response.blog._id }));
                }

                // Update the last saved reference
                lastSavedRef.current = {
                    title: blog.title,
                    content: blog.content,
                    tags: blog.tags
                };

                toast.success('Draft auto-saved');

                // Call the onSave callback if provided
                if (onSave) {
                    onSave(response.blog);
                }
            } catch (error) {
                toast.error('Failed to auto-save draft');
            } finally {
                setSaving(false);
            }
        }
    };

    // Manual save as draft
    const handleSaveDraft = async () => {
        if (!blog.title || !blog.content) {
            toast.error('Title and content are required');
            return;
        }

        try {
            setSaving(true);

            // Prepare data for API
            const blogData = {
                ...blog,
                tags: blog.tags ? blog.tags.split(',').map(tag => tag.trim()) : []
            };

            const response = await API.saveDraft(blogData);

            // Update the blog ID if this was a new blog
            if (!blog._id && response.blog._id) {
                setBlog(prev => ({ ...prev, _id: response.blog._id }));
            }

            // Update the last saved reference
            lastSavedRef.current = {
                title: blog.title,
                content: blog.content,
                tags: blog.tags
            };

            toast.success('Draft saved successfully');

            // Call the onSave callback if provided
            if (onSave) {
                onSave(response.blog);
            }
        } catch (error) {
            toast.error('Failed to save draft');
        } finally {
            setSaving(false);
        }
    };

    // Publish blog
    const handlePublish = async () => {
        if (!blog.title || !blog.content) {
            toast.error('Title and content are required');
            return;
        }

        try {
            setSaving(true);

            // Prepare data for API
            const blogData = {
                ...blog,
                tags: blog.tags ? blog.tags.split(',').map(tag => tag.trim()) : []
            };

            const response = await API.publishBlog(blogData);

            toast.success('Blog published successfully');

            // Update the blog status
            setBlog(prev => ({ ...prev, status: 'published' }));

            // Call the onSave callback if provided
            if (onSave) {
                onSave(response.blog);
            }
        } catch (error) {
            toast.error('Failed to publish blog');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={blog.title}
                    onChange={handleTitleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter blog title"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                </label>
                <textarea
                    id="content"
                    value={blog.content}
                    onChange={handleContentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-64"
                    placeholder="Write your blog content here..."
                ></textarea>
            </div>

            <div className="mb-4">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                </label>
                <input
                    type="text"
                    id="tags"
                    value={blog.tags}
                    onChange={handleTagsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="tag1, tag2, tag3"
                />
            </div>

            <div className="flex justify-between mt-6">
                <div className="text-sm text-gray-500">
                    {saving ? 'Saving...' : ''}
                    {blog.status === 'published' && <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Published</span>}
                </div>
                <div className="space-x-2">
                    <button
                        onClick={handleSaveDraft}
                        disabled={saving}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                        Save as Draft
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Publish
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogEditor; 