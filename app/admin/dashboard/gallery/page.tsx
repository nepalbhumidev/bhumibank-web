'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar,
  Image as ImageIcon,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Folder,
  Upload,
  ImagePlus
} from 'lucide-react';
import { apiGet, apiRequestFormData, apiDelete } from '@/lib/api-client';
import Image from 'next/image';

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

interface GalleryFormData {
  title: string;
  description: string;
  cover_image: File | null;
}

interface ImageFormData {
  images: File[];
}

const getInitialFormData = (): GalleryFormData => ({
  title: '',
  description: '',
  cover_image: null,
});

const getInitialImageFormData = (): ImageFormData => ({
  images: [],
});

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(12);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<GalleryFormData>(() => getInitialFormData());
  const [previewCoverImage, setPreviewCoverImage] = useState<string | null>(null);
  const [existingCoverImageUrl, setExistingCoverImageUrl] = useState<string | null>(null);

  // Image management states
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageFormData, setImageFormData] = useState<ImageFormData>(() => getInitialImageFormData());
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageFormLoading, setImageFormLoading] = useState(false);
  const [imageFormError, setImageFormError] = useState('');
  const [deleteImageConfirmId, setDeleteImageConfirmId] = useState<string | null>(null);

  // Fetch galleries
  const fetchGalleries = async () => {
    try {
      setLoading(true);
      setError('');
      
      const skip = currentPage * pageSize;
      const data = await apiGet<Gallery[]>(
        `api/gallery?skip=${skip}&limit=${pageSize}&sort_by=created_at&sort_order=-1`
      );
      
      setGalleries(Array.isArray(data) ? data : []);
      setTotalPages(data.length < pageSize ? currentPage + 1 : currentPage + 2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, [currentPage]);

  // Filter galleries based on search
  const filteredGalleries = galleries.filter(gallery =>
    gallery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gallery.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open create modal
  const handleCreate = () => {
    setIsEditing(false);
    setEditingGalleryId(null);
    setFormError('');
    setFormData(getInitialFormData());
    setPreviewCoverImage(null);
    setExistingCoverImageUrl(null);
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEdit = async (gallery: Gallery) => {
    setIsEditing(true);
    setEditingGalleryId(gallery.id);
    setFormError('');
    
    setFormData({
      title: gallery.title || '',
      description: gallery.description || '',
      cover_image: null,
    });
    
    setExistingCoverImageUrl(gallery.cover_image_url || null);
    setPreviewCoverImage(null);
    setIsModalOpen(true);
  };

  // Handle cover image selection
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, cover_image: file });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove cover image
  const removeCoverImage = () => {
    setFormData({ ...formData, cover_image: null });
    setPreviewCoverImage(null);
  };

  // Submit gallery form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      // Validation
      if (!formData.title.trim()) {
        setFormError('Title is required');
        setFormLoading(false);
        return;
      }

      if (formData.title.length > 200) {
        setFormError('Title must be 200 characters or less');
        setFormLoading(false);
        return;
      }

      if (!formData.description.trim()) {
        setFormError('Description is required');
        setFormLoading(false);
        return;
      }

      if (formData.description.length > 1000) {
        setFormError('Description must be 1000 characters or less');
        setFormLoading(false);
        return;
      }

      if (!isEditing && !formData.cover_image) {
        setFormError('Cover image is required');
        setFormLoading(false);
        return;
      }

      if (isEditing && !existingCoverImageUrl && !formData.cover_image) {
        setFormError('Cover image is required');
        setFormLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      
      if (formData.cover_image) {
        formDataToSend.append('cover_image', formData.cover_image);
      }

      const endpoint = isEditing && editingGalleryId
        ? `api/gallery/${editingGalleryId}`
        : 'api/gallery';

      const response = await apiRequestFormData(
        endpoint,
        formDataToSend,
        isEditing ? 'PUT' : 'POST'
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
        throw new Error(errorData.detail || 'Failed to save gallery');
      }

      setIsModalOpen(false);
      setFormError('');
      fetchGalleries();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete gallery
  const handleDelete = async (id: string) => {
    try {
      await apiDelete(`api/gallery/${id}`);
      setDeleteConfirmId(null);
      fetchGalleries();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Open image management modal
  const handleManageImages = async (gallery: Gallery) => {
    try {
      // Fetch full gallery details with images
      const fullGallery = await apiGet<Gallery>(`api/gallery/${gallery.id}`);
      setSelectedGallery(fullGallery);
      setIsImageModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gallery details');
    }
  };

  // Handle image selection for upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFormData({ ...imageFormData, images: [...imageFormData.images, ...files] });
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image from upload list
  const removeImage = (index: number) => {
    const newImages = imageFormData.images.filter((_, i) => i !== index);
    setImageFormData({ ...imageFormData, images: newImages });
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  // Submit image upload
  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGallery) return;

    setImageFormLoading(true);
    setImageFormError('');

    try {
      if (imageFormData.images.length === 0) {
        setImageFormError('At least one image is required');
        setImageFormLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      
      imageFormData.images.forEach(file => {
        formDataToSend.append('images', file);
      });

      const response = await apiRequestFormData(
        `api/gallery/${selectedGallery.id}/images`,
        formDataToSend,
        'POST'
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
        throw new Error(errorData.detail || 'Failed to upload images');
      }

      // Refresh gallery details
      const updatedGallery = await apiGet<Gallery>(`api/gallery/${selectedGallery.id}`);
      setSelectedGallery(updatedGallery);
      setImageFormData(getInitialImageFormData());
      setPreviewImages([]);
      setImageFormError('');
      fetchGalleries(); // Refresh list to update image_count
    } catch (err) {
      setImageFormError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setImageFormLoading(false);
    }
  };

  // Delete image
  const handleDeleteImage = async (imageId: string) => {
    if (!selectedGallery) return;

    try {
      await apiDelete(`api/gallery/${selectedGallery.id}/images/${imageId}`);
      setDeleteImageConfirmId(null);
      
      // Refresh gallery details
      const updatedGallery = await apiGet<Gallery>(`api/gallery/${selectedGallery.id}`);
      setSelectedGallery(updatedGallery);
      fetchGalleries(); // Refresh list to update image_count
    } catch (err) {
      setImageFormError(err instanceof Error ? err.message : 'Failed to delete image');
      setDeleteImageConfirmId(null);
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
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your gallery collections and images</p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New Gallery
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && !isModalOpen && !isImageModalOpen && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredGalleries.length === 0 ? (
      <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No galleries found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchQuery ? 'Try adjusting your search query' : 'Create your first gallery to get started'}
            </p>
          </div>
        ) : (
          <>
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGalleries.map((gallery) => (
                <div
                  key={gallery.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xs transition-shadow bg-white"
                >
                  {/* Cover Image */}
                  <div className="relative h-48 bg-gray-100">
                    {gallery.cover_image_url ? (
                      <Image
                        src={gallery.cover_image_url}
                        alt={gallery.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    {/* Image Count Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-black/50 text-white text-xs font-medium rounded">
                        <ImageIcon className="w-3 h-3" />
                        {gallery.image_count} {gallery.image_count === 1 ? 'image' : 'images'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {gallery.title}
                    </h3>
                    {gallery.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {gallery.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Calendar className="w-3 h-3" />
                      {formatDate(gallery.created_at)}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleManageImages(gallery)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors"
                      >
                        <ImagePlus className="w-4 h-4" />
                        Images
                      </button>
                      <button
                        onClick={() => handleEdit(gallery)}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(gallery.id)}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-red-600 bg-secondary/10 hover:bg-secondary/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Gallery Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Edit Gallery' : 'Create New Gallery'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setFormError('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Form Error Message */}
              {formError && (
                <div className="p-2 bg-red-50 text-sm border border-red-200 rounded-lg text-red-700">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">Error:</span>
                    <span>{formError}</span>
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  maxLength={200}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter gallery title"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/200 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  maxLength={1000}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter gallery description"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/1000 characters
                </p>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image *
                </label>
                
                {/* Existing Cover Image */}
                {existingCoverImageUrl && !previewCoverImage && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Current cover image:</p>
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={existingCoverImageUrl}
                        alt="Current cover"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setExistingCoverImageUrl(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity"
                        title="Remove current image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Preview New Cover Image */}
                {previewCoverImage && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">New cover image preview:</p>
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={previewCoverImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeCoverImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  required={!isEditing}
                  onChange={handleCoverImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Allowed formats: .jpg, .jpeg, .png, .gif, .webp, .svg (max 5MB)
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormError('');
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    isEditing ? 'Update Gallery' : 'Create Gallery'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Management Modal */}
      {isImageModalOpen && selectedGallery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Manage Images: {selectedGallery.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedGallery.image_count} {selectedGallery.image_count === 1 ? 'image' : 'images'} in this gallery
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsImageModalOpen(false);
                  setSelectedGallery(null);
                  setImageFormError('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Upload Images Section */}
              <div className="mb-8 border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Images</h3>
                
                <form onSubmit={handleImageSubmit} className="space-y-4">
                  {/* Form Error Message */}
                  {imageFormError && (
                    <div className="p-2 bg-red-50 text-sm border border-red-200 rounded-lg text-red-700">
                      {imageFormError}
                    </div>
                  )}

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Images *
                    </label>
                    
                    {/* Preview Images */}
                    {previewImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        {previewImages.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="relative h-24 bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      You can select multiple images. Allowed formats: .jpg, .jpeg, .png, .gif, .webp, .svg (max 5MB each)
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={imageFormLoading || imageFormData.images.length === 0}
                    className="w-full px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    {imageFormLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Images
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Gallery Images Grid */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery Images</h3>
                {selectedGallery.images && selectedGallery.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedGallery.images.map((image) => (
                      <div
                        key={image.id}
                        className="border border-gray-200 rounded-lg overflow-hidden bg-white group"
                      >
                        <div className="relative h-32 bg-gray-100">
                          <Image
                            src={image.image_url}
                            alt="Gallery image"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-2">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => setDeleteImageConfirmId(image.id)}
                              className="w-full inline-flex items-center justify-center gap-1 px-2 py-1 text-xs text-red-600 bg-secondary/10 hover:bg-secondary/20 rounded transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No images in this gallery yet</p>
                    <p className="text-gray-400 text-xs mt-1">Upload images above to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Gallery Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Gallery</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this gallery? This will also delete all images in the gallery. This action cannot be undone.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Image Confirmation Modal */}
      {deleteImageConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Image</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDeleteImageConfirmId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteImage(deleteImageConfirmId)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
