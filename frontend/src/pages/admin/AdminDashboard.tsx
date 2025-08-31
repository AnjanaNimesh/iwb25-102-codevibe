import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Droplet, 
  ClipboardList, 
  Activity,
  UserCheck,
  UserX,
  MapPin,
  TrendingUp,
  RefreshCw,
  Heart,
  AlertCircle,
  Building,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalDonors: 0,
    totalHospitals: 0,
    totalDonations: 0,
    totalRequests: 0,
    activeDonors: 0,
    deactiveDonors: 0,
    activeHospitals: 0,
    deactiveHospitals: 0
  });

  const [bloodStock, setBloodStock] = useState([]);
  const [districtDonorData, setDistrictDonorData] = useState([]);
  const [districtHospitalData, setDistrictHospitalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Base API URL 
  const API_BASE = 'http://localhost:9092/dashboard/admin'; 

  // Enhanced color schemes
  const bloodTypeColors = [
    '#FF4757', // Red
    '#FF6B9D', // Pink
    '#FF9F43', // Orange  
    '#10AC84', // Teal
    '#5F27CD', // Purple
    '#00D2D3', // Cyan
    '#FF3838', // Bright Red
    '#FF6348'  // Coral
  ];

  // Different color schemes for donor and hospital status
  const donorStatusColors = {
    active: '#00D4AA',   // Emerald green
    inactive: '#FF6B6B'  // Coral red
  };

  const hospitalStatusColors = {
    active: '#4A90E2',   // Sky blue
    inactive: '#F39C12'  // Orange
  };

  // District colors for variety
  const districtColors = [
    '#6C5CE7', '#74B9FF', '#00CEC9', '#55A3FF', 
    '#FF7675', '#FDCB6E', '#A29BFE', '#81ECEC'
  ];

  // Utility function to get token from cookies 
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

  // Utility function to create authenticated headers
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


  // API Integration Functions
  const fetchDataWithAuth = async (url: string, fallback: any) => {
    try {
      const response = await fetch(url, {
        headers: getAuthHeaders(),
        credentials: 'include', // Ensures cookies are sent
      });
      if (!response.ok) throw new Error(`Failed to fetch data from ${url}. Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
      return fallback; // Return fallback data on error
    }
  };

  const fetchDonorCount = () => fetchDataWithAuth(`${API_BASE}/donorCount`, { totalDonors: 1245 });
  const fetchHospitalCount = () => fetchDataWithAuth(`${API_BASE}/hospitalCount`, { totalHospitals: 87 });
  const fetchDonationCount = () => fetchDataWithAuth(`${API_BASE}/donationCount`, { totalDonations: 2340 });
  const fetchRequestCount = () => fetchDataWithAuth(`${API_BASE}/requestCount`, { totalRequests: 156 });
  const fetchActiveDonorCount = () => fetchDataWithAuth(`${API_BASE}/activeDonorCount`, { totalActiveDonors: 1180 });
  const fetchDeactiveDonorCount = () => fetchDataWithAuth(`${API_BASE}/deactiveDonorCount`, { totalDeactiveDonors: 65 });
  const fetchActiveHospitalCount = () => fetchDataWithAuth(`${API_BASE}/activehospitalCount`, { totalActiveHospitals: 82 });
  const fetchDeactiveHospitalCount = () => fetchDataWithAuth(`${API_BASE}/deactivehospitalCount`, { totalActiveHospitals: 5 }); 

  const fetchBloodStock = () => fetchDataWithAuth(`${API_BASE}/totalBloodStock`, [
    { blood_name: 'A+', quantity: 45 }, { blood_name: 'A-', quantity: 12 },
    { blood_name: 'B+', quantity: 38 }, { blood_name: 'B-', quantity: 8 },
    { blood_name: 'AB+', quantity: 15 }, { blood_name: 'AB-', quantity: 5 },
    { blood_name: 'O+', quantity: 67 }, { blood_name: 'O-', quantity: 23 }
  ]);

  const fetchDistrictDonorCount = (districtId: number) => fetchDataWithAuth(`${API_BASE}/donorCount/${districtId}`, null);
  const fetchDistrictHospitalCount = (districtId: number) => fetchDataWithAuth(`${API_BASE}/hopitalCount/${districtId}`, null);


  // Main data fetching function
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch main counts in parallel
      const [
        donorCountRes,
        hospitalCountRes, 
        donationCountRes,
        requestCountRes,
        activeDonorRes,
        deactiveDonorRes,
        activeHospitalRes,
        deactiveHospitalRes,
        bloodStockRes
      ] = await Promise.all([
        fetchDonorCount(),
        fetchHospitalCount(),
        fetchDonationCount(),
        fetchRequestCount(),
        fetchActiveDonorCount(),
        fetchDeactiveDonorCount(),
        fetchActiveHospitalCount(),
        fetchDeactiveHospitalCount(),
        fetchBloodStock()
      ]);

      // Update main dashboard data
      setDashboardData({
        totalDonors: donorCountRes.totalDonors || 0,
        totalHospitals: hospitalCountRes.totalHospitals || 0,
        totalDonations: donationCountRes.totalDonations || 0,
        totalRequests: requestCountRes.totalRequests || 0,
        activeDonors: activeDonorRes.totalActiveDonors || 0,
        deactiveDonors: deactiveDonorRes.totalDeactiveDonors || 0,
        activeHospitals: activeHospitalRes.totalActiveHospitals || 0,
        deactiveHospitals: deactiveHospitalRes.totalDeactiveHospitals || 0 
      });

      // Process blood stock data with percentages
      if (Array.isArray(bloodStockRes) && bloodStockRes.length > 0) {
        const totalBloodUnits = bloodStockRes.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const bloodStockWithPercentage = bloodStockRes.map(item => ({
          ...item,
          percentage: totalBloodUnits > 0 ? ((item.quantity / totalBloodUnits) * 100).toFixed(1) : '0'
        }));
        setBloodStock(bloodStockWithPercentage);
        console.log('Blood Stock Data:', bloodStockWithPercentage);
      } else {
        // Set fallback data if API fails or returns empty
        console.log('Using fallback blood stock data');
        const fallbackBloodStock = [
          { blood_name: 'A+', quantity: 45 },
          { blood_name: 'A-', quantity: 12 },
          { blood_name: 'B+', quantity: 38 },
          { blood_name: 'B-', quantity: 8 },
          { blood_name: 'AB+', quantity: 15 },
          { blood_name: 'AB-', quantity: 5 },
          { blood_name: 'O+', quantity: 67 },
          { blood_name: 'O-', quantity: 23 }
        ];
        const totalFallback = fallbackBloodStock.reduce((sum, item) => sum + item.quantity, 0);
        const fallbackWithPercentage = fallbackBloodStock.map(item => ({
          ...item,
          percentage: ((item.quantity / totalFallback) * 100).toFixed(1)
        }));
        setBloodStock(fallbackWithPercentage);
      }

      // Fetch district data for all Sri Lankan districts (assuming IDs 1-25)
      const districtIds = Array.from({length: 25}, (_, i) => i + 1);
      
      // Fetch district donor data
      const districtDonorPromises = districtIds.map(id => fetchDistrictDonorCount(id));
      const donorResults = await Promise.allSettled(districtDonorPromises);
      
      const validDonorData = donorResults
        .filter(result => result.status === 'fulfilled' && result.value !== null)
        .map(result => result.value)
        .filter(data => data && data.totalDonors > 0); // Only show districts with donors
      
      setDistrictDonorData(validDonorData);

      // Fetch district hospital data
      const districtHospitalPromises = districtIds.map(id => fetchDistrictHospitalCount(id));
      const hospitalResults = await Promise.allSettled(districtHospitalPromises);
      
      const validHospitalData = hospitalResults
        .filter(result => result.status === 'fulfilled' && result.value !== null)
        .map(result => result.value)
        .filter(data => data && data.totalHospitals > 0); // Only show districts with hospitals
      
      setDistrictHospitalData(validHospitalData);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculate status data for charts
  const donorStatusData = [
    { 
      name: 'Active', 
      value: dashboardData.activeDonors, 
      color: donorStatusColors.active,
      percentage: dashboardData.totalDonors > 0 ? ((dashboardData.activeDonors / dashboardData.totalDonors) * 100).toFixed(1) : '0'
    },
    { 
      name: 'Inactive', 
      value: dashboardData.deactiveDonors, 
      color: donorStatusColors.inactive,
      percentage: dashboardData.totalDonors > 0 ? ((dashboardData.deactiveDonors / dashboardData.totalDonors) * 100).toFixed(1) : '0'
    }
  ];

  const hospitalStatusData = [
    { 
      name: 'Active', 
      value: dashboardData.activeHospitals, 
      color: hospitalStatusColors.active,
      percentage: dashboardData.totalHospitals > 0 ? ((dashboardData.activeHospitals / dashboardData.totalHospitals) * 100).toFixed(1) : '0'
    },
    { 
      name: 'Inactive', 
      value: dashboardData.deactiveHospitals, 
      color: hospitalStatusColors.inactive,
      percentage: dashboardData.totalHospitals > 0 ? ((dashboardData.deactiveHospitals / dashboardData.totalHospitals) * 100).toFixed(1) : '0'
    }
  ];

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 transform hover:-translate-y-1" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value?.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-full transform transition-transform hover:scale-110" style={{ backgroundColor: color + '20' }}>
          <Icon className="w-8 h-8" style={{ color }} />
        </div>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-1">{label}</p>
          <p className="text-sm" style={{ color: payload[0].color }}>
            {`${payload[0].name}: ${payload[0].value?.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const BloodStockTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-1">{data.blood_name}</p>
          <p className="text-sm text-gray-600">Units: {data.quantity}</p>
          <p className="text-sm font-medium" style={{ color: payload[0].color }}>
            Percentage: {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  const StatusTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-1">{data.name}</p>
          <p className="text-sm text-gray-600">Count: {data.value?.toLocaleString()}</p>
          <p className="text-sm font-medium" style={{ color: payload[0].color }}>
            Percentage: {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-4 sm:p-6">
      {/* Header */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-red-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Real-time management and analytics</p>
              </div>
            </div>
            <button
              onClick={fetchDashboardData}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 transform hover:scale-105"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-700">Error loading data: {error}. Using fallback data where available.</p>
            </div>
          </div>
        )}

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Donors"
            value={dashboardData.totalDonors}
            icon={Users}
            color="#8B5CF6"
          />
          <StatCard
            title="Total Hospitals"
            value={dashboardData.totalHospitals}
            icon={Building2}
            color="#06B6D4"
          />
          <StatCard
            title="Total Donations"
            value={dashboardData.totalDonations}
            icon={Droplet}
            color="#EF4444"
          />
          <StatCard
            title="Blood Requests"
            value={dashboardData.totalRequests}
            icon={ClipboardList}
            color="#F59E0B"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Blood Stock Pie Chart with Percentages */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Droplet className="w-5 h-5 text-red-600 mr-2" />
              Blood Stock Distribution (%)
              <span className="ml-2 text-sm text-gray-500">({bloodStock.length} types)</span>
            </h3>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="ml-3 text-gray-500">Loading blood stock data...</p>
              </div>
            ) : bloodStock.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bloodStock}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={40}
                      dataKey="quantity"
                      nameKey="blood_name"
                      label={({ blood_name, percentage }) => `${blood_name}: ${percentage}%`}
                      labelLine={false}
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {bloodStock.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={bloodTypeColors[index % bloodTypeColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<BloodStockTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {bloodStock.map((item, index) => (
                    <div key={item.blood_name} className="text-center p-2 rounded-lg border" style={{ 
                      backgroundColor: bloodTypeColors[index % bloodTypeColors.length] + '15',
                      borderColor: bloodTypeColors[index % bloodTypeColors.length] + '30'
                    }}>
                      <p className="text-sm font-semibold" style={{ color: bloodTypeColors[index % bloodTypeColors.length] }}>
                        {item.blood_name}
                      </p>
                      <p className="text-xs text-gray-600">{item.quantity} units</p>
                      <p className="text-xs font-medium" style={{ color: bloodTypeColors[index % bloodTypeColors.length] }}>
                        {item.percentage}%
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">No blood stock data available</p>
                <p className="text-sm text-gray-400 mt-1">Check API connection or try refreshing</p>
                <button 
                  onClick={fetchDashboardData}
                  className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Retry Loading
                </button>
              </div>
            )}
          </div>
          <div>
            { <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <UserCheck className="w-5 h-5 text-emerald-600 mr-2" />
              Donor Status Overview
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-emerald-600">{dashboardData.activeDonors}</p>
                <p className="text-sm text-gray-600">Active Donors</p>
                <p className="text-xs text-emerald-500 mt-1">
                  {donorStatusData[0]?.percentage}% of total
                </p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-500">{dashboardData.deactiveDonors}</p>
                <p className="text-sm text-gray-600">Inactive Donors</p>
                <p className="text-xs text-red-400 mt-1">
                  {donorStatusData[1]?.percentage}% of total
                </p>
              </div>
            </div>
          </div> }

          {/* Hospital Status with Blue/Orange theme */}
          { <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Building className="w-5 h-5 text-blue-600 mr-2" />
              Hospital Status Overview
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{dashboardData.activeHospitals}</p>
                <p className="text-sm text-gray-600">Active Hospitals</p>
                <p className="text-xs text-blue-500 mt-1">
                  {hospitalStatusData[0]?.percentage}% of total
                </p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
                <AlertCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-500">{dashboardData.deactiveHospitals}</p>
                <p className="text-sm text-gray-600">Inactive Hospitals</p>
                <p className="text-xs text-orange-400 mt-1">
                  {hospitalStatusData[1]?.percentage}% of total
                </p>
              </div>
            </div>
          </div> }

          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <MapPin className="w-5 h-5 text-blue-600 mr-2" />
              Donors by District
            </h3>
            {districtDonorData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={districtDonorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="districtName" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis tick={{ fill: '#6b7280' }} allowDecimals={false}  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="totalDonors" 
                    radius={[6, 6, 0, 0]}
                    animationDuration={1000}
                  >
                    {districtDonorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={districtColors[index % districtColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>No district donor data available</p>
              </div>
            )}
          </div>
        </div>

        {/* District Hospitals Chart */}
        {districtHospitalData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Building2 className="w-5 h-5 text-purple-600 mr-2" />
              Hospitals by District
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={districtHospitalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="districtName" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis tick={{ fill: '#6b7280' }} allowDecimals={false}  />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="totalHospitals" 
                  radius={[6, 6, 0, 0]}
                  animationDuration={1000}
                >
                  {districtHospitalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={districtColors[(index + 4) % districtColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}       
      </div>
    </div>
  );
};

export default AdminDashboard;



