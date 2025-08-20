// import React, { useState, useEffect } from 'react';
// import { UserPlus, Lock, Building2, Plus, Mail, MapPin, ChevronDown, RefreshCw } from 'lucide-react';

// const AddHospitalUser = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     hospitalName: ''
//   });
//   const [selectedHospital, setSelectedHospital] = useState(null);
//   const [showHospitalDropdown, setShowHospitalDropdown] = useState(false);
//   const [hospitals, setHospitals] = useState([]);
//   const [hospitalsLoading, setHospitalsLoading] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', content: '' });

//   // Fetch hospitals from API
//   const fetchHospitals = async () => {
//     setHospitalsLoading(true);
//     try {
//       const response = await fetch('http://localhost:9092/dashboard/admin/hospitalData', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch hospitals');
//       }

//       const hospitalData = await response.json();
      
//       // Filter only active hospitals if status field exists
//       const activeHospitals = hospitalData.filter(hospital => 
//         !hospital.status || hospital.status === 'active' || hospital.status === 'Active'
//       );
      
//       setHospitals(activeHospitals);
//     } catch (error) {
//       console.error('Error fetching hospitals:', error);
//       setMessage({
//         type: 'error',
//         content: 'Failed to load hospitals. Please try again.'
//       });
      
//       // Fallback to mock data for demo purposes
//       const mockHospitals = [
//         { hospital_id: 1, hospital_name: 'General Hospital', hospital_type: 'Government', district_name: 'Colombo' },
//         { hospital_id: 2, hospital_name: 'City Medical Center', hospital_type: 'Private', district_name: 'Gampaha' },
//         { hospital_id: 3, hospital_name: 'Metropolitan Hospital', hospital_type: 'Private', district_name: 'Kalutara' }
//       ];
//       setHospitals(mockHospitals);
//     } finally {
//       setHospitalsLoading(false);
//     }
//   };

//   // Load hospitals on component mount
//   useEffect(() => {
//     fetchHospitals();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const selectHospital = (hospital) => {
//     setSelectedHospital(hospital);
//     setFormData(prev => ({
//       ...prev,
//       hospitalName: hospital.hospital_name
//     }));
//     setShowHospitalDropdown(false);
//   };

//   const hashPassword = async (password) => {
//     const encoder = new TextEncoder();
//     const data = encoder.encode(password);
//     const hashBuffer = await crypto.subtle.digest('SHA-256', data);
//     const hashArray = Array.from(new Uint8Array(hashBuffer));
//     return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setMessage({ type: '', content: '' });

//     try {
//       // Validate form
//       if (!formData.email || !formData.password || !selectedHospital) {
//         throw new Error('All fields are required');
//       }

//       // Email validation
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(formData.email)) {
//         throw new Error('Please enter a valid email address');
//       }

//       // Password validation
//       if (formData.password.length < 6) {
//         throw new Error('Password must be at least 6 characters long');
//       }

//       // Hash password
//       const passwordHash = await hashPassword(formData.password);

//       // Prepare payload for API
//       const payload = {
//         hospital_email: formData.email,
//         hospital_name: selectedHospital.hospital_name,
//         password_hash: passwordHash
//       };

//       // Make API call to add hospital user
//       const response = await fetch('http://localhost:9092/dashboard/admin/hospitalUsers', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload)
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add hospital user');
//       }

//       const result = await response.json();
      
//       if (result.message && result.message.includes('successfully')) {
//         setMessage({
//           type: 'success',
//           content: result.message
//         });

//         // Reset form on success
//         setFormData({
//           email: '',
//           password: '',
//           hospitalName: ''
//         });
//         setSelectedHospital(null);
//       } else {
//         // Handle API error messages
//         setMessage({
//           type: 'error',
//           content: result.message || 'Failed to add hospital user'
//         });
//       }

//     } catch (error) {
//       setMessage({
//         type: 'error',
//         content: error.message
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">
//       {/* Header - Top Left */}
//       <div className="flex items-center gap-4 mb-8">
//         <div className="w-12 h-12 bg-red-100 flex items-center justify-center rounded-full">
//           <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
//         </div>
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Add New Hospital User</h1>
//           <p className="text-gray-600">Create a new hospital user account</p>
//         </div>
//       </div>

//       {/* Centered Form Container */}
//       <div className="flex justify-center py-15">
//         <div className="w-full max-w-4xl">
//           {/* Success/Error Message */}
//           {message.content && (
//             <div className={`mb-6 p-4 rounded-lg ${
//               message.type === 'success' 
//                 ? 'bg-green-50 border border-green-200 text-green-700' 
//                 : 'bg-red-50 border border-red-200 text-red-700'
//             }`}>
//               {message.content}
//             </div>
//           )}

//           {/* Form Card */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Email */}
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-gray-700">
//                 Email Address <span className="text-red-500">*</span>
//               </label>
//               <div className="relative border border-gray-700 rounded-xl">
//                 <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="Enter email address"
//                   className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
//                 />
//               </div>
//             </div>

//             {/* Hospital Selection */}
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-gray-700">
//                 Hospital <span className="text-red-500">*</span>
//               </label>
//               <div className="relative border border-gray-700 rounded-xl">
//                 <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <button
//                   type="button"
//                   onClick={() => setShowHospitalDropdown(!showHospitalDropdown)}
//                   disabled={hospitalsLoading}
//                   className="w-full pl-12 pr-12 py-4 bg-gray-50 border-0 rounded-xl text-left text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all disabled:opacity-50"
//                 >
//                   {hospitalsLoading ? (
//                     <span className="flex items-center gap-2">
//                       <RefreshCw className="w-4 h-4 animate-spin" />
//                       Loading hospitals...
//                     </span>
//                   ) : (
//                     selectedHospital ? selectedHospital.hospital_name : 'Select hospital'
//                   )}
//                 </button>
//                 <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                
//                 {showHospitalDropdown && !hospitalsLoading && hospitals.length > 0 && (
//                   <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
//                     {hospitals.map(hospital => (
//                       <button
//                         key={hospital.hospital_id}
//                         type="button"
//                         onClick={() => selectHospital(hospital)}
//                         className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
//                       >
//                         <div className="font-medium text-gray-900">{hospital.hospital_name}</div>
//                         <div className="text-sm text-gray-500">
//                           {hospital.hospital_type} • {hospital.district_name}
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 )}
                
//                 {showHospitalDropdown && !hospitalsLoading && hospitals.length === 0 && (
//                   <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3">
//                     <div className="text-sm text-gray-500 text-center">
//                       No hospitals available
//                       <button
//                         type="button"
//                         onClick={fetchHospitals}
//                         className="ml-2 text-blue-600 hover:text-blue-800"
//                       >
//                         Retry
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//               {!selectedHospital && showHospitalDropdown && (
//                 <div className="text-xs text-red-500 mt-1">Please select an item in the list.</div>
//               )}
//             </div>

//             {/* Password */}
//             <div className="space-y-2 md:col-span-2">
//               <label className="text-sm font-bold text-gray-700">
//                 Password <span className="text-red-500">*</span>
//               </label>
//               <div className="relative border border-gray-700 rounded-xl ">
//                 <Lock className="absolute left-4 top-5 w-5 h-5 text-gray-400" />
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   placeholder="Enter password (min 6 characters)"
//                   className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="mt-8">
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//             >
//               {loading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
//                   Adding User...
//                 </>
//               ) : (
//                 <>
//                   <Plus className="w-5 h-5" />
//                   Add Hospital User to System
//                 </>
//               )}
//             </button>
//           </div>
//           </div>

//           {/* Footer Note */}
//           <p className="text-center text-gray-500 text-sm mt-6">
//             Ensure all information is accurate and complete before submitting
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddHospitalUser;

import React, { useState, useEffect } from 'react';
import { UserPlus, Lock, Building2, Plus, Mail, MapPin, ChevronDown, RefreshCw } from 'lucide-react';

const AddHospitalUser = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    hospitalName: ''
  });
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showHospitalDropdown, setShowHospitalDropdown] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [hospitalsLoading, setHospitalsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  // Fetch hospitals from API
  const fetchHospitals = async () => {
    setHospitalsLoading(true);
    try {
      const response = await fetch('http://localhost:9092/dashboard/admin/hospitalData', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hospitals');
      }

      const hospitalData = await response.json();
      
      // Filter only active hospitals if status field exists
      const activeHospitals = hospitalData.filter(hospital => 
        !hospital.status || hospital.status === 'active' || hospital.status === 'Active'
      );
      
      setHospitals(activeHospitals);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setMessage({
        type: 'error',
        content: 'Failed to load hospitals. Please try again.'
      });
      
      // Fallback to mock data for demo purposes
      const mockHospitals = [
        { hospital_id: 1, hospital_name: 'General Hospital', hospital_type: 'Government', district_name: 'Colombo' },
        { hospital_id: 2, hospital_name: 'City Medical Center', hospital_type: 'Private', district_name: 'Gampaha' },
        { hospital_id: 3, hospital_name: 'Metropolitan Hospital', hospital_type: 'Private', district_name: 'Kalutara' }
      ];
      setHospitals(mockHospitals);
    } finally {
      setHospitalsLoading(false);
    }
  };

  // Load hospitals on component mount
  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectHospital = (hospital) => {
    setSelectedHospital(hospital);
    setFormData(prev => ({
      ...prev,
      hospitalName: hospital.hospital_name
    }));
    setShowHospitalDropdown(false);
  };

  // Removed client-side password hashing - backend will handle it
  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      // Validate form
      if (!formData.email || !formData.password || !selectedHospital) {
        throw new Error('All fields are required');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Password validation
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Prepare payload for API - matching your backend expectations
      const payload = {
        hospital_email: formData.email,
        hospital_name: selectedHospital.hospital_name,
        password: formData.password  // Send plain password, backend will hash it
      };

      // Make API call to add hospital user - Updated URL to match your backend
      const response = await fetch('http://localhost:9092/dashboard/admin/hospitalUsers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      // Handle response based on your backend response format
      if (result.message && result.message.includes('successfully')) {
        setMessage({
          type: 'success',
          content: result.message
        });

        // Reset form on success
        setFormData({
          email: '',
          password: '',
          hospitalName: ''
        });
        setSelectedHospital(null);
      } else {
        // Handle API error messages
        setMessage({
          type: 'error',
          content: result.message || 'Failed to add hospital user'
        });
      }

    } catch (error) {
      console.error('Error adding hospital user:', error);
      setMessage({
        type: 'error',
        content: error.message || 'An unexpected error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">
      {/* Header - Top Left */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-red-100 flex items-center justify-center rounded-full">
          <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Hospital User</h1>
          <p className="text-gray-600">Create a new hospital user account</p>
        </div>
      </div>

      {/* Centered Form Container */}
      <div className="flex justify-center py-15">
        <div className="w-full max-w-4xl">
          {/* Success/Error Message */}
          {message.content && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.content}
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative border border-gray-700 rounded-xl">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Hospital Selection */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Hospital <span className="text-red-500">*</span>
              </label>
              <div className="relative border border-gray-700 rounded-xl">
                <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowHospitalDropdown(!showHospitalDropdown)}
                  disabled={hospitalsLoading}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border-0 rounded-xl text-left text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all disabled:opacity-50"
                >
                  {hospitalsLoading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Loading hospitals...
                    </span>
                  ) : (
                    selectedHospital ? selectedHospital.hospital_name : 'Select hospital'
                  )}
                </button>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                
                {showHospitalDropdown && !hospitalsLoading && hospitals.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {hospitals.map(hospital => (
                      <button
                        key={hospital.hospital_id}
                        type="button"
                        onClick={() => selectHospital(hospital)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                      >
                        <div className="font-medium text-gray-900">{hospital.hospital_name}</div>
                        <div className="text-sm text-gray-500">
                          {hospital.hospital_type} • {hospital.district_name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {showHospitalDropdown && !hospitalsLoading && hospitals.length === 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3">
                    <div className="text-sm text-gray-500 text-center">
                      No hospitals available
                      <button
                        type="button"
                        onClick={fetchHospitals}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {!selectedHospital && showHospitalDropdown && (
                <div className="text-xs text-red-500 mt-1">Please select an item in the list.</div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative border border-gray-700 rounded-xl ">
                <Lock className="absolute left-4 top-5 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password (min 6 characters)"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Adding User...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add Hospital User to System
                </>
              )}
            </button>
          </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Ensure all information is accurate and complete before submitting
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddHospitalUser;