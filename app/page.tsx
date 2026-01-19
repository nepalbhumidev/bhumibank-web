import Navbar from "../components/Navbar";
import Carousel from "../components/homepage-component/Carousel";
import FeaturesSection from "../components/homepage-component/FeaturesSection";
import InvestSection from "../components/homepage-component/InvestSection";
import TestimonialsSection from "../components/homepage-component/TestimonialsSection";
import VideoSection from "../components/homepage-component/VideoSection";
import NewsSection from "../components/homepage-component/NewsSection";
import Footer from "../components/Footer";
import StickyActions from "../components/StickyActions";
import FeaturedNoticesPopup from "../components/FeaturedNoticesPopup";
import ServicesRadial from "../components/homepage-component/ServicesRadial";
import ColorBand from "@/components/ColorBand";


import {useTranslations} from 'next-intl';

export default function Home() {
  const t = useTranslations('WhatWeDoPage');
  return (  
    <>
      <Navbar />
      <Carousel />
      <FeaturesSection />
      <InvestSection />
      <NewsSection />
      <div className="wrapper py-8 md:py-12 lg:py-16">
        {/* Heading */}
        <div className="mb-10 md:mb-16">
          <div className="inline-block">
            <h2 className="text-4xl lg:text-5xl font-bold text-primary">
              {t('heading')}
            </h2>
            <ColorBand />
          </div>
          <p className="mt-2 text-gray-600 text-sm md:text-base lg:text-lg">
            {t('subtitle')}
          </p>
        </div>
        <ServicesRadial />
      </div>
      
      <VideoSection />
      <TestimonialsSection />
      <Footer />
      <StickyActions />
      <FeaturedNoticesPopup />
    </>
  );
}
