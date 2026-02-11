'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslations } from 'next-intl';
import ColorBand from '@/components/ColorBand';
import MembershipForm from '@/components/forms/MembershipForm';
import ShareForm from '@/components/forms/ShareForm';

export default function FormsPage() {
  const t = useTranslations('FormsPage');
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get the form type from URL params, default to 'membership'
  const formType = searchParams.get('form') || 'membership';
  const [activeTab, setActiveTab] = useState<'membership' | 'share'>(
    (formType === 'share' ? 'share' : 'membership') as 'membership' | 'share'
  );

  // Update active tab when URL param changes
  useEffect(() => {
    const formParam = searchParams.get('form');
    if (formParam === 'share') {
      setActiveTab('share');
    } else if (formParam === 'membership' || !formParam) {
      setActiveTab('membership');
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'membership' | 'share') => {
    setActiveTab(tab);
    // Update URL without page reload
    const params = new URLSearchParams(searchParams.toString());
    params.set('form', tab);
    router.push(`/forms?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="wrapper py-8 md:py-12 lg:py-16">
          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <div className="inline-block">
                  <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                    {t('heading')}
                  </h1>
                  <ColorBand leftColor="primary" rightColor="secondary" />
                </div>
                <p className="mt-4 text-gray-600 text-base md:text-lg max-w-3xl">
                  {t('subtitle')}
                </p>
              </div>
              
              {/* Bank Account QR Code */}
              <div className="flex-shrink-0 bg-white p-3 rounded-lg shadow-xs border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    <Image
                      src="/bhumi-bank-acc.jpeg"
                      alt="Bank Account QR Code"
                      width={150}
                      height={150}
                    />
                  </div>
                  <div className="text-xs text-gray-700 space-y-1">
                    <p className="font-semibold text-gray-900">Bank Account Details</p>
                    <p>Global IME Bank</p>
                    <p>18101010005944</p>
                    <p>NEREPHAT BRANCH</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8 border-b border-gray-200">
            <div className="flex gap-1">
              <button
                onClick={() => handleTabChange('membership')}
                className={`px-6 py-3 text-base font-medium transition-colors duration-300 border-b-2 ${
                  activeTab === 'membership'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {t('tabs.membership')}
              </button>
              <button
                onClick={() => handleTabChange('share')}
                className={`px-6 py-3 text-base font-medium transition-colors duration-300 border-b-2 ${
                  activeTab === 'share'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {t('tabs.share')}
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="max-w-4xl">
            {activeTab === 'membership' ? (
              <MembershipForm />
            ) : (
              <ShareForm />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
