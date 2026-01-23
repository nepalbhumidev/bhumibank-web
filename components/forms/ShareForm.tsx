'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Clock, ArrowRight, Phone, Mail } from 'lucide-react';

const ShareForm = () => {
  const t = useTranslations('FormsPage.share.comingSoon');

  return (
    <div className="bg-white border border-gray-200 shadow-sm">
      <div className="p-6 md:p-8">
        <div className="max-w-2xl mx-auto text-center py-12 md:py-16">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <Clock className="w-10 h-10 md:w-12 md:h-12 text-primary animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {t('title')}
          </h2>

          {/* Main Message */}
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6 max-w-xl mx-auto">
            {t('message')}
          </p>

          {/* Sub Message */}
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto">
            {t('submessage')}
          </p>

          {/* Contact Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/reach-us"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded hover:bg-primary/90 transition-colors duration-300 shadow-sm hover:shadow-md"
            >
              {t('contactUs')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Decorative Elements */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>Call us for assistance</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Email us for inquiries</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareForm;
