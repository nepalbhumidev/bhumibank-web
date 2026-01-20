'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail } from 'lucide-react';
import ColorBand from '@/components/ColorBand';

export default function ReachUsPage() {
  const t = useTranslations('Footer');

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="wrapper py-8 md:py-12 lg:py-16">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-block">
              <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                {t('reachUs')}
              </h1>
              <ColorBand leftColor="primary" rightColor="secondary" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Contact Information */}
            <div> 
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start gap-4 p-0 md:p-2">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-full flex items-center justify-center shadow-sm">
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('phone')}</h3>
                    <p className="text-sm md:text-base text-gray-700">{t('phoneNumber')}</p>
                    <p className="text-sm md:text-base text-gray-700">{t('whatsapp')}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-0 md:p-2">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-full flex items-center justify-center shadow-sm">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('email')}</h3>
                    <p className="text-sm md:text-base text-gray-700">
                      <a href={`mailto:${t('email1')}`} className="text-secondary hover:underline">
                        {t('email1')}
                      </a>
                    </p>
                    <p className="text-sm md:text-base text-gray-700">
                      <a href={`mailto:${t('email2')}`} className="text-secondary hover:underline">
                        {t('email2')}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 p-0 md:p-2">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-full flex items-center justify-center shadow-sm">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('address')}</h3>
                    <p className="text-sm md:text-base text-gray-700">{t('addressDetail')}</p>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="mt-8 pt-8">
                  <h3 className="text-lg font-semibold text-primary mb-4">{t('additionalInformation')}</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-semibold text-primary">{t('president')}:</span> {t('presidentName')}</p>
                    <p><span className="font-semibold text-primary">{t('pan')}:</span> {t('panNumber')}</p>
                    <p><span className="font-semibold text-primary">{t('regNo')}:</span> {t('regNumber')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">
                {t('message')}
              </h2>
              
              <form className="space-y-6">
                <div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                    placeholder="Your Phone Number"
                  />
                </div>

                <div>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors resize-none"
                    placeholder="Your Message"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors shadow-md hover:shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-primary mb-6 inline-block">
              {t('map')}
            </h2>
            <div className="rounded-sm overflow-hidden shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1355.1806611346808!2d85.30497793640221!3d27.662542947661034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18291f8f6929%3A0x7d790ffa60f0616c!2sNakkhu%20Bridge!5e0!3m2!1sen!2snp!4v1768296979226!5m2!1sen!2snp"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
