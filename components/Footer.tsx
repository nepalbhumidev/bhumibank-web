'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail } from 'lucide-react';
import { socialMediaLinks } from '@/constants/socialMedia';

const Footer = () => {
  const t = useTranslations('Footer');

  const informationLinks = [
    { key: 'aboutUs', href: '#' },
    { key: 'whatWeDo', href: '#' },
    { key: 'information', href: '#' },
    { key: 'career', href: '#' },
    { key: 'notices', href: '#' },
  ];

  return (
    <>
      {/* Silhouette Image with White Background */}
      <div className="bg-white w-full pt-12 md:pt-16 lg:pt-20">
        <div className="wrapper">
          <Image
            src="/footer-silhouette.png"
            alt="Footer illustration"
            width={1920}
            height={200}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-primary text-white">
        <div className="wrapper py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
            {/* Left Column - Logo, Bank Name, Slogan, Social Media */}
            <div>
              {/* Logo */}
              <div className="mb-4">
                <Image
                  src="/nbb-logo.svg"
                  alt="Nepal Bhumi Bank Limited Logo"
                  width={120}
                  height={120}
                  className="w-32 h-32 md:w-36 md:h-36 object-contain rounded-full bg-white"
                />
              </div>

              {/* Bank Name */}
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                {t('bankName')}
              </h3>

              {/* Slogan */}
              <p className="text-sm md:text-base mb-6">{t('slogan')}</p>

              {/* Social Media Icons */}
              <div className="flex items-center gap-3">
                {socialMediaLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors"
                    style={{ color: social.brandColor }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = social.hoverColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = social.brandColor)}
                    aria-label={social.ariaLabel}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d={social.iconPath} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Information Column */}
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">
                {t('information')}
              </h3>
              <ul className="space-y-2">
                {informationLinks.map((link) => (
                  <li key={link.key} className="flex items-start gap-2">
                    <a
                      href={link.href}
                      className="text-sm md:text-base hover:text-secondary transition-colors"
                    >
                      {t(`informationLinksList.${link.key}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">{t('contact')}</h3>
              <ul className="space-y-2 text-sm md:text-base">
                <li>
                  <div className="flex items-start gap-2 mb-2">
                    <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">{t('phone')}</span>
                  </div>
                  <div className="ml-7">
                    <p>{t('phoneNumber')}</p>
                    <p>{t('whatsapp')}</p>
                  </div>
                </li>
                <li>
                  <div className="flex items-start gap-2 mb-2">
                    <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">{t('email')}</span>
                  </div>
                  <div className="ml-7 ">
                    <p>{t('email1')}</p>
                    <p>{t('email2')}</p>
                  </div>
                </li>
                <li>
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">{t('address')}</span>
                  </div>
                  <p className="ml-7">{t('addressDetail')}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Dark Bar */}
        <div className="bg-secondary border-t border-white/10">
          <div className="wrapper py-4 md:py-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8 text-sm md:text-base">
              {/* Company Information */}
              <div className="flex flex-col md:flex-row text-center md:text-left gap-4 md:gap-6">
                <div>
                  <p className="font-semibold mb-1 text-white/90">{t('president')}</p>
                  <p className="text-white/80">{t('presidentName')}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1 text-white/90">{t('pan')}</p>
                  <p className="text-white/80">{t('panNumber')}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1 text-white/90">{t('regNo')}</p>
                  <p className="text-white/80">{t('regNumber')}</p>
                </div>
              </div>
              
              {/* Copyright */}
              <div className="text-center md:text-right">
                <p>Copyright ©2026. NBB, All Rights Reserved</p>
                <p className="mt-1">
                  Powered By :{' '}
                  <a
                    href="https://neutrotex.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Neutrotex It Solutions
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
