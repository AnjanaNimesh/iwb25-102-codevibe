// import { useState, useEffect } from "react";
// import { DropletIcon, PlusIcon, AlertCircleIcon, Edit2 } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// // Types
// interface BloodUnit {
//   blood_name: string;
//   quantity: number;
// }

// interface BloodGroupStockPayload {
//   blood_name: string;
//   quantity: number;
// }

// const API_BASE_URL = "http://localhost:9090/hospital";
// const HOSPITAL_ID = 3;

// const BloodStock = () => {
//   const [bloodStock, setBloodStock] = useState<BloodUnit[]>([]);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [newStock, setNewStock] = useState<BloodGroupStockPayload>({
//     blood_name: "O+",
//     quantity: 1,
//   });
//   const [editStock, setEditStock] = useState<BloodGroupStockPayload>({
//     blood_name: "",
//     quantity: 1,
//   });

//   // Fetch
//   const fetchBloodStock = async () => {
//     try {
//       const res = await fetch(
//         `${API_BASE_URL}/bloodgroups?hospital_id=${HOSPITAL_ID}`
//       );
//       if (!res.ok) throw new Error("Failed to fetch blood stock");
//       const data: BloodUnit[] = await res.json();
//       setBloodStock(data);
//     } catch (error) {
//       console.error("Error fetching blood stock:", error);
//     }
//   };

//   // Add
//   const addBloodStock = async () => {
//     try {
//       const res = await fetch(
//         `${API_BASE_URL}/bloodgroups?hospital_id=${HOSPITAL_ID}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(newStock),
//         }
//       );
//       if (!res.ok) throw new Error("Failed to save blood stock");
//       await fetchBloodStock();
//       setShowAddForm(false);
//       setNewStock({ blood_name: "O+", quantity: 1 });
//     } catch (error) {
//       console.error("Error adding blood stock:", error);
//     }
//   };

//   // Edit
//   // const updateBloodStock = async () => {
//   //   try {
//   //     const res = await fetch(`${API_BASE_URL}/bloodgroups?hospital_id=${HOSPITAL_ID}`, {
//   //       method: 'PUT',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify(editStock),
//   //     })
//   //     if (!res.ok) throw new Error('Failed to update blood stock')
//   //     await fetchBloodStock()
//   //     setShowEditForm(false)
//   //     setEditStock({ blood_name: '', quantity: 1 })
//   //   } catch (error) {
//   //     console.error('Error updating blood stock:', error)
//   //   }
//   // }
//   const updateBloodStock = async () => {
//     try {
//       const res = await fetch(
//         `${API_BASE_URL}/bloodgroups?hospital_id=${HOSPITAL_ID}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             blood_name: editStock.blood_name,
//             quantity: editStock.quantity,
//           }),
//         }
//       );

//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(`Failed to update blood stock: ${errorText}`);
//       }

//       const result = await res.json();
//       console.log("Update result:", result); // debug output

//       await fetchBloodStock();
//       setShowEditForm(false);
//       setEditStock({ blood_name: "", quantity: 1 });
//     } catch (error) {
//       console.error("Error updating blood stock:", error);
//     }
//   };

//   useEffect(() => {
//     fetchBloodStock();
//   }, []);

//   // Status
//   const bloodStockWithStatus = bloodStock.map((item) => {
//     let status = "Adequate";
//     if (item.quantity <= 5) status = "Critical";
//     else if (item.quantity <= 10) status = "Low";
//     return { ...item, status };
//   });

//   const totalUnits = bloodStockWithStatus.reduce(
//     (sum, item) => sum + item.quantity,
//     0
//   );

//   const chartData = bloodStockWithStatus.map((item) => ({
//     name: item.blood_name,
//     units: item.quantity,
//   }));

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center">
//           <DropletIcon className="h-6 w-6 text-red-500 mr-2" />
//           <h1 className="text-2xl font-bold text-gray-800">
//             Blood Stock Management
//           </h1>
//         </div>
//         <button
//           className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-600 transition-colors"
//           onClick={() => setShowAddForm(true)}
//         >
//           <PlusIcon className="h-4 w-4 mr-1" />
//           Add Blood Stock
//         </button>
//       </div>

//       {/* Add Form */}
//       {showAddForm && (
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
//           <h2 className="text-lg font-semibold mb-4">Add Blood Stock</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Blood Group
//               </label>
//               <select
//                 className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 value={newStock.blood_name}
//                 onChange={(e) =>
//                   setNewStock({ ...newStock, blood_name: e.target.value })
//                 }
//               >
//                 {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
//                   (bg) => (
//                     <option key={bg} value={bg}>
//                       {bg}
//                     </option>
//                   )
//                 )}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Units
//               </label>
//               <input
//                 type="number"
//                 min="1"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 value={newStock.quantity}
//                 onChange={(e) =>
//                   setNewStock({
//                     ...newStock,
//                     quantity: parseInt(e.target.value) || 0,
//                   })
//                 }
//               />
//             </div>
//           </div>
//           <div className="mt-4 flex justify-end">
//             <button
//               className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2"
//               onClick={() => setShowAddForm(false)}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-red-500 text-white px-4 py-2 rounded-md"
//               onClick={addBloodStock}
//             >
//               Add Stock
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Edit Form */}
//       {showEditForm && (
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
//           <h2 className="text-lg font-semibold mb-4">Edit Blood Stock</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Blood Group
//               </label>
//               <input
//                 type="text"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
//                 value={editStock.blood_name}
//                 readOnly
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Units
//               </label>
//               <input
//                 type="number"
//                 min="1"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 value={editStock.quantity}
//                 onChange={(e) =>
//                   setEditStock({
//                     ...editStock,
//                     quantity: parseInt(e.target.value) || 0,
//                   })
//                 }
//               />
//             </div>
//           </div>
//           <div className="mt-4 flex justify-end">
//             <button
//               className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2"
//               onClick={() => setShowEditForm(false)}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded-md"
//               onClick={updateBloodStock}
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Stats */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         {/* Total Stock */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold mb-4">Total Blood Stock</h2>
//           <div className="text-4xl font-bold text-gray-800">{totalUnits}</div>
//           <div className="text-gray-600 mt-1">Total units available</div>
//         </div>
//         {/* Critical */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold mb-4">Critical Levels</h2>
//           <div className="flex items-center">
//             <AlertCircleIcon className="h-5 w-5 text-red-500 mr-2" />
//             <div className="text-gray-800">
//               {
//                 bloodStockWithStatus.filter(
//                   (item) => item.status === "Critical"
//                 ).length
//               }{" "}
//               blood types at critical levels
//             </div>
//           </div>
//           <div className="mt-2 text-sm text-gray-600">
//             {bloodStockWithStatus
//               .filter((item) => item.status === "Critical")
//               .map((item) => item.blood_name)
//               .join(", ")}
//           </div>
//         </div>
//         {/* Low */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold mb-4">Low Levels</h2>
//           <div className="flex items-center">
//             <AlertCircleIcon className="h-5 w-5 text-yellow-500 mr-2" />
//             <div className="text-gray-800">
//               {
//                 bloodStockWithStatus.filter((item) => item.status === "Low")
//                   .length
//               }{" "}
//               blood types at low levels
//             </div>
//           </div>
//           <div className="mt-2 text-sm text-gray-600">
//             {bloodStockWithStatus
//               .filter((item) => item.status === "Low")
//               .map((item) => item.blood_name)
//               .join(", ")}
//           </div>
//         </div>
//       </div>

//       {/* Chart & Table */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* Chart */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold mb-4">
//             Blood Stock Visualization
//           </h2>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="units" fill="#f44336" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold mb-4">Blood Stock Inventory</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
//                     Blood Group
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
//                     Units
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {bloodStockWithStatus.map((item) => (
//                   <tr key={item.blood_name}>
//                     <td className="px-6 py-4">{item.blood_name}</td>
//                     <td className="px-6 py-4">{item.quantity}</td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           item.status === "Adequate"
//                             ? "bg-green-100 text-green-800"
//                             : item.status === "Low"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {item.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <button
//                         className="text-blue-500 hover:text-blue-700 flex items-center"
//                         onClick={() => {
//                           setEditStock({
//                             blood_name: item.blood_name,
//                             quantity: item.quantity,
//                           });
//                           setShowEditForm(true);
//                         }}
//                       >
//                         <Edit2 className="h-4 w-4 mr-1" /> Edit
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BloodStock;





// import { useState, useEffect } from "react";
// import { Droplets, Plus, AlertCircle, Edit2 } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts'

// // Types
// interface BloodUnit {
//   blood_name: string
//   quantity: number
// }

// interface BloodGroupStockPayload {
//   blood_name: string
//   quantity: number
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

// const BloodStock = () => {
//   const [bloodStock, setBloodStock] = useState<BloodUnit[]>([]);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [authStatus, setAuthStatus] = useState<AuthStatus>({
//     isAuthenticated: false,
//     userInfo: {}
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [newStock, setNewStock] = useState<BloodGroupStockPayload>({
//     blood_name: 'O+',
//     quantity: 1,
//   })
//   const [editStock, setEditStock] = useState<BloodGroupStockPayload>({
//     blood_name: '',
//     quantity: 1,
//   })

//   // Check authentication status
//   const checkAuth = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/profile`, {
//         method: 'GET',
//         credentials: 'include', // Important: Include cookies
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       if (res.ok) {
//         const data = await res.json();
//         if (data.status === 'success') {
//           setAuthStatus({
//             isAuthenticated: true,
//             userInfo: data.data
//           });
//           return true;
//         }
//       }
      
//       setAuthStatus({
//         isAuthenticated: false,
//         userInfo: {}
//       });
//       setError('Authentication required. Please login first.');
//       return false;
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       setAuthStatus({
//         isAuthenticated: false,
//         userInfo: {}
//       });
//       setError('Failed to verify authentication. Please check your connection.');
//       return false;
//     }
//   }

//   // Fetch blood stock with JWT authentication
//   const fetchBloodStock = async () => {
//     try {
//       setError(null);
//       const res = await fetch(`${API_BASE_URL}/bloodgroups`, {
//         method: 'GET',
//         credentials: 'include', // Include cookies for JWT
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       if (!res.ok) {
//         if (res.status === 401) {
//           setError('Authentication failed. Please login again.');
//           setAuthStatus({ isAuthenticated: false, userInfo: {} });
//           return;
//         }
//         if (res.status === 404) {
//           setError('Blood stock endpoint not found. Please contact the administrator.');
//           return;
//         }
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json();
//       if (data.status === 'success' && Array.isArray(data.data)) {
//         setBloodStock(data.data);
//       } else {
//         console.error('Unexpected data format:', data);
//         setBloodStock([]);
//         setError('Invalid data format received from server.');
//       }
//     } catch (error) {
//       console.error("Error fetching blood stock:", error);
//       setError('Failed to fetch blood stock. Please check your connection or try again later.');
//       setBloodStock([]);
//     }
//   };

//   // Add blood stock with JWT authentication
//   const addBloodStock = async () => {
//     try {
//       setError(null);
//       const res = await fetch(`${API_BASE_URL}/bloodgroups`, {
//         method: "POST",
//         credentials: 'include', // Include cookies for JWT
//         headers: { 
//           "Content-Type": "application/json" 
//         },
//         body: JSON.stringify(newStock),
//       });

//       if (!res.ok) {
//         if (res.status === 401) {
//           setError('Authentication failed. Please login again.');
//           setAuthStatus({ isAuthenticated: false, userInfo: {} });
//           return;
//         }
//         const errorData = await res.json().catch(() => null);
//         throw new Error(errorData?.message || `HTTP error! status: ${res.status}`);
//       }

//       await fetchBloodStock();
//       setShowAddForm(false);
//       setNewStock({ blood_name: "O+", quantity: 1 });
//     } catch (error) {
//       console.error("Error adding blood stock:", error);
//       setError('Failed to add blood stock. Please try again.');
//     }
//   }

//   // Update blood stock with JWT authentication
//   const updateBloodStock = async () => {
//     try {
//       setError(null);
//       const res = await fetch(`${API_BASE_URL}/bloodgroups`, {
//         method: "PUT",
//         credentials: 'include', // Include cookies for JWT
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           blood_name: editStock.blood_name,
//           quantity: editStock.quantity,
//         }),
//       });

//       if (!res.ok) {
//         if (res.status === 401) {
//           setError('Authentication failed. Please login again.');
//           setAuthStatus({ isAuthenticated: false, userInfo: {} });
//           return;
//         }
//         const errorText = await res.text();
//         throw new Error(`Failed to update blood stock: ${errorText}`);
//       }

//       const result = await res.json();
//       console.log("Update result:", result);

//       await fetchBloodStock();
//       setShowEditForm(false);
//       setEditStock({ blood_name: "", quantity: 1 });
//     } catch (error) {
//       console.error("Error updating blood stock:", error);
//       setError('Failed to update blood stock. Please try again.');
//     }
//   }

//   // Initialize component
//   useEffect(() => {
//     const initializeComponent = async () => {
//       setLoading(true);
//       const isAuthenticated = await checkAuth();
//       if (isAuthenticated) {
//         await fetchBloodStock();
//       }
//       setLoading(false);
//     };

//     initializeComponent();
//   }, []);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading blood stock data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Authentication required state
//   if (!authStatus.isAuthenticated) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center bg-white p-8 rounded-lg shadow-lg border border-gray-200">
//           <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold mb-2 text-gray-800">Authentication Required</h2>
//           <p className="text-gray-600 mb-4">
//             Please login to access the blood stock management system.
//           </p>
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
//               <p className="text-red-800 text-sm">{error}</p>
//             </div>
//           )}
//           <button 
//             onClick={() => window.location.reload()} 
//             className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Calculate status for blood stock
//   const bloodStockWithStatus = bloodStock.map((item) => {
//     let status = 'Adequate'
//     if (item.quantity <= 5) status = 'Critical'
//     else if (item.quantity <= 10) status = 'Low'
//     return { ...item, status }
//   })

//   const totalUnits = bloodStockWithStatus.reduce((sum, item) => sum + item.quantity, 0)

//   const chartData = bloodStockWithStatus.map((item) => ({
//     name: item.blood_name,
//     units: item.quantity,
//   }))

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center">
//           <Droplets className="h-6 w-6 text-red-500 mr-2" />
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">
//               Blood Stock Management
//             </h1>
//           </div>
//         </div>
//         <button
//           className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-600 transition-colors"
//           onClick={() => setShowAddForm(true)}
//         >
//           <Plus className="h-4 w-4 mr-1" />
//           Add Blood Stock
//         </button>
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
//           <div className="flex">
//             <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
//             <p className="text-red-800">{error}</p>
//           </div>
//         </div>
//       )}

//       {/* Add Form */}
//       {showAddForm && (
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
//           <h2 className="text-lg font-semibold mb-4">Add Blood Stock</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
//               <select
//                 className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 value={newStock.blood_name}
//                 onChange={(e) => setNewStock({ ...newStock, blood_name: e.target.value })}
//               >
//                 {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
//                   <option key={bg} value={bg}>
//                     {bg}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Units</label>
//               <input
//                 type="number"
//                 min="1"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 value={newStock.quantity}
//                 onChange={(e) => setNewStock({ ...newStock, quantity: parseInt(e.target.value) || 0 })}
//               />
//             </div>
//           </div>
//           <div className="mt-4 flex justify-end">
//             <button
//               className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2"
//               onClick={() => setShowAddForm(false)}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-red-500 text-white px-4 py-2 rounded-md"
//               onClick={addBloodStock}
//             >
//               Add Stock
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Edit Form */}
//       {showEditForm && (
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
//           <h2 className="text-lg font-semibold mb-4">Edit Blood Stock</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
//               <input
//                 type="text"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
//                 value={editStock.blood_name}
//                 readOnly
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Units</label>
//               <input
//                 type="number"
//                 min="1"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 value={editStock.quantity}
//                 onChange={(e) => setEditStock({ ...editStock, quantity: parseInt(e.target.value) || 0 })}
//               />
//             </div>
//           </div>
//           <div className="mt-4 flex justify-end">
//             <button
//               className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2"
//               onClick={() => setShowEditForm(false)}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded-md"
//               onClick={updateBloodStock}
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Stats */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         {/* Total Stock */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold mb-4">Total Blood Stock</h2>
//           <div className="text-4xl font-bold text-gray-800">{totalUnits}</div>
//           <div className="text-gray-600 mt-1">Total units available</div>
//         </div>
//         {/* Critical */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold mb-4">Critical Levels</h2>
//           <div className="flex items-center">
//             <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
//             <div className="text-gray-800">
//               {bloodStockWithStatus.filter((item) => item.status === 'Critical').length} blood types at critical levels
//             </div>
//           </div>
//           <div className="mt-2 text-sm text-gray-600">
//             {bloodStockWithStatus
//               .filter((item) => item.status === "Critical")
//               .map((item) => item.blood_name)
//               .join(", ") || "None"}
//           </div>
//         </div>
//         {/* Low */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold mb-4">Low Levels</h2>
//           <div className="flex items-center">
//             <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
//             <div className="text-gray-800">
//               {bloodStockWithStatus.filter((item) => item.status === 'Low').length} blood types at low levels
//             </div>
//           </div>
//           <div className="mt-2 text-sm text-gray-600">
//             {bloodStockWithStatus
//               .filter((item) => item.status === "Low")
//               .map((item) => item.blood_name)
//               .join(", ") || "None"}
//           </div>
//         </div>
//       </div>

//       {/* Chart & Table */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* Chart */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold mb-4">Blood Stock Visualization</h2>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="units" fill="#f44336" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold mb-4">Blood Stock Inventory</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Blood Group</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Units</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {bloodStockWithStatus.map((item) => (
//                   <tr key={item.blood_name}>
//                     <td className="px-6 py-4">{item.blood_name}</td>
//                     <td className="px-6 py-4">{item.quantity}</td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           item.status === 'Adequate'
//                             ? 'bg-green-100 text-green-800'
//                             : item.status === 'Low'
//                             ? 'bg-yellow-100 text-yellow-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}
//                       >
//                         {item.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <button
//                         className="text-blue-500 hover:text-blue-700 flex items-center"
//                         onClick={() => {
//                           setEditStock({ blood_name: item.blood_name, quantity: item.quantity })
//                           setShowEditForm(true)
//                         }}
//                       >
//                         <Edit2 className="h-4 w-4 mr-1" /> Edit
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default BloodStock;



// import { useState, useEffect } from "react";
// import { Droplets, Plus, AlertCircle, Edit2, X } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// // Types
// interface BloodUnit {
//   blood_name: string;
//   quantity: number;
// }

// interface BloodGroupStockPayload {
//   blood_name: string;
//   quantity: number;
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

// const BloodStock = () => {
//   const [bloodStock, setBloodStock] = useState<BloodUnit[]>([]);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [authStatus, setAuthStatus] = useState<AuthStatus>({
//     isAuthenticated: false,
//     userInfo: {},
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [newStock, setNewStock] = useState<BloodGroupStockPayload>({
//     blood_name: "O+",
//     quantity: 1,
//   });
//   const [editStock, setEditStock] = useState<BloodGroupStockPayload>({
//     blood_name: "",
//     quantity: 1,
//   });

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
//       setAuthStatus({ isAuthenticated: false, userInfo: {} });
//       setError("Authentication required. Please login first.");
//       return false;
//     } catch (error) {
//       console.error("Auth check failed:", error);
//       setAuthStatus({ isAuthenticated: false, userInfo: {} });
//       setError("Failed to verify authentication. Please check your connection.");
//       return false;
//     }
//   };

//   // Fetch blood stock
//   const fetchBloodStock = async () => {
//     try {
//       setError(null);
//       const res = await fetch(`${API_BASE_URL}/bloodgroups`, {
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
//         if (res.status === 404) {
//           setError("Blood stock endpoint not found. Please contact the administrator.");
//           return;
//         }
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json();
//       if (data.status === "success" && Array.isArray(data.data)) {
//         setBloodStock(data.data);
//       } else {
//         console.error("Unexpected data format:", data);
//         setBloodStock([]);
//         setError("Invalid data format received from server.");
//       }
//     } catch (error) {
//       console.error("Error fetching blood stock:", error);
//       setError("Failed to fetch blood stock. Please check your connection or try again later.");
//       setBloodStock([]);
//     }
//   };

//   // Add blood stock
//   const addBloodStock = async () => {
//     if (newStock.quantity < 1) {
//       setError("Quantity must be at least 1 unit.");
//       return;
//     }
//     try {
//       setError(null);
//       const res = await fetch(`${API_BASE_URL}/bloodgroups`, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newStock),
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

//       await fetchBloodStock();
//       setShowAddForm(false);
//       setNewStock({ blood_name: "O+", quantity: 1 });
//     } catch (error) {
//       console.error("Error adding blood stock:", error);
//       setError("Failed to add blood stock. Please try again.");
//     }
//   };

//   // Update blood stock
//   const updateBloodStock = async () => {
//     if (editStock.quantity < 1) {
//       setError("Quantity must be at least 1 unit.");
//       return;
//     }
//     try {
//       setError(null);
//       const res = await fetch(`${API_BASE_URL}/bloodgroups`, {
//         method: "PUT",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           blood_name: editStock.blood_name,
//           quantity: editStock.quantity,
//         }),
//       });

//       if (!res.ok) {
//         if (res.status === 401) {
//           setError("Authentication failed. Please login again.");
//           setAuthStatus({ isAuthenticated: false, userInfo: {} });
//           return;
//         }
//         const errorText = await res.text();
//         throw new Error(`Failed to update blood stock: ${errorText}`);
//       }

//       await fetchBloodStock();
//       setShowEditForm(false);
//       setEditStock({ blood_name: "", quantity: 1 });
//     } catch (error) {
//       console.error("Error updating blood stock:", error);
//       setError("Failed to update blood stock. Please try again.");
//     }
//   };

//   // Initialize component
//   useEffect(() => {
//     const initializeComponent = async () => {
//       setLoading(true);
//       const isAuthenticated = await checkAuth();
//       if (isAuthenticated) {
//         await fetchBloodStock();
//       }
//       setLoading(false);
//     };
//     initializeComponent();
//   }, []);

//   // Calculate status for blood stock
//   const bloodStockWithStatus = bloodStock.map((item) => {
//     let status = "Adequate";
//     if (item.quantity <= 5) status = "Critical";
//     else if (item.quantity <= 10) status = "Low";
//     return { ...item, status };
//   });

//   const totalUnits = bloodStockWithStatus.reduce((sum, item) => sum + item.quantity, 0);

//   const chartData = bloodStockWithStatus.map((item) => ({
//     name: item.blood_name,
//     units: item.quantity,
//   }));

//   // Loading state
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600 font-medium">Loading blood stock data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Authentication required state
//   if (!authStatus.isAuthenticated) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-md">
//           <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
//           <p className="text-gray-600 mb-4">Please log in to access the blood stock management system.</p>
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
//               <p className="text-red-800 text-sm">{error}</p>
//             </div>
//           )}
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center space-x-3">
//           <Droplets className="h-8 w-8 text-red-600" />
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Blood Stock Management</h1>
//             <p className="text-gray-500 text-sm">Manage and track blood inventory efficiently</p>
//           </div>
//         </div>
//         <button
//           onClick={() => setShowAddForm(true)}
//           className="bg-red-600 text-white px-5 py-2 rounded-lg flex items-center hover:bg-red-700 transition-colors duration-200 shadow-md"
//         >
//           <Plus className="h-5 w-5 mr-2" />
//           Add Blood Stock
//         </button>
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center animate-slide-in">
//           <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
//           <p className="text-red-800 text-sm">{error}</p>
//         </div>
//       )}

//       {/* Add Form Modal */}
//       {showAddForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full animate-fade-in">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold text-gray-800">Add Blood Stock</h2>
//               <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
//                 <X className="h-6 w-6" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
//                 <select
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors"
//                   value={newStock.blood_name}
//                   onChange={(e) => setNewStock({ ...newStock, blood_name: e.target.value })}
//                 >
//                   {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bg) => (
//                     <option key={bg} value={bg}>
//                       {bg}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Units</label>
//                 <input
//                   type="number"
//                   min="1"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors"
//                   value={newStock.quantity}
//                   onChange={(e) => setNewStock({ ...newStock, quantity: parseInt(e.target.value) || 1 })}
//                 />
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end space-x-3">
//               <button
//                 className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
//                 onClick={() => setShowAddForm(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
//                 onClick={addBloodStock}
//               >
//                 Add Stock
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Form Modal */}
//       {showEditForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full animate-fade-in">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold text-gray-800">Edit Blood Stock</h2>
//               <button onClick={() => setShowEditForm(false)} className="text-gray-500 hover:text-gray-700">
//                 <X className="h-6 w-6" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
//                   value={editStock.blood_name}
//                   readOnly
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Units</label>
//                 <input
//                   type="number"
//                   min="1"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
//                   value={editStock.quantity}
//                   onChange={(e) => setEditStock({ ...editStock, quantity: parseInt(e.target.value) || 1 })}
//                 />
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end space-x-3">
//               <button
//                 className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
//                 onClick={() => setShowEditForm(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                 onClick={updateBloodStock}
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Stats Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
//           <h2 className="text-lg font-semibold text-gray-800 mb-2">Total Blood Stock</h2>
//           <div className="text-4xl font-bold text-red-600">{totalUnits}</div>
//           <p className="text-gray-600 text-sm mt-1">Total units available</p>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
//           <h2 className="text-lg font-semibold text-gray-800 mb-2">Critical Levels</h2>
//           <div className="flex items-center">
//             <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
//             <p className="text-gray-800">
//               {bloodStockWithStatus.filter((item) => item.status === "Critical").length} blood types
//             </p>
//           </div>
//           <p className="text-gray-600 text-sm mt-2">
//             {bloodStockWithStatus
//               .filter((item) => item.status === "Critical")
//               .map((item) => item.blood_name)
//               .join(", ") || "None"}
//           </p>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
//           <h2 className="text-lg font-semibold text-gray-800 mb-2">Low Levels</h2>
//           <div className="flex items-center">
//             <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
//             <p className="text-gray-800">
//               {bloodStockWithStatus.filter((item) => item.status === "Low").length} blood types
//             </p>
//           </div>
//           <p className="text-gray-600 text-sm mt-2">
//             {bloodStockWithStatus
//               .filter((item) => item.status === "Low")
//               .map((item) => item.blood_name)
//               .join(", ") || "None"}
//           </p>
//         </div>
//       </div>

//       {/* Chart & Table Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Chart */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Blood Stock Visualization</h2>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="name" stroke="#6b7280" />
//                 <YAxis stroke="#6b7280" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "#fff",
//                     border: "1px solid #e5e7eb",
//                     borderRadius: "8px",
//                     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                   }}
//                 />
//                 <Legend />
//                 <Bar dataKey="units" fill="#f44336" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Blood Stock Inventory</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {bloodStockWithStatus.map((item) => (
//                   <tr key={item.blood_name} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 text-gray-900">{item.blood_name}</td>
//                     <td className="px-6 py-4 text-gray-900">{item.quantity}</td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
//                           item.status === "Adequate"
//                             ? "bg-green-100 text-green-800"
//                             : item.status === "Low"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {item.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <button
//                         className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
//                         onClick={() => {
//                           setEditStock({ blood_name: item.blood_name, quantity: item.quantity });
//                           setShowEditForm(true);
//                         }}
//                       >
//                         <Edit2 className="h-4 w-4 mr-1" /> Edit
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BloodStock;









// import { useState, useEffect } from "react";
// import { Droplets, Plus, AlertCircle, Edit2, X, CheckCircle } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// // Types
// interface BloodUnit {
//   blood_name: string;
//   quantity: number;
// }

// interface BloodGroupStockPayload {
//   blood_name: string;
//   quantity: number;
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

// const BloodStock = () => {
//   const [bloodStock, setBloodStock] = useState<BloodUnit[]>([]);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [authStatus, setAuthStatus] = useState<AuthStatus>({
//     isAuthenticated: false,
//     userInfo: {},
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [newStock, setNewStock] = useState<BloodGroupStockPayload>({
//     blood_name: "O+",
//     quantity: 1,
//   });
//   const [editStock, setEditStock] = useState<BloodGroupStockPayload>({
//     blood_name: "",
//     quantity: 1,
//   });
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
//       setAuthStatus({ isAuthenticated: false, userInfo: {} });
//       setError("Authentication required. Please login first.");
//       return false;
//     } catch (error) {
//       console.error("Auth check failed:", error);
//       setAuthStatus({ isAuthenticated: false, userInfo: {} });
//       setError("Failed to verify authentication. Please check your connection.");
//       return false;
//     }
//   };

//   // Fetch blood stock
//   const fetchBloodStock = async () => {
//     try {
//       setError(null);
//       const res = await fetch(`${API_BASE_URL}/bloodgroups`, {
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
//         if (res.status === 404) {
//           setError("Blood stock endpoint not found. Please contact the administrator.");
//           return;
//         }
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json();
//       if (data.status === "success" && Array.isArray(data.data)) {
//         setBloodStock(data.data);
//       } else {
//         console.error("Unexpected data format:", data);
//         setBloodStock([]);
//         setError("Invalid data format received from server.");
//       }
//     } catch (error) {
//       console.error("Error fetching blood stock:", error);
//       setError("Failed to fetch blood stock. Please check your connection or try again later.");
//       setBloodStock([]);
//     }
//   };

//   // Initialize component
//   useEffect(() => {
//     const initializeComponent = async () => {
//       setLoading(true);
//       const isAuthenticated = await checkAuth();
//       if (isAuthenticated) {
//         await fetchBloodStock();
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

//   // Add blood stock
//   const addBloodStock = async () => {
//     if (newStock.quantity < 1) {
//       setError("Quantity must be at least 1 unit.");
//       return;
//     }
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await fetch(`${API_BASE_URL}/bloodgroups`, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newStock),
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
//       showConfirmation(
//         "success",
//         "Blood Stock Added",
//         data.message || `Successfully added ${newStock.quantity} units of ${newStock.blood_name} to the stock.`,
//         () => {
//           fetchBloodStock();
//           setShowAddForm(false);
//           setNewStock({ blood_name: "O+", quantity: 1 });
//         }
//       );
//     } catch (error) {
//       console.error("Error adding blood stock:", error);
//       setError("Failed to add blood stock. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update blood stock
//   const updateBloodStock = async () => {
//     if (editStock.quantity < 1) {
//       setError("Quantity must be at least 1 unit.");
//       return;
//     }
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await fetch(`${API_BASE_URL}/bloodgroups`, {
//         method: "PUT",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           blood_name: editStock.blood_name,
//           quantity: editStock.quantity,
//         }),
//       });

//       if (!res.ok) {
//         if (res.status === 401) {
//           setError("Authentication failed. Please login again.");
//           setAuthStatus({ isAuthenticated: false, userInfo: {} });
//           return;
//         }
//         const errorText = await res.text();
//         throw new Error(`Failed to update blood stock: ${errorText}`);
//       }

//       const data = await res.json();
//       showConfirmation(
//         "success",
//         "Blood Stock Updated",
//         data.message || `Successfully updated ${editStock.blood_name} to ${editStock.quantity} units.`,
//         () => {
//           fetchBloodStock();
//           setShowEditForm(false);
//           setEditStock({ blood_name: "", quantity: 1 });
//         }
//       );
//     } catch (error) {
//       console.error("Error updating blood stock:", error);
//       setError("Failed to update blood stock. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate status for blood stock
//   const bloodStockWithStatus = bloodStock.map((item) => {
//     let status = "Adequate";
//     if (item.quantity <= 5) status = "Critical";
//     else if (item.quantity <= 10) status = "Low";
//     return { ...item, status };
//   });

//   const totalUnits = bloodStockWithStatus.reduce((sum, item) => sum + item.quantity, 0);

//   const chartData = bloodStockWithStatus.map((item) => ({
//     name: item.blood_name,
//     units: item.quantity,
//   }));

//   // Loading state
//   if (loading && !authStatus.isAuthenticated) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
//         <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-red-100">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-500 mx-auto"></div>
//             <Droplets className="h-6 w-6 text-red-500 absolute top-5 left-1/2 transform -translate-x-1/2" />
//           </div>
//           <h3 className="mt-6 text-xl font-semibold text-gray-800">Loading Blood Stock</h3>
//           <p className="mt-2 text-gray-600">Please wait while we fetch your data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Authentication required state
//   if (!authStatus.isAuthenticated) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
//         <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-red-100 max-w-md">
//           <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
//             <Droplets className="h-10 w-10 text-red-500" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
//           <p className="text-gray-600 mb-4">Please log in to access the blood stock management system.</p>
//           {error && (
//             <div className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-3 mb-4">
//               <div className="flex items-center">
//                 <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
//                 <p className="text-red-800 text-sm">{error}</p>
//               </div>
//             </div>
//           )}
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-colors duration-200 shadow-lg"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6 bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center space-x-3">
//           <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg">
//             <Droplets className="h-8 w-8 text-white" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
//               Blood Stock Management
//             </h1>
//             <p className="text-gray-500 text-sm">Manage and track blood inventory efficiently</p>
//           </div>
//         </div>
//         <button
//           onClick={() => {
//             setShowAddForm(true);
//             setError(null);
//           }}
//           className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-5 py-2 rounded-xl flex items-center hover:from-red-600 hover:to-pink-600 transition-colors duration-200 shadow-md disabled:opacity-50"
//           disabled={loading}
//         >
//           <Plus className="h-5 w-5 mr-2" />
//           Add Blood Stock
//         </button>
//       </div>

//       {/* Success Message */}
//       {success && (
//         <div className="mb-6 bg-green-50 border-l-4 border-green-400 rounded-r-lg p-4 shadow-sm animate-in slide-in-from-top duration-300">
//           <div className="flex items-center">
//             <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
//             <p className="text-green-800 font-medium">{success}</p>
//             <button
//               onClick={() => setSuccess(null)}
//               className="ml-auto text-green-400 hover:text-green-600"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Error Message */}
//       {error && (
//         <div className="mb-6 bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4 shadow-sm animate-in slide-in-from-top duration-300">
//           <div className="flex items-center">
//             <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
//             <p className="text-red-800">{error}</p>
//             <button
//               onClick={() => setError(null)}
//               className="ml-auto text-red-400 hover:text-red-600"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Add Form Modal */}
//       {showAddForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in duration-300">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold text-gray-800">Add Blood Stock</h2>
//               <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
//                 <X className="h-6 w-6" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group *</label>
//                 <select
//                   className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors"
//                   value={newStock.blood_name}
//                   onChange={(e) => setNewStock({ ...newStock, blood_name: e.target.value })}
//                   disabled={loading}
//                 >
//                   {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bg) => (
//                     <option key={bg} value={bg}>
//                       {bg}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Units *</label>
//                 <input
//                   type="number"
//                   min="1"
//                   className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors"
//                   value={newStock.quantity}
//                   onChange={(e) => setNewStock({ ...newStock, quantity: parseInt(e.target.value) || 1 })}
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end space-x-3">
//               <button
//                 className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition-colors"
//                 onClick={() => setShowAddForm(false)}
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-pink-600 transition-colors disabled:opacity-50"
//                 onClick={addBloodStock}
//                 disabled={loading}
//               >
//                 {loading ? "Adding..." : "Add Stock"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Form Modal */}
//       {showEditForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in duration-300">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold text-gray-800">Edit Blood Stock</h2>
//               <button onClick={() => setShowEditForm(false)} className="text-gray-500 hover:text-gray-700">
//                 <X className="h-6 w-6" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-100 cursor-not-allowed"
//                   value={editStock.blood_name}
//                   readOnly
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Units *</label>
//                 <input
//                   type="number"
//                   min="1"
//                   className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
//                   value={editStock.quantity}
//                   onChange={(e) => setEditStock({ ...editStock, quantity: parseInt(e.target.value) || 1 })}
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end space-x-3">
//               <button
//                 className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition-colors"
//                 onClick={() => setShowEditForm(false)}
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-colors disabled:opacity-50"
//                 onClick={updateBloodStock}
//                 disabled={loading}
//               >
//                 {loading ? "Updating..." : "Save Changes"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Stats Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 hover:shadow-md transition-shadow duration-200">
//           <h2 className="text-lg font-semibold text-gray-800 mb-2">Total Blood Stock</h2>
//           <div className="text-4xl font-bold text-red-600">{totalUnits}</div>
//           <p className="text-gray-600 text-sm mt-1">Total units available</p>
//         </div>
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 hover:shadow-md transition-shadow duration-200">
//           <h2 className="text-lg font-semibold text-gray-800 mb-2">Critical Levels</h2>
//           <div className="flex items-center">
//             <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
//             <p className="text-gray-800">
//               {bloodStockWithStatus.filter((item) => item.status === "Critical").length} blood types
//             </p>
//           </div>
//           <p className="text-gray-600 text-sm mt-2">
//             {bloodStockWithStatus
//               .filter((item) => item.status === "Critical")
//               .map((item) => item.blood_name)
//               .join(", ") || "None"}
//           </p>
//         </div>
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 hover:shadow-md transition-shadow duration-200">
//           <h2 className="text-lg font-semibold text-gray-800 mb-2">Low Levels</h2>
//           <div className="flex items-center">
//             <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
//             <p className="text-gray-800">
//               {bloodStockWithStatus.filter((item) => item.status === "Low").length} blood types
//             </p>
//           </div>
//           <p className="text-gray-600 text-sm mt-2">
//             {bloodStockWithStatus
//               .filter((item) => item.status === "Low")
//               .map((item) => item.blood_name)
//               .join(", ") || "None"}
//           </p>
//         </div>
//       </div>

//       {/* Chart & Table Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Chart */}
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Blood Stock Visualization</h2>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="name" stroke="#6b7280" />
//                 <YAxis stroke="#6b7280" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "#fff",
//                     border: "1px solid #e5e7eb",
//                     borderRadius: "8px",
//                     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                   }}
//                 />
//                 <Legend />
//                 <Bar dataKey="units" fill="#f44336" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Blood Stock Inventory</h2>
//           {bloodStockWithStatus.length === 0 && !loading ? (
//             <div className="text-center py-12">
//               <Droplets className="h-16 w-16 text-gray-300 mx-auto" />
//               <h3 className="mt-4 text-lg font-semibold text-gray-700">No Blood Stock Available</h3>
//               <p className="text-gray-500 mt-2">Add blood stock to get started.</p>
//               <button
//                 onClick={() => setShowAddForm(true)}
//                 className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-semibold shadow-lg"
//               >
//                 <Plus className="h-4 w-4 mr-2 inline" />
//                 Add Blood Stock
//               </button>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {bloodStockWithStatus.map((item) => (
//                     <tr key={item.blood_name} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 text-gray-900">{item.blood_name}</td>
//                       <td className="px-6 py-4 text-gray-900">{item.quantity}</td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
//                             item.status === "Adequate"
//                               ? "bg-green-100 text-green-800"
//                               : item.status === "Low"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {item.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <button
//                           className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
//                           onClick={() => {
//                             setEditStock({ blood_name: item.blood_name, quantity: item.quantity });
//                             setShowEditForm(true);
//                             setError(null);
//                           }}
//                           disabled={loading}
//                         >
//                           <Edit2 className="h-4 w-4 mr-1" /> Edit
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Confirmation Modal */}
//       {isConfirmModalOpen && confirmAction && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
//             <div className="text-center">
//               <div className="mb-4">
//                 {confirmAction.type === "success" && (
//                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
//                     <CheckCircle className="h-8 w-8 text-green-600" />
//                   </div>
//                 )}
//                 {confirmAction.type === "warning" && (
//                   <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
//                     <AlertCircle className="h-8 w-8 text-yellow-600" />
//                   </div>
//                 )}
//                 {confirmAction.type === "error" && (
//                   <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
//                     <AlertCircle className="h-8 w-8 text-red-600" />
//                   </div>
//                 )}
//               </div>

//               <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                 {confirmAction.title}
//               </h3>

//               <p className="text-gray-600 mb-6">{confirmAction.message}</p>

//               <div className="flex space-x-3">
//                 <button
//                   onClick={() => {
//                     setIsConfirmModalOpen(false);
//                     setConfirmAction(null);
//                   }}
//                   className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
//                   disabled={loading}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleConfirm}
//                   className={`flex-1 py-3 px-4 rounded-lg transition-colors font-semibold ${
//                     confirmAction.type === "success"
//                       ? "bg-green-600 text-white hover:bg-green-700"
//                       : confirmAction.type === "warning"
//                       ? "bg-yellow-600 text-white hover:bg-yellow-700"
//                       : "bg-red-600 text-white hover:bg-red-700"
//                   }`}
//                   disabled={loading}
//                 >
//                   {loading ? "Processing..." : "Confirm"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BloodStock;






import { useState, useEffect } from "react";
import { 
  Droplets, 
  Plus, 
  AlertCircle, 
  Edit2, 
  X, 
  CheckCircle, 
  RefreshCwIcon,
  AlertTriangleIcon,
  XCircleIcon,
  CheckIcon,
  Activity,
  TrendingUp,
  Package,
  HeartIcon
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Types
interface BloodUnit {
  blood_name: string;
  quantity: number;
}

interface BloodGroupStockPayload {
  blood_name: string;
  quantity: number;
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

const BloodStock = () => {
  const [bloodStock, setBloodStock] = useState<BloodUnit[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    userInfo: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newStock, setNewStock] = useState<BloodGroupStockPayload>({
    blood_name: "O+",
    quantity: 1,
  });
  const [editStock, setEditStock] = useState<BloodGroupStockPayload>({
    blood_name: "",
    quantity: 1,
  });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: string;
    title: string;
    message: string;
    action: () => void;
  } | null>(null);

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
      setAuthStatus({ isAuthenticated: false, userInfo: {} });
      setError("Authentication required. Please login first.");
      return false;
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthStatus({ isAuthenticated: false, userInfo: {} });
      setError("Failed to verify authentication. Please check your connection.");
      return false;
    }
  };

  // Fetch blood stock
  const fetchBloodStock = async () => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/bloodgroups`, {
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
        if (res.status === 404) {
          setError("Blood stock endpoint not found. Please contact the administrator.");
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.status === "success" && Array.isArray(data.data)) {
        setBloodStock(data.data);
      } else {
        console.error("Unexpected data format:", data);
        setBloodStock([]);
        setError("Invalid data format received from server.");
      }
    } catch (error) {
      console.error("Error fetching blood stock:", error);
      setError("Failed to fetch blood stock. Please check your connection or try again later.");
      setBloodStock([]);
    }
  };

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      setLoading(true);
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        await fetchBloodStock();
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

  // Add blood stock
  const addBloodStock = async () => {
    if (newStock.quantity < 1) {
      setError("Quantity must be at least 1 unit.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/bloodgroups`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStock),
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
      showConfirmation(
        "success",
        "Blood Stock Added",
        data.message || `Successfully added ${newStock.quantity} units of ${newStock.blood_name} to the stock.`,
        () => {
          fetchBloodStock();
          setShowAddForm(false);
          setNewStock({ blood_name: "O+", quantity: 1 });
        }
      );
    } catch (error) {
      console.error("Error adding blood stock:", error);
      setError("Failed to add blood stock. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update blood stock
  const updateBloodStock = async () => {
    if (editStock.quantity < 1) {
      setError("Quantity must be at least 1 unit.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/bloodgroups`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blood_name: editStock.blood_name,
          quantity: editStock.quantity,
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Authentication failed. Please login again.");
          setAuthStatus({ isAuthenticated: false, userInfo: {} });
          return;
        }
        const errorText = await res.text();
        throw new Error(`Failed to update blood stock: ${errorText}`);
      }

      const data = await res.json();
      showConfirmation(
        "success",
        "Blood Stock Updated",
        data.message || `Successfully updated ${editStock.blood_name} to ${editStock.quantity} units.`,
        () => {
          fetchBloodStock();
          setShowEditForm(false);
          setEditStock({ blood_name: "", quantity: 1 });
        }
      );
    } catch (error) {
      console.error("Error updating blood stock:", error);
      setError("Failed to update blood stock. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate status for blood stock
  const bloodStockWithStatus = bloodStock.map((item) => {
    let status = "Adequate";
    if (item.quantity <= 5) status = "Critical";
    else if (item.quantity <= 10) status = "Low";
    return { ...item, status };
  });

  const totalUnits = bloodStockWithStatus.reduce((sum, item) => sum + item.quantity, 0);

  const chartData = bloodStockWithStatus.map((item) => ({
    name: item.blood_name,
    units: item.quantity,
  }));

  const stats = {
    total: totalUnits,
    critical: bloodStockWithStatus.filter((item) => item.status === "Critical").length,
    low: bloodStockWithStatus.filter((item) => item.status === "Low").length,
    adequate: bloodStockWithStatus.filter((item) => item.status === "Adequate").length,
  };

  // Loading state
  if (loading && !authStatus.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl border border-red-100">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-500 mx-auto"></div>
            <Droplets className="h-6 w-6 text-red-500 absolute top-5 left-1/2 transform -translate-x-1/2" />
          </div>
          <h3 className="mt-6 text-xl font-semibold text-gray-800">Loading Blood Stock</h3>
          <p className="mt-2 text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  // Authentication required state
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
            Please login to access the blood stock management system.
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
                  Blood Stock Management
                </h1>
                <p className="text-gray-600">Manage and track blood inventory efficiently</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => fetchBloodStock()}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                disabled={loading}
              >
                <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setError(null);
                }}
                className="bg-red-600 text-white px-5 py-2 rounded-lg flex items-center hover:bg-red-700 transition-colors shadow-md disabled:opacity-50"
                disabled={loading}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Stock
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-gray-500 text-sm">Total Units</p>
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
                <p className="text-gray-500 text-sm">Adequate</p>
                <p className="text-2xl font-bold text-gray-800">{stats.adequate}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangleIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-gray-500 text-sm">Low Stock</p>
                <p className="text-2xl font-bold text-gray-800">{stats.low}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircleIcon className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-gray-500 text-sm">Critical</p>
                <p className="text-2xl font-bold text-gray-800">{stats.critical}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart & Table Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Blood Stock Visualization
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="units" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              Blood Stock Inventory
            </h2>
            {bloodStockWithStatus.length === 0 && !loading ? (
              <div className="text-center py-12">
                <Droplets className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No Blood Stock Available</p>
                <p className="text-gray-400 text-sm">Add blood stock to get started</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-200 font-semibold shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2 inline" />
                  Add Blood Stock
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-red-50 to-red-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Blood Group</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Units</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bloodStockWithStatus.map((item, index) => (
                      <tr 
                        key={item.blood_name} 
                        className={`hover:bg-red-25 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                              {item.blood_name}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">{item.blood_name}</div>
                              <div className="text-sm text-gray-500">Blood Type</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-2xl font-bold text-gray-800">{item.quantity}</span>
                          <span className="text-sm text-gray-500 ml-1">units</span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                              item.status === "Adequate"
                                ? "bg-green-100 text-green-800"
                                : item.status === "Low"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status === "Adequate" && <CheckCircle className="h-3 w-3" />}
                            {item.status === "Low" && <AlertTriangleIcon className="h-3 w-3" />}
                            {item.status === "Critical" && <XCircleIcon className="h-3 w-3" />}
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setEditStock({ blood_name: item.blood_name, quantity: item.quantity });
                              setShowEditForm(true);
                              setError(null);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Stock"
                            disabled={loading}
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Add Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Plus className="h-5 w-5 mr-2 text-red-600" />
                  Add Blood Stock
                </h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group *</label>
                  <select
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                    value={newStock.blood_name}
                    onChange={(e) => setNewStock({ ...newStock, blood_name: e.target.value })}
                    disabled={loading}
                  >
                    {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Units *</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    value={newStock.quantity}
                    onChange={(e) => setNewStock({ ...newStock, quantity: parseInt(e.target.value) || 1 })}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={addBloodStock}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <Plus className="h-4 w-4" />
                  {loading ? "Adding..." : "Add Stock"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Edit2 className="h-5 w-5 mr-2 text-blue-600" />
                  Edit Blood Stock
                </h2>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center">
                    <Droplets className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm font-semibold text-blue-800">Blood Group: {editStock.blood_name}</p>
                      <p className="text-xs text-blue-600">Updating stock levels</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group</label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-100 cursor-not-allowed"
                    value={editStock.blood_name}
                    readOnly
                  />
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Units *</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={editStock.quantity}
                    onChange={(e) => setEditStock({ ...editStock, quantity: parseInt(e.target.value) || 1 })}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={updateBloodStock}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <CheckIcon className="h-4 w-4" />
                  {loading ? "Updating..." : "Save Changes"}
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

                <p className="text-gray-600 mb-6">{confirmAction.message}</p>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setIsConfirmModalOpen(false);
                      setConfirmAction(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    disabled={loading}
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

export default BloodStock;