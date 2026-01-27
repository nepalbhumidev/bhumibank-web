'use client';

import Image from 'next/image';
import Link from 'next/link';
import NavigationMenu from './NavigationMenu';
import { socialMediaLinks } from '@/constants/socialMedia';
import { useTranslations } from 'next-intl';

const Navbar = () => {
  const t = useTranslations('HomePage');
  return (
    <header className="w-full">
      {/* Top Section - White Background */}
      <div className="bg-white border-b border-gray-200">
        <div className="wrapper py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Company Name */}
            <Link href="/" className="flex items-center gap-4">
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <Image
                    src="/nbb-logo.svg"
                    alt="Nepal Bhumi Bank Limited Logo"
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Company Name and Tagline */}
              <div className="text-left">
                <h1 className="text-primary font-semibold text-lg md:text-xl lg:text-2xl">
                  Nepal Bhumi Bank Limited
                </h1>
                <p className="text-primary text-md md:text-lg lg:text-xl ">
                  नेपाल भूमि बैंक लिमिटेड
                </p>
                <p className="text-secondary text-xs">
                  {t('slogan')}
                </p>
              </div>
            </Link>

            {/* Social Media Icons - Right (Desktop Only) */}
            <div className="hidden lg:flex flex-shrink-0 items-center gap-4">
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
        </div>
      </div>

      {/* Bottom Section - Blue Navigation Bar */}
      <NavigationMenu />
    </header>
  );
};

export default Navbar;

