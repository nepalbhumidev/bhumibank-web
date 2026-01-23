'use client';

import { useTranslations } from 'next-intl';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesRadial from "@/components/homepage-component/ServicesRadial";

export default function WhatWeDoPage() {
  const t = useTranslations('WhatWeDoPage');

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="wrapper py-8 md:py-12 lg:py-16">
          {/* Header */}
          <div className="mb-12 md:mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
              {t('heading')}
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl">
              {t('subtitle')}
            </p>
          </div>

          {/* Radial Design Section */}
          <ServicesRadial />
        </div>
      </main>
      <Footer />
    </>
  );
}
