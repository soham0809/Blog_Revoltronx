'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <header className="bg-white shadow-sm py-4">
                    <div className="container mx-auto px-4 flex justify-between items-center">
                        <Link href="/" className="text-2xl font-bold text-blue-600">
                            Blog Editor
                        </Link>
                        <nav className="flex gap-4">
                            <Link
                                href="/"
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                            >
                                All Blogs
                            </Link>
                            <Link
                                href="/new"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Create New Blog
                            </Link>
                        </nav>
                    </div>
                </header>
                {children}
                <Toaster position="bottom-right" />
            </body>
        </html>
    );
} 