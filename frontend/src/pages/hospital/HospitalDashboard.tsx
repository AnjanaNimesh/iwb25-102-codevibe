// import { useState, useEffect } from 'react'
// import {
//   UsersIcon,
//   DropletIcon,
//   HeartIcon,
//   ActivityIcon,
// } from 'lucide-react'
// import StatsCard from './components/StatsCard'
// import BloodTypeCard from './components/BloodTypeCard'
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
// } from 'recharts'

// // Types
// interface BloodUnit {
//   blood_name: string
//   quantity: number
// }

// interface Hospital {
//   hospital_name: string
// }

// // Constants
// const API_BASE_URL = 'http://localhost:9090/hospital'
// const HOSPITAL_ID = 3;

// const HospitalDashboard = () => {
//   const [bloodStock, setBloodStock] = useState<BloodUnit[]>([])
//   const [hospitalName, setHospitalName] = useState<string>('City General Hospital')
//   const [totalDonors, setTotalDonors] = useState<number>(0)
//   const [totalDonations, setTotalDonations] = useState<number>(0)
//   const [patientRequests, setPatientRequests] = useState<number>(0)
//   const [loading, setLoading] = useState<boolean>(true)
//   const [lastUpdated, setLastUpdated] = useState<string>('')

//   // Fetch hospital details
//   const fetchHospital = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/hospital?hospital_id=${HOSPITAL_ID}`)
//       if (!res.ok) throw new Error('Failed to fetch hospital details')
//       const data: Hospital = await res.json()
//       setHospitalName(data.hospital_name)
//     } catch (error) {
//       console.error('Error fetching hospital details:', error)
//       setHospitalName('City General Hospital') // Fallback
//     }
//   }

//   // Fetch total donors
//   const fetchTotalDonors = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/totalDonors?hospital_id=${HOSPITAL_ID}`)
//       if (!res.ok) throw new Error('Failed to fetch total donors')
//       const data = await res.json()
//       setTotalDonors(data.total_donors)
//     } catch (error) {
//       console.error('Error fetching total donors:', error)
//       setTotalDonors(0)
//     }
//   }

//   // Fetch total donations
//   const fetchTotalDonations = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/totalDonations?hospital_id=${HOSPITAL_ID}`)
//       if (!res.ok) throw new Error('Failed to fetch total donations')
//       const data = await res.json()
//       setTotalDonations(data.total_donations)
//     } catch (error) {
//       console.error('Error fetching total donations:', error)
//       setTotalDonations(0)
//     }
//   }

//   // Fetch patient requests (blood requests)
//   const fetchPatientRequests = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/bloodrequests?hospital_id=${HOSPITAL_ID}`)
//       if (!res.ok) throw new Error('Failed to fetch patient requests')
//       const data = await res.json()
//       setPatientRequests(data.length)
//     } catch (error) {
//       console.error('Error fetching patient requests:', error)
//       setPatientRequests(0)
//     }
//   }

//   // Fetch blood stock data
//   const fetchBloodStock = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/bloodgroups?hospital_id=${HOSPITAL_ID}`)
//       if (!res.ok) throw new Error('Failed to fetch blood stock')
//       const data: BloodUnit[] = await res.json()
//       setBloodStock(data)
//       setLastUpdated(new Date().toLocaleString())
//     } catch (error) {
//       console.error('Error fetching blood stock:', error)
//       setBloodStock([])
//     }
//   }

//   // Fetch all data on mount
//   useEffect(() => {
//     const fetchAllData = async () => {
//       setLoading(true)
//       await Promise.all([
//         fetchHospital(),
//         fetchTotalDonors(),
//         fetchTotalDonations(),
//         fetchPatientRequests(),
//         fetchBloodStock(),
//       ])
//       setLoading(false)
//     }

//     fetchAllData()
//     const interval = setInterval(fetchAllData, 5 * 60 * 1000) // Refresh every 5 minutes
//     return () => clearInterval(interval)
//   }, [])

//   // Process data for charts and stats
//   const totalUnits = bloodStock.reduce((sum, item) => sum + item.quantity, 0)
//   const criticalStock = bloodStock.filter(item => item.quantity <= 5).length
//   const lowStock = bloodStock.filter(item => item.quantity <= 10).length

//   // Transform data for pie chart with percentages
//   const chartData = bloodStock.map((item) => {
//     const percentage = totalUnits > 0 ? Math.round((item.quantity / totalUnits) * 100) : 0
//     return {
//       blood_group: item.blood_name,
//       units: item.quantity,
//       percentage,
//     }
//   })

//   const COLORS = [
//     '#f44336',
//     '#ff7043',
//     '#42a5f5',
//     '#64b5f6',
//     '#4caf50',
//     '#81c784',
//     '#ffca28',
//     '#ffa726',
//   ]

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-gray-500">Loading dashboard...</div>
//       </div>
//     )
//   }

//   return (
//     <div>
//       <div className="mb-6">
//         <div className="flex items-center">
//           <HeartIcon className="h-8 w-8 text-red-500 mr-3" />
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">
//               {hospitalName} Blood Bank
//             </h1>
//             <p className="text-gray-600">Blood Bank Management Dashboard</p>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards - Updated with real data */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <StatsCard
//           title="Total Donors"
//           value={totalDonors.toString()}
//           description="Active registered donors"
//           icon={<UsersIcon className="h-5 w-5 text-blue-500" />}
//         />
//         <StatsCard
//           title="Total Donations"
//           value={totalDonations.toString()}
//           description="Completed donations"
//           icon={<DropletIcon className="h-5 w-5 text-red-500" />}
//         />
//         <StatsCard
//           title="Patient Requests"
//           value={patientRequests.toString()}
//           description="Active blood requests"
//           icon={<HeartIcon className="h-5 w-5 text-red-500" />}
//         />
//         <StatsCard
//           title="Blood Units"
//           value={totalUnits.toString()}
//           description="Total units in stock"
//           icon={<ActivityIcon className="h-5 w-5 text-green-500" />}
//         />
//       </div>

//       {/* Blood Stock Status */}
//       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center">
//             <DropletIcon className="h-5 w-5 text-red-500 mr-2" />
//             <h2 className="text-lg font-semibold">Blood Stock Status</h2>
//           </div>
//           <button 
//             className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
//             onClick={fetchBloodStock}
//           >
//             Refresh Data
//           </button>
//         </div>
        
//         <div className="flex items-center space-x-6 mb-4">
//           <p className="text-gray-600">Current blood inventory by type</p>
//           {criticalStock > 0 && (
//             <div className="text-red-600 text-sm font-medium">
//               ⚠️ {criticalStock} blood type{criticalStock > 1 ? 's' : ''} at critical levels
//             </div>
//           )}
//           {lowStock > criticalStock && (
//             <div className="text-yellow-600 text-sm font-medium">
//               ⚠️ {lowStock - criticalStock} blood type{lowStock - criticalStock > 1 ? 's' : ''} at low levels
//             </div>
//           )}
//         </div>

//         {bloodStock.length > 0 ? (
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
//             {chartData.map((item) => (
//               <BloodTypeCard
//                 key={item.blood_group}
//                 bloodType={item.blood_group}
//                 units={item.units}
//                 isLow={item.units < 10}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-8 text-gray-500">
//             No blood stock data available. Please check your API connection.
//           </div>
//         )}
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold mb-4">Stock Levels</h2>
//           {chartData.length > 0 ? (
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={chartData}
//                   margin={{
//                     top: 5,
//                     right: 5,
//                     left: 5,
//                     bottom: 5,
//                   }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="blood_group" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="units" fill="#f44336" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           ) : (
//             <div className="h-64 flex items-center justify-center text-gray-500">
//               No data available for chart
//             </div>
//           )}
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold mb-4">Distribution</h2>
//           {chartData.length > 0 && totalUnits > 0 ? (
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={chartData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     dataKey="units"
//                     nameKey="blood_group"
//                     label={({ blood_group, percentage }) =>
//                       `${blood_group} ${percentage}%`
//                     }
//                   >
//                     {chartData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           ) : (
//             <div className="h-64 flex items-center justify-center text-gray-500">
//               No data available for chart
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default HospitalDashboard;







// import { useState, useEffect } from 'react'
// import {
//   UsersIcon,
//   DropletIcon,
//   HeartIcon,
//   ActivityIcon,
// } from 'lucide-react'
// import StatsCard from './components/StatsCard'
// import BloodTypeCard from './components/BloodTypeCard'
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
// } from 'recharts'

// // Types
// interface BloodUnit {
//   blood_name: string
//   quantity: number
// }

// interface Hospital {
//   hospital_name: string
// }

// interface UserProfile {
//   user_id: string
//   email: string
//   full_name: string
//   hospital_id: number
//   role: string
//   status: string
// }

// // Constants
// const API_BASE_URL = 'http://localhost:9090/hospital'

// const HospitalDashboard = () => {
//   const [bloodStock, setBloodStock] = useState<BloodUnit[]>([])
//   const [hospitalName, setHospitalName] = useState<string>('Loading...')
//   const [totalDonors, setTotalDonors] = useState<number>(0)
//   const [totalDonations, setTotalDonations] = useState<number>(0)
//   const [patientRequests, setPatientRequests] = useState<number>(0)
//   const [loading, setLoading] = useState<boolean>(true)
//   const [lastUpdated, setLastUpdated] = useState<string>('')
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
//   const [authError, setAuthError] = useState<string | null>(null)

//   // API request helper with credentials
//   const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       ...options,
//       credentials: 'include', // Include cookies for JWT
//       headers: {
//         'Content-Type': 'application/json',
//         ...options.headers,
//       },
//     })
    
//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
//       throw new Error(errorData.message || `HTTP ${response.status}`)
//     }
    
//     return response.json()
//   }

//   // Fetch user profile to get hospital information
//   const fetchUserProfile = async () => {
//     try {
//       const data = await apiRequest('/profile')
//       if (data.status === 'success') {
//         setUserProfile(data.data)
//         setAuthError(null)
//         return data.data
//       } else {
//         throw new Error(data.message || 'Failed to fetch user profile')
//       }
//     } catch (error) {
//       console.error('Error fetching user profile:', error)
//       setAuthError(error instanceof Error ? error.message : 'Authentication failed')
//       setUserProfile(null)
//       return null
//     }
//   }

//   // Fetch hospital details
//   const fetchHospital = async () => {
//     try {
//       const data = await apiRequest('/hospital')
//       if (data.status === 'success') {
//         setHospitalName(data.hospital_name)
//       } else {
//         throw new Error(data.message || 'Failed to fetch hospital details')
//       }
//     } catch (error) {
//       console.error('Error fetching hospital details:', error)
//       setHospitalName('Hospital Dashboard') // Fallback
//     }
//   }

//   // Fetch total donors
//   const fetchTotalDonors = async () => {
//     try {
//       const data = await apiRequest('/totalDonors')
//       if (data.status === 'success') {
//         setTotalDonors(data.total_donors)
//       }
//     } catch (error) {
//       console.error('Error fetching total donors:', error)
//       setTotalDonors(0)
//     }
//   }

//   // Fetch total donations
//   const fetchTotalDonations = async () => {
//     try {
//       const data = await apiRequest('/totalDonations')
//       if (data.status === 'success') {
//         setTotalDonations(data.total_donations)
//       }
//     } catch (error) {
//       console.error('Error fetching total donations:', error)
//       setTotalDonations(0)
//     }
//   }

//   // Fetch patient requests (blood requests)
//   const fetchPatientRequests = async () => {
//     try {
//       const data = await apiRequest('/bloodrequests')
//       if (data.status === 'success') {
//         setPatientRequests(data.data.length)
//       }
//     } catch (error) {
//       console.error('Error fetching patient requests:', error)
//       setPatientRequests(0)
//     }
//   }

//   // Fetch blood stock data
//   const fetchBloodStock = async () => {
//     try {
//       const data = await apiRequest('/bloodgroups')
//       if (data.status === 'success') {
//         setBloodStock(data.data)
//         setLastUpdated(new Date().toLocaleString())
//       }
//     } catch (error) {
//       console.error('Error fetching blood stock:', error)
//       setBloodStock([])
//     }
//   }

//   // Fetch all data
//   const fetchAllData = async () => {
//     setLoading(true)
//     setAuthError(null)
    
//     try {
//       // First fetch user profile to ensure authentication
//       const profile = await fetchUserProfile()
      
//       if (profile) {
//         // If authenticated, fetch all other data in parallel
//         await Promise.all([
//           fetchHospital(),
//           fetchTotalDonors(),
//           fetchTotalDonations(),
//           fetchPatientRequests(),
//           fetchBloodStock(),
//         ])
//       }
//     } catch (error) {
//       console.error('Error in fetchAllData:', error)
//       setAuthError(error instanceof Error ? error.message : 'Failed to load data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Initialize data on mount
//   useEffect(() => {
//     fetchAllData()
//   }, []) // Only run once on mount

//   // Set up periodic refresh when user is authenticated
//   useEffect(() => {
//     if (userProfile && !authError) {
//       const interval = setInterval(() => {
//         // Only fetch data that changes frequently, not user profile
//         Promise.all([
//           fetchHospital(),
//           fetchTotalDonors(),
//           fetchTotalDonations(),
//           fetchPatientRequests(),
//           fetchBloodStock(),
//         ])
//       }, 5 * 60 * 1000) // 5 minutes
      
//       return () => clearInterval(interval)
//     }
//   }, [userProfile, authError])

//   // Manual refresh function
//   const handleRefresh = async () => {
//     setLoading(true)
//     try {
//       await fetchBloodStock()
//     } catch (error) {
//       console.error('Error refreshing blood stock:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Process data for charts and stats
//   const totalUnits = bloodStock.reduce((sum, item) => sum + item.quantity, 0)
//   const criticalStock = bloodStock.filter(item => item.quantity <= 5).length
//   const lowStock = bloodStock.filter(item => item.quantity <= 10).length

//   // Transform data for pie chart with percentages
//   const chartData = bloodStock.map((item) => {
//     const percentage = totalUnits > 0 ? Math.round((item.quantity / totalUnits) * 100) : 0
//     return {
//       blood_group: item.blood_name,
//       units: item.quantity,
//       percentage,
//     }
//   })

//   const COLORS = [
//     '#f44336',
//     '#ff7043',
//     '#42a5f5',
//     '#64b5f6',
//     '#4caf50',
//     '#81c784',
//     '#ffca28',
//     '#ffa726',
//   ]

//   // Show authentication error
//   if (authError && !loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="text-red-500 text-xl mb-4">Authentication Error</div>
//           <div className="text-gray-600 mb-4">{authError}</div>
//           <button 
//             onClick={() => {
//               setAuthError(null)
//               fetchAllData()
//             }}
//             className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
//             disabled={loading}
//           >
//             {loading ? 'Loading...' : 'Retry'}
//           </button>
//         </div>
//       </div>
//     )
//   }

//   // Show loading state
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-gray-500">Loading dashboard...</div>
//       </div>
//     )
//   }

//   return (
//     <div>
//       <div className="mb-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <HeartIcon className="h-8 w-8 text-red-500 mr-3" />
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">
//                 {hospitalName} Blood Bank
//               </h1>
//               <p className="text-gray-600">Blood Bank Management Dashboard</p>
//               {userProfile && (
//                 <p className="text-sm text-gray-500">
//                   Logged in as: {userProfile.email}
//                 </p>
//               )}
//             </div>
//           </div>
//           <div className="text-right">
//             <div className="text-sm text-gray-500">
//               Last updated: {lastUpdated || 'Never'}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards - Updated with real data */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <StatsCard
//           title="Total Donors"
//           value={totalDonors.toString()}
//           description="Active registered donors"
//           icon={<UsersIcon className="h-5 w-5 text-blue-500" />}
//         />
//         <StatsCard
//           title="Total Donations"
//           value={totalDonations.toString()}
//           description="Completed donations"
//           icon={<DropletIcon className="h-5 w-5 text-red-500" />}
//         />
//         <StatsCard
//           title="Patient Requests"
//           value={patientRequests.toString()}
//           description="Active blood requests"
//           icon={<HeartIcon className="h-5 w-5 text-red-500" />}
//         />
//         <StatsCard
//           title="Blood Units"
//           value={totalUnits.toString()}
//           description="Total units in stock"
//           icon={<ActivityIcon className="h-5 w-5 text-green-500" />}
//         />
//       </div>

//       {/* Blood Stock Status */}
//       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center">
//             <DropletIcon className="h-5 w-5 text-red-500 mr-2" />
//             <h2 className="text-lg font-semibold">Blood Stock Status</h2>
//           </div>
//           <button 
//             className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
//             onClick={handleRefresh}
//             disabled={loading}
//           >
//             {loading ? 'Loading...' : 'Refresh Data'}
//           </button>
//         </div>
        
//         <div className="flex items-center space-x-6 mb-4">
//           <p className="text-gray-600">Current blood inventory by type</p>
//           {criticalStock > 0 && (
//             <div className="text-red-600 text-sm font-medium">
//               ⚠️ {criticalStock} blood type{criticalStock > 1 ? 's' : ''} at critical levels
//             </div>
//           )}
//           {lowStock > criticalStock && (
//             <div className="text-yellow-600 text-sm font-medium">
//               ⚠️ {lowStock - criticalStock} blood type{lowStock - criticalStock > 1 ? 's' : ''} at low levels
//             </div>
//           )}
//         </div>

//         {bloodStock.length > 0 ? (
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
//             {chartData.map((item) => (
//               <BloodTypeCard
//                 key={item.blood_group}
//                 bloodType={item.blood_group}
//                 units={item.units}
//                 isLow={item.units < 10}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-8 text-gray-500">
//             {authError ? 
//               'Please check your authentication status.' : 
//               'No blood stock data available. Please check your API connection.'
//             }
//           </div>
//         )}
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold mb-4">Stock Levels</h2>
//           {chartData.length > 0 ? (
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={chartData}
//                   margin={{
//                     top: 5,
//                     right: 5,
//                     left: 5,
//                     bottom: 5,
//                   }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="blood_group" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="units" fill="#f44336" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           ) : (
//             <div className="h-64 flex items-center justify-center text-gray-500">
//               No data available for chart
//             </div>
//           )}
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold mb-4">Distribution</h2>
//           {chartData.length > 0 && totalUnits > 0 ? (
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={chartData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     dataKey="units"
//                     nameKey="blood_group"
//                     label={({ blood_group, percentage }) =>
//                       `${blood_group} ${percentage}%`
//                     }
//                   >
//                     {chartData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           ) : (
//             <div className="h-64 flex items-center justify-center text-gray-500">
//               No data available for chart
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default HospitalDashboard;


import { useState, useEffect } from 'react'
import {
  UsersIcon,
  DropletIcon,
  HeartIcon,
  ActivityIcon,
} from 'lucide-react'
import StatsCard from './components/StatsCard'
import BloodTypeCard from './components/BloodTypeCard'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts'

// Types
interface BloodUnit {
  blood_name: string
  quantity: number
}

interface Hospital {
  hospital_name: string
}

interface UserProfile {
  user_id: string
  email: string
  full_name: string
  hospital_id: number
  role: string
  status: string
}

// Constants
const API_BASE_URL = 'http://localhost:9090/hospital'

const HospitalDashboard = () => {
  const [bloodStock, setBloodStock] = useState<BloodUnit[]>([])
  const [hospitalName, setHospitalName] = useState<string>('Loading...')
  const [totalDonors, setTotalDonors] = useState<number>(0)
  const [totalDonations, setTotalDonations] = useState<number>(0)
  const [patientRequests, setPatientRequests] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  // API request helper with credentials
  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include', // Include cookies for JWT
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }
    
    return response.json()
  }

  // Fetch user profile to get hospital information
  const fetchUserProfile = async () => {
    try {
      const data = await apiRequest('/profile')
      if (data.status === 'success') {
        setUserProfile(data.data)
        setAuthError(null)
        return data.data
      } else {
        throw new Error(data.message || 'Failed to fetch user profile')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setAuthError(error instanceof Error ? error.message : 'Authentication failed')
      setUserProfile(null)
      return null
    }
  }

  // Fetch hospital details
  const fetchHospital = async () => {
    try {
      const data = await apiRequest('/hospital')
      if (data.status === 'success') {
        setHospitalName(data.hospital_name)
      } else {
        throw new Error(data.message || 'Failed to fetch hospital details')
      }
    } catch (error) {
      console.error('Error fetching hospital details:', error)
      setHospitalName('Hospital Dashboard') // Fallback
    }
  }

  // Fetch total donors
  const fetchTotalDonors = async () => {
    try {
      const data = await apiRequest('/totalDonors')
      if (data.status === 'success') {
        setTotalDonors(data.total_donors)
      }
    } catch (error) {
      console.error('Error fetching total donors:', error)
      setTotalDonors(0)
    }
  }

  // Fetch total donations
  const fetchTotalDonations = async () => {
    try {
      const data = await apiRequest('/totalDonations')
      if (data.status === 'success') {
        setTotalDonations(data.total_donations)
      }
    } catch (error) {
      console.error('Error fetching total donations:', error)
      setTotalDonations(0)
    }
  }

  // Fetch patient requests (blood requests)
  const fetchPatientRequests = async () => {
    try {
      const data = await apiRequest('/bloodrequests')
      if (data.status === 'success') {
        setPatientRequests(data.data.length)
      }
    } catch (error) {
      console.error('Error fetching patient requests:', error)
      setPatientRequests(0)
    }
  }

  // Fetch blood stock data
  const fetchBloodStock = async () => {
    try {
      const data = await apiRequest('/bloodgroups')
      if (data.status === 'success') {
        setBloodStock(data.data)
        setLastUpdated(new Date().toLocaleString())
      }
    } catch (error) {
      console.error('Error fetching blood stock:', error)
      setBloodStock([])
    }
  }

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true)
    setAuthError(null)
    
    try {
      // First fetch user profile to ensure authentication
      const profile = await fetchUserProfile()
      
      if (profile) {
        // If authenticated, fetch all other data in parallel
        await Promise.all([
          fetchHospital(),
          fetchTotalDonors(),
          fetchTotalDonations(),
          fetchPatientRequests(),
          fetchBloodStock(),
        ])
      }
    } catch (error) {
      console.error('Error in fetchAllData:', error)
      setAuthError(error instanceof Error ? error.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // Initialize data on mount
  useEffect(() => {
    fetchAllData()
  }, []) // Only run once on mount

  // Set up periodic refresh when user is authenticated
  useEffect(() => {
    if (userProfile && !authError) {
      const interval = setInterval(() => {
        // Only fetch data that changes frequently, not user profile
        Promise.all([
          fetchHospital(),
          fetchTotalDonors(),
          fetchTotalDonations(),
          fetchPatientRequests(),
          fetchBloodStock(),
        ])
      }, 5 * 60 * 1000) // 5 minutes
      
      return () => clearInterval(interval)
    }
  }, [userProfile, authError])

  // Manual refresh function
  const handleRefresh = async () => {
    setLoading(true)
    try {
      await fetchBloodStock()
    } catch (error) {
      console.error('Error refreshing blood stock:', error)
    } finally {
      setLoading(false)
    }
  }

  // Process data for charts and stats
  const totalUnits = bloodStock.reduce((sum, item) => sum + item.quantity, 0)
  const criticalStock = bloodStock.filter(item => item.quantity <= 5).length
  const lowStock = bloodStock.filter(item => item.quantity <= 10).length

  // Transform data for pie chart with percentages
  const chartData = bloodStock.map((item) => {
    const percentage = totalUnits > 0 ? Math.round((item.quantity / totalUnits) * 100) : 0
    return {
      blood_group: item.blood_name,
      units: item.quantity,
      percentage,
    }
  })

  const COLORS = [
    '#f44336',
    '#ff7043',
    '#42a5f5',
    '#64b5f6',
    '#4caf50',
    '#81c784',
    '#ffca28',
    '#ffa726',
  ]

  // Show authentication error
  if (authError && !loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Authentication Error</div>
          <div className="text-gray-600 mb-4">{authError}</div>
          <button 
            onClick={() => {
              setAuthError(null)
              fetchAllData()
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Retry'}
          </button>
        </div>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <HeartIcon className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {hospitalName} Blood Bank
              </h1>
              <p className="text-gray-600">Blood Bank Management Dashboard</p>
              {userProfile && (
                <p className="text-sm text-gray-500">
                  Logged in as: {userProfile.email}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated || 'Never'}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Updated with real data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Donors"
          value={totalDonors.toString()}
          description="Active registered donors"
          icon={<UsersIcon className="h-5 w-5 text-blue-500" />}
        />
        <StatsCard
          title="Total Donations"
          value={totalDonations.toString()}
          description="Completed donations"
          icon={<DropletIcon className="h-5 w-5 text-red-500" />}
        />
        <StatsCard
          title="Patient Requests"
          value={patientRequests.toString()}
          description="Active blood requests"
          icon={<HeartIcon className="h-5 w-5 text-red-500" />}
        />
        <StatsCard
          title="Blood Units"
          value={totalUnits.toString()}
          description="Total units in stock"
          icon={<ActivityIcon className="h-5 w-5 text-green-500" />}
        />
      </div>

      {/* Blood Stock Status */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <DropletIcon className="h-5 w-5 text-red-500 mr-2" />
            <h2 className="text-lg font-semibold">Blood Stock Status</h2>
          </div>
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>
        
        <div className="flex items-center space-x-6 mb-4">
          <p className="text-gray-600">Current blood inventory by type</p>
          {criticalStock > 0 && (
            <div className="text-red-600 text-sm font-medium">
              ⚠️ {criticalStock} blood type{criticalStock > 1 ? 's' : ''} at critical levels
            </div>
          )}
          {lowStock > criticalStock && (
            <div className="text-yellow-600 text-sm font-medium">
              ⚠️ {lowStock - criticalStock} blood type{lowStock - criticalStock > 1 ? 's' : ''} at low levels
            </div>
          )}
        </div>

        {bloodStock.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {chartData.map((item) => (
              <BloodTypeCard
                key={item.blood_group}
                bloodType={item.blood_group}
                units={item.units}
                isLow={item.units < 10}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {authError ? 
              'Please check your authentication status.' : 
              'No blood stock data available. Please check your API connection.'
            }
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Stock Levels</h2>
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 5,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="blood_group" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="units" fill="#f44336" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available for chart
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Distribution</h2>
          {chartData.length > 0 && totalUnits > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="units"
                    nameKey="blood_group"
                    label={({ blood_group, percentage }) =>
                      `${blood_group} ${percentage}%`
                    }
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available for chart
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HospitalDashboard;