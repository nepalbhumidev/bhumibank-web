'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight, Loader2 } from 'lucide-react';
import { apiGet } from '@/lib/api-client';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from 'next/link';

interface BlogListItem {
  id: string;
  title: string;
  title_np?: string;
  image_url: string;
  image_urls: string[];
  content?: string;
  published_date?: string;
  slug?: string;
}

export default function MediaPage() {
  const t = useTranslations('MediaPage');
  const [newsItems, setNewsItems] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Page limit set to 20 as requested
        const data = await apiGet<BlogListItem[]>('api/blogs?limit=20&sort_by=published_date&sort_order=-1');
        setNewsItems(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load news items');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="wrapper py-8 md:py-12 lg:py-16">
          {/* Header */}
          <div className="mb-12 border-b border-gray-200 pb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
              {t('heading')}
            </h1>
            <p className="text-gray-600 max-w-3xl text-lg">
              {t('subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-gray-500 italic animate-pulse">Fetching the latest news...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-red-100">
              <p className="text-xl font-semibold text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newsItems.map((item) => (
                <Link key={item.id} href={`/media/${item.slug}`} className="h-full">
                  <div className="group bg-white border border-gray-100 hover:bg-primary transition-all duration-300 overflow-hidden h-full flex flex-col shadow-md hover:shadow-2xl cursor-pointer">
                    {/* Image Container */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={item.image_url || '/placeholder-image.png'}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Date Badge */}
                      <div className="absolute bottom-0 right-0 bg-secondary text-white px-3 py-1.5 text-xs font-semibold">
                        {item.published_date
                          ? new Intl.DateTimeFormat('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }).format(new Date(item.published_date))
                          : 'Recently'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-white mb-3 transition-colors duration-300 line-clamp-2 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 group-hover:text-white/90 mb-4 transition-colors duration-300 line-clamp-3 text-sm md:text-base leading-relaxed">
                        {item.content?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}
                      </p>

                      {/* Read More Button */}
                      <div className="mt-auto self-start inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-white text-sm rounded hover:bg-secondary/90 transition-all group-hover:gap-3">
                        {t('readMore')}
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                    {/* Bottom Band */}
                    <div className="h-2 bg-secondary transform origin-left transition-transform duration-300 group-hover:scale-x-110"></div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && newsItems.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 italic text-lg">No news items found at the moment. Please check back later.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
