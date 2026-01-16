'use client';

import { useTranslations } from 'next-intl';
import { Landmark, Building2, TrendingUp } from 'lucide-react';
import ColorBand from '../ColorBand';

const FeaturesSection = () => {
  const t = useTranslations('FeaturesSection');

  const iconProps = { size: 64 };

  const features = [
    {
      id: 'sustainableLandDevelopment',
      icon: <Landmark {...iconProps} />,
    },
    {
      id: 'propertyAcquisition',
      icon: <Building2 {...iconProps} />,
    },
    {
      id: 'investmentPartnership',
      icon: <TrendingUp {...iconProps} />,
    },
  ];

  return (
    <section className="relative py-12 md:py-16 lg:py-20">
      {/* Background that starts from middle of cards area */}
      <div className="absolute inset-x-0 top-[60%] bottom-0 bg-primary"></div>
      
      <div className="wrapper relative z-10">
        {/* Top Section */}
        <div className="mb-10 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Heading */}
            <div className="flex-shrink-0">
              <h2 className="text-4xl lg:text-5xl font-bold text-primary">
                {t('heading')}
              </h2>
              <ColorBand />
              <p className="mt-2 text-gray-600 text-sm md:text-base lg:text-lg">
                {t('subtitle')}
              </p>
            </div>

            {/* Paragraph Content */}
            <div className="flex-1 max-w-3xl text-gray-700 leading-relaxed">
              <p className="text-sm md:text-base lg:text-lg text-justify">{t('description')}</p>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group flex flex-col bg-white hover:bg-primary border border-primary hover:border-white shadow-md overflow-hidden h-full transition-all duration-300"
            >
              {/* Card Content */}
              <div className="flex-1 p-6 md:p-8 flex flex-col">
                {/* Icon */}
                <div className="w-16 h-16 mb-6 text-primary group-hover:text-white flex-shrink-0 flex items-center justify-center transition-colors duration-300">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-white mb-4 leading-tight transition-colors duration-300">
                  {t(`${feature.id}.title`)}
                </h3>

                {/* Description */}
                <div className="flex-1 text-sm md:text-base text-gray-600 group-hover:text-white leading-relaxed transition-colors duration-300">
                  <p>{t(`${feature.id}.description`)}</p>
                </div>
              </div>

              {/* Bottom Band */}
              <div className="h-2 bg-secondary"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
