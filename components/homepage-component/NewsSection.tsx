'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import ColorBand from '../ColorBand';
import { apiGet } from '@/lib/api-client';
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

const NewsSection = () => {
  const t = useTranslations('NewsSection');
  const [newsItems, setNewsItems] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3); // lg: 3 items
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2); // md: 2 items
      } else {
        setItemsPerView(1); // mobile: 1 item
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await apiGet<BlogListItem[]>('api/blogs?limit=6&sort_by=published_date&sort_order=-1');

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

  const maxIndex = Math.max(0, newsItems.length - itemsPerView);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Autoscroll every 5 seconds
  useEffect(() => {
    if (newsItems.length <= itemsPerView) return; // Don't autoscroll if all items are visible

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev >= maxIndex ? 0 : prev + 1;
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [maxIndex, itemsPerView, newsItems.length]);

  // Touch event handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      goToNext();
    }
    if (distance < -minSwipeDistance) {
      goToPrevious();
    }
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-primary relative">
      <div className="wrapper relative z-10">
        {/* Heading */}
        <div className="mb-10 md:mb-16 relative">
          <div className="inline-block">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              {t('heading')}
            </h2>
            <ColorBand rightColor="secondary" />
            <p className="mt-2 text-white/90 text-sm md:text-base lg:text-lg">
              {t('subtitle')}
            </p>
          </div>

          {/* Navigation Controls - Desktop */}
          <div className="hidden md:flex items-center gap-3 absolute bottom-0 right-0">
            <button
              onClick={goToPrevious}
              className="w-12 h-12 rounded-full bg-white border-2 border-white hover:border-secondary hover:bg-secondary text-primary flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous news"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="w-12 h-12 rounded-full bg-secondary text-white hover:bg-secondary/90 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-xl"
              aria-label="Next news"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* News Carousel */}
        <div className="relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center z-20 text-white text-center">
              <div>
                <p className="text-xl font-semibold mb-2">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-secondary rounded hover:bg-secondary/90 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Carousel Container */}
          <div
            className="overflow-hidden mx-4 md:mx-0"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {newsItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/media/${item.slug}`}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="h-full">
                    <div className="group bg-white border border-b-0 border-white hover:bg-primary transition-all duration-300 overflow-hidden h-full flex flex-col shadow-md cursor-pointer">
                      {/* Image Container */}
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        {/* Date Badge */}
                        <div className="absolute bottom-0 right-0 bg-secondary text-white px-3 py-1 text-xs font-medium">
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
                      <div className="flex-1 p-4 flex flex-col">
                        <h3 className="text-md md:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-white mb-2 transition-colors duration-300 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 group-hover:text-white/90 mb-4 transition-colors duration-300 line-clamp-3">
                          {item.content?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}
                        </p>
                        {/* Read More Button */}
                        <div className="mt-auto self-start inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white text-sm md:text-base rounded hover:bg-secondary/90 transition-colors group-hover:gap-3">
                          {t('readMore')}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      {/* Bottom Band */}
                      <div className="h-2 bg-secondary transform origin-left transition-transform duration-300 group-hover:scale-x-110"></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8 md:hidden">
            {newsItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${index === currentIndex
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/50'
                  }`}
                aria-label={`Go to news ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
