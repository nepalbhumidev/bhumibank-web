'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ColorBand from '../ColorBand';
import { testimonials } from '@/constants/testimonials';

const TestimonialsSection = () => {
  const t = useTranslations('TestimonialsSection');
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

  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

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

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 fill-current'
        }`}
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    ));
  };

  return (
    <section className="relative py-12 md:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="wrapper relative z-10">
        {/* Header Section */}
        <div className="mb-10 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Title and Subtitle */}
            <div className="flex-shrink-0">
              <h2 className="text-4xl lg:text-5xl font-bold text-primary">
                {t('heading')}
              </h2>
              <ColorBand />
              <p className="mt-4 text-gray-600 text-sm md:text-base lg:text-lg">
                {t('subtitle')}
              </p>
            </div>

            {/* Navigation Controls - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={goToPrevious}
                className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary hover:text-white text-gray-600 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous testimonial"
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="w-12 h-12 rounded-full bg-primary text-white hover:bg-primary/90 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-xl"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Arrows - Mobile (positioned on sides) */}
          <button
            onClick={goToPrevious}
            className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white hover:bg-gray-100 text-primary p-2 rounded-full transition-all duration-300 shadow-lg items-center justify-center border-2 border-primary"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={goToNext}
            className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-primary text-white hover:bg-primary/90 p-2 rounded-full transition-all duration-300 shadow-lg items-center justify-center"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
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
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex-shrink-0 px-2 md:px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="h-full">
                    <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col p-6 md:p-8 relative overflow-hidden group">
                      {/* Quotation Mark Icon */}
                      <div className="absolute top-4 left-6 text-primary/10 group-hover:text-primary/20 transition-colors duration-300">
                        <Quote className="w-16 h-16" strokeWidth={1} />
                      </div>

                      {/* Content */}
                      <div className="relative z-10 flex flex-col flex-1">
                        {/* Star Rating */}
                        <div className="flex items-end justify-end gap-1 mb-8 md:mb-6">
                          {renderStars(testimonial.rating)}
                        </div>

                        {/* Testimonial Text */}
                        <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6 flex-1">
                          {t(`${testimonial.id}.text`)}
                        </p>

                        {/* Author Info */}
                        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                          {/* Avatar */}
                          <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/20">
                            <Image
                              src={testimonial.author.avatar}
                              alt={testimonial.author.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Name and Role */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm md:text-base truncate">
                              {testimonial.author.name}
                            </h4>
                            <p className="text-gray-600 text-xs md:text-sm truncate">
                              {testimonial.author.role} at {testimonial.author.company}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Accent Band */}
                      <div className="absolute bottom-0 left-0 right-0 h-2 bg-secondary "></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8 md:hidden">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index >= currentIndex && index < currentIndex + itemsPerView
                    ? 'w-8 h-2 bg-primary'
                    : 'w-2 h-2 bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
