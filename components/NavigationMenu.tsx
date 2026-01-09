'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LanguageToggle from './LanguageToggle';
import { socialMediaLinks } from '@/constants/socialMedia';
import { menuItems } from '@/constants/navigationMenu';

const NavigationMenu = () => {
  const t = useTranslations('Navigation');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);

  const toggleDropdown = (menu: string, event?: React.MouseEvent) => {
    // Prevent event from bubbling to click outside handler
    event?.stopPropagation();
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      let clickedInside = false;

      // Check if click is inside any dropdown
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && ref.contains(target)) {
          clickedInside = true;
        }
      });

      if (!clickedInside) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      // Use setTimeout to avoid immediate trigger when clicking the button
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openDropdown]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is inside mobile menu or hamburger button
      const clickedInsideMenu = mobileMenuRef.current?.contains(target);
      const clickedOnHamburger = hamburgerRef.current?.contains(target);

      if (!clickedInsideMenu && !clickedOnHamburger) {
        setMobileMenuOpen(false);
        setOpenDropdown(null);
      }
    };

    if (mobileMenuOpen) {
      // Use setTimeout to avoid immediate trigger when clicking the button
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside as any);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside as any);
      };
    }
  }, [mobileMenuOpen]);

  return (
    <nav className="bg-primary relative">
      <div className="wrapper">
        <div className="flex items-center justify-between">
          {/* Social Media Icons - Mobile Only (Left Side) */}
          <div className="lg:hidden flex items-center gap-3 sm:gap-4">
            {socialMediaLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white transition-colors"
                style={{ color: 'white' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = social.mobileHoverColor || social.brandColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
                aria-label={social.ariaLabel}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={social.iconPath} />
                </svg>
              </a>
            ))}
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-6 flex-1">
            {menuItems.map((item) => (
              <div 
                key={item.name} 
                className="relative group" 
                ref={(el) => {
                  if (item.hasDropdown) {
                    dropdownRefs.current[item.name] = el;
                  }
                }}
              >
                {item.hasDropdown ? (
                  <button
                    onClick={(e) => toggleDropdown(item.name, e)}
                    className="text-white uppercase text-sm py-3 px-2 hover:text-secondary transition-colors flex items-center gap-1"
                  >
                    {t(item.name)}
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        openDropdown === item.name ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="text-white uppercase text-sm py-3 px-2 hover:text-secondary transition-colors block"
                  >
                    {t(item.name)}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {item.hasDropdown && openDropdown === item.name && item.dropdownItems && (
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-md min-w-[200px] z-50 mt-1">
                    <div className="py-2">
                      {item.dropdownItems.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.href}
                          href={dropdownItem.href}
                          className="block px-4 py-3 text-sm text-black hover:bg-primary hover:text-white transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {t(dropdownItem.name)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Language Toggle - Desktop (Right Side) */}
          <div className="hidden lg:flex items-center">
            <LanguageToggle />
          </div>

          {/* Language Toggle and Hamburger - Mobile (Right Side) */}
          <div className="lg:hidden flex items-center gap-3 sm:gap-4">
            <LanguageToggle />
            <button
              ref={hamburgerRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white py-2"
              aria-label="Toggle menu"
            >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          </div>


          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div 
              ref={mobileMenuRef}
              className="lg:hidden absolute top-full left-0 w-full bg-primary shadow-lg z-[100]"
            >
              <div>
                {menuItems.map((item) => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <div
                        ref={(el) => {
                          dropdownRefs.current[item.name] = el;
                        }}
                      >
                        <button
                          onClick={(e) => toggleDropdown(item.name, e)}
                          className="w-full text-left text-white uppercase text-xs py-3 px-4 hover:text-secondary transition-colors flex items-center justify-between"
                        >
                          {t(item.name)}
                          <svg
                            className={`w-3.5 h-3.5 transition-transform ${
                              openDropdown === item.name ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {openDropdown === item.name && item.dropdownItems && (
                          <div className="bg-white">
                            {item.dropdownItems.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.href}
                                href={dropdownItem.href}
                                className="block px-6 py-3 text-xs text-black hover:bg-primary hover:text-white transition-colors"
                                onClick={() => {
                                  setOpenDropdown(null);
                                  setMobileMenuOpen(false);
                                }}
                              >
                                {t(dropdownItem.name)}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block text-white uppercase text-xs py-3 px-4 hover:text-secondary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t(item.name)}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;

