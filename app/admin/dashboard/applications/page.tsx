'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Eye,
  Trash2, 
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  File
} from 'lucide-react';
import { apiGet, apiDelete } from '@/lib/api-client';
import Image from 'next/image';

interface DocumentRef {
  filename: string;
  content_type: string;
  file_url: string;
}

interface MemberApplication {
  id: string;
  nepali_name: string;
  english_name: string;
  grandfather_name: string;
  father_name: string;
  address_as_per_citizenship: string;
  current_address: string;
  phone_number: string;
  whatsapp_number: string | null;
  email: string | null;
  service_requested: string;
  facilities_requested: string | null;
  citizenship_copy: DocumentRef;
  national_id_copy: DocumentRef | null;
  pan_card_copy: DocumentRef | null;
  photo: DocumentRef;
  service_related_documents: DocumentRef[];
  facility_related_documents: DocumentRef[];
  created_at?: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<MemberApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(12);
  
  // Modal states
  const [selectedApplication, setSelectedApplication] = useState<MemberApplication | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      
      const skip = currentPage * pageSize;
      const data = await apiGet<MemberApplication[]>(
        `api/member-applications?skip=${skip}&limit=${pageSize}&sort_by=created_at&sort_order=-1`
      );
      
      setApplications(Array.isArray(data) ? data : []);
      setTotalPages(data.length < pageSize ? currentPage + 1 : currentPage + 2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [currentPage]);

  // Filter applications based on search
  const filteredApplications = applications.filter(app =>
    app.english_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.nepali_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.phone_number.includes(searchQuery) ||
    (app.email && app.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // View application details
  const handleViewDetails = async (application: MemberApplication) => {
    try {
      // Fetch full details
      const fullApplication = await apiGet<MemberApplication>(`api/member-applications/${application.id}`);
      setSelectedApplication(fullApplication);
      setIsDetailModalOpen(true);
    } catch (err) {
      // Use the list data if detail fetch fails
      setSelectedApplication(application);
      setIsDetailModalOpen(true);
    }
  };

  // Delete application
  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(true);
      await apiDelete(`api/member-applications/${id}`);
      setDeleteConfirmId(null);
      fetchApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setDeleteLoading(false);
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

  // Check if document is an image
  const isImageDocument = (doc: DocumentRef) => {
    return doc.content_type.startsWith('image/');
  };

  // Render document link
  const renderDocument = (doc: DocumentRef | null, label: string, key?: string) => {
    if (!doc) return null;
    
    return (
      <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        {isImageDocument(doc) ? (
          <ImageIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
        ) : (
          <File className="w-5 h-5 text-red-600 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-xs text-gray-500 truncate">{doc.filename}</p>
        </div>
         <a
           href={doc.file_url}
           target="_blank"
           rel="noopener noreferrer"
           className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors"
         >
           <Eye className="w-3 h-3" />
           View
         </a>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applications Management</h1>
            <p className="text-sm text-gray-600 mt-1">View and manage membership applications</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
              <User className="w-4 h-4" />
              Membership Applications
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && !isDetailModalOpen && (
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
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No applications found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchQuery ? 'Try adjusting your search query' : 'No membership applications have been submitted yet'}
            </p>
          </div>
        ) : (
          <>
            {/* Applications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xs transition-shadow bg-white"
                >
                  {/* Photo and Basic Info Header */}
                  <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      {/* Photo */}
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {application.photo?.file_url ? (
                          <Image
                            src={application.photo.file_url}
                            alt={application.english_name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {application.english_name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {application.nepali_name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{application.phone_number}</span>
                    </div>
                    {application.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{application.email}</span>
                      </div>
                    )}
                     <div className="flex items-center gap-2 text-sm text-gray-600">
                       <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                       <span className="truncate">{application.current_address}</span>
                     </div>
                   </div>

                  {/* Actions */}
                  <div className="p-4 pt-0">
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleViewDetails(application)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(application.id)}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
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

      {/* Detail Modal */}
      {isDetailModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                {/* Photo */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {selectedApplication.photo?.file_url ? (
                    <Image
                      src={selectedApplication.photo.file_url}
                      alt={selectedApplication.english_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedApplication.english_name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedApplication.nepali_name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedApplication(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">
              {/* Personal Information */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name (English)
                    </label>
                    <p className="text-gray-900 mt-1">{selectedApplication.english_name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name (Nepali)
                    </label>
                    <p className="text-gray-900 mt-1">{selectedApplication.nepali_name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grandfather's Name
                    </label>
                    <p className="text-gray-900 mt-1">{selectedApplication.grandfather_name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Father's Name
                    </label>
                    <p className="text-gray-900 mt-1">{selectedApplication.father_name}</p>
                  </div>
                </div>
              </section>

              {/* Address Information */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address (as per Citizenship)
                    </label>
                    <p className="text-gray-900 mt-1">{selectedApplication.address_as_per_citizenship}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Address
                    </label>
                    <p className="text-gray-900 mt-1">{selectedApplication.current_address}</p>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <p className="text-gray-900 mt-1">{selectedApplication.phone_number}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      WhatsApp Number
                    </label>
                    <p className="text-gray-900 mt-1">{selectedApplication.whatsapp_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </label>
                    <p className="text-gray-900 mt-1">{selectedApplication.email || 'N/A'}</p>
                  </div>
                </div>
              </section>

              {/* Services & Facilities */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Services & Facilities Requested
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Requested
                    </label>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">{selectedApplication.service_requested}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Facilities Requested
                    </label>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                      {selectedApplication.facilities_requested || 'N/A'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Documents */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Uploaded Documents
                </h3>
                
                {/* Required Documents */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Required Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {renderDocument(selectedApplication.citizenship_copy, 'Citizenship Copy')}
                    {renderDocument(selectedApplication.photo, 'Photo')}
                  </div>
                </div>

                {/* Optional Documents */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Optional Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {renderDocument(selectedApplication.national_id_copy, 'National ID Copy')}
                    {renderDocument(selectedApplication.pan_card_copy, 'PAN Card Copy')}
                    {!selectedApplication.national_id_copy && !selectedApplication.pan_card_copy && (
                      <p className="text-sm text-gray-500 col-span-2">No optional documents uploaded</p>
                    )}
                  </div>
                </div>

                {/* Service Related Documents */}
                {selectedApplication.service_related_documents.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Service Related Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedApplication.service_related_documents.map((doc, index) => (
                        renderDocument(doc, `Document ${index + 1}`, `service-doc-${index}`)
                      ))}
                    </div>
                  </div>
                )}

                {/* Facility Related Documents */}
                {selectedApplication.facility_related_documents.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Facility Related Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedApplication.facility_related_documents.map((doc, index) => (
                        renderDocument(doc, `Document ${index + 1}`, `facility-doc-${index}`)
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Application Date */}
              <section className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  Application submitted on {formatDate(selectedApplication.created_at)}
                </div>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setDeleteConfirmId(selectedApplication.id);
                }}
                className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors inline-flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Application
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedApplication(null);
                }}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Application</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this membership application? This action cannot be undone and will also delete all associated documents.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
