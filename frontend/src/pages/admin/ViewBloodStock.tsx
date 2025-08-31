
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, AlertTriangle, Heart, Building2, MapPin, Droplets, ChevronLeft, ChevronRight, Loader2, RefreshCw } from 'lucide-react';

interface ViewHospitalBloodStock {
  hospital_name: string;
  district_name: string;
  blood_name: string;
  quantity: number;
  status_indicator: string;
  last_modified: string;
}

interface District {
  district_id: number;
  district_name: string;
}

interface HospitalData {
  name: string;
  district: string;
  bloodStock: Record<string, { units: number; status: string }>;
  lastUpdated: string;
}

const ViewBloodStock = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedBloodType, setSelectedBloodType] = useState('All Types');
  const [currentPage, setCurrentPage] = useState(1);
  const [bloodStockData, setBloodStockData] = useState<ViewHospitalBloodStock[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const hospitalsPerPage = 5;
  const baseApiUrl = 'http://localhost:9092/dashboard/admin';

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Utility function to get token from cookies (copied from your working HospitalUserManagement)
  const getTokenFromCookie = (): string | null => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      // Look for any common token names or the specific 'adminToken'
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
    const token = getTokenFromCookie(); // Now using the cookie retrieval logic
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      // Use the Authorization Bearer token header, which is standard
      headers['Authorization'] = `Bearer ${token}`;
      // You can keep these if your backend specifically checks them, but 'Authorization' is usually sufficient
      headers['X-Admin-Token'] = token;
      headers['Admin-Token'] = token;
      headers['X-Auth-Token'] = token;
      console.log('Sending request with token headers');
    } else {
      console.warn('No token available - request will be unauthenticated');
    }
    return headers;
  };

  // Fetch blood stock data
  const fetchBloodStocks = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`${baseApiUrl}/bloodStocks`, {
        headers: getAuthHeaders(),
        credentials: 'include', // Crucial: ensures cookies are sent with cross-origin requests
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ViewHospitalBloodStock[] = await response.json();
      setBloodStockData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blood stock data');
      console.error('Error fetching blood stocks:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Fetch districts data
  const fetchDistricts = async () => {
    try {
      const response = await fetch(`${baseApiUrl}/districts`, {
        headers: getAuthHeaders(),
        credentials: 'include', // Crucial: ensures cookies are sent with cross-origin requests
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: District[] = await response.json();
      setDistricts(data);
    } catch (err) {
      console.error('Error fetching districts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch districts data');
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await Promise.all([fetchBloodStocks(), fetchDistricts()]);
      setLoading(false);
    };
    
    fetchInitialData();
  }, []);

  // Transform API data to hospital structure
  const hospitalsData = useMemo((): HospitalData[] => {
    const hospitalMap = new Map<string, HospitalData>();
    
    bloodStockData.forEach(stock => {
      const hospitalKey = `${stock.hospital_name}-${stock.district_name}`;
      
      if (!hospitalMap.has(hospitalKey)) {
        hospitalMap.set(hospitalKey, {
          name: stock.hospital_name,
          district: stock.district_name,
          bloodStock: {},
          lastUpdated: stock.last_modified
        });
      }
      
      const hospital = hospitalMap.get(hospitalKey)!;
      hospital.bloodStock[stock.blood_name] = {
        units: stock.quantity,
        status: stock.status_indicator.toLowerCase()
      };
      
      // Update last modified to the most recent
      if (new Date(stock.last_modified) > new Date(hospital.lastUpdated)) {
        hospital.lastUpdated = stock.last_modified;
      }
    });
    
    return Array.from(hospitalMap.values());
  }, [bloodStockData]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'adequate': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'critical' || status === 'low') {
      return <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
    return <Heart className="w-3 h-3 sm:w-4 sm:h-4" />;
  };

  const filteredHospitals = useMemo(() => {
    return hospitalsData.filter(hospital => {
      const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            hospital.district.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDistrict = selectedDistrict === 'All Districts' || hospital.district === selectedDistrict;
      
      const matchesBloodType = selectedBloodType === 'All Types' || 
                               (hospital.bloodStock[selectedBloodType] && hospital.bloodStock[selectedBloodType].units > 0);

      return matchesSearch && matchesDistrict && matchesBloodType;
    });
  }, [hospitalsData, searchTerm, selectedDistrict, selectedBloodType]);

  // Pagination
  const totalPages = Math.ceil(filteredHospitals.length / hospitalsPerPage);
  const startIndex = (currentPage - 1) * hospitalsPerPage;
  const paginatedHospitals = filteredHospitals.slice(startIndex, startIndex + hospitalsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDistrict, selectedBloodType]);

  const getTotalUnitsForBloodType = (bloodType: string) => {
    return filteredHospitals.reduce((total, hospital) => {
      return total + (hospital.bloodStock[bloodType]?.units || 0);
    }, 0);
  };

  const getCriticalCount = () => {
    let count = 0;
    filteredHospitals.forEach(hospital => {
      Object.values(hospital.bloodStock).forEach(stock => {
        if (stock && stock.status === 'critical') count++;
      });
    });
    return count;
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading blood stock data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4 font-sans">
        <div className="text-center max-w-md bg-white rounded-lg shadow-xl p-8 border border-red-200">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              Promise.all([fetchBloodStocks(), fetchDistricts()]).finally(() => setLoading(false));
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 font-sans">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="p-2 sm:p-3 bg-red-100 rounded-full shadow-md">
              <Droplets className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Blood Stock Management</h1>
              <p className="text-sm sm:text-base text-gray-600">Real-time blood inventory across hospitals</p>
            </div>
            <button
              onClick={fetchBloodStocks}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white rounded-lg shadow-md border p-3 sm:p-4 transition-transform hover:scale-105 duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Total Hospitals</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{filteredHospitals.length}</p>
                </div>
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md border p-3 sm:p-4 transition-transform hover:scale-105 duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Critical Alerts</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">{getCriticalCount()}</p>
                </div>
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md border p-3 sm:p-4 transition-transform hover:scale-105 duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">O+ Units</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{getTotalUnitsForBloodType("O+")}</p>
                </div>
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md border p-3 sm:p-4 transition-transform hover:scale-105 duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">O- Units</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">{getTotalUnitsForBloodType("O-")}</p>
                </div>
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md border p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search hospitals..."
                className="w-full pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base transition-all duration-200 hover:border-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <select
                className="w-full pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white text-sm sm:text-base transition-all duration-200 hover:border-gray-400"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <option value="All Districts">All Districts</option>
                {districts.map(district => (
                  <option key={district.district_id} value={district.district_name}>
                    {district.district_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <select
                className="w-full pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white text-sm sm:text-base transition-all duration-200 hover:border-gray-400"
                value={selectedBloodType}
                onChange={(e) => setSelectedBloodType(e.target.value)}
              >
                <option value="All Types">All Blood Types</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Hospital Cards */}
        <div className="space-y-4 sm:space-y-6 mb-6">
          {paginatedHospitals.map((hospital, index) => (
            <div key={`${hospital.name}-${hospital.district}-${index}`} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-200">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">{hospital.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="text-xs sm:text-sm">{hospital.district} District</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="text-xs sm:text-sm font-medium">{formatDateTime(hospital.lastUpdated)}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Blood Stock Levels</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    {bloodTypes.map(bloodType => {
                      const stock = hospital.bloodStock[bloodType];
                      const shouldHighlight = selectedBloodType === 'All Types' || selectedBloodType === bloodType;
                      
                      return (
                        <div 
                          key={bloodType} 
                          className={`p-2 sm:p-3 rounded-lg border transition-all duration-200 ${
                            shouldHighlight ? 'border-red-200 bg-red-50 shadow-sm' : 'border-gray-200'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-xs sm:text-sm font-bold text-gray-900 mb-1">{bloodType}</div>
                            <div className="text-base sm:text-lg font-bold text-gray-900">
                              {stock ? stock.units : 0}
                            </div>
                            <div className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                                getStatusColor(stock ? stock.status : 'unknown')
                              }`}>
                              {getStatusIcon(stock ? stock.status : 'unknown')}
                              <span className="ml-1 capitalize text-xs">
                                {stock ? stock.status : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-md border p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(startIndex + hospitalsPerPage, filteredHospitals.length)} of {filteredHospitals.length} hospitals
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium shadow-sm ${
                          currentPage === pageNum
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'border border-gray-300 hover:bg-gray-50'
                        } transition-colors`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors shadow-sm"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredHospitals.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
            <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No hospitals found</h3>
            <p className="text-sm sm:text-base text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBloodStock;
