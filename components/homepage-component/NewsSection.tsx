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
    {
    id: '5',
    image: '/caorusel-images/item-2.png',
    date: '4 Jan, 2026',
    title: 'New Property Acquisition Project Announced',
    description: 'Major property acquisition initiative to transform uneven terrains into thriving communities...',
    },
    {
      id: '6',
      image: '/caorusel-images/item-3.png',
      date: '31 Dec, 2025',
      title: 'Annual General Meeting Held Successfully',
      description: 'Shareholders gather for the annual general meeting to discuss future growth strategies...',
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
        <div className="mb-10 md:mb-16 relative">
          <div className="inline-block">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              {t('heading')}
            </h2>
            <ColorBand rightColor="secondary"/>
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
        <div className="relative">

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
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / itemsPerView}%`}}
                >
                  <div className="h-full">
                    <div className="group bg-white border border-b-0 border-white hover:bg-primary transition-all duration-300 overflow-hidden h-full flex flex-col shadow-md cursor-pointer">
                      {/* Image Container */}
                      <div className="relative aspect-[16/9] overflow-hidden">
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
                        <h3 className="text-md md:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-white mb-2 transition-colors duration-300 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-700 text-sm md:text-base text-gray-600 group-hover:text-white/90 mb-3 flex-1 transition-colors duration-300 line-clamp-3">
                          {item.description}
                        </p>
                        
                        {/* Read More Button */}
                        <button className="self-start inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white text-sm md:text-base font-medium rounded hover:bg-secondary/90 transition-colors">
                          {t('readMore')}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {/* Bottom Band */}
                      <div className="h-2 bg-secondary"></div>
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
