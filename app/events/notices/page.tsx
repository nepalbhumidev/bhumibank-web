'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiGet } from '@/lib/api-client';
import Image from 'next/image';
import { Calendar, ChevronDown, ChevronUp, Loader2, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('NoticePage');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);
  const [noticeDetails, setNoticeDetails] = useState<Record<string, Notice>>({});

  // Fetch all notices
  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiGet<Notice[]>(
        'api/notices?skip=0&limit=100&sort_by=created_at&sort_order=-1'
      );
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

  // Toggle dropdown - fetch details if not already loaded
  const toggleNotice = async (noticeId: string) => {
    if (expandedNoticeId === noticeId) {
      // Close if already open
      setExpandedNoticeId(null);
    } else {
      // Open and fetch details if not already loaded
      setExpandedNoticeId(noticeId);
      
      if (!noticeDetails[noticeId]) {
        try {
          const notice = await apiGet<Notice>(`api/notices/${noticeId}`);
            setNoticeDetails(prev => ({ ...prev, [noticeId]: notice }));
        } catch (err) {
          console.error('Error fetching notice details:', err);
        }
      }
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Content */}
          <div>
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
              <div className="space-y-3">
                {notices.map((notice) => {
                  const isExpanded = expandedNoticeId === notice.id;
                  const details = noticeDetails[notice.id] || notice;

                  return (
                    <div
                      key={notice.id}
                      className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-primary transition-colors"
                    >
                      {/* Header - Clickable */}
                      <button
                        onClick={() => toggleNotice(notice.id)}
                        className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {notice.title}
                            </h3>
                            {notice.featured && (
                              <span className="inline-flex items-center px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {formatDate(notice.created_at)}
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {/* Dropdown Content - Full Image */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 p-4 animate-in slide-in-from-top-2 duration-200">
                          {details.image_url && (
                            <div className="w-full">
                              <img
                                src={details.image_url}
                                alt={details.title}
                                className="w-full h-auto object-contain rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
