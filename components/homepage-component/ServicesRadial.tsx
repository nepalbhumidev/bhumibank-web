'use client';

import { useTranslations } from 'next-intl';
import { Home, Building2, Scale, Hammer, Wallet, MapPin, Wrench } from 'lucide-react';

const ServicesRadial = () => {
  const t = useTranslations('WhatWeDoPage');

  const services = [
    { id: '1', icon: <Home className="w-6 h-6" /> },
    { id: '2', icon: <Building2 className="w-6 h-6" /> },
    { id: '3', icon: <Scale className="w-6 h-6" /> },
    { id: '4', icon: <Hammer className="w-6 h-6" /> },
    { id: '5', icon: <Wallet className="w-6 h-6" /> },
    { id: '6', icon: <MapPin className="w-6 h-6" /> },
    { id: '7', icon: <Wrench className="w-6 h-6" /> },
  ];

  return (
    <div className="relative mb-16 md:mb-20">
      {/* Desktop: Radial Layout */}
      <div className="hidden lg:block relative min-h-[700px]">
        {/* Center Circle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary rounded-full flex items-center justify-center z-20 shadow-sm">
          <span className="text-white font-bold text-lg text-center px-4">
            {t('centerTitle')}
          </span>
        </div>

        {/* Services positioned around the center */}
        {services.map((service, index) => {
          const totalServices = services.length;
          const angle = (index * (360 / totalServices) - 90) * (Math.PI / 180);
          const radius = 320;
          let x = Math.cos(angle) * radius;
          let y = Math.sin(angle) * radius;

          // Custom offsets for specific services
          // Service 2 (Real Estate Development) - move wider and down
          if (service.id === '2') {
            x += 40;
            y += 30;
          }
          // Service 7 (Property Maintenance & Conservation) - move wider and down
          if (service.id === '7') {
            x -= 40;
            y += 30;
          }
          // Service 4 (Land & Construction Services) - spread wider
          if (service.id === '4') {
            x += 10;
          }
          // Service 5 (Financial Advisory Services) - spread wider
          if (service.id === '5') {
            x -= 10;
          }

          return (
            <div
              key={service.id}
              className="absolute"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Connector Line */}
              <div
                className="absolute bg-primary/20 h-[2px] origin-left z-0"
                style={{
                  width: `${radius - 100}px`,
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${Math.atan2(-y, -x) * (180 / Math.PI)}deg)`,
                }}
              />
              
              {/* Service Card */}
              <div className="relative z-10 w-68 bg-white border border-secondary/20 hover:border-secondary p-4 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-secondary/10 px-2 group-hover:bg-secondary text-secondary group-hover:text-white flex items-center justify-center transition-colors duration-300">
                    {service.icon}
                  </div>
                  <h3 className="font-bold text-primary text-md leading-tight">
                    {t(`services.${service.id}.title`)}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {t(`services.${service.id}.description`)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tablet (md to lg): Alternating branches without center circle */}
      <div className="hidden md:block lg:hidden">
        <div className="relative">
          {/* Vertical Line - centered */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-primary/20 -translate-x-1/2" />

          {/* Services */}
          <div className="space-y-6">
            {services.map((service, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div
                  key={service.id}
                  className={`relative flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}
                >
                  {/* Horizontal connector */}
                  <div
                    className={`absolute top-1/2 h-[2px] bg-primary/20 w-[calc(50%-16px)] ${isLeft ? 'left-[calc(50%+8px)]' : 'right-[calc(50%+8px)]'}`}
                    style={{ transform: 'translateY(-50%)' }}
                  />

                  {/* Branch node */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-secondary rounded-full z-10" />

                  {/* Service Card */}
                  <div className="relative z-10 w-[calc(50%-32px)] bg-white border border-secondary/20 hover:border-secondary p-4 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-secondary/10 group-hover:bg-secondary text-secondary group-hover:text-white flex items-center justify-center transition-colors duration-300 flex-shrink-0">
                        {service.icon}
                      </div>
                      <h3 className="font-bold text-primary text-sm leading-tight">
                        {t(`services.${service.id}.title`)}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {t(`services.${service.id}.description`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile (below md): All branches on one side */}
      <div className="md:hidden">
        <div className="relative pl-6">
          {/* Vertical Line - on the left */}
          <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-primary/20" />

          {/* Services */}
          <div className="space-y-5">
            {services.map((service) => (
              <div
                key={service.id}
                className="relative flex items-center"
              >
                {/* Horizontal connector */}
                <div
                  className="absolute left-[-16px] top-1/2 h-[2px] bg-primary/20 w-4"
                  style={{ transform: 'translateY(-50%)' }}
                />

                {/* Branch node */}
                <div className="absolute left-[-20px] w-3 h-3 bg-secondary rounded-full z-10" />

                {/* Service Card */}
                <div className="relative z-10 w-full bg-white border border-secondary/20 hover:border-secondary p-4 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-secondary/10 group-hover:bg-secondary text-secondary group-hover:text-white flex items-center justify-center transition-colors duration-300 flex-shrink-0">
                      {service.icon}
                    </div>
                    <h3 className="font-bold text-primary text-sm leading-tight">
                      {t(`services.${service.id}.title`)}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {t(`services.${service.id}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesRadial;
