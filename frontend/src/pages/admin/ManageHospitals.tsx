
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

// Utility function to get token from cookies
const getTokenFromCookie = (): string | null => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    // Try common cookie names - adjust based on your actual cookie name
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
    // Try multiple authorization header formats - your backend might expect one of these
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
  const [authError, setAuthError] = useState<string | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

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

  // Handle authentication errors
  const handleAuthError = (error: any, fallbackData?: any) => {
    if (error.message && error.message.includes('403')) {
      setAuthError('Access denied: Admin authentication required');
      return fallbackData || null;
    }
    console.error('API Error:', error);
    return fallbackData || null;
  };

  // API functions
  const fetchDistricts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/districts`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include', // Added credentials: 'include'
      });
      
      if (res.status === 403) {
        handleAuthError({ message: '403' });
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
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setDistricts(data);
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`HTTP ${res.status}: ${errorData.message || 'Failed to fetch districts'}`);
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
        fetch(`${API_BASE_URL}/activehospitalCount`, {
          method: 'GET',
          headers: getAuthHeaders(),
          credentials: 'include', // Added credentials: 'include'
        }),
        fetch(`${API_BASE_URL}/deactivehospitalCount`, {
          method: 'GET',
          headers: getAuthHeaders(),
          credentials: 'include', // Added credentials: 'include'
        })
      ]);

      let activeCount = 0;
      let deactiveCount = 0;

      if (activeRes.ok) {
        const data = await activeRes.json();
        activeCount = data.totalActiveHospitals ?? data.total ?? data.count ?? 0;
      } else if (activeRes.status === 403) {
        handleAuthError({ message: '403' });
      }

      if (deactiveRes.ok) {
        const data = await deactiveRes.json();
        deactiveCount = data.totalDeactiveHospitals ?? data.totalInactiveHospitals ?? data.total ?? data.count ?? 0;
      } else if (deactiveRes.status === 403) {
        handleAuthError({ message: '403' });
      }

      // Fallback to mock data if API calls failed
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
      const res = await fetch(`${API_BASE_URL}/hospitalData`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include', // Added credentials: 'include'
      });
      
      if (res.status === 403) {
        handleAuthError({ message: '403' });
        setHospitals(mockHospitals);
        setFilteredHospitals(mockHospitals);
        return;
      }

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
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`HTTP ${res.status}: ${errorData.message || 'Failed to fetch hospitals'}`);
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
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedData),
        credentials: 'include', // Added credentials: 'include'
      });

      if (res.status === 403) {
        handleAuthError({ message: '403' });
        // Use a message box instead of alert()
        console.error('Access denied: Admin authentication required');
        return false;
      }

      if (res.ok) {
        const result = await res.json();
        console.log('Update result:', result);
        
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
        // Use a message box instead of alert()
        console.log('Hospital updated successfully!');
        return true;
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('Failed to update hospital:', errorData);
        // Use a message box instead of alert()
        console.error(`Failed to update hospital: ${errorData.message || 'Unknown error'}`);
        return false;
      }
    } catch (err) {
      console.error('Error updating hospital:', err);
      // Use a message box instead of alert()
      console.error('Error updating hospital. Please check your connection and try again.');
      return false;
    } finally {
      setIsEditLoading(false);
    }
  };

  const deactivateHospital = async (hospitalId: number) => {
    // Custom confirmation dialog instead of window.confirm
    const confirmation = window.confirm('Are you sure you want to deactivate this hospital?');
    if (!confirmation) return;

    try {
      const res = await fetch(`${API_BASE_URL}/hospitals/${hospitalId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include', // Added credentials: 'include'
      });

      if (res.status === 403) {
        handleAuthError({ message: '403' });
        // Use a message box instead of alert()
        console.error('Access denied: Admin authentication required');
        return;
      }

      if (res.ok) {
        const result = await res.json();
        console.log('Deactivate result:', result);
        
        setHospitals(prev =>
          prev.map(h => (h.hospital_id === hospitalId ? { ...h, status: 'deactive' } : h))
        );
        setFilteredHospitals(prev =>
          prev.map(h => (h.hospital_id === hospitalId ? { ...h, status: 'deactive' } : h))
        );
        fetchStats(); // Refresh stats
        // Use a message box instead of alert()
        console.log('Hospital deactivated successfully');
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('Failed to deactivate hospital:', errorData);
        // Use a message box instead of alert()
        console.error(`Failed to deactivate hospital: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error deactivating hospital:', err);
      // Use a message box instead of alert()
      console.error('Error deactivating hospital. Please check your connection and try again.');
    }
  };

  const activateHospital = async (hospitalId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/hospitals/activate/${hospitalId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include', // Added credentials: 'include'
      });

      if (res.status === 403) {
        handleAuthError({ message: '403' });
        // Use a message box instead of alert()
        console.error('Access denied: Admin authentication required');
        return;
      }

      if (res.ok) {
        const result = await res.json();
        console.log('Activate result:', result);
        
        setHospitals(prev =>
          prev.map(h => (h.hospital_id === hospitalId ? { ...h, status: 'active' } : h))
        );
        setFilteredHospitals(prev =>
          prev.map(h => (h.hospital_id === hospitalId ? { ...h, status: 'active' } : h))
        );
        fetchStats(); // Refresh stats
        // Use a message box instead of alert()
        console.log('Hospital activated successfully');
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('Failed to activate hospital:', errorData);
        // Use a message box instead of alert()
        console.error(`Failed to activate hospital: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error activating hospital:', err);
      // Use a message box instead of alert()
      console.error('Error activating hospital. Please check your connection and try again.');
    }
  };

  const handleMoreClick = async (hospitalId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/hospitalData/${hospitalId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include', // Added credentials: 'include'
      });

      if (res.status === 403) {
        handleAuthError({ message: '403' });
        const fallback = hospitals.find(x => x.hospital_id === hospitalId) ?? null;
        setSelectedHospital(fallback);
        setShowDetailsModal(true);
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch details for ID ${hospitalId}: HTTP ${res.status}`);
      }
      
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
          status: h.status || hospitals.find(x => x.hospital_id === hospitalId)?.status || 'active'
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
      // Use a message box instead of alert()
      console.log('Hospital updated successfully!');
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
      setAuthError(null); // Clear any previous auth errors
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Authentication Error Alert */}
        {authError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{authError}</p>
                  <p className="text-sm text-red-600 mt-1">
                    Please ensure you are logged in as an admin. Some features may be limited.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowDebugInfo(!showDebugInfo)}
                  className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border border-red-300 rounded-lg"
                >
                  Debug Info
                </button>
                <button
                  onClick={() => setAuthError(null)}
                  className="text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            {showDebugInfo && (
              <div className="mt-4 p-3 bg-red-100 rounded-lg text-xs font-mono">
                <p><strong>Available Cookies:</strong></p>
                <p>{document.cookie || 'No cookies found'}</p>
                <p className="mt-2"><strong>Token Found:</strong> {getTokenFromCookie() ? 'Yes' : 'No'}</p>
                <p><strong>API Base URL:</strong> {API_BASE_URL}</p>
                <p className="mt-2"><strong>Headers being sent:</strong></p>
                <pre className="whitespace-pre-wrap">{JSON.stringify(getAuthHeaders(), null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="p-2 sm:p-3 bg-red-100 rounded-full w-fit shadow-md">
            <Hospital className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Hospital Management</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage hospitals and their status</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 transition-transform hover:scale-105 duration-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Hospitals</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalHospitals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 transition-transform hover:scale-105 duration-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg shadow-sm">
                <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Active Hospitals</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalActiveHospitals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 sm:col-span-2 lg:col-span-1 transition-transform hover:scale-105 duration-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg shadow-sm">
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
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search hospitals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 hover:border-gray-400"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Deactive">Inactive</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 hover:border-gray-400"
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
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 hover:border-gray-400"
            >
              <option value="All Districts">All Districts</option>
              {uniqueDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Sort Button */}
            <button
              onClick={handleSortToggle}
              className="flex items-center justify-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
            >
              <ArrowUpDown className="h-4 w-4 mr-1" />
              Sort by {sortBy === 'id' ? 'ID' : 'District'}
            </button>
          </div>
        </div>

        {/* Mobile Cards View (visible on mobile) */}
        <div className="lg:hidden space-y-4 mb-6">
          {paginatedHospitals.map((hospital) => (
            <div key={hospital.hospital_id} className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-base">{hospital.hospital_name}</h3>
                    <p className="text-xs text-gray-500">ID: {hospital.hospital_id}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(hospital.status ?? 'active')} shadow-sm`}>
                  {hospital.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <div>
                  <p className="text-gray-500">Type</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHospitalTypeColor(hospital.hospital_type)} shadow-sm`}>
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

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => handleMoreClick(hospital.hospital_id)}
                  className="flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors shadow-sm"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button
                  onClick={() => handleEditClick(hospital)}
                  className="flex items-center px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors shadow-sm"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                {hospital.status === 'active' ? (
                  <button
                    onClick={() => deactivateHospital(hospital.hospital_id)}
                    className="flex items-center px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors shadow-sm"
                  >
                    <UserMinus className="h-4 w-4 mr-1" />
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => activateHospital(hospital.hospital_id)}
                    className="flex items-center px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors shadow-sm"
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Activate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden lg:block bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-6 sm:mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hospital Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  District
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedHospitals.map((hospital) => (
                <tr key={hospital.hospital_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hospital.hospital_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {hospital.hospital_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getHospitalTypeColor(hospital.hospital_type)}`}>
                      {hospital.hospital_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hospital.hospital_address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hospital.contact_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hospital.district_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(hospital.status ?? 'active')}`}>
                      {hospital.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleMoreClick(hospital.hospital_id)}
                        className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditClick(hospital)}
                        className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 hover:text-blue-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                        title="Edit Hospital"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      {hospital.status === 'active' ? (
                        <button
                          onClick={() => deactivateHospital(hospital.hospital_id)}
                          className="p-1.5 rounded-md text-red-600 hover:bg-red-50 hover:text-red-900 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                          title="Deactivate Hospital"
                        >
                          <UserMinus className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => activateHospital(hospital.hospital_id)}
                          className="p-1.5 rounded-md text-green-600 hover:bg-green-50 hover:text-green-900 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
                          title="Activate Hospital"
                        >
                          <UserCheck className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredHospitals.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-6 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-md">
            <div className="text-sm text-gray-600 mb-2 sm:mb-0">
              Showing <span className="font-semibold">{startItem}</span> to <span className="font-semibold">{endItem}</span> of{' '}
              <span className="font-semibold">{filteredHospitals.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Hospital Details Modal */}
        {showDetailsModal && selectedHospital && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Hospital className="h-6 w-6 mr-2 text-blue-600" />
                Hospital Details
              </h2>
              <div className="space-y-3 text-gray-700">
                <p><strong>ID:</strong> {selectedHospital.hospital_id}</p>
                <p><strong>Name:</strong> {selectedHospital.hospital_name}</p>
                <p><strong>Type:</strong> <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getHospitalTypeColor(selectedHospital.hospital_type)}`}>
                      {selectedHospital.hospital_type}
                    </span></p>
                <p><strong>Address:</strong> {selectedHospital.hospital_address}</p>
                <p><strong>Contact:</strong> {selectedHospital.contact_number}</p>
                <p><strong>District:</strong> {selectedHospital.district_name}</p>
                <p><strong>Status:</strong> <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(selectedHospital.status ?? 'active')}`}>
                      {selectedHospital.status === 'active' ? 'Active' : 'Inactive'}
                    </span></p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Hospital Modal */}
        {showEditModal && selectedHospital && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Edit className="h-6 w-6 mr-2 text-blue-600" />
                Edit Hospital
              </h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label htmlFor="hospital_name" className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                  <input
                    type="text"
                    id="hospital_name"
                    value={editFormData.hospital_name}
                    onChange={(e) => setEditFormData({ ...editFormData, hospital_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="hospital_type" className="block text-sm font-medium text-gray-700 mb-1">Hospital Type</label>
                  <select
                    id="hospital_type"
                    value={editFormData.hospital_type}
                    onChange={(e) => setEditFormData({ ...editFormData, hospital_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-white"
                    required
                  >
                    <option value="">Select Type</option>
                    {uniqueTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="hospital_address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    id="hospital_address"
                    value={editFormData.hospital_address}
                    onChange={(e) => setEditFormData({ ...editFormData, hospital_address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    id="contact_number"
                    value={editFormData.contact_number}
                    onChange={(e) => setEditFormData({ ...editFormData, contact_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="district_name" className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <select
                    id="district_name"
                    value={editFormData.district_name}
                    onChange={(e) => setEditFormData({ ...editFormData, district_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-white"
                    required
                  >
                    <option value="">Select District</option>
                    {uniqueDistricts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isEditLoading}
                  >
                    {isEditLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Save Changes
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