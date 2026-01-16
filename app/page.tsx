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
// import {useTranslations} from 'next-intl';

export default function Home() {

  return (  
    <>
      <Navbar />
      <Carousel />
      <FeaturesSection />
      <InvestSection />
      <NewsSection />
      <VideoSection />
      <TestimonialsSection />
      <Footer />
      <StickyActions />
      <FeaturedNoticesPopup />
    </>
  );
}
