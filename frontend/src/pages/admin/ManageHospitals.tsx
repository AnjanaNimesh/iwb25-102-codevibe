// // API Base URL
//   const API_BASE_URL = 'http://localhost:9092/dashboard/admin';

//   // Handle "More" button click - fetch detailed hospital info
//   const handleMoreClick = async (hospital: Hospital) => {
//     try {
//       // Since the hospitalData API already provides all the details we need,
//       // we can use the hospital object directly for the modal
//       setSelectedHospital(hospital);
//       setShowDetailsModal(true);
//     } catch (error) {
//       console.error('Error fetching hospital details:', error);
//       // Still show modal with available data
//       setSelectedHospital(hospital);
//       setShowDetailsModal(true);
//     }
//   };import React, { useState, useEffect } from 'react';
// import { Search, Building2, Users, UserX, Eye, UserCheck, UserMinus } from 'lucide-react';

// // Types based on your backend API
// interface Hospital {
//   hospital_id: number;
//   hospital_name: string;
//   hospital_type: string;
//   hospital_address: string;
//   contact_number: string;
//   district_name: string;
//   status?: 'active' | 'deactive';
// }

// interface District {
//   district_id: number;
//   district_name: string;
// }

// interface HospitalStats {
//   totalActiveHospitals: number;
//   totalDeactiveHospitals: number;
//   totalHospitals: number;
// }

// // Mock data for demonstration
// const mockHospitals: Hospital[] = [
//   {
//     hospital_id: 1,
//     hospital_name: "National Hospital Colombo",
//     hospital_type: "Teaching",
//     hospital_address: "Regent Street, Colombo 07",
//     contact_number: "+94112691111",
//     district_name: "Colombo",
//     status: "active"
//   },
//   {
//     hospital_id: 2,
//     hospital_name: "Colombo General Hospital",
//     hospital_type: "General",
//     hospital_address: "Colombo 10",
//     contact_number: "+94112693711",
//     district_name: "Colombo",
//     status: "active"
//   },
//   {
//     hospital_id: 3,
//     hospital_name: "Base Hospital Negombo",
//     hospital_type: "Base",
//     hospital_address: "Negombo Road",
//     contact_number: "+94312222261",
//     district_name: "Gampaha",
//     status: "deactive"
//   },
//   {
//     hospital_id: 4,
//     hospital_name: "Teaching Hospital Kandy",
//     hospital_type: "Teaching",
//     hospital_address: "William Gopallawa Mawatha, Kandy",
//     contact_number: "+94812232337",
//     district_name: "Kandy",
//     status: "active"
//   },
//   {
//     hospital_id: 5,
//     hospital_name: "District General Hospital Kalutara",
//     hospital_type: "General",
//     hospital_address: "Kalutara South",
//     contact_number: "+94342222261",
//     district_name: "Kalutara",
//     status: "deactive"
//   },
//   {
//     hospital_id: 6,
//     hospital_name: "Base Hospital Matale",
//     hospital_type: "Base", 
//     hospital_address: "Matale Road",
//     contact_number: "+94662234567",
//     district_name: "Matale",
//     status: "active"
//   }
// ];

// const ManageHospitals: React.FC = () => {
//   const [hospitals, setHospitals] = useState<Hospital[]>([]);
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
//   const [stats, setStats] = useState<HospitalStats>({
//     totalActiveHospitals: 0,
//     totalDeactiveHospitals: 0,
//     totalHospitals: 0
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All Status');
//   const [typeFilter, setTypeFilter] = useState('All Types');
//   const [districtFilter, setDistrictFilter] = useState('All Districts');
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);

//   // Fetch districts data
//   const fetchDistricts = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/districts`);
//       if (response.ok) {
//         const data = await response.json();
//         setDistricts(data);
//       } else {
//         // Fallback districts
//         setDistricts([
//           { district_id: 1, district_name: 'Colombo' },
//           { district_id: 2, district_name: 'Gampaha' },
//           { district_id: 3, district_name: 'Kalutara' },
//           { district_id: 4, district_name: 'Kandy' },
//           { district_id: 5, district_name: 'Matale' }
//         ]);
//       }
//     } catch (error) {
//       console.error('Error fetching districts:', error);
//       // Fallback districts
//       setDistricts([
//         { district_id: 1, district_name: 'Colombo' },
//         { district_id: 2, district_name: 'Gampaha' },
//         { district_id: 3, district_name: 'Kalutara' },
//         { district_id: 4, district_name: 'Kandy' },
//         { district_id: 5, district_name: 'Matale' }
//       ]);
//     }
//   };

//   // Get hospital type colors
//   const getHospitalTypeColor = (type: string) => {
//     switch (type.toLowerCase()) {
//       case 'teaching':
//         return 'bg-purple-100 text-purple-800';
//       case 'general':
//         return 'bg-blue-100 text-blue-800';
//       case 'base':
//         return 'bg-green-100 text-green-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // Get status colors
//   const getStatusColor = (status: string) => {
//     return status === 'active' 
//       ? 'bg-green-100 text-green-800' 
//       : 'bg-red-100 text-red-800';
//   };

//   // Fetch hospital statistics
//   const fetchStats = async () => {
//     try {
//       const [activeResponse, deactiveResponse] = await Promise.all([
//         fetch(`${API_BASE_URL}/activehospitalCount`),
//         fetch(`${API_BASE_URL}/deactivehospitalCount`)
//       ]);

//       let activeCount = 0;
//       let deactiveCount = 0;

//       if (activeResponse.ok) {
//         const activeData = await activeResponse.json();
//         activeCount = activeData.totalActiveHospitals || 0;
//       }

//       if (deactiveResponse.ok) {
//         const deactiveData = await deactiveResponse.json();
//         deactiveCount = deactiveData.totalActiveHospitals || 0; // Note: API returns same field name
//       }

//       // Fallback to mock data calculation
//       if (activeCount === 0 && deactiveCount === 0) {
//         activeCount = mockHospitals.filter(h => h.status === 'active').length;
//         deactiveCount = mockHospitals.filter(h => h.status === 'deactive').length;
//       }

//       setStats({
//         totalActiveHospitals: activeCount,
//         totalDeactiveHospitals: deactiveCount,
//         totalHospitals: activeCount + deactiveCount
//       });
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//       // Use mock data for stats
//       const activeCount = mockHospitals.filter(h => h.status === 'active').length;
//       const deactiveCount = mockHospitals.filter(h => h.status === 'deactive').length;
//       setStats({
//         totalActiveHospitals: activeCount,
//         totalDeactiveHospitals: deactiveCount,
//         totalHospitals: activeCount + deactiveCount
//       });
//     }
//   };

//   // Fetch hospitals data
//   const fetchHospitals = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/hospitalData`);
//       if (response.ok) {
//         const data = await response.json();
//         // Add status field (assuming active by default since API doesn't return status)
//         const hospitalsWithStatus = data.map((hospital: Hospital) => ({
//           ...hospital,
//           status: hospital.status || 'active'
//         }));
//         setHospitals(hospitalsWithStatus);
//         setFilteredHospitals(hospitalsWithStatus);
//       } else {
//         setHospitals(mockHospitals);
//         setFilteredHospitals(mockHospitals);
//       }
//     } catch (error) {
//       console.error('Error fetching hospitals:', error);
//       setHospitals(mockHospitals);
//       setFilteredHospitals(mockHospitals);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Deactivate hospital
//   const deactivateHospital = async (hospitalId: number) => {
//     if (window.confirm('Are you sure you want to deactivate this hospital?')) {
//       try {
//         const response = await fetch(`${API_BASE_URL}/hospitals/${hospitalId}`, {
//           method: 'DELETE',
//         });

//         if (response.ok) {
//           // Update local state
//           setHospitals(prev => 
//             prev.map(hospital => 
//               hospital.hospital_id === hospitalId 
//                 ? { ...hospital, status: 'deactive' as const }
//                 : hospital
//             )
//           );
//           fetchStats(); // Refresh stats
//         } else {
//           console.error('Failed to deactivate hospital');
//         }
//       } catch (error) {
//         console.error('Error deactivating hospital:', error);
//       }
//     }
//   };

//   // Activate hospital
//   const activateHospital = async (hospitalId: number) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/hospitals/activate/${hospitalId}`, {
//         method: 'PUT',
//       });

//       if (response.ok) {
//         // Update local state
//         setHospitals(prev => 
//           prev.map(hospital => 
//             hospital.hospital_id === hospitalId 
//               ? { ...hospital, status: 'active' as const }
//               : hospital
//           )
//         );
//         fetchStats(); // Refresh stats
//       } else {
//         console.error('Failed to activate hospital');
//       }
//     } catch (error) {
//       console.error('Error activating hospital:', error);
//     }
//   };

//   // Filter and sort hospitals
//   useEffect(() => {
//     let filtered = hospitals.filter(hospital => {
//       const matchesSearch = hospital.hospital_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           hospital.district_name.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesStatus = statusFilter === 'All Status' || hospital.status === statusFilter.toLowerCase();
//       const matchesType = typeFilter === 'All Types' || hospital.hospital_type === typeFilter;
//       const matchesDistrict = districtFilter === 'All Districts' || hospital.district_name === districtFilter;
      
//       return matchesSearch && matchesStatus && matchesType && matchesDistrict;
//     });

//     // Sort by hospital type, then district name, then status
//     filtered.sort((a, b) => {
//       // First sort by type (Teaching -> General -> Base)
//       const typeOrder = { 'Teaching': 1, 'General': 2, 'Base': 3 };
//       const typeComparison = (typeOrder[a.hospital_type as keyof typeof typeOrder] || 4) - 
//                             (typeOrder[b.hospital_type as keyof typeof typeOrder] || 4);
//       if (typeComparison !== 0) return typeComparison;

//       // Then sort by district name
//       const districtComparison = a.district_name.localeCompare(b.district_name);
//       if (districtComparison !== 0) return districtComparison;

//       // Finally sort by status (active first)
//       return a.status === 'active' ? -1 : 1;
//     });

//     setFilteredHospitals(filtered);
//   }, [hospitals, searchTerm, statusFilter, typeFilter, districtFilter]);

//   // Get unique values for filters - use districts from API
//   const uniqueTypes = Array.from(new Set(hospitals.map(h => h.hospital_type))).sort();
//   const uniqueDistricts = districts.map(d => d.district_name).sort();

//   useEffect(() => {
//     const initializeData = async () => {
//       await Promise.all([fetchHospitals(), fetchStats(), fetchDistricts()]);
//     };
//     initializeData();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-2xl font-semibold text-gray-900 mb-2">Hospital Management</h1>
//           <p className="text-gray-600">Manage hospitals and their status</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           {/* Total Hospitals */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <Building2 className="h-6 w-6 text-blue-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Hospitals</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.totalHospitals}</p>
//               </div>
//             </div>
//           </div>

//           {/* Active Hospitals */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <UserCheck className="h-6 w-6 text-green-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Active Hospitals</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.totalActiveHospitals}</p>
//               </div>
//             </div>
//           </div>

//           {/* Inactive Hospitals */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="p-2 bg-red-100 rounded-lg">
//                 <UserX className="h-6 w-6 text-red-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Inactive Hospitals</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.totalDeactiveHospitals}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <input
//                 type="text"
//                 placeholder="Search hospitals..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             {/* Status Filter */}
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="All Status">All Status</option>
//               <option value="Active">Active</option>
//               <option value="Deactive">Inactive</option>
//             </select>

//             {/* Type Filter */}
//             <select
//               value={typeFilter}
//               onChange={(e) => setTypeFilter(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="All Types">All Types</option>
//               {uniqueTypes.map(type => (
//                 <option key={type} value={type}>{type}</option>
//               ))}
//             </select>

//             {/* District Filter */}
//             <select
//               value={districtFilter}
//               onChange={(e) => setDistrictFilter(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="All Districts">All Districts</option>
//               {uniqueDistricts.map(district => (
//                 <option key={district} value={district}>{district}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Hospitals Table */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Hospital ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Hospital Type
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     District
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredHospitals.map((hospital) => (
//                   <tr key={hospital.hospital_id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                       #{hospital.hospital_id}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
//                           <Building2 className="h-4 w-4 text-blue-600" />
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             {hospital.hospital_name}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {hospital.contact_number}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHospitalTypeColor(hospital.hospital_type)}`}>
//                         {hospital.hospital_type}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {hospital.district_name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(hospital.status || 'active')}`}>
//                         {hospital.status === 'active' ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <div className="flex items-center justify-end space-x-2">
//                         <button 
//                           onClick={() => handleMoreClick(hospital)}
//                           className="flex items-center px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
//                         >
//                           <Eye className="h-3 w-3 mr-1" />
//                           More
//                         </button>
//                         {hospital.status === 'active' ? (
//                           <button
//                             onClick={() => deactivateHospital(hospital.hospital_id)}
//                             className="flex items-center px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
//                           >
//                             <UserMinus className="h-3 w-3 mr-1" />
//                             Deactivate
//                           </button>
//                         ) : (
//                           <button
//                             onClick={() => activateHospital(hospital.hospital_id)}
//                             className="flex items-center px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
//                           >
//                             <UserCheck className="h-3 w-3 mr-1" />
//                             Activate
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
            
//             {filteredHospitals.length === 0 && (
//               <div className="text-center py-12">
//                 <Building2 className="mx-auto h-12 w-12 text-gray-400" />
//                 <h3 className="mt-2 text-sm font-medium text-gray-900">No hospitals found</h3>
//                 <p className="mt-1 text-sm text-gray-500">
//                   Try adjusting your search or filter criteria.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Hospital Details Modal */}
//         {showDetailsModal && selectedHospital && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//               <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900">Hospital Details</h2>
//                 <button
//                   onClick={() => setShowDetailsModal(false)}
//                   className="text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <Eye className="h-6 w-6" />
//                 </button>
//               </div>
              
//               <div className="p-6">
//                 {/* Hospital Header */}
//                 <div className="flex items-center mb-6">
//                   <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
//                     <Building2 className="h-8 w-8 text-blue-600" />
//                   </div>
//                   <div>
//                     <h3 className="text-2xl font-semibold text-gray-900 mb-1">
//                       {selectedHospital.hospital_name}
//                     </h3>
//                     <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getHospitalTypeColor(selectedHospital.hospital_type)}`}>
//                       {selectedHospital.hospital_type} Hospital
//                     </span>
//                   </div>
//                 </div>

//                 {/* Hospital Information Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                   <div className="space-y-4">
//                     <div className="flex items-start space-x-3">
//                       <Building2 className="w-5 h-5 text-blue-500 mt-0.5" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Hospital ID</p>
//                         <p className="text-gray-900">#{selectedHospital.hospital_id}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start space-x-3">
//                       <Users className="w-5 h-5 text-purple-500 mt-0.5" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Hospital Type</p>
//                         <p className="text-gray-900">{selectedHospital.hospital_type}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start space-x-3">
//                       <Building2 className="w-5 h-5 text-green-500 mt-0.5" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">District</p>
//                         <p className="text-gray-900">{selectedHospital.district_name}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <div className="flex items-start space-x-3">
//                       <Building2 className="w-5 h-5 text-red-500 mt-0.5" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Address</p>
//                         <p className="text-gray-900">{selectedHospital.hospital_address}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <Users className="w-5 h-5 text-yellow-500" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Contact Number</p>
//                         <p className="text-gray-900">{selectedHospital.contact_number}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <UserCheck className="w-5 h-5 text-indigo-500" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Status</p>
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedHospital.status || 'active')}`}>
//                           {selectedHospital.status === 'active' ? 'Active' : 'Inactive'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//                   <button
//                     onClick={() => setShowDetailsModal(false)}
//                     className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     Close
//                   </button>
//                   {selectedHospital.status === 'active' ? (
//                     <button
//                       onClick={() => {
//                         deactivateHospital(selectedHospital.hospital_id);
//                         setShowDetailsModal(false);
//                       }}
//                       className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                     >
//                       <UserMinus className="h-4 w-4 mr-2" />
//                       Deactivate Hospital
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => {
//                         activateHospital(selectedHospital.hospital_id);
//                         setShowDetailsModal(false);
//                       }}
//                       className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                     >
//                       <UserCheck className="h-4 w-4 mr-2" />
//                       Activate Hospital
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

// export default ManageHospitals;

// import React, { useEffect, useState } from "react";
// import {
//   Search,
//   Building2,
//   Users,
//   UserX,
//   Eye,
//   UserCheck,
//   UserMinus,
//   X,
//   Hospital
// } from "lucide-react";

// // API Base URL
// const API_BASE_URL = "http://localhost:9092/dashboard/admin";

// // Types based on your backend API
// interface Hospital {
//   hospital_id: number;
//   hospital_name: string;
//   hospital_type: string;
//   hospital_address: string;
//   contact_number: string;
//   district_name: string;
//   status?: "active" | "deactive";
// }

// interface District {
//   district_id: number;
//   district_name: string;
// }

// interface HospitalStats {
//   totalActiveHospitals: number;
//   totalDeactiveHospitals: number;
//   totalHospitals: number;
// }

// // Mock data fallback
// const mockHospitals: Hospital[] = [
//   {
//     hospital_id: 1,
//     hospital_name: "National Hospital Colombo",
//     hospital_type: "Teaching",
//     hospital_address: "Regent Street, Colombo 07",
//     contact_number: "+94112691111",
//     district_name: "Colombo",
//     status: "active",
//   },
//   {
//     hospital_id: 2,
//     hospital_name: "Colombo General Hospital",
//     hospital_type: "General",
//     hospital_address: "Colombo 10",
//     contact_number: "+94112693711",
//     district_name: "Colombo",
//     status: "active",
//   },
//   {
//     hospital_id: 3,
//     hospital_name: "Base Hospital Negombo",
//     hospital_type: "Base",
//     hospital_address: "Negombo Road",
//     contact_number: "+94312222261",
//     district_name: "Gampaha",
//     status: "deactive",
//   },
//   {
//     hospital_id: 4,
//     hospital_name: "Teaching Hospital Kandy",
//     hospital_type: "Teaching",
//     hospital_address: "William Gopallawa Mawatha, Kandy",
//     contact_number: "+94812232337",
//     district_name: "Kandy",
//     status: "active",
//   },
//   {
//     hospital_id: 5,
//     hospital_name: "District General Hospital Kalutara",
//     hospital_type: "General",
//     hospital_address: "Kalutara South",
//     contact_number: "+94342222261",
//     district_name: "Kalutara",
//     status: "deactive",
//   },
//   {
//     hospital_id: 6,
//     hospital_name: "Base Hospital Matale",
//     hospital_type: "Base",
//     hospital_address: "Matale Road",
//     contact_number: "+94662234567",
//     district_name: "Matale",
//     status: "active",
//   },
// ];

// const ManageHospitals: React.FC = () => {
//   const [hospitals, setHospitals] = useState<Hospital[]>([]);
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
//   const [stats, setStats] = useState<HospitalStats>({
//     totalActiveHospitals: 0,
//     totalDeactiveHospitals: 0,
//     totalHospitals: 0,
//   });

//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All Status");
//   const [typeFilter, setTypeFilter] = useState("All Types");
//   const [districtFilter, setDistrictFilter] = useState("All Districts");

//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
//     null
//   );
//   const [showDetailsModal, setShowDetailsModal] = useState(false);

//   // Helper: color classes for hospital type
//   const getHospitalTypeColor = (type?: string) => {
//     if (!type) return "bg-gray-100 text-gray-800";
//     switch (type.toLowerCase()) {
//       case "teaching":
//         return "bg-purple-100 text-purple-800";
//       case "general":
//         return "bg-blue-100 text-blue-800";
//       case "base":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getStatusColor = (status: string) =>
//     status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

//   // Fetch districts
//   const fetchDistricts = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/districts`);
//       if (res.ok) {
//         const data = await res.json();
//         // Expecting an array of { district_id, district_name }
//         setDistricts(data);
//       } else {
//         setDistricts([
//           { district_id: 1, district_name: "Colombo" },
//           { district_id: 2, district_name: "Gampaha" },
//           { district_id: 3, district_name: "Kalutara" },
//           { district_id: 4, district_name: "Kandy" },
//           { district_id: 5, district_name: "Matale" },
//         ]);
//       }
//     } catch (err) {
//       console.error("Error fetching districts:", err);
//       setDistricts([
//         { district_id: 1, district_name: "Colombo" },
//         { district_id: 2, district_name: "Gampaha" },
//         { district_id: 3, district_name: "Kalutara" },
//         { district_id: 4, district_name: "Kandy" },
//         { district_id: 5, district_name: "Matale" },
//       ]);
//     }
//   };

//   // Fetch stats (active/deactive counts)
//   const fetchStats = async () => {
//     try {
//       const [activeRes, deactiveRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/activehospitalCount`),
//         fetch(`${API_BASE_URL}/deactivehospitalCount`),
//       ]);

//       let activeCount = 0;
//       let deactiveCount = 0;

//       if (activeRes.ok) {
//         const d = await activeRes.json();
//         // API might return different field names; try common ones
//         activeCount =
//           d.totalActiveHospitals ?? d.total ?? d.count ?? 0;
//       }

//       if (deactiveRes.ok) {
//         const d = await deactiveRes.json();
//         deactiveCount =
//           d.totalDeactiveHospitals ??
//           d.totalActiveHospitals ?? // some APIs reuse same field name
//           d.total ??
//           d.count ??
//           0;
//       }

//       if (activeCount === 0 && deactiveCount === 0) {
//         // fallback to mock
//         activeCount = mockHospitals.filter((h) => h.status === "active").length;
//         deactiveCount = mockHospitals.filter((h) => h.status === "deactive").length;
//       }

//       setStats({
//         totalActiveHospitals: activeCount,
//         totalDeactiveHospitals: deactiveCount,
//         totalHospitals: activeCount + deactiveCount,
//       });
//     } catch (err) {
//       console.error("Error fetching stats:", err);
//       const activeCount = mockHospitals.filter((h) => h.status === "active").length;
//       const deactiveCount = mockHospitals.filter((h) => h.status === "deactive").length;
//       setStats({
//         totalActiveHospitals: activeCount,
//         totalDeactiveHospitals: deactiveCount,
//         totalHospitals: activeCount + deactiveCount,
//       });
//     }
//   };

//   // Fetch hospitals (list)
//   const fetchHospitals = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/hospitalData`);
//       if (res.ok) {
//         const data: any[] = await res.json();
//         const normalized: Hospital[] = data.map((h: any) => ({
//           hospital_id: Number(h.hospital_id),
//           hospital_name: h.hospital_name,
//           hospital_type: h.hospital_type,
//           hospital_address: h.hospital_address,
//           contact_number: h.contact_number,
//           district_name: h.district_name,
//           status: (h.status as "active" | "deactive") ?? "active",
//         }));
//         setHospitals(normalized);
//         setFilteredHospitals(normalized);
//       } else {
//         setHospitals(mockHospitals);
//         setFilteredHospitals(mockHospitals);
//       }
//     } catch (err) {
//       console.error("Error fetching hospitals:", err);
//       setHospitals(mockHospitals);
//       setFilteredHospitals(mockHospitals);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Deactivate hospital (calls DELETE on /hospitals/{id})
//   const deactivateHospital = async (hospitalId: number) => {
//     const confirmed = window.confirm("Are you sure you want to deactivate this hospital?");
//     if (!confirmed) return;

//     try {
//       const res = await fetch(`${API_BASE_URL}/hospitals/${hospitalId}`, {
//         method: "DELETE",
//       });
//       if (res.ok) {
//         setHospitals((prev) =>
//           prev.map((h) => (h.hospital_id === hospitalId ? { ...h, status: "deactive" } : h))
//         );
//         setFilteredHospitals((prev) =>
//           prev.map((h) => (h.hospital_id === hospitalId ? { ...h, status: "deactive" } : h))
//         );
//         fetchStats();
//       } else {
//         console.error("Failed to deactivate hospital", await res.text());
//       }
//     } catch (err) {
//       console.error("Error deactivating hospital:", err);
//     }
//   };

//   // Activate hospital (calls PUT on /hospitals/activate/{id})
//   const activateHospital = async (hospitalId: number) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/hospitals/activate/${hospitalId}`, {
//         method: "PUT",
//       });
//       if (res.ok) {
//         setHospitals((prev) =>
//           prev.map((h) => (h.hospital_id === hospitalId ? { ...h, status: "active" } : h))
//         );
//         setFilteredHospitals((prev) =>
//           prev.map((h) => (h.hospital_id === hospitalId ? { ...h, status: "active" } : h))
//         );
//         fetchStats();
//       } else {
//         console.error("Failed to activate hospital", await res.text());
//       }
//     } catch (err) {
//       console.error("Error activating hospital:", err);
//     }
//   };

//   // Updated "More" handler: fetch fresh hospital details via /hospitalData/:id
//   const handleMoreClick = async (hospitalId: number) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/hospitalData/${hospitalId}`);
//       if (!res.ok) throw new Error(`Failed to fetch details for ID ${hospitalId}`);
//       const data: any[] = await res.json();
//       if (Array.isArray(data) && data.length > 0) {
//         const h = data[0];
//         const merged: Hospital = {
//           hospital_id: Number(h.hospital_id),
//           hospital_name: h.hospital_name,
//           hospital_type: h.hospital_type,
//           hospital_address: h.hospital_address,
//           contact_number: h.contact_number,
//           district_name: h.district_name,
//           // preserve the local status if present in the list; otherwise assume active
//           status: hospitals.find((x) => x.hospital_id === hospitalId)?.status ?? "active",
//         };
//         setSelectedHospital(merged);
//       } else {
//         // fallback to local list
//         const fallback = hospitals.find((x) => x.hospital_id === hospitalId) ?? null;
//         setSelectedHospital(fallback);
//       }
//       setShowDetailsModal(true);
//     } catch (err) {
//       console.error("Error fetching hospital details:", err);
//       const fallback = hospitals.find((x) => x.hospital_id === hospitalId) ?? null;
//       setSelectedHospital(fallback);
//       setShowDetailsModal(true);
//     }
//   };

//   // Filtering & sorting effect
//   useEffect(() => {
//     let filtered = hospitals.filter((hospital) => {
//       const matchesSearch =
//         hospital.hospital_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         hospital.district_name.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesStatus =
//         statusFilter === "All Status" ||
//         hospital.status === statusFilter.toLowerCase();

//       const matchesType = typeFilter === "All Types" || hospital.hospital_type === typeFilter;
//       const matchesDistrict =
//         districtFilter === "All Districts" || hospital.district_name === districtFilter;

//       return matchesSearch && matchesStatus && matchesType && matchesDistrict;
//     });

//     filtered.sort((a, b) => {
//       const typeOrder: Record<string, number> = { Teaching: 1, General: 2, Base: 3 };
//       const aTypeRank = typeOrder[a.hospital_type] ?? 4;
//       const bTypeRank = typeOrder[b.hospital_type] ?? 4;
//       if (aTypeRank !== bTypeRank) return aTypeRank - bTypeRank;

//       const districtComparison = a.district_name.localeCompare(b.district_name);
//       if (districtComparison !== 0) return districtComparison;

//       // Active first
//       if (a.status === b.status) return 0;
//       if (a.status === "active") return -1;
//       return 1;
//     });

//     setFilteredHospitals(filtered);
//   }, [hospitals, searchTerm, statusFilter, typeFilter, districtFilter]);

//   // Unique types and districts for filter dropdowns
//   const uniqueTypes = Array.from(new Set(hospitals.map((h) => h.hospital_type))).filter(Boolean).sort();
//   const uniqueDistricts = districts.map((d) => d.district_name).filter(Boolean).sort();

//   // initialize data
//   useEffect(() => {
//     const init = async () => {
//       await Promise.all([fetchHospitals(), fetchStats(), fetchDistricts()]);
//     };
//     init();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 flex items-center space-x-4">
//           <div className="p-2 sm:p-3 bg-red-100 rounded-full">
//             <Hospital className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-1">Hospital Management</h1>
//             <p className="text-gray-600">Manage hospitals and their status</p>
//           </div>
//         </div>


//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <Building2 className="h-6 w-6 text-blue-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Hospitals</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.totalHospitals}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <UserCheck className="h-6 w-6 text-green-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Active Hospitals</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.totalActiveHospitals}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="p-2 bg-red-100 rounded-lg">
//                 <UserX className="h-6 w-6 text-red-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Inactive Hospitals</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.totalDeactiveHospitals}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <input
//                 type="text"
//                 placeholder="Search hospitals..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             {/* Status */}
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="All Status">All Status</option>
//               <option value="Active">Active</option>
//               <option value="Deactive">Inactive</option>
//             </select>

//             {/* Type */}
//             <select
//               value={typeFilter}
//               onChange={(e) => setTypeFilter(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="All Types">All Types</option>
//               {uniqueTypes.map((t) => (
//                 <option key={t} value={t}>
//                   {t}
//                 </option>
//               ))}
//             </select>

//             {/* District */}
//             <select
//               value={districtFilter}
//               onChange={(e) => setDistrictFilter(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="All Districts">All Districts</option>
//               {uniqueDistricts.map((d) => (
//                 <option key={d} value={d}>
//                   {d}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital ID</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital Type</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredHospitals.map((hospital) => (
//                   <tr key={hospital.hospital_id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">#{hospital.hospital_id}</td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
//                           <Building2 className="h-4 w-4 text-blue-600" />
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{hospital.hospital_name}</div>
//                           <div className="text-sm text-gray-500">{hospital.contact_number}</div>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHospitalTypeColor(hospital.hospital_type)}`}>
//                         {hospital.hospital_type}
//                       </span>
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hospital.district_name}</td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(hospital.status ?? "active")}`}>
//                         {hospital.status === "active" ? "Active" : "Inactive"}
//                       </span>
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <div className="flex items-center justify-end space-x-2">
//                         <button
//                           onClick={() => handleMoreClick(hospital.hospital_id)}
//                           className="flex items-center px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
//                         >
//                           <Eye className="h-3 w-3 mr-1" />
//                           More
//                         </button>

//                         {hospital.status === "active" ? (
//                           <button
//                             onClick={() => deactivateHospital(hospital.hospital_id)}
//                             className="flex items-center px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
//                           >
//                             <UserMinus className="h-3 w-3 mr-1" />
//                             Deactivate
//                           </button>
//                         ) : (
//                           <button
//                             onClick={() => activateHospital(hospital.hospital_id)}
//                             className="flex items-center px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
//                           >
//                             <UserCheck className="h-3 w-3 mr-1" />
//                             Activate
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {filteredHospitals.length === 0 && (
//               <div className="text-center py-12">
//                 <Building2 className="mx-auto h-12 w-12 text-gray-400" />
//                 <h3 className="mt-2 text-sm font-medium text-gray-900">No hospitals found</h3>
//                 <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Modal */}
//         {showDetailsModal && selectedHospital && (
//           <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-20 px-4">
//             <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-black">
//               <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900">Hospital Details</h2>
//                 <button
//                   onClick={() => setShowDetailsModal(false)}
//                   className="text-gray-400 hover:text-gray-600 transition-colors"
//                   aria-label="Close details"
//                 >
//                   <X className="h-6 w-6" />
//                 </button>
//               </div>

//               <div className="p-6">
//                 <div className="flex items-center mb-6">
//                   <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
//                     <Building2 className="h-8 w-8 text-blue-600" />
//                   </div>
//                   <div>
//                     <h3 className="text-2xl font-semibold text-gray-900 mb-1">
//                       {selectedHospital.hospital_name}
//                     </h3>
//                     <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getHospitalTypeColor(selectedHospital.hospital_type)}`}>
//                       {selectedHospital.hospital_type} Hospital
//                     </span>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                   <div className="space-y-4">
//                     <div className="flex items-start space-x-3">
//                       <Building2 className="w-5 h-5 text-blue-500 mt-0.5" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Hospital ID</p>
//                         <p className="text-gray-900">#{selectedHospital.hospital_id}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-start space-x-3">
//                       <Users className="w-5 h-5 text-purple-500 mt-0.5" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Hospital Type</p>
//                         <p className="text-gray-900">{selectedHospital.hospital_type}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-start space-x-3">
//                       <Building2 className="w-5 h-5 text-green-500 mt-0.5" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">District</p>
//                         <p className="text-gray-900">{selectedHospital.district_name}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <div className="flex items-start space-x-3">
//                       <Building2 className="w-5 h-5 text-red-500 mt-0.5" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Address</p>
//                         <p className="text-gray-900">{selectedHospital.hospital_address}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-center space-x-3">
//                       <Users className="w-5 h-5 text-yellow-500" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Contact Number</p>
//                         <p className="text-gray-900">{selectedHospital.contact_number}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-center space-x-3">
//                       <UserCheck className="w-5 h-5 text-indigo-500" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Status</p>
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedHospital.status ?? "active")}`}>
//                           {selectedHospital.status === "active" ? "Active" : "Inactive"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//                   <button
//                     onClick={() => setShowDetailsModal(false)}
//                     className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     Close
//                   </button>

//                   {selectedHospital.status === "active" ? (
//                     <button
//                       onClick={() => {
//                         deactivateHospital(selectedHospital.hospital_id);
//                         setShowDetailsModal(false);
//                       }}
//                       className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                     >
//                       <UserMinus className="h-4 w-4 mr-2" />
//                       Deactivate Hospital
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => {
//                         activateHospital(selectedHospital.hospital_id);
//                         setShowDetailsModal(false);
//                       }}
//                       className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                     >
//                       <UserCheck className="h-4 w-4 mr-2" />
//                       Activate Hospital
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

// export default ManageHospitals;

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Building2, 
  Users, 
  UserX, 
  Eye, 
  UserCheck, 
  UserMinus, 
  X, 
  Hospital,
  Edit,
  Save,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// API Base URL
const API_BASE_URL = 'http://localhost:9092/dashboard/admin';

// Types
interface Hospital {
  hospital_id: number;
  hospital_name: string;
  hospital_type: string;
  hospital_address: string;
  contact_number: string;
  district_name: string;
  status?: 'active' | 'deactive';
}

interface District {
  district_id: number;
  district_name: string;
}

interface HospitalStats {
  totalActiveHospitals: number;
  totalDeactiveHospitals: number;
  totalHospitals: number;
}

interface EditFormData {
  hospital_name: string;
  hospital_type: string;
  hospital_address: string;
  contact_number: string;
  district_name: string;
}

// Mock data fallback
const mockHospitals: Hospital[] = [
  {
    hospital_id: 1,
    hospital_name: "National Hospital Colombo",
    hospital_type: "Teaching",
    hospital_address: "Regent Street, Colombo 07",
    contact_number: "+94112691111",
    district_name: "Colombo",
    status: "active"
  },
  {
    hospital_id: 2,
    hospital_name: "Colombo General Hospital",
    hospital_type: "General",
    hospital_address: "Colombo 10",
    contact_number: "+94112693711",
    district_name: "Colombo",
    status: "active"
  },
  {
    hospital_id: 3,
    hospital_name: "Base Hospital Negombo",
    hospital_type: "Base",
    hospital_address: "Negombo Road",
    contact_number: "+94312222261",
    district_name: "Gampaha",
    status: "deactive"
  },
  {
    hospital_id: 4,
    hospital_name: "Teaching Hospital Kandy",
    hospital_type: "Teaching",
    hospital_address: "William Gopallawa Mawatha, Kandy",
    contact_number: "+94812232337",
    district_name: "Kandy",
    status: "active"
  },
  {
    hospital_id: 5,
    hospital_name: "District General Hospital Kalutara",
    hospital_type: "General",
    hospital_address: "Kalutara South",
    contact_number: "+94342222261",
    district_name: "Kalutara",
    status: "deactive"
  },
  {
    hospital_id: 6,
    hospital_name: "Base Hospital Matale",
    hospital_type: "Base",
    hospital_address: "Matale Road",
    contact_number: "+94662234567",
    district_name: "Matale",
    status: "active"
  },
  {
    hospital_id: 7,
    hospital_name: "General Hospital Galle",
    hospital_type: "General",
    hospital_address: "Galle Fort",
    contact_number: "+94912234567",
    district_name: "Galle",
    status: "active"
  },
  {
    hospital_id: 8,
    hospital_name: "Base Hospital Chilaw",
    hospital_type: "Base",
    hospital_address: "Chilaw Road",
    contact_number: "+94322234567",
    district_name: "Puttalam",
    status: "active"
  },
  {
    hospital_id: 9,
    hospital_name: "Teaching Hospital Peradeniya",
    hospital_type: "Teaching",
    hospital_address: "Peradeniya",
    contact_number: "+94812388000",
    district_name: "Kandy",
    status: "active"
  },
  {
    hospital_id: 10,
    hospital_name: "General Hospital Badulla",
    hospital_type: "General",
    hospital_address: "Badulla Town",
    contact_number: "+94552234567",
    district_name: "Badulla",
    status: "deactive"
  },
  {
    hospital_id: 11,
    hospital_name: "Base Hospital Ampara",
    hospital_type: "Base",
    hospital_address: "Ampara Main Road",
    contact_number: "+94632234567",
    district_name: "Ampara",
    status: "active"
  }
];

const ManageHospitals: React.FC = () => {
  // State variables
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [paginatedHospitals, setPaginatedHospitals] = useState<Hospital[]>([]);
  const [stats, setStats] = useState<HospitalStats>({
    totalActiveHospitals: 0,
    totalDeactiveHospitals: 0,
    totalHospitals: 0
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [sortBy, setSortBy] = useState<'id' | 'district'>('id');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal states
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    hospital_name: '',
    hospital_type: '',
    hospital_address: '',
    contact_number: '',
    district_name: ''
  });
  const [isEditLoading, setIsEditLoading] = useState(false);

  // Helper functions
  const getHospitalTypeColor = (type?: string) => {
    if (!type) return 'bg-gray-100 text-gray-800';
    switch (type.toLowerCase()) {
      case 'teaching':
        return 'bg-purple-100 text-purple-800';
      case 'general':
        return 'bg-blue-100 text-blue-800';
      case 'base':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) =>
    status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  // API functions
  const fetchDistricts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/districts`);
      if (res.ok) {
        const data = await res.json();
        setDistricts(data);
      } else {
        setDistricts([
          { district_id: 1, district_name: 'Colombo' },
          { district_id: 2, district_name: 'Gampaha' },
          { district_id: 3, district_name: 'Kalutara' },
          { district_id: 4, district_name: 'Kandy' },
          { district_id: 5, district_name: 'Matale' },
          { district_id: 6, district_name: 'Galle' },
          { district_id: 7, district_name: 'Puttalam' },
          { district_id: 8, district_name: 'Badulla' },
          { district_id: 9, district_name: 'Ampara' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching districts:', err);
      setDistricts([
        { district_id: 1, district_name: 'Colombo' },
        { district_id: 2, district_name: 'Gampaha' },
        { district_id: 3, district_name: 'Kalutara' },
        { district_id: 4, district_name: 'Kandy' },
        { district_id: 5, district_name: 'Matale' },
        { district_id: 6, district_name: 'Galle' },
        { district_id: 7, district_name: 'Puttalam' },
        { district_id: 8, district_name: 'Badulla' },
        { district_id: 9, district_name: 'Ampara' }
      ]);
    }
  };

  const fetchStats = async () => {
    try {
      const [activeRes, deactiveRes] = await Promise.all([
        fetch(`${API_BASE_URL}/activehospitalCount`),
        fetch(`${API_BASE_URL}/deactivehospitalCount`)
      ]);

      let activeCount = 0;
      let deactiveCount = 0;

      if (activeRes.ok) {
        const d = await activeRes.json();
        activeCount = d.totalActiveHospitals ?? d.total ?? d.count ?? 0;
      }

      if (deactiveRes.ok) {
        const d = await deactiveRes.json();
        deactiveCount = d.totalDeactiveHospitals ?? d.totalActiveHospitals ?? d.total ?? d.count ?? 0;
      }

      if (activeCount === 0 && deactiveCount === 0) {
        activeCount = mockHospitals.filter(h => h.status === 'active').length;
        deactiveCount = mockHospitals.filter(h => h.status === 'deactive').length;
      }

      setStats({
        totalActiveHospitals: activeCount,
        totalDeactiveHospitals: deactiveCount,
        totalHospitals: activeCount + deactiveCount
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      const activeCount = mockHospitals.filter(h => h.status === 'active').length;
      const deactiveCount = mockHospitals.filter(h => h.status === 'deactive').length;
      setStats({
        totalActiveHospitals: activeCount,
        totalDeactiveHospitals: deactiveCount,
        totalHospitals: activeCount + deactiveCount
      });
    }
  };

  const fetchHospitals = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/hospitalData`);
      if (res.ok) {
        const data: any[] = await res.json();
        const normalized: Hospital[] = data.map((h: any) => ({
          hospital_id: Number(h.hospital_id),
          hospital_name: h.hospital_name,
          hospital_type: h.hospital_type,
          hospital_address: h.hospital_address,
          contact_number: h.contact_number,
          district_name: h.district_name,
          status: (h.status as 'active' | 'deactive') ?? 'active'
        }));
        setHospitals(normalized);
        setFilteredHospitals(normalized);
      } else {
        setHospitals(mockHospitals);
        setFilteredHospitals(mockHospitals);
      }
    } catch (err) {
      console.error('Error fetching hospitals:', err);
      setHospitals(mockHospitals);
      setFilteredHospitals(mockHospitals);
    } finally {
      setIsLoading(false);
    }
  };

  const updateHospital = async (hospitalId: number, updatedData: EditFormData) => {
    setIsEditLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/hospitals/${hospitalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (res.ok) {
        // Update local state
        setHospitals(prev =>
          prev.map(h =>
            h.hospital_id === hospitalId
              ? { ...h, ...updatedData }
              : h
          )
        );
        setFilteredHospitals(prev =>
          prev.map(h =>
            h.hospital_id === hospitalId
              ? { ...h, ...updatedData }
              : h
          )
        );
        setShowEditModal(false);
        return true;
      } else {
        const error = await res.text();
        console.error('Failed to update hospital:', error);
        return false;
      }
    } catch (err) {
      console.error('Error updating hospital:', err);
      return false;
    } finally {
      setIsEditLoading(false);
    }
  };

  const deactivateHospital = async (hospitalId: number) => {
    const confirmed = window.confirm('Are you sure you want to deactivate this hospital?');
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE_URL}/hospitals/${hospitalId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setHospitals(prev =>
          prev.map(h => (h.hospital_id === hospitalId ? { ...h, status: 'deactive' } : h))
        );
        fetchStats();
      } else {
        console.error('Failed to deactivate hospital', await res.text());
      }
    } catch (err) {
      console.error('Error deactivating hospital:', err);
    }
  };

  const activateHospital = async (hospitalId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/hospitals/activate/${hospitalId}`, {
        method: 'PUT'
      });
      if (res.ok) {
        setHospitals(prev =>
          prev.map(h => (h.hospital_id === hospitalId ? { ...h, status: 'active' } : h))
        );
        fetchStats();
      } else {
        console.error('Failed to activate hospital', await res.text());
      }
    } catch (err) {
      console.error('Error activating hospital:', err);
    }
  };

  const handleMoreClick = async (hospitalId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/hospitalData/${hospitalId}`);
      if (!res.ok) throw new Error(`Failed to fetch details for ID ${hospitalId}`);
      const data: any[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const h = data[0];
        const merged: Hospital = {
          hospital_id: Number(h.hospital_id),
          hospital_name: h.hospital_name,
          hospital_type: h.hospital_type,
          hospital_address: h.hospital_address,
          contact_number: h.contact_number,
          district_name: h.district_name,
          status: hospitals.find(x => x.hospital_id === hospitalId)?.status ?? 'active'
        };
        setSelectedHospital(merged);
      } else {
        const fallback = hospitals.find(x => x.hospital_id === hospitalId) ?? null;
        setSelectedHospital(fallback);
      }
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Error fetching hospital details:', err);
      const fallback = hospitals.find(x => x.hospital_id === hospitalId) ?? null;
      setSelectedHospital(fallback);
      setShowDetailsModal(true);
    }
  };

  const handleEditClick = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setEditFormData({
      hospital_name: hospital.hospital_name,
      hospital_type: hospital.hospital_type,
      hospital_address: hospital.hospital_address,
      contact_number: hospital.contact_number,
      district_name: hospital.district_name
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHospital) return;

    const success = await updateHospital(selectedHospital.hospital_id, editFormData);
    if (success) {
      alert('Hospital updated successfully!');
    } else {
      alert('Failed to update hospital. Please try again.');
    }
  };

  const handleSortToggle = () => {
    setSortBy(prev => prev === 'id' ? 'district' : 'id');
    setCurrentPage(1);
  };

  // Effects
  useEffect(() => {
    let filtered = hospitals.filter(hospital => {
      const matchesSearch =
        hospital.hospital_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.district_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'All Status' ||
        hospital.status === statusFilter.toLowerCase();

      const matchesType = typeFilter === 'All Types' || hospital.hospital_type === typeFilter;
      const matchesDistrict =
        districtFilter === 'All Districts' || hospital.district_name === districtFilter;

      return matchesSearch && matchesStatus && matchesType && matchesDistrict;
    });

    // Sort according to sortBy
    filtered.sort((a, b) => {
      if (sortBy === 'district') {
        const districtComparison = a.district_name.localeCompare(b.district_name);
        if (districtComparison !== 0) return districtComparison;
        return a.hospital_id - b.hospital_id;
      } else {
        return a.hospital_id - b.hospital_id;
      }
    });

    setFilteredHospitals(filtered);
    setCurrentPage(1);
  }, [hospitals, searchTerm, statusFilter, typeFilter, districtFilter, sortBy]);

  // Pagination effect
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedHospitals(filteredHospitals.slice(startIndex, endIndex));
  }, [filteredHospitals, currentPage]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredHospitals.length / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredHospitals.length);

  const uniqueTypes = Array.from(new Set(hospitals.map(h => h.hospital_type))).filter(Boolean).sort();
  const uniqueDistricts = districts.map(d => d.district_name).filter(Boolean).sort();

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchHospitals(), fetchStats(), fetchDistricts()]);
    };
    init();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="p-2 sm:p-3 bg-red-100 rounded-full w-fit">
            <Hospital className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Hospital Management</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage hospitals and their status</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Hospitals</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalHospitals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Active Hospitals</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalActiveHospitals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserX className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Inactive Hospitals</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalDeactiveHospitals}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search hospitals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Deactive">Inactive</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All Types">All Types</option>
              {uniqueTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* District Filter */}
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All Districts">All Districts</option>
              {uniqueDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Sort Button */}
            <button
              onClick={handleSortToggle}
              className="flex items-center justify-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowUpDown className="h-4 w-4 mr-1" />
              Sort by {sortBy === 'id' ? 'ID' : 'District'}
            </button>
          </div>
        </div>

        {/* Mobile Cards View (visible on mobile) */}
        <div className="lg:hidden space-y-4 mb-6">
          {paginatedHospitals.map((hospital) => (
            <div key={hospital.hospital_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">{hospital.hospital_name}</h3>
                    <p className="text-xs text-gray-500">#{hospital.hospital_id}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(hospital.status ?? 'active')}`}>
                  {hospital.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                <div>
                  <p className="text-gray-500">Type</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHospitalTypeColor(hospital.hospital_type)}`}>
                    {hospital.hospital_type}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500">District</p>
                  <p className="text-gray-900 font-medium">{hospital.district_name}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Contact</p>
                  <p className="text-gray-900">{hospital.contact_number}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleMoreClick(hospital.hospital_id)}
                  className="flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </button>
                <button
                  onClick={() => handleEditClick(hospital)}
                  className="flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </button>
                {hospital.status === 'active' ? (
                  <button
                    onClick={() => deactivateHospital(hospital.hospital_id)}
                    className="flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    <UserMinus className="h-3 w-3 mr-1" />
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => activateHospital(hospital.hospital_id)}
                    className="flex items-center px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                  >
                    <UserCheck className="h-3 w-3 mr-1" />
                    Activate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedHospitals.map((hospital) => (
                  <tr key={hospital.hospital_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">#{hospital.hospital_id}</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{hospital.hospital_name}</div>
                          <div className="text-sm text-gray-500">{hospital.contact_number}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHospitalTypeColor(hospital.hospital_type)}`}>
                        {hospital.hospital_type}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hospital.district_name}</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(hospital.status ?? 'active')}`}>
                        {hospital.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleMoreClick(hospital.hospital_id)}
                          className="flex items-center px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleEditClick(hospital)}
                          className="flex items-center px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </button>
                        {hospital.status === 'active' ? (
                          <button
                            onClick={() => deactivateHospital(hospital.hospital_id)}
                            className="flex items-center px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          >
                            <UserMinus className="h-3 w-3 mr-1" />
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => activateHospital(hospital.hospital_id)}
                            className="flex items-center px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                          >
                            <UserCheck className="h-3 w-3 mr-1" />
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {paginatedHospitals.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hospitals found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {filteredHospitals.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                Showing {startItem}-{endItem} of {filteredHospitals.length} hospitals
              </div>
              <div className="flex items-center justify-center sm:justify-end space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        currentPage === page
                          ? 'bg-red-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedHospital && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-10 sm:pt-20 px-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Hospital Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close details"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-0 sm:mr-4 mb-4 sm:mb-0 mx-auto sm:mx-0">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
                      {selectedHospital.hospital_name}
                    </h3>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getHospitalTypeColor(selectedHospital.hospital_type)}`}>
                      {selectedHospital.hospital_type} Hospital
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Building2 className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Hospital ID</p>
                        <p className="text-gray-900">#{selectedHospital.hospital_id}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Users className="w-5 h-5 text-purple-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Hospital Type</p>
                        <p className="text-gray-900">{selectedHospital.hospital_type}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Building2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">District</p>
                        <p className="text-gray-900">{selectedHospital.district_name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Building2 className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        <p className="text-gray-900">{selectedHospital.hospital_address}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Contact Number</p>
                        <p className="text-gray-900">{selectedHospital.contact_number}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <UserCheck className="w-5 h-5 text-indigo-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedHospital.status ?? 'active')}`}>
                          {selectedHospital.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="w-full sm:w-auto px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleEditClick(selectedHospital);
                    }}
                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Hospital
                  </button>
                  {selectedHospital.status === 'active' ? (
                    <button
                      onClick={() => {
                        deactivateHospital(selectedHospital.hospital_id);
                        setShowDetailsModal(false);
                      }}
                      className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      Deactivate Hospital
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        activateHospital(selectedHospital.hospital_id);
                        setShowDetailsModal(false);
                      }}
                      className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Activate Hospital
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedHospital && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-10 sm:pt-20 px-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Edit Hospital</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close edit modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-4 sm:p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.hospital_name}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, hospital_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital Type *
                    </label>
                    <select
                      required
                      value={editFormData.hospital_type}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, hospital_type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Type</option>
                      <option value="Teaching">Teaching</option>
                      <option value="General">General</option>
                      <option value="Base">Base</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={editFormData.hospital_address}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, hospital_address: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={editFormData.contact_number}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, contact_number: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District *
                    </label>
                    <select
                      required
                      value={editFormData.district_name}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, district_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select District</option>
                      {uniqueDistricts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 mt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="w-full sm:w-auto px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isEditLoading}
                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isEditLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Hospital
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageHospitals;
