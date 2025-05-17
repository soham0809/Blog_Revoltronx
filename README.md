# Blog Editor with Auto-Save Draft Feature

A full-stack blog editor application with auto-save functionality, built with Next.js, React, and MongoDB.

## Features

- Create, edit, and publish blog posts
- Rich text editor for content
- Auto-save drafts
  - After 5 seconds of inactivity (debouncing)
  - Every 30 seconds automatically
- Visual notification when content is auto-saved
- Separate views for published posts and drafts
- Tag support for blog organization

## Tech Stack

### Frontend

- Next.js 13+ (App Router)
- React
- TailwindCSS for styling
- React Quill for rich text editing
- React Hot Toast for notifications
- Axios for API requests

### Backend

- Next.js API Routes
- MongoDB for database

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd blog-editor
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Project Structure

```
/blog-editor
  /src
    /app                 # Next.js App Router
      /api               # API routes
        /blogs           # Blog endpoints
      /edit/[id]         # Edit blog page
      /new               # Create new blog page
      page.js            # Home page
      layout.js          # Root layout
    /components          # React components
      BlogEditor.js      # Main editor component
      BlogList.js        # List of blogs
    /lib                 # Utility functions
      api.js             # API client
      mongodb.js         # Database connection
    /models              # Database models
      Blog.js            # Blog schema
```

## API Endpoints

- `GET /api/blogs` - Retrieve all blogs
- `GET /api/blogs/:id` - Retrieve a blog by ID
- `POST /api/blogs/save-draft` - Save or update a draft
- `POST /api/blogs/publish` - Save and publish an article

## Schema Design

### Blog Model

- `id`: Unique identifier
- `title`: String
- `content`: String (Rich Text)
- `tags`: Array of Strings
- `status`: String (draft or published)
- `createdAt`: Date
- `updatedAt`: Date

## Auto-Save Implementation

The auto-save feature works in two ways:

1. A timer automatically saves the current state every 30 seconds
2. Debouncing detects when the user stops typing for 5 seconds and triggers a save

Visual notifications appear when content is auto-saved using React Hot Toast.

## License

MIT
"# Blog_Revoltronx" 
