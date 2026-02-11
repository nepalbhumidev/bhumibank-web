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
  File,
  TrendingUp
} from 'lucide-react';
import { apiGet, apiDelete } from '@/lib/api-client';
import Image from 'next/image';

interface ShareApplication {
  id: string;
  application_date?: string;
  applicant_photo?: string;
  passport_size_photo?: string;
  signature?: string;
  personal_details?: {
    full_name?: string;
    gender?: string;
    date_of_birth?: string;
    marital_status?: string;
    religion?: string;
  };
  share_details?: {
    share_quantity?: string;
    share_quantity_in_words?: string;
    share_amount?: string;
    share_amount_in_words?: string;
  };
  identification?: {
    pan_number?: string;
    national_id_number?: string;
    boid_number?: string;
    citizenship_number?: string;
    citizenship_issue_date?: string;
    citizenship_issue_district?: string;
    passport_number?: string;
    passport_issue_date?: string;
    passport_expiry_date?: string;
    passport_issue_office?: string;
    visa_expiry_date?: string;
    national_id_type?: string;
    national_id_issue_office?: string;
    national_id_issue_date?: string;
    citizenship_passport_document?: string;
    national_identity_document?: string;
    pan_document?: string;
  };
  family_details?: {
    spouse_name?: string;
    father_name?: string;
    mother_name?: string;
    grandfather_name?: string;
    son_name?: string;
    daughter_name?: string;
    other_family_members?: string;
  };
  permanent_address?: {
    province?: string;
    district?: string;
    municipality?: string;
    ward_number?: string;
    tole?: string;
    house_number?: string;
    phone?: string;
    mobile?: string;
    email?: string;
  };
  temporary_address?: {
    province?: string;
    district?: string;
    municipality?: string;
    ward_number?: string;
    tole?: string;
    house_number?: string;
    phone?: string;
    mobile?: string;
    email?: string;
  };
  occupation?: {
    occupation_type?: string;
    organization_name?: string;
    organization_address?: string;
    designation?: string;
    estimated_annual_income?: string;
  };
  nominee?: {
    nominee_name?: string;
    nominee_relationship?: string;
    nominee_address?: {
      province?: string;
      district?: string;
      municipality?: string;
      ward_number?: string;
      tole?: string;
      house_number?: string;
      phone?: string;
      mobile?: string;
      email?: string;
    };
    nominee_citizenship_document?: string;
  };
  agreement_accepted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function ShareApplicationsPage() {
  const [applications, setApplications] = useState<ShareApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(12);
  
  // Modal states
  const [selectedApplication, setSelectedApplication] = useState<ShareApplication | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      
      const skip = currentPage * pageSize;
      const data = await apiGet<ShareApplication[]>(
        `api/share-applications?skip=${skip}&limit=${pageSize}&sort_by=created_at&sort_order=-1`
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
  const filteredApplications = applications.filter(app => {
    const fullName = app.personal_details?.full_name?.toLowerCase() || '';
    const email = app.permanent_address?.email?.toLowerCase() || app.temporary_address?.email?.toLowerCase() || '';
    const phone = app.permanent_address?.phone || app.permanent_address?.mobile || app.temporary_address?.phone || app.temporary_address?.mobile || '';
    
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery)
    );
  });

  // View application details
  const handleViewDetails = async (application: ShareApplication) => {
    try {
      // Fetch full details
      const fullApplication = await apiGet<ShareApplication>(`api/share-applications/${application.id}`);
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
      await apiDelete(`api/share-applications/${id}`);
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

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Share Purchase Applications</h1>
            <p className="text-sm text-gray-600 mt-1">View and manage share purchase applications</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              Share Applications
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
              {searchQuery ? 'Try adjusting your search query' : 'No share purchase applications have been submitted yet'}
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
                        {application.passport_size_photo ? (
                          <Image
                            src={application.passport_size_photo}
                            alt={application.personal_details?.full_name || 'Applicant'}
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
                          {application.personal_details?.full_name || 'N/A'}
                        </h3>
                        {application.share_details?.share_quantity && (
                          <p className="text-sm text-gray-600 truncate">
                            {application.share_details.share_quantity} shares
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-2">
                    {application.permanent_address?.mobile && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{application.permanent_address.mobile}</span>
                      </div>
                    )}
                    {application.permanent_address?.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{application.permanent_address.email}</span>
                      </div>
                    )}
                    {application.permanent_address?.district && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">
                          {application.permanent_address.district}, {application.permanent_address.province}
                        </span>
                      </div>
                    )}
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
                  {selectedApplication.passport_size_photo ? (
                    <Image
                      src={selectedApplication.passport_size_photo}
                      alt={selectedApplication.personal_details?.full_name || 'Applicant'}
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
                    {selectedApplication.personal_details?.full_name || 'N/A'}
                  </h2>
                  {selectedApplication.share_details?.share_quantity && (
                    <p className="text-sm text-gray-600">
                      {selectedApplication.share_details.share_quantity} shares
                    </p>
                  )}
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
              {selectedApplication.personal_details && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApplication.personal_details.full_name && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Full Name
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.personal_details.full_name}</p>
                      </div>
                    )}
                    {selectedApplication.personal_details.gender && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gender
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.personal_details.gender}</p>
                      </div>
                    )}
                    {selectedApplication.personal_details.date_of_birth && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date of Birth
                        </label>
                        <p className="text-gray-900 mt-1">{formatDate(selectedApplication.personal_details.date_of_birth)}</p>
                      </div>
                    )}
                    {selectedApplication.personal_details.marital_status && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Marital Status
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.personal_details.marital_status}</p>
                      </div>
                    )}
                    {selectedApplication.personal_details.religion && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Religion
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.personal_details.religion}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Share Details */}
              {selectedApplication.share_details && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Share Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApplication.share_details.share_quantity && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Share Quantity
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.share_details.share_quantity}</p>
                      </div>
                    )}
                    {selectedApplication.share_details.share_quantity_in_words && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Share Quantity (in words)
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.share_details.share_quantity_in_words}</p>
                      </div>
                    )}
                    {selectedApplication.share_details.share_amount && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Share Amount
                        </label>
                        <p className="text-gray-900 mt-1">Rs. {selectedApplication.share_details.share_amount}</p>
                      </div>
                    )}
                    {selectedApplication.share_details.share_amount_in_words && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Share Amount (in words)
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.share_details.share_amount_in_words}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Identification */}
              {selectedApplication.identification && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Identification
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApplication.identification.citizenship_number && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Citizenship Number
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.identification.citizenship_number}</p>
                      </div>
                    )}
                    {selectedApplication.identification.pan_number && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          PAN Number
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.identification.pan_number}</p>
                      </div>
                    )}
                    {selectedApplication.identification.national_id_number && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          National ID Number
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.identification.national_id_number}</p>
                      </div>
                    )}
                    {selectedApplication.identification.boid_number && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          BOID Number
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.identification.boid_number}</p>
                      </div>
                    )}
                    {selectedApplication.identification.passport_number && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Passport Number
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.identification.passport_number}</p>
                      </div>
                    )}
                    {selectedApplication.identification.citizenship_issue_date && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Citizenship Issue Date
                        </label>
                        <p className="text-gray-900 mt-1">{formatDate(selectedApplication.identification.citizenship_issue_date)}</p>
                      </div>
                    )}
                    {selectedApplication.identification.citizenship_issue_district && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Citizenship Issue District
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.identification.citizenship_issue_district}</p>
                      </div>
                    )}
                    {selectedApplication.identification.passport_issue_date && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Passport Issue Date
                        </label>
                        <p className="text-gray-900 mt-1">{formatDate(selectedApplication.identification.passport_issue_date)}</p>
                      </div>
                    )}
                    {selectedApplication.identification.passport_expiry_date && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Passport Expiry Date
                        </label>
                        <p className="text-gray-900 mt-1">{formatDate(selectedApplication.identification.passport_expiry_date)}</p>
                      </div>
                    )}
                    {selectedApplication.identification.passport_issue_office && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Passport Issue Office
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.identification.passport_issue_office}</p>
                      </div>
                    )}
                    {selectedApplication.identification.visa_expiry_date && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Visa Expiry Date
                        </label>
                        <p className="text-gray-900 mt-1">{formatDate(selectedApplication.identification.visa_expiry_date)}</p>
                      </div>
                    )}
                    {selectedApplication.identification.national_id_type && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          National ID Type
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.identification.national_id_type}</p>
                      </div>
                    )}
                    {selectedApplication.identification.national_id_issue_office && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          National ID Issue Office
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.identification.national_id_issue_office}</p>
                      </div>
                    )}
                    {selectedApplication.identification.national_id_issue_date && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          National ID Issue Date
                        </label>
                        <p className="text-gray-900 mt-1">{formatDate(selectedApplication.identification.national_id_issue_date)}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Family Details */}
              {selectedApplication.family_details && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Family Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApplication.family_details.spouse_name && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Spouse Name
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.family_details.spouse_name}</p>
                      </div>
                    )}
                    {selectedApplication.family_details.father_name && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Father&apos;s Name
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.family_details.father_name}</p>
                      </div>
                    )}
                    {selectedApplication.family_details.mother_name && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mother&apos;s Name
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.family_details.mother_name}</p>
                      </div>
                    )}
                    {selectedApplication.family_details.grandfather_name && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grandfather&apos;s Name
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.family_details.grandfather_name}</p>
                      </div>
                    )}
                    {selectedApplication.family_details.son_name && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Son&apos;s Name
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.family_details.son_name}</p>
                      </div>
                    )}
                    {selectedApplication.family_details.daughter_name && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Daughter&apos;s Name
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.family_details.daughter_name}</p>
                      </div>
                    )}
                    {selectedApplication.family_details.other_family_members && (
                      <div className="md:col-span-2">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Other Family Members
                        </label>
                        <p className="text-gray-900 mt-1 whitespace-pre-wrap">{selectedApplication.family_details.other_family_members}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Permanent Address */}
              {selectedApplication.permanent_address && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Permanent Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApplication.permanent_address.province && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Province
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.permanent_address.province}</p>
                      </div>
                    )}
                    {selectedApplication.permanent_address.district && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          District
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.permanent_address.district}</p>
                      </div>
                    )}
                    {selectedApplication.permanent_address.municipality && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Municipality
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.permanent_address.municipality}</p>
                      </div>
                    )}
                    {selectedApplication.permanent_address.ward_number && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ward Number
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.permanent_address.ward_number}</p>
                      </div>
                    )}
                    {selectedApplication.permanent_address.mobile && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mobile
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.permanent_address.mobile}</p>
                      </div>
                    )}
                    {selectedApplication.permanent_address.tole && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tole
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.permanent_address.tole}</p>
                      </div>
                    )}
                    {selectedApplication.permanent_address.house_number && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          House Number
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.permanent_address.house_number}</p>
                      </div>
                    )}
                    {selectedApplication.permanent_address.phone && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.permanent_address.phone}</p>
                      </div>
                    )}
                    {selectedApplication.permanent_address.mobile && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mobile
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.permanent_address.mobile}</p>
                      </div>
                    )}
                    {selectedApplication.permanent_address.email && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.permanent_address.email}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Temporary Address */}
              {selectedApplication.temporary_address && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Temporary Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApplication.temporary_address.province && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Province
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.temporary_address.province}</p>
                      </div>
                    )}
                    {selectedApplication.temporary_address.district && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          District
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.temporary_address.district}</p>
                      </div>
                    )}
                    {selectedApplication.temporary_address.municipality && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Municipality
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.temporary_address.municipality}</p>
                      </div>
                    )}
                    {selectedApplication.temporary_address.ward_number && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ward Number
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.temporary_address.ward_number}</p>
                      </div>
                    )}
                    {selectedApplication.temporary_address.tole && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tole
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.temporary_address.tole}</p>
                      </div>
                    )}
                    {selectedApplication.temporary_address.house_number && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          House Number
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.temporary_address.house_number}</p>
                      </div>
                    )}
                    {selectedApplication.temporary_address.phone && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.temporary_address.phone}</p>
                      </div>
                    )}
                    {selectedApplication.temporary_address.mobile && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mobile
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.temporary_address.mobile}</p>
                      </div>
                    )}
                    {selectedApplication.temporary_address.email && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.temporary_address.email}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Occupation */}
              {selectedApplication.occupation && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Occupation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApplication.occupation.occupation_type && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Occupation Type
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.occupation.occupation_type}</p>
                      </div>
                    )}
                    {selectedApplication.occupation.organization_name && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Organization Name
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.occupation.organization_name}</p>
                      </div>
                    )}
                    {selectedApplication.occupation.organization_address && (
                      <div className="md:col-span-2">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Organization Address
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.occupation.organization_address}</p>
                      </div>
                    )}
                    {selectedApplication.occupation.designation && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Designation
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.occupation.designation}</p>
                      </div>
                    )}
                    {selectedApplication.occupation.estimated_annual_income && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estimated Annual Income
                        </label>
                        <p className="text-gray-900 mt-1">Rs. {selectedApplication.occupation.estimated_annual_income}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Nominee */}
              {selectedApplication.nominee && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Nominee Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApplication.nominee.nominee_name && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nominee Name
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.nominee.nominee_name}</p>
                      </div>
                    )}
                    {selectedApplication.nominee.nominee_relationship && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Relationship
                        </label>
                        <p className="text-gray-900 mt-1">{selectedApplication.nominee.nominee_relationship}</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedApplication.nominee.nominee_address && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Nominee Address</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedApplication.nominee.nominee_address.province && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Province
                            </label>
                            <p className="text-gray-900 mt-1">{selectedApplication.nominee.nominee_address.province}</p>
                          </div>
                        )}
                        {selectedApplication.nominee.nominee_address.district && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              District
                            </label>
                            <p className="text-gray-900 mt-1">{selectedApplication.nominee.nominee_address.district}</p>
                          </div>
                        )}
                        {selectedApplication.nominee.nominee_address.municipality && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Municipality
                            </label>
                            <p className="text-gray-900 mt-1">{selectedApplication.nominee.nominee_address.municipality}</p>
                          </div>
                        )}
                        {selectedApplication.nominee.nominee_address.ward_number && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ward Number
                            </label>
                            <p className="text-gray-900 mt-1">{selectedApplication.nominee.nominee_address.ward_number}</p>
                          </div>
                        )}
                        {selectedApplication.nominee.nominee_address.tole && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tole
                            </label>
                            <p className="text-gray-900 mt-1">{selectedApplication.nominee.nominee_address.tole}</p>
                          </div>
                        )}
                        {selectedApplication.nominee.nominee_address.house_number && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              House Number
                            </label>
                            <p className="text-gray-900 mt-1">{selectedApplication.nominee.nominee_address.house_number}</p>
                          </div>
                        )}
                        {selectedApplication.nominee.nominee_address.phone && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Phone
                            </label>
                            <p className="text-gray-900 mt-1">{selectedApplication.nominee.nominee_address.phone}</p>
                          </div>
                        )}
                        {selectedApplication.nominee.nominee_address.mobile && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Mobile
                            </label>
                            <p className="text-gray-900 mt-1">{selectedApplication.nominee.nominee_address.mobile}</p>
                          </div>
                        )}
                        {selectedApplication.nominee.nominee_address.email && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </label>
                            <p className="text-gray-900 mt-1">{selectedApplication.nominee.nominee_address.email}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* Documents */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Uploaded Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedApplication.passport_size_photo && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <ImageIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Passport Size Photo</p>
                      </div>
                      <a
                        href={selectedApplication.passport_size_photo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </a>
                    </div>
                  )}
                  {selectedApplication.signature && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <ImageIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Signature</p>
                      </div>
                      <a
                        href={selectedApplication.signature}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </a>
                    </div>
                  )}
                  {selectedApplication.identification?.citizenship_passport_document && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <File className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Citizenship/Passport Document</p>
                      </div>
                      <a
                        href={selectedApplication.identification.citizenship_passport_document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </a>
                    </div>
                  )}
                  {selectedApplication.identification?.national_identity_document && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <File className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">National Identity Document</p>
                      </div>
                      <a
                        href={selectedApplication.identification.national_identity_document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </a>
                    </div>
                  )}
                  {selectedApplication.identification?.pan_document && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <File className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">PAN Document</p>
                      </div>
                      <a
                        href={selectedApplication.identification.pan_document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </a>
                    </div>
                  )}
                  {selectedApplication.nominee?.nominee_citizenship_document && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <File className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Nominee Citizenship Document</p>
                      </div>
                      <a
                        href={selectedApplication.nominee.nominee_citizenship_document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </a>
                    </div>
                  )}
                </div>
              </section>

              {/* Application Information */}
              <section className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedApplication.application_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block">
                          Application Date
                        </label>
                        <p className="text-gray-900 mt-1">{formatDate(selectedApplication.application_date)}</p>
                      </div>
                    </div>
                  )}
                  {selectedApplication.created_at && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block">
                          Submitted On
                        </label>
                        <p className="text-gray-900 mt-1">{formatDate(selectedApplication.created_at)}</p>
                      </div>
                    </div>
                  )}
                  {selectedApplication.updated_at && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block">
                          Last Updated
                        </label>
                        <p className="text-gray-900 mt-1">{formatDate(selectedApplication.updated_at)}</p>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block">
                      Agreement Accepted
                    </label>
                    <p className="text-gray-900 mt-1">
                      {selectedApplication.agreement_accepted ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          No
                        </span>
                      )}
                    </p>
                  </div>
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
              Are you sure you want to delete this share purchase application? This action cannot be undone and will also delete all associated documents.
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
