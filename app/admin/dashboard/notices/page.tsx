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
  FileText,
  Star
} from 'lucide-react';
import { apiGet, apiRequestFormData, apiDelete } from '@/lib/api-client';
import Image from 'next/image';

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

interface NoticeFormData {
  title: string;
  image: File | null;
  featured: boolean;
}

const getInitialFormData = (): NoticeFormData => ({
  title: '',
  image: null,
  featured: false,
});

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(12);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<NoticeFormData>(() => getInitialFormData());
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // Fetch notices
  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError('');
      
      const skip = currentPage * pageSize;
      const data = await apiGet<Notice[]>(
        `api/notices?skip=${skip}&limit=${pageSize}&sort_by=created_at&sort_order=-1`
      );
      
      setNotices(Array.isArray(data) ? data : []);
      setTotalPages(data.length < pageSize ? currentPage + 1 : currentPage + 2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [currentPage]);

  // Filter notices based on search
  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open create modal
  const handleCreate = () => {
    setIsEditing(false);
    setEditingNoticeId(null);
    setFormError('');
    setFormData(getInitialFormData());
    setPreviewImage(null);
    setExistingImageUrl(null);
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEdit = async (notice: Notice) => {
    setIsEditing(true);
    setEditingNoticeId(notice.id);
    setFormError('');
    setFormData({
      title: notice.title || '',
      image: null,
      featured: notice.featured || false,
    });
    setPreviewImage(null);
    setExistingImageUrl(notice.image_url || null);
    
    // Fetch full notice details if needed
    try {
      const fullNotice = await apiGet<Notice>(`api/notices/${notice.id}`);
        setFormData({
          title: fullNotice.title || '',
          image: null,
          featured: fullNotice.featured || false,
        });
        setExistingImageUrl(fullNotice.image_url || null);
    } catch (err) {
      console.error('Error fetching notice details:', err);
    }
    
    setIsModalOpen(true);
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setPreviewImage(null);
  };

  // Submit form
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

      // For new notices, image is optional but recommended
      // For editing, if no new image and no existing image, that's okay (title-only update)
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('featured', formData.featured.toString());
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const endpoint = isEditing && editingNoticeId
        ? `api/notices/${editingNoticeId}`
        : 'api/notices';

      const response = await apiRequestFormData(
        endpoint,
        formDataToSend,
        isEditing ? 'PUT' : 'POST'
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
        throw new Error(errorData.detail || 'Failed to save notice');
      }

      setIsModalOpen(false);
      setFormError('');
      fetchNotices();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete notice
  const handleDelete = async (id: string) => {
    try {
      await apiDelete(`api/notices/${id}`);
      setDeleteConfirmId(null);
      fetchNotices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
            <h1 className="text-2xl font-bold text-gray-900">Notices Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your notices and announcements</p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Notice
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && !isModalOpen && (
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
        ) : filteredNotices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No notices found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchQuery ? 'Try adjusting your search query' : 'Add your first notice to get started'}
            </p>
          </div>
        ) : (
          <>
            {/* Notices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xs transition-shadow bg-white"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100">
                    {notice.image_url ? (
                      <Image
                        src={notice.image_url}
                        alt={notice.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    {/* Featured Badge */}
                    {notice.featured && (
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {notice.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Calendar className="w-3 h-3" />
                      {formatDate(notice.created_at)}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleEdit(notice)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(notice.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-red-600 bg-secondary/10 hover:bg-secondary/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
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

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Edit Notice' : 'Add New Notice'}
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
              {/* Form Error */}
              {formError && (
                <div className="p-2 bg-red-50 text-sm border border-red-200 rounded-lg text-red-700">
                  {formError}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter notice title"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/200 characters
                </p>
              </div>

              {/* Featured Checkbox */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Featured Notice
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  Featured notices will be highlighted and unfeature all other notices
                </p>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image {!isEditing && '(Optional)'}
                </label>
                
                {/* Existing Image Preview */}
                {existingImageUrl && !previewImage && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Current Image:</p>
                    <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden">
                      <Image
                        src={existingImageUrl}
                        alt="Current notice image"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Upload a new image to replace this one
                    </p>
                  </div>
                )}

                {/* New Image Preview */}
                {previewImage && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">New Image Preview:</p>
                    <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden">
                      <Image
                        src={previewImage}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Image Input */}
                {!previewImage && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload image
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        JPG, PNG, GIF, WEBP, SVG (Max 5MB)
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormError('');
                  }}
                  className="flex-1 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
                  ) : isEditing ? (
                    'Update Notice'
                  ) : (
                    'Add Notice'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Notice</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this notice? This action cannot be undone and will also delete the associated image.
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
    </div>
  );
}
