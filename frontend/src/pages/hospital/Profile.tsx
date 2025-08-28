// import React, { useEffect, useState } from "react";
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
//   Hospital,
//   AlertTriangleIcon,
//   XCircleIcon,
// } from "lucide-react";

// // Configure API base URL
// const API_BASE_URL = "http://localhost:9090";

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
//   latitude?: number;
//   longitude?: number;
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

// interface HospitalUpdate {
//   hospital_name: string;
//   hospital_type?: string | null;
//   hospital_address?: string | null;
//   contact_number?: string | null;
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
//   const [changePass, setChangePass] = useState<ChangePasswordForm>({
//     old: "",
//     newPass: "",
//     confirm: "",
//   });
//   const [authStatus, setAuthStatus] = useState<AuthStatus>({
//     isAuthenticated: false,
//     userInfo: {},
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [showPasswordForm, setShowPasswordForm] = useState(false);
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//   const [confirmAction, setConfirmAction] = useState<{
//     type: string;
//     title: string;
//     message: string;
//     action: () => void;
//   } | null>(null);

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
//           return data.data;
//         }
//       }
//       setAuthStatus({ isAuthenticated: false, userInfo: {} });
//       setError("Authentication required. Please login first.");
//       return null;
//     } catch (error) {
//       console.error("Auth check failed:", error);
//       setAuthStatus({ isAuthenticated: false, userInfo: {} });
//       setError(
//         "Failed to verify authentication. Please check your connection."
//       );
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
//       if (data.status === "success") {
//         setDistricts(data.data);
//       } else {
//         setError(data.message || "Failed to fetch districts");
//       }
//     } catch (err) {
//       console.error("Error fetching districts:", err);
//       setError("Failed to fetch districts");
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

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         name === "district_id" || name === "latitude" || name === "longitude"
//           ? Number(value) || ""
//           : value,
//     }));
//   };

//   // Show confirmation modal
//   const showConfirmation = (
//     type: string,
//     title: string,
//     message: string,
//     action: () => void
//   ) => {
//     setConfirmAction({ type, title, message, action });
//     setIsConfirmModalOpen(true);
//   };

//   // Handle confirmation
//   const handleConfirm = () => {
//     if (confirmAction) {
//       confirmAction.action();
//     }
//     setIsConfirmModalOpen(false);
//     setConfirmAction(null);
//   };

//   const saveProfile = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const updatePayload: HospitalUpdate = {
//         hospital_name: formData.full_name || profile?.full_name || "",
//         hospital_type: formData.hospital_type || null,
//         hospital_address: formData.hospital_address || null,
//         contact_number: formData.contact_number || null,
//         district_id: formData.district_id || profile?.district_id,
//         latitude: formData.latitude || profile?.latitude,
//         longitude: formData.longitude || profile?.longitude,
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
//         throw new Error(
//           errorData?.message || `HTTP error! status: ${res.status}`
//         );
//       }

//       const data = await res.json();
//       showConfirmation(
//         "success",
//         "Profile Updated",
//         data.message || "Profile updated successfully",
//         () => {
//           const updatedProfile: HospitalProfile = {
//             ...profile!,
//             full_name: updatePayload.hospital_name,
//             hospital_type: updatePayload.hospital_type ?? null,
//             hospital_address: updatePayload.hospital_address ?? null,
//             contact_number: updatePayload.contact_number ?? null,
//             district_id: updatePayload.district_id!,
//             latitude: updatePayload.latitude,
//             longitude: updatePayload.longitude,
//           };
//           setProfile(updatedProfile);
//           setFormData(updatedProfile);
//           setEditing(false);
//         }
//       );
//     } catch (err) {
//       console.error("Error updating profile:", err);
//       showConfirmation(
//         "error",
//         "Update Failed",
//         err instanceof Error ? err.message : "Failed to update profile",
//         () => {}
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChangePassword = async () => {
//     if (changePass.newPass !== changePass.confirm) {
//       setError("New passwords do not match");
//       return;
//     }

//     if (changePass.newPass.length < 6) {
//       setError("New password must be at least 6 characters long");
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
//         throw new Error(
//           errorData?.message || `HTTP error! status: ${res.status}`
//         );
//       }

//       const data = await res.json();
//       showConfirmation(
//         "success",
//         "Password Changed",
//         data.message || "Password changed successfully",
//         () => {
//           setChangePass({ old: "", newPass: "", confirm: "" });
//           setShowPasswordForm(false);
//         }
//       );
//     } catch (err) {
//       console.error("Error changing password:", err);
//       showConfirmation(
//         "error",
//         "Password Change Failed",
//         err instanceof Error ? err.message : "Failed to change password",
//         () => {}
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Loading state
//   if (loading && !authStatus.isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6">
//         <div className="text-center bg-white p-10 rounded-2xl shadow-2xl border border-red-100">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-500 mx-auto"></div>
//             <Hospital className="h-6 w-6 text-red-500 absolute top-5 left-1/2 transform -translate-x-1/2" />
//           </div>
//           <h3 className="mt-6 text-xl font-semibold text-gray-800">
//             Loading Profile
//           </h3>
//           <p className="mt-2 text-gray-600">
//             Please wait while we fetch your data...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Authentication required state
//   if (!authStatus.isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6">
//         <div className="text-center bg-white p-10 rounded-2xl shadow-2xl border border-red-100 max-w-md w-full">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <AlertCircle className="h-8 w-8 text-red-600" />
//           </div>
//           <h2 className="text-2xl font-bold mb-2 text-gray-800">
//             Authentication Required
//           </h2>
//           <p className="text-gray-600 mb-6">
//             Please login to access your hospital profile.
//           </p>
//           <button
//             onClick={() => (window.location.href = "/login")}
//             className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
//           >
//             Login to Continue
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6">
//         <div className="text-center bg-white p-10 rounded-2xl shadow-2xl border border-red-100">
//           <Hospital className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <p className="text-gray-600">Loading profile data...</p>
//         </div>
//       </div>
//     );
//   }

//   const currentDistrictName =
//     districts.find((d) => d.district_id === profile.district_id)
//       ?.district_name || "Unknown";

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-red-100">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
//                 <Hospital className="h-8 w-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-4xl font-bold text-gray-800">
//                   Hospital Profile
//                 </h1>
//                 <p className="text-gray-600 mt-1">
//                   Manage your hospital information and settings
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => window.location.reload()}
//                 className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-3 rounded-lg hover:bg-red-100 transition-colors font-semibold"
//                 disabled={loading}
//               >
//                 <RefreshCw
//                   className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
//                 />
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-8">
//           {/* Profile Information */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 border border-red-100">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
//                 <User className="h-6 w-6 mr-3 text-red-600" />
//                 Profile Information
//               </h2>
//               {!editing && (
//                 <button
//                   onClick={() => {
//                     setEditing(true);
//                     setError(null);
//                   }}
//                   className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
//                   disabled={loading}
//                 >
//                   <Edit2 className="h-5 w-5" />
//                   Edit Profile
//                 </button>
//               )}
//             </div>

//             {!editing ? (
//               <div className="space-y-6">
//                 <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
//                   <label className="text-sm font-semibold text-gray-600 flex items-center mb-2">
//                     <Building className="h-5 w-5 mr-2 text-red-600" />
//                     Hospital Name
//                   </label>
//                   <p className="text-gray-800 font-medium text-lg">
//                     {profile.full_name}
//                   </p>
//                 </div>

//                 <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
//                   <label className="text-sm font-semibold text-gray-600 flex items-center mb-2">
//                     <Mail className="h-5 w-5 mr-2 text-red-600" />
//                     Email
//                   </label>
//                   <p className="text-gray-800 font-medium text-lg">
//                     {profile.email}
//                   </p>
//                 </div>

//                 <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
//                   <label className="text-sm font-semibold text-gray-600 mb-2">
//                     Hospital Type
//                   </label>
//                   <p className="text-gray-800 font-medium text-lg">
//                     {profile.hospital_type || "N/A"}
//                   </p>
//                 </div>

//                 <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
//                   <label className="text-sm font-semibold text-gray-600 flex items-center mb-2">
//                     <MapPin className="h-5 w-5 mr-2 text-red-600" />
//                     Address
//                   </label>
//                   <p className="text-gray-800 font-medium text-lg">
//                     {profile.hospital_address || "N/A"}
//                   </p>
//                 </div>

//                 <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
//                   <label className="text-sm font-semibold text-gray-600 flex items-center mb-2">
//                     <Phone className="h-5 w-5 mr-2 text-red-600" />
//                     Contact Number
//                   </label>
//                   <p className="text-gray-800 font-medium text-lg">
//                     {profile.contact_number || "N/A"}
//                   </p>
//                 </div>

//                 <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
//                   <label className="text-sm font-semibold text-gray-600 mb-2">
//                     District
//                   </label>
//                   <p className="text-gray-800 font-medium text-lg">
//                     {currentDistrictName}
//                   </p>
//                 </div>

//                 <div className="p-5 bg-green-50 rounded-xl border border-green-200">
//                   <label className="text-sm font-semibold text-green-600 mb-2">
//                     Status
//                   </label>
//                   <p className="text-green-800 font-medium text-lg capitalize">
//                     {profile.status}
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 <div className="p-5 bg-red-50 rounded-xl border border-red-200">
//                   <label className="block text-sm font-semibold text-red-700 mb-2">
//                     Hospital Name *
//                   </label>
//                   <input
//                     name="full_name"
//                     value={formData.full_name || ""}
//                     onChange={handleInputChange}
//                     className="w-full border-2 border-red-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                     disabled={loading}
//                   />
//                 </div>

//                 <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Hospital Type
//                   </label>
//                   <input
//                     name="hospital_type"
//                     value={formData.hospital_type || ""}
//                     onChange={handleInputChange}
//                     className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                     disabled={loading}
//                   />
//                 </div>

//                 <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Address
//                   </label>
//                   <input
//                     name="hospital_address"
//                     value={formData.hospital_address || ""}
//                     onChange={handleInputChange}
//                     className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                     disabled={loading}
//                   />
//                 </div>

//                 <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Contact Number
//                   </label>
//                   <input
//                     name="contact_number"
//                     value={formData.contact_number || ""}
//                     onChange={handleInputChange}
//                     className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                     disabled={loading}
//                   />
//                 </div>

//                 <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     District
//                   </label>
//                   <select
//                     name="district_id"
//                     value={formData.district_id || ""}
//                     onChange={handleInputChange}
//                     className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
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

//                 <div className="flex gap-4 pt-4">
//                   <button
//                     onClick={() =>
//                       showConfirmation(
//                         "warning",
//                         "Confirm Profile Update",
//                         "Are you sure you want to save these changes to your profile?",
//                         saveProfile
//                       )
//                     }
//                     className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2 shadow-md"
//                     disabled={loading}
//                   >
//                     <Save className="h-5 w-5" />
//                     {loading ? "Saving..." : "Save Changes"}
//                   </button>
//                   <button
//                     onClick={() => {
//                       setEditing(false);
//                       setFormData(profile);
//                       setError(null);
//                     }}
//                     className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors font-semibold shadow-md"
//                     disabled={loading}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Change Password */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 border border-red-100">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
//                 <Lock className="h-6 w-6 mr-3 text-red-600" />
//                 Change Password
//               </h2>
//               {!showPasswordForm && (
//                 <button
//                   onClick={() => {
//                     setShowPasswordForm(true);
//                     setError(null);
//                   }}
//                   className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-xl hover:bg-red-700 transition-colors font-semibold shadow-md"
//                   disabled={loading}
//                 >
//                   <Edit2 className="h-5 w-5" />
//                   Change Password
//                 </button>
//               )}
//             </div>

//             {!showPasswordForm ? (
//               <div className="text-center py-12">
//                 <Lock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500 text-lg">
//                   Click "Change Password" to update your password
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 <div className="p-5 bg-red-50 rounded-xl border border-red-200">
//                   <label className="block text-sm font-semibold text-red-700 mb-2">
//                     Current Password *
//                   </label>
//                   <input
//                     type="password"
//                     value={changePass.old}
//                     onChange={(e) =>
//                       setChangePass({ ...changePass, old: e.target.value })
//                     }
//                     className="w-full border-2 border-red-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                     disabled={loading}
//                   />
//                 </div>

//                 <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     New Password *
//                   </label>
//                   <input
//                     type="password"
//                     value={changePass.newPass}
//                     onChange={(e) =>
//                       setChangePass({ ...changePass, newPass: e.target.value })
//                     }
//                     className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                     disabled={loading}
//                     minLength={6}
//                   />
//                 </div>

//                 <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Confirm New Password *
//                   </label>
//                   <input
//                     type="password"
//                     value={changePass.confirm}
//                     onChange={(e) =>
//                       setChangePass({ ...changePass, confirm: e.target.value })
//                     }
//                     className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                     disabled={loading}
//                     minLength={6}
//                   />
//                 </div>

//                 <div className="flex gap-4 pt-4">
//                   <button
//                     onClick={() =>
//                       showConfirmation(
//                         "warning",
//                         "Confirm Password Change",
//                         "Are you sure you want to change your password?",
//                         handleChangePassword
//                       )
//                     }
//                     className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2 shadow-md"
//                     disabled={
//                       loading ||
//                       !changePass.old ||
//                       !changePass.newPass ||
//                       !changePass.confirm
//                     }
//                   >
//                     <Lock className="h-5 w-5" />
//                     {loading ? "Updating..." : "Update Password"}
//                   </button>
//                   <button
//                     onClick={() => {
//                       setShowPasswordForm(false);
//                       setChangePass({ old: "", newPass: "", confirm: "" });
//                       setError(null);
//                     }}
//                     className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors font-semibold shadow-md"
//                     disabled={loading}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Confirmation Modal */}
//         {isConfirmModalOpen && confirmAction && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
//             <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200">
//               <div className="text-center">
//                 <div className="mb-6">
//                   {confirmAction.type === "success" && (
//                     <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
//                       <CheckCircle className="h-8 w-8 text-green-600" />
//                     </div>
//                   )}
//                   {confirmAction.type === "warning" && (
//                     <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
//                       <AlertTriangleIcon className="h-8 w-8 text-yellow-600" />
//                     </div>
//                   )}
//                   {confirmAction.type === "error" && (
//                     <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
//                       <XCircleIcon className="h-8 w-8 text-red-600" />
//                     </div>
//                   )}
//                 </div>

//                 <h3 className="text-xl font-semibold text-gray-800 mb-3">
//                   {confirmAction.title}
//                 </h3>

//                 <p className="text-gray-600 mb-6">{confirmAction.message}</p>

//                 <div className="flex space-x-4">
//                   <button
//                     onClick={() => {
//                       setIsConfirmModalOpen(false);
//                       setConfirmAction(null);
//                     }}
//                     className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors font-semibold shadow-md"
//                     disabled={loading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleConfirm}
//                     className={`flex-1 py-3 px-6 rounded-xl transition-colors font-semibold shadow-md ${
//                       confirmAction.type === "success"
//                         ? "bg-green-600 text-white hover:bg-green-700"
//                         : confirmAction.type === "warning"
//                         ? "bg-yellow-600 text-white hover:bg-yellow-700"
//                         : "bg-red-600 text-white hover:bg-red-700"
//                     }`}
//                     disabled={loading}
//                   >
//                     {loading ? "Processing..." : "Confirm"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Loading Overlay */}
//         {loading && authStatus.isAuthenticated && (
//           <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
//             <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
//               <div className="flex items-center space-x-3">
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
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

import React, { useEffect, useState, useRef } from "react";
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
  Hospital,
  AlertTriangleIcon,
  XCircleIcon,
} from "lucide-react";
import L, { type LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

// Configure API base URL
const API_BASE_URL = "http://localhost:9090";

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
  const [changePass, setChangePass] = useState<ChangePasswordForm>({
    old: "",
    newPass: "",
    confirm: "",
  });
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    userInfo: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: string;
    title: string;
    message: string;
    action: () => void;
  } | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

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

  // Initialize Leaflet map when editing
  useEffect(() => {
    if (editing && !mapInitialized && mapContainerRef.current) {
      const defaultLocation: LatLngTuple = [
        profile?.latitude || 6.9271,
        profile?.longitude || 79.8612,
      ]; // Default to Colombo, Sri Lanka
      mapRef.current = L.map(mapContainerRef.current).setView(
        defaultLocation,
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // Add marker at default or profile location
      markerRef.current = L.marker(defaultLocation).addTo(mapRef.current);

      // Update formData with marker position on drag
      markerRef.current.on("dragend", () => {
        const position = markerRef.current?.getLatLng();
        if (position) {
          setFormData((prev) => ({
            ...prev,
            latitude: Number(position.lat.toFixed(6)),
            longitude: Number(position.lng.toFixed(6)),
          }));
          fetchAddress(position.lat, position.lng);
        }
      });

      // Make marker draggable
      markerRef.current.dragging?.enable();

      // Update map on click
      mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
          setFormData((prev) => ({
            ...prev,
            latitude: Number(lat.toFixed(6)),
            longitude: Number(lng.toFixed(6)),
          }));
          fetchAddress(lat, lng);
        }
      });

      setMapInitialized(true);
    }

    // Cleanup map on component unmount or editing toggle
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMapInitialized(false);
      }
    };
  }, [editing, mapInitialized, profile]);

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
          return data.data;
        }
      }
      setAuthStatus({ isAuthenticated: false, userInfo: {} });
      setError("Authentication required. Please login first.");
      return null;
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthStatus({ isAuthenticated: false, userInfo: {} });
      setError(
        "Failed to verify authentication. Please check your connection."
      );
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
      if (data.status === "success") {
        setDistricts(data.data);
      } else {
        setError(data.message || "Failed to fetch districts");
      }
    } catch (err) {
      console.error("Error fetching districts:", err);
      setError("Failed to fetch districts");
    }
  };

  // Fetch address using Nominatim API
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data.display_name) {
        setFormData((prev) => ({
          ...prev,
          hospital_address: data.display_name,
        }));
      } else {
        setError("Unable to fetch address for selected location");
      }
    } catch (err) {
      console.error("Error fetching address:", err);
      setError("Failed to fetch address");
    }
  };

  // Get live location using browser geolocation
  const getLiveLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            latitude: Number(latitude.toFixed(6)),
            longitude: Number(longitude.toFixed(6)),
          }));
          if (mapRef.current && markerRef.current) {
            mapRef.current.setView([latitude, longitude], 13);
            markerRef.current.setLatLng([latitude, longitude]);
          }
          fetchAddress(latitude, longitude);
          setLoading(false);
        },
        (err) => {
          setError("Failed to get live location: " + err.message);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "district_id" || name === "latitude" || name === "longitude"
          ? Number(value) || ""
          : value,
    }));
  };

  // Show confirmation modal
  const showConfirmation = (
    type: string,
    title: string,
    message: string,
    action: () => void
  ) => {
    setConfirmAction({ type, title, message, action });
    setIsConfirmModalOpen(true);
  };

  // Handle confirmation
  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction.action();
    }
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const updatePayload: HospitalUpdate = {
        hospital_name: formData.full_name || profile?.full_name || "",
        hospital_type: formData.hospital_type || null,
        hospital_address: formData.hospital_address || null,
        contact_number: formData.contact_number || null,
        district_id: formData.district_id || profile?.district_id,
        latitude: formData.latitude || profile?.latitude,
        longitude: formData.longitude || profile?.longitude,
      };

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
        throw new Error(
          errorData?.message || `HTTP error! status: ${res.status}`
        );
      }

      const data = await res.json();
      showConfirmation(
        "success",
        "Profile Updated",
        data.message || "Profile updated successfully",
        () => {
          const updatedProfile: HospitalProfile = {
            ...profile!,
            full_name: updatePayload.hospital_name,
            hospital_type: updatePayload.hospital_type ?? null,
            hospital_address: updatePayload.hospital_address ?? null,
            contact_number: updatePayload.contact_number ?? null,
            district_id: updatePayload.district_id!,
            latitude: updatePayload.latitude,
            longitude: updatePayload.longitude,
          };
          setProfile(updatedProfile);
          setFormData(updatedProfile);
          setEditing(false);
        }
      );
    } catch (err) {
      console.error("Error updating profile:", err);
      showConfirmation(
        "error",
        "Update Failed",
        err instanceof Error ? err.message : "Failed to update profile",
        () => {}
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (changePass.newPass !== changePass.confirm) {
      setError("New passwords do not match");
      return;
    }

    if (changePass.newPass.length < 6) {
      setError("New password must be at least 6 characters long");
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
        throw new Error(
          errorData?.message || `HTTP error! status: ${res.status}`
        );
      }

      const data = await res.json();
      showConfirmation(
        "success",
        "Password Changed",
        data.message || "Password changed successfully",
        () => {
          setChangePass({ old: "", newPass: "", confirm: "" });
          setShowPasswordForm(false);
        }
      );
    } catch (err) {
      console.error("Error changing password:", err);
      showConfirmation(
        "error",
        "Password Change Failed",
        err instanceof Error ? err.message : "Failed to change password",
        () => {}
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && !authStatus.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6">
        <div className="text-center bg-white p-10 rounded-2xl shadow-2xl border border-red-100">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-500 mx-auto"></div>
            <Hospital className="h-6 w-6 text-red-500 absolute top-5 left-1/2 transform -translate-x-1/2" />
          </div>
          <h3 className="mt-6 text-xl font-semibold text-gray-800">
            Loading Profile
          </h3>
          <p className="mt-2 text-gray-600">
            Please wait while we fetch your data...
          </p>
        </div>
      </div>
    );
  }

  // Authentication required state
  if (!authStatus.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6">
        <div className="text-center bg-white p-10 rounded-2xl shadow-2xl border border-red-100 max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please login to access your hospital profile.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6">
        <div className="text-center bg-white p-10 rounded-2xl shadow-2xl border border-red-100">
          <Hospital className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  const currentDistrictName =
    districts.find((d) => d.district_id === profile.district_id)
      ?.district_name || "Unknown";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-red-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                <Hospital className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">
                  Hospital Profile
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your hospital information and settings
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-3 rounded-lg hover:bg-red-100 transition-colors font-semibold"
                disabled={loading}
              >
                <RefreshCw
                  className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Profile Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-red-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <User className="h-6 w-6 mr-3 text-red-600" />
                Profile Information
              </h2>
              {!editing && (
                <button
                  onClick={() => {
                    setEditing(true);
                    setError(null);
                  }}
                  className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  disabled={loading}
                >
                  <Edit2 className="h-5 w-5" />
                  Edit Profile
                </button>
              )}
            </div>

            {!editing ? (
              <div className="space-y-6">
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="text-sm font-semibold text-gray-600 flex items-center mb-2">
                    <Building className="h-5 w-5 mr-2 text-red-600" />
                    Hospital Name
                  </label>
                  <p className="text-gray-800 font-medium text-lg">
                    {profile.full_name}
                  </p>
                </div>

                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="text-sm font-semibold text-gray-600 flex items-center mb-2">
                    <Mail className="h-5 w-5 mr-2 text-red-600" />
                    Email
                  </label>
                  <p className="text-gray-800 font-medium text-lg">
                    {profile.email}
                  </p>
                </div>

                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="text-sm font-semibold text-gray-600 mb-2">
                    Hospital Type
                  </label>
                  <p className="text-gray-800 font-medium text-lg">
                    {profile.hospital_type || "N/A"}
                  </p>
                </div>

                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="text-sm font-semibold text-gray-600 flex items-center mb-2">
                    <MapPin className="h-5 w-5 mr-2 text-red-600" />
                    Address
                  </label>
                  <p className="text-gray-800 font-medium text-lg">
                    {profile.hospital_address || "N/A"}
                  </p>
                </div>

                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="text-sm font-semibold text-gray-600 flex items-center mb-2">
                    <Phone className="h-5 w-5 mr-2 text-red-600" />
                    Contact Number
                  </label>
                  <p className="text-gray-800 font-medium text-lg">
                    {profile.contact_number || "N/A"}
                  </p>
                </div>

                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="text-sm font-semibold text-gray-600 mb-2">
                    District
                  </label>
                  <p className="text-gray-800 font-medium text-lg">
                    {currentDistrictName}
                  </p>
                </div>

                <div className="p-5 bg-green-50 rounded-xl border border-green-200">
                  <label className="text-sm font-semibold text-green-600 mb-2">
                    Status
                  </label>
                  <p className="text-green-800 font-medium text-lg capitalize">
                    {profile.status}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-5 bg-red-50 rounded-xl border border-red-200">
                  <label className="block text-sm font-semibold text-red-700 mb-2">
                    Hospital Name *
                  </label>
                  <input
                    name="full_name"
                    value={formData.full_name || ""}
                    onChange={handleInputChange}
                    className="w-full border-2 border-red-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    disabled={loading}
                  />
                </div>

                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hospital Type
                  </label>
                  <input
                    name="hospital_type"
                    value={formData.hospital_type || ""}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    disabled={loading}
                  />
                </div>

                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      name="hospital_address"
                      value={formData.hospital_address || ""}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      disabled={loading}
                    />
                    <button
                      onClick={getLiveLocation}
                      className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
                      disabled={loading}
                    >
                      <MapPin className="h-5 w-5" />
                      Get Live Location
                    </button>
                  </div>
                  <div
                    ref={mapContainerRef}
                    className="w-full h-96 rounded-xl border border-gray-200"
                  ></div>
                </div>

                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude || ""}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    disabled={loading}
                  />
                </div>

                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude || ""}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    disabled={loading}
                  />
                </div>

                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    District
                  </label>
                  <select
                    name="district_id"
                    value={formData.district_id || ""}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
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

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() =>
                      showConfirmation(
                        "warning",
                        "Confirm Profile Update",
                        "Are you sure you want to save these changes to your profile?",
                        saveProfile
                      )
                    }
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2 shadow-md"
                    disabled={loading}
                  >
                    <Save className="h-5 w-5" />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setFormData(profile);
                      setError(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors font-semibold shadow-md"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-red-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <Lock className="h-6 w-6 mr-3 text-red-600" />
                Change Password
              </h2>
              {!showPasswordForm && (
                <button
                  onClick={() => {
                    setShowPasswordForm(true);
                    setError(null);
                  }}
                  className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-xl hover:bg-red-700 transition-colors font-semibold shadow-md"
                  disabled={loading}
                >
                  <Edit2 className="h-5 w-5" />
                  Change Password
                </button>
              )}
            </div>

            {!showPasswordForm ? (
              <div className="text-center py-12">
                <Lock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Click "Change Password" to update your password
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-5 bg-red-50 rounded-xl border border-red-200">
                  <label className="block text-sm font-semibold text-red-700 mb-2">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    value={changePass.old}
                    onChange={(e) =>
                      setChangePass({ ...changePass, old: e.target.value })
                    }
                    className="w-full border-2 border-red-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    disabled={loading}
                  />
                </div>

                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password *
                  </label>
                  <input
                    type="password"
                    value={changePass.newPass}
                    onChange={(e) =>
                      setChangePass({ ...changePass, newPass: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    disabled={loading}
                    minLength={6}
                  />
                </div>

                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    value={changePass.confirm}
                    onChange={(e) =>
                      setChangePass({ ...changePass, confirm: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    disabled={loading}
                    minLength={6}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() =>
                      showConfirmation(
                        "warning",
                        "Confirm Password Change",
                        "Are you sure you want to change your password?",
                        handleChangePassword
                      )
                    }
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2 shadow-md"
                    disabled={
                      loading ||
                      !changePass.old ||
                      !changePass.newPass ||
                      !changePass.confirm
                    }
                  >
                    <Lock className="h-5 w-5" />
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordForm(false);
                      setChangePass({ old: "", newPass: "", confirm: "" });
                      setError(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors font-semibold shadow-md"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        {isConfirmModalOpen && confirmAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200">
              <div className="text-center">
                <div className="mb-6">
                  {confirmAction.type === "success" && (
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  )}
                  {confirmAction.type === "warning" && (
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                      <AlertTriangleIcon className="h-8 w-8 text-yellow-600" />
                    </div>
                  )}
                  {confirmAction.type === "error" && (
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <XCircleIcon className="h-8 w-8 text-red-600" />
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {confirmAction.title}
                </h3>

                <p className="text-gray-600 mb-6">{confirmAction.message}</p>

                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setIsConfirmModalOpen(false);
                      setConfirmAction(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors font-semibold shadow-md"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`flex-1 py-3 px-6 rounded-xl transition-colors font-semibold shadow-md ${
                      confirmAction.type === "success"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : confirmAction.type === "warning"
                        ? "bg-yellow-600 text-white hover:bg-yellow-700"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && authStatus.isAuthenticated && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
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
