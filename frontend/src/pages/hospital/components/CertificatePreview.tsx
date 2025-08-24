import React from 'react';
import DOMPurify from 'dompurify';
import { HeartIcon } from 'lucide-react';

interface CertificateProps {
  donation: {
    donation_id: number;
    donor_name: string;
    blood_group: string;
    donate_date: string | null;
    donor_id: number;
  };
  hospitalName: string;
}

const CertificatePreview: React.FC<CertificateProps> = ({ donation, hospitalName }) => {
  const certificateId = `CERT-${donation.donation_id}-${Date.now()}`;
  const donationDate = donation.donate_date 
    ? new Date(donation.donate_date).toLocaleDateString() 
    : 'N/A';
  const issuedDate = new Date().toLocaleDateString();

  const certificateHtml = `
    <div class="relative max-w-4xl mx-auto bg-gradient-to-br from-white to-gray-50 border-8 border-red-500 rounded-2xl p-16 text-center shadow-2xl">
      <div class="absolute top-6 right-6 text-xs text-gray-500 font-mono">Certificate ID: ${certificateId}</div>
      
      <div class="mb-10">
        <div class="text-5xl text-red-500 mb-2">🏥</div>
        <div class="text-2xl font-bold text-gray-800 uppercase tracking-wider">${hospitalName}</div>
      </div>
      
      <div class="text-4xl font-bold text-red-500 uppercase tracking-widest mb-8">Certificate of Appreciation</div>
      <div class="text-lg text-gray-600 italic mb-10">Blood Donation Recognition</div>
      
      <div class="text-lg text-gray-600 mb-8">This is to certify that</div>
      
      <div class="text-3xl font-bold text-gray-800 underline decoration-red-500 decoration-2 underline-offset-8 mb-8">${donation.donor_name}</div>
      
      <div class="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10">
        has generously donated blood and made a significant contribution to saving lives in our community. 
        Your selfless act of kindness demonstrates the highest form of humanity and compassion.
        <span class="inline-block text-red-500 mx-2"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></span>
        <br><br>
        <em>"The gift of blood is the gift of life. Thank you for being a hero."</em>
      </div>
      
      <div class="flex justify-around flex-wrap mb-10">
        <div class="text-center m-2">
          <div class="text-sm uppercase text-gray-600 tracking-wide mb-1">Blood Group</div>
          <div class="text-lg font-bold text-red-500 border-b-2 border-red-500 pb-1 min-w-[120px]">${donation.blood_group}</div>
        </div>
        <div class="text-center m-2">
          <div class="text-sm uppercase text-gray-600 tracking-wide mb-1">Donation Date</div>
          <div class="text-lg font-bold text-red-500 border-b-2 border-red-500 pb-1 min-w-[120px]">${donationDate}</div>
        </div>
        <div class="text-center m-2">
          <div class="text-sm uppercase text-gray-600 tracking-wide mb-1">Donor ID</div>
          <div class="text-lg font-bold text-red-500 border-b-2 border-red-500 pb-1 min-w-[120px]">#${donation.donor_id}</div>
        </div>
      </div>
      
      <div class="flex justify-between items-end">
        <div class="text-center w-48">
          <div class="border-t-2 border-gray-800 mb-2"></div>
          <div class="text-sm font-bold text-gray-600">Medical Director</div>
        </div>
        <div class="text-center">
          <div class="text-base text-gray-600">Issued on ${issuedDate}</div>
        </div>
        <div class="text-center w-48">
          <div class="border-t-2 border-gray-800 mb-2"></div>
          <div class="text-sm font-bold text-gray-600">Blood Bank Manager</div>
        </div>
      </div>
    </div>
  `;

  return (
    <div className="bg-gray-100 min-h-screen p-10 print:bg-white print:p-5">
      <div 
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(certificateHtml, { USE_PROFILES: { html: true } }) }} 
        className="print:shadow-none print:border-8 print:border-red-500"
      />
    </div>
  );
};

export default CertificatePreview;