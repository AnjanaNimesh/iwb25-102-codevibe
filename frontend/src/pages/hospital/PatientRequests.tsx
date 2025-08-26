// import React, { useState, useEffect } from "react";
// import { Heart, Search, Plus, Trash2, Edit } from "lucide-react";
// import axios from "axios";

// interface BloodRequest {
//   request_id: number;
//   hospital_id: number;
//   admission_number: string;
//   blood_group: string;
//   units_required: number;
//   request_date: string;
//   request_status: string;
//   notes: string;
// }

// const API_BASE = "http://localhost:9090/hospital";
// const HOSPITAL_ID = 1;

// const PatientRequests = () => {
//   const [requests, setRequests] = useState<BloodRequest[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [showModal, setShowModal] = useState(false);
//   const [editingRequest, setEditingRequest] = useState<BloodRequest | null>(
//     null
//   );
//   const [formData, setFormData] = useState({
//     admission_number: "",
//     blood_group: "A+",
//     units_required: 1,
//     notes: "",
//     request_status: "Pending",
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 5;

//   const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       const res = await axios.get(
//         `${API_BASE}/bloodrequests?hospital_id=${HOSPITAL_ID}`
//       );
//       setRequests(res.data);
//     } catch (err) {
//       console.error("Error fetching requests", err);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (editingRequest) {
//         await axios.put(
//           `${API_BASE}/bloodrequests/${editingRequest.request_id}?hospital_id=${HOSPITAL_ID}`,
//           formData
//         );
//       } else {
//         await axios.post(
//           `${API_BASE}/bloodrequests/add?hospital_id=${HOSPITAL_ID}`,
//           formData
//         );
//       }
//       fetchRequests();
//       resetForm();
//     } catch (err) {
//       console.error("Error saving request", err);
//     }
//   };

//   const handleEdit = (request: BloodRequest) => {
//     setEditingRequest(request);
//     setFormData({
//       admission_number: request.admission_number,
//       blood_group: request.blood_group,
//       units_required: request.units_required,
//       notes: request.notes,
//       request_status: request.request_status,
//     });
//     setShowModal(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (confirm("Are you sure you want to delete this request?")) {
//       try {
//         await axios.delete(
//           `${API_BASE}/bloodrequests/${id}?hospital_id=${HOSPITAL_ID}`
//         );
//         fetchRequests();
//       } catch (err) {
//         console.error("Error deleting request", err);
//       }
//     }
//   };

//   const resetForm = () => {
//     setEditingRequest(null);
//     setFormData({
//       admission_number: "",
//       blood_group: "A+",
//       units_required: 1,
//       notes: "",
//       request_status: "Pending",
//     });
//     setShowModal(false);
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "Approved":
//         return "bg-blue-100 text-blue-800";
//       case "Completed":
//         return "bg-green-100 text-green-800";
//       case "Rejected":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const filteredRequests = requests.filter((request) => {
//     const matchesSearch =
//       request.admission_number
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       request.blood_group.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus =
//       statusFilter === "All" || request.request_status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const totalPages = Math.ceil(filteredRequests.length / pageSize);
//   const currentData = filteredRequests.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center">
//           <Heart className="h-6 w-6 text-red-500 mr-2" />
//           <h1 className="text-2xl font-bold text-gray-800">
//             Patient Blood Requests
//           </h1>
//         </div>
//         <button
//           onClick={() => setShowModal(true)}
//           className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-600 transition-colors"
//         >
//           <Plus className="h-4 w-4 mr-1" />
//           New Request
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//         <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by admission number or blood group..."
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <select
//             className="sm:w-48 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="All">All Statuses</option>
//             <option value="Pending">Pending</option>
//             <option value="Approved">Approved</option>
//             <option value="Completed">Completed</option>
//             <option value="Rejected">Rejected</option>
//           </select>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left">Admission #</th>
//                 <th className="px-6 py-3">Blood Group</th>
//                 <th className="px-6 py-3">Units</th>
//                 <th className="px-6 py-3">Request Date & Time</th>
//                 <th className="px-6 py-3">Status</th>
//                 <th className="px-6 py-3">Notes</th>
//                 <th className="px-6 py-3 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentData.map((request) => (
//                 <tr key={request.request_id}>
//                   <td className="px-6 py-4 text-left">
//                     {request.admission_number}
//                   </td>{" "}
//                   {/* left aligned */}
//                   <td className="px-6 py-4 text-center">
//                     <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">
//                       {request.blood_group}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-center">
//                     {request.units_required}
//                   </td>{" "}
//                   {/* right aligned */}
//                   <td className="px-6 py-4 text-center">
//                     {request.request_date}
//                   </td>{" "}
//                   {/* center aligned */}
//                   <td className="px-6 py-4 text-center">
//                     <span
//                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
//                         request.request_status
//                       )}`}
//                     >
//                       {request.request_status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-center">{request.notes}</td>{" "}
//                   {/* left aligned */}
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button
//                       onClick={() => handleEdit(request)}
//                       className="text-blue-600 hover:text-blue-900 mr-3"
//                       aria-label="Edit request"
//                     >
//                       <Edit className="h-5 w-5" />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(request.request_id)}
//                       className="text-red-600 hover:text-red-900"
//                       aria-label="Delete request"
//                     >
//                       <Trash2 className="h-5 w-5" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex justify-end items-center p-4 gap-2">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((p) => p + 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-md w-full max-w-md">
//             <h2 className="text-lg font-bold mb-4">
//               {editingRequest ? "Edit Blood Request" : "New Blood Request"}
//             </h2>
//             <form onSubmit={handleSubmit}>
//               <p>Admission</p>
//               <input
//                 type="text"
//                 placeholder="Admission #"
//                 required
//                 value={formData.admission_number}
//                 onChange={(e) =>
//                   setFormData({ ...formData, admission_number: e.target.value })
//                 }
//                 className="w-full border mb-3 p-2 rounded"
//               />
//               <p>Blood Group</p>
//               <select
//                 value={formData.blood_group}
//                 onChange={(e) =>
//                   setFormData({ ...formData, blood_group: e.target.value })
//                 }
//                 className="w-full border mb-3 p-2 rounded"
//               >
//                 {bloodGroups.map((bg) => (
//                   <option key={bg}>{bg}</option>
//                 ))}
//               </select>
//               <p>Unit</p>
//               <input
//                 type="number"
//                 min={1}
//                 value={formData.units_required}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     units_required: parseInt(e.target.value),
//                   })
//                 }
//                 className="w-full border mb-3 p-2 rounded"
//               />
//               <p>Note</p>
//               <textarea
//                 placeholder="Notes"
//                 value={formData.notes}
//                 onChange={(e) =>
//                   setFormData({ ...formData, notes: e.target.value })
//                 }
//                 className="w-full border mb-3 p-2 rounded"
//               />
//               {/* Status select */}
//               <p>Status</p>
//               <select
//                 value={formData.request_status}
//                 onChange={(e) =>
//                   setFormData({ ...formData, request_status: e.target.value })
//                 }
//                 className="w-full border mb-3 p-2 rounded"
//               >
//                 <option value="Pending">Pending</option>

//                 <option value="Approved">Approved</option>
//                 <option value="Completed">Completed</option>
//                 <option value="Rejected">Rejected</option>
//               </select>
//               <div className="flex gap-2">
//                 <button
//                   type="submit"
//                   className="bg-red-500 text-white px-4 py-2 rounded"
//                 >
//                   Save
//                 </button>
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="bg-gray-300 px-4 py-2 rounded"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PatientRequests;






// import React, { useState, useEffect } from "react";
// import { Heart, Search, Plus, Trash2, Edit } from "lucide-react";
// import axios from "axios";

// interface BloodRequest {
//   request_id: number
//   hospital_id: number
//   admission_number: string
//   blood_group: string
//   units_required: number
//   request_date: string
//   request_status: string
//   notes: string
// }

// const API_BASE = "http://localhost:9090/hospital";

// const PatientRequests: React.FC = () => {
//   const [requests, setRequests] = useState<BloodRequest[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [showModal, setShowModal] = useState(false);
//   const [editingRequest, setEditingRequest] = useState<BloodRequest | null>(null);

//   const [formData, setFormData] = useState({
//     admission_number: '',
//     blood_group: 'A+',
//     units_required: 1,
//     notes: '',
//     request_status: 'Pending',
//   })

//   const [currentPage, setCurrentPage] = useState(1)
//   const pageSize = 5

//   const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

//   // Configure axios to include credentials (cookies) with every request
//   useEffect(() => {
//     axios.defaults.withCredentials = true;
//     fetchRequests();
//   }, []);


//   const fetchRequests = async (): Promise<void> => {
//     try {

//       const res = await axios.get(`${API_BASE}/bloodrequests`);
      
//       if (res.data.status === "success") {
//         setRequests(res.data.data);
//       } else {
//         console.error("Error fetching requests:", res.data.message);
//         if (res.status === 401) {
//           alert("Authentication required. Please login again.");
//           window.location.href = "/login";
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching requests", err);
//       if (axios.isAxiosError(err) && err.response?.status === 401) {
//         alert("Authentication required. Please login again.");
//         window.location.href = "/login";
//       }

//     }
//   }

//   const handleSubmit = async (e: React.FormEvent): Promise<void> => {
//     e.preventDefault();
//     try {
//       let response;
      
//       if (editingRequest) {

//         response = await axios.put(
//           `${API_BASE}/bloodrequests/${editingRequest.request_id}`,
//           formData
//         );
//       } else {
//         response = await axios.post(
//           `${API_BASE}/bloodrequests/add`,
//           formData
//         );
//       }
      
//       if (response.data.status === "success") {
//         fetchRequests();
//         resetForm();
//         alert(response.data.message);
//       } else {
//         alert("Error: " + response.data.message);
//       }
//     } catch (err) {
//       console.error("Error saving request", err);
//       if (axios.isAxiosError(err)) {
//         if (err.response?.status === 401) {
//           alert("Authentication required. Please login again.");
//           window.location.href = "/login";
//         } else {
//           alert("Error saving request: " + (err.response?.data?.message || err.message));
//         }
//       }

//     }
//   }

//   const handleEdit = (request: BloodRequest): void => {
//     setEditingRequest(request);
//     setFormData({
//       admission_number: request.admission_number,
//       blood_group: request.blood_group,
//       units_required: request.units_required,
//       notes: request.notes,
//       request_status: request.request_status,
//     })
//     setShowModal(true)
//   }

//   const handleDelete = async (id: number): Promise<void> => {
//     if (confirm("Are you sure you want to delete this request?")) {
//       try {
//         const response = await axios.delete(`${API_BASE}/bloodrequests/${id}`);
        
//         if (response.data.status === "success") {
//           fetchRequests();
//           alert(response.data.message);
//         } else {
//           alert("Error: " + response.data.message);
//         }
//       } catch (err) {
//         console.error("Error deleting request", err);
//         if (axios.isAxiosError(err)) {
//           if (err.response?.status === 401) {
//             alert("Authentication required. Please login again.");
//             window.location.href = "/login";
//           } else {
//             alert("Error deleting request: " + (err.response?.data?.message || err.message));
//           }
//         }
//       }
//     }
//   }

//   const resetForm = (): void => {
//     setEditingRequest(null);
//     setFormData({
//       admission_number: "",
//       blood_group: "A+",
//       units_required: 1,
//       notes: "",
//       request_status: "Pending",
//     });
//     setShowModal(false);
//   };


//   const getStatusColor = (status: string): string => {
//     switch (status) {
//       case 'Pending': return 'bg-yellow-100 text-yellow-800'
//       case 'Approved': return 'bg-blue-100 text-blue-800'
//       case 'Completed': return 'bg-green-100 text-green-800'
//       case 'Rejected': return 'bg-red-100 text-red-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const handleUnitsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
//     const value = parseInt(e.target.value);
//     setFormData({
//       ...formData,
//       units_required: isNaN(value) ? 1 : Math.max(1, value),
//     });
//   };

//   const filteredRequests = requests.filter((request) => {
//     const matchesSearch =
//       request.admission_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       request.blood_group.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesStatus =
//       statusFilter === 'All' || request.request_status === statusFilter
//     return matchesSearch && matchesStatus
//   })

//   const totalPages = Math.ceil(filteredRequests.length / pageSize)
//   const currentData = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize)

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center">
//           <Heart className="h-6 w-6 text-red-500 mr-2" />
//           <h1 className="text-2xl font-bold text-gray-800">Patient Blood Requests</h1>
//         </div>
//         <button 
//           onClick={() => setShowModal(true)}
//           className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-600 transition-colors"
//         >
//           <Plus className="h-4 w-4 mr-1" />
//           New Request
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//         <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by admission number or blood group..."
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <select
//             className="sm:w-48 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="All">All Statuses</option>
//             <option value="Pending">Pending</option>
//             <option value="Approved">Approved</option>
//             <option value="Completed">Completed</option>
//             <option value="Rejected">Rejected</option>
//           </select>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left">Admission #</th>
//                 <th className="px-6 py-3">Blood Group</th>
//                 <th className="px-6 py-3">Units</th>
//                 <th className="px-6 py-3">Request Date & Time
//                 </th>
//                 <th className="px-6 py-3">Status</th>
//                 <th className="px-6 py-3">Notes</th>
//                 <th className="px-6 py-3 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentData.map((request) => (
//                 <tr key={request.request_id}>
//                   <td className="px-6 py-4 text-left">
//                     {request.admission_number}
//                   </td>
//                   <td className="px-6 py-4 text-center">
//                     <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">
//                       {request.blood_group}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-center">
//                     {request.units_required}
//                   </td>
//                   <td className="px-6 py-4 text-center">
//                     {request.request_date}
//                   </td>
//                   <td className="px-6 py-4 text-center">
//                     <span
//                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
//                         request.request_status
//                       )}`}
//                     >
//                       {request.request_status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-center">{request.notes}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button
//                       onClick={() => handleEdit(request)}
//                       className="text-blue-600 hover:text-blue-900 mr-3"
//                       aria-label="Edit request"
//                     >
//                       <Edit className="h-5 w-5" />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(request.request_id)}
//                       className="text-red-600 hover:text-red-900"
//                       aria-label="Delete request"
//                     >
//                       <Trash2 className="h-5 w-5" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex justify-end items-center p-4 gap-2">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span>Page {currentPage} of {totalPages}</span>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((p) => p + 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-md w-full max-w-md">
//             <h2 className="text-lg font-bold mb-4">{editingRequest ? 'Edit Blood Request' : 'New Blood Request'}</h2>
//             <form onSubmit={handleSubmit}>
//               <p>Admission Number</p>
//               <input
//                 type="text"
//                 placeholder="Admission #"
//                 required
//                 value={formData.admission_number}
//                 onChange={(e) => setFormData({...formData, admission_number: e.target.value})} 
//                 className="w-full border mb-3 p-2 rounded"
//               />
//               <p>Blood Group</p>
//               <select 
//                 value={formData.blood_group} 
//                 onChange={(e) => setFormData({...formData, blood_group: e.target.value})} 
//                 className="w-full border mb-3 p-2 rounded"
//               >
//                 {bloodGroups.map((bg) => (
//                   <option key={bg} value={bg}>
//                     {bg}
//                   </option>
//                 ))}
//               </select>
//               <p>Units Required</p>
//               <input
//                 type="number"
//                 min={1}
//                 value={formData.units_required}
//                 onChange={handleUnitsChange}
//                 className="w-full border mb-3 p-2 rounded"
//               />
//               <p>Notes</p>
//               <textarea
//                 placeholder="Notes"
//                 value={formData.notes}
//                 onChange={(e) =>
//                   setFormData({ ...formData, notes: e.target.value })
//                 }
//                 className="w-full border mb-3 p-2 rounded"
//               />
//               <p>Status</p>
//               <select
//                 value={formData.request_status}
//                 onChange={(e) => setFormData({ ...formData, request_status: e.target.value })}
//                 className="w-full border mb-3 p-2 rounded"
//               >
//                 <option value="Pending">Pending</option>
//                 <option value="Approved">Approved</option>
//                 <option value="Completed">Completed</option>
//                 <option value="Rejected">Rejected</option>
//               </select>
//               <div className="flex gap-2">
//                 <button
//                   type="submit"
//                   className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                 >
//                   Save
//                 </button>
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default PatientRequests





// import React, { useState, useEffect } from "react";
// import {
//   HeartIcon,
//   SearchIcon,
//   PlusIcon,
//   TrashIcon,
//   EditIcon,
//   CalendarIcon,
//   DropletIcon,
//   FileTextIcon,
//   FilterIcon,
//   AlertCircle,
//   CheckCircleIcon,
//   AlertTriangleIcon,
//   XIcon,
//   RefreshCwIcon,
//   UsersIcon,
// } from "lucide-react";
// import axios from "axios";

// interface BloodRequest {
//   request_id: number;
//   hospital_id: number;
//   admission_number: string;
//   blood_group: string;
//   units_required: number;
//   request_date: string;
//   request_status: string;
//   notes: string;
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

// const PatientRequests: React.FC = () => {
//   const [requests, setRequests] = useState<BloodRequest[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [showModal, setShowModal] = useState(false);
//   const [editingRequest, setEditingRequest] = useState<BloodRequest | null>(null);
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//   const [confirmAction, setConfirmAction] = useState<{
//     type: string;
//     title: string;
//     message: string;
//     action: () => void;
//   } | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [authStatus, setAuthStatus] = useState<AuthStatus>({
//     isAuthenticated: false,
//     userInfo: {},
//   });
//   const [formData, setFormData] = useState({
//     admission_number: "",
//     blood_group: "A+",
//     units_required: 1,
//     notes: "",
//     request_status: "Pending",
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 5;

//   const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

//   // Auto-clear error
//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => setError(null), 8000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   // Configure axios and check authentication
//   useEffect(() => {
//     axios.defaults.withCredentials = true;
//     const initializeComponent = async () => {
//       setIsLoading(true);
//       const isAuthenticated = await checkAuth();
//       if (isAuthenticated) {
//         await fetchRequests();
//       }
//       setIsLoading(false);
//     };
//     initializeComponent();
//   }, []);

//   // Authentication check
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

//   // Fetch requests
//   const fetchRequests = async (): Promise<void> => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const res = await axios.get(`${API_BASE_URL}/bloodrequests`);
//       if (res.data.status === "success") {
//         setRequests(res.data.data);
//       } else {
//         throw new Error(res.data.message || "Error fetching requests");
//       }
//     } catch (err) {
//       console.error("Error fetching requests", err);
//       setError("Failed to fetch requests. Please try again.");
//       setRequests([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

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

//   // Handle form submission
//   const handleSubmit = async (e?: React.FormEvent): Promise<void> => {
//     if (e) e.preventDefault();

//     // Validation
//     if (!formData.admission_number.trim()) {
//       setError("Admission number is required");
//       return;
//     }
//     if (formData.units_required < 1) {
//       setError("Units required must be at least 1");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);
//       let response;
//       if (editingRequest) {
//         response = await axios.put(`${API_BASE_URL}/bloodrequests/${editingRequest.request_id}`, formData);
//       } else {
//         response = await axios.post(`${API_BASE_URL}/bloodrequests/add`, formData);
//       }
//       if (response.data.status === "success") {
//         showConfirmation(
//           "success",
//           editingRequest ? "Request Updated" : "Request Created",
//           response.data.message || `The blood request has been successfully ${editingRequest ? "updated" : "created"}!`,
//           () => {
//             fetchRequests();
//             resetForm();
//           }
//         );
//       } else {
//         throw new Error(response.data.message || "Error saving request");
//       }
//     } catch (err) {
//       console.error("Error saving request", err);
//       setError("Failed to save request. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle edit
//   const handleEdit = (request: BloodRequest): void => {
//     setEditingRequest(request);
//     setFormData({
//       admission_number: request.admission_number,
//       blood_group: request.blood_group,
//       units_required: request.units_required,
//       notes: request.notes,
//       request_status: request.request_status,
//     });
//     setShowModal(true);
//     setError(null);
//   };

//   // Handle delete
//   const handleDelete = (id: number): void => {
//     const request = requests.find((r) => r.request_id === id);
//     if (!request) return;

//     showConfirmation(
//       "warning",
//       "Delete Blood Request",
//       `Are you sure you want to delete the blood request for admission number "${request.admission_number}"? This action cannot be undone.`,
//       async () => {
//         try {
//           setIsLoading(true);
//           setError(null);
//           const response = await axios.delete(`${API_BASE_URL}/bloodrequests/${id}`);
//           if (response.data.status === "success") {
//             showConfirmation(
//               "success",
//               "Request Deleted",
//               response.data.message || "The blood request has been successfully deleted.",
//               () => {
//                 fetchRequests();
//               }
//             );
//           } else {
//             throw new Error(response.data.message || "Error deleting request");
//           }
//         } catch (err) {
//           console.error("Error deleting request", err);
//           setError("Failed to delete request. Please try again.");
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     );
//   };

//   // Reset form
//   const resetForm = (): void => {
//     setEditingRequest(null);
//     setFormData({
//       admission_number: "",
//       blood_group: "A+",
//       units_required: 1,
//       notes: "",
//       request_status: "Pending",
//     });
//     setShowModal(false);
//     setError(null);
//   };

//   // Status badge styling
//   const getStatusBadge = (status: string): string => {
//     const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1";
//     switch (status) {
//       case "Completed":
//         return `${baseClasses} bg-green-100 text-green-800`;
//       case "Rejected":
//         return `${baseClasses} bg-red-100 text-red-800`;
//       case "Approved":
//         return `${baseClasses} bg-blue-100 text-blue-800`;
//       default:
//         return `${baseClasses} bg-yellow-100 text-yellow-800`;
//     }
//   };

//   // Status icon
//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "Completed":
//         return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
//       case "Rejected":
//         return <XIcon className="h-4 w-4 text-red-600" />;
//       case "Approved":
//         return <CheckCircleIcon className="h-4 w-4 text-blue-600" />;
//       default:
//         return <AlertCircle className="h-4 w-4 text-yellow-600" />;
//     }
//   };

//   // Blood group badge styling
//   const getBloodGroupColor = (blood_group: string): string => {
//     const colors = {
//       "A+": "bg-gradient-to-r from-red-400 to-red-500",
//       "A-": "bg-gradient-to-r from-red-500 to-red-600",
//       "B+": "bg-gradient-to-r from-blue-400 to-blue-500",
//       "B-": "bg-gradient-to-r from-blue-500 to-blue-600",
//       "AB+": "bg-gradient-to-r from-purple-400 to-purple-500",
//       "AB-": "bg-gradient-to-r from-purple-500 to-purple-600",
//       "O+": "bg-gradient-to-r from-orange-400 to-orange-500",
//       "O-": "bg-gradient-to-r from-orange-500 to-orange-600",
//     };
//     return colors[blood_group as keyof typeof colors] || "bg-gradient-to-r from-gray-400 to-gray-500";
//   };

//   // Handle units change
//   const handleUnitsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
//     const value = parseInt(e.target.value);
//     setFormData({
//       ...formData,
//       units_required: isNaN(value) ? 1 : Math.max(1, value),
//     });
//   };

//   // Filter requests
//   const filteredRequests = requests.filter((request) => {
//     const matchesSearch =
//       request.admission_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       request.blood_group.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === "All" || request.request_status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   // Stats for cards
//   const stats = {
//     total: requests.length,
//     pending: requests.filter((r) => r.request_status === "Pending").length,
//     approved: requests.filter((r) => r.request_status === "Approved").length,
//     completed: requests.filter((r) => r.request_status === "Completed").length,
//     rejected: requests.filter((r) => r.request_status === "Rejected").length,
//   };

//   // Pagination
//   const totalPages = Math.ceil(filteredRequests.length / pageSize);
//   const currentData = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

//   // Format date
//   const formatDateTime = (dateTime: string | null | undefined) => {
//     if (!dateTime) return "N/A";
//     try {
//       return new Date(dateTime).toLocaleString();
//     } catch {
//       return dateTime;
//     }
//   };

//   // Authentication check UI
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
//             Please login to access the blood request management system.
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
//                   Blood Request Management
//                 </h1>
//                 <p className="text-gray-600">Manage patient blood requests efficiently</p>
//               </div>
//             </div>
//             <button
//               onClick={() => fetchRequests()}
//               className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
//               disabled={isLoading}
//             >
//               <RefreshCwIcon className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
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
//                 <p className="text-gray-500 text-sm">Total Requests</p>
//                 <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
//             <div className="flex items-center">
//               <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
//                 <AlertCircle className="h-5 w-5 text-yellow-600" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-gray-500 text-sm">Pending</p>
//                 <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
//             <div className="flex items-center">
//               <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <CheckCircleIcon className="h-5 w-5 text-blue-600" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-gray-500 text-sm">Approved</p>
//                 <p className="text-2xl font-bold text-gray-800">{stats.approved}</p>
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
//                 <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
//             <div className="flex items-center">
//               <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
//                 <XIcon className="h-5 w-5 text-red-600" />
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
//                   placeholder="Search by admission number or blood group..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>
//             <div className="relative">
//               <FilterIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
//                 disabled={isLoading}
//               >
//                 <option value="All">All Status</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Approved">Approved</option>
//                 <option value="Completed">Completed</option>
//                 <option value="Rejected">Rejected</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         {filteredRequests.length > 0 && (
//           <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-red-100">
//             <div className="overflow-x-auto">
//               <table className="min-w-full">
//                 <thead className="bg-gradient-to-r from-red-50 to-red-100">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Admission Number</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Blood Group</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Units Required</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Request Date</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Notes</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {currentData.map((request, index) => (
//                     <tr
//                       key={request.request_id}
//                       className={`hover:bg-red-25 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
//                     >
//                       <td className="px-6 py-4">
//                         <div className="font-semibold text-gray-800">{request.admission_number}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`px-3 py-1 ${getBloodGroupColor(request.blood_group)} text-white rounded-full text-sm font-semibold`}>
//                           {request.blood_group}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           <DropletIcon className="h-4 w-4 text-red-600 mr-2" />
//                           <span className="text-gray-800">{request.units_required}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         <div className="flex items-center">
//                           <CalendarIcon className="h-4 w-4 text-gray-600 mr-2" />
//                           {formatDateTime(request.request_date)}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={getStatusBadge(request.request_status)}>
//                           {getStatusIcon(request.request_status)}
//                           {request.request_status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         <div className="flex items-center">
//                           <FileTextIcon className="h-4 w-4 text-gray-600 mr-2" />
//                           {request.notes || "N/A"}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => handleEdit(request)}
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                             title="Edit Request"
//                             disabled={isLoading}
//                           >
//                             <EditIcon className="h-4 w-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(request.request_id)}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                             title="Delete Request"
//                             disabled={isLoading}
//                           >
//                             <TrashIcon className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex justify-between items-center p-6 bg-gray-50 border-t border-gray-100">
//               <div className="text-sm text-gray-600">
//                 Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredRequests.length)} of{" "}
//                 {filteredRequests.length} results
//               </div>
//               <div className="flex items-center space-x-2">
//                 <button
//                   disabled={currentPage === 1 || isLoading}
//                   onClick={() => setCurrentPage((p) => p - 1)}
//                   className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors disabled:cursor-not-allowed"
//                 >
//                   Previous
//                 </button>
//                 <span className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold">
//                   {currentPage} / {totalPages}
//                 </span>
//                 <button
//                   disabled={currentPage === totalPages || isLoading}
//                   onClick={() => setCurrentPage((p) => p + 1)}
//                   className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* No Data State */}
//         {!isLoading && filteredRequests.length === 0 && (
//           <div className="text-center bg-white p-12 rounded-2xl shadow-lg border border-red-100">
//             <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500 text-lg">No blood requests found</p>
//             <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
//             {!(searchTerm || statusFilter !== "All") && (
//               <button
//                 onClick={() => setShowModal(true)}
//                 className="mt-4 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
//               >
//                 <PlusIcon className="h-4 w-4 mr-2 inline" />
//                 Create Request
//               </button>
//             )}
//           </div>
//         )}

//         {/* Form Modal */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200">
//               <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-t-2xl">
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-xl font-bold text-gray-800 flex items-center">
//                     <HeartIcon className="h-5 w-5 mr-2 text-red-600" />
//                     {editingRequest ? "Edit Blood Request" : "New Blood Request"}
//                   </h2>
//                   <button
//                     onClick={resetForm}
//                     className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
//                     disabled={isLoading}
//                   >
//                     <XIcon className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6 space-y-4">
//                 {error && (
//                   <div className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4">
//                     <div className="flex items-center">
//                       <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
//                       <p className="text-red-800 text-sm">{error}</p>
//                     </div>
//                   </div>
//                 )}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Admission Number *</label>
//                   <input
//                     type="text"
//                     placeholder="Enter admission number"
//                     required
//                     value={formData.admission_number}
//                     onChange={(e) => setFormData({ ...formData, admission_number: e.target.value })}
//                     className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                     disabled={isLoading}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group *</label>
//                   <select
//                     value={formData.blood_group}
//                     onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
//                     className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                     disabled={isLoading}
//                   >
//                     {bloodGroups.map((bg) => (
//                       <option key={bg} value={bg}>
//                         {bg}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Units Required *</label>
//                   <input
//                     type="number"
//                     min={1}
//                     value={formData.units_required}
//                     onChange={handleUnitsChange}
//                     className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                     disabled={isLoading}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
//                   <textarea
//                     placeholder="Add any additional notes..."
//                     value={formData.notes}
//                     onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//                     className="w-full border border-gray-200 rounded-xl p-3 h-24 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
//                     disabled={isLoading}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
//                   <select
//                     value={formData.request_status}
//                     onChange={(e) => setFormData({ ...formData, request_status: e.target.value })}
//                     className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                     disabled={isLoading}
//                   >
//                     <option value="Pending">Pending</option>
//                     <option value="Approved">Approved</option>
//                     <option value="Completed">Completed</option>
//                     <option value="Rejected">Rejected</option>
//                   </select>
//                 </div>
//                 <div className="flex space-x-3 pt-4">
//                   <button
//                     onClick={resetForm}
//                     className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
//                     disabled={isLoading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSubmit}
//                     className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? "Processing..." : editingRequest ? "Update Request" : "Create Request"}
//                   </button>
//                 </div>
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
//                 <h3 className="text-lg font-semibold text-gray-800 mb-2">{confirmAction.title}</h3>
//                 <p className="text-gray-600 mb-6">{confirmAction.message}</p>
//                 <div className="flex space-x-3">
//                   <button
//                     onClick={() => {
//                       setIsConfirmModalOpen(false);
//                       setConfirmAction(null);
//                     }}
//                     className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
//                     disabled={isLoading}
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

//         {/* Loading Overlay */}
//         {isLoading && (
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
//                 <button
//                   onClick={() => setError(null)}
//                   className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-200 focus:outline-none"
//                 >
//                   <XIcon className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PatientRequests;



import React, { useState, useEffect } from "react";
import {
  HeartIcon,
  SearchIcon,
  PlusIcon,
  TrashIcon,
  EditIcon,
  CalendarIcon,
  DropletIcon,
  FileTextIcon,
  FilterIcon,
  AlertCircle,
  CheckCircleIcon,
  AlertTriangleIcon,
  XIcon,
  UsersIcon,
} from "lucide-react";
import axios from "axios";

interface BloodRequest {
  request_id: number;
  hospital_id: number;
  admission_number: string;
  blood_group: string;
  units_required: number;
  request_date: string;
  request_status: string;
  notes: string;
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

const PatientRequests: React.FC = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState<BloodRequest | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: string;
    title: string;
    message: string;
    action: () => void;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    userInfo: {},
  });
  const [formData, setFormData] = useState({
    admission_number: "",
    blood_group: "A+",
    units_required: 1,
    notes: "",
    request_status: "Pending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Auto-clear error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Configure axios and check authentication
  useEffect(() => {
    axios.defaults.withCredentials = true;
    const initializeComponent = async () => {
      setIsLoading(true);
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        await fetchRequests();
      }
      setIsLoading(false);
    };
    initializeComponent();
  }, []);

  // Authentication check
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

  // Fetch requests
  const fetchRequests = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE_URL}/bloodrequests`);
      if (res.data.status === "success") {
        setRequests(res.data.data);
      } else {
        throw new Error(res.data.message || "Error fetching requests");
      }
    } catch (err) {
      console.error("Error fetching requests", err);
      setError("Failed to fetch requests. Please try again.");
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Handle form submission
  const handleSubmit = async (e?: React.FormEvent): Promise<void> => {
    if (e) e.preventDefault();

    // Validation
    if (!formData.admission_number.trim()) {
      setError("Admission number is required");
      return;
    }
    if (formData.units_required < 1) {
      setError("Units required must be at least 1");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      let response;
      if (editingRequest) {
        response = await axios.put(`${API_BASE_URL}/bloodrequests/${editingRequest.request_id}`, formData);
      } else {
        response = await axios.post(`${API_BASE_URL}/bloodrequests/add`, formData);
      }
      if (response.data.status === "success") {
        showConfirmation(
          "success",
          editingRequest ? "Request Updated" : "Request Created",
          response.data.message || `The blood request has been successfully ${editingRequest ? "updated" : "created"}!`,
          () => {
            fetchRequests();
            resetForm();
          }
        );
      } else {
        throw new Error(response.data.message || "Error saving request");
      }
    } catch (err) {
      console.error("Error saving request", err);
      setError("Failed to save request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (request: BloodRequest): void => {
    setEditingRequest(request);
    setFormData({
      admission_number: request.admission_number,
      blood_group: request.blood_group,
      units_required: request.units_required,
      notes: request.notes,
      request_status: request.request_status,
    });
    setShowModal(true);
    setError(null);
  };

  // Handle delete
  const handleDelete = (id: number): void => {
    const request = requests.find((r) => r.request_id === id);
    if (!request) return;

    showConfirmation(
      "warning",
      "Delete Blood Request",
      `Are you sure you want to delete the blood request for admission number "${request.admission_number}"? This action cannot be undone.`,
      async () => {
        try {
          setIsLoading(true);
          setError(null);
          const response = await axios.delete(`${API_BASE_URL}/bloodrequests/${id}`);
          if (response.data.status === "success") {
            showConfirmation(
              "success",
              "Request Deleted",
              response.data.message || "The blood request has been successfully deleted.",
              () => {
                fetchRequests();
              }
            );
          } else {
            throw new Error(response.data.message || "Error deleting request");
          }
        } catch (err) {
          console.error("Error deleting request", err);
          setError("Failed to delete request. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  // Reset form
  const resetForm = (): void => {
    setEditingRequest(null);
    setFormData({
      admission_number: "",
      blood_group: "A+",
      units_required: 1,
      notes: "",
      request_status: "Pending",
    });
    setShowModal(false);
    setError(null);
  };

  // Status badge styling
  const getStatusBadge = (status: string): string => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1";
    switch (status) {
      case "Completed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "Approved":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  // Status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case "Rejected":
        return <XIcon className="h-4 w-4 text-red-600" />;
      case "Approved":
        return <CheckCircleIcon className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  // Blood group badge styling
  const getBloodGroupColor = (blood_group: string): string => {
    const colors = {
      "A+": "bg-gradient-to-r from-red-400 to-red-500",
      "A-": "bg-gradient-to-r from-red-500 to-red-600",
      "B+": "bg-gradient-to-r from-blue-400 to-blue-500",
      "B-": "bg-gradient-to-r from-blue-500 to-blue-600",
      "AB+": "bg-gradient-to-r from-purple-400 to-purple-500",
      "AB-": "bg-gradient-to-r from-purple-500 to-purple-600",
      "O+": "bg-gradient-to-r from-orange-400 to-orange-500",
      "O-": "bg-gradient-to-r from-orange-500 to-orange-600",
    };
    return colors[blood_group as keyof typeof colors] || "bg-gradient-to-r from-gray-400 to-gray-500";
  };

  // Handle units change
  const handleUnitsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value);
    setFormData({
      ...formData,
      units_required: isNaN(value) ? 1 : Math.max(1, value),
    });
  };

  // Filter requests
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.admission_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.blood_group.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || request.request_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats for cards
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.request_status === "Pending").length,
    approved: requests.filter((r) => r.request_status === "Approved").length,
    completed: requests.filter((r) => r.request_status === "Completed").length,
    rejected: requests.filter((r) => r.request_status === "Rejected").length,
  };

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / pageSize);
  const currentData = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Format date
  const formatDateTime = (dateTime: string | null | undefined) => {
    if (!dateTime) return "N/A";
    try {
      return new Date(dateTime).toLocaleString();
    } catch {
      return dateTime;
    }
  };

  // Authentication check UI
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
            Please login to access the blood request management system.
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
                  Blood Request Management
                </h1>
                <p className="text-gray-600">Manage patient blood requests efficiently</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              disabled={isLoading}
            >
              <PlusIcon className="h-4 w-4" />
              New Request
            </button>
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
                <p className="text-gray-500 text-sm">Total Requests</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-gray-500 text-sm">Approved</p>
                <p className="text-2xl font-bold text-gray-800">{stats.approved}</p>
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
                <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XIcon className="h-5 w-5 text-red-600" />
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
                  placeholder="Search by admission number or blood group..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="relative">
              <FilterIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                disabled={isLoading}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredRequests.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-red-100">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-red-50 to-red-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Admission Number</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Blood Group</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Units Required</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Request Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Notes</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentData.map((request, index) => (
                    <tr
                      key={request.request_id}
                      className={`hover:bg-red-25 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{request.admission_number}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 ${getBloodGroupColor(request.blood_group)} text-white rounded-full text-sm font-semibold`}>
                          {request.blood_group}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <DropletIcon className="h-4 w-4 text-red-600 mr-2" />
                          <span className="text-gray-800">{request.units_required}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 text-gray-600 mr-2" />
                          {formatDateTime(request.request_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getStatusBadge(request.request_status)}>
                          {getStatusIcon(request.request_status)}
                          {request.request_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FileTextIcon className="h-4 w-4 text-gray-600 mr-2" />
                          {request.notes || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(request)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Request"
                            disabled={isLoading}
                          >
                            <EditIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(request.request_id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Request"
                            disabled={isLoading}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center p-6 bg-gray-50 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredRequests.length)} of{" "}
                {filteredRequests.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPage === 1 || isLoading}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages || isLoading}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!isLoading && filteredRequests.length === 0 && (
          <div className="text-center bg-white p-12 rounded-2xl shadow-lg border border-red-100">
            <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No blood requests found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
            {!(searchTerm || statusFilter !== "All") && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                <PlusIcon className="h-4 w-4 mr-2 inline" />
                Create Request
              </button>
            )}
          </div>
        )}

        {/* Form Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200">
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <HeartIcon className="h-5 w-5 mr-2 text-red-600" />
                    {editingRequest ? "Edit Blood Request" : "New Blood Request"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    disabled={isLoading}
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Admission Number *</label>
                  <input
                    type="text"
                    placeholder="Enter admission number"
                    required
                    value={formData.admission_number}
                    onChange={(e) => setFormData({ ...formData, admission_number: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group *</label>
                  <select
                    value={formData.blood_group}
                    onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    disabled={isLoading}
                  >
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Units Required *</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.units_required}
                    onChange={handleUnitsChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                  <textarea
                    placeholder="Add any additional notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3 h-24 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                  <select
                    value={formData.request_status}
                    onChange={(e) => setFormData({ ...formData, request_status: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    disabled={isLoading}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={resetForm}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : editingRequest ? "Update Request" : "Create Request"}
                  </button>
                </div>
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
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{confirmAction.title}</h3>
                <p className="text-gray-600 mb-6">{confirmAction.message}</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setIsConfirmModalOpen(false);
                      setConfirmAction(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    disabled={isLoading}
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
                <button
                  onClick={() => setError(null)}
                  className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-200 focus:outline-none"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRequests;