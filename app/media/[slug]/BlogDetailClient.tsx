'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Calendar, ArrowLeft, Share2, Facebook, Twitter, Link as LinkIcon, Check } from 'lucide-react';
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

interface BlogDetailClientProps {
    blog: BlogDetail;
}

// Helper function to get locale from cookie
const getLocaleFromCookie = (): 'ne' | 'en' => {
    if (typeof document === 'undefined') return 'ne';
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1];
    return cookieValue === 'en' ? 'en' : 'ne';
};

export default function BlogDetailClient({ blog }: BlogDetailClientProps) {
    const t = useTranslations('NewsSection');
    const [linkCopied, setLinkCopied] = useState(false);
    const [locale] = useState<'ne' | 'en'>(getLocaleFromCookie());

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
                <div className="relative w-full bg-gray-900">
                    <Image
                        src={blog.image_url}
                        alt={blog.title}
                        fill
                        className="object-cover opacity-70"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="relative z-10">
                        <div className="wrapper pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16 lg:pb-20">
                            <Link
                                href="/media"
                                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors text-sm font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                {t('backToMedia')}
                            </Link>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight max-w-5xl break-words">
                                {locale === 'ne' && blog.title_np ? blog.title_np : blog.title}
                            </h1>
                            {locale === 'ne' && blog.title && blog.title_np && (
                                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-white/90 mb-6 break-words">
                                    {blog.title}
                                </h2>
                            )}
                            {locale === 'en' && blog.title_np && (
                                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-white/90 mb-6 font-nebali break-words">
                                    {blog.title_np}
                                </h2>
                            )}
                        </div>
                    </div>
                </div>

                <div className="wrapper py-12 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Main Content */}
                        <article className="lg:col-span-9">
                            {/* Content Rendered from HTML with whitespace preservation for newlines */}
                            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-black/90 text-sm md:text-base pb-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-secondary flex-shrink-0" />
                                    <span>{formattedDate}</span>
                                </div>
                                {blog.author && (
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                                        <span>By {blog.author}</span>
                                    </div>
                                )}
                            </div>
                            <div
                                className="prose prose-lg md:prose-xl max-w-none prose-headings:text-primary prose-a:text-secondary prose-img:rounded-2xl whitespace-pre-line text-justify pt-2"
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
                                            setLinkCopied(true);
                                            setTimeout(() => setLinkCopied(false), 2000);
                                        }}
                                        className="flex items-center gap-3 w-full p-3 bg-white border border-gray-200 rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all group"
                                    >
                                        {linkCopied ? (
                                            <Check className="w-5 h-5 flex-shrink-0 text-green-600 group-hover:text-white" />
                                        ) : (
                                            <LinkIcon className="w-5 h-5 flex-shrink-0 text-primary group-hover:text-white" />
                                        )}
                                        <span className="font-medium">
                                            {linkCopied ? 'Link Copied!' : 'Copy Link'}
                                        </span>
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
