'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import ColorBand from '../ColorBand';
import { apiGet } from '@/lib/api-client';

interface Video {
  id: string;
  name: string;
  video_id: string;
  embed_url: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const VideoSection = () => {
  const t = useTranslations('VideoSection');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await apiGet<Video[]>('api/videos?skip=0&limit=4');
        setVideos(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch videos:', err);
        setError('Failed to load videos');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="wrapper">
        {/* Heading */}
        <div className="mb-8 md:mb-12">
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

        {/* Video Grid */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center z-20 text-primary text-center">
              <div>
                <p className="text-xl font-semibold mb-2">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/90 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {videos.map((video) => (
            <div
              key={video.id}
              className="group flex flex-col bg-white border border-primary hover:border-white shadow-md overflow-hidden transition-all duration-500"
            >
              {/* Video Embed */}
              <div className="relative aspect-video bg-gray-900">
                <iframe
                  width="560"
                  height="315"
                  src={video.embed_url}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Bottom Band */}
              <div className="h-2 bg-secondary"></div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;

