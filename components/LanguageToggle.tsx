'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

const LanguageToggle = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ne' : 'en';
    // Store locale preference
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    // Reload to apply new locale
    window.location.reload();
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 hover:opacity-80 transition-opacity focus:outline-none"
      aria-label={`Switch to ${locale === 'en' ? 'Nepali' : 'English'}`}
    >
      <Image
        src={locale === 'en' ? '/nepal-flag.png' : '/usa-flag.png'}
        alt={locale === 'en' ? 'Nepali' : 'English'}
        width={16}
        height={16}
        className="w-5 h-5 object-cover"
      />
      <span className="text-white text-xs uppercase">
        {locale === 'en' ? 'ने' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageToggle;

