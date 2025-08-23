// import React, { useState, useEffect } from 'react';
// import { Plus, MapPin, Phone, Building2, FileText, Hospital} from 'lucide-react';

// interface District {
//   district_id: number;
//   district_name: string;
// }

// interface HospitalData {
//   hospital_name: string;
//   hospital_type: string;
//   hospital_address: string;
//   contact_number: string;
//   district_name: string;
// }

// const AddHospitalForm = () => {
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  
//   const [formData, setFormData] = useState<HospitalData>({
//     hospital_name: '',
//     hospital_type: '',
//     hospital_address: '',
//     contact_number: '',
//     district_name: ''
//   });

//   const hospitalTypes = ['General', 'Teaching', 'Base'];

//   // Fetch districts on component mount
//   useEffect(() => {
//     fetchDistricts();
//   }, []);

//   const fetchDistricts = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('http://localhost:9092/dashboard/admin/districts');
//       if (response.ok) {
//         const data = await response.json();
//         setDistricts(data);
//       } else {
//         setMessage('Failed to load districts');
//         setMessageType('error');
//       }
//     } catch (error) {
//       setMessage('Error connecting to server');
//       setMessageType('error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setMessage('');

//     try {
//       const response = await fetch('http://localhost:9092/dashboard/admin/hospitals', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setMessage(result.message || 'Hospital added successfully!');
//         setMessageType('success');
//         // Reset form
//         setFormData({
//           hospital_name: '',
//           hospital_type: '',
//           hospital_address: '',
//           contact_number: '',
//           district_name: ''
//         });
//       } else {
//         setMessage(result.message || 'Failed to add hospital');
//         setMessageType('error');
//       }
//     } catch (error) {
//       setMessage('Error connecting to server');
//       setMessageType('error');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const isFormValid = formData.hospital_name && 
//                      formData.hospital_type && 
//                      formData.hospital_address && 
//                      formData.contact_number && 
//                      formData.district_name;

//   return (
//     <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-white to-pink-50">
//       {/* Header Section */}
//         <div className="mb-8 flex items-center space-x-4">
//           <div className="p-2 sm:p-3 bg-red-100 rounded-full">
//             <Hospital className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-1">Add New Hospital</h1>
//             <p className="text-gray-600">Register a new hospital in the system</p>
//           </div>
//         </div>

//       <div className="max-w-4xl mx-auto">      
//         {/* Form Section */}
//         <div className="bg-white backdrop-blur-xl bg-opacity-80 shadow-2xl rounded-3xl overflow-hidden border border-white/20">
//           <div className="p-8 sm:p-12">
//             {/* Message */}
//             {message && (
//               <div className={`rounded-2xl p-6 mb-8 border ${
//                 messageType === 'success' 
//                   ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200' 
//                   : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200'
//               }`}>
//                 <p className="text-sm font-semibold">{message}</p>
//               </div>
//             )}

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               {/* Left Column */}
//               <div className="space-y-6">
//                 {/* Hospital Name */}
//                 <div className="space-y-3">
//                   <label htmlFor="hospital_name" className="block text-sm font-bold text-gray-700">
//                     Hospital Name <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative group">
//                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                       <Building2 className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
//                     </div>
//                     <input
//                       type="text"
//                       id="hospital_name"
//                       name="hospital_name"
//                       value={formData.hospital_name}
//                       onChange={handleInputChange}
//                       className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white text-sm transition-all duration-200 hover:border-gray-300"
//                       placeholder="Enter hospital name"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Hospital Type */}
//                 <div className="space-y-3">
//                   <label htmlFor="hospital_type" className="block text-sm font-bold text-gray-700">
//                     Hospital Type <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative group">
//                     <select
//                       id="hospital_type"
//                       name="hospital_type"
//                       value={formData.hospital_type}
//                       onChange={handleInputChange}
//                       className="block w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white text-sm transition-all duration-200 hover:border-gray-300 appearance-none"
//                       required
//                     >
//                       <option value="">Select hospital type</option>
//                       {hospitalTypes.map((type) => (
//                         <option key={type} value={type}>
//                           {type}
//                         </option>
//                       ))}
//                     </select>
//                     <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
//                       <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Contact Number */}
//                 <div className="space-y-3">
//                   <label htmlFor="contact_number" className="block text-sm font-bold text-gray-700">
//                     Contact Number <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative group">
//                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                       <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
//                     </div>
//                     <input
//                       type="tel"
//                       id="contact_number"
//                       name="contact_number"
//                       value={formData.contact_number}
//                       onChange={handleInputChange}
//                       className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white text-sm transition-all duration-200 hover:border-gray-300"
//                       placeholder="Enter contact number"
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Right Column */}
//               <div className="space-y-6">
//                 {/* District */}
//                 <div className="space-y-3">
//                   <label htmlFor="district_name" className="block text-sm font-bold text-gray-700">
//                     District <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative group">
//                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                       <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
//                     </div>
//                     <select
//                       id="district_name"
//                       name="district_name"
//                       value={formData.district_name}
//                       onChange={handleInputChange}
//                       disabled={loading}
//                       className="block w-full pl-12 pr-10 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white text-sm transition-all duration-200 hover:border-gray-300 disabled:bg-gray-100 appearance-none"
//                       required
//                     >
//                       <option value="">
//                         {loading ? 'Loading districts...' : 'Select district'}
//                       </option>
//                       {districts.map((district) => (
//                         <option key={district.district_id} value={district.district_name}>
//                           {district.district_name}
//                         </option>
//                       ))}
//                     </select>
//                     <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
//                       <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Hospital Address */}
//                 <div className="space-y-3">
//                   <label htmlFor="hospital_address" className="block text-sm font-bold text-gray-700">
//                     Hospital Address <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative group">
//                     <div className="absolute top-4 left-4 pointer-events-none">
//                       <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
//                     </div>
//                     <textarea
//                       id="hospital_address"
//                       name="hospital_address"
//                       value={formData.hospital_address}
//                       onChange={handleInputChange}
//                       rows={4}
//                       className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white text-sm transition-all duration-200 hover:border-gray-300 resize-none"
//                       placeholder="Enter complete hospital address"
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="mt-10">
//               <button
//                 type="submit"
//                 disabled={!isFormValid || submitting}
//                 onClick={handleSubmit}
//                 className={`w-full flex justify-center items-center space-x-3 py-5 px-6 border border-transparent rounded-2xl text-base font-bold transition-all duration-300 transform ${
//                   !isFormValid || submitting
//                     ? 'bg-gray-200 text-gray-500 cursor-not-allowed scale-100'
//                     : 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95'
//                 }`}
//               >
//                 {submitting ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                     <span>Adding Hospital...</span>
//                   </>
//                 ) : (
//                   <>
//                     <Plus className="h-5 w-5" />
//                     <span>Add Hospital to System</span>
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Footer Info */}
//         <div className="mt-8 text-center">
//           <p className="text-gray-500 text-sm font-medium">
//             Ensure all information is accurate and complete before submitting
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddHospitalForm;

import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Phone, Building2, FileText, Hospital } from 'lucide-react';

interface District {
  district_id: number;
  district_name: string;
}

interface HospitalData {
  hospital_name: string;
  hospital_type: string;
  hospital_address: string;
  contact_number: string;
  district_name: string;
}

const AddHospitals = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState<HospitalData>({
    hospital_name: '',
    hospital_type: '',
    hospital_address: '',
    contact_number: '',
    district_name: '',
  });

  const hospitalTypes = ['General', 'Teaching', 'Base'];

  // ✅ Fetch districts on mount
  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:9092/dashboard/admin/districts', {
        method: 'GET',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDistricts(data);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to load districts');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error connecting to server');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:9092/dashboard/admin/hospitals', {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });


      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || 'Hospital added successfully!');
        setMessageType('success');
        // Reset form
        setFormData({
          hospital_name: '',
          hospital_type: '',
          hospital_address: '',
          contact_number: '',
          district_name: '',
        });
      } else {
        setMessage(result.message || 'Failed to add hospital');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error connecting to server');
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    formData.hospital_name &&
    formData.hospital_type &&
    formData.hospital_address &&
    formData.contact_number &&
    formData.district_name;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-white to-pink-50">
      {/* Header Section */}
      <div className="mb-8 flex items-center space-x-4">
        <div className="p-2 sm:p-3 bg-red-100 rounded-full">
          <Hospital className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Add New Hospital</h1>
          <p className="text-gray-600">Register a new hospital in the system</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Form Section */}
        <div className="bg-white backdrop-blur-xl bg-opacity-80 shadow-2xl rounded-3xl overflow-hidden border border-white/20">
          <div className="p-8 sm:p-12">
            {/* Message */}
            {message && (
              <div
                className={`rounded-2xl p-6 mb-8 border ${
                  messageType === 'success'
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200'
                    : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200'
                }`}
              >
                <p className="text-sm font-semibold">{message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Hospital Name */}
                  <div className="space-y-3">
                    <label htmlFor="hospital_name" className="block text-sm font-bold text-gray-700">
                      Hospital Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        id="hospital_name"
                        name="hospital_name"
                        value={formData.hospital_name}
                        onChange={handleInputChange}
                        className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white text-sm transition-all duration-200 hover:border-gray-300"
                        placeholder="Enter hospital name"
                        required
                      />
                    </div>
                  </div>

                  {/* Hospital Type */}
                  <div className="space-y-3">
                    <label htmlFor="hospital_type" className="block text-sm font-bold text-gray-700">
                      Hospital Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <select
                        id="hospital_type"
                        name="hospital_type"
                        value={formData.hospital_type}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white text-sm transition-all duration-200 hover:border-gray-300 appearance-none"
                        required
                      >
                        <option value="">Select hospital type</option>
                        {hospitalTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div className="space-y-3">
                    <label htmlFor="contact_number" className="block text-sm font-bold text-gray-700">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                      </div>
                      <input
                        type="tel"
                        id="contact_number"
                        name="contact_number"
                        value={formData.contact_number}
                        onChange={handleInputChange}
                        className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white text-sm transition-all duration-200 hover:border-gray-300"
                        placeholder="Enter contact number"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* District */}
                  <div className="space-y-3">
                    <label htmlFor="district_name" className="block text-sm font-bold text-gray-700">
                      District <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                      </div>
                      <select
                        id="district_name"
                        name="district_name"
                        value={formData.district_name}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="block w-full pl-12 pr-10 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white text-sm transition-all duration-200 hover:border-gray-300 disabled:bg-gray-100 appearance-none"
                        required
                      >
                        <option value="">
                          {loading ? 'Loading districts...' : 'Select district'}
                        </option>
                        {districts.map((district) => (
                          <option key={district.district_id} value={district.district_name}>
                            {district.district_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Hospital Address */}
                  <div className="space-y-3">
                    <label htmlFor="hospital_address" className="block text-sm font-bold text-gray-700">
                      Hospital Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute top-4 left-4 pointer-events-none">
                        <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                      </div>
                      <textarea
                        id="hospital_address"
                        name="hospital_address"
                        value={formData.hospital_address}
                        onChange={handleInputChange}
                        rows={4}
                        className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white text-sm transition-all duration-200 hover:border-gray-300 resize-none"
                        placeholder="Enter complete hospital address"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-10">
                <button
                  type="submit"
                  disabled={!isFormValid || submitting}
                  className={`w-full flex justify-center items-center space-x-3 py-5 px-6 border border-transparent rounded-2xl text-base font-bold transition-all duration-300 transform ${
                    !isFormValid || submitting
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed scale-100'
                      : 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95'
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Adding Hospital...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      <span>Add Hospital to System</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm font-medium">
            Ensure all information is accurate and complete before submitting
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddHospitals;
