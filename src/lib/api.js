import axios from 'axios';

const API = {
    // Get all blogs
    getAllBlogs: async () => {
        try {
            console.log('API: Fetching all blogs');
            const response = await axios.get('/api/blogs');
            console.log('API response:', response.data);
            return response.data.blogs || [];
        } catch (error) {
            console.error('API Error fetching blogs:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
            throw error;
        }
    },

    // Get a single blog by ID
    getBlogById: async (id) => {
        try {
            const response = await axios.get(`/api/blogs/${id}`);
            return response.data.blog;
        } catch (error) {
            console.error(`Error fetching blog ${id}:`, error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
            throw error;
        }
    },

    // Save a blog as draft
    saveDraft: async (blogData) => {
        try {
            const response = await axios.post('/api/blogs/save-draft', blogData);
            return response.data;
        } catch (error) {
            console.error('Error saving draft:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
            throw error;
        }
    },

    // Publish a blog
    publishBlog: async (blogData) => {
        try {
            const response = await axios.post('/api/blogs/publish', blogData);
            return response.data;
        } catch (error) {
            console.error('Error publishing blog:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
            throw error;
        }
    }
};

export default API; 