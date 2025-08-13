// import React, { useState, useEffect } from 'react';
// import { Eye, UserCheck, UserX, Search, Filter, Users, Activity } from 'lucide-react';

// const ManageDonors = () => {
//   const [donors, setDonors] = useState([]);
//   const [filteredDonors, setFilteredDonors] = useState([]);
//   const [selectedDonor, setSelectedDonor] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [bloodGroupFilter, setBloodGroupFilter] = useState('all');
//   const [loading, setLoading] = useState(false);

//   // Mock data - replace with actual API call
//   const mockDonors = [
//     {
//       donor_id: 1,
//       donor_name: "John Doe",
//       blood_group: "A+",
//       district_name: "Colombo",
//       email: "john.doe@email.com",
//       phone_number: "+94 77 123 4567",
//       status: "active"
//     },
//     {
//       donor_id: 2,
//       donor_name: "Jane Smith",
//       blood_group: "O-",
//       district_name: "Gampaha",
//       email: "jane.smith@email.com",
//       phone_number: "+94 71 234 5678",
//       status: "active"
//     },
//     {
//       donor_id: 3,
//       donor_name: "Mike Johnson",
//       blood_group: "B+",
//       district_name: "Kandy",
//       email: "mike.johnson@email.com",
//       phone_number: "+94 76 345 6789",
//       status: "deactive"
//     },
//     {
//       donor_id: 4,
//       donor_name: "Sarah Wilson",
//       blood_group: "AB+",
//       district_name: "Colombo",
//       email: "sarah.wilson@email.com",
//       phone_number: "+94 75 456 7890",
//       status: "active"
//     }
//   ];

//   useEffect(() => {
//     // Initialize with mock data - replace with actual API call
//     setDonors(mockDonors);
//     setFilteredDonors(mockDonors);
//   }, []);

//   useEffect(() => {
//     filterDonors();
//   }, [searchTerm, statusFilter, bloodGroupFilter, donors]);

//   const filterDonors = () => {
//     let filtered = donors.filter(donor => {
//       const matchesSearch = donor.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            donor.phone_number.includes(searchTerm);
      
//       const matchesStatus = statusFilter === 'all' || donor.status === statusFilter;
      
//       const matchesBloodGroup = bloodGroupFilter === 'all' || donor.blood_group === bloodGroupFilter;
      
//       return matchesSearch && matchesStatus && matchesBloodGroup;
//     });
    
//     setFilteredDonors(filtered);
//   };

//   const handleStatusChange = async (donorId, newStatus) => {
//     setLoading(true);
//     try {
//       // Replace with actual API calls
//       const endpoint = newStatus === 'active' ? 
//         `/donors/activate/${donorId}` : 
//         `/donors/${donorId}`;
      
//       const method = newStatus === 'active' ? 'PUT' : 'DELETE';
      
//       // Mock API response
//       console.log(`${method} ${endpoint}`);
      
//       // Update local state
//       setDonors(prev => prev.map(donor => 
//         donor.donor_id === donorId ? { ...donor, status: newStatus } : donor
//       ));
      
//       // Show success message (you can add toast notifications here)
//       alert(`Donor ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      
//     } catch (error) {
//       console.error('Error updating donor status:', error);
//       alert('Error updating donor status. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewDetails = (donor) => {
//     setSelectedDonor(donor);
//     setShowModal(true);
//   };

//   const getBloodGroups = () => {
//     const bloodGroups = [...new Set(donors.map(donor => donor.blood_group))];
//     return bloodGroups.sort();
//   };

//   const getStatusColor = (status) => {
//     return status === 'active' ? 'text-green-600' : 'text-red-600';
//   };

//   const getStatusBadge = (status) => {
//     return status === 'active' 
//       ? 'bg-green-100 text-green-800' 
//       : 'bg-red-100 text-red-800';
//   };

//   const stats = {
//     total: donors.length,
//     active: donors.filter(d => d.status === 'active').length,
//     inactive: donors.filter(d => d.status === 'deactive').length
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Donor Management</h1>
//           <p className="text-gray-600">Manage blood donors and their status</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center">
//               <Users className="h-8 w-8 text-blue-600" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Donors</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center">
//               <Activity className="h-8 w-8 text-green-600" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Active Donors</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center">
//               <UserX className="h-8 w-8 text-red-600" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Inactive Donors</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search donors..."
//                 className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
            
//             <select
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="deactive">Inactive</option>
//             </select>
            
//             <select
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={bloodGroupFilter}
//               onChange={(e) => setBloodGroupFilter(e.target.value)}
//             >
//               <option value="all">All Blood Groups</option>
//               {getBloodGroups().map(group => (
//                 <option key={group} value={group}>{group}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Donors Table */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Donor ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Blood Group
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     District
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredDonors.map((donor) => (
//                   <tr key={donor.donor_id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       #{donor.donor_id}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {donor.donor_name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                         {donor.blood_group}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {donor.district_name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(donor.status)}`}>
//                         {donor.status === 'active' ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                       <button
//                         onClick={() => handleViewDetails(donor)}
//                         className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       >
//                         <Eye className="h-3 w-3 mr-1" />
//                         More
//                       </button>
                      
//                       {donor.status === 'active' ? (
//                         <button
//                           onClick={() => handleStatusChange(donor.donor_id, 'deactive')}
//                           disabled={loading}
//                           className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
//                         >
//                           <UserX className="h-3 w-3 mr-1" />
//                           Deactivate
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleStatusChange(donor.donor_id, 'active')}
//                           disabled={loading}
//                           className="inline-flex items-center px-3 py-1.5 border border-green-300 shadow-sm text-xs font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
//                         >
//                           <UserCheck className="h-3 w-3 mr-1" />
//                           Activate
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
            
//             {filteredDonors.length === 0 && (
//               <div className="text-center py-12">
//                 <Users className="mx-auto h-12 w-12 text-gray-400" />
//                 <h3 className="mt-2 text-sm font-medium text-gray-900">No donors found</h3>
//                 <p className="mt-1 text-sm text-gray-500">
//                   Try adjusting your search or filter criteria.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Modal */}
//         {showModal && selectedDonor && (
//           <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//             <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//               <div className="mt-3">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-medium text-gray-900">Donor Details</h3>
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     ✕
//                   </button>
//                 </div>
                
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Donor ID</label>
//                     <p className="mt-1 text-sm text-gray-900">#{selectedDonor.donor_id}</p>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                     <p className="mt-1 text-sm text-gray-900">{selectedDonor.donor_name}</p>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Blood Group</label>
//                     <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                       {selectedDonor.blood_group}
//                     </span>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">District</label>
//                     <p className="mt-1 text-sm text-gray-900">{selectedDonor.district_name}</p>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Email</label>
//                     <p className="mt-1 text-sm text-gray-900">{selectedDonor.email}</p>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//                     <p className="mt-1 text-sm text-gray-900">{selectedDonor.phone_number}</p>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Status</label>
//                     <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedDonor.status)}`}>
//                       {selectedDonor.status === 'active' ? 'Active' : 'Inactive'}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="mt-6 flex justify-end space-x-3">
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   >
//                     Close
//                   </button>
                  
//                   {selectedDonor.status === 'active' ? (
//                     <button
//                       onClick={() => {
//                         handleStatusChange(selectedDonor.donor_id, 'deactive');
//                         setShowModal(false);
//                       }}
//                       className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                     >
//                       Deactivate Donor
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => {
//                         handleStatusChange(selectedDonor.donor_id, 'active');
//                         setShowModal(false);
//                       }}
//                       className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                     >
//                       Activate Donor
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageDonors;

// import React, { useState, useEffect } from "react";
// import { Eye, UserCheck, UserX, Search, Users, Activity } from "lucide-react";

// const API_BASE = "http://localhost:9092/dashboard/admin"; // Change to your backend URL

// const ManageDonors = () => {
//   const [donors, setDonors] = useState([]);
//   const [filteredDonors, setFilteredDonors] = useState([]);
//   const [selectedDonor, setSelectedDonor] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [bloodGroupFilter, setBloodGroupFilter] = useState("all");
//   const [loading, setLoading] = useState(false);
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     inactive: 0,
//   });

//   // Fetch donors + stats
//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     filterDonors();
//   }, [searchTerm, statusFilter, bloodGroupFilter, donors]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       // Get donors
//       const donorsRes = await fetch(`${API_BASE}/donors`);
//       const donorsData = await donorsRes.json();

//       // Get counts
//       const totalRes = await fetch(`${API_BASE}/donorCount`);
//       const totalData = await totalRes.json();

//       const activeRes = await fetch(`${API_BASE}/activeDonorCount`);
//       const activeData = await activeRes.json();

//       const inactiveRes = await fetch(`${API_BASE}/deactiveDonorCount`);
//       const inactiveData = await inactiveRes.json();

//       setDonors(donorsData);
//       setFilteredDonors(donorsData);

//       setStats({
//         total: totalData.totalDonors,
//         active: activeData.totalActiveDonors,
//         inactive: inactiveData.totalDeactiveDonors,
//       });
//     } catch (error) {
//       console.error("Error fetching donor data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterDonors = () => {
//     let filtered = donors.filter((donor) => {
//       const matchesSearch =
//         donor.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         donor.phone_number.includes(searchTerm);

//       const matchesStatus =
//         statusFilter === "all" || donor.status === statusFilter;

//       const matchesBloodGroup =
//         bloodGroupFilter === "all" || donor.blood_group === bloodGroupFilter;

//       return matchesSearch && matchesStatus && matchesBloodGroup;
//     });

//     setFilteredDonors(filtered);
//   };

//   const handleStatusChange = async (donorId, newStatus) => {
//     setLoading(true);
//     try {
//       const endpoint =
//         newStatus === "active"
//           ? `${API_BASE}/donors/activate/${donorId}`
//           : `${API_BASE}/donors/${donorId}`;

//       const method = newStatus === "active" ? "PUT" : "DELETE";

//       const res = await fetch(endpoint, { method });
//       const data = await res.json();

//       if (res.ok) {
//         // Update donor list
//         setDonors((prev) =>
//           prev.map((donor) =>
//             donor.donor_id === donorId ? { ...donor, status: newStatus } : donor
//           )
//         );

//         // Refresh stats
//         const totalRes = await fetch(`${API_BASE}/donorCount`);
//         const totalData = await totalRes.json();
//         const activeRes = await fetch(`${API_BASE}/activeDonorCount`);
//         const activeData = await activeRes.json();
//         const inactiveRes = await fetch(`${API_BASE}/deactiveDonorCount`);
//         const inactiveData = await inactiveRes.json();

//         setStats({
//           total: totalData.totalDonors,
//           active: activeData.totalActiveDonors,
//           inactive: inactiveData.totalDeactiveDonors,
//         });

//         alert(data.message);
//       } else {
//         alert(data.message || "Error updating donor status");
//       }
//     } catch (error) {
//       console.error("Error updating donor status:", error);
//       alert("Error updating donor status. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewDetails = (donor) => {
//     setSelectedDonor(donor);
//     setShowModal(true);
//   };

//   const getBloodGroups = () => {
//     const bloodGroups = [...new Set(donors.map((donor) => donor.blood_group))];
//     return bloodGroups.sort();
//   };

//   const getStatusBadge = (status) => {
//     return status === "active"
//       ? "bg-green-100 text-green-800"
//       : "bg-red-100 text-red-800";
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Donor Management
//           </h1>
//           <p className="text-gray-600">Manage blood donors and their status</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center">
//               <Users className="h-8 w-8 text-blue-600" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Donors</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center">
//               <Activity className="h-8 w-8 text-green-600" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">
//                   Active Donors
//                 </p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {stats.active}
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center">
//               <UserX className="h-8 w-8 text-red-600" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">
//                   Inactive Donors
//                 </p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {stats.inactive}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search donors..."
//                 className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             <select
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="deactive">Inactive</option>
//             </select>

//             <select
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={bloodGroupFilter}
//               onChange={(e) => setBloodGroupFilter(e.target.value)}
//             >
//               <option value="all">All Blood Groups</option>
//               {getBloodGroups().map((group) => (
//                 <option key={group} value={group}>
//                   {group}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Donors Table */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Donor ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Blood Group
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     District
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredDonors.map((donor) => (
//                   <tr key={donor.donor_id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       #{donor.donor_id}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {donor.donor_name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                         {donor.blood_group}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {donor.district_name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
//                           donor.status
//                         )}`}
//                       >
//                         {donor.status === "active" ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                       <button
//                         onClick={() => handleViewDetails(donor)}
//                         className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       >
//                         <Eye className="h-3 w-3 mr-1" />
//                         More
//                       </button>

//                       {donor.status === "active" ? (
//                         <button
//                           onClick={() =>
//                             handleStatusChange(donor.donor_id, "deactive")
//                           }
//                           disabled={loading}
//                           className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
//                         >
//                           <UserX className="h-3 w-3 mr-1" />
//                           Deactivate
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() =>
//                             handleStatusChange(donor.donor_id, "active")
//                           }
//                           disabled={loading}
//                           className="inline-flex items-center px-3 py-1.5 border border-green-300 shadow-sm text-xs font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
//                         >
//                           <UserCheck className="h-3 w-3 mr-1" />
//                           Activate
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {filteredDonors.length === 0 && (
//               <div className="text-center py-12">
//                 <Users className="mx-auto h-12 w-12 text-gray-400" />
//                 <h3 className="mt-2 text-sm font-medium text-gray-900">
//                   No donors found
//                 </h3>
//                 <p className="mt-1 text-sm text-gray-500">
//                   Try adjusting your search or filter criteria.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Modal */}
//         {showModal && selectedDonor && (
//           <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
//             <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//               <div className="mt-3">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-medium text-gray-900">
//                     Donor Details
//                   </h3>
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Donor ID
//                     </label>
//                     <p className="mt-1 text-sm text-gray-900">
//                       #{selectedDonor.donor_id}
//                     </p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Full Name
//                     </label>
//                     <p className="mt-1 text-sm text-gray-900">
//                       {selectedDonor.donor_name}
//                     </p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Blood Group
//                     </label>
//                     <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                       {selectedDonor.blood_group}
//                     </span>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       District
//                     </label>
//                     <p className="mt-1 text-sm text-gray-900">
//                       {selectedDonor.district_name}
//                     </p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Email
//                     </label>
//                     <p className="mt-1 text-sm text-gray-900">
//                       {selectedDonor.email}
//                     </p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Phone Number
//                     </label>
//                     <p className="mt-1 text-sm text-gray-900">
//                       {selectedDonor.phone_number}
//                     </p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Status
//                     </label>
//                     <span
//                       className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
//                         selectedDonor.status
//                       )}`}
//                     >
//                       {selectedDonor.status === "active"
//                         ? "Active"
//                         : "Inactive"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-6 flex justify-end space-x-3">
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   >
//                     Close
//                   </button>

//                   {selectedDonor.status === "active" ? (
//                     <button
//                       onClick={() => {
//                         handleStatusChange(selectedDonor.donor_id, "deactive");
//                         setShowModal(false);
//                       }}
//                       className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                     >
//                       Deactivate Donor
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => {
//                         handleStatusChange(selectedDonor.donor_id, "active");
//                         setShowModal(false);
//                       }}
//                       className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                     >
//                       Activate Donor
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageDonors;

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Eye,
  UserCheck,
  UserX,
  Search,
  Users,
  Activity,
} from "lucide-react";

const API_BASE = "http://localhost:9092/dashboard/admin"; // Change to your backend URL

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const ManageDonors = () => {
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState("all");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  // Sorting config: key and direction
  const [sortConfig, setSortConfig] = useState({
    key: "donor_id",
    direction: "asc",
  });

  // Fetch donors + stats
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Get donors
      const donorsRes = await fetch(`${API_BASE}/donors`);
      const donorsData = await donorsRes.json();

      // Get counts
      const totalRes = await fetch(`${API_BASE}/donorCount`);
      const totalData = await totalRes.json();

      const activeRes = await fetch(`${API_BASE}/activeDonorCount`);
      const activeData = await activeRes.json();

      const inactiveRes = await fetch(`${API_BASE}/deactiveDonorCount`);
      const inactiveData = await inactiveRes.json();

      setDonors(donorsData);
      setStats({
        total: totalData.totalDonors,
        active: activeData.totalActiveDonors,
        inactive: inactiveData.totalDeactiveDonors,
      });
    } catch (error) {
      console.error("Error fetching donor data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter donors based on search, status, blood group
  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      const matchesSearch =
        donor.donor_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        donor.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        donor.phone_number.includes(debouncedSearchTerm);

      const matchesStatus =
        statusFilter === "all" || donor.status === statusFilter;

      const matchesBloodGroup =
        bloodGroupFilter === "all" || donor.blood_group === bloodGroupFilter;

      return matchesSearch && matchesStatus && matchesBloodGroup;
    });
  }, [donors, debouncedSearchTerm, statusFilter, bloodGroupFilter]);

  // Sort filtered donors
  const sortedDonors = useMemo(() => {
    const sorted = [...filteredDonors];
    sorted.sort((a, b) => {
      let aKey = a[sortConfig.key];
      let bKey = b[sortConfig.key];

      // For string keys, case-insensitive compare
      if (typeof aKey === "string") {
        aKey = aKey.toLowerCase();
        bKey = bKey.toLowerCase();
      }

      if (aKey < bKey) return sortConfig.direction === "asc" ? -1 : 1;
      if (aKey > bKey) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredDonors, sortConfig]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedDonors.length / itemsPerPage);

  // Paginated donors to display on current page
  const paginatedDonors = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedDonors.slice(start, start + itemsPerPage);
  }, [sortedDonors, currentPage]);

  // Change sorting field & direction
  const requestSort = useCallback(
    (key) => {
      let direction = "asc";
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ key, direction });
    },
    [sortConfig]
  );

  // Update donor status (activate/deactivate)
  const handleStatusChange = async (donorId, newStatus) => {
    setLoading(true);
    try {
      const endpoint =
        newStatus === "active"
          ? `${API_BASE}/donors/activate/${donorId}`
          : `${API_BASE}/donors/${donorId}`;

      const method = newStatus === "active" ? "PUT" : "DELETE";

      const res = await fetch(endpoint, { method });
      const data = await res.json();

      if (res.ok) {
        // Update donor list locally
        setDonors((prev) =>
          prev.map((donor) =>
            donor.donor_id === donorId ? { ...donor, status: newStatus } : donor
          )
        );

        // Refresh stats
        const totalRes = await fetch(`${API_BASE}/donorCount`);
        const totalData = await totalRes.json();
        const activeRes = await fetch(`${API_BASE}/activeDonorCount`);
        const activeData = await activeRes.json();
        const inactiveRes = await fetch(`${API_BASE}/deactiveDonorCount`);
        const inactiveData = await inactiveRes.json();

        setStats({
          total: totalData.totalDonors,
          active: activeData.totalActiveDonors,
          inactive: inactiveData.totalDeactiveDonors,
        });

        alert(data.message);
      } else {
        alert(data.message || "Error updating donor status");
      }
    } catch (error) {
      console.error("Error updating donor status:", error);
      alert("Error updating donor status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (donor) => {
    setSelectedDonor(donor);
    setShowModal(true);
  };

  const getBloodGroups = () => {
    const bloodGroups = [...new Set(donors.map((donor) => donor.blood_group))];
    return bloodGroups.sort();
  };

  const getStatusBadge = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto relative">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex items-center space-x-4">
          <div className="p-2 sm:p-3 bg-red-100 rounded-full">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Donor Management</h1>
            <p className="text-gray-600">Manage donors and their status</p>
          </div>
        </div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Donors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <UserX className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Inactive Donors
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search donors..."
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // reset page on search
                }}
              />
            </div>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="deactive">Inactive</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={bloodGroupFilter}
              onChange={(e) => {
                setBloodGroupFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Blood Groups</option>
              {getBloodGroups().map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Donors Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: "Donor ID", key: "donor_id" },
                    { label: "Name", key: "donor_name" },
                    { label: "Blood Group", key: "blood_group" },
                    { label: "District", key: "district_name" },
                    { label: "Status", key: "status" },
                    { label: "Actions" },
                  ].map((col) => (
                    <th
                      key={col.key || col.label}
                      onClick={() => col.key && requestSort(col.key)}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        col.key ? "cursor-pointer select-none" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{col.label}</span>
                        {col.key && sortConfig.key === col.key && (
                          <span>
                            {sortConfig.direction === "asc" ? "▲" : "▼"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedDonors.map((donor) => (
                  <tr key={donor.donor_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{donor.donor_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donor.donor_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {donor.blood_group}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donor.district_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                          donor.status
                        )}`}
                      >
                        {donor.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDetails(donor)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        More
                      </button>

                      {donor.status === "active" ? (
                        <button
                          onClick={() =>
                            handleStatusChange(donor.donor_id, "deactive")
                          }
                          disabled={loading}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          <UserX className="h-3 w-3 mr-1" />
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleStatusChange(donor.donor_id, "active")
                          }
                          disabled={loading}
                          className="inline-flex items-center px-3 py-1.5 border border-green-300 shadow-sm text-xs font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          <UserCheck className="h-3 w-3 mr-1" />
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {paginatedDonors.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No donors found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Try adjusting your search or filter criteria.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-center space-x-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1 border border-gray-300 rounded">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Modal */}
        {showModal && selectedDonor && (
          <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-20 px-4">
            <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Donor Details
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Donor ID
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      #{selectedDonor.donor_id}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedDonor.donor_name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Blood Group
                    </label>
                    <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {selectedDonor.blood_group}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      District
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedDonor.district_name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedDonor.email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedDonor.phone_number}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <span
                      className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                        selectedDonor.status
                      )}`}
                    >
                      {selectedDonor.status === "active"
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Close
                  </button>

                  {selectedDonor.status === "active" ? (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedDonor.donor_id, "deactive");
                        setShowModal(false);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Deactivate Donor
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedDonor.donor_id, "active");
                        setShowModal(false);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Activate Donor
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loader styles */}
        <style>{`
          .loader {
            border-top-color: #3498db;
            animation: spinner 1.5s linear infinite;
          }
          @keyframes spinner {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}</style>
      </div>
    </div>
  );
};

export default ManageDonors;
