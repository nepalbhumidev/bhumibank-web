'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { apiPublicFormData } from '@/lib/api-client';

const MembershipForm = () => {
  const t = useTranslations('FormsPage.membership');
  const formRef = useRef<HTMLFormElement>(null);
  
  const [formData, setFormData] = useState({
    nameNepali: '',
    nameEnglish: '',
    grandfatherName: '',
    fatherName: '',
    addressCitizenship: '',
    addressCurrent: '',
    phone: '',
    whatsapp: '',
    email: '',
    serviceWanted: '',
    facilityWanted: '',
  });

  const [documents, setDocuments] = useState<{
    citizenship: File | null;
    nationalId: File | null;
    panCard: File | null;
    photo: File | null;
    serviceDocuments: FileList | null;
    facilityDocuments: FileList | null;
  }>({
    citizenship: null,
    nationalId: null,
    panCard: null,
    photo: null,
    serviceDocuments: null,
    facilityDocuments: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});

  const MAX_FILE_SIZE = 500 * 1024; // 500KB in bytes

  const validateFileSize = (file: File): boolean => {
    return file.size <= MAX_FILE_SIZE;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error message when user types
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files) {
      // Clear previous error for this field
      setFileErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });

      if (field === 'serviceDocuments' || field === 'facilityDocuments') {
        // Validate multiple files
        const files = Array.from(e.target.files);
        const invalidFiles: string[] = [];
        
        files.forEach(file => {
          if (!validateFileSize(file)) {
            invalidFiles.push(file.name);
          }
        });

        if (invalidFiles.length > 0) {
          const errorMsg = t('fileSizeError', { fileName: invalidFiles[0] });
          setFileErrors(prev => ({ ...prev, [field]: errorMsg }));
          e.target.value = ''; // Clear the input
          return;
        }

        setDocuments({
          ...documents,
          [field]: e.target.files,
        });
      } else if (e.target.files[0]) {
        // Validate single file
        const file = e.target.files[0];
        if (!validateFileSize(file)) {
          const errorMsg = t('fileSizeError', { fileName: file.name });
          setFileErrors(prev => ({ ...prev, [field]: errorMsg }));
          e.target.value = ''; // Clear the input
          return;
        }

        setDocuments({
          ...documents,
          [field]: file,
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nameNepali: '',
      nameEnglish: '',
      grandfatherName: '',
      fatherName: '',
      addressCitizenship: '',
      addressCurrent: '',
      phone: '',
      whatsapp: '',
      email: '',
      serviceWanted: '',
      facilityWanted: '',
    });
    setDocuments({
      citizenship: null,
      nationalId: null,
      panCard: null,
      photo: null,
      serviceDocuments: null,
      facilityDocuments: null,
    });
    setFileErrors({});
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const submitData = new FormData();

      // Personal details
      submitData.append('nepali_name', formData.nameNepali);
      submitData.append('english_name', formData.nameEnglish);
      submitData.append('grandfather_name', formData.grandfatherName);
      submitData.append('father_name', formData.fatherName);

      // Address details
      submitData.append('address_as_per_citizenship', formData.addressCitizenship);
      submitData.append('current_address', formData.addressCurrent);

      // Contact details
      submitData.append('phone_number', formData.phone);
      if (formData.whatsapp) {
        submitData.append('whatsapp_number', formData.whatsapp);
      }
      if (formData.email) {
        submitData.append('email', formData.email);
      }

      // Services & Facilities
      submitData.append('service_requested', formData.serviceWanted);
      if (formData.facilityWanted) {
        submitData.append('facilities_requested', formData.facilityWanted);
      }

      // Required documents
      if (documents.citizenship) {
        submitData.append('citizenship_copy', documents.citizenship);
      }
      if (documents.photo) {
        submitData.append('photo', documents.photo);
      }

      // Optional documents
      if (documents.nationalId) {
        submitData.append('national_id_copy', documents.nationalId);
      }
      if (documents.panCard) {
        submitData.append('pan_card_copy', documents.panCard);
      }

      // Multiple file uploads
      if (documents.serviceDocuments) {
        for (let i = 0; i < documents.serviceDocuments.length; i++) {
          submitData.append('service_related_documents', documents.serviceDocuments[i]);
        }
      }
      if (documents.facilityDocuments) {
        for (let i = 0; i < documents.facilityDocuments.length; i++) {
          submitData.append('facility_related_documents', documents.facilityDocuments[i]);
        }
      }

      const response = await apiPublicFormData('api/member-applications', submitData);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
        throw new Error(error.detail || 'Request failed');
      }

      setSubmitStatus('success');
      resetForm();
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm">
      <div className="p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
          {t('heading')}
        </h2>

        {/* Declaration */}
        <div className="mb-8 p-4 bg-gray-50 border-l-4 border-primary">
          <p className="text-sm md:text-base text-gray-700 leading-relaxed text-justify">
            {t('declaration')}
          </p>
        </div>


        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-6">
            <h3 className="text-lg md:text-xl font-semibold text-primary border-b border-gray-200 pb-2">
              {t('fields.personalInformation')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name (Nepali) */}
              <div>
                <label htmlFor="nameNepali" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.nameNepali')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nameNepali"
                  name="nameNepali"
                  value={formData.nameNepali}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Name (English) */}
              <div>
                <label htmlFor="nameEnglish" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.nameEnglish')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nameEnglish"
                  name="nameEnglish"
                  value={formData.nameEnglish}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Grandfather's Name */}
              <div>
                <label htmlFor="grandfatherName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.grandfatherName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="grandfatherName"
                  name="grandfatherName"
                  value={formData.grandfatherName}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Father's Name */}
              <div>
                <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.fatherName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fatherName"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Address (as per Citizenship) */}
              <div className="md:col-span-2">
                <label htmlFor="addressCitizenship" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.addressCitizenship')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="addressCitizenship"
                  name="addressCitizenship"
                  value={formData.addressCitizenship}
                  onChange={handleChange}
                  required
                  maxLength={500}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Current Address */}
              <div className="md:col-span-2">
                <label htmlFor="addressCurrent" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.addressCurrent')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="addressCurrent"
                  name="addressCurrent"
                  value={formData.addressCurrent}
                  onChange={handleChange}
                  required
                  maxLength={500}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.phone')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength={20}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* WhatsApp Number */}
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.whatsapp')}
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  maxLength={20}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Service Wanted */}
              <div className="md:col-span-2">
                <label htmlFor="serviceWanted" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.serviceWanted')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="serviceWanted"
                  name="serviceWanted"
                  value={formData.serviceWanted}
                  onChange={handleChange}
                  required
                  maxLength={500}
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:bg-gray-100"
                />
              </div>

              {/* Facility Wanted */}
              <div className="md:col-span-2">
                <label htmlFor="facilityWanted" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.facilityWanted')}
                </label>
                <textarea
                  id="facilityWanted"
                  name="facilityWanted"
                  value={formData.facilityWanted}
                  onChange={handleChange}
                  maxLength={500}
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg md:text-xl font-semibold text-primary border-b border-gray-200 pb-2">
              {t('documents.heading')}
            </h3>

            {/* Required Documents */}
            <div className="space-y-4">
              <h4 className="text-base font-medium text-gray-800">
                {t('documents.requiredDocuments')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Citizenship Copy */}
                <div>
                  <label htmlFor="citizenship" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('documents.citizenship')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="citizenship"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.svg"
                    onChange={(e) => handleFileChange(e, 'citizenship')}
                    required
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50 ${
                      fileErrors.citizenship ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {documents.citizenship && (
                    <p className="mt-1 text-sm text-gray-600">
                      {documents.citizenship.name} ({formatFileSize(documents.citizenship.size)})
                    </p>
                  )}
                  {fileErrors.citizenship && (
                    <p className="mt-1 text-sm text-red-600">{fileErrors.citizenship}</p>
                  )}
                </div>

                {/* Photo */}
                <div>
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('documents.photo')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="photo"
                    accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                    onChange={(e) => handleFileChange(e, 'photo')}
                    required
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50 ${
                      fileErrors.photo ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {documents.photo && (
                    <p className="mt-1 text-sm text-gray-600">
                      {documents.photo.name} ({formatFileSize(documents.photo.size)})
                    </p>
                  )}
                  {fileErrors.photo && (
                    <p className="mt-1 text-sm text-red-600">{fileErrors.photo}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Optional Documents */}
            <div className="space-y-4">
              <h4 className="text-base font-medium text-gray-800">
                {t('documents.optionalDocuments')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* National ID Copy */}
                <div>
                  <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('documents.nationalId')}
                  </label>
                  <input
                    type="file"
                    id="nationalId"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.svg"
                    onChange={(e) => handleFileChange(e, 'nationalId')}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50 ${
                      fileErrors.nationalId ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {documents.nationalId && (
                    <p className="mt-1 text-sm text-gray-600">
                      {documents.nationalId.name} ({formatFileSize(documents.nationalId.size)})
                    </p>
                  )}
                  {fileErrors.nationalId && (
                    <p className="mt-1 text-sm text-red-600">{fileErrors.nationalId}</p>
                  )}
                </div>

                {/* PAN Card Copy */}
                <div>
                  <label htmlFor="panCard" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('documents.panCard')}
                  </label>
                  <input
                    type="file"
                    id="panCard"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.svg"
                    onChange={(e) => handleFileChange(e, 'panCard')}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50 ${
                      fileErrors.panCard ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {documents.panCard && (
                    <p className="mt-1 text-sm text-gray-600">
                      {documents.panCard.name} ({formatFileSize(documents.panCard.size)})
                    </p>
                  )}
                  {fileErrors.panCard && (
                    <p className="mt-1 text-sm text-red-600">{fileErrors.panCard}</p>
                  )}
                </div>

                {/* Service Documents */}
                <div className="md:col-span-2">
                  <label htmlFor="serviceDocuments" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('documents.serviceDocuments')}
                  </label>
                  <input
                    type="file"
                    id="serviceDocuments"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.svg"
                    multiple
                    onChange={(e) => handleFileChange(e, 'serviceDocuments')}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50 ${
                      fileErrors.serviceDocuments ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {documents.serviceDocuments && documents.serviceDocuments.length > 0 && (
                    <div className="mt-1">
                      <p className="text-sm text-gray-600 mb-1">
                        {documents.serviceDocuments.length} file(s) selected
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        {Array.from(documents.serviceDocuments).map((file, index) => (
                          <li key={index}>
                            {file.name} ({formatFileSize(file.size)})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {fileErrors.serviceDocuments && (
                    <p className="mt-1 text-sm text-red-600">{fileErrors.serviceDocuments}</p>
                  )}
                </div>

                {/* Facility Documents */}
                <div className="md:col-span-2">
                  <label htmlFor="facilityDocuments" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('documents.facilityDocuments')}
                  </label>
                  <input
                    type="file"
                    id="facilityDocuments"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.svg"
                    multiple
                    onChange={(e) => handleFileChange(e, 'facilityDocuments')}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50 ${
                      fileErrors.facilityDocuments ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {documents.facilityDocuments && documents.facilityDocuments.length > 0 && (
                    <div className="mt-1">
                      <p className="text-sm text-gray-600 mb-1">
                        {documents.facilityDocuments.length} file(s) selected
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        {Array.from(documents.facilityDocuments).map((file, index) => (
                          <li key={index}>
                            {file.name} ({formatFileSize(file.size)})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {fileErrors.facilityDocuments && (
                    <p className="mt-1 text-sm text-red-600">{fileErrors.facilityDocuments}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <p className="text-green-700 font-medium">{t('success')}</p>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <p className="text-red-700 font-medium">{errorMessage || t('error')}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-medium rounded hover:bg-primary/90 transition-colors duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              {t('submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembershipForm;
