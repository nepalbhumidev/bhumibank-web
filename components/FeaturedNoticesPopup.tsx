'use client';

import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/api-client';
import { X, Loader2 } from 'lucide-react';

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

export default function FeaturedNoticesPopup() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  // Fetch featured notice
  useEffect(() => {
    const fetchFeaturedNotice = async () => {
      try {
        setLoading(true);
        const apiUrl = getApiUrl();
        
        const response = await fetch(`${apiUrl}api/notices/featured`);

        if (!response.ok) {
          throw new Error('Failed to fetch featured notice');
        }

        const data = await response.json();
        const featuredNotices = Array.isArray(data) ? data : [];
        
        // Get the first (and only) featured notice
        const featuredNotice = featuredNotices.length > 0 ? featuredNotices[0] : null;
        setNotice(featuredNotice);
        
        // Only show popup if there is a featured notice and we haven't shown it yet
        if (featuredNotice && !hasShown) {
          // Check if user has already dismissed this session
          const dismissed = sessionStorage.getItem('featured_notices_dismissed');
          if (!dismissed) {
            setIsOpen(true);
          }
        }
      } catch (err) {
        console.error('Error fetching featured notice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedNotice();
  }, [hasShown]);

  // Handle close - remember dismissal for this session
  const handleClose = () => {
    setIsOpen(false);
    setHasShown(true);
    sessionStorage.setItem('featured_notices_dismissed', 'true');
  };

  // Don't render if no notice or not open
  if (!isOpen || !notice) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 transition-colors p-2 bg-white/80 rounded-full backdrop-blur-sm"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div>
              {/* Image - Full size, no restrictions */}
              {notice.image_url && (
                <div className="w-full">
                  <img
                    src={notice.image_url}
                    alt={notice.title}
                    className="w-full h-auto object-contain"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
