'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar,
  Image as ImageIcon,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import { getApiUrl } from '@/lib/api-client';
import { getAuthToken } from '@/lib/auth-client';
import Image from 'next/image';

interface Blog {
  id: string;
  title: string;
  title_np?: string;
  content?: string;
  author?: string;
  published_date?: string;
  image_url?: string;
  image_urls?: string[];
  slug?: string;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
  seo_data?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    canonical_url?: string;
  };
}

interface BlogFormData {
  title: string;
  title_np: string;
  content: string;
  is_published: boolean;
  published_date: string;
  images: File[];
  seo_data?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    canonical_url?: string;
  };
}

// Initial form data helper
const getInitialFormData = (): BlogFormData => ({
  title: '',
  title_np: '',
  content: '',
  is_published: false,
  published_date: new Date().toISOString().split('T')[0],
  images: [],
  seo_data: {
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    canonical_url: '',
  },
});

export default function MediaPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(12);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Form state (is_published is now handled by button clicks, not form state)
  const [formData, setFormData] = useState<BlogFormData>(() => getInitialFormData());
  
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError('');
      const apiUrl = getApiUrl();
      const token = getAuthToken();
      
      const skip = currentPage * pageSize;
      const response = await fetch(
        `${apiUrl}api/blogs/admin/all?skip=${skip}&limit=${pageSize}&sort_by=published_date&sort_order=-1`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }

      const data = await response.json();
      setBlogs(Array.isArray(data) ? data : []);
      
      // Simple pagination: if we get less than pageSize, we're on the last page
      setTotalPages(data.length < pageSize ? currentPage + 1 : currentPage + 2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  // Filter blogs based on search
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.title_np?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open create modal
  const handleCreate = () => {
    setIsEditing(false);
    setEditingBlogId(null);
    setFormError('');
    setFormData(getInitialFormData());
    setPreviewImages([]);
    setExistingImages([]);
    setIsModalOpen(true);
  };

  // Extract date part from ISO string (YYYY-MM-DD) to avoid timezone issues
  const extractDatePart = (dateString: string): string => {
    if (!dateString) return '';
    const dateStr = dateString.toString();
    if (dateStr.includes('T')) {
      return dateStr.split('T')[0];
    }
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
      return dateStr.substring(0, 10);
    }
    try {
      const date = new Date(dateStr);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  };

  // Open edit modal
  const handleEdit = (blog: Blog) => {
    setIsEditing(true);
    setEditingBlogId(blog.id);
    setFormError('');
    
    setFormData({
      title: blog.title || '',
      title_np: blog.title_np || '',
      content: blog.content || '',
      is_published: blog.is_published === true,
      published_date: extractDatePart(blog.published_date || ''),
      images: [],
      seo_data: blog.seo_data || {
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        canonical_url: '',
      },
    });
    
    setExistingImages(blog.image_urls || (blog.image_url ? [blog.image_url] : []));
    setPreviewImages([]);
    setIsModalOpen(true);
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, images: [...formData.images, ...files] });
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  // Remove existing image from UI (user must add new images to replace)
  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  // Submit form with publish status
  const handleSubmit = async (isPublished: boolean) => {
    setFormLoading(true);
    setFormError('');

    try {
      // Validation: At least one image is required (backend requirement)
      const hasNewImages = formData.images.length > 0;
      const hasExistingImages = existingImages.length > 0;
      
      if (!isEditing && !hasNewImages) {
        setFormError('At least one image is required');
        setFormLoading(false);
        return;
      }
      
      if (isEditing && !hasNewImages && !hasExistingImages) {
        setFormError('At least one image is required');
        setFormLoading(false);
        return;
      }

      const apiUrl = getApiUrl();
      const token = getAuthToken();
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      
      // Add Nepali title if provided
      if (formData.title_np && formData.title_np.trim()) {
        formDataToSend.append('title_np', formData.title_np.trim());
      }
      
      formDataToSend.append('content', formData.content);
      formDataToSend.append('is_published', isPublished ? 'true' : 'false');
      
      // published_date and is_published are independent fields
      // Send published_date only if user provided a value (backend uses it as-is)
      if (formData.published_date?.trim()) {
        formDataToSend.append('published_date', formData.published_date.trim());
      }
      
      formData.images.forEach(file => {
        formDataToSend.append('images', file);
      });
      
      // Only send SEO data if user provided custom values
      if (formData.seo_data && Object.values(formData.seo_data).some(v => v && v.trim())) {
        formDataToSend.append('seo_data_json', JSON.stringify(formData.seo_data));
      }

      const url = isEditing && editingBlogId
        ? `${apiUrl}api/blogs/${editingBlogId}`
        : `${apiUrl}api/blogs`;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
        throw new Error(errorData.detail || 'Failed to save blog');
      }

      setIsModalOpen(false);
      setFormError('');
      fetchBlogs();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  // Quick publish blog (only for drafts)
  const handleTogglePublish = async (blog: Blog) => {
    try {
      const apiUrl = getApiUrl();
      const token = getAuthToken();
      
      const formDataToSend = new FormData();
      formDataToSend.append('is_published', 'true');

      const response = await fetch(`${apiUrl}api/blogs/${blog.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
        throw new Error(errorData.detail || 'Failed to publish blog');
      }

      fetchBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Delete blog
  const handleDelete = async (id: string) => {
    try {
      const apiUrl = getApiUrl();
      const token = getAuthToken();
      
      const response = await fetch(`${apiUrl}api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }

      setDeleteConfirmId(null);
      fetchBlogs();
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
            <h1 className="text-2xl font-bold text-gray-900">News/Media Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your blog posts and media content</p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New Post
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

      {/* Error Message - Only for fetch errors, not form errors */}
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
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No blog posts found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchQuery ? 'Try adjusting your search query' : 'Create your first blog post to get started'}
            </p>
          </div>
        ) : (
          <>
            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xs transition-shadow bg-white"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100">
                    {blog.image_url ? (
                      <Image
                        src={blog.image_url}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      {blog.is_published ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          <Eye className="w-3 h-3" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                          <EyeOff className="w-3 h-3" />
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    {blog.title_np && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        {blog.title_np}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Calendar className="w-3 h-3" />
                      {formatDate(blog.published_date)}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      {!blog.is_published && (
                        <button
                          onClick={() => handleTogglePublish(blog)}
                          className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-green-600 bg-green-50 hover:bg-green-100 rounded transition-colors"
                          title="Publish this blog"
                        >
                          <Eye className="w-4 h-4" />
                          Publish
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteConfirmId(blog.id)}
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

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
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

            <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-6">
              {/* Form Error Message */}
              {formError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">Error:</span>
                    <span>{formError}</span>
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter blog title in English"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Slug will be auto-generated from this title
                </p>
              </div>

              {/* Nepali Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (Nepali) <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.title_np}
                  onChange={(e) => setFormData({ ...formData, title_np: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter blog title in Nepali (नेपाली)"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content * (HTML supported)
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                  placeholder="Enter blog content (HTML supported)"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images {!isEditing && <span className="text-red-500">*</span>}
                </label>
                
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">
                      Existing images (will be kept unless replaced with new images):
                    </p>
                    <div className="grid grid-cols-4 gap-4">
                      {existingImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="relative h-24 bg-gray-100 rounded-lg overflow-hidden">
                            <Image 
                              src={url} 
                              alt={`Existing ${index + 1}`} 
                              fill 
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove from display (add new images to replace)"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images Preview */}
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
                  {isEditing 
                    ? 'Add new images to replace existing ones (max 5MB each). At least one image is required.' 
                    : 'At least one image is required. You can select multiple images (max 5MB each).'}
                </p>
              </div>

              {/* Published Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Published Date <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="date"
                  value={formData.published_date}
                  onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* SEO Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings (Optional)</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.seo_data?.meta_title || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        seo_data: { ...formData.seo_data, meta_title: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="SEO title (50-60 chars recommended)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.seo_data?.meta_description || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        seo_data: { ...formData.seo_data, meta_description: e.target.value }
                      })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="SEO description (150-160 chars recommended)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      value={formData.seo_data?.meta_keywords || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        seo_data: { ...formData.seo_data, meta_keywords: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Canonical URL
                    </label>
                    <input
                      type="url"
                      value={formData.seo_data?.canonical_url || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        seo_data: { ...formData.seo_data, canonical_url: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://example.com/blog/slug"
                    />
                  </div>
                </div>
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
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSubmit(false)}
                      disabled={formLoading}
                      className="flex-1 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                    >
                      {formLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Update and Draft'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSubmit(true)}
                      disabled={formLoading}
                      className="flex-1 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                    >
                      {formLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Update and Publish'
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSubmit(false)}
                      disabled={formLoading}
                      className="flex-1 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                    >
                      {formLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Draft Post'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSubmit(true)}
                      disabled={formLoading}
                      className="flex-1 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                    >
                      {formLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Publish Post'
                      )}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Blog Post</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this blog post? This action cannot be undone.
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
