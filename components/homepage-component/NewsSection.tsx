'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ColorBand from '../ColorBand';

interface NewsItem {
  id: string;
  image: string;
  date: string;
  title: string;
  description: string;
}

const NewsSection = () => {
  const t = useTranslations('NewsSection');
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

  // Dummy news data - will be replaced with backend data
  const newsItems: NewsItem[] = [
    {
      id: '1',
      image: '/caorusel-images/item-1.png',
      date: '8 Jan, 2026',
      title: 'Sustainable Land Development Partnership Agreement Signed',
      description: 'Nepal Bhumi Bank Limited signs strategic partnership for sustainable land development across Nepal...',
    },
    {
      id: '2',
      image: '/caorusel-images/item-2.png',
      date: '4 Jan, 2026',
      title: 'New Property Acquisition Project Announced',
      description: 'Major property acquisition initiative to transform uneven terrains into thriving communities...',
    },
    {
      id: '3',
      image: '/caorusel-images/item-3.png',
      date: '31 Dec, 2025',
      title: 'Annual General Meeting Held Successfully',
      description: 'Shareholders gather for the annual general meeting to discuss future growth strategies...',
    },
    {
      id: '4',
      image: '/caorusel-images/item-4.png',
      date: '27 Dec, 2025',
      title: 'Eco-Friendly Community Development Initiative',
      description: 'Launch of new eco-friendly community development project with modern amenities...',
    },
  ];

  const maxIndex = Math.max(0, newsItems.length - itemsPerView);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

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
        <div className="mb-10 md:mb-16">
          <div className="inline-block">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              {t('heading')}
            </h2>
            <ColorBand />
          </div>
        </div>

        {/* News Carousel */}
        <div className="relative bg-white">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 bg-white hover:bg-gray-300 text-primary p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl items-center justify-center"
            aria-label="Previous news"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 bg-white hover:bg-gray-300 text-primary p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl items-center justify-center"
            aria-label="Next news"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

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
                <div
                  key={item.id}
                  className="flex-shrink-0"
                  style={{ width: `${100 / itemsPerView}%`, paddingRight: '1.5rem' }}
                >
                  <div className="h-full">
                    <div className="group bg-white border border-white/20 hover:bg-primary hover:border-white transition-all duration-300 overflow-hidden h-full flex flex-col shadow-md cursor-pointer">
                      {/* Image Container */}
                      <div className="relative w-full h-32 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        {/* Date Badge */}
                        <div className="absolute bottom-0 right-0 bg-secondary text-white px-3 py-1 text-xs font-medium">
                          {item.date}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 flex flex-col">
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-white mb-2 transition-colors duration-300 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 group-hover:text-white/90 mb-3 flex-1 transition-colors duration-300 line-clamp-2">
                          {item.description}
                        </p>
                        
                        {/* Read More Button */}
                        <button className="self-start inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white text-xs font-medium rounded hover:bg-secondary/90 transition-colors">
                          {t('readMore')}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Bottom Band */}
                      <div className="h-1 bg-secondary"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8 md:hidden">
            {newsItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
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
