// import React, { useState, useEffect } from "react";
// import { Calendar, MapPin, Plus, Edit, Trash, Search } from "lucide-react";

// interface Campaign {
//   campaign_id: number;
//   title: string;
//   location: string;
//   date: string;
//   status: string;
// }

// const Campaigns = () => {
//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [editCampaignId, setEditCampaignId] = useState<number | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [newCampaign, setNewCampaign] = useState({
//     title: "",
//     location: "",
//     date: "",
//     image: null as File | null,
//   });
//   // New state for image preview
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const hospitalId = 3; // Hardcoded for demo; replace with dynamic value in production

//   // Fetch campaigns on component mount
//   useEffect(() => {
//     fetchCampaigns();
//   }, []);

//   // Clean up image preview URL when component unmounts or image changes
//   useEffect(() => {
//     return () => {
//       if (imagePreview) {
//         URL.revokeObjectURL(imagePreview);
//       }
//     };
//   }, [imagePreview]);

//   const fetchCampaigns = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await fetch(
//         `http://localhost:9090/hospital/bloodcampaigns?hospital_id=${hospitalId}`
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP ${response.status}: ${errorText}`);
//       }

//       const data = await response.json();
//       setCampaigns(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching campaigns:", error);
//       setError(
//         `Failed to fetch campaigns: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`
//       );
//       setCampaigns([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const validateForm = () => {
//     if (!newCampaign.title.trim()) {
//       setError("Campaign title is required");
//       return false;
//     }
//     if (!newCampaign.location.trim()) {
//       setError("Location is required");
//       return false;
//     }
//     if (!newCampaign.date) {
//       setError("Date is required");
//       return false;
//     }
//     if (!showEditForm && !newCampaign.image) {
//       setError("Image is required for new campaigns");
//       return false;
//     }

//     const selectedDate = new Date(newCampaign.date);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (isNaN(selectedDate.getTime())) {
//       setError("Invalid date format");
//       return false;
//     }

//     if (selectedDate < today) {
//       setError("Campaign date cannot be in the past");
//       return false;
//     }

//     if (newCampaign.image) {
//       const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
//       if (!allowedTypes.includes(newCampaign.image.type)) {
//         setError("Only JPEG and PNG images are allowed");
//         return false;
//       }

//       const maxSize = 5 * 1024 * 1024; // 5MB
//       if (newCampaign.image.size > maxSize) {
//         setError("Image size must be less than 5MB");
//         return false;
//       }
//     }

//     setError(null);
//     return true;
//   };

//   const addCampaign = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", newCampaign.title.trim());
//     formData.append("location", newCampaign.location.trim());
//     formData.append("date", newCampaign.date);

//     if (newCampaign.image) {
//       formData.append("image", newCampaign.image);
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       const response = await fetch(
//         `http://localhost:9090/hospital/bloodcampaigns/add?hospital_id=${hospitalId}`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const result = await response.json();

//       if (response.ok) {
//         alert(result.message || "Campaign added successfully!");
//         setShowAddForm(false);
//         setNewCampaign({ title: "", location: "", date: "", image: null });
//         setImagePreview(null); // Clear preview
//         await fetchCampaigns();
//       } else {
//         const errorMsg =
//           result.message || `HTTP ${response.status}: Failed to add campaign`;
//         setError(errorMsg);
//         alert(errorMsg);
//       }
//     } catch (error) {
//       console.error("Error adding campaign:", error);
//       const errorMsg = `Network error: ${
//         error instanceof Error ? error.message : "Unknown error"
//       }`;
//       setError(errorMsg);
//       alert(errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const editCampaign = async () => {
//     if (!validateForm() || !editCampaignId) {
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", newCampaign.title.trim());
//     formData.append("location", newCampaign.location.trim());
//     formData.append("date", newCampaign.date);

//     if (newCampaign.image) {
//       formData.append("image", newCampaign.image);
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       const response = await fetch(
//         `http://localhost:9090/hospital/bloodcampaigns/${editCampaignId}?hospital_id=${hospitalId}`,
//         {
//           method: "PUT",
//           body: formData,
//         }
//       );

//       const result = await response.json();

//       if (response.ok) {
//         alert(result.message || "Campaign updated successfully!");
//         setShowEditForm(false);
//         setNewCampaign({ title: "", location: "", date: "", image: null });
//         setImagePreview(null); // Clear preview
//         setEditCampaignId(null);
//         await fetchCampaigns();
//       } else {
//         const errorMsg =
//           result.message ||
//           `HTTP ${response.status}: Failed to update campaign`;
//         setError(errorMsg);
//         alert(errorMsg);
//       }
//     } catch (error) {
//       console.error("Error updating campaign:", error);
//       const errorMsg = `Network error: ${
//         error instanceof Error ? error.message : "Unknown error"
//       }`;
//       setError(errorMsg);
//       alert(errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deleteCampaign = async (campaignId: number) => {
//     if (!window.confirm("Are you sure you want to deactivate this campaign?")) {
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       const response = await fetch(
//         `http://localhost:9090/hospital/bloodcampaigns/${campaignId}?hospital_id=${hospitalId}`,
//         {
//           method: "DELETE",
//         }
//       );

//       const result = await response.json();

//       if (response.ok) {
//         alert(result.message || "Campaign deactivated successfully!");
//         await fetchCampaigns();
//       } else {
//         const errorMsg =
//           result.message ||
//           `HTTP ${response.status}: Failed to deactivate campaign`;
//         setError(errorMsg);
//         alert(errorMsg);
//       }
//     } catch (error) {
//       console.error("Error deactivating campaign:", error);
//       const errorMsg = `Network error: ${
//         error instanceof Error ? error.message : "Unknown error"
//       }`;
//       setError(errorMsg);
//       alert(errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const startEditCampaign = (campaign: Campaign) => {
//     setNewCampaign({
//       title: campaign.title,
//       location: campaign.location,
//       date: campaign.date,
//       image: null,
//     });
//     // Set preview to existing image URL
//     setImagePreview(
//       `http://localhost:9090/hospital/bloodcampaigns/image/${campaign.campaign_id}?hospital_id=${hospitalId}`
//     );
//     setEditCampaignId(campaign.campaign_id);
//     setShowEditForm(true);
//     setError(null);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (file) {
//       const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
//       if (!allowedTypes.includes(file.type)) {
//         setError("Only JPEG and PNG images are allowed");
//         e.target.value = "";
//         return;
//       }

//       const maxSize = 5 * 1024 * 1024;
//       if (file.size > maxSize) {
//         setError("Image size must be less than 5MB");
//         e.target.value = "";
//         return;
//       }

//       // Revoke previous preview URL if it exists
//       if (imagePreview) {
//         URL.revokeObjectURL(imagePreview);
//       }
//       // Set new preview URL
//       setImagePreview(URL.createObjectURL(file));
//       setError(null);
//     } else {
//       // Clear preview if no file is selected
//       if (imagePreview) {
//         URL.revokeObjectURL(imagePreview);
//         setImagePreview(null);
//       }
//     }
//     setNewCampaign({ ...newCampaign, image: file });
//   };

//   const cancelForm = () => {
//     setShowAddForm(false);
//     setShowEditForm(false);
//     setNewCampaign({ title: "", location: "", date: "", image: null });
//     if (imagePreview) {
//       URL.revokeObjectURL(imagePreview);
//       setImagePreview(null);
//     }
//     setEditCampaignId(null);
//     setError(null);
//   };

//   const filteredCampaigns = campaigns.filter(
//     (campaign) =>
//       campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       campaign.location.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center">
//           <Calendar className="h-6 w-6 text-red-500 mr-2" />
//           <h1 className="text-2xl font-bold text-gray-800">
//             Blood Donation Campaigns
//           </h1>
//         </div>
//         <button
//           onClick={() => {
//             setShowAddForm(true);
//             setError(null);
//           }}
//           disabled={isLoading}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <Plus className="h-4 w-4 mr-1" />
//           New Campaign
//         </button>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       {isLoading && (
//         <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
//           Loading...
//         </div>
//       )}

//       {/* Add Campaign Form */}
//       {showAddForm && (
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
//           <h2 className="text-lg font-semibold mb-4">Add New Campaign</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Campaign Title *
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. Community Blood Drive"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={newCampaign.title}
//                 onChange={(e) =>
//                   setNewCampaign({ ...newCampaign, title: e.target.value })
//                 }
//                 disabled={isLoading}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Location *
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. City General Hospital"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={newCampaign.location}
//                 onChange={(e) =>
//                   setNewCampaign({ ...newCampaign, location: e.target.value })
//                 }
//                 disabled={isLoading}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Image * (JPEG/PNG, max 5MB)
//               </label>
//               <input
//                 type="file"
//                 accept="image/jpeg,image/jpg,image/png"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 onChange={handleFileChange}
//                 disabled={isLoading}
//               />
//               {/* Image Preview */}
//               {imagePreview && (
//                 <div className="mt-2">
//                   <img
//                     src={imagePreview}
//                     alt="Image Preview"
//                     className="h-32 w-32 object-cover rounded"
//                     onError={(e) => {
//                       e.currentTarget.src =
//                         "https://via.placeholder.com/128?text=No+Image";
//                     }}
//                   />
//                 </div>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Campaign Date *
//               </label>
//               <input
//                 type="date"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={newCampaign.date}
//                 min={new Date().toISOString().split("T")[0]}
//                 onChange={(e) =>
//                   setNewCampaign({ ...newCampaign, date: e.target.value })
//                 }
//                 disabled={isLoading}
//               />
//             </div>
//           </div>
//           <div className="mt-4 flex justify-end">
//             <button
//               className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300 transition-colors disabled:opacity-50"
//               onClick={cancelForm}
//               disabled={isLoading}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={addCampaign}
//               disabled={isLoading}
//             >
//               {isLoading ? "Adding..." : "Add Campaign"}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Edit Campaign Form */}
//       {showEditForm && (
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
//           <h2 className="text-lg font-semibold mb-4">Edit Campaign</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Campaign Title *
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. Community Blood Drive"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={newCampaign.title}
//                 onChange={(e) =>
//                   setNewCampaign({ ...newCampaign, title: e.target.value })
//                 }
//                 disabled={isLoading}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Location *
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. City General Hospital"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={newCampaign.location}
//                 onChange={(e) =>
//                   setNewCampaign({ ...newCampaign, location: e.target.value })
//                 }
//                 disabled={isLoading}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Image (optional - JPEG/PNG, max 5MB)
//               </label>
//               <input
//                 type="file"
//                 accept="image/jpeg,image/jpg,image/png"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 onChange={handleFileChange}
//                 disabled={isLoading}
//               />
//               {/* Image Preview */}
//               {imagePreview && (
//                 <div className="mt-2">
//                   <img
//                     src={imagePreview}
//                     alt="Image Preview"
//                     className="h-32 w-32 object-cover rounded"
//                     onError={(e) => {
//                       e.currentTarget.src =
//                         "https://via.placeholder.com/128?text=No+Image";
//                     }}
//                   />
//                 </div>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Campaign Date *
//               </label>
//               <input
//                 type="date"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={newCampaign.date}
//                 min={new Date().toISOString().split("T")[0]}
//                 onChange={(e) =>
//                   setNewCampaign({ ...newCampaign, date: e.target.value })
//                 }
//                 disabled={isLoading}
//               />
//             </div>
//           </div>
//           <div className="mt-4 flex justify-end">
//             <button
//               className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300 transition-colors disabled:opacity-50"
//               onClick={cancelForm}
//               disabled={isLoading}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={editCampaign}
//               disabled={isLoading}
//             >
//               {isLoading ? "Updating..." : "Update Campaign"}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Campaigns List */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//         <div className="p-4 border-b border-gray-200">
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search campaigns by title or location..."
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               disabled={isLoading}
//             />
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Campaign
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Location
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Image
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredCampaigns.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="px-6 py-4 text-center text-gray-500"
//                   >
//                     {isLoading ? "Loading campaigns..." : "No campaigns found"}
//                   </td>
//                 </tr>
//               ) : (
//                 filteredCampaigns.map((campaign) => (
//                   <tr key={campaign.campaign_id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="font-medium text-gray-900">
//                         {campaign.title}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center text-gray-600">
//                         <MapPin className="h-4 w-4 mr-1 text-gray-400" />
//                         {campaign.location}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <img
//                         src={`http://localhost:9090/hospital/bloodcampaigns/image/${campaign.campaign_id}?hospital_id=${hospitalId}`}
//                         alt={campaign.title}
//                         className="h-10 w-10 object-cover rounded"
//                         onError={(e) => {
//                           e.currentTarget.src =
//                             "https://via.placeholder.com/40?text=No+Image";
//                         }}
//                       />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-gray-600">
//                       {new Date(campaign.date).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           campaign.status === "active"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {campaign.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <button
//                         className="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50"
//                         onClick={() => startEditCampaign(campaign)}
//                         disabled={isLoading}
//                       >
//                         <Edit className="h-4 w-4" />
//                       </button>
//                       <button
//                         className="text-red-600 hover:text-red-900 disabled:opacity-50"
//                         onClick={() => deleteCampaign(campaign.campaign_id)}
//                         disabled={isLoading}
//                       >
//                         <Trash className="h-4 w-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//         <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
//           <div className="text-sm text-gray-700">
//             Showing{" "}
//             <span className="font-medium">{filteredCampaigns.length}</span> of{" "}
//             <span className="font-medium">{campaigns.length}</span> campaigns
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Campaigns;




// import React, { useState, useEffect } from "react";
// import { Calendar, MapPin, Plus, Edit, Trash, Search, AlertCircle } from "lucide-react";

// interface Campaign {
//   campaign_id: number;
//   title: string;
//   location: string;
//   date: string;
//   status: string;
// }

// interface AuthStatus {
//   isAuthenticated: boolean;
//   userInfo: {
//     email?: string;
//     hospital_id?: number;
//     role?: string;
//   };
// }

// const API_BASE_URL = "http://localhost:9090/hospital";

// const Campaigns = () => {
//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [editCampaignId, setEditCampaignId] = useState<number | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [authStatus, setAuthStatus] = useState<AuthStatus>({
//     isAuthenticated: false,
//     userInfo: {},
//   });
//   const [newCampaign, setNewCampaign] = useState({
//     title: "",
//     location: "",
//     date: "",
//     image: null as File | null,
//   });
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   // Check authentication status
//   const checkAuth = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/profile`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         console.log("Auth response:", data); // Debug log
//         if (data.status === "success") {
//           setAuthStatus({
//             isAuthenticated: true,
//             userInfo: data.data,
//           });
//           return true;
//         }
//       }

//       console.log("Auth failed:", res.status);
//       setAuthStatus({
//         isAuthenticated: false,
//         userInfo: {},
//       });
//       setError("Authentication required. Please login first.");
//       return false;
//     } catch (error) {
//       console.error("Auth check failed:", error);
//       setAuthStatus({
//         isAuthenticated: false,
//         userInfo: {},
//       });
//       setError("Failed to verify authentication. Please check your connection.");
//       return false;
//     }
//   };

//   // Fetch campaigns - FIXED VERSION
//   const fetchCampaigns = async () => {
//     console.log("Fetching campaigns...", { authStatus });
    
//     if (!authStatus.isAuthenticated) {
//       console.log("Not authenticated, skipping fetch");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);
      
//       // Remove hospital_id query param since it's handled by backend JWT
//       const response = await fetch(`${API_BASE_URL}/bloodcampaigns`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("Fetch response status:", response.status);

//       if (!response.ok) {
//         if (response.status === 401) {
//           setError("Authentication failed. Please login again.");
//           setAuthStatus({ isAuthenticated: false, userInfo: {} });
//           return;
//         }
//         const errorText = await response.text();
//         console.error("Fetch error:", errorText);
//         throw new Error(`HTTP ${response.status}: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log("Campaigns data received:", data);
      
//       // Handle the response format from your backend
//       if (data.status === "success" && Array.isArray(data.data)) {
//         setCampaigns(data.data);
//         console.log("Campaigns set:", data.data);
//       } else {
//         console.warn("Unexpected data format:", data);
//         setCampaigns([]);
//       }
//     } catch (error) {
//       console.error("Error fetching campaigns:", error);
//       setError(
//         `Failed to fetch campaigns: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`
//       );
//       setCampaigns([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Initialize component - FIXED
//   useEffect(() => {
//     const initializeComponent = async () => {
//       console.log("Initializing component...");
//       setIsLoading(true);
//       const isAuthenticated = await checkAuth();
//       setIsLoading(false);
//     };

//     initializeComponent();
//   }, []);

//   // Fetch campaigns when auth status changes - FIXED
//   useEffect(() => {
//     if (authStatus.isAuthenticated) {
//       console.log("Auth status changed to authenticated, fetching campaigns");
//       fetchCampaigns();
//     }
//   }, [authStatus.isAuthenticated]);

//   // Clean up image preview URL
//   useEffect(() => {
//     return () => {
//       if (imagePreview) {
//         URL.revokeObjectURL(imagePreview);
//       }
//     };
//   }, [imagePreview]);

//   const validateForm = () => {
//     if (!newCampaign.title.trim()) {
//       setError("Campaign title is required");
//       return false;
//     }
//     if (!newCampaign.location.trim()) {
//       setError("Location is required");
//       return false;
//     }
//     if (!newCampaign.date) {
//       setError("Date is required");
//       return false;
//     }
//     if (!showEditForm && !newCampaign.image) {
//       setError("Image is required for new campaigns");
//       return false;
//     }

//     const selectedDate = new Date(newCampaign.date);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (isNaN(selectedDate.getTime())) {
//       setError("Invalid date format");
//       return false;
//     }

//     if (selectedDate < today) {
//       setError("Campaign date cannot be in the past");
//       return false;
//     }

//     if (newCampaign.image) {
//       const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
//       if (!allowedTypes.includes(newCampaign.image.type)) {
//         setError("Only JPEG and PNG images are allowed");
//         return false;
//       }

//       const maxSize = 5 * 1024 * 1024; // 5MB
//       if (newCampaign.image.size > maxSize) {
//         setError("Image size must be less than 5MB");
//         return false;
//       }
//     }

//     setError(null);
//     return true;
//   };

//   const addCampaign = async () => {
//     if (!validateForm()) return;

//     const formData = new FormData();
//     formData.append("title", newCampaign.title.trim());
//     formData.append("location", newCampaign.location.trim());
//     formData.append("date", newCampaign.date);
//     if (newCampaign.image) {
//       formData.append("image", newCampaign.image);
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       // Removed hospital_id query param - handled by backend JWT
//       const response = await fetch(`${API_BASE_URL}/bloodcampaigns/add`, {
//         method: "POST",
//         credentials: "include",
//         body: formData,
//       });

//       const result = await response.json();

//       if (response.ok) {
//         alert(result.message || "Campaign added successfully!");
//         setShowAddForm(false);
//         setNewCampaign({ title: "", location: "", date: "", image: null });
//         setImagePreview(null);
//         await fetchCampaigns();
//       } else {
//         const errorMsg =
//           result.message || `HTTP ${response.status}: Failed to add campaign`;
//         setError(errorMsg);
//         alert(errorMsg);
//       }
//     } catch (error) {
//       console.error("Error adding campaign:", error);
//       const errorMsg = `Network error: ${
//         error instanceof Error ? error.message : "Unknown error"
//       }`;
//       setError(errorMsg);
//       alert(errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const editCampaign = async () => {
//     if (!validateForm() || !editCampaignId) return;

//     const formData = new FormData();
//     formData.append("title", newCampaign.title.trim());
//     formData.append("location", newCampaign.location.trim());
//     formData.append("date", newCampaign.date);
//     if (newCampaign.image) {
//       formData.append("image", newCampaign.image);
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       // Removed hospital_id query param - handled by backend JWT
//       const response = await fetch(
//         `${API_BASE_URL}/bloodcampaigns/${editCampaignId}`,
//         {
//           method: "PUT",
//           credentials: "include",
//           body: formData,
//         }
//       );

//       const result = await response.json();

//       if (response.ok) {
//         alert(result.message || "Campaign updated successfully!");
//         setShowEditForm(false);
//         setNewCampaign({ title: "", location: "", date: "", image: null });
//         setImagePreview(null);
//         setEditCampaignId(null);
//         await fetchCampaigns();
//       } else {
//         const errorMsg =
//           result.message || `HTTP ${response.status}: Failed to update campaign`;
//         setError(errorMsg);
//         alert(errorMsg);
//       }
//     } catch (error) {
//       console.error("Error updating campaign:", error);
//       const errorMsg = `Network error: ${
//         error instanceof Error ? error.message : "Unknown error"
//       }`;
//       setError(errorMsg);
//       alert(errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deleteCampaign = async (campaignId: number) => {
//     if (!window.confirm("Are you sure you want to deactivate this campaign?")) {
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       // Removed hospital_id query param - handled by backend JWT
//       const response = await fetch(
//         `${API_BASE_URL}/bloodcampaigns/${campaignId}`,
//         {
//           method: "DELETE",
//           credentials: "include",
//         }
//       );

//       const result = await response.json();

//       if (response.ok) {
//         alert(result.message || "Campaign deactivated successfully!");
//         await fetchCampaigns();
//       } else {
//         const errorMsg =
//           result.message || `HTTP ${response.status}: Failed to deactivate campaign`;
//         setError(errorMsg);
//         alert(errorMsg);
//       }
//     } catch (error) {
//       console.error("Error deactivating campaign:", error);
//       const errorMsg = `Network error: ${
//         error instanceof Error ? error.message : "Unknown error"
//       }`;
//       setError(errorMsg);
//       alert(errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const startEditCampaign = (campaign: Campaign) => {
//     setNewCampaign({
//       title: campaign.title,
//       location: campaign.location,
//       date: campaign.date,
//       image: null,
//     });
//     setImagePreview(`${API_BASE_URL}/bloodcampaigns/image/${campaign.campaign_id}`);
//     setEditCampaignId(campaign.campaign_id);
//     setShowEditForm(true);
//     setError(null);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (file) {
//       const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
//       if (!allowedTypes.includes(file.type)) {
//         setError("Only JPEG and PNG images are allowed");
//         e.target.value = "";
//         return;
//       }

//       const maxSize = 5 * 1024 * 1024;
//       if (file.size > maxSize) {
//         setError("Image size must be less than 5MB");
//         e.target.value = "";
//         return;
//       }

//       if (imagePreview) {
//         URL.revokeObjectURL(imagePreview);
//       }
//       setImagePreview(URL.createObjectURL(file));
//       setError(null);
//     } else {
//       if (imagePreview) {
//         URL.revokeObjectURL(imagePreview);
//         setImagePreview(null);
//       }
//     }
//     setNewCampaign({ ...newCampaign, image: file });
//   };

//   const cancelForm = () => {
//     setShowAddForm(false);
//     setShowEditForm(false);
//     setNewCampaign({ title: "", location: "", date: "", image: null });
//     if (imagePreview) {
//       URL.revokeObjectURL(imagePreview);
//       setImagePreview(null);
//     }
//     setEditCampaignId(null);
//     setError(null);
//   };

//   const filteredCampaigns = campaigns.filter(
//     (campaign) =>
//       campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       campaign.location.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading campaigns data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Authentication required state
//   if (!authStatus.isAuthenticated) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center bg-white p-8 rounded-lg shadow-lg border border-gray-200">
//           <AlertCircle className="h-16 w-16 text-blue-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold mb-2 text-gray-800">Authentication Required</h2>
//           <p className="text-gray-600 mb-4">
//             Please login to access the campaign management system.
//           </p>
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
//               <p className="text-red-800 text-sm">{error}</p>
//             </div>
//           )}
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center">
//           <Calendar className="h-6 w-6 text-blue-500 mr-2" />
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">
//               Blood Donation Campaigns
//             </h1>
//           </div>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={() => {
//               setShowAddForm(true);
//               setError(null);
//             }}
//             disabled={isLoading}
//             className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <Plus className="h-4 w-4 mr-1" />
//             New Campaign
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           <div className="flex">
//             <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
//             <p>{error}</p>
//           </div>
//         </div>
//       )}

//       {/* Add Campaign Form */}
//       {showAddForm && (
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
//           <h2 className="text-lg font-semibold mb-4">Add New Campaign</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Campaign Title *
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. Community Blood Drive"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={newCampaign.title}
//                 onChange={(e) =>
//                   setNewCampaign({ ...newCampaign, title: e.target.value })
//                 }
//                 disabled={isLoading}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Location *
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. City General Hospital"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={newCampaign.location}
//                 onChange={(e) =>
//                   setNewCampaign({ ...newCampaign, location: e.target.value })
//                 }
//                 disabled={isLoading}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Image * (JPEG/PNG, max 5MB)
//               </label>
//               <input
//                 type="file"
//                 accept="image/jpeg,image/jpg,image/png"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 onChange={handleFileChange}
//                 disabled={isLoading}
//               />
//               {imagePreview && (
//                 <div className="mt-2">
//                   <img
//                     src={imagePreview}
//                     alt="Image Preview"
//                     className="h-32 w-32 object-cover rounded"
//                     onError={(e) => {
//                       e.currentTarget.src =
//                         "https://via.placeholder.com/128?text=No+Image";
//                     }}
//                   />
//                 </div>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Campaign Date *
//               </label>
//               <input
//                 type="date"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={newCampaign.date}
//                 min={new Date().toISOString().split("T")[0]}
//                 onChange={(e) =>
//                   setNewCampaign({ ...newCampaign, date: e.target.value })
//                 }
//                 disabled={isLoading}
//               />
//             </div>
//           </div>
//           <div className="mt-4 flex justify-end">
//             <button
//               className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300 transition-colors disabled:opacity-50"
//               onClick={cancelForm}
//               disabled={isLoading}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={addCampaign}
//               disabled={isLoading}
//             >
//               {isLoading ? "Adding..." : "Add Campaign"}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Edit Campaign Form */}
//       {showEditForm && (
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
//           <h2 className="text-lg font-semibold mb-4">Edit Campaign</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Campaign Title *
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. Community Blood Drive"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={newCampaign.title}
//                 onChange={(e) =>
//                   setNewCampaign({ ...newCampaign, title: e.target.value })
//                 }
//                 disabled={isLoading}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Location *
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. City General Hospital"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={newCampaign.location}
//                 onChange={(e) =>
//                   setNewCampaign({ ...newCampaign, location: e.target.value })
//                 }
//                 disabled={isLoading}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Image (optional - JPEG/PNG, max 5MB)
//               </label>
//               <input
//                 type="file"
//                 accept="image/jpeg,image/jpg,image/png"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 onChange={handleFileChange}
//                 disabled={isLoading}
//               />
//               {imagePreview && (
//                 <div className="mt-2">
//                   <img
//                     src={imagePreview}
//                     alt="Image Preview"
//                     className="h-32 w-32 object-cover rounded"
//                     onError={(e) => {
//                       e.currentTarget.src =
//                         "https://via.placeholder.com/128?text=No+Image";
//                     }}
//                   />
//                 </div>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Campaign Date *
//               </label>
//               <input
//                 type="date"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={newCampaign.date}
//                 min={new Date().toISOString().split("T")[0]}
//                 onChange={(e) =>
//                   setNewCampaign({ ...newCampaign, date: e.target.value })
//                 }
//                 disabled={isLoading}
//               />
//             </div>
//           </div>
//           <div className="mt-4 flex justify-end">
//             <button
//               className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300 transition-colors disabled:opacity-50"
//               onClick={cancelForm}
//               disabled={isLoading}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={editCampaign}
//               disabled={isLoading}
//             >
//               {isLoading ? "Updating..." : "Update Campaign"}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Campaigns List */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//         <div className="p-4 border-b border-gray-200">
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search campaigns by title or location..."
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               disabled={isLoading}
//             />
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Campaign
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Location
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Image
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredCampaigns.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="px-6 py-4 text-center text-gray-500"
//                   >
//                     {isLoading ? "Loading campaigns..." : "No campaigns found"}
//                   </td>
//                 </tr>
//               ) : (
//                 filteredCampaigns.map((campaign) => (
//                   <tr key={campaign.campaign_id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="font-medium text-gray-900">
//                         {campaign.title}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center text-gray-600">
//                         <MapPin className="h-4 w-4 mr-1 text-gray-400" />
//                         {campaign.location}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <img
//                         src={`${API_BASE_URL}/bloodcampaigns/image/${campaign.campaign_id}`}
//                         alt={campaign.title}
//                         className="h-10 w-10 object-cover rounded"
//                         onError={(e) => {
//                           e.currentTarget.src =
//                             "https://via.placeholder.com/40?text=No+Image";
//                         }}
//                       />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-gray-600">
//                       {new Date(campaign.date).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           campaign.status === "active"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {campaign.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <button
//                         className="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50"
//                         onClick={() => startEditCampaign(campaign)}
//                         disabled={isLoading}
//                       >
//                         <Edit className="h-4 w-4" />
//                       </button>
//                       <button
//                         className="text-red-600 hover:text-red-900 disabled:opacity-50"
//                         onClick={() => deleteCampaign(campaign.campaign_id)}
//                         disabled={isLoading}
//                       >
//                         <Trash className="h-4 w-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//         <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
//           <div className="text-sm text-gray-700">
//             Showing{" "}
//             <span className="font-medium">{filteredCampaigns.length}</span> of{" "}
//             <span className="font-medium">{campaigns.length}</span> campaigns
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Campaigns;

// import React, { useState, useEffect } from "react";
// import { Calendar, MapPin, Plus, Edit, Trash, Search, AlertCircle, Heart, Users, Clock, Image as ImageIcon, X, CheckCircle } from "lucide-react";

// interface Campaign {
//   campaign_id: number;
//   title: string;
//   location: string;
//   date: string;
//   status: string;
// }

// interface AuthStatus {
//   isAuthenticated: boolean;
//   userInfo: {
//     email?: string;
//     hospital_id?: number;
//     role?: string;
//   };
// }

// const API_BASE_URL = "http://localhost:9090/hospital";

// const Campaigns = () => {
//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [editCampaignId, setEditCampaignId] = useState<number | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [authStatus, setAuthStatus] = useState<AuthStatus>({
//     isAuthenticated: false,
//     userInfo: {},
//   });
//   const [newCampaign, setNewCampaign] = useState({
//     title: "",
//     location: "",
//     date: "",
//     image: null as File | null,
//   });
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   // Check authentication status
//   const checkAuth = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/profile`, {
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
//           return true;
//         }
//       }

//       setAuthStatus({
//         isAuthenticated: false,
//         userInfo: {},
//       });
//       setError("Authentication required. Please login first.");
//       return false;
//     } catch (error) {
//       setAuthStatus({
//         isAuthenticated: false,
//         userInfo: {},
//       });
//       setError("Failed to verify authentication. Please check your connection.");
//       return false;
//     }
//   };

//   // Fetch campaigns
//   const fetchCampaigns = async () => {
//     if (!authStatus.isAuthenticated) return;

//     try {
//       setIsLoading(true);
//       setError(null);
      
//       const response = await fetch(`${API_BASE_URL}/bloodcampaigns`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           setError("Authentication failed. Please login again.");
//           setAuthStatus({ isAuthenticated: false, userInfo: {} });
//           return;
//         }
//         const errorText = await response.text();
//         throw new Error(`HTTP ${response.status}: ${errorText}`);
//       }

//       const data = await response.json();
      
//       if (data.status === "success" && Array.isArray(data.data)) {
//         setCampaigns(data.data);
//       } else {
//         setCampaigns([]);
//       }
//     } catch (error) {
//       setError(
//         `Failed to fetch campaigns: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`
//       );
//       setCampaigns([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Initialize component
//   useEffect(() => {
//     const initializeComponent = async () => {
//       setIsLoading(true);
//       const isAuthenticated = await checkAuth();
//       setIsLoading(false);
//     };

//     initializeComponent();
//   }, []);

//   // Fetch campaigns when auth status changes
//   useEffect(() => {
//     if (authStatus.isAuthenticated) {
//       fetchCampaigns();
//     }
//   }, [authStatus.isAuthenticated]);

//   // Clean up image preview URL
//   useEffect(() => {
//     return () => {
//       if (imagePreview) {
//         URL.revokeObjectURL(imagePreview);
//       }
//     };
//   }, [imagePreview]);

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

//   const validateForm = () => {
//     if (!newCampaign.title.trim()) {
//       setError("Campaign title is required");
//       return false;
//     }
//     if (!newCampaign.location.trim()) {
//       setError("Location is required");
//       return false;
//     }
//     if (!newCampaign.date) {
//       setError("Date is required");
//       return false;
//     }
//     if (!showEditForm && !newCampaign.image) {
//       setError("Image is required for new campaigns");
//       return false;
//     }

//     const selectedDate = new Date(newCampaign.date);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (selectedDate < today) {
//       setError("Campaign date cannot be in the past");
//       return false;
//     }

//     if (newCampaign.image) {
//       const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
//       if (!allowedTypes.includes(newCampaign.image.type)) {
//         setError("Only JPEG and PNG images are allowed");
//         return false;
//       }

//       const maxSize = 5 * 1024 * 1024;
//       if (newCampaign.image.size > maxSize) {
//         setError("Image size must be less than 5MB");
//         return false;
//       }
//     }

//     setError(null);
//     return true;
//   };

//   const addCampaign = async () => {
//     if (!validateForm()) return;

//     const formData = new FormData();
//     formData.append("title", newCampaign.title.trim());
//     formData.append("location", newCampaign.location.trim());
//     formData.append("date", newCampaign.date);
//     if (newCampaign.image) {
//       formData.append("image", newCampaign.image);
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       const response = await fetch(`${API_BASE_URL}/bloodcampaigns/add`, {
//         method: "POST",
//         credentials: "include",
//         body: formData,
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setSuccess("Campaign added successfully! 🎉");
//         setShowAddForm(false);
//         setNewCampaign({ title: "", location: "", date: "", image: null });
//         setImagePreview(null);
//         await fetchCampaigns();
//       } else {
//         setError(result.message || "Failed to add campaign");
//       }
//     } catch (error) {
//       setError(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const editCampaign = async () => {
//     if (!validateForm() || !editCampaignId) return;

//     const formData = new FormData();
//     formData.append("title", newCampaign.title.trim());
//     formData.append("location", newCampaign.location.trim());
//     formData.append("date", newCampaign.date);
//     if (newCampaign.image) {
//       formData.append("image", newCampaign.image);
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       const response = await fetch(
//         `${API_BASE_URL}/bloodcampaigns/${editCampaignId}`,
//         {
//           method: "PUT",
//           credentials: "include",
//           body: formData,
//         }
//       );

//       const result = await response.json();

//       if (response.ok) {
//         setSuccess("Campaign updated successfully! ✨");
//         setShowEditForm(false);
//         setNewCampaign({ title: "", location: "", date: "", image: null });
//         setImagePreview(null);
//         setEditCampaignId(null);
//         await fetchCampaigns();
//       } else {
//         setError(result.message || "Failed to update campaign");
//       }
//     } catch (error) {
//       setError(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deleteCampaign = async (campaignId: number) => {
//     if (!window.confirm("Are you sure you want to deactivate this campaign?")) {
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       const response = await fetch(
//         `${API_BASE_URL}/bloodcampaigns/${campaignId}`,
//         {
//           method: "DELETE",
//           credentials: "include",
//         }
//       );

//       const result = await response.json();

//       if (response.ok) {
//         setSuccess("Campaign deactivated successfully");
//         await fetchCampaigns();
//       } else {
//         setError(result.message || "Failed to deactivate campaign");
//       }
//     } catch (error) {
//       setError(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const startEditCampaign = (campaign: Campaign) => {
//     setNewCampaign({
//       title: campaign.title,
//       location: campaign.location,
//       date: campaign.date,
//       image: null,
//     });
//     setImagePreview(`${API_BASE_URL}/bloodcampaigns/image/${campaign.campaign_id}`);
//     setEditCampaignId(campaign.campaign_id);
//     setShowEditForm(true);
//     setError(null);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (file) {
//       const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
//       if (!allowedTypes.includes(file.type)) {
//         setError("Only JPEG and PNG images are allowed");
//         e.target.value = "";
//         return;
//       }

//       const maxSize = 5 * 1024 * 1024;
//       if (file.size > maxSize) {
//         setError("Image size must be less than 5MB");
//         e.target.value = "";
//         return;
//       }

//       if (imagePreview) {
//         URL.revokeObjectURL(imagePreview);
//       }
//       setImagePreview(URL.createObjectURL(file));
//       setError(null);
//     } else {
//       if (imagePreview) {
//         URL.revokeObjectURL(imagePreview);
//         setImagePreview(null);
//       }
//     }
//     setNewCampaign({ ...newCampaign, image: file });
//   };

//   const cancelForm = () => {
//     setShowAddForm(false);
//     setShowEditForm(false);
//     setNewCampaign({ title: "", location: "", date: "", image: null });
//     if (imagePreview) {
//       URL.revokeObjectURL(imagePreview);
//       setImagePreview(null);
//     }
//     setEditCampaignId(null);
//     setError(null);
//   };

//   const filteredCampaigns = campaigns.filter(
//     (campaign) =>
//       campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       campaign.location.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Loading state
//   if (isLoading && !authStatus.isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center">
//         <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-red-100">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-500 mx-auto"></div>
//             <Heart className="h-6 w-6 text-red-500 absolute top-5 left-1/2 transform -translate-x-1/2" />
//           </div>
//           <h3 className="mt-6 text-xl font-semibold text-gray-800">Loading Campaigns</h3>
//           <p className="mt-2 text-gray-600">Please wait while we fetch your data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Authentication required state
//   if (!authStatus.isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
//         <div className="text-center bg-white p-10 rounded-3xl shadow-2xl border border-red-100 max-w-md w-full">
//           <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
//             <Heart className="h-10 w-10 text-red-500" />
//           </div>
//           <h2 className="text-2xl font-bold mb-3 text-gray-800">Welcome Back!</h2>
//           <p className="text-gray-600 mb-6 leading-relaxed">
//             Please login to access the blood donation campaign management system and help save lives.
//           </p>
//           {error && (
//             <div className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4 mb-6">
//               <div className="flex">
//                 <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
//                 <p className="text-red-800 text-sm">{error}</p>
//               </div>
//             </div>
//           )}
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
//   const totalCampaigns = campaigns.length;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
//       {/* Header Section */}
//       <div className="bg-white shadow-sm border-b border-red-100">
//         <div className="container mx-auto p-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div className="flex items-center">
//               <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl mr-4">
//                 <Heart className="h-8 w-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
//                   Blood Donation Campaigns
//                 </h1>
//                 <p className="text-gray-600 mt-1">Manage and organize life-saving campaigns</p>
//               </div>
//             </div>
            
//             {/* Stats Cards */}
//             <div className="flex gap-4">
//               <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 min-w-[120px]">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-green-600">Active</p>
//                     <p className="text-2xl font-bold text-green-700">{activeCampaigns}</p>
//                   </div>
//                   <Users className="h-8 w-8 text-green-500" />
//                 </div>
//               </div>
//               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 min-w-[120px]">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-blue-600">Total</p>
//                     <p className="text-2xl font-bold text-blue-700">{totalCampaigns}</p>
//                   </div>
//                   <Calendar className="h-8 w-8 text-blue-500" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto p-6">
//         {/* Success Message */}
//         {success && (
//           <div className="mb-6 bg-green-50 border-l-4 border-green-400 rounded-r-lg p-4 shadow-sm animate-in slide-in-from-top duration-300">
//             <div className="flex items-center">
//               <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
//               <p className="text-green-800 font-medium">{success}</p>
//               <button 
//                 onClick={() => setSuccess(null)}
//                 className="ml-auto text-green-400 hover:text-green-600"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4 shadow-sm animate-in slide-in-from-top duration-300">
//             <div className="flex items-center">
//               <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
//               <p className="text-red-800">{error}</p>
//               <button 
//                 onClick={() => setError(null)}
//                 className="ml-auto text-red-400 hover:text-red-600"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Action Bar */}
//         <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-6 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="relative flex-1 max-w-md">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search campaigns by title or location..."
//                 className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 disabled={isLoading}
//               />
//             </div>
//             <button
//               onClick={() => {
//                 setShowAddForm(true);
//                 setError(null);
//               }}
//               disabled={isLoading}
//               className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl flex items-center hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none font-semibold shadow-lg"
//             >
//               <Plus className="h-5 w-5 mr-2" />
//               New Campaign
//             </button>
//           </div>
//         </div>

//         {/* Add Campaign Form */}
//         {showAddForm && (
//           <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 mb-6 animate-in slide-in-from-top duration-300">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-gray-800">Create New Campaign</h2>
//               <button
//                 onClick={cancelForm}
//                 className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Campaign Title *
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="e.g. Community Blood Drive"
//                     className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                     value={newCampaign.title}
//                     onChange={(e) =>
//                       setNewCampaign({ ...newCampaign, title: e.target.value })
//                     }
//                     disabled={isLoading}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Location *
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="e.g. City General Hospital"
//                     className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                     value={newCampaign.location}
//                     onChange={(e) =>
//                       setNewCampaign({ ...newCampaign, location: e.target.value })
//                     }
//                     disabled={isLoading}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Campaign Date *
//                   </label>
//                   <input
//                     type="date"
//                     className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                     value={newCampaign.date}
//                     min={new Date().toISOString().split("T")[0]}
//                     onChange={(e) =>
//                       setNewCampaign({ ...newCampaign, date: e.target.value })
//                     }
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Campaign Image * (JPEG/PNG, max 5MB)
//                 </label>
//                 <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-red-300 transition-colors">
//                   {imagePreview ? (
//                     <div className="space-y-4">
//                       <img
//                         src={imagePreview}
//                         alt="Preview"
//                         className="h-32 w-full object-cover rounded-lg"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => {
//                           if (imagePreview) URL.revokeObjectURL(imagePreview);
//                           setImagePreview(null);
//                           setNewCampaign({ ...newCampaign, image: null });
//                         }}
//                         className="text-red-500 hover:text-red-700 text-sm font-medium"
//                       >
//                         Remove Image
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
//                       <div>
//                         <label className="cursor-pointer">
//                           <span className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors inline-block">
//                             Choose Image
//                           </span>
//                           <input
//                             type="file"
//                             accept="image/jpeg,image/jpg,image/png"
//                             className="hidden"
//                             onChange={handleFileChange}
//                             disabled={isLoading}
//                           />
//                         </label>
//                         <p className="text-sm text-gray-500 mt-2">Upload a compelling campaign image</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
            
//             <div className="mt-8 flex justify-end gap-4">
//               <button
//                 className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50"
//                 onClick={cancelForm}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
//                 onClick={addCampaign}
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Creating..." : "Create Campaign"}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Edit Campaign Form */}
//         {showEditForm && (
//           <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 mb-6 animate-in slide-in-from-top duration-300">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-gray-800">Edit Campaign</h2>
//               <button
//                 onClick={cancelForm}
//                 className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Campaign Title *
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="e.g. Community Blood Drive"
//                     className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                     value={newCampaign.title}
//                     onChange={(e) =>
//                       setNewCampaign({ ...newCampaign, title: e.target.value })
//                     }
//                     disabled={isLoading}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Location *
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="e.g. City General Hospital"
//                     className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                     value={newCampaign.location}
//                     onChange={(e) =>
//                       setNewCampaign({ ...newCampaign, location: e.target.value })
//                     }
//                     disabled={isLoading}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Campaign Date *
//                   </label>
//                   <input
//                     type="date"
//                     className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                     value={newCampaign.date}
//                     min={new Date().toISOString().split("T")[0]}
//                     onChange={(e) =>
//                       setNewCampaign({ ...newCampaign, date: e.target.value })
//                     }
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Campaign Image (optional - JPEG/PNG, max 5MB)
//                 </label>
//                 <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-red-300 transition-colors">
//                   {imagePreview ? (
//                     <div className="space-y-4">
//                       <img
//                         src={imagePreview}
//                         alt="Preview"
//                         className="h-32 w-full object-cover rounded-lg"
//                         onError={(e) => {
//                           e.currentTarget.src = "https://via.placeholder.com/128?text=No+Image";
//                         }}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => {
//                           if (imagePreview) URL.revokeObjectURL(imagePreview);
//                           setImagePreview(null);
//                           setNewCampaign({ ...newCampaign, image: null });
//                         }}
//                         className="text-red-500 hover:text-red-700 text-sm font-medium"
//                       >
//                         Remove Image
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
//                       <div>
//                         <label className="cursor-pointer">
//                           <span className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors inline-block">
//                             Choose New Image
//                           </span>
//                           <input
//                             type="file"
//                             accept="image/jpeg,image/jpg,image/png"
//                             className="hidden"
//                             onChange={handleFileChange}
//                             disabled={isLoading}
//                           />
//                         </label>
//                         <p className="text-sm text-gray-500 mt-2">Keep current image or upload a new one</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
            
//             <div className="mt-8 flex justify-end gap-4">
//               <button
//                 className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50"
//                 onClick={cancelForm}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
//                 onClick={editCampaign}
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Updating..." : "Update Campaign"}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Campaigns Grid */}
//         <div className="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-pink-50">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//               <Calendar className="h-5 w-5 mr-2 text-red-500" />
//               Campaign Overview
//             </h3>
//             <p className="text-sm text-gray-600 mt-1">
//               Showing {filteredCampaigns.length} of {campaigns.length} campaigns
//             </p>
//           </div>
          
//           {filteredCampaigns.length === 0 ? (
//             <div className="p-12 text-center">
//               {isLoading ? (
//                 <div className="space-y-4">
//                   <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-500 mx-auto"></div>
//                   <p className="text-gray-600">Loading campaigns...</p>
//                 </div>
//               ) : searchTerm ? (
//                 <div className="space-y-4">
//                   <Search className="h-16 w-16 text-gray-300 mx-auto" />
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-700">No campaigns found</h3>
//                     <p className="text-gray-500">Try adjusting your search terms</p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   <Heart className="h-16 w-16 text-gray-300 mx-auto" />
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-700">No campaigns yet</h3>
//                     <p className="text-gray-500 mb-4">Create your first blood donation campaign to get started</p>
//                     <button
//                       onClick={() => setShowAddForm(true)}
//                       className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-semibold shadow-lg"
//                     >
//                       <Plus className="h-4 w-4 mr-2 inline" />
//                       Create Campaign
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Campaign
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Location
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Image
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-100">
//                   {filteredCampaigns.map((campaign, index) => (
//                     <tr key={campaign.campaign_id} className="hover:bg-red-50 transition-colors duration-150">
//                       <td className="px-6 py-4">
//                         <div>
//                           <div className="font-semibold text-gray-900 text-lg">
//                             {campaign.title}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             ID: {campaign.campaign_id}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center text-gray-700">
//                           <MapPin className="h-4 w-4 mr-2 text-red-400 flex-shrink-0" />
//                           <span className="truncate max-w-xs">{campaign.location}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="relative">
//                           <img
//                             src={`${API_BASE_URL}/bloodcampaigns/image/${campaign.campaign_id}`}
//                             alt={campaign.title}
//                             className="h-16 w-16 object-cover rounded-xl shadow-md border-2 border-red-100"
//                             onError={(e) => {
//                               e.currentTarget.src = "https://via.placeholder.com/64?text=No+Image";
//                             }}
//                           />
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center text-gray-700">
//                           <Clock className="h-4 w-4 mr-2 text-blue-400" />
//                           <div>
//                             <div className="font-medium">
//                               {new Date(campaign.date).toLocaleDateString('en-US', {
//                                 year: 'numeric',
//                                 month: 'short',
//                                 day: 'numeric'
//                               })}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               {new Date(campaign.date).toLocaleDateString('en-US', {
//                                 weekday: 'long'
//                               })}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                             campaign.status === "active"
//                               ? "bg-green-100 text-green-800 border border-green-200"
//                               : "bg-red-100 text-red-800 border border-red-200"
//                           }`}
//                         >
//                           {campaign.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-right">
//                         <div className="flex justify-end space-x-3">
//                           <button
//                             className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2 rounded-lg transition-colors duration-150 disabled:opacity-50"
//                             onClick={() => startEditCampaign(campaign)}
//                             disabled={isLoading}
//                             title="Edit Campaign"
//                           >
//                             <Edit className="h-5 w-5" />
//                           </button>
//                           <button
//                             className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-lg transition-colors duration-150 disabled:opacity-50"
//                             onClick={() => deleteCampaign(campaign.campaign_id)}
//                             disabled={isLoading}
//                             title="Deactivate Campaign"
//                           >
//                             <Trash className="h-5 w-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
          
//           {/* Footer */}
//           {filteredCampaigns.length > 0 && (
//             <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
//               <div className="flex items-center justify-between">
//                 <div className="text-sm text-gray-700">
//                   Showing <span className="font-semibold">{filteredCampaigns.length}</span> of{" "}
//                   <span className="font-semibold">{campaigns.length}</span> campaigns
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   {searchTerm && `Filtered by: "${searchTerm}"`}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Campaigns;


// import React, { useState, useEffect } from "react";
// import {
//   Calendar,
//   MapPin,
//   Plus,
//   Edit,
//   Trash,
//   Search,
//   AlertCircle,
//   Heart,
//   Users,
//   Clock,
//   Image as ImageIcon,
//   X,
//   CheckCircle,
//   AlertTriangle,
// } from "lucide-react";

// interface Campaign {
//   campaign_id: number;
//   title: string;
//   location: string;
//   date: string;
//   status: string;
// }

// interface AuthStatus {
//   isAuthenticated: boolean;
//   userInfo: {
//     email?: string;
//     hospital_id?: number;
//     role?: string;
//   };
// }

// const API_BASE_URL = "http://localhost:9090/hospital";

// const Campaigns = () => {
//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [editCampaignId, setEditCampaignId] = useState<number | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [authStatus, setAuthStatus] = useState<AuthStatus>({
//     isAuthenticated: false,
//     userInfo: {},
//   });
//   const [newCampaign, setNewCampaign] = useState({
//     title: "",
//     location: "",
//     date: "",
//     image: null as File | null,
//   });
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//   const [confirmAction, setConfirmAction] = useState<{
//     type: string;
//     title: string;
//     message: string;
//     action: () => void;
//   } | null>(null);

//   // Check authentication status
//   const checkAuth = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/profile`, {
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
//           return true;
//         }
//       }

//       setAuthStatus({
//         isAuthenticated: false,
//         userInfo: {},
//       });
//       setError("Authentication required. Please login first.");
//       return false;
//     } catch (error) {
//       setAuthStatus({
//         isAuthenticated: false,
//         userInfo: {},
//       });
//       setError("Failed to verify authentication. Please check your connection.");
//       return false;
//     }
//   };

//   // Fetch campaigns
//   const fetchCampaigns = async () => {
//     if (!authStatus.isAuthenticated) return;

//     try {
//       setIsLoading(true);
//       setError(null);

//       const response = await fetch(`${API_BASE_URL}/bloodcampaigns`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           setError("Authentication failed. Please login again.");
//           setAuthStatus({ isAuthenticated: false, userInfo: {} });
//           return;
//         }
//         const errorText = await response.text();
//         throw new Error(`HTTP ${response.status}: ${errorText}`);
//       }

//       const data = await response.json();

//       if (data.status === "success" && Array.isArray(data.data)) {
//         setCampaigns(data.data);
//       } else {
//         setCampaigns([]);
//       }
//     } catch (error) {
//       setError(
//         `Failed to fetch campaigns: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`
//       );
//       setCampaigns([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Initialize component
//   useEffect(() => {
//     const initializeComponent = async () => {
//       setIsLoading(true);
//       const isAuthenticated = await checkAuth();
//       setIsLoading(false);
//     };

//     initializeComponent();
//   }, []);

//   // Fetch campaigns when auth status changes
//   useEffect(() => {
//     if (authStatus.isAuthenticated) {
//       fetchCampaigns();
//     }
//   }, [authStatus.isAuthenticated]);

//   // Clean up image preview URL
//   useEffect(() => {
//     return () => {
//       if (imagePreview) {
//         URL.revokeObjectURL(imagePreview);
//       }
//     };
//   }, [imagePreview]);

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

//   // Show confirmation modal
//   const showConfirmation = (type: string, title: string, message: string, action: () => void) => {
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

//   const validateForm = () => {
//     if (!newCampaign.title.trim()) {
//       setError("Campaign title is required");
//       return false;
//     }
//     if (!newCampaign.location.trim()) {
//       setError("Location is required");
//       return false;
//     }
//     if (!newCampaign.date) {
//       setError("Date is required");
//       return false;
//     }
//     if (!showEditForm && !newCampaign.image) {
//       setError("Image is required for new campaigns");
//       return false;
//     }

//     const selectedDate = new Date(newCampaign.date);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (selectedDate < today) {
//       setError("Campaign date cannot be in the past");
//       return false;
//     }

//     if (newCampaign.image) {
//       const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
//       if (!allowedTypes.includes(newCampaign.image.type)) {
//         setError("Only JPEG and PNG images are allowed");
//         return false;
//       }

//       const maxSize = 5 * 1024 * 1024;
//       if (newCampaign.image.size > maxSize) {
//         setError("Image size must be less than 5MB");
//         return false;
//       }
//     }

//     setError(null);
//     return true;
//   };

//   const addCampaign = async () => {
//     if (!validateForm()) return;

//     const formData = new FormData();
//     formData.append("title", newCampaign.title.trim());
//     formData.append("location", newCampaign.location.trim());
//     formData.append("date", newCampaign.date);
//     if (newCampaign.image) {
//       formData.append("image", newCampaign.image);
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       const response = await fetch(`${API_BASE_URL}/bloodcampaigns/add`, {
//         method: "POST",
//         credentials: "include",
//         body: formData,
//       });

//       const result = await response.json();

//       if (response.ok) {
//         showConfirmation(
//           "success",
//           "Campaign Created",
//           "The campaign has been successfully created!",
//           () => {
//             setShowAddForm(false);
//             setNewCampaign({ title: "", location: "", date: "", image: null });
//             setImagePreview(null);
//             fetchCampaigns();
//           }
//         );
//       } else {
//         setError(result.message || "Failed to add campaign");
//       }
//     } catch (error) {
//       setError(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const editCampaign = async () => {
//     if (!validateForm() || !editCampaignId) return;

//     const formData = new FormData();
//     formData.append("title", newCampaign.title.trim());
//     formData.append("location", newCampaign.location.trim());
//     formData.append("date", newCampaign.date);
//     if (newCampaign.image) {
//       formData.append("image", newCampaign.image);
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       const response = await fetch(
//         `${API_BASE_URL}/bloodcampaigns/${editCampaignId}`,
//         {
//           method: "PUT",
//           credentials: "include",
//           body: formData,
//         }
//       );

//       const result = await response.json();

//       if (response.ok) {
//         showConfirmation(
//           "success",
//           "Campaign Updated",
//           "The campaign has been successfully updated!",
//           () => {
//             setShowEditForm(false);
//             setNewCampaign({ title: "", location: "", date: "", image: null });
//             setImagePreview(null);
//             setEditCampaignId(null);
//             fetchCampaigns();
//           }
//         );
//       } else {
//         setError(result.message || "Failed to update campaign");
//       }
//     } catch (error) {
//       setError(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deleteCampaign = async (campaignId: number) => {
//     const campaign = campaigns.find(c => c.campaign_id === campaignId);
//     if (!campaign) return;

//     showConfirmation(
//       "warning",
//       "Deactivate Campaign",
//       `Are you sure you want to deactivate the campaign "${campaign.title}"? This action cannot be undone.`,
//       async () => {
//         try {
//           setIsLoading(true);
//           setError(null);

//           const response = await fetch(
//             `${API_BASE_URL}/bloodcampaigns/${campaignId}`,
//             {
//               method: "DELETE",
//               credentials: "include",
//             }
//           );

//           const result = await response.json();

//           if (response.ok) {
//             showConfirmation(
//               "success",
//               "Campaign Deactivated",
//               result.message || "The campaign has been successfully deactivated.",
//               () => {
//                 fetchCampaigns();
//               }
//             );
//           } else {
//             setError(result.message || "Failed to deactivate campaign");
//           }
//         } catch (error) {
//           setError(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     );
//   };

//   const startEditCampaign = (campaign: Campaign) => {
//     setNewCampaign({
//       title: campaign.title,
//       location: campaign.location,
//       date: campaign.date,
//       image: null,
//     });
//     setImagePreview(`${API_BASE_URL}/bloodcampaigns/image/${campaign.campaign_id}`);
//     setEditCampaignId(campaign.campaign_id);
//     setShowEditForm(true);
//     setError(null);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (file) {
//       const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
//       if (!allowedTypes.includes(file.type)) {
//         setError("Only JPEG and PNG images are allowed");
//         e.target.value = "";
//         return;
//       }

//       const maxSize = 5 * 1024 * 1024;
//       if (file.size > maxSize) {
//         setError("Image size must be less than 5MB");
//         e.target.value = "";
//         return;
//       }

//       if (imagePreview) {
//         URL.revokeObjectURL(imagePreview);
//       }
//       setImagePreview(URL.createObjectURL(file));
//       setError(null);
//     } else {
//       if (imagePreview) {
//         URL.revokeObjectURL(imagePreview);
//         setImagePreview(null);
//       }
//     }
//     setNewCampaign({ ...newCampaign, image: file });
//   };

//   const cancelForm = () => {
//     setShowAddForm(false);
//     setShowEditForm(false);
//     setNewCampaign({ title: "", location: "", date: "", image: null });
//     if (imagePreview) {
//       URL.revokeObjectURL(imagePreview);
//       setImagePreview(null);
//     }
//     setEditCampaignId(null);
//     setError(null);
//   };

//   const filteredCampaigns = campaigns.filter(
//     (campaign) =>
//       campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       campaign.location.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Loading state
//   if (isLoading && !authStatus.isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center">
//         <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-red-100">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-500 mx-auto"></div>
//             <Heart className="h-6 w-6 text-red-500 absolute top-5 left-1/2 transform -translate-x-1/2" />
//           </div>
//           <h3 className="mt-6 text-xl font-semibold text-gray-800">Loading Campaigns</h3>
//           <p className="mt-2 text-gray-600">Please wait while we fetch your data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Authentication required state
//   if (!authStatus.isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
//         <div className="text-center bg-white p-10 rounded-3xl shadow-2xl border border-red-100 max-w-md w-full">
//           <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
//             <Heart className="h-10 w-10 text-red-500" />
//           </div>
//           <h2 className="text-2xl font-bold mb-3 text-gray-800">Welcome Back!</h2>
//           <p className="text-gray-600 mb-6 leading-relaxed">
//             Please login to access the blood donation campaign management system and help save lives.
//           </p>
//           {error && (
//             <div className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4 mb-6">
//               <div className="flex">
//                 <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
//                 <p className="text-red-800 text-sm">{error}</p>
//               </div>
//             </div>
//           )}
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
//   const totalCampaigns = campaigns.length;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
//       {/* Header Section */}
//       <div className="bg-white shadow-sm border-b border-red-100">
//         <div className="container mx-auto p-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div className="flex items-center">
//               <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl mr-4">
//                 <Heart className="h-8 w-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
//                   Blood Donation Campaigns
//                 </h1>
//                 <p className="text-gray-600 mt-1">Manage and organize life-saving campaigns</p>
//               </div>
//             </div>

//             {/* Stats Cards */}
//             <div className="flex gap-4">
//               <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 min-w-[120px]">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-green-600">Active</p>
//                     <p className="text-2xl font-bold text-green-700">{activeCampaigns}</p>
//                   </div>
//                   <Users className="h-8 w-8 text-green-500" />
//                 </div>
//               </div>
//               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 min-w-[120px]">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-blue-600">Total</p>
//                     <p className="text-2xl font-bold text-blue-700">{totalCampaigns}</p>
//                   </div>
//                   <Calendar className="h-8 w-8 text-blue-500" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto p-6">
//         {/* Success Message */}
//         {success && (
//           <div className="mb-6 bg-green-50 border-l-4 border-green-400 rounded-r-lg p-4 shadow-sm animate-in slide-in-from-top duration-300">
//             <div className="flex items-center">
//               <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
//               <p className="text-green-800 font-medium">{success}</p>
//               <button
//                 onClick={() => setSuccess(null)}
//                 className="ml-auto text-green-400 hover:text-green-600"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4 shadow-sm animate-in slide-in-from-top duration-300">
//             <div className="flex items-center">
//               <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
//               <p className="text-red-800">{error}</p>
//               <button
//                 onClick={() => setError(null)}
//                 className="ml-auto text-red-400 hover:text-red-600"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Action Bar */}
//         <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-6 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="relative flex-1 max-w-md">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search campaigns by title or location..."
//                 className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 disabled={isLoading}
//               />
//             </div>
//             <button
//               onClick={() => {
//                 setShowAddForm(true);
//                 setError(null);
//               }}
//               disabled={isLoading}
//               className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl flex items-center hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none font-semibold shadow-lg"
//             >
//               <Plus className="h-5 w-5 mr-2" />
//               New Campaign
//             </button>
//           </div>
//         </div>

//         {/* Add Campaign Form */}
//         {showAddForm && (
//           <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 mb-6 animate-in slide-in-from-top duration-300">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-gray-800">Create New Campaign</h2>
//               <button
//                 onClick={cancelForm}
//                 className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Campaign Title *
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="e.g. Community Blood Drive"
//                     className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                     value={newCampaign.title}
//                     onChange={(e) =>
//                       setNewCampaign({ ...newCampaign, title: e.target.value })
//                     }
//                     disabled={isLoading}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Location *
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="e.g. City General Hospital"
//                     className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                     value={newCampaign.location}
//                     onChange={(e) =>
//                       setNewCampaign({ ...newCampaign, location: e.target.value })
//                     }
//                     disabled={isLoading}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Campaign Date *
//                   </label>
//                   <input
//                     type="date"
//                     className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                     value={newCampaign.date}
//                     min={new Date().toISOString().split("T")[0]}
//                     onChange={(e) =>
//                       setNewCampaign({ ...newCampaign, date: e.target.value })
//                     }
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Campaign Image * (JPEG/PNG, max 5MB)
//                 </label>
//                 <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-red-300 transition-colors">
//                   {imagePreview ? (
//                     <div className="space-y-4">
//                       <img
//                         src={imagePreview}
//                         alt="Preview"
//                         className="h-32 w-full object-cover rounded-lg"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => {
//                           if (imagePreview) URL.revokeObjectURL(imagePreview);
//                           setImagePreview(null);
//                           setNewCampaign({ ...newCampaign, image: null });
//                         }}
//                         className="text-red-500 hover:text-red-700 text-sm font-medium"
//                       >
//                         Remove Image
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
//                       <div>
//                         <label className="cursor-pointer">
//                           <span className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors inline-block">
//                             Choose Image
//                           </span>
//                           <input
//                             type="file"
//                             accept="image/jpeg,image/jpg,image/png"
//                             className="hidden"
//                             onChange={handleFileChange}
//                             disabled={isLoading}
//                           />
//                         </label>
//                         <p className="text-sm text-gray-500 mt-2">Upload a compelling campaign image</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="mt-8 flex justify-end gap-4">
//               <button
//                 className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50"
//                 onClick={cancelForm}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
//                 onClick={addCampaign}
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Creating..." : "Create Campaign"}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Edit Campaign Form */}
//         {showEditForm && (
//           <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 mb-6 animate-in slide-in-from-top duration-300">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-gray-800">Edit Campaign</h2>
//               <button
//                 onClick={cancelForm}
//                 className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Campaign Title *
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="e.g. Community Blood Drive"
//                     className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                     value={newCampaign.title}
//                     onChange={(e) =>
//                       setNewCampaign({ ...newCampaign, title: e.target.value })
//                     }
//                     disabled={isLoading}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Location *
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="e.g. City General Hospital"
//                     className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                     value={newCampaign.location}
//                     onChange={(e) =>
//                       setNewCampaign({ ...newCampaign, location: e.target.value })
//                     }
//                     disabled={isLoading}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Campaign Date *
//                   </label>
//                   <input
//                     type="date"
//                     className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                     value={newCampaign.date}
//                     min={new Date().toISOString().split("T")[0]}
//                     onChange={(e) =>
//                       setNewCampaign({ ...newCampaign, date: e.target.value })
//                     }
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Campaign Image (optional - JPEG/PNG, max 5MB)
//                 </label>
//                 <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-red-300 transition-colors">
//                   {imagePreview ? (
//                     <div className="space-y-4">
//                       <img
//                         src={imagePreview}
//                         alt="Preview"
//                         className="h-32 w-full object-cover rounded-lg"
//                         onError={(e) => {
//                           e.currentTarget.src = "https://via.placeholder.com/128?text=No+Image";
//                         }}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => {
//                           if (imagePreview) URL.revokeObjectURL(imagePreview);
//                           setImagePreview(null);
//                           setNewCampaign({ ...newCampaign, image: null });
//                         }}
//                         className="text-red-500 hover:text-red-700 text-sm font-medium"
//                       >
//                         Remove Image
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
//                       <div>
//                         <label className="cursor-pointer">
//                           <span className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors inline-block">
//                             Choose New Image
//                           </span>
//                           <input
//                             type="file"
//                             accept="image/jpeg,image/jpg,image/png"
//                             className="hidden"
//                             onChange={handleFileChange}
//                             disabled={isLoading}
//                           />
//                         </label>
//                         <p className="text-sm text-gray-500 mt-2">Keep current image or upload a new one</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="mt-8 flex justify-end gap-4">
//               <button
//                 className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50"
//                 onClick={cancelForm}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
//                 onClick={editCampaign}
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Updating..." : "Update Campaign"}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Campaigns Grid */}
//         <div className="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-pink-50">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//               <Calendar className="h-5 w-5 mr-2 text-red-500" />
//               Campaign Overview
//             </h3>
//             <p className="text-sm text-gray-600 mt-1">
//               Showing {filteredCampaigns.length} of {campaigns.length} campaigns
//             </p>
//           </div>

//           {filteredCampaigns.length === 0 ? (
//             <div className="p-12 text-center">
//               {isLoading ? (
//                 <div className="space-y-4">
//                   <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-500 mx-auto"></div>
//                   <p className="text-gray-600">Loading campaigns...</p>
//                 </div>
//               ) : searchTerm ? (
//                 <div className="space-y-4">
//                   <Search className="h-16 w-16 text-gray-300 mx-auto" />
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-700">No campaigns found</h3>
//                     <p className="text-gray-500">Try adjusting your search terms</p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   <Heart className="h-16 w-16 text-gray-300 mx-auto" />
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-700">No campaigns yet</h3>
//                     <p className="text-gray-500 mb-4">Create your first blood donation campaign to get started</p>
//                     <button
//                       onClick={() => setShowAddForm(true)}
//                       className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-semibold shadow-lg"
//                     >
//                       <Plus className="h-4 w-4 mr-2 inline" />
//                       Create Campaign
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Campaign
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Location
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Image
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-100">
//                   {filteredCampaigns.map((campaign) => (
//                     <tr
//                       key={campaign.campaign_id}
//                       className="hover:bg-red-50 transition-colors duration-150"
//                     >
//                       <td className="px-6 py-4">
//                         <div>
//                           <div className="font-semibold text-gray-900 text-lg">
//                             {campaign.title}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             ID: {campaign.campaign_id}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center text-gray-700">
//                           <MapPin className="h-4 w-4 mr-2 text-red-400 flex-shrink-0" />
//                           <span className="truncate max-w-xs">{campaign.location}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="relative">
//                           <img
//                             src={`${API_BASE_URL}/bloodcampaigns/image/${campaign.campaign_id}`}
//                             alt={campaign.title}
//                             className="h-16 w-16 object-cover rounded-xl shadow-md border-2 border-red-100"
//                             onError={(e) => {
//                               e.currentTarget.src = "https://via.placeholder.com/64?text=No+Image";
//                             }}
//                           />
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center text-gray-700">
//                           <Clock className="h-4 w-4 mr-2 text-blue-400" />
//                           <div>
//                             <div className="font-medium">
//                               {new Date(campaign.date).toLocaleDateString('en-US', {
//                                 year: 'numeric',
//                                 month: 'short',
//                                 day: 'numeric',
//                               })}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               {new Date(campaign.date).toLocaleDateString('en-US', {
//                                 weekday: 'long',
//                               })}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                             campaign.status === "active"
//                               ? "bg-green-100 text-green-800 border border-green-200"
//                               : "bg-red-100 text-red-800 border border-red-200"
//                           }`}
//                         >
//                           {campaign.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-right">
//                         <div className="flex justify-end space-x-3">
//                           <button
//                             className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2 rounded-lg transition-colors duration-150 disabled:opacity-50"
//                             onClick={() => startEditCampaign(campaign)}
//                             disabled={isLoading}
//                             title="Edit Campaign"
//                           >
//                             <Edit className="h-5 w-5" />
//                           </button>
//                           <button
//                             className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-lg transition-colors duration-150 disabled:opacity-50"
//                             onClick={() => deleteCampaign(campaign.campaign_id)}
//                             disabled={isLoading}
//                             title="Deactivate Campaign"
//                           >
//                             <Trash className="h-5 w-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* Footer */}
//           {filteredCampaigns.length > 0 && (
//             <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
//               <div className="flex items-center justify-between">
//                 <div className="text-sm text-gray-700">
//                   Showing <span className="font-semibold">{filteredCampaigns.length}</span> of{" "}
//                   <span className="font-semibold">{campaigns.length}</span> campaigns
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   {searchTerm && `Filtered by: "${searchTerm}"`}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Confirmation Modal */}
//         {isConfirmModalOpen && confirmAction && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
//               <div className="text-center">
//                 <div className="mb-4">
//                   {confirmAction.type === "success" && (
//                     <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
//                       <CheckCircle className="h-8 w-8 text-green-600" />
//                     </div>
//                   )}
//                   {confirmAction.type === "warning" && (
//                     <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
//                       <AlertTriangle className="h-8 w-8 text-yellow-600" />
//                     </div>
//                   )}
//                   {confirmAction.type === "error" && (
//                     <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
//                       <AlertCircle className="h-8 w-8 text-red-600" />
//                     </div>
//                   )}
//                 </div>

//                 <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                   {confirmAction.title}
//                 </h3>

//                 <p className="text-gray-600 mb-6">{confirmAction.message}</p>

//                 <div className="flex space-x-3">
//                   <button
//                     onClick={() => {
//                       setIsConfirmModalOpen(false);
//                       setConfirmAction(null);
//                     }}
//                     className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleConfirm}
//                     className={`flex-1 py-3 px-4 rounded-lg transition-colors font-semibold ${
//                       confirmAction.type === "success"
//                         ? "bg-green-600 text-white hover:bg-green-700"
//                         : confirmAction.type === "warning"
//                         ? "bg-yellow-600 text-white hover:bg-yellow-700"
//                         : "bg-red-600 text-white hover:bg-red-700"
//                     }`}
//                     disabled={isLoading}
//                   >
//                     {isLoading ? "Processing..." : "Confirm"}
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

// export default Campaigns;





import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Plus,
  Edit,
  Trash,
  Search,
  AlertCircle,
  Heart,
  Clock,
  Image as ImageIcon,
  X,
  CheckCircle,
  AlertTriangle,
  Eye,
  Filter,
  XIcon,
} from "lucide-react";

interface Campaign {
  campaign_id: number;
  title: string;
  location: string;
  date: string;
  status: string;
}

interface AuthStatus {
  isAuthenticated: boolean;
  userInfo: {
    email?: string;
    hospital_id?: number;
    role?: string;
  };
}

const API_BASE_URL = "http://localhost:9090/hospital";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editCampaignId, setEditCampaignId] = useState<number | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    userInfo: {},
  });
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    location: "",
    date: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: string;
    title: string;
    message: string;
    action: () => void;
  } | null>(null);

  // Check authentication status
  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
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
          return true;
        }
      }

      setAuthStatus({
        isAuthenticated: false,
        userInfo: {},
      });
      setError("Authentication required. Please login first.");
      return false;
    } catch (error) {
      setAuthStatus({
        isAuthenticated: false,
        userInfo: {},
      });
      setError("Failed to verify authentication. Please check your connection.");
      return false;
    }
  };

  // Fetch campaigns
  const fetchCampaigns = async () => {
    if (!authStatus.isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/bloodcampaigns`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Authentication failed. Please login again.");
          setAuthStatus({ isAuthenticated: false, userInfo: {} });
          return;
        }
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data.status === "success" && Array.isArray(data.data)) {
        setCampaigns(data.data);
      } else {
        setCampaigns([]);
      }
    } catch (error) {
      setError(
        `Failed to fetch campaigns: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      setIsLoading(true);
      const isAuthenticated = await checkAuth();
      setIsLoading(false);
    };

    initializeComponent();
  }, []);

  // Fetch campaigns when auth status changes
  useEffect(() => {
    if (authStatus.isAuthenticated) {
      fetchCampaigns();
    }
  }, [authStatus.isAuthenticated]);

  // Clean up image preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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

  // Show confirmation modal
  const showConfirmation = (type: string, title: string, message: string, action: () => void) => {
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

  const validateForm = () => {
    if (!newCampaign.title.trim()) {
      setError("Campaign title is required");
      return false;
    }
    if (!newCampaign.location.trim()) {
      setError("Location is required");
      return false;
    }
    if (!newCampaign.date) {
      setError("Date is required");
      return false;
    }
    if (!showEditForm && !newCampaign.image) {
      setError("Image is required for new campaigns");
      return false;
    }

    const selectedDate = new Date(newCampaign.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("Campaign date cannot be in the past");
      return false;
    }

    if (newCampaign.image) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(newCampaign.image.type)) {
        setError("Only JPEG and PNG images are allowed");
        return false;
      }

      const maxSize = 5 * 1024 * 1024;
      if (newCampaign.image.size > maxSize) {
        setError("Image size must be less than 5MB");
        return false;
      }
    }

    setError(null);
    return true;
  };

  const addCampaign = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("title", newCampaign.title.trim());
    formData.append("location", newCampaign.location.trim());
    formData.append("date", newCampaign.date);
    if (newCampaign.image) {
      formData.append("image", newCampaign.image);
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/bloodcampaigns/add`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        showConfirmation(
          "success",
          "Campaign Created",
          "The campaign has been successfully created!",
          () => {
            setShowAddForm(false);
            setNewCampaign({ title: "", location: "", date: "", image: null });
            setImagePreview(null);
            fetchCampaigns();
          }
        );
      } else {
        setError(result.message || "Failed to add campaign");
      }
    } catch (error) {
      setError(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const editCampaign = async () => {
    if (!validateForm() || !editCampaignId) return;

    const formData = new FormData();
    formData.append("title", newCampaign.title.trim());
    formData.append("location", newCampaign.location.trim());
    formData.append("date", newCampaign.date);
    if (newCampaign.image) {
      formData.append("image", newCampaign.image);
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/bloodcampaigns/${editCampaignId}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        showConfirmation(
          "success",
          "Campaign Updated",
          "The campaign has been successfully updated!",
          () => {
            setShowEditForm(false);
            setNewCampaign({ title: "", location: "", date: "", image: null });
            setImagePreview(null);
            setEditCampaignId(null);
            fetchCampaigns();
          }
        );
      } else {
        setError(result.message || "Failed to update campaign");
      }
    } catch (error) {
      setError(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCampaign = async (campaignId: number) => {
    const campaign = campaigns.find(c => c.campaign_id === campaignId);
    if (!campaign) return;

    showConfirmation(
      "warning",
      "Delete Campaign",
      `Are you sure you want to delete the campaign "${campaign.title}"? This action cannot be undone.`,
      async () => {
        try {
          setIsLoading(true);
          setError(null);

          const response = await fetch(
            `${API_BASE_URL}/bloodcampaigns/${campaignId}`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );

          const result = await response.json();

          if (response.ok) {
            showConfirmation(
              "success",
              "Campaign Deleted",
              result.message || "The campaign has been successfully deleted.",
              () => {
                fetchCampaigns();
              }
            );
          } else {
            setError(result.message || "Failed to delete campaign");
          }
        } catch (error) {
          setError(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  const startEditCampaign = (campaign: Campaign) => {
    setNewCampaign({
      title: campaign.title,
      location: campaign.location,
      date: campaign.date,
      image: null,
    });
    setImagePreview(`${API_BASE_URL}/bloodcampaigns/image/${campaign.campaign_id}`);
    setEditCampaignId(campaign.campaign_id);
    setShowEditForm(true);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPEG and PNG images are allowed");
        e.target.value = "";
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("Image size must be less than 5MB");
        e.target.value = "";
        return;
      }

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    } else {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
    }
    setNewCampaign({ ...newCampaign, image: file });
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setNewCampaign({ title: "", location: "", date: "", image: null });
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setEditCampaignId(null);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
  };

  const handleShowDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'long'
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "inactive":
        return <XIcon className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1";
    switch (status?.toLowerCase()) {
      case "active":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "inactive":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = 
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === "All" || campaign.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status?.toLowerCase() === "active").length,
    inactive: campaigns.filter(c => c.status?.toLowerCase() === "inactive").length,
    upcoming: campaigns.filter(c => new Date(c.date) > new Date()).length,
  };

  if (!authStatus.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl border border-red-100 max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please login to access the campaign management system.
          </p>
          <button className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold">
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-red-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Campaign Management
                </h1>
                <p className="text-gray-600">Organize blood donation campaigns</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* <button 
                onClick={() => fetchCampaigns()}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button> */}
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setError(null);
                }}
                disabled={isLoading}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg flex items-center hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-gray-500 text-sm">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-gray-500 text-sm">Active</p>
                <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-gray-500 text-sm">Upcoming</p>
                <p className="text-2xl font-bold text-gray-800">{stats.upcoming}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XIcon className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-gray-500 text-sm">Inactive</p>
                <p className="text-2xl font-bold text-gray-800">{stats.inactive}</p>
              </div>
            </div>
          </div>
        </div>

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

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-red-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by title or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
              </div>
            </div>
            <div className="relative">
              <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
              >
                <option value="All">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add Campaign Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-red-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Create New Campaign</h2>
              <button
                onClick={cancelForm}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Community Blood Drive"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    value={newCampaign.title}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, title: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. City General Hospital"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    value={newCampaign.location}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, location: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Campaign Date *
                  </label>
                  <input
                    type="date"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    value={newCampaign.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, date: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Campaign Image * (JPEG/PNG, max 5MB)
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-red-300 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (imagePreview) URL.revokeObjectURL(imagePreview);
                          setImagePreview(null);
                          setNewCampaign({ ...newCampaign, image: null });
                        }}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <label className="cursor-pointer">
                          <span className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors inline-block">
                            Choose Image
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isLoading}
                          />
                        </label>
                        <p className="text-sm text-gray-500 mt-2">Upload campaign image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                onClick={cancelForm}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-colors font-semibold disabled:opacity-50 shadow-md"
                onClick={addCampaign}
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Campaign"}
              </button>
            </div>
          </div>
        )}

        {/* Edit Campaign Form */}
        {showEditForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-red-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Edit Campaign</h2>
              <button
                onClick={cancelForm}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Community Blood Drive"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    value={newCampaign.title}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, title: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. City General Hospital"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    value={newCampaign.location}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, location: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Campaign Date *
                  </label>
                  <input
                    type="date"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    value={newCampaign.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, date: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Campaign Image (optional - JPEG/PNG, max 5MB)
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-red-300 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/128?text=No+Image";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (imagePreview) URL.revokeObjectURL(imagePreview);
                          setImagePreview(null);
                          setNewCampaign({ ...newCampaign, image: null });
                        }}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <label className="cursor-pointer">
                          <span className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors inline-block">
                            Choose New Image
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isLoading}
                          />
                        </label>
                        <p className="text-sm text-gray-500 mt-2">Keep current or upload new image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                onClick={cancelForm}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-colors font-semibold disabled:opacity-50 shadow-md"
                onClick={editCampaign}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Campaign"}
              </button>
            </div>
          </div>
        )}

        {/* Campaigns Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-red-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-red-50 to-red-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Campaign</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCampaigns.map((campaign, index) => (
                  <tr 
                    key={campaign.campaign_id} 
                    className={`hover:bg-red-25 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {campaign.title.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{campaign.title}</div>
                          <div className="text-sm text-gray-500">ID: #{campaign.campaign_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-red-400 flex-shrink-0" />
                        <span className="truncate max-w-xs">{campaign.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <img
                          src={`${API_BASE_URL}/bloodcampaigns/image/${campaign.campaign_id}`}
                          alt={campaign.title}
                          className="h-12 w-12 object-cover rounded-xl shadow-md border-2 border-red-100"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/48?text=No+Image";
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(campaign.date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(campaign.status)}>
                        {getStatusIcon(campaign.status)}
                        {campaign.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditCampaign(campaign)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit Campaign"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteCampaign(campaign.campaign_id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Campaign"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No campaigns found</p>
                <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Campaign Details Modal */}
        {isModalOpen && selectedCampaign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-blue-600" />
                  Campaign Details
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-600">Campaign Title</label>
                  <p className="text-gray-800">{selectedCampaign.title}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-600">Location</label>
                  <p className="text-gray-800 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-red-400" />
                    {selectedCampaign.location}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-600">Campaign Date</label>
                  <p className="text-gray-800 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                    {formatDate(selectedCampaign.date)}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-600">Status</label>
                  <p className="text-gray-800">
                    <span className={getStatusBadge(selectedCampaign.status)}>
                      {getStatusIcon(selectedCampaign.status)}
                      {selectedCampaign.status || 'Unknown'}
                    </span>
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-600">Campaign Image</label>
                  <div className="mt-2">
                    <img
                      src={`${API_BASE_URL}/bloodcampaigns/image/${selectedCampaign.campaign_id}`}
                      alt={selectedCampaign.title}
                      className="w-full h-32 object-cover rounded-lg border-2 border-red-100"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/300x128?text=No+Image";
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => {
                    closeModal();
                    startEditCampaign(selectedCampaign);
                  }}
                  className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  <Edit className="h-4 w-4" />
                  Edit Campaign
                </button>
                <button
                  onClick={() => {
                    closeModal();
                    deleteCampaign(selectedCampaign.campaign_id);
                  }}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  <Trash className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {isConfirmModalOpen && confirmAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
              <div className="text-center">
                <div className="mb-4">
                  {confirmAction.type === "success" && (
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  )}
                  {confirmAction.type === "warning" && (
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                      <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    </div>
                  )}
                  {confirmAction.type === "error" && (
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {confirmAction.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {confirmAction.message}
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setIsConfirmModalOpen(false);
                      setConfirmAction(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`flex-1 py-3 px-4 rounded-lg transition-colors font-semibold ${
                      confirmAction.type === "success"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : confirmAction.type === "warning"
                        ? "bg-yellow-600 text-white hover:bg-yellow-700"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                <span className="text-gray-800 font-medium">Processing...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;