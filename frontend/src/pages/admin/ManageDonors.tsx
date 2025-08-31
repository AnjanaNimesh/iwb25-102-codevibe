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

// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   Eye,
//   UserCheck,
//   UserX,
//   Search,
//   Users,
//   Activity,
// } from "lucide-react";

// const API_BASE = "http://localhost:9092/dashboard/admin"; // Change to your backend URL

// function useDebounce(value: string, delay: number) {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const handler = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(handler);
//   }, [value, delay]);
//   return debouncedValue;
// }

// const ManageDonors = () => {
//   const [donors, setDonors] = useState([]);
//   const [selectedDonor, setSelectedDonor] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const debouncedSearchTerm = useDebounce(searchTerm, 300);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [bloodGroupFilter, setBloodGroupFilter] = useState("all");
//   const [loading, setLoading] = useState(false);
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     inactive: 0,
//   });

//   // Sorting config: key and direction
//   const [sortConfig, setSortConfig] = useState({
//     key: "donor_id",
//     direction: "asc",
//   });

//   // Fetch donors + stats
//   useEffect(() => {
//     fetchData();
//   }, []);

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

//   // Filter donors based on search, status, blood group
//   const filteredDonors = useMemo(() => {
//     return donors.filter((donor) => {
//       const matchesSearch =
//         donor.donor_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
//         donor.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
//         donor.phone_number.includes(debouncedSearchTerm);

//       const matchesStatus =
//         statusFilter === "all" || donor.status === statusFilter;

//       const matchesBloodGroup =
//         bloodGroupFilter === "all" || donor.blood_group === bloodGroupFilter;

//       return matchesSearch && matchesStatus && matchesBloodGroup;
//     });
//   }, [donors, debouncedSearchTerm, statusFilter, bloodGroupFilter]);

//   // Sort filtered donors
//   const sortedDonors = useMemo(() => {
//     const sorted = [...filteredDonors];
//     sorted.sort((a, b) => {
//       let aKey = a[sortConfig.key];
//       let bKey = b[sortConfig.key];

//       // For string keys, case-insensitive compare
//       if (typeof aKey === "string") {
//         aKey = aKey.toLowerCase();
//         bKey = bKey.toLowerCase();
//       }

//       if (aKey < bKey) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aKey > bKey) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//     return sorted;
//   }, [filteredDonors, sortConfig]);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
//   const totalPages = Math.ceil(sortedDonors.length / itemsPerPage);

//   // Paginated donors to display on current page
//   const paginatedDonors = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return sortedDonors.slice(start, start + itemsPerPage);
//   }, [sortedDonors, currentPage]);

//   // Change sorting field & direction
//   const requestSort = useCallback(
//     (key) => {
//       let direction = "asc";
//       if (sortConfig.key === key && sortConfig.direction === "asc") {
//         direction = "desc";
//       }
//       setSortConfig({ key, direction });
//     },
//     [sortConfig]
//   );

//   // Update donor status (activate/deactivate)
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
//         // Update donor list locally
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
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">
//       <div className="max-w-7xl mx-auto relative">
//         {/* Loading overlay */}
//         {loading && (
//           <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
//             <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
//           </div>
//         )}

//         {/* Header */}
//         <div className="mb-8 flex items-center space-x-4">
//           <div className="p-2 sm:p-3 bg-red-100 rounded-full">
//             <Users className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-1">Donor Management</h1>
//             <p className="text-gray-600">Manage donors and their status</p>
//           </div>
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
//                 <p className="text-sm font-medium text-gray-600">
//                   Inactive Donors
//                 </p>
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
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setCurrentPage(1); // reset page on search
//                 }}
//               />
//             </div>

//             <select
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={statusFilter}
//               onChange={(e) => {
//                 setStatusFilter(e.target.value);
//                 setCurrentPage(1);
//               }}
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="deactive">Inactive</option>
//             </select>

//             <select
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={bloodGroupFilter}
//               onChange={(e) => {
//                 setBloodGroupFilter(e.target.value);
//                 setCurrentPage(1);
//               }}
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
//                   {[
//                     { label: "Donor ID", key: "donor_id" },
//                     { label: "Name", key: "donor_name" },
//                     { label: "Blood Group", key: "blood_group" },
//                     { label: "District", key: "district_name" },
//                     { label: "Status", key: "status" },
//                     { label: "Actions" },
//                   ].map((col) => (
//                     <th
//                       key={col.key || col.label}
//                       onClick={() => col.key && requestSort(col.key)}
//                       className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
//                         col.key ? "cursor-pointer select-none" : ""
//                       }`}
//                     >
//                       <div className="flex items-center space-x-1">
//                         <span>{col.label}</span>
//                         {col.key && sortConfig.key === col.key && (
//                           <span>
//                             {sortConfig.direction === "asc" ? "▲" : "▼"}
//                           </span>
//                         )}
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {paginatedDonors.map((donor) => (
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

//                 {paginatedDonors.length === 0 && (
//                   <tr>
//                     <td colSpan={6}>
//                       <div className="text-center py-12">
//                         <Users className="mx-auto h-12 w-12 text-gray-400" />
//                         <h3 className="mt-2 text-sm font-medium text-gray-900">
//                           No donors found
//                         </h3>
//                         <p className="mt-1 text-sm text-gray-500">
//                           Try adjusting your search or filter criteria.
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination Controls */}
//         <div className="mt-4 flex justify-center space-x-3">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//             className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span className="px-3 py-1 border border-gray-300 rounded">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//             className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>

//         {/* Modal */}
//         {showModal && selectedDonor && (
//           <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-20 px-4">
//             <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
//               <div className="mt-3">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-medium text-gray-900">
//                     Donor Details
//                   </h3>
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="text-gray-400 hover:text-gray-600"
//                     aria-label="Close modal"
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

//         {/* Loader styles */}
//         <style>{`
//           .loader {
//             border-top-color: #3498db;
//             animation: spinner 1.5s linear infinite;
//           }
//           @keyframes spinner {
//             0% { transform: rotate(0deg);}
//             100% { transform: rotate(360deg);}
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// };

// export default ManageDonors;

// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   Eye,
//   UserCheck,
//   UserX,
//   Search,
//   Users,
//   Activity,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";

// const API_BASE = "http://localhost:9092/dashboard/admin"; // Change to your backend URL

// function useDebounce(value, delay) {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const handler = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(handler);
//   }, [value, delay]);
//   return debouncedValue;
// }

// const Pagination = ({
//   currentPage,
//   totalPages,
//   onPageChange,
//   totalItems,
//   itemsPerPage,
// }) => {
//   const getVisiblePages = () => {
//     const pages = [];
//     const maxVisiblePages = 5;
    
//     if (totalPages <= maxVisiblePages) {
//       // Show all pages if total is small
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       // Calculate range around current page
//       let start = Math.max(1, currentPage - 2);
//       let end = Math.min(totalPages, currentPage + 2);
      
//       // Adjust if we're near the beginning or end
//       if (currentPage <= 3) {
//         start = 1;
//         end = Math.min(5, totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         start = Math.max(totalPages - 4, 1);
//         end = totalPages;
//       }
      
//       for (let i = start; i <= end; i++) {
//         pages.push(i);
//       }
//     }
    
//     return pages;
//   };

//   const startItem = (currentPage - 1) * itemsPerPage + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, totalItems);

//   return (
//     <div className="flex items-center justify-between px-4 py-3 border border-gray-200 bg-white rounded-lg shadow-sm">
//       {/* Left side - showing info */}
//       <div className="flex items-center text-sm text-gray-700">
//         <span>
//           Showing {startItem}-{endItem} of {totalItems} donors
//         </span>
//       </div>

//       {/* Right side - pagination controls */}
//       <div className="flex items-center space-x-1">
//         {/* Previous button */}
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="flex items-center px-3 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
//         >
//           <ChevronLeft className="w-4 h-4 mr-1" />
//           Previous
//         </button>

//         {/* Page numbers */}
//         <div className="flex items-center space-x-1">
//           {getVisiblePages().map((page) => (
//             <button
//               key={page}
//               onClick={() => onPageChange(page)}
//               className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
//                 page === currentPage
//                   ? "bg-red-600 text-white hover:bg-red-700"
//                   : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
//               }`}
//             >
//               {page}
//             </button>
//           ))}
//         </div>

//         {/* Next button */}
//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="flex items-center px-3 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
//         >
//           Next
//           <ChevronRight className="w-4 h-4 ml-1" />
//         </button>
//       </div>
//     </div>
//   );
// };

// const ManageDonors = () => {
//   const [donors, setDonors] = useState([]);
//   const [selectedDonor, setSelectedDonor] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const debouncedSearchTerm = useDebounce(searchTerm, 300);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [bloodGroupFilter, setBloodGroupFilter] = useState("all");
//   const [loading, setLoading] = useState(false);
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     inactive: 0,
//   });

//   // Sorting config: key and direction
//   const [sortConfig, setSortConfig] = useState({
//     key: "donor_id",
//     direction: "asc",
//   });

//   // Fetch donors + stats
//   useEffect(() => {
//     fetchData();
//   }, []);

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

//   // Filter donors based on search, status, blood group
//   const filteredDonors = useMemo(() => {
//     return donors.filter((donor) => {
//       const matchesSearch =
//         donor.donor_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
//         donor.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
//         donor.phone_number.includes(debouncedSearchTerm);

//       const matchesStatus =
//         statusFilter === "all" || donor.status === statusFilter;

//       const matchesBloodGroup =
//         bloodGroupFilter === "all" || donor.blood_group === bloodGroupFilter;

//       return matchesSearch && matchesStatus && matchesBloodGroup;
//     });
//   }, [donors, debouncedSearchTerm, statusFilter, bloodGroupFilter]);

//   // Sort filtered donors
//   const sortedDonors = useMemo(() => {
//     const sorted = [...filteredDonors];
//     sorted.sort((a, b) => {
//       let aKey = a[sortConfig.key];
//       let bKey = b[sortConfig.key];

//       // For string keys, case-insensitive compare
//       if (typeof aKey === "string") {
//         aKey = aKey.toLowerCase();
//         bKey = bKey.toLowerCase();
//       }

//       if (aKey < bKey) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aKey > bKey) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//     return sorted;
//   }, [filteredDonors, sortConfig]);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
//   const totalPages = Math.ceil(sortedDonors.length / itemsPerPage);

//   // Paginated donors to display on current page
//   const paginatedDonors = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return sortedDonors.slice(start, start + itemsPerPage);
//   }, [sortedDonors, currentPage]);

//   // Change sorting field & direction
//   const requestSort = useCallback(
//     (key) => {
//       let direction = "asc";
//       if (sortConfig.key === key && sortConfig.direction === "asc") {
//         direction = "desc";
//       }
//       setSortConfig({ key, direction });
//     },
//     [sortConfig]
//   );

//   // Update donor status (activate/deactivate)
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
//         // Update donor list locally
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

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">
//       <div className="max-w-7xl mx-auto relative">
//         {/* Loading overlay */}
//         {loading && (
//           <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
//             <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
//           </div>
//         )}

//         {/* Header */}
//         <div className="mb-8 flex items-center space-x-4">
//           <div className="p-2 sm:p-3 bg-red-100 rounded-full">
//             <Users className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-1">Donor Management</h1>
//             <p className="text-gray-600">Manage donors and their status</p>
//           </div>
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
//                 <p className="text-sm font-medium text-gray-600">
//                   Inactive Donors
//                 </p>
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
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setCurrentPage(1); // reset page on search
//                 }}
//               />
//             </div>

//             <select
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={statusFilter}
//               onChange={(e) => {
//                 setStatusFilter(e.target.value);
//                 setCurrentPage(1);
//               }}
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="deactive">Inactive</option>
//             </select>

//             <select
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={bloodGroupFilter}
//               onChange={(e) => {
//                 setBloodGroupFilter(e.target.value);
//                 setCurrentPage(1);
//               }}
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
//                   {[
//                     { label: "Donor ID", key: "donor_id" },
//                     { label: "Name", key: "donor_name" },
//                     { label: "Blood Group", key: "blood_group" },
//                     { label: "District", key: "district_name" },
//                     { label: "Status", key: "status" },
//                     { label: "Actions" },
//                   ].map((col) => (
//                     <th
//                       key={col.key || col.label}
//                       onClick={() => col.key && requestSort(col.key)}
//                       className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
//                         col.key ? "cursor-pointer select-none" : ""
//                       }`}
//                     >
//                       <div className="flex items-center space-x-1">
//                         <span>{col.label}</span>
//                         {col.key && sortConfig.key === col.key && (
//                           <span>
//                             {sortConfig.direction === "asc" ? "▲" : "▼"}
//                           </span>
//                         )}
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {paginatedDonors.map((donor) => (
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

//                 {paginatedDonors.length === 0 && (
//                   <tr>
//                     <td colSpan={6}>
//                       <div className="text-center py-12">
//                         <Users className="mx-auto h-12 w-12 text-gray-400" />
//                         <h3 className="mt-2 text-sm font-medium text-gray-900">
//                           No donors found
//                         </h3>
//                         <p className="mt-1 text-sm text-gray-500">
//                           Try adjusting your search or filter criteria.
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Modern Pagination */}
//         {totalPages > 0 && (
//           <div className="mt-6">
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={handlePageChange}
//               totalItems={filteredDonors.length}
//               itemsPerPage={itemsPerPage}
//             />
//           </div>
//         )}

//         {/* Modal */}
//         {showModal && selectedDonor && (
//           <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-20 px-4">
//             <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
//               <div className="mt-3">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-medium text-gray-900">
//                     Donor Details
//                   </h3>
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="text-gray-400 hover:text-gray-600"
//                     aria-label="Close modal"
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

//         {/* Loader styles */}
//         <style>{`
//           .loader {
//             border-top-color: #3498db;
//             animation: spinner 1.5s linear infinite;
//           }
//           @keyframes spinner {
//             0% { transform: rotate(0deg);}
//             100% { transform: rotate(360deg);}
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// };

// export default ManageDonors;


// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   Eye,
//   UserCheck,
//   UserX,
//   Search,
//   Users,
//   Activity,
//   ChevronLeft,
//   ChevronRight,
//   X, // Added X icon for modal close
// } from "lucide-react";

// const API_BASE = "http://localhost:9092/dashboard/admin"; // Change to your backend URL

// // Utility function to get token from cookies
// const getTokenFromCookie = (): string | null => {
//   const cookies = document.cookie.split(';');
//   for (let cookie of cookies) {
//     const [name, value] = cookie.trim().split('=');
//     if (name === 'adminToken' || name === 'token' || name === 'authToken' || name === 'admin_token') {
//       const decodedValue = decodeURIComponent(value);
//       console.log(`Found token in cookie '${name}':`, decodedValue.substring(0, 20) + '...');
//       return decodedValue;
//     }
//   }
//   console.log('No admin token found in cookies. Available cookies:', 
//     document.cookie.split(';').map(c => c.trim().split('=')[0]));
//   return null;
// };

// // Utility function to create authenticated headers
// const getAuthHeaders = (): HeadersInit => {
//   const token = getTokenFromCookie();
//   const headers: HeadersInit = {
//     'Content-Type': 'application/json',
//   };
  
//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//     headers['X-Admin-Token'] = token;
//     headers['Admin-Token'] = token;
//     headers['X-Auth-Token'] = token;
//     console.log('Sending request with token headers');
//   } else {
//     console.warn('No token available - request will be unauthenticated');
//   }
//   return headers;
// };


// function useDebounce(value, delay) {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const handler = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(handler);
//   }, [value, delay]);
//   return debouncedValue;
// }

// const Pagination = ({
//   currentPage,
//   totalPages,
//   onPageChange,
//   totalItems,
//   itemsPerPage,
// }) => {
//   const getVisiblePages = () => {
//     const pages = [];
//     const maxVisiblePages = 5;
    
//     if (totalPages <= maxVisiblePages) {
//       // Show all pages if total is small
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       // Calculate range around current page
//       let start = Math.max(1, currentPage - 2);
//       let end = Math.min(totalPages, currentPage + 2);
      
//       // Adjust if we're near the beginning or end
//       if (currentPage <= 3) {
//         start = 1;
//         end = Math.min(5, totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         start = Math.max(totalPages - 4, 1);
//         end = totalPages;
//       }
      
//       for (let i = start; i <= end; i++) {
//         pages.push(i);
//       }
//     }
    
//     return pages;
//   };

//   const startItem = (currentPage - 1) * itemsPerPage + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, totalItems);

//   return (
//     <div className="flex items-center justify-between px-4 py-3 border border-gray-200 bg-white rounded-lg shadow-sm">
//       {/* Left side - showing info */}
//       <div className="flex items-center text-sm text-gray-700">
//         <span>
//           Showing {startItem}-{endItem} of {totalItems} donors
//         </span>
//       </div>

//       {/* Right side - pagination controls */}
//       <div className="flex items-center space-x-1">
//         {/* Previous button */}
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="flex items-center px-3 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
//         >
//           <ChevronLeft className="w-4 h-4 mr-1" />
//           Previous
//         </button>

//         {/* Page numbers */}
//         <div className="flex items-center space-x-1">
//           {getVisiblePages().map((page) => (
//             <button
//               key={page}
//               onClick={() => onPageChange(page)}
//               className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
//                 page === currentPage
//                   ? "bg-red-600 text-white hover:bg-red-700"
//                   : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
//               }`}
//             >
//               {page}
//             </button>
//           ))}
//         </div>

//         {/* Next button */}
//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="flex items-center px-3 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
//         >
//           Next
//           <ChevronRight className="w-4 h-4 ml-1" />
//         </button>
//       </div>
//     </div>
//   );
// };

// const ManageDonors = () => {
//   const [donors, setDonors] = useState([]);
//   const [selectedDonor, setSelectedDonor] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const debouncedSearchTerm = useDebounce(searchTerm, 300);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [bloodGroupFilter, setBloodGroupFilter] = useState("all");
//   const [loading, setLoading] = useState(false);
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     inactive: 0,
//   });

//   // Sorting config: key and direction
//   const [sortConfig, setSortConfig] = useState({
//     key: "donor_id",
//     direction: "asc",
//   });

//   // Fetch donors + stats
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       // Get donors
//       const donorsRes = await fetch(`${API_BASE}/donors`, {
//         headers: getAuthHeaders(),
//         credentials: 'include', // Added credentials: 'include'
//       });
//       if (!donorsRes.ok) throw new Error(`HTTP error! status: ${donorsRes.status}`);
//       const donorsData = await donorsRes.json();

//       // Get counts
//       const totalRes = await fetch(`${API_BASE}/donorCount`, {
//         headers: getAuthHeaders(),
//         credentials: 'include', // Added credentials: 'include'
//       });
//       if (!totalRes.ok) throw new Error(`HTTP error! status: ${totalRes.status}`);
//       const totalData = await totalRes.json();

//       const activeRes = await fetch(`${API_BASE}/activeDonorCount`, {
//         headers: getAuthHeaders(),
//         credentials: 'include', // Added credentials: 'include'
//       });
//       if (!activeRes.ok) throw new Error(`HTTP error! status: ${activeRes.status}`);
//       const activeData = await activeRes.json();

//       const inactiveRes = await fetch(`${API_BASE}/deactiveDonorCount`, {
//         headers: getAuthHeaders(),
//         credentials: 'include', // Added credentials: 'include'
//       });
//       if (!inactiveRes.ok) throw new Error(`HTTP error! status: ${inactiveRes.status}`);
//       const inactiveData = await inactiveRes.json();

//       setDonors(donorsData);
//       setStats({
//         total: totalData.totalDonors,
//         active: activeData.totalActiveDonors,
//         inactive: inactiveData.totalDeactiveDonors,
//       });
//     } catch (error) {
//       console.error("Error fetching donor data:", error);
//       // Fallback to mock data or display error message
//       setDonors([]); // Clear previous data if API fails
//       setStats({ total: 0, active: 0, inactive: 0 });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter donors based on search, status, blood group
//   const filteredDonors = useMemo(() => {
//     return donors.filter((donor) => {
//       const matchesSearch =
//         donor.donor_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
//         donor.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
//         donor.phone_number.includes(debouncedSearchTerm);

//       const matchesStatus =
//         statusFilter === "all" || donor.status === statusFilter;

//       const matchesBloodGroup =
//         bloodGroupFilter === "all" || donor.blood_group === bloodGroupFilter;

//       return matchesSearch && matchesStatus && matchesBloodGroup;
//     });
//   }, [donors, debouncedSearchTerm, statusFilter, bloodGroupFilter]);

//   // Sort filtered donors
//   const sortedDonors = useMemo(() => {
//     const sorted = [...filteredDonors];
//     sorted.sort((a, b) => {
//       let aKey = a[sortConfig.key];
//       let bKey = b[sortConfig.key];

//       // For string keys, case-insensitive compare
//       if (typeof aKey === "string") {
//         aKey = aKey.toLowerCase();
//         bKey = bKey.toLowerCase();
//       }

//       if (aKey < bKey) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aKey > bKey) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//     return sorted;
//   }, [filteredDonors, sortConfig]);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
//   const totalPages = Math.ceil(sortedDonors.length / itemsPerPage);

//   // Paginated donors to display on current page
//   const paginatedDonors = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return sortedDonors.slice(start, start + itemsPerPage);
//   }, [sortedDonors, currentPage]);

//   // Change sorting field & direction
//   const requestSort = useCallback(
//     (key) => {
//       let direction = "asc";
//       if (sortConfig.key === key && sortConfig.direction === "asc") {
//         direction = "desc";
//       }
//       setSortConfig({ key, direction });
//     },
//     [sortConfig]
//   );

//   // Update donor status (activate/deactivate)
//   const handleStatusChange = async (donorId, newStatus) => {
//     const confirmation = window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} this donor?`);
//     if (!confirmation) return;

//     setLoading(true);
//     try {
//       const endpoint =
//         newStatus === "active"
//           ? `${API_BASE}/donors/activate/${donorId}`
//           : `${API_BASE}/donors/${donorId}`;

//       const method = newStatus === "active" ? "PUT" : "DELETE";

//       const res = await fetch(endpoint, { 
//         method, 
//         headers: getAuthHeaders(),
//         credentials: 'include', // Added credentials: 'include'
//       });
//       const data = await res.json();

//       if (res.ok) {
//         // Update donor list locally
//         setDonors((prev) =>
//           prev.map((donor) =>
//             donor.donor_id === donorId ? { ...donor, status: newStatus } : donor
//           )
//         );
//         console.log(data.message); // Replaced alert with console.log

//         // Refresh stats
//         const totalRes = await fetch(`${API_BASE}/donorCount`, {
//           headers: getAuthHeaders(),
//           credentials: 'include', // Added credentials: 'include'
//         });
//         const totalData = await totalRes.json();
//         const activeRes = await fetch(`${API_BASE}/activeDonorCount`, {
//           headers: getAuthHeaders(),
//           credentials: 'include', // Added credentials: 'include'
//         });
//         const activeData = await activeRes.json();
//         const inactiveRes = await fetch(`${API_BASE}/deactiveDonorCount`, {
//           headers: getAuthHeaders(),
//           credentials: 'include', // Added credentials: 'include'
//         });
//         const inactiveData = await inactiveRes.json();

//         setStats({
//           total: totalData.totalDonors,
//           active: activeData.totalActiveDonors,
//           inactive: inactiveData.totalDeactiveDonors,
//         });
//       } else {
//         console.error(data.message || "Error updating donor status"); // Replaced alert with console.error
//       }
//     } catch (error) {
//       console.error("Error updating donor status:", error); // Replaced alert with console.error
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

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6 font-sans">
//       <div className="max-w-7xl mx-auto relative">
//         {/* Loading overlay */}
//         {loading && (
//           <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50 rounded-lg">
//             <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
//           </div>
//         )}

//         {/* Header */}
//         <div className="mb-8 flex items-center space-x-4">
//           <div className="p-2 sm:p-3 bg-red-100 rounded-full shadow-md">
//             <Users className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-1">Donor Management</h1>
//             <p className="text-gray-600">Manage donors and their status</p>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-transform hover:scale-105 duration-200">
//             <div className="flex items-center">
//               <Users className="h-8 w-8 text-blue-600" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Donors</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-transform hover:scale-105 duration-200">
//             <div className="flex items-center">
//               <Activity className="h-8 w-8 text-green-600" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Active Donors</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-transform hover:scale-105 duration-200">
//             <div className="flex items-center">
//               <UserX className="h-8 w-8 text-red-600" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">
//                   Inactive Donors
//                 </p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search donors..."
//                 className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setCurrentPage(1); // reset page on search
//                 }}
//               />
//             </div>

//             <select
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 hover:border-gray-400"
//               value={statusFilter}
//               onChange={(e) => {
//                 setStatusFilter(e.target.value);
//                 setCurrentPage(1);
//               }}
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="deactive">Inactive</option>
//             </select>

//             <select
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 hover:border-gray-400"
//               value={bloodGroupFilter}
//               onChange={(e) => {
//                 setBloodGroupFilter(e.target.value);
//                 setCurrentPage(1);
//               }}
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
//         <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   {[
//                     { label: "Donor ID", key: "donor_id" },
//                     { label: "Name", key: "donor_name" },
//                     { label: "Blood Group", key: "blood_group" },
//                     { label: "District", key: "district_name" },
//                     { label: "Status", key: "status" },
//                     { label: "Actions" },
//                   ].map((col) => (
//                     <th
//                       key={col.key || col.label}
//                       onClick={() => col.key && requestSort(col.key)}
//                       className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
//                         col.key ? "cursor-pointer select-none" : ""
//                       }`}
//                     >
//                       <div className="flex items-center space-x-1">
//                         <span>{col.label}</span>
//                         {col.key && sortConfig.key === col.key && (
//                           <span>
//                             {sortConfig.direction === "asc" ? "▲" : "▼"}
//                           </span>
//                         )}
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {paginatedDonors.map((donor) => (
//                   <tr key={donor.donor_id} className="hover:bg-gray-50 transition-colors">
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
//                         className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                         title="View Donor Details"
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
//                           className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
//                           title="Deactivate Donor"
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
//                           className="inline-flex items-center px-3 py-1.5 border border-green-300 shadow-sm text-xs font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
//                           title="Activate Donor"
//                         >
//                           <UserCheck className="h-3 w-3 mr-1" />
//                           Activate
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}

//                 {paginatedDonors.length === 0 && (
//                   <tr>
//                     <td colSpan={6}>
//                       <div className="text-center py-12 bg-gray-50">
//                         <Users className="mx-auto h-12 w-12 text-gray-400" />
//                         <h3 className="mt-2 text-sm font-medium text-gray-900">
//                           No donors found
//                         </h3>
//                         <p className="mt-1 text-sm text-gray-500">
//                           Try adjusting your search or filter criteria.
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Modern Pagination */}
//         {totalPages > 0 && (
//           <div className="mt-6">
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={handlePageChange}
//               totalItems={filteredDonors.length}
//               itemsPerPage={itemsPerPage}
//             />
//           </div>
//         )}

//         {/* Modal */}
//         {showModal && selectedDonor && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="relative mx-auto p-6 border w-full max-w-md shadow-lg rounded-lg bg-white">
//               <div className="mt-3">
//                 <div className="flex items-center justify-between mb-4 pb-4 border-b">
//                   <h3 className="text-xl font-semibold text-gray-900">
//                     Donor Details
//                   </h3>
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
//                     aria-label="Close modal"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>

//                 <div className="space-y-4 text-sm text-gray-700">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Donor ID
//                     </label>
//                     <p className="mt-1 text-gray-900 font-medium">
//                       #{selectedDonor.donor_id}
//                     </p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Full Name
//                     </label>
//                     <p className="mt-1 text-gray-900">
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
//                     <p className="mt-1 text-gray-900">
//                       {selectedDonor.district_name}
//                     </p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Email
//                     </label>
//                     <p className="mt-1 text-gray-900">
//                       {selectedDonor.email}
//                     </p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Phone Number
//                     </label>
//                     <p className="mt-1 text-gray-900">
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

//                 <div className="mt-6 flex justify-end space-x-3 pt-4 border-t">
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                   >
//                     Close
//                   </button>

//                   {selectedDonor.status === "active" ? (
//                     <button
//                       onClick={() => {
//                         handleStatusChange(selectedDonor.donor_id, "deactive");
//                         setShowModal(false);
//                       }}
//                       className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
//                     >
//                       Deactivate Donor
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => {
//                         handleStatusChange(selectedDonor.donor_id, "active");
//                         setShowModal(false);
//                       }}
//                       className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
//                     >
//                       Activate Donor
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Loader styles */}
//         <style>{`
//           .loader {
//             border-top-color: #ef4444; /* Changed to red-600 for consistency */
//             animation: spinner 1.5s linear infinite;
//           }
//           @keyframes spinner {
//             0% { transform: rotate(0deg);}
//             100% { transform: rotate(360deg);}
//           }
//         `}</style>
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
  Users,
  Activity,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

const API_BASE = "http://localhost:9092/dashboard/admin";

// Types
interface Donor {
  donor_id: number;
  donor_name: string;
  email: string;
  phone_number: string;
  blood_group: string;
  district_name: string;
  status: 'active' | 'deactive';
}

interface Stats {
  total: number;
  active: number;
  inactive: number;
}

interface ConfirmAction {
  type: 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

interface SortConfig {
  key: keyof Donor;
  direction: 'asc' | 'desc';
}

interface PendingAction {
  donorId: number;
  newStatus: 'active' | 'deactive';
}

interface FilterOption {
  value: string;
  label: string;
}

// Utility functions
const getTokenFromCookie = (): string | null => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'adminToken' || name === 'token' || name === 'authToken' || name === 'admin_token') {
      const decodedValue = decodeURIComponent(value);
      console.log(`Found token in cookie '${name}':`, decodedValue.substring(0, 20) + '...');
      return decodedValue;
    }
  }
  console.log('No admin token found in cookies. Available cookies:', 
    document.cookie.split(';').map(c => c.trim().split('=')[0]));
  return null;
};

const getAuthHeaders = (): HeadersInit => {
  const token = getTokenFromCookie();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['X-Admin-Token'] = token;
    headers['Admin-Token'] = token;
    headers['X-Auth-Token'] = token;
    console.log('Sending request with token headers');
  } else {
    console.warn('No token available - request will be unauthenticated');
  }
  return headers;
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Reusable Components
interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon, title, subtitle }) => (
  <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
    <div className="p-2 sm:p-3 bg-red-100 rounded-full w-fit shadow-md">
      {icon}
    </div>
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{title}</h1>
      <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>
    </div>
  </div>
);

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string) =>
    status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)} shadow-sm`}>
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  );
};

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
    <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-red-600"></div>
  </div>
);

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search...",
  className = ""
}) => (
  <div className={`relative ${className}`}>
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm transition-all duration-200 hover:border-gray-400"
    />
  </div>
);

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  className?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = ""
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm transition-all duration-200 hover:border-gray-400 bg-white ${className}`}
  >
    <option value="">{placeholder}</option>
    {options.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color?: 'blue' | 'green' | 'red';
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  icon, 
  title, 
  value, 
  color = "blue" 
}) => {
  const colorClasses = {
    blue: 'bg-white text-blue-600',
    green: 'bg-white text-green-600',
    red: 'bg-white text-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 transition-transform hover:scale-105 duration-200">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg shadow-sm ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-3 sm:ml-4">
          <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemName?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemName = "items"
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = (): number[] => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      
      if (currentPage <= 3) {
        start = 1;
        end = Math.min(5, totalPages);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(totalPages - 4, 1);
        end = totalPages;
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-6 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-md">
      <div className="text-sm text-gray-600 mb-2 sm:mb-0">
        Showing <span className="font-semibold">{startItem}</span> to <span className="font-semibold">{endItem}</span> of{' '}
        <span className="font-semibold">{totalItems}</span> {itemName}
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>
        
        <div className="flex space-x-1">
          {getVisiblePages().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`px-3 py-2 text-sm font-medium rounded-md shadow-sm ${
                currentPage === pageNumber
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              } transition-colors`}
            >
              {pageNumber}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-2xl"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-lg ${maxWidth} w-full max-h-[90vh] overflow-y-auto shadow-lg`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

interface FilterBarProps {
  children: React.ReactNode;
}

const FilterBar: React.FC<FilterBarProps> = ({ children }) => (
  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 border border-gray-200">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {children}
    </div>
  </div>
);

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md';
  disabled?: boolean;
  title?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  icon,
  label,
  variant = 'secondary',
  size = 'sm',
  disabled = false,
  title
}) => {
  const baseClasses = "flex items-center rounded-md transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base"
  };
  
  const variantClasses = {
    primary: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    success: "bg-green-100 text-green-700 hover:bg-green-200",
    danger: "bg-red-100 text-red-700 hover:bg-red-200"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4 mr-2" })}
      {label}
    </button>
  );
};

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => (
  <div className="p-8 text-center bg-gray-50">
    <div className="mx-auto mb-4">
      {React.cloneElement(icon as React.ReactElement, { className: "w-12 h-12 text-gray-400 mx-auto" })}
    </div>
    <p className="text-gray-500 text-lg">{title}</p>
    {description && <p className="text-gray-400 text-sm mt-2">{description}</p>}
  </div>
);

interface NotificationModalsProps {
  isConfirmModalOpen: boolean;
  confirmAction: ConfirmAction | null;
  setIsConfirmModalOpen: (open: boolean) => void;
  setConfirmAction: (action: ConfirmAction | null) => void;
  handleConfirm: () => void;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  success: string | null;
  setSuccess: (success: string | null) => void;
}

const NotificationModals: React.FC<NotificationModalsProps> = ({
  isConfirmModalOpen,
  confirmAction,
  setIsConfirmModalOpen,
  setConfirmAction,
  handleConfirm,
  loading,
  error,
  setError,
  success,
  setSuccess
}) => {
  return (
    <>
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

              <p className="text-gray-600 mb-6">{confirmAction.message}</p>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    setConfirmAction(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
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
    </>
  );
};

const ManageDonors: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bloodGroupFilter, setBloodGroupFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    inactive: 0,
  });

  // Notification states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  // Sorting config
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "donor_id",
    direction: "asc",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);

      // Fetch donors
      const donorsRes = await fetch(`${API_BASE}/donors`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!donorsRes.ok) throw new Error(`HTTP error! status: ${donorsRes.status}`);
      const donorsData: Donor[] = await donorsRes.json();

      // Fetch stats
      const [totalRes, activeRes, inactiveRes] = await Promise.all([
        fetch(`${API_BASE}/donorCount`, {
          headers: getAuthHeaders(),
          credentials: 'include',
        }),
        fetch(`${API_BASE}/activeDonorCount`, {
          headers: getAuthHeaders(),
          credentials: 'include',
        }),
        fetch(`${API_BASE}/deactiveDonorCount`, {
          headers: getAuthHeaders(),
          credentials: 'include',
        })
      ]);

      const totalData = await totalRes.json();
      const activeData = await activeRes.json();
      const inactiveData = await inactiveRes.json();

      setDonors(donorsData);
      setStats({
        total: totalData.totalDonors,
        active: activeData.totalActiveDonors,
        inactive: inactiveData.totalDeactiveDonors,
      });
    } catch (error) {
      console.error("Error fetching donor data:", error);
      setError("Failed to fetch donor data. Please try again.");
      setDonors([]);
      setStats({ total: 0, active: 0, inactive: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Filter donors
  const filteredDonors = useMemo((): Donor[] => {
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
  const sortedDonors = useMemo((): Donor[] => {
    const sorted = [...filteredDonors];
    sorted.sort((a, b) => {
      let aKey: any = a[sortConfig.key];
      let bKey: any = b[sortConfig.key];

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

  // Pagination
  const totalPages = Math.ceil(sortedDonors.length / itemsPerPage);
  const paginatedDonors = useMemo((): Donor[] => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedDonors.slice(start, start + itemsPerPage);
  }, [sortedDonors, currentPage]);

  // Sorting
  const requestSort = useCallback(
    (key: keyof Donor): void => {
      let direction: 'asc' | 'desc' = "asc";
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ key, direction });
    },
    [sortConfig]
  );

  // Handle status change with confirmation
  const handleStatusChangeRequest = (donorId: number, newStatus: 'active' | 'deactive', donorName: string): void => {
    const action = newStatus === 'active' ? 'activate' : 'deactivate';
    setConfirmAction({
      type: newStatus === 'active' ? 'success' : 'warning',
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Donor`,
      message: `Are you sure you want to ${action} donor "${donorName}"? This action will change their availability status.`
    });
    setPendingAction({ donorId, newStatus });
    setIsConfirmModalOpen(true);
  };

  // Execute status change
  const handleConfirm = async (): Promise<void> => {
    if (!pendingAction) return;

    const { donorId, newStatus } = pendingAction;
    setLoading(true);

    try {
      const endpoint =
        newStatus === "active"
          ? `${API_BASE}/donors/activate/${donorId}`
          : `${API_BASE}/donors/${donorId}`;

      const method = newStatus === "active" ? "PUT" : "DELETE";

      const res = await fetch(endpoint, { 
        method, 
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok) {
        // Update donor list locally
        setDonors((prev) =>
          prev.map((donor) =>
            donor.donor_id === donorId ? { ...donor, status: newStatus } : donor
          )
        );

        // Update stats
        if (newStatus === 'active') {
          setStats(prev => ({
            ...prev,
            active: prev.active + 1,
            inactive: prev.inactive - 1
          }));
        } else {
          setStats(prev => ({
            ...prev,
            active: prev.active - 1,
            inactive: prev.inactive + 1
          }));
        }

        setSuccess(`Donor ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      } else {
        setError(data.message || "Error updating donor status");
      }
    } catch (error) {
      console.error("Error updating donor status:", error);
      setError("Failed to update donor status. Please try again.");
    } finally {
      setLoading(false);
      setIsConfirmModalOpen(false);
      setConfirmAction(null);
      setPendingAction(null);
    }
  };

  const handleViewDetails = (donor: Donor): void => {
    setSelectedDonor(donor);
    setShowModal(true);
  };

  const getBloodGroups = (): string[] => {
    const bloodGroups = [...new Set(donors.map((donor) => donor.blood_group))];
    return bloodGroups.sort();
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter, bloodGroupFilter]);

  if (loading && donors.length === 0) {
    return <LoadingSpinner />;
  }

  const statusOptions: FilterOption[] = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "deactive", label: "Inactive" }
  ];

  const bloodGroupOptions: FilterOption[] = [
    { value: "all", label: "All Blood Groups" },
    ...getBloodGroups().map(group => ({ value: group, label: group }))
  ];

  const tableColumns = [
    { label: "Donor ID", key: "donor_id" as keyof Donor },
    { label: "Name", key: "donor_name" as keyof Donor },
    { label: "Blood Group", key: "blood_group" as keyof Donor },
    { label: "District", key: "district_name" as keyof Donor },
    { label: "Status", key: "status" as keyof Donor },
    { label: "Actions", key: undefined },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <PageHeader
          icon={<Users className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />}
          title="Donor Management"
          subtitle="Manage donors and their status"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={<Users className="h-8 w-8" />}
            title="Total Donors"
            value={stats.total}
            color="blue"
          />
          <StatsCard
            icon={<Activity className="h-8 w-8" />}
            title="Active Donors"
            value={stats.active}
            color="green"
          />
          <StatsCard
            icon={<UserX className="h-8 w-8" />}
            title="Inactive Donors"
            value={stats.inactive}
            color="red"
          />
        </div>

        {/* Filter Bar */}
        <FilterBar>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search donors..."
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            placeholder="Select status..."
          />
          <FilterSelect
            value={bloodGroupFilter}
            onChange={setBloodGroupFilter}
            options={bloodGroupOptions}
            placeholder="Select blood group..."
          />
        </FilterBar>

        {/* Donors Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {tableColumns.map((col) => (
                    <th
                      key={col.key || col.label}
                      onClick={() => col.key && requestSort(col.key)}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        col.key ? "cursor-pointer select-none hover:bg-gray-100" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{col.label}</span>
                        {col.key && sortConfig.key === col.key && (
                          <span className="text-red-600">
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
                  <tr key={donor.donor_id} className="hover:bg-gray-50 transition-colors">
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
                      <StatusBadge status={donor.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <ActionButton
                          onClick={() => handleViewDetails(donor)}
                          icon={<Eye />}
                          label="View"
                          variant="secondary"
                          title="View Donor Details"
                        />

                        {donor.status === "active" ? (
                          <ActionButton
                            onClick={() =>
                              handleStatusChangeRequest(donor.donor_id, "deactive", donor.donor_name)
                            }
                            icon={<UserX />}
                            label="Deactivate"
                            variant="danger"
                            disabled={loading}
                            title="Deactivate Donor"
                          />
                        ) : (
                          <ActionButton
                            onClick={() =>
                              handleStatusChangeRequest(donor.donor_id, "active", donor.donor_name)
                            }
                            icon={<UserCheck />}
                            label="Activate"
                            variant="success"
                            disabled={loading}
                            title="Activate Donor"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedDonors.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-0">
                      <EmptyState
                        icon={<Users />}
                        title="No donors found"
                        description="Try adjusting your search or filter criteria."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredDonors.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            itemName="donors"
          />
        )}

        {/* Donor Details Modal */}
        <ModalWrapper
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Donor Details"
          maxWidth="max-w-md"
        >
          {selectedDonor && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Donor ID
                </label>
                <p className="mt-1 text-gray-900 font-medium">
                  #{selectedDonor.donor_id}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <p className="mt-1 text-gray-900">
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
                <p className="mt-1 text-gray-900">
                  {selectedDonor.district_name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-gray-900">
                  {selectedDonor.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <p className="mt-1 text-gray-900">
                  {selectedDonor.phone_number}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <StatusBadge status={selectedDonor.status} />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <ActionButton
                  onClick={() => setShowModal(false)}
                  icon={<X />}
                  label="Close"
                  variant="secondary"
                />

                {selectedDonor.status === "active" ? (
                  <ActionButton
                    onClick={() => {
                      handleStatusChangeRequest(selectedDonor.donor_id, "deactive", selectedDonor.donor_name);
                      setShowModal(false);
                    }}
                    icon={<UserX />}
                    label="Deactivate"
                    variant="danger"
                  />
                ) : (
                  <ActionButton
                    onClick={() => {
                      handleStatusChangeRequest(selectedDonor.donor_id, "active", selectedDonor.donor_name);
                      setShowModal(false);
                    }}
                    icon={<UserCheck />}
                    label="Activate"
                    variant="success"
                  />
                )}
              </div>
            </div>
          )}
        </ModalWrapper>

        {/* Notification Modals */}
        <NotificationModals
          isConfirmModalOpen={isConfirmModalOpen}
          confirmAction={confirmAction}
          setIsConfirmModalOpen={setIsConfirmModalOpen}
          setConfirmAction={setConfirmAction}
          handleConfirm={handleConfirm}
          loading={loading}
          error={error}
          setError={setError}
          success={success}
          setSuccess={setSuccess}
        />
      </div>
    </div>
  );
};

export default ManageDonors;
