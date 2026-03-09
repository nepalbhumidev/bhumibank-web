'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  Image as ImageIcon,
  FileText,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { apiGet, apiRequestFormData, apiDelete } from '@/lib/api-client';
import Image from 'next/image';

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

interface PublicationFormData {
  title: string;
  thumbnail_image: File | null;
  pdf_file: File | null;
}

const getInitialFormData = (): PublicationFormData => ({
  title: '',
  thumbnail_image: null,
  pdf_file: null,
});

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(12);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPublicationId, setEditingPublicationId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState<PublicationFormData>(() => getInitialFormData());
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | null>(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState<string | null>(null);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      setError('');

      const skip = currentPage * pageSize;
      const data = await apiGet<Publication[]>(
        `api/publications?skip=${skip}&limit=${pageSize}&sort_by=created_at&sort_order=-1`
      );

      setPublications(Array.isArray(data) ? data : []);
      setTotalPages(data.length < pageSize ? currentPage + 1 : currentPage + 2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, [currentPage]);

  const filteredPublications = publications.filter((pub) =>
    pub.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setIsEditing(false);
    setEditingPublicationId(null);
    setFormError('');
    setFormData(getInitialFormData());
    setPreviewThumbnail(null);
    setExistingThumbnailUrl(null);
    setExistingPdfUrl(null);
    setIsModalOpen(true);
  };

  const handleEdit = async (publication: Publication) => {
    setIsEditing(true);
    setEditingPublicationId(publication.id);
    setFormError('');
    setFormData({
      title: publication.title || '',
      thumbnail_image: null,
      pdf_file: null,
    });
    setPreviewThumbnail(null);
    setExistingThumbnailUrl(publication.thumbnail_image_url || null);
    setExistingPdfUrl(publication.pdf_url || null);
    setIsModalOpen(true);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, thumbnail_image: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreviewThumbnail(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setFormData({ ...formData, thumbnail_image: null });
    setPreviewThumbnail(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
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

      if (!isEditing) {
        if (!formData.thumbnail_image) {
          setFormError('Thumbnail image is required');
          setFormLoading(false);
          return;
        }
        if (!formData.pdf_file) {
          setFormError('PDF file is required');
          setFormLoading(false);
          return;
        }
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());

      if (formData.thumbnail_image) {
        formDataToSend.append('thumbnail_image', formData.thumbnail_image);
      }
      if (formData.pdf_file) {
        formDataToSend.append('pdf_file', formData.pdf_file);
      }

      const endpoint =
        isEditing && editingPublicationId
          ? `api/publications/${editingPublicationId}`
          : 'api/publications';

      if (!isEditing && (!formData.thumbnail_image || !formData.pdf_file)) {
        setFormError('Both thumbnail image and PDF are required for new publications');
        setFormLoading(false);
        return;
      }

      const response = await apiRequestFormData(
        endpoint,
        formDataToSend,
        isEditing ? 'PUT' : 'POST'
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
        throw new Error(errorData.detail || 'Failed to save publication');
      }

      setIsModalOpen(false);
      setFormError('');
      fetchPublications();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDelete(`api/publications/${id}`);
      setDeleteConfirmId(null);
      fetchPublications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

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
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Publications Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage publications, reports and PDF documents</p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Publication
          </button>
        </div>
      </div>

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

      {error && !isModalOpen && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredPublications.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No publications found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchQuery ? 'Try adjusting your search query' : 'Add your first publication to get started'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPublications.map((pub) => (
                <div
                  key={pub.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xs transition-shadow bg-white"
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
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-black/50 text-white text-xs font-medium rounded">
                        <FileText className="w-3 h-3" />
                        PDF
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{pub.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Calendar className="w-3 h-3" />
                      {formatDate(pub.created_at)}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleEdit(pub)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(pub.id)}
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

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
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
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Edit Publication' : 'Add New Publication'}
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
              {formError && (
                <div className="p-2 bg-red-50 text-sm border border-red-200 rounded-lg text-red-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter publication title"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.title.length}/200 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail Image {isEditing && '(optional - leave empty to keep current)'}
                </label>

                {existingThumbnailUrl && !previewThumbnail && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Current thumbnail:</p>
                    <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden">
                      <Image
                        src={existingThumbnailUrl}
                        alt="Current thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Upload a new image to replace</p>
                  </div>
                )}

                {previewThumbnail && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">New thumbnail preview:</p>
                    <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden">
                      <Image
                        src={previewThumbnail}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {!previewThumbnail && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.webp,.svg,image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label htmlFor="thumbnail-upload" className="cursor-pointer flex flex-col items-center">
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload thumbnail</span>
                      <span className="text-xs text-gray-500 mt-1">JPG, PNG, GIF, WEBP, SVG (Max 5MB)</span>
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF File {isEditing && '(optional - leave empty to keep current)'}
                </label>
                {existingPdfUrl && !formData.pdf_file && (
                  <p className="text-xs text-gray-500 mb-2">Current PDF is set. Upload a new file to replace.</p>
                )}
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) =>
                    setFormData({ ...formData, pdf_file: e.target.files?.[0] ?? null })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {formData.pdf_file && (
                  <p className="text-xs text-gray-500 mt-1">Selected: {formData.pdf_file.name}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">PDF only (Max 20MB)</p>
              </div>

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
                    'Update Publication'
                  ) : (
                    'Add Publication'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Publication</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this publication? This will remove the thumbnail and PDF
              files. This action cannot be undone.
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
