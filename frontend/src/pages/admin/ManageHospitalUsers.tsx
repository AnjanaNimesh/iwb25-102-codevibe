// import React, { useState, useEffect } from 'react';
// import { Hospital, Search, Eye, Edit, UserCheck, UserX, ChevronLeft, ChevronRight, X } from 'lucide-react';

// interface District {
//   district_id: number;
//   district_name: string;
// }

// interface HospitalUser {
//   hospital_email: string;
//   hospital_name: string;
//   hospital_type: string;
//   hospital_address: string;
//   contact_number: string;
//   status: string;
//   district_name: string;
//   hospital_id: number;
// }

// interface UpdateHospitalUser {
//   hospital_id: number;
//   hospital_email: string;
//   hospital_name: string;
// }

// const HospitalUserManagement: React.FC = () => {
//   const [hospitalUsers, setHospitalUsers] = useState<HospitalUser[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<HospitalUser[]>([]);
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [selectedDistrict, setSelectedDistrict] = useState<string>('');
//   const [statusFilter, setStatusFilter] = useState<string>('');
//   const [selectedUser, setSelectedUser] = useState<HospitalUser | null>(null);
//   const [showModal, setShowModal] = useState<boolean>(false);
//   const [showEditModal, setShowEditModal] = useState<boolean>(false);
//   const [editingUser, setEditingUser] = useState<HospitalUser | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [actionLoading, setActionLoading] = useState<boolean>(false);

//   const usersPerPage = 5;
//   const baseUrl = 'http://localhost:9092/dashboard/admin';

//   // Fetch hospital users with hospital_id included
//   const fetchHospitalUsers = async (): Promise<void> => {
//     try {
//       const response = await fetch(`${baseUrl}/hospitalUserData`);
//       if (response.ok) {
//         const users = await response.json();
//         // Add mock hospital_id for demonstration (in real scenario, this should come from API)
//         const usersWithId = users.map((user: HospitalUser, index: number) => ({
//           ...user,
//           hospital_id: index + 1 // This should come from your API
//         }));
//         setHospitalUsers(usersWithId);
//         setFilteredUsers(usersWithId);
//       } else {
//         console.error('Failed to fetch hospital users');
//       }
//     } catch (error) {
//       console.error('Error fetching hospital users:', error);
//     }
//   };

//   // Fetch districts
//   const fetchDistricts = async (): Promise<void> => {
//     try {
//       const response = await fetch(`${baseUrl}/districts`);
//       if (response.ok) {
//         const districtsData = await response.json();
//         setDistricts(districtsData);
//       } else {
//         console.error('Failed to fetch districts');
//       }
//     } catch (error) {
//       console.error('Error fetching districts:', error);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       await Promise.all([fetchHospitalUsers(), fetchDistricts()]);
//       setLoading(false);
//     };
    
//     fetchData();
//   }, []);

//   useEffect(() => {
//     let filtered = hospitalUsers;

//     // Search by hospital name
//     if (searchTerm) {
//       filtered = filtered.filter(user =>
//         user.hospital_name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Filter by district
//     if (selectedDistrict) {
//       filtered = filtered.filter(user => user.district_name === selectedDistrict);
//     }

//     // Filter by status
//     if (statusFilter) {
//       filtered = filtered.filter(user => user.status === statusFilter);
//     }

//     setFilteredUsers(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, selectedDistrict, statusFilter, hospitalUsers]);

//   // Handle status toggle (activate/deactivate)
//   const handleStatusToggle = async (user: HospitalUser, newStatus: string): Promise<void> => {
//     setActionLoading(true);
//     try {
//       let response;
//       if (newStatus === 'active') {
//         response = await fetch(`${baseUrl}/hospitalUser/activate/${user.hospital_id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//       } else {
//         response = await fetch(`${baseUrl}/hospitalUser/${user.hospital_id}`, {
//           method: 'DELETE',
//         });
//       }

//       if (response.ok) {
//         const result = await response.json();
//         console.log(result.message);
        
//         // Update local state
//         const updatedUsers = hospitalUsers.map(u =>
//           u.hospital_id === user.hospital_id ? { ...u, status: newStatus } : u
//         );
//         setHospitalUsers(updatedUsers);
        
//         // Show success message
//         alert(result.message);
//       } else {
//         console.error('Failed to update user status');
//         alert('Failed to update user status');
//       }
//     } catch (error) {
//       console.error('Error updating user status:', error);
//       alert('Error updating user status');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Handle edit user
//   const handleEditUser = async (updatedUser: UpdateHospitalUser): Promise<void> => {
//     setActionLoading(true);
//     try {
//       const response = await fetch(`${baseUrl}/hospitalUsers`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedUser),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log(result.message);
        
//         // Refresh the data
//         await fetchHospitalUsers();
//         setShowEditModal(false);
//         setEditingUser(null);
        
//         alert(result.message);
//       } else {
//         const errorResult = await response.json();
//         alert(errorResult.message || 'Failed to update hospital user');
//       }
//     } catch (error) {
//       console.error('Error updating hospital user:', error);
//       alert('Error updating hospital user');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const showUserDetails = (user: HospitalUser): void => {
//     setSelectedUser(user);
//     setShowModal(true);
//   };

//   const showEditForm = (user: HospitalUser): void => {
//     setEditingUser(user);
//     setShowEditModal(true);
//   };

//   // Pagination logic
//   const indexOfLastUser = currentPage * usersPerPage;
//   const indexOfFirstUser = indexOfLastUser - usersPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
//   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

//   const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

//   const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
//     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//       status === 'active' 
//         ? 'bg-green-100 text-green-800' 
//         : 'bg-red-100 text-red-800'
//     }`}>
//       {status.charAt(0).toUpperCase() + status.slice(1)}
//     </span>
//   );

//   // View Details Modal
//   const ViewModal: React.FC = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-xl font-semibold text-gray-900">Hospital Details</h3>
//             <button
//               onClick={() => setShowModal(false)}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>
          
//           {selectedUser && (
//             <div className="space-y-6">
//               {/* Header with Hospital Icon and Name */}
//               <div className="flex items-center space-x-4 pb-6 border-b">
//                 <div className="p-3 bg-blue-100 rounded-full">
//                   <Hospital className="w-8 h-8 text-blue-600" />
//                 </div>
//                 <div>
//                   <h4 className="text-xl font-semibold text-gray-900">{selectedUser.hospital_name}</h4>
//                   <p className="text-blue-600 font-medium">{selectedUser.hospital_type}</p>
//                 </div>
//               </div>

//               {/* Details Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="flex items-start space-x-3">
//                   <Hospital className="w-5 h-5 text-blue-500 mt-1" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Hospital ID</p>
//                     <p className="text-gray-900">#{selectedUser.hospital_id}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start space-x-3">
//                   <div className="w-5 h-5 bg-red-500 rounded mt-1"></div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Address</p>
//                     <p className="text-gray-900">{selectedUser.hospital_address}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start space-x-3">
//                   <div className="w-5 h-5 bg-purple-500 rounded mt-1"></div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Hospital Type</p>
//                     <p className="text-gray-900">{selectedUser.hospital_type}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start space-x-3">
//                   <div className="w-5 h-5 bg-yellow-500 rounded mt-1"></div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Contact Number</p>
//                     <p className="text-gray-900">{selectedUser.contact_number}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start space-x-3">
//                   <div className="w-5 h-5 bg-green-500 rounded mt-1"></div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">District</p>
//                     <p className="text-gray-900">{selectedUser.district_name}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start space-x-3">
//                   <div className="w-5 h-5 bg-indigo-500 rounded mt-1"></div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Status</p>
//                     <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
//                       selectedUser.status === 'active' 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-red-100 text-red-800'
//                     }`}>
//                       {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Action Buttons */}
//               <div className="flex justify-end space-x-3 pt-6 border-t">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//                 >
//                   Close
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowModal(false);
//                     showEditForm(selectedUser);
//                   }}
//                   className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                 >
//                   <Edit className="w-4 h-4 mr-2" />
//                   Edit Hospital
//                 </button>
//                 {selectedUser.status === 'active' ? (
//                   <button
//                     onClick={() => {
//                       setShowModal(false);
//                       handleStatusToggle(selectedUser, 'deactive');
//                     }}
//                     className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//                   >
//                     <UserX className="w-4 h-4 mr-2" />
//                     Deactivate Hospital
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => {
//                       setShowModal(false);
//                       handleStatusToggle(selectedUser, 'active');
//                     }}
//                     className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//                   >
//                     <UserCheck className="w-4 h-4 mr-2" />
//                     Activate Hospital
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   // Edit Modal
//   const EditModal: React.FC = () => {
//     const [formData, setFormData] = useState<UpdateHospitalUser>({
//       hospital_id: editingUser?.hospital_id || 0,
//       hospital_email: editingUser?.hospital_email || '',
//       hospital_name: editingUser?.hospital_name || '',
//     });

//     const handleSubmit = (): void => {
//       if (!formData.hospital_email || !formData.hospital_name) {
//         alert('Please fill in all required fields');
//         return;
//       }
//       handleEditUser(formData);
//     };

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
//       const { name, value } = e.target;
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     };

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-lg max-w-md w-full">
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">Edit Hospital User</h3>
//               <button
//                 onClick={() => {
//                   setShowEditModal(false);
//                   setEditingUser(null);
//                 }}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Hospital Email *
//                 </label>
//                 <input
//                   type="email"
//                   name="hospital_email"
//                   value={formData.hospital_email}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Hospital Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="hospital_name"
//                   value={formData.hospital_name}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                 />
//               </div>
              
//               <div className="flex justify-end space-x-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowEditModal(false);
//                     setEditingUser(null);
//                   }}
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   disabled={actionLoading}
//                   className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
//                 >
//                   {actionLoading ? 'Updating...' : 'Update'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="animate-pulse">
//             <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
//             <div className="h-4 bg-gray-300 rounded w-1/4 mb-8"></div>
//             <div className="space-y-4">
//               {[1,2,3,4,5].map(i => (
//                 <div key={i} className="h-16 bg-gray-300 rounded"></div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-8 flex items-center space-x-4">
//           <div className="p-2 sm:p-3 bg-red-100 rounded-full">
//             <Hospital className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-1">Manage Hospital Users</h1>
//             <p className="text-gray-600">View and manage hospital user accounts</p>
//           </div>
//         </div>

//         {/* Filters Section */}
//         <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search by hospital name..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
//               />
//             </div>

//             {/* District Filter */}
//             <select
//               value={selectedDistrict}
//               onChange={(e) => setSelectedDistrict(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
//             >
//               <option value="">All Districts</option>
//               {districts.map(district => (
//                 <option key={district.district_id} value={district.district_name}>
//                   {district.district_name}
//                 </option>
//               ))}
//             </select>

//             {/* Status Filter */}
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
//             >
//               <option value="">All Status</option>
//               <option value="active">Active</option>
//               <option value="deactive">Inactive</option>
//             </select>
//           </div>
//         </div>

//         {/* Results Info */}
//         <div className="mb-4 text-sm text-gray-600">
//           Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} hospital users
//         </div>

//         {/* Hospital Users List */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           {currentUsers.length === 0 ? (
//             <div className="p-8 text-center">
//               <Hospital className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500">No hospital users found</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Hospital
//                     </th>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
//                       Email
//                     </th>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
//                       District
//                     </th>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {currentUsers.map((user, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="px-4 sm:px-6 py-4">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{user.hospital_name}</div>
//                           <div className="text-sm text-gray-500 sm:hidden">{user.hospital_email}</div>
//                         </div>
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 hidden sm:table-cell">
//                         {user.hospital_email}
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 hidden md:table-cell">
//                         {user.district_name}
//                       </td>
//                       <td className="px-4 sm:px-6 py-4">
//                         <StatusBadge status={user.status} />
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 text-sm">
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => showUserDetails(user)}
//                             className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
//                             disabled={actionLoading}
//                           >
//                             <Eye className="w-4 h-4 mr-2" />
//                             View
//                           </button>
                          
//                           <button
//                             onClick={() => showEditForm(user)}
//                             className="flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
//                             disabled={actionLoading}
//                           >
//                             <Edit className="w-4 h-4 mr-2" />
//                             Edit
//                           </button>
                          
//                           {user.status === 'active' ? (
//                             <button
//                               onClick={() => handleStatusToggle(user, 'deactive')}
//                               className="flex items-center px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
//                               disabled={actionLoading}
//                             >
//                               <UserX className="w-4 h-4 mr-2" />
//                               Deactivate
//                             </button>
//                           ) : (
//                             <button
//                               onClick={() => handleStatusToggle(user, 'active')}
//                               className="flex items-center px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
//                               disabled={actionLoading}
//                             >
//                               <UserCheck className="w-4 h-4 mr-2" />
//                               Activate
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="bg-white rounded-lg shadow-sm mt-6 p-4">
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-gray-700">
//                 Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => paginate(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <ChevronLeft className="w-4 h-4 mr-1" />
//                   Previous
//                 </button>
                
//                 <div className="flex space-x-1">
//                   {[...Array(totalPages)].map((_, index) => {
//                     const pageNumber = index + 1;
//                     return (
//                       <button
//                         key={pageNumber}
//                         onClick={() => paginate(pageNumber)}
//                         className={`px-3 py-2 text-sm font-medium rounded-md ${
//                           currentPage === pageNumber
//                             ? 'bg-red-600 text-white'
//                             : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
//                         }`}
//                       >
//                         {pageNumber}
//                       </button>
//                     );
//                   })}
//                 </div>
                
//                 <button
//                   onClick={() => paginate(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Next
//                   <ChevronRight className="w-4 h-4 ml-1" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Modals */}
//         {showModal && <ViewModal />}
//         {showEditModal && <EditModal />}
//       </div>
//     </div>
//   );
// };

// export default HospitalUserManagement;


// import React, { useState, useEffect } from 'react';
// import { Hospital, Search, Eye, Edit, UserCheck, UserX, ChevronLeft, ChevronRight, X } from 'lucide-react';

// interface District {
//   district_id: number;
//   district_name: string;
// }

// interface HospitalUser {
//   hospital_email: string;
//   hospital_name: string;
//   hospital_type: string;
//   hospital_address: string;
//   contact_number: string;
//   status: string;
//   district_name: string;
//   hospital_id: number;
// }

// interface UpdateHospitalUser {
//   hospital_id: number;
//   hospital_email: string;
//   hospital_name: string;
// }

// const HospitalUserManagement: React.FC = () => {
//   const [hospitalUsers, setHospitalUsers] = useState<HospitalUser[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<HospitalUser[]>([]);
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [selectedDistrict, setSelectedDistrict] = useState<string>('');
//   const [statusFilter, setStatusFilter] = useState<string>('');
//   const [selectedUser, setSelectedUser] = useState<HospitalUser | null>(null);
//   const [showModal, setShowModal] = useState<boolean>(false);
//   const [showEditModal, setShowEditModal] = useState<boolean>(false);
//   const [editingUser, setEditingUser] = useState<HospitalUser | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [actionLoading, setActionLoading] = useState<boolean>(false);

//   const usersPerPage = 5;
//   const baseUrl = 'http://localhost:9092/dashboard/admin';

//   // Utility function to get token from cookies (copied from previous immersive)
//   const getTokenFromCookie = (): string | null => {
//     const cookies = document.cookie.split(';');
//     for (let cookie of cookies) {
//       const [name, value] = cookie.trim().split('=');
//       if (name === 'adminToken' || name === 'token' || name === 'authToken' || name === 'admin_token') {
//         const decodedValue = decodeURIComponent(value);
//         console.log(`Found token in cookie '${name}':`, decodedValue.substring(0, 20) + '...');
//         return decodedValue;
//       }
//     }
//     console.log('No admin token found in cookies. Available cookies:', 
//       document.cookie.split(';').map(c => c.trim().split('=')[0]));
//     return null;
//   };

//   // Utility function to create authenticated headers (copied from previous immersive)
//   const getAuthHeaders = (): HeadersInit => {
//     const token = getTokenFromCookie();
//     const headers: HeadersInit = {
//       'Content-Type': 'application/json',
//     };
    
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//       headers['X-Admin-Token'] = token;
//       headers['Admin-Token'] = token;
//       headers['X-Auth-Token'] = token;
//       console.log('Sending request with token headers');
//     } else {
//       console.warn('No token available - request will be unauthenticated');
//     }
//     return headers;
//   };

//   // Fetch hospital users with hospital_id included
//   const fetchHospitalUsers = async (): Promise<void> => {
//     try {
//       const response = await fetch(`${baseUrl}/hospitalUserData`, {
//         method: 'GET',
//         headers: getAuthHeaders(),
//         credentials: 'include', // Added credentials: 'include'
//       });
//       if (response.ok) {
//         const users = await response.json();
//         // Add mock hospital_id for demonstration (in real scenario, this should come from API)
//         const usersWithId = users.map((user: HospitalUser, index: number) => ({
//           ...user,
//           hospital_id: user.hospital_id || (index + 1) // Use existing ID or mock one
//         }));
//         setHospitalUsers(usersWithId);
//         setFilteredUsers(usersWithId);
//       } else {
//         console.error('Failed to fetch hospital users');
//       }
//     } catch (error) {
//       console.error('Error fetching hospital users:', error);
//     }
//   };

//   // Fetch districts
//   const fetchDistricts = async (): Promise<void> => {
//     try {
//       const response = await fetch(`${baseUrl}/districts`, {
//         method: 'GET',
//         headers: getAuthHeaders(),
//         credentials: 'include', // Added credentials: 'include'
//       });
//       if (response.ok) {
//         const districtsData = await response.json();
//         setDistricts(districtsData);
//       } else {
//         console.error('Failed to fetch districts');
//       }
//     } catch (error) {
//       console.error('Error fetching districts:', error);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       await Promise.all([fetchHospitalUsers(), fetchDistricts()]);
//       setLoading(false);
//     };
    
//     fetchData();
//   }, []);

//   useEffect(() => {
//     let filtered = hospitalUsers;

//     // Search by hospital name
//     if (searchTerm) {
//       filtered = filtered.filter(user =>
//         user.hospital_name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Filter by district
//     if (selectedDistrict) {
//       filtered = filtered.filter(user => user.district_name === selectedDistrict);
//     }

//     // Filter by status
//     if (statusFilter) {
//       filtered = filtered.filter(user => user.status === statusFilter);
//     }

//     setFilteredUsers(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, selectedDistrict, statusFilter, hospitalUsers]);

//   // Handle status toggle (activate/deactivate)
//   const handleStatusToggle = async (user: HospitalUser, newStatus: string): Promise<void> => {
//     const confirmation = window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} this hospital user?`);
//     if (!confirmation) return;

//     setActionLoading(true);
//     try {
//       let response;
//       if (newStatus === 'active') {
//         response = await fetch(`${baseUrl}/hospitalUser/activate/${user.hospital_id}`, {
//           method: 'PUT',
//           headers: getAuthHeaders(),
//           credentials: 'include', // Added credentials: 'include'
//         });
//       } else {
//         response = await fetch(`${baseUrl}/hospitalUser/${user.hospital_id}`, {
//           method: 'DELETE',
//           headers: getAuthHeaders(),
//           credentials: 'include', // Added credentials: 'include'
//         });
//       }

//       if (response.ok) {
//         const result = await response.json();
//         console.log(result.message);
        
//         // Update local state
//         const updatedUsers = hospitalUsers.map(u =>
//           u.hospital_id === user.hospital_id ? { ...u, status: newStatus } : u
//         );
//         setHospitalUsers(updatedUsers);
        
//         // Use console.log for success message
//         console.log(`Hospital user ${newStatus}d successfully.`);
//       } else {
//         console.error('Failed to update user status');
//         const errorResult = await response.json().catch(() => ({ message: 'Unknown error' }));
//         console.error(`Failed to update user status: ${errorResult.message}`);
//       }
//     } catch (error) {
//       console.error('Error updating user status:', error);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Handle edit user
//   const handleEditUser = async (updatedUser: UpdateHospitalUser): Promise<void> => {
//     setActionLoading(true);
//     try {
//       const response = await fetch(`${baseUrl}/hospitalUsers`, {
//         method: 'PUT',
//         headers: getAuthHeaders(),
//         body: JSON.stringify(updatedUser),
//         credentials: 'include', // Added credentials: 'include'
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log(result.message);
        
//         // Refresh the data
//         await fetchHospitalUsers();
//         setShowEditModal(false);
//         setEditingUser(null);
        
//         console.log('Hospital user updated successfully.');
//       } else {
//         const errorResult = await response.json().catch(() => ({ message: 'Unknown error' }));
//         console.error(errorResult.message || 'Failed to update hospital user');
//       }
//     } catch (error) {
//       console.error('Error updating hospital user:', error);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const showUserDetails = (user: HospitalUser): void => {
//     setSelectedUser(user);
//     setShowModal(true);
//   };

//   const showEditForm = (user: HospitalUser): void => {
//     setEditingUser(user);
//     setShowEditModal(true);
//   };

//   // Pagination logic
//   const indexOfLastUser = currentPage * usersPerPage;
//   const indexOfFirstUser = indexOfLastUser - usersPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
//   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

//   const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

//   const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
//     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//       status === 'active' 
//         ? 'bg-green-100 text-green-800' 
//         : 'bg-red-100 text-red-800'
//     }`}>
//       {status.charAt(0).toUpperCase() + status.slice(1)}
//     </span>
//   );

//   // View Details Modal
//   const ViewModal: React.FC = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6 border-b pb-4">
//             <h3 className="text-2xl font-semibold text-gray-900">Hospital Details</h3>
//             <button
//               onClick={() => setShowModal(false)}
//               className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>
          
//           {selectedUser && (
//             <div className="space-y-6">
//               {/* Header with Hospital Icon and Name */}
//               <div className="flex items-center space-x-4">
//                 <div className="p-3 bg-blue-100 rounded-full shadow-sm">
//                   <Hospital className="w-8 h-8 text-blue-600" />
//                 </div>
//                 <div>
//                   <h4 className="text-xl font-semibold text-gray-900">{selectedUser.hospital_name}</h4>
//                   <p className="text-blue-600 font-medium">{selectedUser.hospital_type}</p>
//                 </div>
//               </div>

//               {/* Details Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
//                 <div className="flex items-start space-x-3">
//                   <Hospital className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
//                   <div>
//                     <p className="font-medium text-gray-500">Hospital ID</p>
//                     <p className="text-gray-900">#{selectedUser.hospital_id}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start space-x-3">
//                   <img src="https://placehold.co/20x20/ef4444/ffffff?text=AD" alt="Address Icon" className="mt-1 flex-shrink-0 rounded" /> {/* Placeholder for address icon */}
//                   <div>
//                     <p className="font-medium text-gray-500">Address</p>
//                     <p className="text-gray-900">{selectedUser.hospital_address}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start space-x-3">
//                   <img src="https://placehold.co/20x20/8b5cf6/ffffff?text=HT" alt="Hospital Type Icon" className="mt-1 flex-shrink-0 rounded" /> {/* Placeholder for hospital type icon */}
//                   <div>
//                     <p className="font-medium text-gray-500">Hospital Type</p>
//                     <p className="text-gray-900">{selectedUser.hospital_type}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start space-x-3">
//                   <img src="https://placehold.co/20x20/f59e0b/ffffff?text=CN" alt="Contact Icon" className="mt-1 flex-shrink-0 rounded" /> {/* Placeholder for contact icon */}
//                   <div>
//                     <p className="font-medium text-gray-500">Contact Number</p>
//                     <p className="text-gray-900">{selectedUser.contact_number}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start space-x-3">
//                   <img src="https://placehold.co/20x20/10b981/ffffff?text=DI" alt="District Icon" className="mt-1 flex-shrink-0 rounded" /> {/* Placeholder for district icon */}
//                   <div>
//                     <p className="font-medium text-gray-500">District</p>
//                     <p className="text-gray-900">{selectedUser.district_name}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start space-x-3">
//                   <img src="https://placehold.co/20x20/6366f1/ffffff?text=ST" alt="Status Icon" className="mt-1 flex-shrink-0 rounded" /> {/* Placeholder for status icon */}
//                   <div>
//                     <p className="font-medium text-gray-500">Status</p>
//                     <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
//                       selectedUser.status === 'active' 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-red-100 text-red-800'
//                     } shadow-sm`}>
//                       {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Action Buttons */}
//               <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors shadow-sm"
//                 >
//                   Close
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowModal(false);
//                     showEditForm(selectedUser);
//                   }}
//                   className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
//                 >
//                   <Edit className="w-4 h-4 mr-2" />
//                   Edit Hospital
//                 </button>
//                 {selectedUser.status === 'active' ? (
//                   <button
//                     onClick={() => {
//                       setShowModal(false);
//                       handleStatusToggle(selectedUser, 'deactive');
//                     }}
//                     className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-sm"
//                   >
//                     <UserX className="w-4 h-4 mr-2" />
//                     Deactivate Hospital
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => {
//                       setShowModal(false);
//                       handleStatusToggle(selectedUser, 'active');
//                     }}
//                     className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm"
//                   >
//                     <UserCheck className="w-4 h-4 mr-2" />
//                     Activate Hospital
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   // Edit Modal
//   const EditModal: React.FC = () => {
//     const [formData, setFormData] = useState<UpdateHospitalUser>({
//       hospital_id: editingUser?.hospital_id || 0,
//       hospital_email: editingUser?.hospital_email || '',
//       hospital_name: editingUser?.hospital_name || '',
//     });

//     const handleSubmit = (): void => {
//       if (!formData.hospital_email || !formData.hospital_name) {
//         console.error('Please fill in all required fields');
//         return;
//       }
//       handleEditUser(formData);
//     };

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
//       const { name, value } = e.target;
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     };

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-lg max-w-md w-full shadow-lg">
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-4 border-b pb-4">
//               <h3 className="text-xl font-semibold text-gray-900">Edit Hospital User</h3>
//               <button
//                 onClick={() => {
//                   setShowEditModal(false);
//                   setEditingUser(null);
//                 }}
//                 className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Hospital Email *
//                 </label>
//                 <input
//                   type="email"
//                   name="hospital_email"
//                   value={formData.hospital_email}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm"
//                   required
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Hospital Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="hospital_name"
//                   value={formData.hospital_name}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm"
//                   required
//                 />
//               </div>
              
//               <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowEditModal(false);
//                     setEditingUser(null);
//                   }}
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors shadow-sm"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   disabled={actionLoading}
//                   className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 shadow-sm"
//                 >
//                   {actionLoading ? (
//                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                   ) : 'Update'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-red-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-4 sm:p-6 lg:p-8 font-sans">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-8 flex items-center space-x-4">
//           <div className="p-2 sm:p-3 bg-red-100 rounded-full shadow-md">
//             <Hospital className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-1">Manage Hospital Users</h1>
//             <p className="text-gray-600">View and manage hospital user accounts</p>
//           </div>
//         </div>

//         {/* Filters Section */}
//         <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 border border-gray-200">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search by hospital name..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm transition-all duration-200 hover:border-gray-400"
//               />
//             </div>

//             {/* District Filter */}
//             <select
//               value={selectedDistrict}
//               onChange={(e) => setSelectedDistrict(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm transition-all duration-200 hover:border-gray-400 bg-white"
//             >
//               <option value="">All Districts</option>
//               {districts.map(district => (
//                 <option key={district.district_id} value={district.district_name}>
//                   {district.district_name}
//                 </option>
//               ))}
//             </select>

//             {/* Status Filter */}
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm transition-all duration-200 hover:border-gray-400 bg-white"
//             >
//               <option value="">All Status</option>
//               <option value="active">Active</option>
//               <option value="deactive">Inactive</option>
//             </select>
//           </div>
//         </div>

//         {/* Results Info */}
//         <div className="mb-4 text-sm text-gray-600 px-1">
//           Showing <span className="font-semibold">{indexOfFirstUser + 1}</span>-<span className="font-semibold">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of <span className="font-semibold">{filteredUsers.length}</span> hospital users
//         </div>

//         {/* Hospital Users List */}
//         <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
//           {currentUsers.length === 0 ? (
//             <div className="p-8 text-center bg-gray-50">
//               <Hospital className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500 text-lg">No hospital users found</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[700px] divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Hospital
//                     </th>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
//                       Email
//                     </th>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
//                       District
//                     </th>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {currentUsers.map((user, index) => (
//                     <tr key={user.hospital_id || index} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{user.hospital_name}</div>
//                           <div className="text-xs text-gray-500 sm:hidden">{user.hospital_email}</div>
//                         </div>
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
//                         {user.hospital_email}
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
//                         {user.district_name}
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
//                         <StatusBadge status={user.status} />
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => showUserDetails(user)}
//                             className="flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                             disabled={actionLoading}
//                             title="View Details"
//                           >
//                             <Eye className="w-4 h-4 mr-2" />
//                             View
//                           </button>
                          
//                           <button
//                             onClick={() => showEditForm(user)}
//                             className="flex items-center px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                             disabled={actionLoading}
//                             title="Edit User"
//                           >
//                             <Edit className="w-4 h-4 mr-2" />
//                             Edit
//                           </button>
                          
//                           {user.status === 'active' ? (
//                             <button
//                               onClick={() => handleStatusToggle(user, 'deactive')}
//                               className="flex items-center px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                               disabled={actionLoading}
//                               title="Deactivate User"
//                             >
//                               <UserX className="w-4 h-4 mr-2" />
//                               Deactivate
//                             </button>
//                           ) : (
//                             <button
//                               onClick={() => handleStatusToggle(user, 'active')}
//                               className="flex items-center px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                               disabled={actionLoading}
//                               title="Activate User"
//                             >
//                               <UserCheck className="w-4 h-4 mr-2" />
//                               Activate
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="bg-white rounded-lg shadow-md mt-6 p-4 border border-gray-200">
//             <div className="flex flex-col sm:flex-row items-center justify-between">
//               <div className="text-sm text-gray-700 mb-2 sm:mb-0">
//                 Showing <span className="font-semibold">{indexOfFirstUser + 1}</span>-<span className="font-semibold">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of <span className="font-semibold">{filteredUsers.length}</span> users
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => paginate(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
//                 >
//                   <ChevronLeft className="w-4 h-4 mr-1" />
//                   Previous
//                 </button>
                
//                 <div className="flex space-x-1">
//                   {[...Array(totalPages)].map((_, index) => {
//                     const pageNumber = index + 1;
//                     return (
//                       <button
//                         key={pageNumber}
//                         onClick={() => paginate(pageNumber)}
//                         className={`px-3 py-2 text-sm font-medium rounded-md shadow-sm ${
//                           currentPage === pageNumber
//                             ? 'bg-red-600 text-white hover:bg-red-700'
//                             : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
//                         } transition-colors`}
//                       >
//                         {pageNumber}
//                       </button>
//                     );
//                   })}
//                 </div>
                
//                 <button
//                   onClick={() => paginate(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
//                 >
//                   Next
//                   <ChevronRight className="w-4 h-4 ml-1" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Modals */}
//         {showModal && <ViewModal />}
//         {showEditModal && <EditModal />}
//       </div>
//     </div>
//   );
// };

// export default HospitalUserManagement;

// import React, { useState, useEffect } from 'react';
// import {
//   Hospital, Search, Eye, Edit, UserCheck, UserX, X
// } from 'lucide-react';
// import {
//   PageHeader, FilterBar, SearchInput, FilterSelect, StatusBadge,
//   EmptyState, ModalWrapper, ActionButton, Pagination, LoadingSpinner
// } from './components/index.'; 
// import { getAuthHeaders } from './components/utils';

// interface District {
//   district_id: number;
//   district_name: string;
// }

// interface HospitalUser {
//   hospital_email: string;
//   hospital_name: string;
//   hospital_type: string;
//   hospital_address: string;
//   contact_number: string;
//   status: string;
//   district_name: string;
//   hospital_id: number;
// }

// interface UpdateHospitalUser {
//   hospital_id: number;
//   hospital_email: string;
//   hospital_name: string;
// }

// const HospitalUserManagement: React.FC = () => {
//   const [hospitalUsers, setHospitalUsers] = useState<HospitalUser[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<HospitalUser[]>([]);
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [selectedDistrict, setSelectedDistrict] = useState<string>('');
//   const [statusFilter, setStatusFilter] = useState<string>('');
//   const [selectedUser, setSelectedUser] = useState<HospitalUser | null>(null);
//   const [showModal, setShowModal] = useState<boolean>(false);
//   const [showEditModal, setShowEditModal] = useState<boolean>(false);
//   const [editingUser, setEditingUser] = useState<HospitalUser | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [actionLoading, setActionLoading] = useState<boolean>(false);

//   const usersPerPage = 5;
//   const baseUrl = 'http://localhost:9092/dashboard/admin';
//   const STORAGE_KEY = 'hospitalUserStatuses';

//   // Fetch hospital users
//   const fetchHospitalUsers = async (): Promise<void> => {
//     try {
//       const response = await fetch(`${baseUrl}/hospitalUserData`, {
//         method: 'GET',
//         headers: getAuthHeaders(),
//         credentials: 'include',
//       });
//       if (response.ok) {
//         const users = await response.json();
//         const usersWithId = users.map((user: HospitalUser, index: number) => ({
//           ...user,
//           hospital_id: user.hospital_id || (index + 1),
//         }));

//         // Merge with localStorage statuses
//         const storedStatuses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
//         const updatedUsers = usersWithId.map((user: HospitalUser) => ({
//           ...user,
//           status: storedStatuses[user.hospital_id] || user.status,
//         }));

//         setHospitalUsers(updatedUsers);
//         setFilteredUsers(updatedUsers);
//       } else {
//         console.error('Failed to fetch hospital users');
//       }
//     } catch (error) {
//       console.error('Error fetching hospital users:', error);
//     }
//   };

//   // Fetch districts
//   const fetchDistricts = async (): Promise<void> => {
//     try {
//       const response = await fetch(`${baseUrl}/districts`, {
//         method: 'GET',
//         headers: getAuthHeaders(),
//         credentials: 'include',
//       });
//       if (response.ok) {
//         const districtsData = await response.json();
//         setDistricts(districtsData);
//       } else {
//         console.error('Failed to fetch districts');
//       }
//     } catch (error) {
//       console.error('Error fetching districts:', error);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       await Promise.all([fetchHospitalUsers(), fetchDistricts()]);
//       setLoading(false);
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     let filtered = hospitalUsers;
//     if (searchTerm) {
//       filtered = filtered.filter(user =>
//         user.hospital_name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
//     if (selectedDistrict) {
//       filtered = filtered.filter(user => user.district_name === selectedDistrict);
//     }
//     if (statusFilter) {
//       filtered = filtered.filter(user => user.status === statusFilter);
//     }
//     setFilteredUsers(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, selectedDistrict, statusFilter, hospitalUsers]);

//   // Handle status toggle
//   const handleStatusToggle = async (user: HospitalUser, newStatus: string): Promise<void> => {
//     const confirmation = window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} this hospital user?`);
//     if (!confirmation) return;

//     setActionLoading(true);
//     try {
//       let response;
//       if (newStatus === 'active') {
//         response = await fetch(`${baseUrl}/hospitalUser/activate/${user.hospital_id}`, {
//           method: 'PUT',
//           headers: getAuthHeaders(),
//           credentials: 'include',
//         });
//       } else {
//         response = await fetch(`${baseUrl}/hospitalUser/${user.hospital_id}`, {
//           method: 'DELETE',
//           headers: getAuthHeaders(),
//           credentials: 'include',
//         });
//       }

//       if (response.ok) {
//         const updatedUsers = hospitalUsers.map(u =>
//           u.hospital_id === user.hospital_id ? { ...u, status: newStatus } : u
//         );
//         setHospitalUsers(updatedUsers);
//         setFilteredUsers(updatedUsers.filter(u =>
//           (!searchTerm || u.hospital_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
//           (!selectedDistrict || u.district_name === selectedDistrict) &&
//           (!statusFilter || u.status === statusFilter)
//         ));

//         // Update localStorage
//         const storedStatuses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
//         storedStatuses[user.hospital_id] = newStatus;
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(storedStatuses));

//         console.log(`Hospital user ${newStatus}d successfully.`);
//       } else {
//         const errorResult = await response.json().catch(() => ({ message: 'Unknown error' }));
//         console.error(`Failed to update user status: ${errorResult.message}`);
//       }
//     } catch (error) {
//       console.error('Error updating user status:', error);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Handle edit user
//   const handleEditUser = async (updatedUser: UpdateHospitalUser): Promise<void> => {
//     setActionLoading(true);
//     try {
//       const response = await fetch(`${baseUrl}/hospitalUsers`, {
//         method: 'PUT',
//         headers: getAuthHeaders(),
//         body: JSON.stringify(updatedUser),
//         credentials: 'include',
//       });

//       if (response.ok) {
//         await fetchHospitalUsers();
//         setShowEditModal(false);
//         setEditingUser(null);
//         console.log('Hospital user updated successfully.');
//       } else {
//         const errorResult = await response.json().catch(() => ({ message: 'Unknown error' }));
//         console.error(errorResult.message || 'Failed to update hospital user');
//       }
//     } catch (error) {
//       console.error('Error updating hospital user:', error);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const showUserDetails = (user: HospitalUser): void => {
//     setSelectedUser(user);
//     setShowModal(true);
//   };

//   const showEditForm = (user: HospitalUser): void => {
//     setEditingUser(user);
//     setShowEditModal(true);
//   };

//   // Pagination logic
//   const indexOfLastUser = currentPage * usersPerPage;
//   const indexOfFirstUser = indexOfLastUser - usersPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
//   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

//   // View Details Modal
//   const ViewModal: React.FC = () => (
//     <ModalWrapper
//       isOpen={showModal}
//       onClose={() => setShowModal(false)}
//       title="Hospital Details"
//     >
//       {selectedUser && (
//         <div className="space-y-6">
//           <div className="flex items-center space-x-4">
//             <div className="p-3 bg-blue-100 rounded-full shadow-sm">
//               <Hospital className="w-8 h-8 text-blue-600" />
//             </div>
//             <div>
//               <h4 className="text-xl font-semibold text-gray-900">{selectedUser.hospital_name}</h4>
//               <p className="text-blue-600 font-medium">{selectedUser.hospital_type}</p>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
//             <div className="flex items-start space-x-3">
//               <Hospital className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
//               <div>
//                 <p className="font-medium text-gray-500">Hospital ID</p>
//                 <p className="text-gray-900">#{selectedUser.hospital_id}</p>
//               </div>
//             </div>
//             <div className="flex items-start space-x-3">
//               <img src="https://placehold.co/20x20/ef4444/ffffff?text=AD" alt="Address Icon" className="mt-1 flex-shrink-0 rounded" />
//               <div>
//                 <p className="font-medium text-gray-500">Address</p>
//                 <p className="text-gray-900">{selectedUser.hospital_address}</p>
//               </div>
//             </div>
//             <div className="flex items-start space-x-3">
//               <img src="https://placehold.co/20x20/8b5cf6/ffffff?text=HT" alt="Hospital Type Icon" className="mt-1 flex-shrink-0 rounded" />
//               <div>
//                 <p className="font-medium text-gray-500">Hospital Type</p>
//                 <p className="text-gray-900">{selectedUser.hospital_type}</p>
//               </div>
//             </div>
//             <div className="flex items-start space-x-3">
//               <img src="https://placehold.co/20x20/f59e0b/ffffff?text=CN" alt="Contact Icon" className="mt-1 flex-shrink-0 rounded" />
//               <div>
//                 <p className="font-medium text-gray-500">Contact Number</p>
//                 <p className="text-gray-900">{selectedUser.contact_number}</p>
//               </div>
//             </div>
//             <div className="flex items-start space-x-3">
//               <img src="https://placehold.co/20x20/10b981/ffffff?text=DI" alt="District Icon" className="mt-1 flex-shrink-0 rounded" />
//               <div>
//                 <p className="font-medium text-gray-500">District</p>
//                 <p className="text-gray-900">{selectedUser.district_name}</p>
//               </div>
//             </div>
//             <div className="flex items-start space-x-3">
//               <img src="https://placehold.co/20x20/6366f1/ffffff?text=ST" alt="Status Icon" className="mt-1 flex-shrink-0 rounded" />
//               <div>
//                 <p className="font-medium text-gray-500">Status</p>
//                 <StatusBadge status={selectedUser.status} />
//               </div>
//             </div>
//           </div>
//           <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
//             <ActionButton
//               onClick={() => setShowModal(false)}
//               icon={<X />}
//               label="Close"
//               variant="secondary"
//             />
//             <ActionButton
//               onClick={() => {
//                 setShowModal(false);
//                 showEditForm(selectedUser);
//               }}
//               icon={<Edit />}
//               label="Edit Hospital"
//               variant="primary"
//             />
//             {selectedUser.status === 'active' ? (
//               <ActionButton
//                 onClick={() => {
//                   setShowModal(false);
//                   handleStatusToggle(selectedUser, 'deactive');
//                 }}
//                 icon={<UserX />}
//                 label="Deactivate Hospital"
//                 variant="danger"
//                 disabled={actionLoading}
//               />
//             ) : (
//               <ActionButton
//                 onClick={() => {
//                   setShowModal(false);
//                   handleStatusToggle(selectedUser, 'active');
//                 }}
//                 icon={<UserCheck />}
//                 label="Activate Hospital"
//                 variant="success"
//                 disabled={actionLoading}
//               />
//             )}
//           </div>
//         </div>
//       )}
//     </ModalWrapper>
//   );

//   // Edit Modal
//   const EditModal: React.FC = () => {
//     const [formData, setFormData] = useState<UpdateHospitalUser>({
//       hospital_id: editingUser?.hospital_id || 0,
//       hospital_email: editingUser?.hospital_email || '',
//       hospital_name: editingUser?.hospital_name || '',
//     });

//     const handleSubmit = (): void => {
//       if (!formData.hospital_email || !formData.hospital_name) {
//         console.error('Please fill in all required fields');
//         return;
//       }
//       handleEditUser(formData);
//     };

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
//       const { name, value } = e.target;
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     };

//     return (
//       <ModalWrapper
//         isOpen={showEditModal}
//         onClose={() => {
//           setShowEditModal(false);
//           setEditingUser(null);
//         }}
//         title="Edit Hospital User"
//         maxWidth="max-w-md"
//       >
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Hospital Email *
//             </label>
//             <input
//               type="email"
//               name="hospital_email"
//               value={formData.hospital_email}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Hospital Name *
//             </label>
//             <input
//               type="text"
//               name="hospital_name"
//               value={formData.hospital_name}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm"
//               required
//             />
//           </div>
//           <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
//             <ActionButton
//               onClick={() => {
//                 setShowEditModal(false);
//                 setEditingUser(null);
//               }}
//               icon={<X />}
//               label="Cancel"
//               variant="secondary"
//             />
//             <ActionButton
//               onClick={handleSubmit}
//               icon={actionLoading ? (
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               ) : <Edit />}
//               label={actionLoading ? 'Updating...' : 'Update'}
//               variant="danger"
//               disabled={actionLoading}
//             />
//           </div>
//         </div>
//       </ModalWrapper>
//     );
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-4 sm:p-6 lg:p-8 font-sans">
//       <div className="max-w-7xl mx-auto">
//         <PageHeader
//           icon={<Hospital className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />}
//           title="Manage Hospital Users"
//           subtitle="View and manage hospital user accounts"
//         />
//         <FilterBar>
//           <SearchInput
//             value={searchTerm}
//             onChange={setSearchTerm}
//             placeholder="Search by hospital name..."
//           />
//           <FilterSelect
//             value={selectedDistrict}
//             onChange={setSelectedDistrict}
//             options={districts.map(district => ({
//               value: district.district_name,
//               label: district.district_name
//             }))}
//             placeholder="All Districts"
//           />
//           <FilterSelect
//             value={statusFilter}
//             onChange={setStatusFilter}
//             options={[
//               { value: 'active', label: 'Active' },
//               { value: 'deactive', label: 'Inactive' }
//             ]}
//             placeholder="All Status"
//           />
//         </FilterBar>
//         <div className="mb-4 text-sm text-gray-600 px-1">
//           Showing <span className="font-semibold">{indexOfFirstUser + 1}</span>-
//           <span className="font-semibold">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{' '}
//           <span className="font-semibold">{filteredUsers.length}</span> hospital users
//         </div>
//         <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
//           {currentUsers.length === 0 ? (
//             <EmptyState
//               icon={<Hospital className="w-12 h-12 text-gray-400" />}
//               title="No hospital users found"
//             />
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[700px] divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Hospital
//                     </th>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
//                       Email
//                     </th>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
//                       District
//                     </th>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {currentUsers.map((user, index) => (
//                     <tr key={user.hospital_id || index} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{user.hospital_name}</div>
//                           <div className="text-xs text-gray-500 sm:hidden">{user.hospital_email}</div>
//                         </div>
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
//                         {user.hospital_email}
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
//                         {user.district_name}
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
//                         <StatusBadge status={user.status} />
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
//                         <div className="flex space-x-2">
//                           <ActionButton
//                             onClick={() => showUserDetails(user)}
//                             icon={<Eye />}
//                             label="View"
//                             variant="secondary"
//                             size="sm"
//                             disabled={actionLoading}
//                             title="View Details"
//                           />
//                           <ActionButton
//                             onClick={() => showEditForm(user)}
//                             icon={<Edit />}
//                             label="Edit"
//                             variant="primary"
//                             size="sm"
//                             disabled={actionLoading}
//                             title="Edit User"
//                           />
//                           {user.status === 'active' ? (
//                             <ActionButton
//                               onClick={() => handleStatusToggle(user, 'deactive')}
//                               icon={<UserX />}
//                               label="Deactivate"
//                               variant="danger"
//                               size="sm"
//                               disabled={actionLoading}
//                               title="Deactivate User"
//                             />
//                           ) : (
//                             <ActionButton
//                               onClick={() => handleStatusToggle(user, 'active')}
//                               icon={<UserCheck />}
//                               label="Activate"
//                               variant="success"
//                               size="sm"
//                               disabled={actionLoading}
//                               title="Activate User"
//                             />
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//         {totalPages > 1 && (
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             totalItems={filteredUsers.length}
//             itemsPerPage={usersPerPage}
//             onPageChange={setCurrentPage}
//             itemName="hospital users"
//           />
//         )}
//         {showModal && <ViewModal />}
//         {showEditModal && <EditModal />}
//       </div>
//     </div>
//   );
// };

// export default HospitalUserManagement;


import React, { useState, useEffect } from 'react';
import {
  Hospital, Search, Eye, Edit, UserCheck, UserX, X
} from 'lucide-react';
import {
  PageHeader, FilterBar, SearchInput, FilterSelect, StatusBadge,
  EmptyState, ModalWrapper, ActionButton, Pagination, LoadingSpinner
} from './components/index.';
import { getAuthHeaders } from './components/utils';
import NotificationModals from './components/NotificationModals';

interface District {
  district_id: number;
  district_name: string;
}

interface HospitalUser {
  hospital_email: string;
  hospital_name: string;
  hospital_type: string;
  hospital_address: string;
  contact_number: string;
  status: string;
  district_name: string;
  hospital_id: number;
}

interface UpdateHospitalUser {
  hospital_id: number;
  hospital_email: string;
  hospital_name: string;
}

const HospitalUserManagement: React.FC = () => {
  const [hospitalUsers, setHospitalUsers] = useState<HospitalUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<HospitalUser[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<HospitalUser | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<HospitalUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'success' | 'warning' | 'error';
    title: string;
    message: string;
    user: HospitalUser;
    newStatus?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const usersPerPage = 5;
  const baseUrl = 'http://localhost:9092/dashboard/admin';
  const STORAGE_KEY = 'hospitalUserStatuses';

  // Fetch hospital users
  const fetchHospitalUsers = async (): Promise<void> => {
    try {
      const response = await fetch(`${baseUrl}/hospitalUserData`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (response.ok) {
        const users = await response.json();
        const usersWithId = users.map((user: HospitalUser, index: number) => ({
          ...user,
          hospital_id: user.hospital_id || (index + 1),
        }));

        // Merge with localStorage statuses
        const storedStatuses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const updatedUsers = usersWithId.map((user: HospitalUser) => ({
          ...user,
          status: storedStatuses[user.hospital_id] || user.status,
        }));

        setHospitalUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      } else {
        setError('Failed to fetch hospital users');
      }
    } catch (error) {
      setError('Error fetching hospital users');
    }
  };

  // Fetch districts
  const fetchDistricts = async (): Promise<void> => {
    try {
      const response = await fetch(`${baseUrl}/districts`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (response.ok) {
        const districtsData = await response.json();
        setDistricts(districtsData);
      } else {
        setError('Failed to fetch districts');
      }
    } catch (error) {
      setError('Error fetching districts');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchHospitalUsers(), fetchDistricts()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = hospitalUsers;
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.hospital_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedDistrict) {
      filtered = filtered.filter(user => user.district_name === selectedDistrict);
    }
    if (statusFilter) {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedDistrict, statusFilter, hospitalUsers]);

  // Handle status toggle
  const handleStatusToggle = async (): Promise<void> => {
    if (!confirmAction) return;
    
    const { user, newStatus } = confirmAction;
    if (!newStatus) return;

    setActionLoading(true);
    try {
      let response;
      if (newStatus === 'active') {
        response = await fetch(`${baseUrl}/hospitalUser/activate/${user.hospital_id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          credentials: 'include',
        });
      } else {
        response = await fetch(`${baseUrl}/hospitalUser/${user.hospital_id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
          credentials: 'include',
        });
      }

      if (response.ok) {
        const updatedUsers = hospitalUsers.map(u =>
          u.hospital_id === user.hospital_id ? { ...u, status: newStatus } : u
        );
        setHospitalUsers(updatedUsers);
        setFilteredUsers(updatedUsers.filter(u =>
          (!searchTerm || u.hospital_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (!selectedDistrict || u.district_name === selectedDistrict) &&
          (!statusFilter || u.status === statusFilter)
        ));

        // Update localStorage
        const storedStatuses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        storedStatuses[user.hospital_id] = newStatus;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storedStatuses));

        setSuccess(`Hospital user ${newStatus}d successfully`);
        setIsConfirmModalOpen(false);
        setConfirmAction(null);
      } else {
        const errorResult = await response.json().catch(() => ({ message: 'Unknown error' }));
        setError(`Failed to update user status: ${errorResult.message}`);
      }
    } catch (error) {
      setError('Error updating user status');
    } finally {
      setActionLoading(false);
    }
  };

  // Initiate status toggle with confirmation
  const initiateStatusToggle = (user: HospitalUser, newStatus: string): void => {
    setConfirmAction({
      type: newStatus === 'active' ? 'success' : 'warning',
      title: `Confirm ${newStatus === 'active' ? 'Activation' : 'Deactivation'}`,
      message: `Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} ${user.hospital_name}?`,
      user,
      newStatus
    });
    setIsConfirmModalOpen(true);
  };

  // Handle edit user
  const handleEditUser = async (updatedUser: UpdateHospitalUser): Promise<void> => {
    setActionLoading(true);
    try {
      const response = await fetch(`${baseUrl}/hospitalUsers`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedUser),
        credentials: 'include',
      });

      if (response.ok) {
        await fetchHospitalUsers();
        setShowEditModal(false);
        setEditingUser(null);
        setSuccess('Hospital user updated successfully');
      } else {
        const errorResult = await response.json().catch(() => ({ message: 'Unknown error' }));
        setError(errorResult.message || 'Failed to update hospital user');
      }
    } catch (error) {
      setError('Error updating hospital user');
    } finally {
      setActionLoading(false);
    }
  };

  const showUserDetails = (user: HospitalUser): void => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const showEditForm = (user: HospitalUser): void => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // View Details Modal
  const ViewModal: React.FC = () => (
    <ModalWrapper
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      title="Hospital Details"
    >
      {selectedUser && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full shadow-sm">
              <Hospital className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900">{selectedUser.hospital_name}</h4>
              <p className="text-blue-600 font-medium">{selectedUser.hospital_type}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div className="flex items-start space-x-3">
              <Hospital className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-500">Hospital ID</p>
                <p className="text-gray-900">#{selectedUser.hospital_id}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <img src="https://placehold.co/20x20/ef4444/ffffff?text=AD" alt="Address Icon" className="mt-1 flex-shrink-0 rounded" />
              <div>
                <p className="font-medium text-gray-500">Address</p>
                <p className="text-gray-900">{selectedUser.hospital_address}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <img src="https://placehold.co/20x20/8b5cf6/ffffff?text=HT" alt="Hospital Type Icon" className="mt-1 flex-shrink-0 rounded" />
              <div>
                <p className="font-medium text-gray-500">Hospital Type</p>
                <p className="text-gray-900">{selectedUser.hospital_type}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <img src="https://placehold.co/20x20/f59e0b/ffffff?text=CN" alt="Contact Icon" className="mt-1 flex-shrink-0 rounded" />
              <div>
                <p className="font-medium text-gray-500">Contact Number</p>
                <p className="text-gray-900">{selectedUser.contact_number}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <img src="https://placehold.co/20x20/10b981/ffffff?text=DI" alt="District Icon" className="mt-1 flex-shrink-0 rounded" />
              <div>
                <p className="font-medium text-gray-500">District</p>
                <p className="text-gray-900">{selectedUser.district_name}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <img src="https://placehold.co/20x20/6366f1/ffffff?text=ST" alt="Status Icon" className="mt-1 flex-shrink-0 rounded" />
              <div>
                <p className="font-medium text-gray-500">Status</p>
                <StatusBadge status={selectedUser.status} />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <ActionButton
              onClick={() => setShowModal(false)}
              icon={<X />}
              label="Close"
              variant="secondary"
            />
            <ActionButton
              onClick={() => {
                setShowModal(false);
                showEditForm(selectedUser);
              }}
              icon={<Edit />}
              label="Edit Hospital"
              variant="primary"
            />
            {selectedUser.status === 'active' ? (
              <ActionButton
                onClick={() => {
                  setShowModal(false);
                  initiateStatusToggle(selectedUser, 'deactive');
                }}
                icon={<UserX />}
                label="Deactivate Hospital"
                variant="danger"
                disabled={actionLoading}
              />
            ) : (
              <ActionButton
                onClick={() => {
                  setShowModal(false);
                  initiateStatusToggle(selectedUser, 'active');
                }}
                icon={<UserCheck />}
                label="Activate Hospital"
                variant="success"
                disabled={actionLoading}
              />
            )}
          </div>
        </div>
      )}
    </ModalWrapper>
  );

  // Edit Modal
  const EditModal: React.FC = () => {
    const [formData, setFormData] = useState<UpdateHospitalUser>({
      hospital_id: editingUser?.hospital_id || 0,
      hospital_email: editingUser?.hospital_email || '',
      hospital_name: editingUser?.hospital_name || '',
    });

    const handleSubmit = (): void => {
      if (!formData.hospital_email || !formData.hospital_name) {
        setError('Please fill in all required fields');
        return;
      }
      handleEditUser(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    return (
      <ModalWrapper
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        title="Edit Hospital User"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hospital Email *
            </label>
            <input
              type="email"
              name="hospital_email"
              value={formData.hospital_email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hospital Name *
            </label>
            <input
              type="text"
              name="hospital_name"
              value={formData.hospital_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <ActionButton
              onClick={() => {
                setShowEditModal(false);
                setEditingUser(null);
              }}
              icon={<X />}
              label="Cancel"
              variant="secondary"
            />
            <ActionButton
              onClick={handleSubmit}
              icon={actionLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : <Edit />}
              label={actionLoading ? 'Updating...' : 'Update'}
              variant="danger"
              disabled={actionLoading}
            />
          </div>
        </div>
      </ModalWrapper>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          icon={<Hospital className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />}
          title="Manage Hospital Users"
          subtitle="View and manage hospital user accounts"
        />
        <FilterBar>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by hospital name..."
          />
          <FilterSelect
            value={selectedDistrict}
            onChange={setSelectedDistrict}
            options={districts.map(district => ({
              value: district.district_name,
              label: district.district_name
            }))}
            placeholder="All Districts"
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'deactive', label: 'Inactive' }
            ]}
            placeholder="All Status"
          />
        </FilterBar>
        <div className="mb-4 text-sm text-gray-600 px-1">
          Showing <span className="font-semibold">{indexOfFirstUser + 1}</span>-
          <span className="font-semibold">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{' '}
          <span className="font-semibold">{filteredUsers.length}</span> hospital users
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          {currentUsers.length === 0 ? (
            <EmptyState
              icon={<Hospital CURSOR:HEREclassName="w-12 h-12 text-gray-400" />}
              title="No hospital users found"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hospital
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Email
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      District
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.map((user, index) => (
                    <tr key={user.hospital_id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.hospital_name}</div>
                          <div className="text-xs text-gray-500 sm:hidden">{user.hospital_email}</div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                        {user.hospital_email}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                        {user.district_name}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <ActionButton
                            onClick={() => showUserDetails(user)}
                            icon={<Eye />}
                            label="View"
                            variant="secondary"
                            size="sm"
                            disabled={actionLoading}
                            title="View Details"
                          />
                          <ActionButton
                            onClick={() => showEditForm(user)}
                            icon={<Edit />}
                            label="Edit"
                            variant="primary"
                            size="sm"
                            disabled={actionLoading}
                            title="Edit User"
                          />
                          {user.status === 'active' ? (
                            <ActionButton
                              onClick={() => initiateStatusToggle(user, 'deactive')}
                              icon={<UserX />}
                              label="Deactivate"
                              variant="danger"
                              size="sm"
                              disabled={actionLoading}
                              title="Deactivate User"
                            />
                          ) : (
                            <ActionButton
                              onClick={() => initiateStatusToggle(user, 'active')}
                              icon={<UserCheck />}
                              label="Activate"
                              variant="success"
                              size="sm"
                              disabled={actionLoading}
                              title="Activate User"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            itemsPerPage={usersPerPage}
            onPageChange={setCurrentPage}
            itemName="hospital users"
          />
        )}
        {showModal && <ViewModal />}
        {showEditModal && <EditModal />}
        <NotificationModals
          isConfirmModalOpen={isConfirmModalOpen}
          confirmAction={confirmAction}
          setIsConfirmModalOpen={setIsConfirmModalOpen}
          setConfirmAction={setConfirmAction}
          handleConfirm={handleStatusToggle}
          loading={actionLoading}
          error={error}
          setError={setError}
          success={success}
          setSuccess={setSuccess}
        />
      </div>
    </div>
  );
};

export default HospitalUserManagement;