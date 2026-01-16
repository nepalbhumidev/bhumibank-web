'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getApiUrl } from '@/lib/api-client';
import Image from 'next/image';
import { Calendar, X, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import ColorBand from '@/components/ColorBand';

interface Notice {
  id: string;
  title: string;
  image_url?: string;
  featured: boolean;
  created_by?: string;
  username?: string;
  created_at?: string;
  updated_at?: string;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch all notices
  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError('');
      const apiUrl = getApiUrl();
      
      const response = await fetch(
        `${apiUrl}api/notices?skip=0&limit=100&sort_by=created_at&sort_order=-1`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch notices');
      }

      const data = await response.json();
      setNotices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Handle notice click - fetch full details and show modal
  const handleNoticeClick = async (noticeId: string) => {
    try {
      setModalLoading(true);
      const apiUrl = getApiUrl();
      
      const response = await fetch(`${apiUrl}api/notices/${noticeId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch notice details');
      }

      const notice = await response.json();
      setSelectedNotice(notice);
      setIsModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setModalLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="wrapper py-12 md:py-16 lg:py-20">
          {/* Header */}
          <div className="mb-10 md:mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
              Notices
            </h1>
            <ColorBand />
            <p className="mt-4 text-gray-600 text-sm md:text-base lg:text-lg">
              Stay updated with our latest notices and important announcements from Nepal Bhumi Bank Limited.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No notices available</p>
              <p className="text-gray-400 text-sm mt-2">
                Check back later for updates
              </p>
            </div>
          ) : (
            /* Notices List */
            <div className="space-y-4">
              {notices.map((notice) => (
                <button
                  key={notice.id}
                  onClick={() => handleNoticeClick(notice.id)}
                  className="w-full text-left bg-white border border-gray-200 rounded-lg p-6 hover:border-primary hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    {/* Image Thumbnail */}
                    <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      {notice.image_url ? (
                        <Image
                          src={notice.image_url}
                          alt={notice.title}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {notice.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(notice.created_at)}</span>
                        </div>
                        {notice.featured && (
                          <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow Indicator */}
                    <div className="flex-shrink-0 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Notice Detail Modal */}
      {isModalOpen && selectedNotice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                Notice Details
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedNotice(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            {modalLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="p-6">
                {/* Image */}
                {selectedNotice.image_url && (
                  <div className="mb-6 rounded-lg overflow-hidden">
                    <div className="relative w-full h-64 md:h-96 bg-gray-100">
                      <Image
                        src={selectedNotice.image_url}
                        alt={selectedNotice.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {selectedNotice.title}
                </h3>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Published: {formatDate(selectedNotice.created_at)}</span>
                  </div>
                  {selectedNotice.updated_at && selectedNotice.updated_at !== selectedNotice.created_at && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Updated: {formatDate(selectedNotice.updated_at)}</span>
                    </div>
                  )}
                  {selectedNotice.featured && (
                    <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded">
                      Featured Notice
                    </span>
                  )}
                  {selectedNotice.created_by && (
                    <div className="text-sm text-gray-600">
                      By: {selectedNotice.created_by}
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedNotice(null);
                    }}
                    className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
