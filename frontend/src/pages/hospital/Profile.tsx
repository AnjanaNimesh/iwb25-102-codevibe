// // ProfilePage.tsx (React Vite TypeScript)
// // Assume you have axios installed: npm install axios
// // Base URL: http://localhost:9090 (adjust as needed)
// // Assumes auth token is stored in cookies and sent with requests

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// axios.defaults.baseURL = 'http://localhost:9090';
// axios.defaults.withCredentials = true;

// interface HospitalProfile {
//   email: string;
//   full_name: string;
//   hospital_id: number;
//   role: string;
//   status: string;
//   hospital_type: string | null;
//   hospital_address: string | null;
//   contact_number: string | null;
//   district_id: number;
//   latitude: number;
//   longitude: number;
// }

// interface District {
//   district_id: number;
//   district_name: string;
// }

// interface ChangePasswordForm {
//   old: string;
//   newPass: string;
//   confirm: string;
// }

// const ProfilePage: React.FC = () => {
//   const [profile, setProfile] = useState<HospitalProfile | null>(null);
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [editing, setEditing] = useState(false);
//   const [formData, setFormData] = useState<Partial<HospitalProfile>>({});
//   const [changePass, setChangePass] = useState<ChangePasswordForm>({ old: '', newPass: '', confirm: '' });
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   useEffect(() => {
//     fetchProfile();
//     fetchDistricts();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const res = await axios.get('/hospital/profile');
//       if (res.data.status === 'success') {
//         setProfile(res.data.data);
//         setFormData(res.data.data);
//       }
//     } catch (err) {
//       setError('Failed to fetch profile');
//     }
//   };

//   const fetchDistricts = async () => {
//     try {
//       const res = await axios.get('/hospital/districts');
//       if (res.data.status === 'success') {
//         setDistricts(res.data.data);
//       }
//     } catch (err) {
//       setError('Failed to fetch districts');
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === 'district_id' || name === 'latitude' || name === 'longitude' ? Number(value) : value,
//     }));
//   };

//   const saveProfile = async () => {
//     try {
//       const updatePayload: HospitalUpdate = {
//         hospital_name: formData.full_name ?? undefined,
//         hospital_type: formData.hospital_type ?? undefined,
//         hospital_address: formData.hospital_address ?? undefined,
//         contact_number: formData.contact_number ?? undefined,
//         district_id: formData.district_id ?? undefined,
//         latitude: formData.latitude ?? undefined,
//         longitude: formData.longitude ?? undefined,
//       };
//       const res = await axios.put('/hospital/profile', updatePayload);
//       if (res.data.status === 'success') {
//         setProfile({ ...profile!, ...formData });
//         setEditing(false);
//         setSuccess('Profile updated successfully');
//       }
//     } catch (err) {
//       setError('Failed to update profile');
//     }
//   };

//   const handleChangePassword = async () => {
//     if (changePass.newPass !== changePass.confirm) {
//       setError('New passwords do not match');
//       return;
//     }
//     try {
//       const res = await axios.post('/hospital/changePassword', {
//         old_password: changePass.old,
//         new_password: changePass.newPass,
//       });
//       if (res.data.status === 'success') {
//         setSuccess('Password changed successfully');
//         setChangePass({ old: '', newPass: '', confirm: '' });
//       }
//     } catch (err) {
//       setError('Failed to change password');
//     }
//   };

//   if (!profile) return <div>Loading...</div>;

//   const currentDistrictName = districts.find((d) => d.district_id === profile.district_id)?.district_name || 'Unknown';

//   return (
//     <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
//       <h1>Hospital Profile</h1>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {success && <p style={{ color: 'green' }}>{success}</p>}

//       {!editing ? (
//         <div>
//           <p><strong>Name:</strong> {profile.full_name}</p>
//           <p><strong>Email:</strong> {profile.email}</p>
//           <p><strong>Type:</strong> {profile.hospital_type || 'N/A'}</p>
//           <p><strong>Address:</strong> {profile.hospital_address || 'N/A'}</p>
//           <p><strong>Contact Number:</strong> {profile.contact_number || 'N/A'}</p>
//           <p><strong>District:</strong> {currentDistrictName}</p>
//           <p><strong>Latitude:</strong> {profile.latitude}</p>
//           <p><strong>Longitude:</strong> {profile.longitude}</p>
//           <p><strong>Role:</strong> {profile.role}</p>
//           <p><strong>Status:</strong> {profile.status}</p>
//           <button onClick={() => setEditing(true)}>Edit Profile</button>
//         </div>
//       ) : (
//         <div>
//           <label>
//             Name:
//             <input name="full_name" value={formData.full_name || ''} onChange={handleInputChange} />
//           </label>
//           <label>
//             Type:
//             <input name="hospital_type" value={formData.hospital_type || ''} onChange={handleInputChange} />
//           </label>
//           <label>
//             Address:
//             <input name="hospital_address" value={formData.hospital_address || ''} onChange={handleInputChange} />
//           </label>
//           <label>
//             Contact Number:
//             <input name="contact_number" value={formData.contact_number || ''} onChange={handleInputChange} />
//           </label>
//           <label>
//             District:
//             <select name="district_id" value={formData.district_id || ''} onChange={handleInputChange}>
//               {districts.map((d) => (
//                 <option key={d.district_id} value={d.district_id}>
//                   {d.district_name}
//                 </option>
//               ))}
//             </select>
//           </label>
//           <label>
//             Latitude:
//             <input type="number" name="latitude" value={formData.latitude ?? ''} onChange={handleInputChange} />
//           </label>
//           <label>
//             Longitude:
//             <input type="number" name="longitude" value={formData.longitude ?? ''} onChange={handleInputChange} />
//           </label>
//           <button onClick={saveProfile}>Save</button>
//           <button onClick={() => setEditing(false)}>Cancel</button>
//         </div>
//       )}

//       <h2>Change Password</h2>
//       <label>
//         Old Password:
//         <input
//           type="password"
//           value={changePass.old}
//           onChange={(e) => setChangePass({ ...changePass, old: e.target.value })}
//         />
//       </label>
//       <label>
//         New Password:
//         <input
//           type="password"
//           value={changePass.newPass}
//           onChange={(e) => setChangePass({ ...changePass, newPass: e.target.value })}
//         />
//       </label>
//       <label>
//         Confirm New Password:
//         <input
//           type="password"
//           value={changePass.confirm}
//           onChange={(e) => setChangePass({ ...changePass, confirm: e.target.value })}
//         />
//       </label>
//       <button onClick={handleChangePassword}>Change Password</button>
//     </div>
//   );
// };

// export default ProfilePage;

// // ProfilePage.tsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// // Configure axios
// axios.defaults.baseURL = 'http://localhost:9090';
// axios.defaults.withCredentials = true;

// // Define interfaces
// interface HospitalProfile {
//   email: string;
//   full_name: string;
//   hospital_id: number;
//   role: string;
//   status: string;
//   hospital_type: string | null;
//   hospital_address: string | null;
//   contact_number: string | null;
//   district_id: number;
//   latitude: number;
//   longitude: number;
// }

// interface District {
//   district_id: number;
//   district_name: string;
// }

// interface ChangePasswordForm {
//   old: string;
//   newPass: string;
//   confirm: string;
// }

// // New HospitalUpdate interface to match backend
// interface HospitalUpdate {
//   hospital_name?: string;
//   hospital_type?: string;
//   hospital_address?: string;
//   contact_number?: string;
//   district_id?: number;
//   latitude?: number;
//   longitude?: number;
// }

// const HospitalProfilePage: React.FC = () => {
//   const [profile, setProfile] = useState<HospitalProfile | null>(null);
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [editing, setEditing] = useState(false);
//   const [formData, setFormData] = useState<Partial<HospitalProfile>>({});
//   const [changePass, setChangePass] = useState<ChangePasswordForm>({ old: '', newPass: '', confirm: '' });
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   useEffect(() => {
//     fetchProfile();
//     fetchDistricts();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const res = await axios.get('/hospital/profile');
//       if (res.data.status === 'success') {
//         setProfile(res.data.data);
//         setFormData(res.data.data);
//       } else {
//         setError(res.data.message || 'Failed to fetch profile');
//       }
//     } catch (err) {
//       setError('Failed to fetch profile');
//     }
//   };

//   const fetchDistricts = async () => {
//     try {
//       const res = await axios.get('/hospital/districts');
//       if (res.data.status === 'success') {
//         setDistricts(res.data.data);
//       } else {
//         setError(res.data.message || 'Failed to fetch districts');
//       }
//     } catch (err) {
//       setError('Failed to fetch districts');
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === 'district_id' || name === 'latitude' || name === 'longitude' ? Number(value) : value,
//     }));
//   };

//   const saveProfile = async () => {
//     try {
//       const updatePayload: HospitalUpdate = {
//         hospital_name: formData.full_name,
//         hospital_type: formData.hospital_type ?? undefined,
//         hospital_address: formData.hospital_address ?? undefined,
//         contact_number: formData.contact_number ?? undefined,
//         district_id: formData.district_id,
//         latitude: formData.latitude,
//         longitude: formData.longitude,
//       };
//       const res = await axios.put('/hospital/profile', updatePayload);
//       if (res.data.status === 'success') {
//         setProfile({ ...profile!, ...formData });
//         setEditing(false);
//         setSuccess(res.data.message || 'Profile updated successfully');
//         setError(null);
//       } else {
//         setError(res.data.message || 'Failed to update profile');
//       }
//     } catch (err) {
//       setError('Failed to update profile');
//     }
//   };

//   const handleChangePassword = async () => {
//     if (changePass.newPass !== changePass.confirm) {
//       setError('New passwords do not match');
//       return;
//     }
//     try {
//       const res = await axios.post('/hospital/changePassword', {
//         old_password: changePass.old,
//         new_password: changePass.newPass,
//       });
//       if (res.data.status === 'success') {
//         setSuccess(res.data.message || 'Password changed successfully');
//         setChangePass({ old: '', newPass: '', confirm: '' });
//         setError(null);
//       } else {
//         setError(res.data.message || 'Failed to change password');
//       }
//     } catch (err) {
//       setError('Failed to change password');
//     }
//   };

//   if (!profile) return <div>Loading...</div>;

//   const currentDistrictName = districts.find((d) => d.district_id === profile.district_id)?.district_name || 'Unknown';

//   return (
//     <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
//       <h1>Hospital Profile</h1>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {success && <p style={{ color: 'green' }}>{success}</p>}

//       {!editing ? (
//         <div>
//           <p><strong>Name:</strong> {profile.full_name}</p>
//           <p><strong>Email:</strong> {profile.email}</p>
//           <p><strong>Type:</strong> {profile.hospital_type || 'N/A'}</p>
//           <p><strong>Address:</strong> {profile.hospital_address || 'N/A'}</p>
//           <p><strong>Contact Number:</strong> {profile.contact_number || 'N/A'}</p>
//           <p><strong>District:</strong> {currentDistrictName}</p>
//           <p><strong>Latitude:</strong> {profile.latitude}</p>
//           <p><strong>Longitude:</strong> {profile.longitude}</p>
//           <p><strong>Role:</strong> {profile.role}</p>
//           <p><strong>Status:</strong> {profile.status}</p>
//           <button onClick={() => setEditing(true)}>Edit Profile</button>
//         </div>
//       ) : (
//         <div>
//           <label>
//             Name:
//             <input name="full_name" value={formData.full_name || ''} onChange={handleInputChange} />
//           </label>
//           <br />
//           <label>
//             Type:
//             <input name="hospital_type" value={formData.hospital_type || ''} onChange={handleInputChange} />
//           </label>
//           <br />
//           <label>
//             Address:
//             <input name="hospital_address" value={formData.hospital_address || ''} onChange={handleInputChange} />
//           </label>
//           <br />
//           <label>
//             Contact Number:
//             <input name="contact_number" value={formData.contact_number || ''} onChange={handleInputChange} />
//           </label>
//           <br />
//           <label>
//             District:
//             <select name="district_id" value={formData.district_id || ''} onChange={handleInputChange}>
//               <option value="">Select a district</option>
//               {districts.map((d) => (
//                 <option key={d.district_id} value={d.district_id}>
//                   {d.district_name}
//                 </option>
//               ))}
//             </select>
//           </label>
//           <br />
//           <label>
//             Latitude:
//             <input type="number" name="latitude" value={formData.latitude ?? ''} onChange={handleInputChange} />
//           </label>
//           <br />
//           <label>
//             Longitude:
//             <input type="number" name="longitude" value={formData.longitude ?? ''} onChange={handleInputChange} />
//           </label>
//           <br />
//           <button onClick={saveProfile}>Save</button>
//           <button onClick={() => setEditing(false)}>Cancel</button>
//         </div>
//       )}

//       <h2>Change Password</h2>
//       <label>
//         Old Password:
//         <input
//           type="password"
//           value={changePass.old}
//           onChange={(e) => setChangePass({ ...changePass, old: e.target.value })}
//         />
//       </label>
//       <br />
//       <label>
//         New Password:
//         <input
//           type="password"
//           value={changePass.newPass}
//           onChange={(e) => setChangePass({ ...changePass, newPass: e.target.value })}
//         />
//       </label>
//       <br />
//       <label>
//         Confirm New Password:
//         <input
//           type="password"
//           value={changePass.confirm}
//           onChange={(e) => setChangePass({ ...changePass, confirm: e.target.value })}
//         />
//       </label>
//       <br />
//       <button onClick={handleChangePassword}>Change Password</button>
//     </div>
//   );
// };

// export default HospitalProfilePage;











// // ProfilePage.tsx
// import React, { useEffect, useState } from 'react';
// import { 
//   User, 
//   Building, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Edit2, 
//   Save, 
//   X, 
//   AlertCircle, 
//   CheckCircle,
//   Lock,
//   RefreshCw,
//   Hospital
// } from 'lucide-react';

// // Configure API base URL
// const API_BASE_URL = 'http://localhost:9090';

// // Define interfaces
// interface HospitalProfile {
//   email: string;
//   full_name: string;
//   hospital_id: number;
//   status: string;
//   hospital_type: string | null;
//   hospital_address: string | null;
//   contact_number: string | null;
//   district_id: number;
// }

// interface District {
//   district_id: number;
//   district_name: string;
// }

// interface ChangePasswordForm {
//   old: string;
//   newPass: string;
//   confirm: string;
// }

// // New HospitalUpdate interface to match backend
// interface HospitalUpdate {
//   hospital_name?: string;
//   hospital_type?: string;
//   hospital_address?: string;
//   contact_number?: string;
//   district_id?: number;
//   latitude?: number;
//   longitude?: number;
// }

// interface AuthStatus {
//   isAuthenticated: boolean;
//   userInfo: {
//     email?: string;
//     hospital_id?: number;
//     role?: string;
//   };
// }

// const HospitalProfilePage: React.FC = () => {
//   const [profile, setProfile] = useState<HospitalProfile | null>(null);
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [editing, setEditing] = useState(false);
//   const [formData, setFormData] = useState<Partial<HospitalProfile>>({});
//   const [changePass, setChangePass] = useState<ChangePasswordForm>({ old: '', newPass: '', confirm: '' });
//   const [authStatus, setAuthStatus] = useState<AuthStatus>({
//     isAuthenticated: false,
//     userInfo: {},
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [showPasswordForm, setShowPasswordForm] = useState(false);

//   // Auto-clear messages
//   useEffect(() => {
//     if (success) {
//       const timer = setTimeout(() => setSuccess(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [success]);

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => setError(null), 8000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   // Check authentication status
//   const checkAuth = async () => {
//     try {
//       setError(null);
//       const res = await fetch(`${API_BASE_URL}/hospital/profiles`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         if (data.status === "success") {
//           setAuthStatus({
//             isAuthenticated: true,
//             userInfo: data.data,
//           });
//           return data.data; // Return profile data
//         }
//       }
//       setAuthStatus({ isAuthenticated: false, userInfo: {} });
//       setError("Authentication required. Please login first.");
//       return null;
//     } catch (error) {
//       console.error("Auth check failed:", error);
//       setAuthStatus({ isAuthenticated: false, userInfo: {} });
//       setError("Failed to verify authentication. Please check your connection.");
//       return null;
//     }
//   };

//   const fetchDistricts = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/hospital/districts`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!res.ok) {
//         if (res.status === 401) {
//           setError("Authentication failed. Please login again.");
//           setAuthStatus({ isAuthenticated: false, userInfo: {} });
//           return;
//         }
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json();
//       if (data.status === 'success') {
//         setDistricts(data.data);
//       } else {
//         setError(data.message || 'Failed to fetch districts');
//       }
//     } catch (err) {
//       console.error('Error fetching districts:', err);
//       setError('Failed to fetch districts');
//     }
//   };

//   // Initialize component
//   useEffect(() => {
//     const initializeComponent = async () => {
//       setLoading(true);
//       const profileData = await checkAuth();
//       if (profileData) {
//         setProfile(profileData);
//         setFormData(profileData);
//         await fetchDistricts();
//       }
//       setLoading(false);
//     };
//     initializeComponent();
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === 'district_id' || name === 'latitude' || name === 'longitude' ? Number(value) : value,
//     }));
//   };

//   const saveProfile = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const updatePayload: HospitalUpdate = {
//         hospital_name: formData.full_name,
//         hospital_type: formData.hospital_type ?? undefined,
//         hospital_address: formData.hospital_address ?? undefined,
//         contact_number: formData.contact_number ?? undefined,
//         district_id: formData.district_id,
     
//       };
      
//       const res = await fetch(`${API_BASE_URL}/hospital/profile`, {
//         method: "PUT",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatePayload),
//       });

//       if (!res.ok) {
//         if (res.status === 401) {
//           setError("Authentication failed. Please login again.");
//           setAuthStatus({ isAuthenticated: false, userInfo: {} });
//           return;
//         }
//         const errorData = await res.json().catch(() => null);
//         throw new Error(errorData?.message || `HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json();
//       if (data.status === 'success') {
//         setProfile({ ...profile!, ...formData });
//         setEditing(false);
//         setSuccess(data.message || 'Profile updated successfully');
//       } else {
//         setError(data.message || 'Failed to update profile');
//       }
//     } catch (err) {
//       console.error('Error updating profile:', err);
//       setError('Failed to update profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChangePassword = async () => {
//     if (changePass.newPass !== changePass.confirm) {
//       setError('New passwords do not match');
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await fetch(`${API_BASE_URL}/hospital/changePassword`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           old_password: changePass.old,
//           new_password: changePass.newPass,
//         }),
//       });

//       if (!res.ok) {
//         if (res.status === 401) {
//           setError("Authentication failed. Please login again.");
//           setAuthStatus({ isAuthenticated: false, userInfo: {} });
//           return;
//         }
//         const errorData = await res.json().catch(() => null);
//         throw new Error(errorData?.message || `HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json();
//       if (data.status === 'success') {
//         setSuccess(data.message || 'Password changed successfully');
//         setChangePass({ old: '', newPass: '', confirm: '' });
//         setShowPasswordForm(false);
//       } else {
//         setError(data.message || 'Failed to change password');
//       }
//     } catch (err) {
//       console.error('Error changing password:', err);
//       setError('Failed to change password');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Loading state
//   if (loading && !authStatus.isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
//         <div className="text-center bg-white p-8 rounded-2xl shadow-2xl border border-blue-100">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto"></div>
//             <Hospital className="h-6 w-6 text-blue-500 absolute top-5 left-1/2 transform -translate-x-1/2" />
//           </div>
//           <h3 className="mt-6 text-xl font-semibold text-gray-800">Loading Profile</h3>
//           <p className="mt-2 text-gray-600">Please wait while we fetch your data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Authentication required state
//   if (!authStatus.isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
//         <div className="text-center bg-white p-8 rounded-2xl shadow-2xl border border-blue-100 max-w-md w-full">
//           <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <AlertCircle className="h-8 w-8 text-blue-600" />
//           </div>
//           <h2 className="text-2xl font-bold mb-2 text-gray-800">
//             Authentication Required
//           </h2>
//           <p className="text-gray-600 mb-6">
//             Please login to access your hospital profile.
//           </p>
//           <button 
//             onClick={() => window.location.href = '/login'}
//             className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
//           >
//             Login to Continue
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
//         <div className="text-center bg-white p-8 rounded-2xl shadow-2xl border border-blue-100">
//           <Hospital className="h-12 w-12 text-blue-500 mx-auto mb-4" />
//           <p className="text-gray-600">Loading profile data...</p>
//         </div>
//       </div>
//     );
//   }

//   const currentDistrictName = districts.find((d) => d.district_id === profile.district_id)?.district_name || 'Unknown';

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
//                 <Hospital className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-800">Hospital Profile</h1>
//                 <p className="text-gray-600">Manage your hospital information and settings</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <button 
//                 onClick={() => window.location.reload()}
//                 className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
//                 disabled={loading}
//               >
//                 <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Profile Information */}
//           <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                 <User className="h-5 w-5 mr-2 text-blue-600" />
//                 Profile Information
//               </h2>
//               {!editing && (
//                 <button
//                   onClick={() => {
//                     setEditing(true);
//                     setError(null);
//                   }}
//                   className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                   disabled={loading}
//                 >
//                   <Edit2 className="h-4 w-4" />
//                   Edit Profile
//                 </button>
//               )}
//             </div>

//             {!editing ? (
//               <div className="space-y-4">
//                 <div className="p-4 bg-gray-50 rounded-lg">
//                   <label className="text-sm font-semibold text-gray-600 flex items-center mb-1">
//                     <Building className="h-4 w-4 mr-2" />
//                     Hospital Name
//                   </label>
//                   <p className="text-gray-800 font-medium">{profile.full_name}</p>
//                 </div>

//                 <div className="p-4 bg-gray-50 rounded-lg">
//                   <label className="text-sm font-semibold text-gray-600 flex items-center mb-1">
//                     <Mail className="h-4 w-4 mr-2" />
//                     Email
//                   </label>
//                   <p className="text-gray-800 font-medium">{profile.email}</p>
//                 </div>

//                 <div className="p-4 bg-gray-50 rounded-lg">
//                   <label className="text-sm font-semibold text-gray-600 mb-1">Hospital Type</label>
//                   <p className="text-gray-800 font-medium">{profile.hospital_type || 'N/A'}</p>
//                 </div>

//                 <div className="p-4 bg-gray-50 rounded-lg">
//                   <label className="text-sm font-semibold text-gray-600 flex items-center mb-1">
//                     <MapPin className="h-4 w-4 mr-2" />
//                     Address
//                   </label>
//                   <p className="text-gray-800 font-medium">{profile.hospital_address || 'N/A'}</p>
//                 </div>

//                 <div className="p-4 bg-gray-50 rounded-lg">
//                   <label className="text-sm font-semibold text-gray-600 flex items-center mb-1">
//                     <Phone className="h-4 w-4 mr-2" />
//                     Contact Number
//                   </label>
//                   <p className="text-gray-800 font-medium">{profile.contact_number || 'N/A'}</p>
//                 </div>

//                 <div className="p-4 bg-gray-50 rounded-lg">
//                   <label className="text-sm font-semibold text-gray-600 mb-1">District</label>
//                   <p className="text-gray-800 font-medium">{currentDistrictName}</p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">

//                   <div className="p-4 bg-green-50 rounded-lg border border-green-200">
//                     <label className="text-sm font-semibold text-green-600 mb-1">Status</label>
//                     <p className="text-green-800 font-medium capitalize">{profile.status}</p>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//                   <label className="block text-sm font-semibold text-blue-700 mb-2">Hospital Name *</label>
//                   <input
//                     name="full_name"
//                     value={formData.full_name || ''}
//                     onChange={handleInputChange}
//                     className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     disabled={loading}
//                   />
//                 </div>

//                 <div className="p-4 bg-gray-50 rounded-lg">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital Type</label>
//                   <input
//                     name="hospital_type"
//                     value={formData.hospital_type || ''}
//                     onChange={handleInputChange}
//                     className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     disabled={loading}
//                   />
//                 </div>

//                 <div className="p-4 bg-gray-50 rounded-lg">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
//                   <input
//                     name="hospital_address"
//                     value={formData.hospital_address || ''}
//                     onChange={handleInputChange}
//                     className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     disabled={loading}
//                   />
//                 </div>

//                 <div className="p-4 bg-gray-50 rounded-lg">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
//                   <input
//                     name="contact_number"
//                     value={formData.contact_number || ''}
//                     onChange={handleInputChange}
//                     className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     disabled={loading}
//                   />
//                 </div>

//                 <div className="p-4 bg-gray-50 rounded-lg">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">District</label>
//                   <select
//                     name="district_id"
//                     value={formData.district_id || ''}
//                     onChange={handleInputChange}
//                     className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     disabled={loading}
//                   >
//                     <option value="">Select a district</option>
//                     {districts.map((d) => (
//                       <option key={d.district_id} value={d.district_id}>
//                         {d.district_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>


//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={saveProfile}
//                     className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
//                     disabled={loading}
//                   >
//                     <Save className="h-4 w-4" />
//                     {loading ? 'Saving...' : 'Save Changes'}
//                   </button>
//                   <button
//                     onClick={() => {
//                       setEditing(false);
//                       setFormData(profile);
//                       setError(null);
//                     }}
//                     className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
//                     disabled={loading}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Change Password */}
//           <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                 <Lock className="h-5 w-5 mr-2 text-red-600" />
//                 Change Password
//               </h2>
//               {!showPasswordForm && (
//                 <button
//                   onClick={() => {
//                     setShowPasswordForm(true);
//                     setError(null);
//                   }}
//                   className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
//                   disabled={loading}
//                 >
//                   <Edit2 className="h-4 w-4" />
//                   Change Password
//                 </button>
//               )}
//             </div>

//             {!showPasswordForm ? (
//               <div className="text-center py-8">
//                 <Lock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500">Click "Change Password" to update your password</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div className="p-4 bg-red-50 rounded-lg border border-red-200">
//                   <label className="block text-sm font-semibold text-red-700 mb-2">Current Password *</label>
//                   <input
//                     type="password"
//                     value={changePass.old}
//                     onChange={(e) => setChangePass({ ...changePass, old: e.target.value })}
//                     className="w-full border-2 border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                     disabled={loading}
//                   />
//                 </div>

//                 <div className="p-4 bg-gray-50 rounded-lg">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">New Password *</label>
//                   <input
//                     type="password"
//                     value={changePass.newPass}
//                     onChange={(e) => setChangePass({ ...changePass, newPass: e.target.value })}
//                     className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                     disabled={loading}
//                   />
//                 </div>

//                 <div className="p-4 bg-gray-50 rounded-lg">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password *</label>
//                   <input
//                     type="password"
//                     value={changePass.confirm}
//                     onChange={(e) => setChangePass({ ...changePass, confirm: e.target.value })}
//                     className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                     disabled={loading}
//                   />
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={handleChangePassword}
//                     className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
//                     disabled={loading}
//                   >
//                     <Lock className="h-4 w-4" />
//                     {loading ? 'Updating...' : 'Update Password'}
//                   </button>
//                   <button
//                     onClick={() => {
//                       setShowPasswordForm(false);
//                       setChangePass({ old: '', newPass: '', confirm: '' });
//                       setError(null);
//                     }}
//                     className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
//                     disabled={loading}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Loading Overlay */}
//         {loading && authStatus.isAuthenticated && (
//           <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
//             <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200">
//               <div className="flex items-center space-x-3">
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//                 <span className="text-gray-800 font-medium">Processing...</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Error Toast */}
//         {error && (
//           <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <AlertCircle className="h-5 w-5" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm">{error}</p>
//               </div>
//               <div className="ml-auto pl-3">
//                 <div className="-mx-1.5 -my-1.5">
//                   <button
//                     onClick={() => setError(null)}
//                     className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-200 focus:outline-none"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Success Toast */}
//         {success && (
//           <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <CheckCircle className="h-5 w-5" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm">{success}</p>
//               </div>
//               <div className="ml-auto pl-3">
//                 <div className="-mx-1.5 -my-1.5">
//                   <button
//                     onClick={() => setSuccess(null)}
//                     className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-200 focus:outline-none"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HospitalProfilePage;






// ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Save, 
  X, 
  AlertCircle, 
  CheckCircle,
  Lock,
  RefreshCw,
  Hospital
} from 'lucide-react';

// Configure API base URL
const API_BASE_URL = 'http://localhost:9090';

// Define interfaces
interface HospitalProfile {
  email: string;
  full_name: string;
  hospital_id: number;
  status: string;
  hospital_type: string | null;
  hospital_address: string | null;
  contact_number: string | null;
  district_id: number;
  latitude?: number;
  longitude?: number;
}

interface District {
  district_id: number;
  district_name: string;
}

interface ChangePasswordForm {
  old: string;
  newPass: string;
  confirm: string;
}

// Fixed HospitalUpdate interface to match what backend expects
interface HospitalUpdate {
  hospital_name: string;
  hospital_type?: string | null;
  hospital_address?: string | null;
  contact_number?: string | null;
  district_id?: number;
  latitude?: number;
  longitude?: number;
}

interface AuthStatus {
  isAuthenticated: boolean;
  userInfo: {
    email?: string;
    hospital_id?: number;
    role?: string;
  };
}

const HospitalProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<HospitalProfile | null>(null);
  const [districts, setDistricts] = useState<District[]>([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<HospitalProfile>>({});
  const [changePass, setChangePass] = useState<ChangePasswordForm>({ old: '', newPass: '', confirm: '' });
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    userInfo: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Auto-clear messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Check authentication status
  const checkAuth = async () => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/hospital/profiles`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === "success") {
          setAuthStatus({
            isAuthenticated: true,
            userInfo: data.data,
          });
          return data.data; // Return profile data
        }
      }
      setAuthStatus({ isAuthenticated: false, userInfo: {} });
      setError("Authentication required. Please login first.");
      return null;
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthStatus({ isAuthenticated: false, userInfo: {} });
      setError("Failed to verify authentication. Please check your connection.");
      return null;
    }
  };

  const fetchDistricts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/hospital/districts`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Authentication failed. Please login again.");
          setAuthStatus({ isAuthenticated: false, userInfo: {} });
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.status === 'success') {
        setDistricts(data.data);
      } else {
        setError(data.message || 'Failed to fetch districts');
      }
    } catch (err) {
      console.error('Error fetching districts:', err);
      setError('Failed to fetch districts');
    }
  };

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      setLoading(true);
      const profileData = await checkAuth();
      if (profileData) {
        setProfile(profileData);
        setFormData(profileData);
        await fetchDistricts();
      }
      setLoading(false);
    };
    initializeComponent();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'district_id' || name === 'latitude' || name === 'longitude' ? Number(value) : value,
    }));
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fixed: Map frontend form data to backend expected format
      const updatePayload: HospitalUpdate = {
        hospital_name: formData.full_name || profile?.full_name || '',
        hospital_type: formData.hospital_type || null,
        hospital_address: formData.hospital_address || null,
        contact_number: formData.contact_number || null,
        district_id: formData.district_id || profile?.district_id,
        latitude: formData.latitude || profile?.latitude,
        longitude: formData.longitude || profile?.longitude,
      };
      
      console.log('Sending update payload:', updatePayload); // Debug log
      
      const res = await fetch(`${API_BASE_URL}/hospital/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Authentication failed. Please login again.");
          setAuthStatus({ isAuthenticated: false, userInfo: {} });
          return;
        }
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.status === 'success') {
        // Update local profile state with the new data
        const updatedProfile: HospitalProfile = { 
          ...profile!, 
          full_name: updatePayload.hospital_name,
          hospital_type: updatePayload.hospital_type ?? null,
          hospital_address: updatePayload.hospital_address ?? null,
          contact_number: updatePayload.contact_number ?? null,
          district_id: updatePayload.district_id !,
        };
        setProfile(updatedProfile);
        setFormData(updatedProfile);
        setEditing(false);
        setSuccess(data.message || 'Profile updated successfully');
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (changePass.newPass !== changePass.confirm) {
      setError('New passwords do not match');
      return;
    }
    
    if (changePass.newPass.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${API_BASE_URL}/hospital/changePassword`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_password: changePass.old,
          new_password: changePass.newPass,
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Authentication failed. Please login again.");
          setAuthStatus({ isAuthenticated: false, userInfo: {} });
          return;
        }
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.status === 'success') {
        setSuccess(data.message || 'Password changed successfully');
        setChangePass({ old: '', newPass: '', confirm: '' });
        setShowPasswordForm(false);
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && !authStatus.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl border border-blue-100">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto"></div>
            <Hospital className="h-6 w-6 text-blue-500 absolute top-5 left-1/2 transform -translate-x-1/2" />
          </div>
          <h3 className="mt-6 text-xl font-semibold text-gray-800">Loading Profile</h3>
          <p className="mt-2 text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  // Authentication required state
  if (!authStatus.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl border border-blue-100 max-w-md w-full">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please login to access your hospital profile.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl border border-blue-100">
          <Hospital className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  const currentDistrictName = districts.find((d) => d.district_id === profile.district_id)?.district_name || 'Unknown';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <Hospital className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Hospital Profile</h1>
                <p className="text-gray-600">Manage your hospital information and settings</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Profile Information
              </h2>
              {!editing && (
                <button
                  onClick={() => {
                    setEditing(true);
                    setError(null);
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </button>
              )}
            </div>

            {!editing ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="text-sm font-semibold text-gray-600 flex items-center mb-1">
                    <Building className="h-4 w-4 mr-2" />
                    Hospital Name
                  </label>
                  <p className="text-gray-800 font-medium">{profile.full_name}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="text-sm font-semibold text-gray-600 flex items-center mb-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </label>
                  <p className="text-gray-800 font-medium">{profile.email}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="text-sm font-semibold text-gray-600 mb-1">Hospital Type</label>
                  <p className="text-gray-800 font-medium">{profile.hospital_type || 'N/A'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="text-sm font-semibold text-gray-600 flex items-center mb-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    Address
                  </label>
                  <p className="text-gray-800 font-medium">{profile.hospital_address || 'N/A'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="text-sm font-semibold text-gray-600 flex items-center mb-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Number
                  </label>
                  <p className="text-gray-800 font-medium">{profile.contact_number || 'N/A'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="text-sm font-semibold text-gray-600 mb-1">District</label>
                  <p className="text-gray-800 font-medium">{currentDistrictName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <label className="text-sm font-semibold text-green-600 mb-1">Status</label>
                    <p className="text-green-800 font-medium capitalize">{profile.status}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <label className="block text-sm font-semibold text-blue-700 mb-2">Hospital Name *</label>
                  <input
                    name="full_name"
                    value={formData.full_name || ''}
                    onChange={handleInputChange}
                    className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={loading}
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital Type</label>
                  <input
                    name="hospital_type"
                    value={formData.hospital_type || ''}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={loading}
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <input
                    name="hospital_address"
                    value={formData.hospital_address || ''}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={loading}
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                  <input
                    name="contact_number"
                    value={formData.contact_number || ''}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={loading}
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">District</label>
                  <select
                    name="district_id"
                    value={formData.district_id || ''}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={loading}
                  >
                    <option value="">Select a district</option>
                    {districts.map((d) => (
                      <option key={d.district_id} value={d.district_id}>
                        {d.district_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={saveProfile}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <Save className="h-4 w-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setFormData(profile);
                      setError(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-red-600" />
                Change Password
              </h2>
              {!showPasswordForm && (
                <button
                  onClick={() => {
                    setShowPasswordForm(true);
                    setError(null);
                  }}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  disabled={loading}
                >
                  <Edit2 className="h-4 w-4" />
                  Change Password
                </button>
              )}
            </div>

            {!showPasswordForm ? (
              <div className="text-center py-8">
                <Lock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Click "Change Password" to update your password</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <label className="block text-sm font-semibold text-red-700 mb-2">Current Password *</label>
                  <input
                    type="password"
                    value={changePass.old}
                    onChange={(e) => setChangePass({ ...changePass, old: e.target.value })}
                    className="w-full border-2 border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    disabled={loading}
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password *</label>
                  <input
                    type="password"
                    value={changePass.newPass}
                    onChange={(e) => setChangePass({ ...changePass, newPass: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    disabled={loading}
                    minLength={6}
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password *</label>
                  <input
                    type="password"
                    value={changePass.confirm}
                    onChange={(e) => setChangePass({ ...changePass, confirm: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    disabled={loading}
                    minLength={6}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleChangePassword}
                    className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    disabled={loading || !changePass.old || !changePass.newPass || !changePass.confirm}
                  >
                    <Lock className="h-4 w-4" />
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordForm(false);
                      setChangePass({ old: '', newPass: '', confirm: '' });
                      setError(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && authStatus.isAuthenticated && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-800 font-medium">Processing...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Toast */}
        {error && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setError(null)}
                    className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-200 focus:outline-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {success && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm">{success}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setSuccess(null)}
                    className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-200 focus:outline-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalProfilePage;