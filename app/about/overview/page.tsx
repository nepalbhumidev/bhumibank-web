'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, Eye, Lightbulb, Users, Shield, Quote } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutOverviewPage() {
  const t = useTranslations('InformationPage');

  const coreValues = [
    {
      icon: <Leaf className="w-6 h-6" />,
      key: 'sustainability',
    },
    {
      icon: <Eye className="w-6 h-6" />,
      key: 'transparency',
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      key: 'innovation',
    },
    {
      icon: <Users className="w-6 h-6" />,
      key: 'communityFocus',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      key: 'integrity',
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="wrapper py-8 md:py-12 lg:py-16">
          {/* Company Overview Section */}
          <section className="mb-16 md:mb-20">
            <div className="mb-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                {t('companyOverview.heading')}
              </h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-base md:text-lg text-justify">
                {t('companyOverview.description')}
              </p>
            </div>
          </section>

          {/* Mission and Vision Section */}
          <section className="mb-16 md:mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Mission */}
              <div className="bg-white border border-primary p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="h-2 bg-secondary mb-6"></div>
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                  {t('mission.heading')}
                </h3>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  {t('mission.description')}
                </p>
              </div>

              {/* Vision */}
              <div className="bg-primary text-white p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="h-2 bg-secondary mb-6"></div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  {t('vision.heading')}
                </h3>
                <p className="leading-relaxed text-base md:text-lg text-white/95">
                  {t('vision.description')}
                </p>
              </div>
            </div>
          </section>

          {/* President's Message Section */}
          <section className="mb-16 md:mb-20">
            <div className="mb-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                {t('president.heading')}
              </h2>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-l-4 border-secondary p-8 md:p-10 lg:p-12 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Message Content */}
                <div className="lg:col-span-2 flex flex-col justify-center">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-secondary/20 rounded-full flex items-center justify-center">
                      <Quote className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed text-base md:text-lg italic text-justify mb-6">
                        {t('president.message')}
                      </p>
                      <div className="border-t border-primary/20 pt-6">
                        <p className="text-xl md:text-2xl font-bold text-primary mb-1">
                          {t('president.name')}
                        </p>
                        <p className="text-secondary font-semibold text-sm md:text-base">
                          {t('president.title')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* President Image */}
                <div className="lg:col-span-1 flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-[300px] lg:max-w-full aspect-[3/4] overflow-hidden shadow-xl border-4 border-secondary/30">
                    <Image
                      src="/president-image.jpg"
                      alt={t('president.name')}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Core Values Section */}
          <section className="mb-16 md:mb-20">
            <div className="mb-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                {t('coreValues.heading')}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((value, index) => (
                <div
                  key={value.key}
                  className="group bg-white border border-gray-200 hover:border-primary p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 group-hover:bg-primary text-primary group-hover:text-white rounded-lg flex items-center justify-center transition-colors duration-300">
                      {value.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed text-base md:text-lg group-hover:text-primary transition-colors duration-300">
                        {t(`coreValues.${value.key}`)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-primary text-white py-16 md:py-20 lg:py-24">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {t('cta.heading')}
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
                {t('cta.description')}
              </p>
              <Link
                href="/about/what-we-do"
                className="inline-flex items-center gap-2 px-10 py-4 bg-secondary text-white font-semibold hover:bg-secondary/90 transition-colors duration-200 text-base md:text-lg border-2 border-secondary hover:border-secondary/80"
              >
                {t('cta.button')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
