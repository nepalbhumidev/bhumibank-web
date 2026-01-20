'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { 
  Loader2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import { apiGet } from '@/lib/api-client';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface GalleryImage {
  id: string;
  image_url: string;
  image_public_id: string;
  uploaded_by: string;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

interface Gallery {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  cover_image_public_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  image_count: number;
  images?: GalleryImage[];
}

export default function GalleryPage() {
  const t = useTranslations('GalleryPage');
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(12);
  const [hasMore, setHasMore] = useState(true);
  
  // Gallery detail modal
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingGalleryDetails, setLoadingGalleryDetails] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  // Fetch galleries
  const fetchGalleries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const skip = currentPage * pageSize;
      const data = await apiGet<Gallery[]>(
        `api/gallery?skip=${skip}&limit=${pageSize}&sort_by=created_at&sort_order=-1`
      );
      
      if (currentPage === 0) {
        setGalleries(Array.isArray(data) ? data : []);
      } else {
        setGalleries(prev => [...prev, ...(Array.isArray(data) ? data : [])]);
      }
      
      setHasMore(data.length === pageSize);
    } catch (err) {
      console.error('Error fetching galleries:', err);
      setError('Failed to load galleries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, [currentPage]);

  // Keyboard navigation for image viewer
  useEffect(() => {
    if (!isImageViewerOpen || !selectedGallery?.images || selectedImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex(prev => 
          prev === null ? null : prev > 0 ? prev - 1 : selectedGallery.images!.length - 1
        );
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex(prev => 
          prev === null ? null : prev < selectedGallery.images!.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'Escape') {
        setIsModalOpen(false);
        setSelectedGallery(null);
        setSelectedImageIndex(null);
        setIsImageViewerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageViewerOpen, selectedImageIndex, selectedGallery]);

  // Load more galleries
  const loadMore = () => {
    if (!loading && hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Open gallery detail modal
  const handleOpenGallery = async (gallery: Gallery) => {
    setSelectedGallery(gallery);
    setIsModalOpen(true);
    setLoadingGalleryDetails(true);
    
    try {
      // Fetch full gallery details with images
      const fullGallery = await apiGet<Gallery>(`api/gallery/${gallery.id}`);
      setSelectedGallery(fullGallery);
    } catch (err) {
      console.error('Error fetching gallery details:', err);
      setError('Failed to load gallery details');
    } finally {
      setLoadingGalleryDetails(false);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGallery(null);
    setSelectedImageIndex(null);
    setIsImageViewerOpen(false);
  };

  // Open image viewer
  const handleOpenImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageViewerOpen(true);
  };

  // Navigate images in viewer
  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedGallery?.images) return;
    
    if (selectedImageIndex === null) return;
    
    if (direction === 'prev') {
      setSelectedImageIndex(prev => 
        prev === null ? null : prev > 0 ? prev - 1 : selectedGallery.images!.length - 1
      );
    } else {
      setSelectedImageIndex(prev => 
        prev === null ? null : prev < selectedGallery.images!.length - 1 ? prev + 1 : 0
      );
    }
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
            <p className="text-gray-600 max-w-4xl text-lg">
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
          {loading && galleries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-gray-500 italic animate-pulse">Loading galleries...</p>
            </div>
          ) : galleries.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 italic text-lg">No galleries available at the moment. Please check back later.</p>
            </div>
          ) : (
            <>
              {/* Gallery Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {galleries.map((gallery) => (
                  <div
                    key={gallery.id}
                    onClick={() => handleOpenGallery(gallery)}
                    className="group bg-white border border-gray-100 hover:bg-primary transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl cursor-pointer"
                  >
                    {/* Cover Image */}
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                      <Image
                        src={gallery.cover_image_url}
                        alt={gallery.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Image Count Badge */}
                      <div className="absolute top-2 right-2 bg-black/50 text-white px-3 py-1.5 text-xs font-semibold rounded flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        {gallery.image_count} {gallery.image_count === 1 ? 'image' : 'images'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-white transition-colors duration-300">
                        {gallery.title}
                      </h3>
                    </div>
                    {/* Bottom Band */}
                    <div className="h-2 bg-secondary transform origin-left transition-transform duration-300 group-hover:scale-x-110"></div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Gallery Detail Modal */}
      {isModalOpen && selectedGallery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto my-8">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {selectedGallery.title}
                </h2>
                {selectedGallery.description && (
                  <p className="text-gray-600 text-sm">
                    {selectedGallery.description}
                  </p>
                )}
              </div>
              <button
                onClick={handleCloseModal}
                className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {loadingGalleryDetails ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : selectedGallery.images && selectedGallery.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedGallery.images.map((image, index) => (
                    <div
                      key={image.id}
                      onClick={() => handleOpenImageViewer(index)}
                      className="relative aspect-video overflow-hidden bg-gray-100 cursor-pointer group hover:ring-1 hover:ring-primary transition-all"
                    >
                      <Image
                        src={image.image_url}
                        alt={`${selectedGallery.title} - Image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No images in this gallery</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal (Lightbox) */}
      {isImageViewerOpen && selectedGallery && selectedGallery.images && selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60] p-4">
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Buttons */}
          {selectedGallery.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full z-10">
            {selectedImageIndex + 1} / {selectedGallery.images.length}
          </div>

          {/* Image */}
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center">
            <Image
              src={selectedGallery.images[selectedImageIndex].image_url}
              alt={`${selectedGallery.title} - Image ${selectedImageIndex + 1}`}
              width={1920}
              height={1080}
              className="max-w-full max-h-full object-contain"
              unoptimized
            />
          </div>

        </div>
      )}

      <Footer />
    </>
  );
}
