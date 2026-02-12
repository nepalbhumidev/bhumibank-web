interface ShareApplicationData {
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
  };
  application_date?: string;
}

// Helper function to format date
function formatDate(dateString?: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return dateString;
  }
}

// Helper function to format text with boxes for ID numbers
function formatWithBoxes(text: string, maxLength: number): string {
  const chars = text.split('').slice(0, maxLength);
  while (chars.length < maxLength) {
    chars.push(' ');
  }
  return chars.map(char => char === ' ' ? '□' : char).join(' ');
}

// Helper function to format full name in block letters
function formatBlockLetters(name?: string): string {
  if (!name) return '□ '.repeat(20).trim();
  const upper = name.toUpperCase().replace(/[^A-Z]/g, '');
  const chars = upper.split('').slice(0, 20);
  while (chars.length < 20) {
    chars.push('□');
  }
  return chars.join(' ');
}

// Helper function to format date in boxes (DD MM YYYY)
function formatDateBoxes(dateString?: string): string {
  if (!dateString) return 'D D M M Y Y Y Y';
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day[0]} ${day[1]} ${month[0]} ${month[1]} ${year[0]} ${year[1]} ${year[2]} ${year[3]}`;
  } catch {
    return 'D D M M Y Y Y Y';
  }
}

export async function generateShareApplicationPDF(data: ShareApplicationData): Promise<void> {
  // Dynamically import libraries only on client side
  if (typeof window === 'undefined') {
    console.error('PDF generation is only available in the browser');
    return;
  }

  const { default: jsPDF } = await import('jspdf');
  const { default: html2canvas } = await import('html2canvas');
  
  // Create an iframe for isolated document context
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.left = '-9999px';
  iframe.style.top = '0';
  iframe.style.width = '210mm';
  iframe.style.height = '297mm';
  iframe.style.border = 'none';
  iframe.style.backgroundColor = 'white';
  
  document.body.appendChild(iframe);
  
  await new Promise<void>((resolve) => {
    iframe.onload = () => resolve();
    iframe.src = 'about:blank';
  });
  
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    throw new Error('Could not access iframe document');
  }
  
  // Wait for fonts to load
  await document.fonts.ready;
  
  // Full HTML document with styles
  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html lang="ne">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap');
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          width: 210mm;
          margin: 0;
          padding: 15mm;
          overflow-x: hidden;
          box-sizing: border-box;
          word-spacing: 0.16em;
        }
        .page {
          width: 100%;
          max-width: 180mm;
          position: relative;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .header {
          text-align: center;
          margin-bottom: 15px;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
        }
        .header h1 {
          font-size: 16px;
          font-weight: bold;
          margin: 5px 0;
        }
        .header p {
          font-size: 10px;
          margin: 2px 0;
        }
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        .qr-section {
          width: 110px;
          min-width: 100px;
          max-width: 100px;
          text-align: center;
          font-size: 8px;
          flex-shrink: 0;
        }
        .qr-section img {
          width: 70px;
          height: 70px;
          border: 1px solid #000;
          margin: 0 auto 5px;
          display: block;
        }
        .photo-placeholder {
          width: 100px;
          min-width: 100px;
          max-width: 100px;
          height: 100px;
          border: 2px solid #000;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          padding: 5px;
          flex-shrink: 0;
        }
        .section {
          margin-bottom: 12px;
        }
        .section-title {
          font-weight: bold;
          margin-bottom: 8px;
          font-size: 12px;
          word-spacing: 0.16em;
        }
        .form-row {
          margin-bottom: 6px;
          display: flex;
          align-items: baseline;
          min-height: 18px;
          width: 100%;
          box-sizing: border-box;
        }
        .label {
          min-width: 140px;
          font-weight: 500;
        }
        .value {
          flex: 1;
          min-height: 15px;
          padding-left: 4px;
          padding-right: 4px;
          max-width: 100%;
          text-overflow: ellipsis;
          word-spacing: 0.16em;
        }
        .value-boxes {
          letter-spacing: 3px;
          font-family: monospace;
          font-size: 10px;
        }
        .checkbox-group {
          display: inline-flex;
          gap: 15px;
          margin-left: 10px;
        }
        .checkbox-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .checkbox {
          width: 12px;
          height: 12px;
          border: 1px solid #000;
          display: inline-block;
          text-align: center;
          line-height: 12px;
          font-size: 10px;
          margin-top: 2px;
          position: relative;
        }
        .checkbox.checked::after {
          content: '✓';
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          line-height: 1;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          font-size: 10px;

        }
        table, th, td {
          border: 1px solid black;
          border-collapse: collapse;
        }
        table th, table td {
          padding: 4px;
          padding-bottom: 8px;
          text-align: left;
        }
        table th {
          background-color: #f0f0f0;
          font-weight: bold;
        }
        .two-column {
          display: flex;
          gap: 20px;
        }
        .two-column > div {
          flex: 1;
        }
        .signature-section {
          margin-top: 25px;
          text-align: right;
        }
        .declaration {
          text-align: justify;
          margin: 15px 0;
          line-height: 1.6;
          word-spacing: 0.16em;
        }
        .letter-section {
          margin-top: 30px;
          padding-top: 20px;
        }
        .letter-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }
        .letter-to {
          font-weight: bold;
        }
        .letter-body {
          text-align: justify;
          margin: 15px 0;
          line-height: 1.8;
          word-spacing: 0.16em;
        }
        .letter-signature {
          margin-top: 40px;
          text-align: right;
        }
        .attachments {
          margin-top: 20px;
        }
        .attachments ol {
          margin-left: 20px;
        }
        .attachments li {
          margin-bottom: 5px;
        }
      </style>
    </head>
    <body style="font-family: 'Noto Sans Devanagari', Arial, sans-serif; padding: 15mm 15mm 30mm 15mm; font-size: 11px; line-height: 1.5; color: #000; background-color: #ffffff; width: 210mm; margin: 0; overflow-x: hidden; word-spacing: 0.16em;">
      <div class="page" style="width: 100%; max-width: 170mm; margin: 0 auto;">
        <!-- Header Section -->
        <div class="header-top">
          <div class="qr-section">
            <div style="font-weight: bold; margin-bottom: 3px;">SCAN & PAY</div>
            <img src="/bhumi-bank-acc.jpeg" alt="Bank Account QR Code" />
            <div style="font-weight: bold;">Global IME Bank Limited</div>
            <div>18101010005944</div>
            <div>Nepal Bhumi Bank Limited</div>
            <div>Narephat Branch</div>
          </div>
          <div style="flex: 1; text-align: center; min-width: 0; overflow: hidden;">
            <h1>नेपाल भूमि बैंक लिमिटेड</h1>
            <p>स्थाई लेखा नं. (६२३५१७८६४ ) दर्ता नं. (३८२४६९ /८२ /८३)</p>
            <p>कोटेश्वर -३२, नरेफाँट , पानी पधेरो , काठमाडौ</p>
            <h2 style="margin-top: 28px; font-size: 13px; padding-bottom: 2px">सेयर खरिदका लागि आवेदन फाराम</h2>
          </div>
          <div class="photo-placeholder">
            हालसालै<br>खिचिएको<br>फोटो
          </div>
        </div>

        <!-- Date Field -->
        <div style="margin-top: 20px;">
          <span style="font-weight: 500;">मिति :</span>
          <span style="margin-left: 4px;">${formatDate(data.application_date) || ''}</span>
        </div>

        <!-- Introduction Paragraph -->
        <div class="declaration" style="margin-bottom: 15px;">
          यस कम्पनीले निष्कासन तथा विक्रीमा राखेको सेयरमध्ये तल उल्लेखित सेयरहरू खरिद गर्ने मनसाय भएको हुँदा प्रति सेयर रु. १०० का दरले उक्त सेयरहरू खरिद गर्न निम्न विवरणसहित यो आवेदन फाराम पेश गरेको छु।
        </div>

        <!-- Personal Details Section -->
        <div class="section">
          <div class="section-title">व्यक्तिगत विवरण (Personal Details)</div>
          <div class="form-row">
            <span class="label">Full Name (in block letter):</span>
            <span class="value">${data.personal_details?.full_name ? data.personal_details.full_name.toUpperCase() : ''}</span>
          </div>
          <div class="form-row">
            <span class="label">पूरा नाम :</span>
            <span class="value">${data.personal_details?.full_name || ''}</span>
          </div>
          <div class="form-row">
            <span class="label">लिङ्ग:</span>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <span>पुरुष</span>
                <span class="checkbox ${(data.personal_details?.gender === 'Male' || data.personal_details?.gender === 'पुरुष') ? 'checked' : ''}"></span>
              </div>
              <div class="checkbox-item">
                <span>महिला</span>
                <span class="checkbox ${(data.personal_details?.gender === 'Female' || data.personal_details?.gender === 'महिला') ? 'checked' : ''}"></span>
              </div>
              <div class="checkbox-item">
                <span>अन्य</span>
                <span class="checkbox ${(data.personal_details?.gender && data.personal_details?.gender !== 'Male' && data.personal_details?.gender !== 'Female' && data.personal_details?.gender !== 'पुरुष' && data.personal_details?.gender !== 'महिला') ? 'checked' : ''}"></span>
              </div>
            </div>
          </div>
          <div class="form-row">
            <span class="label">जन्म मिति (वि.सं.):</span>
            <span class="value" style="width: 100px;">${formatDate(data.personal_details?.date_of_birth) || ''}</span>
            <span class="label" style="margin-left: 20px;">A.D. :</span>
            <span class="value" style="width: 100px;">${formatDate(data.personal_details?.date_of_birth) || ''}</span>
          </div>
          <div class="form-row">
            <span class="label">वैवाहिक अवस्था :</span>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <span>विवाहित</span>
                <span class="checkbox ${(data.personal_details?.marital_status === 'Married' || data.personal_details?.marital_status === 'विवाहित') ? 'checked' : ''}"></span>
              </div>
              <div class="checkbox-item">
                <span>अविवाहित</span>
                <span class="checkbox ${(data.personal_details?.marital_status === 'Single' || data.personal_details?.marital_status === 'अविवाहित') ? 'checked' : ''}"></span>
              </div>
              <div class="checkbox-item">
                <span>अन्य</span>
                <span class="checkbox ${(data.personal_details?.marital_status && data.personal_details?.marital_status !== 'Married' && data.personal_details?.marital_status !== 'Single' && data.personal_details?.marital_status !== 'विवाहित' && data.personal_details?.marital_status !== 'अविवाहित') ? 'checked' : ''}"></span>
              </div>
            </div>
            <span class="label" style="margin-left: 20px;">धर्म :</span>
            <span class="value" style="width: 120px;">${data.personal_details?.religion || ''}</span>
          </div>
          <div class="form-row">
            <span class="label">PAN No. (स्थायी लेखा नं.):</span>
            <span class="value">${data.identification?.pan_number || ''}</span>
          </div>
          <div class="form-row">
            <span class="label">National ID (राष्ट्रिय परिचयपत्र नं.):</span>
            <span class="value">${data.identification?.national_id_number || ''}</span>
          </div>
          <div class="form-row">
            <span class="label">BOID No. (ब्रोकर आइडी ) :</span>
            <span class="value">${data.identification?.boid_number || ''}</span>
          </div>
        </div>

        <!-- Identification Document Details -->
        <div class="section">
          <div class="section-title">नागरिकताको हकमा (In case of Citizenship)</div>
          <div class="form-row">
            <span class="label">नागरिकता नं.:</span>
            <span class="value">${data.identification?.citizenship_number || ''}</span>
          </div>
          <div class="form-row">
            <span class="label">जारी मिति :</span>
            <span class="value">${formatDate(data.identification?.citizenship_issue_date) || ''}</span>
          </div>
          <div class="form-row">
            <span class="label">जारी जिल्ला :</span>
            <span class="value">${data.identification?.citizenship_issue_district || ''}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">राहदानीको हकमा (यदि भएमा ) (In case of Passport (if any))</div>
          <div class="form-row">
            <span class="label">राहदानी नं. :</span>
            <span class="value">${data.identification?.passport_number || ''}</span>
            <span class="label" style="margin-left: 20px;">जारी गर्ने कार्यालय :</span>
            <span class="value">${data.identification?.passport_issue_office || ''}</span>
            <span class="label" style="margin-left: 20px;">जारी जिल्ला :</span>
            <span class="value">${data.identification?.passport_issue_office?.split(',')[1]?.trim() || ''}</span>
          </div>
          <div class="form-row">
            <span class="label">जारी मिति :</span>
            <span class="value">${formatDate(data.identification?.passport_issue_date) || ''}</span>
            <span class="label" style="margin-left: 20px;">समाप्ति मिति :</span>
            <span class="value">${formatDate(data.identification?.passport_expiry_date) || ''}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">परिचयपत्रको विवरण (Details of Identity Card)</div>
          <div class="form-row">
            <span class="label">परिचयपत्र नं.:</span>
            <span class="value">${data.identification?.national_id_number || ''}</span>
            <span class="label" style="margin-left: 20px;">किसिम :</span>
            <span class="value">${data.identification?.national_id_type || ''}</span>
            <span class="label" style="margin-left: 20px;">जारी गर्ने कार्यालय :</span>
            <span class="value">${data.identification?.national_id_issue_office || ''}</span>
          </div>
          <div class="form-row">
            <span class="label">जारी मिति :</span>
            <span class="value">${formatDate(data.identification?.national_id_issue_date) || ''}</span>
            <span class="label" style="margin-left: 20px;">समाप्ति मिति :</span>
            <span class="value"></span>
          </div>
        </div>

        <!-- Family Details Section -->
        <div class="section">
          <div class="section-title">एकाघर परिवारका सदस्यको विवरण (Details of Household Family Members)</div>
          <table>
            <tr>
              <th style="width: 40%;">सम्बन्ध (Relationship)</th>
              <th>नाम (Name)</th>
            </tr>
            <tr>
              <td>पति/पत्नीको नाम (Spouse)</td>
              <td>${data.family_details?.spouse_name || ''}</td>
            </tr>
            <tr>
              <td>बाबुको नाम (Father's Name)</td>
              <td>${data.family_details?.father_name || ''}</td>
            </tr>
            <tr>
              <td>आमाको नाम (Mother's Name)</td>
              <td>${data.family_details?.mother_name || ''}</td>
            </tr>
            <tr>
              <td>बाजेको नाम (Grandfather's Name)</td>
              <td>${data.family_details?.grandfather_name || ''}</td>
            </tr>
            <tr>
              <td>छोराको नाम (Son Name)</td>
              <td>${data.family_details?.son_name || ''}</td>
            </tr>
            <tr>
              <td>छोरीको नाम (Daughter Name)</td>
              <td>${data.family_details?.daughter_name || ''}</td>
            </tr>
            <tr>
              <td>अन्य (others)</td>
              <td>${data.family_details?.other_family_members || ''}</td>
            </tr>
          </table>
        </div>

        <!-- Address Section -->
        <div class="section" style="margin-top: 140px;">
          <div class="section-title">ठेगाना (Address)</div>
          
          <div style="display: flex; gap: 20px; margin-top: 10px;">
            <!-- Permanent Address -->
            <div style="flex: 1;">
              <div class="section-title" style="font-size: 10px; margin-bottom: 5px;">स्थायी ठेगाना (Permanent Address)</div>
              <div class="form-row">
                <span class="label">प्रदेश :</span>
                <span class="value">${data.permanent_address?.province || ''}</span>
              </div>
              <div class="form-row">
                <span class="label">जिल्ला :</span>
                <span class="value">${data.permanent_address?.district || ''}</span>
              </div>
              <div class="form-row">
                <span class="label">गा.वि.स./न.पा. :</span>
                <span class="value">${data.permanent_address?.municipality || ''}</span>
              </div>
              <div class="form-row">
                <span class="label">वडा नं. :</span>
                <span class="value">${data.permanent_address?.ward_number || ''}</span>
              </div>
              <div class="form-row">
                <span class="label">टोल :</span>
                <span class="value">${data.permanent_address?.tole || ''}</span>
              </div>
              <div class="form-row">
                <span class="label">घर नं. :</span>
                <span class="value">${data.permanent_address?.house_number || ''}</span>
              </div>
              <div class="form-row">
                <span class="label">फोन नं. :</span>
                <span class="value">${data.permanent_address?.phone || ''}</span>
              </div>
              <div class="form-row">
                <span class="label">मोबाइल नं. :</span>
                <span class="value">${data.permanent_address?.mobile || ''}</span>
              </div>
              <div class="form-row">
                <span class="label">इमेल :</span>
                <span class="value">${data.permanent_address?.email || ''}</span>
              </div>
            </div>

            <!-- Current Address -->
            <div style="flex: 1;">
              <div class="section-title" style="font-size: 10px; margin-bottom: 5px;">हालको ठेगाना (Current Address)</div>
              <div class="form-row">
                <span class="label">प्रदेश :</span>
                <span class="value">${data.temporary_address?.province || ''}</span>
              </div>
              <div class="form-row">
                <span class="label">जिल्ला :</span>
                <span class="value">${data.temporary_address?.district || ''}</span>
              </div>
              <div class="form-row">
                <span class="label">गा.वि.स./न.पा. :</span>
                <span class="value">${data.temporary_address?.municipality || ''}</span>
              </div>
              <div class="form-row">
                <span class="label">वडा नं. :</span>
                <span class="value">${data.temporary_address?.ward_number || ''}</span>
              </div>
              <div class="form-row">
                <span class="label">टोल :</span>
                <span class="value">${data.temporary_address?.tole || ''}</span>
              </div>
              <div class="form-row">
                <span class="label">घर नं. :</span>
                <span class="value">${data.temporary_address?.house_number || ''}</span>
              </div>
              <div class="form-row">
                <span class="label">फोन नं. :</span>
                <span class="value">${data.temporary_address?.phone || ''}</span>
              </div>
              <div class="form-row">
                <span class="label">मोबाइल नं. :</span>
                <span class="value">${data.temporary_address?.mobile || ''}</span>
              </div>
              <div class="form-row">
                <span class="label">इमेल :</span>
                <span class="value">${data.temporary_address?.email || ''}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Occupation Section -->
        <div class="section">
          <div class="section-title">रोजगारीको किसिम (Type of Employment)</div>
          <div class="form-row">
            <div class="checkbox-group">
              <div class="checkbox-item">
                <span>तलब (Salary)</span>
                <span class="checkbox ${(data.occupation?.occupation_type === 'Salary' || data.occupation?.occupation_type === 'तलब') ? 'checked' : ''}"></span>
              </div>
              <div class="checkbox-item">
                <span>व्यवसाय (Business)</span>
                <span class="checkbox ${(data.occupation?.occupation_type === 'Business' || data.occupation?.occupation_type === 'व्यवसाय') ? 'checked' : ''}"></span>
              </div>
              <div class="checkbox-item">
                <span>अन्य (Other)</span>
                <span class="checkbox ${(data.occupation?.occupation_type && data.occupation?.occupation_type !== 'Salary' && data.occupation?.occupation_type !== 'Business' && data.occupation?.occupation_type !== 'तलब' && data.occupation?.occupation_type !== 'व्यवसाय') ? 'checked' : ''}"></span>
                <span style="margin-left: 5px;">${(data.occupation?.occupation_type && data.occupation?.occupation_type !== 'Salary' && data.occupation?.occupation_type !== 'Business' && data.occupation?.occupation_type !== 'तलब' && data.occupation?.occupation_type !== 'व्यवसाय') ? data.occupation.occupation_type : ''}</span>
              </div>
            </div>
          </div>
          <div style="margin-top: 8px; margin-bottom: 8px; font-size: 10px;">
            संलग्न रहेको पेशा /व्यवसायको विवरण (तीनवटा भन्दा बढी संस्थामा संलग्न भएमा छुट्टै विवरण पेश गर्नुपर्ने )
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 8%;">क्र.स. (S.N.)</th>
                <th style="width: 25%;">संस्थाको नाम (Name of Institution)</th>
                <th style="width: 30%;">ठेगाना (Address)</th>
                <th style="width: 20%;">पद (Post/Position)</th>
                <th style="width: 17%;">अनुमानित वार्षिक आम्दानी (Estimated Annual Income)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>१</td>
                <td>${data.occupation?.organization_name || ''}</td>
                <td>${data.occupation?.organization_address || ''}</td>
                <td>${data.occupation?.designation || ''}</td>
                <td>${data.occupation?.estimated_annual_income ? `Rs. ${data.occupation.estimated_annual_income}` : ''}</td>
              </tr>
              <tr>
                <td>२</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>३</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Nominee Section -->
        <div class="section">
          <div class="section-title">इच्छाएको व्यक्ति (Nominee)</div>
          <div class="form-row">
            <span class="label">नाम :</span>
            <span class="value">${data.nominee?.nominee_name || ''}</span>
          </div>
          <div class="form-row">
            <span class="label">नाता :</span>
            <span class="value">${data.nominee?.nominee_relationship || ''}</span>
          </div>
          <div style="margin-top: 8px;">
            <div class="form-row">
              <span class="label">ठेगाना : जिल्ला</span>
              <span class="value">${data.nominee?.nominee_address?.district || ''}</span>
            </div>
            <div class="form-row">
              <span class="label">गा.वि.स./न.पा.</span>
              <span class="value">${data.nominee?.nominee_address?.municipality || ''}</span>
            </div>
            <div class="form-row">
              <span class="label">वडा नं.</span>
              <span class="value">${data.nominee?.nominee_address?.ward_number || ''}</span>
            </div>
            <div class="form-row">
              <span class="label">फोन नं. :</span>
              <span class="value">${data.nominee?.nominee_address?.phone || ''}</span>
            </div>
            <div class="form-row">
              <span class="label">मोबाइल नं. :</span>
              <span class="value">${data.nominee?.nominee_address?.mobile || ''}</span>
            </div>
          </div>
        </div>

        <!-- Nominee Citizenship Details -->
        <div class="section">
          <div class="section-title">नागरिकता विवरण (Citizenship Details)</div>
          <div class="form-row">
            <span class="label">नागरिकता नं. :</span>
            <span class="value"></span>
          </div>
          <div class="form-row">
            <span class="label">जारी मिति :</span>
            <span class="value"></span>
          </div>
          <div class="form-row">
            <span class="label">जारी जिल्ला :</span>
            <span class="value"></span>
          </div>
        </div>

        <!-- Declaration and Signature -->
        <div class="declaration">
          माथि उल्लिखित विवरण पूर्ण र सही भएको घोषणा गर्दछु। साथै, यस कम्पनीको प्रवन्धपत्र, नियमावली तथा नीतिनिर्देशनको अधीनमा रही उल्लेखित सेयर रकम कम्पनीको निर्देशनअनुसार दाखिला गर्ने प्रतिबद्धता व्यक्त गर्दछु ।
        </div>

        <div class="signature-section">
          <div style="border-bottom: 1px solid #000; width: 150px; margin-left: auto; margin-bottom: 5px; height: 20px;"></div>
          <span>दस्तखत (Signature)</span>
        </div>

        <!-- Letter Section -->
        <div class="letter-section" style="margin-top: 220px;">
          <div class="letter-header">
            <div class="letter-to">
              <div>श्री सञ्चालक समिति,</div>
              <div>नेपाल भूमि बैंक लिमिटेड</div>
              <div>कोटेश्वर -३२ , नरेफाँट , काठमाडौं</div>
            </div>
            <div>
              <div class="form-row">
              <span></span>  
              <span class="label" style="align-items: right;">मिति : ${formatDate(data.application_date) || ''}</span>
              </div>
            </div>
          </div>

          <div style="text-align: center; font-weight: bold; margin: 15px 0;">
            विषय : सेयर खरिद गर्न पाऊँ ।
          </div>

          <div class="letter-body">
            <div style="margin-bottom: 10px;">महोदय ,</div>
            <div>
              उपरोक्त सम्बन्धमा यस कम्पनीले बिक्रीमा राखेको सेयरमध्ये ${data.share_details?.share_quantity || ''} कित्ता सेयर प्रति सेयर रु. १३० का दरले खरिद गर्न इच्छुक भएको हुँदा यो निवेदन पेश गरेको छु ।
            </div>
          </div>

          <div class="letter-signature">
            <div style="margin-bottom: 15px; text-align: right;">
              <div style="font-weight: bold; margin-bottom: 10px;">निवेदक</div>
              <div style="margin-bottom: 6px;">
                <span>नाम :</span>
                <span style="margin-left: 5px;">${data.personal_details?.full_name || ''}</span>
              </div>
              <div style="margin-bottom: 6px;">
                <span>नागरिकता नं. :</span>
                <span style="margin-left: 5px;">${data.identification?.citizenship_number || ''}</span>
              </div>
              <div style="margin-top: 8px;">
                <span>दस्तखत :</span>
                <div style="border-bottom: 1px dotted #000; width: 120px; display: inline-block; margin-left: 5px; height: 18px; vertical-align: middle;"></div>
              </div>
            </div>
          </div>

          <div class="attachments">
            <div style="font-weight: bold; margin-bottom: 10px;">संलग्न कागजातहरू:</div>
            <p>१. नागरिकता/राहदानीको प्रतिलिपि</p>
            <p>२. पासपोर्ट साइज फोटो २ प्रति</p>
            <p>३. इच्छाएको व्यक्तिको नागरिकताको प्रतिलिपि</p>
            <p>४. राष्ट्रिय परिचयपत्रको प्रतिलिपि (अनिवार्य)</p>
            <p>५. PAN को प्रतिलिपि</p>
            <p>६. व्यवस्थापन शुल्क रु. ३० लाग्नेछ र कुल रकम रु. १३० हुनेछ।</p>
            <p>७. शेयर फिर्ता पाइने छैन।</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
  iframeDoc.close();
  
  // Wait for iframe content to render
  await new Promise(resolve => setTimeout(resolve, 200));

  try {
    // Capture the iframe body as canvas
    const canvas = await html2canvas(iframeDoc.body, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: iframeDoc.body.scrollWidth,
      windowHeight: iframeDoc.body.scrollHeight,
      width: iframeDoc.body.scrollWidth,
      height: iframeDoc.body.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height minus margins (297 - 2mm top/bottom)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    const fileName = `share-application-${data.personal_details?.full_name?.replace(/\s+/g, '_') || 'form'}.pdf`;
    pdf.save(fileName);

  } catch (error) {
    console.error('PDF generation error:', error);
    alert('Failed to generate PDF. Please try again.');
  } finally {
    // Clean up iframe
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }
}
