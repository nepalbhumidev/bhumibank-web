'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { carouselImages } from '@/constants/carousel';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? carouselImages.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % carouselImages.length;
    goToSlide(newIndex);
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
    const minSwipeDistance = 50; // Minimum distance for a swipe

    if (distance > minSwipeDistance) {
      // Swipe left - go to next
      goToNext();
    }
    if (distance < -minSwipeDistance) {
      // Swipe right - go to previous
      goToPrevious();
    }
  };

  return (
    // 1/1 sm:3/1
    <div className="relative w-full aspect-[1/1] sm:aspect-[3/1]">
      <div 
        className="relative w-full h-full overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {carouselImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Desktop image (sm and above) */}
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover hidden sm:block"
              priority={index === 0}
              sizes="100vw"
            />
            {/* Mobile image (smaller than sm) */}
            {image.mobileSrc && (
              <Image
                src={image.mobileSrc}
                alt={image.alt}
                fill
                className="object-cover sm:hidden"
                priority={index === 0}
                sizes="100vw"
              />
            )}
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="hidden sm:block absolute left-12 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white/90 backdrop-blur-sm text-primary p-2 rounded-full shadow-md transition-all duration-300 hover:shadow-lg group"
          aria-label="Previous slide"
        >
          <svg
            className="w-6 h-6 transition-transform duration-300 group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="hidden sm:block absolute right-12 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white/90 backdrop-blur-sm text-primary p-2 rounded-full shadow-md transition-all duration-300 hover:shadow-lg group"
          aria-label="Next slide"
        >
          <svg
            className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2.5 items-center">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-7 h-2 bg-white shadow-sm'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;

