'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiGet, getApiUrl } from '@/lib/api-client';
import Image from 'next/image';
import { Calendar, Loader2, FileText, BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Publication {
  id: string;
  title: string;
  thumbnail_image_url?: string | null;
  thumbnail_image_public_id?: string | null;
  pdf_url?: string | null;
  pdf_public_id?: string | null;
  created_by?: string;
  username?: string | null;
  created_at?: string;
  updated_at?: string;
}

export default function PublicationsPage() {
  const t = useTranslations('PublicationPage');
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPublications = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiGet<Publication[]>(
        'api/publications?skip=0&limit=100&sort_by=created_at&sort_order=-1'
      );
      setPublications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const pdfUrl = (id: string) => `${getApiUrl()}api/publications/${id}/pdf`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="wrapper py-8 md:py-12 lg:py-16">
          {/* Header */}
          <div className="mb-12 border-b border-gray-200 pb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
              {t('heading')}
            </h1>
            <p className="mt-4 text-gray-600 text-sm md:text-base lg:text-lg">
              {t('subtitle')}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : publications.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">{t('noPublications')}</p>
                <p className="text-gray-400 text-sm mt-2">{t('checkBackLater')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {publications.map((pub) => (
                  <div
                    key={pub.id}
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-primary hover:shadow-md transition-all"
                  >
                    <div className="relative h-48 bg-gray-100">
                      {pub.thumbnail_image_url ? (
                        <Image
                          src={pub.thumbnail_image_url}
                          alt={pub.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                          <FileText className="w-14 h-14" strokeWidth={1.5} />
                          <span className="text-xs font-medium uppercase tracking-wider">PDF</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-red-600 text-white text-xs font-semibold uppercase tracking-wider rounded shadow">
                          <FileText className="w-4 h-4" />
                          PDF
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">
                        {t('pdfDocument')}
                      </p>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {pub.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        {t('publishedOn')}: {formatDate(pub.created_at)}
                      </div>

                      <a
                        href={pdfUrl(pub.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors border border-red-700/30"
                        title={t('openPdf')}
                      >
                        <FileText className="w-5 h-5" />
                        {t('viewPdf')}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
