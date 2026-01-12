'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import ColorBand from '../ColorBand';

const InvestSection = () => {
  const t = useTranslations('InvestSection');

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="wrapper">
        {/* Heading */}
        <div className="mb-10 md:mb-16 text-right">
          <div className="inline-block">
            <h2 className="text-4xl lg:text-5xl font-bold text-primary">
              {t('heading')}
            </h2>
            <div className="flex justify-end">
              <ColorBand className="mt-3" />
            </div>
          </div>
        </div>

        {/* Content Grid with Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
          {/* Image Section */}
          <div>
            <div className="relative w-full h-[300px] lg:h-[400px] overflow-hidden border border-primary">
              <Image
                src="/invest-image.jpg"
                alt="Investment in Nepal's land development"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="h-2 bg-secondary"></div>

          </div>

          {/* Content Section */}
          <div>
            <div className="text-justify space-y-6">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {t('content')}
              </p>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded hover:bg-primary/90 transition-colors text-sm md:text-base"
                >
                  {t('applicationForm')}
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white font-medium rounded hover:bg-secondary/90 transition-colors text-sm md:text-base"
                >
                  {t('publications')}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestSection;
