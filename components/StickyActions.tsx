'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

const StickyActions = () => {
  const t = useTranslations('InvestSection');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 800) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* Application Form - Long Vertical Bar on Right Edge */}

      <div 
        className="fixed -right-[54px] top-1/2 -translate-y-1/2 z-40 w-[141px]"
        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
      >
        <a
          href="#"
          className="inline-block bg-secondary text-white text-sm hover:bg-secondary/90 transition-colors px-4 py-2 text-center"
        >
          <span className="whitespace-nowrap">{t('applicationForm')}</span>
        </a>
      </div>


      {/* Back to Top Button - Circular at Bottom Right */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary text-white flex items-center justify-center hover:bg-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default StickyActions;
