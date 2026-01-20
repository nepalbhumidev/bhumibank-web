'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Loader2, Image as ImageIcon } from 'lucide-react';
import ColorBand from '../ColorBand';
import { apiGet } from '@/lib/api-client';
import Link from 'next/link';

interface Gallery {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  cover_image_public_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  image_count: number;
}

const GallerySection = () => {
  const t = useTranslations('GallerySection');
  const [galleries, setGalleries] = useState<Gallery[]>([]);
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
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        const data = await apiGet<Gallery[]>('api/gallery?limit=6&sort_by=created_at&sort_order=-1');

        setGalleries(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching galleries:', err);
        setError('Failed to load galleries');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  const maxIndex = Math.max(0, galleries.length - itemsPerView);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Autoscroll every 5 seconds
  useEffect(() => {
    if (galleries.length <= itemsPerView) return; // Don't autoscroll if all items are visible

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev >= maxIndex ? 0 : prev + 1;
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [maxIndex, itemsPerView, galleries.length]);

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
        <div className="mb-8 md:mb-12 relative">
          <div className="inline-block">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              {t('heading')}
            </h2>
            <ColorBand rightColor="secondary" />
          </div>
          <p className="mt-2 text-white/90 text-sm md:text-base lg:text-lg">
            {t('subtitle')}
          </p>

          {/* Navigation Controls - Desktop */}
          <div className="hidden md:flex items-center gap-3 absolute bottom-0 right-0">
            <button
              onClick={goToPrevious}
              className="w-12 h-12 rounded-full bg-white border-2 border-white hover:border-secondary hover:bg-secondary text-primary flex items-center justify-center transition-all duration-500 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous gallery"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="w-12 h-12 rounded-full bg-secondary text-white hover:bg-secondary/90 flex items-center justify-center transition-all duration-500 shadow-md hover:shadow-xl"
              aria-label="Next gallery"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Gallery Carousel */}
        <div className="relative">
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
              {galleries.map((gallery) => (
                <Link
                  key={gallery.id}
                  href={`/gallery`}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="h-full">
                    <div className="group bg-white border border-b-0 border-white hover:bg-primary transition-all duration-500 overflow-hidden h-full flex flex-col shadow-md cursor-pointer">
                      {/* Image Container */}
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={gallery.cover_image_url}
                          alt={gallery.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Image Count Badge */}
                        <div className="absolute top-2 right-2 bg-black/50 text-white px-3 py-1 text-xs font-medium rounded flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          {gallery.image_count} {gallery.image_count === 1 ? 'image' : 'images'}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 flex flex-col">
                        <h3 className="text-md md:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-500 line-clamp-2">
                          {gallery.title}
                        </h3>
                      </div>
                      {/* Bottom Band */}
                      <div className="h-2 bg-secondary transform origin-left transition-transform duration-500 group-hover:scale-x-110"></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8 md:hidden">
            {galleries.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-500 rounded-full ${index === currentIndex
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/50'
                  }`}
                aria-label={`Go to gallery ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
