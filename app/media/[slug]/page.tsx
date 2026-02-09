import { Metadata } from 'next';
import BlogDetailClient from './BlogDetailClient';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

interface SEOData {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
}

interface BlogDetail {
    id: string;
    title: string;
    title_np?: string;
    content: string;
    author: string;
    published_date?: string;
    image_url: string;
    image_urls: string[];
    slug?: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    seo_data?: SEOData;
}

// Server-side function to fetch blog data
async function getBlogBySlug(slug: string): Promise<BlogDetail | null> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_URI || 'http://127.0.0.1:8000/';
        // Ensure no double slashes
        const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
        const url = `${baseUrl}/api/blogs/slug/${slug}`;
        
        console.log('Fetching blog from:', url); // Debug log
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('API response not OK:', response.status, response.statusText);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching blog:', error);
        return null;
    }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        return {
            title: 'Post Not Found | Nepal Bhumi Bank Limited',
            description: 'The news story you are looking for might have been moved or deleted.',
        };
    }

    // Use SEO data if available, otherwise fallback to blog data
    const title = blog.seo_data?.meta_title || blog.title;
    const description = blog.seo_data?.meta_description || 
        blog.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 160);
    const keywords = blog.seo_data?.meta_keywords;
    const imageUrl = blog.image_url;

    return {
        title: `${title} | Nepal Bhumi Bank Limited`,
        description,
        keywords: keywords ? keywords.split(',').map(k => k.trim()) : undefined,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: blog.title,
                },
            ],
            type: 'article',
            publishedTime: blog.published_date,
            authors: blog.author ? [blog.author] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
    };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);
    const t = await getTranslations('NewsSection');

    if (!blog) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex flex-col items-center justify-center p-4">
                    <div className="text-center max-w-md">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
                        <p className="text-gray-600 mb-8">The news story you are looking for might have been moved or deleted.</p>
                        <Link
                            href="/media"
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('backToMedia')}
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return <BlogDetailClient blog={blog} />;
}
