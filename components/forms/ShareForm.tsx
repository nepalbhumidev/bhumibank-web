'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { apiPublicFormData } from '@/lib/api-client';

const ShareForm = () => {
  const t = useTranslations('FormsPage.share');
  const formRef = useRef<HTMLFormElement>(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    gender: '',
    dateOfBirth: '',
    maritalStatus: '',
    religion: '',
    
    // Share Details
    shareQuantity: '',
    shareQuantityInWords: '',
    shareAmount: '',
    shareAmountInWords: '',
    
    // Identification
    panNumber: '',
    nationalIdNumber: '',
    boidNumber: '',
    citizenshipNumber: '',
    citizenshipIssueDate: '',
    citizenshipIssueDistrict: '',
    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',
    passportIssueOffice: '',
    visaExpiryDate: '',
    nationalIdType: '',
    nationalIdIssueOffice: '',
    nationalIdIssueDate: '',
    
    // Family Details
    spouseName: '',
    fatherName: '',
    motherName: '',
    grandfatherName: '',
    sonName: '',
    daughterName: '',
    otherFamilyMembers: '',
    
    // Permanent Address
    permanentProvince: '',
    permanentDistrict: '',
    permanentMunicipality: '',
    permanentWardNumber: '',
    permanentTole: '',
    permanentHouseNumber: '',
    permanentPhone: '',
    permanentMobile: '',
    permanentEmail: '',
    
    // Temporary Address
    temporaryProvince: '',
    temporaryDistrict: '',
    temporaryMunicipality: '',
    temporaryWardNumber: '',
    temporaryTole: '',
    temporaryHouseNumber: '',
    temporaryPhone: '',
    temporaryMobile: '',
    temporaryEmail: '',
    
    // Occupation
    occupationType: '',
    organizationName: '',
    organizationAddress: '',
    designation: '',
    estimatedAnnualIncome: '',
    
    // Nominee
    nomineeName: '',
    nomineeRelationship: '',
    nomineeProvince: '',
    nomineeDistrict: '',
    nomineeMunicipality: '',
    nomineeWardNumber: '',
    nomineeTole: '',
    nomineeHouseNumber: '',
    nomineePhone: '',
    nomineeMobile: '',
    nomineeEmail: '',
    
    // Agreement
    agreementAccepted: false,
  });

  // File state
  const [files, setFiles] = useState<{
    passportSizePhoto: File | null;
    signature: File | null;
    citizenshipPassportDocument: File | null;
    nationalIdentityDocument: File | null;
    panDocument: File | null;
    nomineeCitizenshipDocument: File | null;
  }>({
    passportSizePhoto: null,
    signature: null,
    citizenshipPassportDocument: null,
    nationalIdentityDocument: null,
    panDocument: null,
    nomineeCitizenshipDocument: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const validateFileSize = (file: File): boolean => {
    return file.size <= MAX_FILE_SIZE;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error message when user types
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    
    // Clear previous error for this field
    setFileErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });

    // Validate file size
    if (!validateFileSize(file)) {
      const errorMsg = `File "${file.name}" is too large. Maximum size is 5MB.`;
      setFileErrors(prev => ({ ...prev, [field]: errorMsg }));
      e.target.value = '';
      return;
    }

    // Update file state
    setFiles(prev => ({
      ...prev,
      [field]: file,
    }));
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      gender: '',
      dateOfBirth: '',
      maritalStatus: '',
      religion: '',
      shareQuantity: '',
      shareQuantityInWords: '',
      shareAmount: '',
      shareAmountInWords: '',
      panNumber: '',
      nationalIdNumber: '',
      boidNumber: '',
      citizenshipNumber: '',
      citizenshipIssueDate: '',
      citizenshipIssueDistrict: '',
      passportNumber: '',
      passportIssueDate: '',
      passportExpiryDate: '',
      passportIssueOffice: '',
      visaExpiryDate: '',
      nationalIdType: '',
      nationalIdIssueOffice: '',
      nationalIdIssueDate: '',
      spouseName: '',
      fatherName: '',
      motherName: '',
      grandfatherName: '',
      sonName: '',
      daughterName: '',
      otherFamilyMembers: '',
      permanentProvince: '',
      permanentDistrict: '',
      permanentMunicipality: '',
      permanentWardNumber: '',
      permanentTole: '',
      permanentHouseNumber: '',
      permanentPhone: '',
      permanentMobile: '',
      permanentEmail: '',
      temporaryProvince: '',
      temporaryDistrict: '',
      temporaryMunicipality: '',
      temporaryWardNumber: '',
      temporaryTole: '',
      temporaryHouseNumber: '',
      temporaryPhone: '',
      temporaryMobile: '',
      temporaryEmail: '',
      occupationType: '',
      organizationName: '',
      organizationAddress: '',
      designation: '',
      estimatedAnnualIncome: '',
      nomineeName: '',
      nomineeRelationship: '',
      nomineeProvince: '',
      nomineeDistrict: '',
      nomineeMunicipality: '',
      nomineeWardNumber: '',
      nomineeTole: '',
      nomineeHouseNumber: '',
      nomineePhone: '',
      nomineeMobile: '',
      nomineeEmail: '',
      agreementAccepted: false,
    });
    
    setFiles({
      passportSizePhoto: null,
      signature: null,
      citizenshipPassportDocument: null,
      nationalIdentityDocument: null,
      panDocument: null,
      nomineeCitizenshipDocument: null,
    });
    
    setFileErrors({});
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  // Validate date format
  const validateDate = (dateString: string, fieldName: string): void => {
    if (!dateString) return;
    
    // Check if date string is valid format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      throw new Error(`${fieldName} has an invalid date format. Please use YYYY-MM-DD format.`);
    }
    
    // Check if date is valid
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error(`${fieldName} is not a valid date.`);
    }
    
    // Check if year is reasonable (between 1900 and current year + 1)
    const year = date.getFullYear();
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear + 1) {
      throw new Error(`${fieldName} has an invalid year. Please enter a year between 1900 and ${currentYear + 1}.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Validate agreement acceptance
      if (!formData.agreementAccepted) {
        throw new Error('You must accept the agreement to submit the application');
      }

      // Validate dates
      if (formData.dateOfBirth) {
        validateDate(formData.dateOfBirth, 'Date of Birth');
      }
      if (formData.citizenshipIssueDate) {
        validateDate(formData.citizenshipIssueDate, 'Citizenship Issue Date');
      }
      if (formData.passportIssueDate) {
        validateDate(formData.passportIssueDate, 'Passport Issue Date');
      }
      if (formData.passportExpiryDate) {
        validateDate(formData.passportExpiryDate, 'Passport Expiry Date');
      }
      if (formData.visaExpiryDate) {
        validateDate(formData.visaExpiryDate, 'Visa Expiry Date');
      }
      if (formData.nationalIdIssueDate) {
        validateDate(formData.nationalIdIssueDate, 'National ID Issue Date');
      }

      // Build the JSON payload (without file URLs)
      const payload: any = {
        agreement_accepted: true,
        application_date: new Date().toISOString(),
      };

      // Personal Details
      if (formData.fullName || formData.gender || formData.dateOfBirth || formData.maritalStatus || formData.religion) {
        payload.personal_details = {
          full_name: formData.fullName || undefined,
          gender: formData.gender || undefined,
          date_of_birth: formData.dateOfBirth ? `${formData.dateOfBirth}T00:00:00` : undefined,
          marital_status: formData.maritalStatus || undefined,
          religion: formData.religion || undefined,
        };
      }

      // Share Details
      if (formData.shareQuantity || formData.shareAmount) {
        payload.share_details = {
          share_quantity: formData.shareQuantity,
          share_quantity_in_words: formData.shareQuantityInWords,
          share_amount: formData.shareAmount,
          share_amount_in_words: formData.shareAmountInWords,
        };
      }

      // Identification (without document URLs - files are sent separately)
      if (formData.panNumber || formData.nationalIdNumber || formData.boidNumber || formData.citizenshipNumber) {
        payload.identification = {
          pan_number: formData.panNumber || undefined,
          national_id_number: formData.nationalIdNumber || undefined,
          boid_number: formData.boidNumber || undefined,
          citizenship_number: formData.citizenshipNumber || undefined,
          citizenship_issue_date: formData.citizenshipIssueDate ? `${formData.citizenshipIssueDate}T00:00:00` : undefined,
          citizenship_issue_district: formData.citizenshipIssueDistrict || undefined,
          passport_number: formData.passportNumber || undefined,
          passport_issue_date: formData.passportIssueDate ? `${formData.passportIssueDate}T00:00:00` : undefined,
          passport_expiry_date: formData.passportExpiryDate ? `${formData.passportExpiryDate}T00:00:00` : undefined,
          passport_issue_office: formData.passportIssueOffice || undefined,
          visa_expiry_date: formData.visaExpiryDate ? `${formData.visaExpiryDate}T00:00:00` : undefined,
          national_id_type: formData.nationalIdType || undefined,
          national_id_issue_office: formData.nationalIdIssueOffice || undefined,
          national_id_issue_date: formData.nationalIdIssueDate ? `${formData.nationalIdIssueDate}T00:00:00` : undefined,
        };
      }

      // Family Details
      if (formData.spouseName || formData.fatherName || formData.motherName || formData.grandfatherName) {
        payload.family_details = {
          spouse_name: formData.spouseName || undefined,
          father_name: formData.fatherName || undefined,
          mother_name: formData.motherName || undefined,
          grandfather_name: formData.grandfatherName || undefined,
          son_name: formData.sonName || undefined,
          daughter_name: formData.daughterName || undefined,
          other_family_members: formData.otherFamilyMembers || undefined,
        };
      }

      // Permanent Address
      if (formData.permanentProvince || formData.permanentDistrict || formData.permanentMunicipality) {
        payload.permanent_address = {
          province: formData.permanentProvince || undefined,
          district: formData.permanentDistrict || undefined,
          municipality: formData.permanentMunicipality || undefined,
          ward_number: formData.permanentWardNumber || undefined,
          tole: formData.permanentTole || undefined,
          house_number: formData.permanentHouseNumber || undefined,
          phone: formData.permanentPhone || undefined,
          mobile: formData.permanentMobile || undefined,
          email: formData.permanentEmail || undefined,
        };
      }

      // Temporary Address
      if (formData.temporaryProvince || formData.temporaryDistrict || formData.temporaryMunicipality) {
        payload.temporary_address = {
          province: formData.temporaryProvince || undefined,
          district: formData.temporaryDistrict || undefined,
          municipality: formData.temporaryMunicipality || undefined,
          ward_number: formData.temporaryWardNumber || undefined,
          tole: formData.temporaryTole || undefined,
          house_number: formData.temporaryHouseNumber || undefined,
          phone: formData.temporaryPhone || undefined,
          mobile: formData.temporaryMobile || undefined,
          email: formData.temporaryEmail || undefined,
        };
      }

      // Occupation
      if (formData.occupationType || formData.organizationName) {
        payload.occupation = {
          occupation_type: formData.occupationType || undefined,
          organization_name: formData.organizationName || undefined,
          organization_address: formData.organizationAddress || undefined,
          designation: formData.designation || undefined,
          estimated_annual_income: formData.estimatedAnnualIncome || undefined,
        };
      }

      // Nominee
      if (formData.nomineeName) {
        payload.nominee = {
          nominee_name: formData.nomineeName,
          nominee_relationship: formData.nomineeRelationship || undefined,
          nominee_address: {
            province: formData.nomineeProvince || undefined,
            district: formData.nomineeDistrict || undefined,
            municipality: formData.nomineeMunicipality || undefined,
            ward_number: formData.nomineeWardNumber || undefined,
            tole: formData.nomineeTole || undefined,
            house_number: formData.nomineeHouseNumber || undefined,
            phone: formData.nomineePhone || undefined,
            mobile: formData.nomineeMobile || undefined,
            email: formData.nomineeEmail || undefined,
          },
        };
      }

      // Remove undefined values from payload
      const cleanPayload = JSON.parse(JSON.stringify(payload));

      // Create FormData and append JSON data
      const submitData = new FormData();
      submitData.append('data', JSON.stringify(cleanPayload));

      // Append files if they exist
      if (files.passportSizePhoto) {
        submitData.append('passport_size_photo', files.passportSizePhoto);
      }
      if (files.signature) {
        submitData.append('signature', files.signature);
      }
      if (files.citizenshipPassportDocument) {
        submitData.append('citizenship_passport_document', files.citizenshipPassportDocument);
      }
      if (files.nationalIdentityDocument) {
        submitData.append('national_identity_document', files.nationalIdentityDocument);
      }
      if (files.panDocument) {
        submitData.append('pan_document', files.panDocument);
      }
      if (files.nomineeCitizenshipDocument) {
        submitData.append('nominee_citizenship_document', files.nomineeCitizenshipDocument);
      }

      // Submit the application
      const response = await apiPublicFormData('api/share-applications', submitData);

      if (!response.ok) {
        let errorMessage = 'An error occurred';
        try {
          const errorData = await response.json();
          console.error('API Error Response:', errorData);
          
          // Handle FastAPI validation errors
          if (errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              // Multiple validation errors
              errorMessage = errorData.detail
                .map((err: any) => {
                  const field = err.loc ? err.loc.join('.') : 'field';
                  const msg = err.msg || 'Invalid value';
                  return `${field}: ${msg}`;
                })
                .join(', ');
            } else if (typeof errorData.detail === 'string') {
              // Single error message
              errorMessage = errorData.detail;
            } else {
              // Error object
              errorMessage = JSON.stringify(errorData.detail);
            }
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // If JSON parsing fails, use status text
          errorMessage = `Request failed: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
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
          {/* Personal Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg md:text-xl font-semibold text-primary border-b border-gray-200 pb-2">
              {t('fields.personalInformation')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.fullName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
          </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.gender')}
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.dateOfBirth')}
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  min="1900-01-01"
                  max={new Date().toISOString().split('T')[0]}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.maritalStatus')}
                </label>
                <select
                  id="maritalStatus"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Select Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              <div>
                <label htmlFor="religion" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.religion')}
                </label>
                <input
                  type="text"
                  id="religion"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  maxLength={100}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Share Details Section */}
          <div className="space-y-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg md:text-xl font-semibold text-primary border-b border-gray-200 pb-2">
              {t('fields.shareDetails')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="shareQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.shareQuantity')}
                </label>
                <input
                  type="text"
                  id="shareQuantity"
                  name="shareQuantity"
                  value={formData.shareQuantity}
                  onChange={handleChange}
                  maxLength={50}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="shareQuantityInWords" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.shareQuantityInWords')}
                </label>
                <input
                  type="text"
                  id="shareQuantityInWords"
                  name="shareQuantityInWords"
                  value={formData.shareQuantityInWords}
                  onChange={handleChange}
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="shareAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.shareAmount')}
                </label>
                <input
                  type="text"
                  id="shareAmount"
                  name="shareAmount"
                  value={formData.shareAmount}
                  onChange={handleChange}
                  maxLength={50}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="shareAmountInWords" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.shareAmountInWords')}
                </label>
                <input
                  type="text"
                  id="shareAmountInWords"
                  name="shareAmountInWords"
                  value={formData.shareAmountInWords}
                  onChange={handleChange}
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Identification Section */}
          <div className="space-y-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg md:text-xl font-semibold text-primary border-b border-gray-200 pb-2">
              {t('fields.identification')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.panNumber')}
                </label>
                <input
                  type="text"
                  id="panNumber"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  maxLength={50}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="nationalIdNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.nationalIdNumber')}
                </label>
                <input
                  type="text"
                  id="nationalIdNumber"
                  name="nationalIdNumber"
                  value={formData.nationalIdNumber}
                  onChange={handleChange}
                  maxLength={50}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="boidNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.boidNumber')}
                </label>
                <input
                  type="text"
                  id="boidNumber"
                  name="boidNumber"
                  value={formData.boidNumber}
                  onChange={handleChange}
                  maxLength={50}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="citizenshipNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.citizenshipNumber')}
                </label>
                <input
                  type="text"
                  id="citizenshipNumber"
                  name="citizenshipNumber"
                  value={formData.citizenshipNumber}
                  onChange={handleChange}
                  maxLength={50}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="citizenshipIssueDate" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.citizenshipIssueDate')}
                </label>
                <input
                  type="date"
                  id="citizenshipIssueDate"
                  name="citizenshipIssueDate"
                  value={formData.citizenshipIssueDate}
                  onChange={handleChange}
                  min="1900-01-01"
                  max={new Date().toISOString().split('T')[0]}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="citizenshipIssueDistrict" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.citizenshipIssueDistrict')}
                </label>
                <input
                  type="text"
                  id="citizenshipIssueDistrict"
                  name="citizenshipIssueDistrict"
                  value={formData.citizenshipIssueDistrict}
                  onChange={handleChange}
                  maxLength={100}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.passportNumber')}
                </label>
                <input
                  type="text"
                  id="passportNumber"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleChange}
                  maxLength={50}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="passportIssueDate" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.passportIssueDate')}
                </label>
                <input
                  type="date"
                  id="passportIssueDate"
                  name="passportIssueDate"
                  value={formData.passportIssueDate}
                  onChange={handleChange}
                  min="1900-01-01"
                  max={new Date().toISOString().split('T')[0]}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="passportExpiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.passportExpiryDate')}
                </label>
                <input
                  type="date"
                  id="passportExpiryDate"
                  name="passportExpiryDate"
                  value={formData.passportExpiryDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="passportIssueOffice" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.passportIssueOffice')}
                </label>
                <input
                  type="text"
                  id="passportIssueOffice"
                  name="passportIssueOffice"
                  value={formData.passportIssueOffice}
                  onChange={handleChange}
                  maxLength={100}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="visaExpiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.visaExpiryDate')}
                </label>
                <input
                  type="date"
                  id="visaExpiryDate"
                  name="visaExpiryDate"
                  value={formData.visaExpiryDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="nationalIdType" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.nationalIdType')}
                </label>
                <input
                  type="text"
                  id="nationalIdType"
                  name="nationalIdType"
                  value={formData.nationalIdType}
                  onChange={handleChange}
                  maxLength={100}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="nationalIdIssueOffice" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.nationalIdIssueOffice')}
                </label>
                <input
                  type="text"
                  id="nationalIdIssueOffice"
                  name="nationalIdIssueOffice"
                  value={formData.nationalIdIssueOffice}
                  onChange={handleChange}
                  maxLength={100}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="nationalIdIssueDate" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.nationalIdIssueDate')}
                </label>
                <input
                  type="date"
                  id="nationalIdIssueDate"
                  name="nationalIdIssueDate"
                  value={formData.nationalIdIssueDate}
                  onChange={handleChange}
                  min="1900-01-01"
                  max={new Date().toISOString().split('T')[0]}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Family Details Section */}
          <div className="space-y-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg md:text-xl font-semibold text-primary border-b border-gray-200 pb-2">
              {t('fields.familyDetails')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="spouseName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.spouseName')}
                </label>
                <input
                  type="text"
                  id="spouseName"
                  name="spouseName"
                  value={formData.spouseName}
                  onChange={handleChange}
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.fatherName')}
                </label>
                <input
                  type="text"
                  id="fatherName"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="motherName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.motherName')}
                </label>
                <input
                  type="text"
                  id="motherName"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="grandfatherName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.grandfatherName')}
                </label>
                <input
                  type="text"
                  id="grandfatherName"
                  name="grandfatherName"
                  value={formData.grandfatherName}
                  onChange={handleChange}
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="sonName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.sonName')}
                </label>
                <input
                  type="text"
                  id="sonName"
                  name="sonName"
                  value={formData.sonName}
                  onChange={handleChange}
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="daughterName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.daughterName')}
                </label>
                <input
                  type="text"
                  id="daughterName"
                  name="daughterName"
                  value={formData.daughterName}
                  onChange={handleChange}
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="otherFamilyMembers" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.otherFamilyMembers')}
                </label>
                <textarea
                  id="otherFamilyMembers"
                  name="otherFamilyMembers"
                  value={formData.otherFamilyMembers}
                  onChange={handleChange}
                  maxLength={500}
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Permanent Address Section */}
          <div className="space-y-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg md:text-xl font-semibold text-primary border-b border-gray-200 pb-2">
              {t('fields.permanentAddress')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="permanentProvince" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.province')}
                </label>
                <input
                  type="text"
                  id="permanentProvince"
                  name="permanentProvince"
                  value={formData.permanentProvince}
                  onChange={handleChange}
                  maxLength={100}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="permanentDistrict" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.district')}
                </label>
                <input
                  type="text"
                  id="permanentDistrict"
                  name="permanentDistrict"
                  value={formData.permanentDistrict}
                  onChange={handleChange}
                  maxLength={100}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="permanentMunicipality" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.municipality')}
                </label>
                <input
                  type="text"
                  id="permanentMunicipality"
                  name="permanentMunicipality"
                  value={formData.permanentMunicipality}
                  onChange={handleChange}
                  maxLength={100}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="permanentWardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.wardNumber')}
                </label>
                <input
                  type="text"
                  id="permanentWardNumber"
                  name="permanentWardNumber"
                  value={formData.permanentWardNumber}
                  onChange={handleChange}
                  maxLength={10}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="permanentTole" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.tole')}
                </label>
                <input
                  type="text"
                  id="permanentTole"
                  name="permanentTole"
                  value={formData.permanentTole}
                  onChange={handleChange}
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="permanentHouseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.houseNumber')}
                </label>
                <input
                  type="text"
                  id="permanentHouseNumber"
                  name="permanentHouseNumber"
                  value={formData.permanentHouseNumber}
                  onChange={handleChange}
                  maxLength={50}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="permanentPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.phone')}
                </label>
                <input
                  type="tel"
                  id="permanentPhone"
                  name="permanentPhone"
                  value={formData.permanentPhone}
                  onChange={handleChange}
                  maxLength={20}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="permanentMobile" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.mobile')}
                </label>
                <input
                  type="tel"
                  id="permanentMobile"
                  name="permanentMobile"
                  value={formData.permanentMobile}
                  onChange={handleChange}
                  maxLength={20}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="permanentEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.email')}
                </label>
                <input
                  type="email"
                  id="permanentEmail"
                  name="permanentEmail"
                  value={formData.permanentEmail}
                  onChange={handleChange}
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Temporary Address Section */}
          <div className="space-y-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg md:text-xl font-semibold text-primary border-b border-gray-200 pb-2">
              {t('fields.temporaryAddress')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="temporaryProvince" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.province')}
                </label>
                <input
                  type="text"
                  id="temporaryProvince"
                  name="temporaryProvince"
                  value={formData.temporaryProvince}
                  onChange={handleChange}
                  maxLength={100}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="temporaryDistrict" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.district')}
                </label>
                <input
                  type="text"
                  id="temporaryDistrict"
                  name="temporaryDistrict"
                  value={formData.temporaryDistrict}
                  onChange={handleChange}
                  maxLength={100}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="temporaryMunicipality" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.municipality')}
                </label>
                <input
                  type="text"
                  id="temporaryMunicipality"
                  name="temporaryMunicipality"
                  value={formData.temporaryMunicipality}
                  onChange={handleChange}
                  maxLength={100}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="temporaryWardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.wardNumber')}
                </label>
                <input
                  type="text"
                  id="temporaryWardNumber"
                  name="temporaryWardNumber"
                  value={formData.temporaryWardNumber}
                  onChange={handleChange}
                  maxLength={10}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="temporaryTole" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.tole')}
                </label>
                <input
                  type="text"
                  id="temporaryTole"
                  name="temporaryTole"
                  value={formData.temporaryTole}
                  onChange={handleChange}
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="temporaryHouseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.houseNumber')}
                </label>
                <input
                  type="text"
                  id="temporaryHouseNumber"
                  name="temporaryHouseNumber"
                  value={formData.temporaryHouseNumber}
                  onChange={handleChange}
                  maxLength={50}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="temporaryPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.phone')}
                </label>
                <input
                  type="tel"
                  id="temporaryPhone"
                  name="temporaryPhone"
                  value={formData.temporaryPhone}
                  onChange={handleChange}
                  maxLength={20}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="temporaryMobile" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.mobile')}
                </label>
                <input
                  type="tel"
                  id="temporaryMobile"
                  name="temporaryMobile"
                  value={formData.temporaryMobile}
                  onChange={handleChange}
                  maxLength={20}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="temporaryEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.email')}
                </label>
                <input
                  type="email"
                  id="temporaryEmail"
                  name="temporaryEmail"
                  value={formData.temporaryEmail}
                  onChange={handleChange}
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Occupation Section */}
          <div className="space-y-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg md:text-xl font-semibold text-primary border-b border-gray-200 pb-2">
              {t('fields.occupation')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="occupationType" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.occupationType')}
                </label>
                <input
                  type="text"
                  id="occupationType"
                  name="occupationType"
                  value={formData.occupationType}
                  onChange={handleChange}
                  maxLength={100}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.organizationName')}
                </label>
                <input
                  type="text"
                  id="organizationName"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="organizationAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.organizationAddress')}
                </label>
                <input
                  type="text"
                  id="organizationAddress"
                  name="organizationAddress"
                  value={formData.organizationAddress}
                  onChange={handleChange}
                  maxLength={500}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.designation')}
                </label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="estimatedAnnualIncome" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.estimatedAnnualIncome')}
                </label>
                <input
                  type="text"
                  id="estimatedAnnualIncome"
                  name="estimatedAnnualIncome"
                  value={formData.estimatedAnnualIncome}
                  onChange={handleChange}
                  maxLength={50}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Nominee Section */}
          <div className="space-y-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg md:text-xl font-semibold text-primary border-b border-gray-200 pb-2">
              {t('fields.nominee')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nomineeName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.nomineeName')}
                </label>
                <input
                  type="text"
                  id="nomineeName"
                  name="nomineeName"
                  value={formData.nomineeName}
                  onChange={handleChange}
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="nomineeRelationship" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.nomineeRelationship')}
                </label>
                <input
                  type="text"
                  id="nomineeRelationship"
                  name="nomineeRelationship"
                  value={formData.nomineeRelationship}
                  onChange={handleChange}
                  maxLength={100}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="nomineeProvince" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.province')}
                </label>
                <input
                  type="text"
                  id="nomineeProvince"
                  name="nomineeProvince"
                  value={formData.nomineeProvince}
                  onChange={handleChange}
                  maxLength={100}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="nomineeDistrict" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.district')}
                </label>
                <input
                  type="text"
                  id="nomineeDistrict"
                  name="nomineeDistrict"
                  value={formData.nomineeDistrict}
                  onChange={handleChange}
                  maxLength={100}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="nomineeMunicipality" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.municipality')}
                </label>
                <input
                  type="text"
                  id="nomineeMunicipality"
                  name="nomineeMunicipality"
                  value={formData.nomineeMunicipality}
                  onChange={handleChange}
                  maxLength={100}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="nomineeWardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.wardNumber')}
                </label>
                <input
                  type="text"
                  id="nomineeWardNumber"
                  name="nomineeWardNumber"
                  value={formData.nomineeWardNumber}
                  onChange={handleChange}
                  maxLength={10}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="nomineeTole" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.tole')}
                </label>
                <input
                  type="text"
                  id="nomineeTole"
                  name="nomineeTole"
                  value={formData.nomineeTole}
                  onChange={handleChange}
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="nomineeHouseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.houseNumber')}
                </label>
                <input
                  type="text"
                  id="nomineeHouseNumber"
                  name="nomineeHouseNumber"
                  value={formData.nomineeHouseNumber}
                  onChange={handleChange}
                  maxLength={50}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="nomineePhone" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.phone')}
                </label>
                <input
                  type="tel"
                  id="nomineePhone"
                  name="nomineePhone"
                  value={formData.nomineePhone}
                  onChange={handleChange}
                  maxLength={20}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="nomineeMobile" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.mobile')}
                </label>
                <input
                  type="tel"
                  id="nomineeMobile"
                  name="nomineeMobile"
                  value={formData.nomineeMobile}
                  onChange={handleChange}
                  maxLength={20}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="nomineeEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.email')}
                </label>
                <input
                  type="email"
                  id="nomineeEmail"
                  name="nomineeEmail"
                  value={formData.nomineeEmail}
                  onChange={handleChange}
                  maxLength={200}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg md:text-xl font-semibold text-primary border-b border-gray-200 pb-2">
              {t('documents.heading')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Passport Size Photo */}
              <div>
                <label htmlFor="passportSizePhoto" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('documents.passportSizePhoto')}
                </label>
                <input
                  type="file"
                  id="passportSizePhoto"
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  onChange={(e) => handleFileChange(e, 'passportSizePhoto')}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50 ${
                    fileErrors.passportSizePhoto ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {files.passportSizePhoto && (
                  <p className="mt-1 text-sm text-gray-600">
                    {files.passportSizePhoto.name} ({formatFileSize(files.passportSizePhoto.size)})
                  </p>
                )}
                {fileErrors.passportSizePhoto && (
                  <p className="mt-1 text-sm text-red-600">{fileErrors.passportSizePhoto}</p>
                )}
              </div>

              {/* Signature */}
              <div>
                <label htmlFor="signature" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('documents.signature')}
                </label>
                <input
                  type="file"
                  id="signature"
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  onChange={(e) => handleFileChange(e, 'signature')}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50 ${
                    fileErrors.signature ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {files.signature && (
                  <p className="mt-1 text-sm text-gray-600">
                    {files.signature.name} ({formatFileSize(files.signature.size)})
                  </p>
                )}
                {fileErrors.signature && (
                  <p className="mt-1 text-sm text-red-600">{fileErrors.signature}</p>
                )}
              </div>

              {/* Citizenship/Passport Document */}
              <div>
                <label htmlFor="citizenshipPassportDocument" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('documents.citizenshipPassportDocument')}
                </label>
                <input
                  type="file"
                  id="citizenshipPassportDocument"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'citizenshipPassportDocument')}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50 ${
                    fileErrors.citizenshipPassportDocument ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {files.citizenshipPassportDocument && (
                  <p className="mt-1 text-sm text-gray-600">
                    {files.citizenshipPassportDocument.name} ({formatFileSize(files.citizenshipPassportDocument.size)})
                  </p>
                )}
                {fileErrors.citizenshipPassportDocument && (
                  <p className="mt-1 text-sm text-red-600">{fileErrors.citizenshipPassportDocument}</p>
                )}
          </div>

              {/* National Identity Document */}
              <div>
                <label htmlFor="nationalIdentityDocument" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('documents.nationalIdentityDocument')}
                </label>
                <input
                  type="file"
                  id="nationalIdentityDocument"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'nationalIdentityDocument')}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50 ${
                    fileErrors.nationalIdentityDocument ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {files.nationalIdentityDocument && (
                  <p className="mt-1 text-sm text-gray-600">
                    {files.nationalIdentityDocument.name} ({formatFileSize(files.nationalIdentityDocument.size)})
                  </p>
                )}
                {fileErrors.nationalIdentityDocument && (
                  <p className="mt-1 text-sm text-red-600">{fileErrors.nationalIdentityDocument}</p>
                )}
              </div>

              {/* PAN Document */}
              <div>
                <label htmlFor="panDocument" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('documents.panDocument')}
                </label>
                <input
                  type="file"
                  id="panDocument"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'panDocument')}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50 ${
                    fileErrors.panDocument ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {files.panDocument && (
                  <p className="mt-1 text-sm text-gray-600">
                    {files.panDocument.name} ({formatFileSize(files.panDocument.size)})
                  </p>
                )}
                {fileErrors.panDocument && (
                  <p className="mt-1 text-sm text-red-600">{fileErrors.panDocument}</p>
                )}
              </div>

              {/* Nominee Citizenship Document */}
              <div>
                <label htmlFor="nomineeCitizenshipDocument" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('documents.nomineeCitizenshipDocument')}
                </label>
                <input
                  type="file"
                  id="nomineeCitizenshipDocument"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'nomineeCitizenshipDocument')}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50 ${
                    fileErrors.nomineeCitizenshipDocument ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {files.nomineeCitizenshipDocument && (
                  <p className="mt-1 text-sm text-gray-600">
                    {files.nomineeCitizenshipDocument.name} ({formatFileSize(files.nomineeCitizenshipDocument.size)})
                  </p>
                )}
                {fileErrors.nomineeCitizenshipDocument && (
                  <p className="mt-1 text-sm text-red-600">{fileErrors.nomineeCitizenshipDocument}</p>
                )}
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
            <div className="mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="agreementAccepted"
                  checked={formData.agreementAccepted}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">
                  {t('fields.agreementAccepted')} <span className="text-red-500">*</span>
                </span>
              </label>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !formData.agreementAccepted}
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

export default ShareForm;
