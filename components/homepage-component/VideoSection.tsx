'use client';

import { useTranslations } from 'next-intl';
import ColorBand from '../ColorBand';

interface Video {
  id: string;
  embedUrl: string;
}

const VideoSection = () => {
  const t = useTranslations('VideoSection');

  // This will be replaced with CMS data later
  // Use the full embed URL from YouTube: https://www.youtube.com/embed/VIDEO_ID?si=...
  const videos: Video[] = [
    {
      id: 'video1',
      embedUrl: 'https://www.youtube.com/embed/84xnIWMkPrs?si=WYSCSAx2dPHKIHDE',
    },
    {
      id: 'video2',
      embedUrl: 'https://www.youtube.com/embed/IkBNGO88XjM?si=im5IqsVW0RRb7bzx',
    },
    {
      id: 'video3',
      embedUrl: 'https://www.youtube.com/embed/E-hERHLNWq0?si=hNBaQwOfAMCt3nN1',
    },
    {
      id: 'video4',
      embedUrl: 'https://www.youtube.com/embed/OFSBAUdqVzg?si=vv0d_a-zEaZoscgv',
    },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="wrapper">
        {/* Heading */}
        <div className="mb-10 md:mb-16">
          <div className="inline-block">
            <h2 className="text-4xl lg:text-5xl font-bold text-primary">
              {t('heading')}
            </h2>
            <ColorBand />
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group flex flex-col bg-white border border-primary hover:border-white shadow-md overflow-hidden transition-all duration-300"
            >
              {/* Video Embed */}
              <div className="relative aspect-video bg-gray-900">
                <iframe
                  width="560"
                  height="315"
                  src={video.embedUrl}
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
    </section>
  );
};

export default VideoSection;

