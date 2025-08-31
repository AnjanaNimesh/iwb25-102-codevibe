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
