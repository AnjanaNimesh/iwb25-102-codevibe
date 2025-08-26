// import { useState, useEffect } from "react";
// import {
//   UsersIcon,
//   SearchIcon,
//   TrashIcon,
//   XIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   ClockIcon,
//   BookOpenIcon as BookMarked,
//   Eye,
// } from "lucide-react";
// import DOMPurify from "dompurify";
// import type { Donation } from "./types/index.ts";
// import axios from "axios";

// const API_BASE_URL = "http://localhost:9090/hospital";
// const HOSPITAL_ID = 3; // Change this to match your backend test data

// const Donors = () => {
//   const [donations, setDonations] = useState<Donation[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedDonor, setSelectedDonor] = useState<Donation | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
//   const [certificateHtml, setCertificateHtml] = useState("");
//   const [loading, setLoading] = useState(false);

//   const fetchDonations = async () => {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/donationsWithDonors?hospital_id=${HOSPITAL_ID}`
//       );

//       const mappedDonations = response.data.map((item: any) => ({
//         donation_id: item.donation_id,
//         donor_id: item.donor_id,
//         donor_name: item.donor_name,
//         email: item.email,
//         blood_group: item.blood_group,
//         phone_number: item.phone_number,
//         donate_date: item.donate_date,
//         donate_status: item.donate_status,
//         last_donation_date: item.last_donation_date,
//       })) as Donation[];

//       setDonations(mappedDonations);
//     } catch (error) {
//       console.error("Error fetching donations:", error);
//       alert("Failed to fetch donations. Please try again.");
//     }
//   };

//   useEffect(() => {
//     fetchDonations();
//   }, []);

//   const handleUpdateStatus = async (donationId: number, newStatus: string) => {
//     setLoading(true);
//     try {
//       // Update donation status
//       const { data: statusResult } = await axios.post(
//         `${API_BASE_URL}/updateStatus`,
//         { donation_id: donationId, new_status: newStatus },
//         { params: { hospital_id: HOSPITAL_ID } }
//       );
//       console.log(statusResult.message);

//       // Send certificate if status is "Complete"
//       if (newStatus === "Complete") {
//         const { data: certificateResult } = await axios.post(
//           `${API_BASE_URL}/sendCertificate`,
//           { donation_id: donationId, hospital_name: "City General Hospital" },
//           { params: { hospital_id: HOSPITAL_ID } }
//         );
//         console.log(certificateResult.message);
//         alert(certificateResult.message);
//       }

//       await fetchDonations();
//     } catch (error) {
//       console.error("Error:", error);
//       alert(`Failed to process request: ${(error as Error).message}`);
//     } finally {
//       setLoading(false);
//       closeModal();
//     }
//   };

//   const fetchCertificatePreview = async (donationId: number) => {
//     setLoading(true);
//     try {
//       const { data } = await axios.get(
//         `${API_BASE_URL}/certificatePreview/${donationId}`,
//         {
//           params: {
//             hospital_id: HOSPITAL_ID,
//             hospital_name: "City General Hospital",
//           },
//         }
//       );

//       if (data.success) {
//         setCertificateHtml(DOMPurify.sanitize(data.html));
//         setIsCertificateModalOpen(true);
//       } else {
//         throw new Error("Certificate preview not available");
//       }
//     } catch (error) {
//       console.error("Error fetching certificate preview:", error);
//       alert("Failed to load certificate preview. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleShowDetails = (donation: Donation) => {
//     setSelectedDonor(donation);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (donor_id: number) => {
//     if (confirm("Are you sure you want to delete this donor?")) {
//       try {
//         const response = await axios.delete(
//           `${API_BASE_URL}/donors/${donor_id}?hospital_id=${HOSPITAL_ID}`
//         );

//         alert(response.data.message || "Donor deactivated successfully");

//         // Refresh donor list after delete
//         fetchDonations();
//       } catch (err) {
//         console.error("Error deleting donor", err);
//         alert("Failed to delete donor. Please try again.");
//       }
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedDonor(null);
//   };

//   const closeCertificateModal = () => {
//     setIsCertificateModalOpen(false);
//     setCertificateHtml("");
//   };

//   const formatDateTime = (dateTime: string | null) => {
//     if (!dateTime) return "N/A";
//     try {
//       return new Date(dateTime).toLocaleString();
//     } catch (error) {
//       return dateTime;
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "Complete":
//         return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
//       case "Reject":
//         return <XCircleIcon className="h-4 w-4 text-red-600" />;
//       default:
//         return <ClockIcon className="h-4 w-4 text-yellow-600" />;
//     }
//   };

//   const getDateLabel = (status: string) => {
//     return status === "Complete" ? "Completion Date" : "Donation Date";
//   };

//   const filteredDonations = donations.filter(
//     (donation) =>
//       donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       donation.blood_group.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="relative">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center">
//           <UsersIcon className="h-6 w-6 text-blue-500 mr-2" />
//           <h1 className="text-2xl font-bold text-gray-800">
//             Donation Management
//           </h1>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//         <div className="p-4 border-b border-gray-200">
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <SearchIcon className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search donations by donor name or blood group..."
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Donor Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Blood Group
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Contact
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
//               {filteredDonations.map((donation) => (
//                 <tr key={donation.donation_id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="font-medium text-gray-900">
//                       {donation.donor_name}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                       {donation.blood_group}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-gray-600">
//                     {donation.phone_number}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">
//                       {formatDateTime(donation.donate_date)}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {getDateLabel(donation.donate_status)}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       {getStatusIcon(donation.donate_status)}
//                       <span
//                         className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           donation.donate_status === "Complete"
//                             ? "bg-green-100 text-green-800"
//                             : donation.donate_status === "Reject"
//                             ? "bg-red-100 text-red-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}
//                       >
//                         {donation.donate_status}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button className="text-blue-600 hover:text-blue-900 ">
//                       <Eye
//                         className="h-4 w-4 cursor-pointer mr-3"
//                         onClick={() => handleShowDetails(donation)}
//                       />
//                     </button>
//                     <button className="text-red-600 hover:text-red-900">
//                       <TrashIcon
//                         className="h-4 w-4"
//                         onClick={() => handleDelete(donation.donor_id)}
//                       />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
//           <div className="text-sm text-gray-700">
//             Showing{" "}
//             <span className="font-medium">{filteredDonations.length}</span> of{" "}
//             <span className="font-medium">{donations.length}</span> donations
//           </div>
//           <div className="flex-1 flex justify-end">
//             <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//               <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
//                 Previous
//               </button>
//               <button className="bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
//                 1
//               </button>
//               <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
//                 Next
//               </button>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {isModalOpen && selectedDonor && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-gray-800">Donor Details</h2>
//               <button onClick={closeModal}>
//                 <XIcon className="h-6 w-6 text-gray-600 hover:text-gray-800" />
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <span className="font-medium text-gray-700">Donor Name:</span>{" "}
//                 {selectedDonor.donor_name}
//               </div>
//               <div>
//                 <span className="font-medium text-gray-700">Blood Group:</span>{" "}
//                 {selectedDonor.blood_group}
//               </div>
//               <div>
//                 <span className="font-medium text-gray-700">Email:</span>{" "}
//                 {selectedDonor.email || "N/A"}
//               </div>
//               <div>
//                 <span className="font-medium text-gray-700">Phone Number:</span>{" "}
//                 {selectedDonor.phone_number}
//               </div>
//               <div>
//                 <span className="font-medium text-gray-700">
//                   Last Donation Date:
//                 </span>{" "}
//                 {selectedDonor.last_donation_date || "N/A"}
//               </div>
//               <div>
//                 <span className="font-medium text-gray-700">
//                   {getDateLabel(selectedDonor.donate_status)}:
//                 </span>{" "}
//                 {formatDateTime(selectedDonor.donate_date)}
//               </div>
//               <div className="flex items-center">
//                 <span className="font-medium text-gray-700">Status:</span>
//                 <div className="flex items-center ml-2">
//                   {getStatusIcon(selectedDonor.donate_status)}
//                   <span className="ml-1">{selectedDonor.donate_status}</span>
//                 </div>
//               </div>
//               {selectedDonor.donate_status === "Complete" && (
//                 <div className="bg-green-50 p-3 rounded-md border border-green-200">
//                   <div className="flex items-center text-green-800 text-sm">
//                     <CheckCircleIcon className="h-4 w-4 mr-2" />
//                     <span className="font-medium">Donation completed on:</span>
//                   </div>
//                   <div className="text-green-700 font-medium mt-1">
//                     {formatDateTime(selectedDonor.donate_date)}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {selectedDonor.donate_status === "Complete" && (
//               <div className="mt-6 flex justify-end space-x-4">
//                 <button
//                   className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600 disabled:opacity-50"
//                   disabled={loading}
//                   onClick={() =>
//                     fetchCertificatePreview(selectedDonor.donation_id)
//                   }
//                 >
//                   <BookMarked className="h-4 w-4 mr-1" />
//                   View Certificate
//                 </button>
//                 <button
//                   className="bg-purple-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-purple-600 disabled:opacity-50"
//                   disabled={loading}
//                   onClick={async () => {
//                     try {
//                       const response = await fetch(
//                         `${API_BASE_URL}/sendCertificate?hospital_id=${HOSPITAL_ID}`,
//                         {
//                           method: "POST",
//                           headers: {
//                             "Content-Type": "application/json",
//                           },
//                           body: JSON.stringify({
//                             donation_id: selectedDonor.donation_id,
//                             hospital_name: "City General Hospital",
//                           }),
//                         }
//                       );
//                       if (!response.ok) {
//                         throw new Error("Failed to send certificate");
//                       }
//                       const result = await response.json();
//                       alert(result.message);
//                     } catch (error) {
//                       console.error("Error sending certificate:", error);
//                       alert("Failed to send certificate. Please try again.");
//                     }
//                   }}
//                 >
//                   <svg
//                     className="h-4 w-4 mr-1"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                     />
//                   </svg>
//                   Send Certificate
//                 </button>
//               </div>
//             )}

//             {selectedDonor.donate_status !== "Complete" &&
//               selectedDonor.donate_status !== "Reject" && (
//                 <div className="mt-6 flex justify-end space-x-4">
//                   <button
//                     className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center disabled:opacity-50"
//                     disabled={loading}
//                     onClick={async () => {
//                       await handleUpdateStatus(
//                         selectedDonor.donation_id,
//                         "Complete"
//                       );
//                       closeModal();
//                     }}
//                   >
//                     <CheckCircleIcon className="h-4 w-4 mr-1" />
//                     Mark as Complete
//                   </button>
//                   <button
//                     className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center disabled:opacity-50"
//                     disabled={loading}
//                     onClick={async () => {
//                       await handleUpdateStatus(
//                         selectedDonor.donation_id,
//                         "Reject"
//                       );
//                       closeModal();
//                     }}
//                   >
//                     <XCircleIcon className="h-4 w-4 mr-1" />
//                     Mark as Reject
//                   </button>
//                 </div>
//               )}

//             {loading && (
//               <div className="mt-4 text-center">
//                 <div className="inline-flex items-center px-4 py-2 font-medium text-blue-600">
//                   <svg
//                     className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     />
//                   </svg>
//                   Updating...
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {isCertificateModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-gray-800">
//                 Donation Certificate Preview
//               </h2>
//               <button onClick={closeCertificateModal}>
//                 <XIcon className="h-6 w-6 text-gray-600 hover:text-gray-800" />
//               </button>
//             </div>
//             <div
//               className="certificate-preview"
//               dangerouslySetInnerHTML={{ __html: certificateHtml }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Donors;




// import { useState, useEffect } from "react";
// import {
//   UsersIcon,
//   SearchIcon,
//   TrashIcon,
//   XIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   ClockIcon,
//   BookOpenIcon as BookMarked,
//   Eye,
//   AlertCircle,
// } from "lucide-react";
// import DOMPurify from "dompurify";
// import type { Donation } from "./types/index.ts";
// import axios from "axios";

// interface AuthStatus {
//   isAuthenticated: boolean;
//   userInfo: {
//     email?: string;
//     hospital_id?: number;
//     role?: string;
//   };
// }

// const API_BASE_URL = "http://localhost:9090/hospital";

// const Donors = () => {
//   const [donations, setDonations] = useState<Donation[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedDonor, setSelectedDonor] = useState<Donation | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
//   const [certificateHtml, setCertificateHtml] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [authStatus, setAuthStatus] = useState<AuthStatus>({
//     isAuthenticated: false,
//     userInfo: {},
//   });

//   useEffect(() => {
//     axios.defaults.withCredentials = true;
//   }, []);

//   // ✅ Authentication
//   const checkAuth = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/profile`);
//       if (res.data.status === "success") {
//         setAuthStatus({
//           isAuthenticated: true,
//           userInfo: res.data.data,
//         });
//         return true;
//       } else {
//         throw new Error(res.data.message || "Authentication failed");
//       }
//     } catch (error) {
//       console.error("Auth check failed:", error);
//       setAuthStatus({ isAuthenticated: false, userInfo: {} });
//       setError("Authentication required. Please login first.");
//       return false;
//     }
//   };

//   // ✅ Fetch Donations
//   const fetchDonations = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await axios.get(`${API_BASE_URL}/donationsWithDonors`);
//       if (response.data.status === "success") {
//         const mappedDonations = response.data.data.map((item: any) => ({
//           donation_id: item.donation_id,
//           donor_id: item.donor_id,
//           donor_name: item.donor_name || "",
//           email: item.email || null,
//           blood_group: item.blood_group || "",
//           phone_number: item.phone_number || null,
//           donate_date: item.donate_date || null,
//           donate_status: item.donate_status || "Pending",
//           last_donation_date: item.last_donation_date || null,
//         })) as Donation[];
//         setDonations(mappedDonations);
//       } else {
//         throw new Error(response.data.message || "Failed to fetch donations");
//       }
//     } catch (error) {
//       console.error("Error fetching donations:", error);
//       setError("Failed to fetch donations. Please try again.");
//       setDonations([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const initializeComponent = async () => {
//       setLoading(true);
//       const isAuthenticated = await checkAuth();
//       if (isAuthenticated) {
//         await fetchDonations();
//       }
//       setLoading(false);
//     };
//     initializeComponent();
//   }, []);

//   // ✅ Update Donation Status
//   const handleUpdateStatus = async (donationId: number, newStatus: string) => {
//     setLoading(true);
//     try {
//       const response = await axios.post(`${API_BASE_URL}/updateStatus`, {
//         donation_id: donationId,
//         new_status: newStatus,
//       });

//       if (response.data.status === "success") {
//         if (newStatus === "Complete") {
//           try {
//             const certificateResponse = await axios.post(
//               `${API_BASE_URL}/sendCertificate`,
//               { donation_id: donationId, hospital_name: "City General Hospital" }
//             );
//             alert(
//               certificateResponse.data.message ||
//                 "Certificate sent successfully!"
//             );
//           } catch (certError) {
//             console.error("Certificate sending failed:", certError);
//             alert(
//               "Status updated successfully, but failed to send certificate."
//             );
//           }
//         }
//         await fetchDonations();
//         alert(response.data.message || "Status updated successfully!");
//       } else {
//         throw new Error(response.data.message || "Failed to update status");
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       setError("Failed to update donation status.");
//     } finally {
//       setLoading(false);
//       closeModal();
//     }
//   };

//   // ✅ Certificate Preview
//   const fetchCertificatePreview = async (donationId: number) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/certificatePreview/${donationId}?hospital_name=City General Hospital`
//       );
//       if (response.data.status === "success") {
//         setCertificateHtml(DOMPurify.sanitize(response.data.html));
//         setIsCertificateModalOpen(true);
//       } else {
//         throw new Error("Certificate preview not available");
//       }
//     } catch (error) {
//       console.error("Error fetching certificate preview:", error);
//       setError("Failed to load certificate preview.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Donor Details Modal
//   const handleShowDetails = (donation: Donation) => {
//     setSelectedDonor(donation);
//     setIsModalOpen(true);
//   };

//   // ✅ Delete Donor
//   const handleDelete = async (donor_id: number) => {
//     if (confirm("Are you sure you want to delete this donor?")) {
//       try {
//         const response = await axios.delete(
//           `${API_BASE_URL}/donors/${donor_id}`
//         );
//         if (response.data.status === "success") {
//           alert(response.data.message || "Donor deactivated successfully");
//           await fetchDonations();
//         } else {
//           throw new Error("Failed to delete donor");
//         }
//       } catch (err) {
//         console.error("Error deleting donor", err);
//         setError("Failed to delete donor. Please try again.");
//       }
//     }
//   };

//   // ✅ Helpers
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedDonor(null);
//   };

//   const closeCertificateModal = () => {
//     setIsCertificateModalOpen(false);
//     setCertificateHtml("");
//   };

//   const formatDateTime = (dateTime: string | null | undefined) => {
//     if (!dateTime) return "N/A";
//     try {
//       return new Date(dateTime).toLocaleString();
//     } catch {
//       return dateTime;
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "Complete":
//         return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
//       case "Reject":
//         return <XCircleIcon className="h-4 w-4 text-red-600" />;
//       default:
//         return <ClockIcon className="h-4 w-4 text-yellow-600" />;
//     }
//   };

//   const getDateLabel = (status: string) =>
//     status === "Complete" ? "Completion Date" : "Donation Date";

//   const filteredDonations = donations.filter(
//     (donation) =>
//       donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       donation.blood_group.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // ✅ Auth Block
//   if (!authStatus.isAuthenticated) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center bg-white p-8 rounded-lg shadow-lg border border-gray-200">
//           <AlertCircle className="h-16 w-16 text-blue-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold mb-2 text-gray-800">
//             Authentication Required
//           </h2>
//           <p className="text-gray-600 mb-4">
//             Please login to access the donation management system.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative">
//       {/* HEADER */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center">
//           <UsersIcon className="h-6 w-6 text-blue-500 mr-2" />
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">
//               Donation Management
//             </h1>
//           </div>
//         </div>
//       </div>

//       {/* SEARCH */}
//       <div className="flex items-center mb-4">
//         <SearchIcon className="h-5 w-5 text-gray-400 mr-2" />
//         <input
//           type="text"
//           placeholder="Search donors by name or blood group..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="flex-1 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* TABLE */}
//       <div className="overflow-x-auto bg-white rounded-lg shadow">
//         <table className="min-w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-100 text-gray-700 text-sm">
//               <th className="p-3 text-left">Name</th>
//               <th className="p-3 text-left">Blood Group</th>
//               <th className="p-3 text-left">Phone</th>
//               <th className="p-3 text-left">Status</th>
//               <th className="p-3 text-left">Date</th>
//               <th className="p-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredDonations.map((donation) => (
//               <tr key={donation.donation_id} className="border-b">
//                 <td className="p-3">{donation.donor_name}</td>
//                 <td className="p-3">{donation.blood_group}</td>
//                 <td className="p-3">{donation.phone_number || "N/A"}</td>
//                 <td className="p-3 flex items-center space-x-2">
//                   {getStatusIcon(donation.donate_status)}
//                   <span>{donation.donate_status}</span>
//                 </td>
//                 <td className="p-3">
//                   {formatDateTime(
//                     donation.donate_status === "Complete"
//                       ? donation.last_donation_date
//                       : donation.donate_date
//                   )}
//                 </td>
//                 <td className="p-3 flex space-x-2">
//                   <button
//                     onClick={() => handleShowDetails(donation)}
//                     className="text-blue-600 hover:text-blue-800"
//                   >
//                     <Eye className="h-4 w-4" />
//                   </button>
//                   <button
//                     onClick={() => fetchCertificatePreview(donation.donation_id)}
//                     className="text-green-600 hover:text-green-800"
//                   >
//                     <BookMarked className="h-4 w-4" />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(donation.donor_id)}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     <TrashIcon className="h-4 w-4" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {filteredDonations.length === 0 && (
//               <tr>
//                 <td colSpan={6} className="p-6 text-center text-gray-500">
//                   No donors found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* DONOR MODAL */}
//       {isModalOpen && selectedDonor && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-bold text-gray-800">
//                 Donor Details
//               </h2>
//               <button
//                 onClick={closeModal}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <XIcon className="h-5 w-5" />
//               </button>
//             </div>
//             <p>
//               <strong>Name:</strong> {selectedDonor.donor_name}
//             </p>
//             <p>
//               <strong>Email:</strong> {selectedDonor.email || "N/A"}
//             </p>
//             <p>
//               <strong>Phone:</strong> {selectedDonor.phone_number || "N/A"}
//             </p>
//             <p>
//               <strong>Status:</strong> {selectedDonor.donate_status}
//             </p>
//             <p>
//               <strong>{getDateLabel(selectedDonor.donate_status)}:</strong>{" "}
//               {formatDateTime(
//                 selectedDonor.donate_status === "Complete"
//                   ? selectedDonor.last_donation_date
//                   : selectedDonor.donate_date
//               )}
//             </p>
//             <div className="mt-4 flex space-x-2">
//               <button
//                 onClick={() =>
//                   handleUpdateStatus(selectedDonor.donation_id, "Complete")
//                 }
//                 className="px-4 py-2 bg-green-500 text-white rounded-lg"
//               >
//                 Mark Complete
//               </button>
//               <button
//                 onClick={() =>
//                   handleUpdateStatus(selectedDonor.donation_id, "Reject")
//                 }
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg"
//               >
//                 Reject
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* CERTIFICATE MODAL */}
//       {isCertificateModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg overflow-y-auto max-h-screen">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-bold text-gray-800">
//                 Certificate Preview
//               </h2>
//               <button
//                 onClick={closeCertificateModal}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <XIcon className="h-5 w-5" />
//               </button>
//             </div>
//             <div
//               dangerouslySetInnerHTML={{ __html: certificateHtml }}
//               className="prose max-w-none"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Donors;





// import { useState, useEffect } from "react";
// import {
//   UsersIcon,
//   SearchIcon,
//   TrashIcon,
//   XIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   ClockIcon,
//   BookOpenIcon as BookMarked,
//   Eye,
//   AlertCircle,
//   CheckIcon,
//   AlertTriangleIcon,
//   FilterIcon,
//   RefreshCwIcon,
//   HeartIcon,
// } from "lucide-react";
// import axios from "axios";
// import CertificatePreview from './components/CertificatePreview';

// interface Donation {
//   donation_id: number;
//   donor_id: number;
//   donor_name: string;
//   email: string | null;
//   blood_group: string;
//   phone_number: string | null;
//   donate_date: string | null;
//   donate_status: string;
//   last_donation_date: string | null;
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

// const Donors = () => {
//   const [donations, setDonations] = useState<Donation[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [selectedDonor, setSelectedDonor] = useState<Donation | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//   const [confirmAction, setConfirmAction] = useState<{
//     type: string;
//     title: string;
//     message: string;
//     action: () => void;
//   } | null>(null);
//   const [certificateContent, setCertificateContent] = useState<React.ReactNode | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [authStatus, setAuthStatus] = useState<AuthStatus>({
//     isAuthenticated: false,
//     userInfo: {},
//   });

//   useEffect(() => {
//     axios.defaults.withCredentials = true;
//   }, []);

//   // Authentication
//   const checkAuth = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/profile`);
//       if (res.data.status === "success") {
//         setAuthStatus({
//           isAuthenticated: true,
//           userInfo: res.data.data,
//         });
//         return true;
//       } else {
//         throw new Error(res.data.message || "Authentication failed");
//       }
//     } catch (error) {
//       console.error("Auth check failed:", error);
//       setAuthStatus({ isAuthenticated: false, userInfo: {} });
//       setError("Authentication required. Please login first.");
//       return false;
//     }
//   };

//   // Fetch Donations
//   const fetchDonations = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await axios.get(`${API_BASE_URL}/donationsWithDonors`);
//       if (response.data.status === "success") {
//         const mappedDonations = response.data.data.map((item: any) => ({
//           donation_id: item.donation_id,
//           donor_id: item.donor_id,
//           donor_name: item.donor_name || "",
//           email: item.email || null,
//           blood_group: item.blood_group || "",
//           phone_number: item.phone_number || null,
//           donate_date: item.donate_date || null,
//           donate_status: item.donate_status || "Pending",
//           last_donation_date: item.last_donation_date || null,
//         })) as Donation[];
//         setDonations(mappedDonations);
//       } else {
//         throw new Error(response.data.message || "Failed to fetch donations");
//       }
//     } catch (error) {
//       console.error("Error fetching donations:", error);
//       setError("Failed to fetch donations. Please try again.");
//       setDonations([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const initializeComponent = async () => {
//       setLoading(true);
//       const isAuthenticated = await checkAuth();
//       if (isAuthenticated) {
//         await fetchDonations();
//       }
//       setLoading(false);
//     };
//     initializeComponent();
//   }, []);

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

//   // Update Donation Status
//   const handleUpdateStatus = async (donationId: number, newStatus: string) => {
//     const donation = donations.find(d => d.donation_id === donationId);
//     if (!donation) return;

//     // Prevent status change if already Complete or Rejected
//     if (donation.donate_status !== "Pending") {
//       showConfirmation(
//         "error",
//         "Status Change Not Allowed",
//         `Cannot change status from ${donation.donate_status}. Only Pending donations can be marked as Complete or Rejected.`,
//         () => {}
//       );
//       return;
//     }

//     const action = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(`${API_BASE_URL}/updateStatus`, {
//           donation_id: donationId,
//           new_status: newStatus,
//         });

//         if (response.data.status === "success") {
//           if (newStatus === "Complete") {
//             try {
//               const certificateResponse = await axios.post(
//                 `${API_BASE_URL}/sendCertificate`,
//                 { donation_id: donationId, hospital_name: "City General Hospital" }
//               );
//               showConfirmation(
//                 "success",
//                 "Certificate Sent!",
//                 certificateResponse.data.message || "The donation certificate has been sent to the donor's email address.",
//                 () => {}
//               );
//             } catch (certError) {
//               console.error("Certificate sending failed:", certError);
//               showConfirmation(
//                 "warning",
//                 "Status Updated",
//                 "Status updated successfully, but failed to send certificate.",
//                 () => {}
//               );
//             }
//           }
//           await fetchDonations();
//           closeModal();
//         } else {
//           throw new Error(response.data.message || "Failed to update status");
//         }
//       } catch (error) {
//         console.error("Error updating status:", error);
//         setError("Failed to update donation status.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const statusText = newStatus === "Complete" ? "complete" : "reject";
//     const message = newStatus === "Complete" 
//       ? "This will mark the donation as complete and send a certificate to the donor."
//       : "This will reject the donation. This action cannot be undone.";

//     showConfirmation(
//       newStatus === "Complete" ? "success" : "warning",
//       `Confirm ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`,
//       message,
//       action
//     );
//   };

//   // Certificate Preview
//   const fetchCertificatePreview = async (donationId: number) => {
//     const donation = donations.find(d => d.donation_id === donationId);
//     if (!donation) return;

//     if (donation.donate_status === "Reject") {
//       showConfirmation(
//         "error",
//         "Certificate Not Available",
//         "Certificate preview is not available for rejected donations.",
//         () => {}
//       );
//       return;
//     }

//     if (donation.donate_status === "Pending") {
//       showConfirmation(
//         "warning",
//         "Certificate Not Ready",
//         "Certificate will be available after the donation is marked as complete.",
//         () => {}
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       setCertificateContent(
//         <CertificatePreview 
//           donation={donation}
//           hospitalName="City General Hospital"
//         />
//       );
//       setIsCertificateModalOpen(true);
//     } catch (error) {
//       console.error("Error preparing certificate preview:", error);
//       setError("Failed to load certificate preview.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete Donor
//   const handleDelete = async (donor_id: number) => {
//     const donor = donations.find(d => d.donor_id === donor_id);
//     if (!donor) return;

//     showConfirmation(
//       "warning",
//       "Delete Donor",
//       `Are you sure you want to delete ${donor.donor_name}? This action cannot be undone.`,
//       async () => {
//         setLoading(true);
//         try {
//           const response = await axios.delete(
//             `${API_BASE_URL}/donors/${donor_id}`
//           );
//           if (response.data.status === "success") {
//             showConfirmation(
//               "success",
//               "Donor Deleted",
//               response.data.message || "Donor deactivated successfully",
//               () => {}
//             );
//             await fetchDonations();
//           } else {
//             throw new Error("Failed to delete donor");
//           }
//         } catch (err) {
//           console.error("Error deleting donor", err);
//           setError("Failed to delete donor. Please try again.");
//         } finally {
//           setLoading(false);
//         }
//       }
//     );
//   };

//   // Helper functions
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedDonor(null);
//   };

//   const closeCertificateModal = () => {
//     setIsCertificateModalOpen(false);
//     setCertificateContent(null);
//   };

//   const formatDateTime = (dateTime: string | null | undefined) => {
//     if (!dateTime) return "N/A";
//     try {
//       return new Date(dateTime).toLocaleString();
//     } catch {
//       return dateTime;
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "Complete":
//         return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
//       case "Reject":
//         return <XCircleIcon className="h-4 w-4 text-red-600" />;
//       default:
//         return <ClockIcon className="h-4 w-4 text-yellow-600" />;
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1";
//     switch (status) {
//       case "Complete":
//         return `${baseClasses} bg-green-100 text-green-800`;
//       case "Reject":
//         return `${baseClasses} bg-red-100 text-red-800`;
//       default:
//         return `${baseClasses} bg-yellow-100 text-yellow-800`;
//     }
//   };

//   const getDateLabel = (status: string) =>
//     status === "Complete" ? "Completion Date" : "Donation Date";

//   const filteredDonations = donations.filter(donation => {
//     const matchesSearch = 
//       donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       donation.blood_group.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (donation.email && donation.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
//     const matchesFilter = statusFilter === "All" || donation.donate_status === statusFilter;
    
//     return matchesSearch && matchesFilter;
//   });

//   const stats = {
//     total: donations.length,
//     complete: donations.filter(d => d.donate_status === "Complete").length,
//     pending: donations.filter(d => d.donate_status === "Pending").length,
//     rejected: donations.filter(d => d.donate_status === "Reject").length,
//   };

//   // Donor Details Handler
//   const handleShowDetails = (donation: Donation) => {
//     setSelectedDonor(donation);
//     setIsModalOpen(true);
//   };

//   if (!authStatus.isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
//         <div className="text-center bg-white p-8 rounded-2xl shadow-2xl border border-red-100 max-w-md w-full">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <AlertCircle className="h-8 w-8 text-red-600" />
//           </div>
//           <h2 className="text-2xl font-bold mb-2 text-gray-800">
//             Authentication Required
//           </h2>
//           <p className="text-gray-600 mb-6">
//             Please login to access the donation management system.
//           </p>
//           <button className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold">
//             Login to Continue
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-red-100">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
//                 <HeartIcon className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-800">
//                   Donation Management
//                 </h1>
//                 <p className="text-gray-600">Manage blood donations and certificates</p>
//               </div>
//             </div>
//             <button 
//               onClick={() => fetchDonations()}
//               className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
//               disabled={loading}
//             >
//               <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//           <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
//             <div className="flex items-center">
//               <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <UsersIcon className="h-5 w-5 text-blue-600" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-gray-500 text-sm">Total Donors</p>
//                 <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
//             <div className="flex items-center">
//               <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//                 <CheckCircleIcon className="h-5 w-5 text-green-600" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-gray-500 text-sm">Completed</p>
//                 <p className="text-2xl font-bold text-gray-800">{stats.complete}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
//             <div className="flex items-center">
//               <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
//                 <ClockIcon className="h-5 w-5 text-yellow-600" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-gray-500 text-sm">Pending</p>
//                 <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
//             <div className="flex items-center">
//               <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
//                 <XCircleIcon className="h-5 w-5 text-red-600" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-gray-500 text-sm">Rejected</p>
//                 <p className="text-2xl font-bold text-gray-800">{stats.rejected}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters and Search */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-red-100">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//                 <input
//                   type="text"
//                   placeholder="Search by name, blood group, or email..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                 />
//               </div>
//             </div>
//             <div className="relative">
//               <FilterIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
//               >
//                 <option value="All">All Status</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Complete">Complete</option>
//                 <option value="Reject">Rejected</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-red-100">
//           <div className="overflow-x-auto">
//             <table className="min-w-full">
//               <thead className="bg-gradient-to-r from-red-50 to-red-100">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Donor</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Blood Group</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {filteredDonations.map((donation, index) => (
//                   <tr 
//                     key={donation.donation_id} 
//                     className={`hover:bg-red-25 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
//                   >
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
//                           {donation.donor_name.charAt(0)}
//                         </div>
//                         <div>
//                           <div className="font-semibold text-gray-800">{donation.donor_name}</div>
//                           <div className="text-sm text-gray-500">ID: #{donation.donor_id}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
//                         {donation.blood_group}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm">
//                         <div className="text-gray-800">{donation.phone_number || "N/A"}</div>
//                         <div className="text-gray-500">{donation.email || "N/A"}</div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={getStatusBadge(donation.donate_status)}>
//                         {getStatusIcon(donation.donate_status)}
//                         {donation.donate_status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {formatDateTime(
//                         donation.donate_status === "Complete"
//                           ? donation.last_donation_date
//                           : donation.donate_date
//                       )}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleShowDetails(donation)}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                           title="View Details"
//                         >
//                           <Eye className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => fetchCertificatePreview(donation.donation_id)}
//                           className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                           title="Certificate Preview"
//                         >
//                           <BookMarked className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(donation.donor_id)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                           title="Delete Donor"
//                         >
//                           <TrashIcon className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
            
//             {filteredDonations.length === 0 && (
//               <div className="text-center py-12">
//                 <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500 text-lg">No donors found</p>
//                 <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Donor Details Modal */}
//         {isModalOpen && selectedDonor && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-bold text-gray-800 flex items-center">
//                   <Eye className="h-5 w-5 mr-2 text-blue-600" />
//                   Donor Details
//                 </h2>
//                 <button
//                   onClick={closeModal}
//                   className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
//                 >
//                   <XIcon className="h-5 w-5" />
//                 </button>
//               </div>
              
//               <div className="space-y-4">
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <label className="text-sm font-semibold text-gray-600">Name</label>
//                   <p className="text-gray-800">{selectedDonor.donor_name}</p>
//                 </div>
                
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <label className="text-sm font-semibold text-gray-600">Email</label>
//                   <p className="text-gray-800">{selectedDonor.email || "N/A"}</p>
//                 </div>
                
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <label className="text-sm font-semibold text-gray-600">Phone</label>
//                   <p className="text-gray-800">{selectedDonor.phone_number || "N/A"}</p>
//                 </div>
                
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <label className="text-sm font-semibold text-gray-600">Blood Group</label>
//                   <p className="text-gray-800">
//                     <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
//                       {selectedDonor.blood_group}
//                     </span>
//                   </p>
//                 </div>
                
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <label className="text-sm font-semibold text-gray-600">Status</label>
//                   <p className="text-gray-800">
//                     <span className={getStatusBadge(selectedDonor.donate_status)}>
//                       {getStatusIcon(selectedDonor.donate_status)}
//                       {selectedDonor.donate_status}
//                     </span>
//                   </p>
//                 </div>
                
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <label className="text-sm font-semibold text-gray-600">
//                     {getDateLabel(selectedDonor.donate_status)}
//                   </label>
//                   <p className="text-gray-800">
//                     {formatDateTime(
//                       selectedDonor.donate_status === "Complete"
//                         ? selectedDonor.last_donation_date
//                         : selectedDonor.donate_date
//                     )}
//                   </p>
//                 </div>
//               </div>
              
//               {selectedDonor.donate_status === "Pending" ? (
//                 <div className="mt-6 flex space-x-3">
//                   <button
//                     onClick={() => handleUpdateStatus(selectedDonor.donation_id, "Complete")}
//                     className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
//                     disabled={loading}
//                   >
//                     <CheckIcon className="h-4 w-4" />
//                     Mark Complete
//                   </button>
//                   <button
//                     onClick={() => handleUpdateStatus(selectedDonor.donation_id, "Reject")}
//                     className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
//                     disabled={loading}
//                   >
//                     <XIcon className="h-4 w-4" />
//                     Reject
//                   </button>
//                 </div>
//               ) : (
//                 <div className="mt-6 text-center">
//                   <p className="text-gray-600">
//                     Status is {selectedDonor.donate_status}. No further changes allowed.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Certificate Preview Modal */}
//         {isCertificateModalOpen && certificateContent && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl p-6 w-full max-w-5xl max-h-[95vh] shadow-2xl border border-gray-200 overflow-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold text-gray-800 flex items-center">
//                   <BookMarked className="h-5 w-5 mr-2 text-green-600" />
//                   Certificate Preview
//                 </h2>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => window.print()}
//                     className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
//                   >
//                     Print
//                   </button>
//                   <button
//                     onClick={closeCertificateModal}
//                     className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
//                   >
//                     <XIcon className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//               <div className="overflow-hidden border rounded-lg bg-gray-50">
//                 {certificateContent}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Confirmation Modal */}
//         {isConfirmModalOpen && confirmAction && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
//               <div className="text-center">
//                 <div className="mb-4">
//                   {confirmAction.type === "success" && (
//                     <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
//                       <CheckCircleIcon className="h-8 w-8 text-green-600" />
//                     </div>
//                   )}
//                   {confirmAction.type === "warning" && (
//                     <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
//                       <AlertTriangleIcon className="h-8 w-8 text-yellow-600" />
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
                
//                 <p className="text-gray-600 mb-6">
//                   {confirmAction.message}
//                 </p>
                
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
//         {loading && (
//           <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
//             <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200">
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
//                     <XIcon className="h-4 w-4" />
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

// export default Donors;





import { useState, useEffect } from "react";
import {
  UsersIcon,
  SearchIcon,
  TrashIcon,
  XIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BookOpenIcon as BookMarked,
  Eye,
  AlertCircle,
  CheckIcon,
  AlertTriangleIcon,
  FilterIcon,
  HeartIcon,
  EditIcon,
} from "lucide-react";
import axios from "axios";
import CertificatePreview from './components/CertificatePreview';

interface Donation {
  donation_id: number;
  donor_id: number;
  donor_name: string;
  email: string | null;
  blood_group: string;
  phone_number: string | null;
  donate_date: string | null;
  donate_status: string;
  last_donation_date: string | null;
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

const Donors = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDonor, setSelectedDonor] = useState<Donation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);
  const [selectedDonationForStatusChange, setSelectedDonationForStatusChange] = useState<Donation | null>(null);
  const [newStatusSelection, setNewStatusSelection] = useState<string>("");
  const [confirmAction, setConfirmAction] = useState<{
    type: string;
    title: string;
    message: string;
    action: () => void;
  } | null>(null);
  const [certificateContent, setCertificateContent] = useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    userInfo: {},
  });

  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  // Authentication
  const checkAuth = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/profile`);
      if (res.data.status === "success") {
        setAuthStatus({
          isAuthenticated: true,
          userInfo: res.data.data,
        });
        return true;
      } else {
        throw new Error(res.data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthStatus({ isAuthenticated: false, userInfo: {} });
      setError("Authentication required. Please login first.");
      return false;
    }
  };

  // Fetch Donations
  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/donationsWithDonors`);
      if (response.data.status === "success") {
        const mappedDonations = response.data.data.map((item: any) => ({
          donation_id: item.donation_id,
          donor_id: item.donor_id,
          donor_name: item.donor_name || "",
          email: item.email || null,
          blood_group: item.blood_group || "",
          phone_number: item.phone_number || null,
          donate_date: item.donate_date || null,
          donate_status: item.donate_status || "Pending",
          last_donation_date: item.last_donation_date || null,
        })) as Donation[];
        setDonations(mappedDonations);
      } else {
        throw new Error(response.data.message || "Failed to fetch donations");
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
      setError("Failed to fetch donations. Please try again.");
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeComponent = async () => {
      setLoading(true);
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        await fetchDonations();
      }
      setLoading(false);
    };
    initializeComponent();
  }, []);

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

  // Open status change modal
  const openStatusChangeModal = (donation: Donation) => {
    setSelectedDonationForStatusChange(donation);
    setNewStatusSelection(donation.donate_status);
    setIsStatusChangeModalOpen(true);
  };

  // Close status change modal
  const closeStatusChangeModal = () => {
    setSelectedDonationForStatusChange(null);
    setNewStatusSelection("");
    setIsStatusChangeModalOpen(false);
  };

  // Handle status change from modal
  const handleStatusChangeFromModal = () => {
    if (!selectedDonationForStatusChange || !newStatusSelection) return;
    
    if (newStatusSelection === selectedDonationForStatusChange.donate_status) {
      closeStatusChangeModal();
      return;
    }

    const donation = selectedDonationForStatusChange;
    const oldStatus = donation.donate_status;
    const newStatus = newStatusSelection;

    let warningMessage = "";
    if (oldStatus === "Complete" && newStatus !== "Complete") {
      warningMessage = "This donation was previously marked as Complete. Changing the status will affect the donation record.";
    } else if (oldStatus === "Reject" && newStatus !== "Reject") {
      warningMessage = "This donation was previously rejected. Changing the status will reactivate the donation.";
    } else if (newStatus === "Complete") {
      warningMessage = "This will mark the donation as complete and may send a certificate to the donor.";
    } else if (newStatus === "Reject") {
      warningMessage = "This will reject the donation.";
    }

    const action = async () => {
      await handleUpdateStatus(donation.donation_id, newStatus, true);
      closeStatusChangeModal();
    };

    showConfirmation(
      "warning",
      `Change Status to ${newStatus}`,
      `${warningMessage} Are you sure you want to proceed?`,
      action
    );
  };

  // Update Donation Status (modified to allow all changes)
  const handleUpdateStatus = async (donationId: number, newStatus: string, fromModal: boolean = false) => {
    const donation = donations.find(d => d.donation_id === donationId);
    if (!donation) return;

    // If not from modal and status is not Pending, open status change modal instead
    if (!fromModal && donation.donate_status !== "Pending") {
      openStatusChangeModal(donation);
      return;
    }

    // If from modal, we already have confirmation, so proceed directly
    if (fromModal) {
      await executeStatusUpdate(donationId, newStatus);
      return;
    }

    // Original logic for Pending donations
    const action = async () => {
      await executeStatusUpdate(donationId, newStatus);
    };

    const statusText = newStatus === "Complete" ? "complete" : "reject";
    const message = newStatus === "Complete" 
      ? "This will mark the donation as complete and send a certificate to the donor."
      : "This will reject the donation.";

    showConfirmation(
      newStatus === "Complete" ? "success" : "warning",
      `Confirm ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`,
      message,
      action
    );
  };

  // Execute status update
  const executeStatusUpdate = async (donationId: number, newStatus: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/updateStatus`, {
        donation_id: donationId,
        new_status: newStatus,
      });

      if (response.data.status === "success") {
        if (newStatus === "Complete") {
          try {
            const certificateResponse = await axios.post(
              `${API_BASE_URL}/sendCertificate`,
              { donation_id: donationId, hospital_name: "City General Hospital" }
            );
            showConfirmation(
              "success",
              "Certificate Sent!",
              certificateResponse.data.message || "The donation certificate has been sent to the donor's email address.",
              () => {}
            );
          } catch (certError) {
            console.error("Certificate sending failed:", certError);
            showConfirmation(
              "warning",
              "Status Updated",
              "Status updated successfully, but failed to send certificate.",
              () => {}
            );
          }
        } else {
          showConfirmation(
            "success",
            "Status Updated",
            `Donation status has been updated to ${newStatus}.`,
            () => {}
          );
        }
        await fetchDonations();
        closeModal();
      } else {
        throw new Error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update donation status.");
    } finally {
      setLoading(false);
    }
  };

  // Certificate Preview
  const fetchCertificatePreview = async (donationId: number) => {
    const donation = donations.find(d => d.donation_id === donationId);
    if (!donation) return;

    if (donation.donate_status === "Reject") {
      showConfirmation(
        "error",
        "Certificate Not Available",
        "Certificate preview is not available for rejected donations.",
        () => {}
      );
      return;
    }

    if (donation.donate_status === "Pending") {
      showConfirmation(
        "warning",
        "Certificate Not Ready",
        "Certificate will be available after the donation is marked as complete.",
        () => {}
      );
      return;
    }

    setLoading(true);
    try {
      setCertificateContent(
        <CertificatePreview 
          donation={donation}
          hospitalName="City General Hospital"
        />
      );
      setIsCertificateModalOpen(true);
    } catch (error) {
      console.error("Error preparing certificate preview:", error);
      setError("Failed to load certificate preview.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Donor
  const handleDelete = async (donor_id: number) => {
    const donor = donations.find(d => d.donor_id === donor_id);
    if (!donor) return;

    showConfirmation(
      "warning",
      "Delete Donor",
      `Are you sure you want to delete ${donor.donor_name}? This action cannot be undone.`,
      async () => {
        setLoading(true);
        try {
          const response = await axios.delete(
            `${API_BASE_URL}/donors/${donor_id}`
          );
          if (response.data.status === "success") {
            showConfirmation(
              "success",
              "Donor Deleted",
              response.data.message || "Donor deactivated successfully",
              () => {}
            );
            await fetchDonations();
          } else {
            throw new Error("Failed to delete donor");
          }
        } catch (err) {
          console.error("Error deleting donor", err);
          setError("Failed to delete donor. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    );
  };

  // Helper functions
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDonor(null);
  };

  const closeCertificateModal = () => {
    setIsCertificateModalOpen(false);
    setCertificateContent(null);
  };

  const formatDateTime = (dateTime: string | null | undefined) => {
    if (!dateTime) return "N/A";
    try {
      return new Date(dateTime).toLocaleString();
    } catch {
      return dateTime;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Complete":
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case "Reject":
        return <XCircleIcon className="h-4 w-4 text-red-600" />;
      default:
        return <ClockIcon className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1";
    switch (status) {
      case "Complete":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Reject":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  const getDateLabel = (status: string) =>
    status === "Complete" ? "Completion Date" : "Donation Date";

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = 
      donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.blood_group.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (donation.email && donation.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = statusFilter === "All" || donation.donate_status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: donations.length,
    complete: donations.filter(d => d.donate_status === "Complete").length,
    pending: donations.filter(d => d.donate_status === "Pending").length,
    rejected: donations.filter(d => d.donate_status === "Reject").length,
  };

  // Donor Details Handler
  const handleShowDetails = (donation: Donation) => {
    setSelectedDonor(donation);
    setIsModalOpen(true);
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
            Please login to access the donation management system.
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
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Donation Management
                </h1>
                <p className="text-gray-600">Manage blood donations and certificates</p>
              </div>
            </div>
            {/* <button 
              onClick={() => fetchDonations()}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
              disabled={loading}
            >
              <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button> */}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-gray-500 text-sm">Total Donors</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-2xl font-bold text-gray-800">{stats.complete}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircleIcon className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-gray-500 text-sm">Rejected</p>
                <p className="text-2xl font-bold text-gray-800">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-red-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, blood group, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
              </div>
            </div>
            <div className="relative">
              <FilterIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Complete">Complete</option>
                <option value="Reject">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-red-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-red-50 to-red-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Donor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Blood Group</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDonations.map((donation, index) => (
                  <tr 
                    key={donation.donation_id} 
                    className={`hover:bg-red-25 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {donation.donor_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{donation.donor_name}</div>
                          <div className="text-sm text-gray-500">ID: #{donation.donor_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gradient-to-br from-red-400 to-red-500  text-white rounded-full text-sm font-semibold">
                        {donation.blood_group}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-800">{donation.phone_number || "N/A"}</div>
                        <div className="text-gray-500">{donation.email || "N/A"}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(donation.donate_status)}>
                        {getStatusIcon(donation.donate_status)}
                        {donation.donate_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDateTime(
                        donation.donate_status === "Complete"
                          ? donation.last_donation_date
                          : donation.donate_date
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleShowDetails(donation)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {/* <button
                          onClick={() => openStatusChangeModal(donation)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Change Status"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button> */}
                        <button
                          onClick={() => fetchCertificatePreview(donation.donation_id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Certificate Preview"
                        >
                          <BookMarked className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(donation.donor_id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Donor"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredDonations.length === 0 && (
              <div className="text-center py-12">
                <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No donors found</p>
                <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Donor Details Modal */}
        {isModalOpen && selectedDonor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-blue-600" />
                  Donor Details
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-600">Name</label>
                  <p className="text-gray-800">{selectedDonor.donor_name}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-gray-800">{selectedDonor.email || "N/A"}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-600">Phone</label>
                  <p className="text-gray-800">{selectedDonor.phone_number || "N/A"}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-600">Blood Group</label>
                  <p className="text-gray-800">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                      {selectedDonor.blood_group}
                    </span>
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-600">Status</label>
                  <p className="text-gray-800">
                    <span className={getStatusBadge(selectedDonor.donate_status)}>
                      {getStatusIcon(selectedDonor.donate_status)}
                      {selectedDonor.donate_status}
                    </span>
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-600">
                    {getDateLabel(selectedDonor.donate_status)}
                  </label>
                  <p className="text-gray-800">
                    {formatDateTime(
                      selectedDonor.donate_status === "Complete"
                        ? selectedDonor.last_donation_date
                        : selectedDonor.donate_date
                    )}
                  </p>
                </div>
              </div>
              
              {selectedDonor.donate_status === "Pending" ? (
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => handleUpdateStatus(selectedDonor.donation_id, "Complete")}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <CheckIcon className="h-4 w-4" />
                    Mark Complete
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedDonor.donation_id, "Reject")}
                    className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <XIcon className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              ) : (
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => openStatusChangeModal(selectedDonor)}
                    className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <EditIcon className="h-4 w-4" />
                    Change Status
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status Change Modal */}
        {isStatusChangeModalOpen && selectedDonationForStatusChange && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <EditIcon className="h-5 w-5 mr-2 text-orange-600" />
                  Change Donation Status
                </h2>
                <button
                  onClick={closeStatusChangeModal}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center">
                    <AlertTriangleIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm font-semibold text-blue-800">Donor: {selectedDonationForStatusChange.donor_name}</p>
                      <p className="text-xs text-blue-600">Current Status: {selectedDonationForStatusChange.donate_status}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select New Status:
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="pending"
                        name="status"
                        value="Pending"
                        checked={newStatusSelection === "Pending"}
                        onChange={(e) => setNewStatusSelection(e.target.value)}
                        className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                      />
                      <label htmlFor="pending" className="ml-2 flex items-center">
                        <ClockIcon className="h-4 w-4 text-yellow-600 mr-1" />
                        <span className="text-gray-700">Pending</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="complete"
                        name="status"
                        value="Complete"
                        checked={newStatusSelection === "Complete"}
                        onChange={(e) => setNewStatusSelection(e.target.value)}
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <label htmlFor="complete" className="ml-2 flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-gray-700">Complete</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="reject"
                        name="status"
                        value="Reject"
                        checked={newStatusSelection === "Reject"}
                        onChange={(e) => setNewStatusSelection(e.target.value)}
                        className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                      />
                      <label htmlFor="reject" className="ml-2 flex items-center">
                        <XCircleIcon className="h-4 w-4 text-red-600 mr-1" />
                        <span className="text-gray-700">Reject</span>
                      </label>
                    </div>
                  </div>
                </div>

                {selectedDonationForStatusChange.donate_status !== "Pending" && (
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex">
                      <AlertTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-yellow-800">Status Change Warning</p>
                        <p className="text-yellow-700 mt-1">
                          This donation is currently marked as <strong>{selectedDonationForStatusChange.donate_status}</strong>. 
                          Changing the status may affect donation records and certificates.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={closeStatusChangeModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusChangeFromModal}
                  className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                  disabled={loading || newStatusSelection === selectedDonationForStatusChange.donate_status}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Preview Modal */}
        {isCertificateModalOpen && certificateContent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-5xl max-h-[95vh] shadow-2xl border border-gray-200 overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <BookMarked className="h-5 w-5 mr-2 text-green-600" />
                  Certificate Preview
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                  >
                    Print
                  </button>
                  <button
                    onClick={closeCertificateModal}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="overflow-hidden border rounded-lg bg-gray-50">
                {certificateContent}
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
                      <CheckCircleIcon className="h-8 w-8 text-green-600" />
                    </div>
                  )}
                  {confirmAction.type === "warning" && (
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                      <AlertTriangleIcon className="h-8 w-8 text-yellow-600" />
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
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200">
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
                    <XIcon className="h-4 w-4" />
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

export default Donors;