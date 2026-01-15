'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Calendar, ArrowLeft, Loader2, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { apiGet } from '@/lib/api-client';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from 'next/link';

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

export default function BlogDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const router = useRouter();
    const t = useTranslations('NewsSection');

    const [blog, setBlog] = useState<BlogDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogDetail = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                // Using the standard api/blogs/{slug} endpoint as per common FastAPI patterns
                const data = await apiGet<BlogDetail>(`api/blogs/slug/${slug}`);
                setBlog(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching blog detail:', err);
                // Fallback or retry with different endpoint if needed
                setError('Blog post not found');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogDetail();
    }, [slug]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-gray-500 animate-pulse">Loading news detail...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !blog) {
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
                            Back to Media
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const formattedDate = blog.published_date
        ? new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(new Date(blog.published_date))
        : 'Recently Published';

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white">
                {/* Hero / Cover Image */}
                <div className="relative w-full h-[40vh] md:h-[60vh] bg-gray-900">
                    <Image
                        src={blog.image_url}
                        alt={blog.title}
                        fill
                        className="object-cover opacity-70"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full">
                        <div className="wrapper pb-12">
                            <Link
                                href="/media"
                                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors text-sm font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Media Center
                            </Link>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight max-w-5xl">
                                {blog.title}
                            </h1>
                            {blog.title_np && (
                                <h2 className="text-xl md:text-3xl font-medium text-white/90 mb-6 font-nebali">
                                    {blog.title_np}
                                </h2>
                            )}
                            <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-secondary" />
                                    <span>{formattedDate}</span>
                                </div>
                                {blog.author && (
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                        <span>By {blog.author}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="wrapper py-12 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Main Content */}
                        <article className="lg:col-span-9">
                            {/* Content Rendered from HTML with whitespace preservation for newlines */}
                            <div
                                className="prose prose-lg md:prose-xl max-w-none prose-headings:text-primary prose-a:text-secondary prose-img:rounded-2xl whitespace-pre-line text-justify"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />

                            {/* Image Gallery if multiple images exist */}
                            {blog.image_urls && blog.image_urls.length > 1 && (
                                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {blog.image_urls.map((url, index) => (
                                        <div key={index} className="relative aspect-video overflow-hidden group">
                                            <Image
                                                src={url}
                                                alt={`${blog.title} - image ${index + 1}`}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-3 space-y-4">
                            {/* Share Box */}
                            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                                    <Share2 className="w-5 h-5 text-secondary" />
                                    Share this news
                                </h3>
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                                        className="flex items-center gap-3 w-full p-3 bg-white border border-gray-200 rounded-xl hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all group"
                                    >
                                        <Facebook className="w-5 h-5 text-[#1877F2] group-hover:text-white" />
                                        <span className="font-medium">Facebook</span>
                                    </button>
                                    <button
                                        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`, '_blank')}
                                        className="flex items-center gap-3 w-full p-3 bg-white border border-gray-200 rounded-xl hover:bg-black hover:text-white hover:border-black transition-all group"
                                    >
                                        <Twitter className="w-5 h-5 text-black group-hover:text-white" />
                                        <span className="font-medium">Twitter</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(shareUrl);
                                            alert('Link copied to clipboard!');
                                        }}
                                        className="flex items-center gap-3 w-full p-3 bg-white border border-gray-200 rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all group"
                                    >
                                        <LinkIcon className="w-5 h-5 text-primary group-hover:text-white" />
                                        <span className="font-medium">Copy Link</span>
                                    </button>
                                </div>
                            </div>

                            {/* Related/Latest Sidebar Callout */}
                            <div className="bg-primary rounded-2xl p-8 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-4">Stay Informed</h3>
                                    <p className="text-white/80 mb-6 text-sm leading-relaxed">
                                        Get the latest updates and financial news directly in your inbox. Support Nepal's growth with Nepal Bhumi Bank.
                                    </p>
                                    <Link
                                        href="/media"
                                        className="w-full inline-flex items-center justify-center gap-2 text-sm text-secondary hover:gap-3 transition-all bg-white px-4 py-2 rounded-xl"
                                    >
                                        View more news
                                        <ArrowLeft className="w-4 h-4 rotate-180" />
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
