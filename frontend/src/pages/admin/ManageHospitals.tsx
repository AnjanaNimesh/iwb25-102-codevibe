import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Building2, 
  Users, 
  UserX, 
  Eye, 
  UserCheck, 
  UserMinus, 
  Hospital,
  Edit,
  Save,
  ArrowUpDown,
  X
} from 'lucide-react';
import { 
  PageHeader, 
  StatsCard, 
  SearchInput, 
  FilterSelect, 
  FilterBar, 
  StatusBadge, 
  ActionButton, 
  EmptyState, 
  Pagination, 
  ModalWrapper, 
  NotificationModals,
  getAuthHeaders,
  LoadingSpinner
} from './components/index.';

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

  // Notification states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: 'success' | 'warning' | 'error'; title: string; message: string; hospitalId?: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  // API functions
  const fetchDistricts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/districts`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch districts`);
      }

      const data = await res.json();
      setDistricts(data);
    } catch (err) {
      console.error('Error fetching districts:', err);
      setError('Failed to fetch districts');
    }
  };

  const fetchStats = async () => {
    try {
      const [activeRes, deactiveRes] = await Promise.all([
        fetch(`${API_BASE_URL}/activehospitalCount`, {
          method: 'GET',
          headers: getAuthHeaders(),
          credentials: 'include',
        }),
        fetch(`${API_BASE_URL}/deactivehospitalCount`, {
          method: 'GET',
          headers: getAuthHeaders(),
          credentials: 'include',
        })
      ]);

      let activeCount = 0;
      let deactiveCount = 0;

      if (activeRes.ok) {
        const data = await activeRes.json();
        activeCount = data.totalActiveHospitals ?? data.total ?? data.count ?? 0;
      }

      if (deactiveRes.ok) {
        const data = await deactiveRes.json();
        deactiveCount = data.totalDeactiveHospitals ?? data.totalInactiveHospitals ?? data.total ?? data.count ?? 0;
      }

      setStats({
        totalActiveHospitals: activeCount,
        totalDeactiveHospitals: deactiveCount,
        totalHospitals: activeCount + deactiveCount
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to fetch hospital stats');
    }
  };

  const fetchHospitals = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/hospitalData`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch hospitals`);
      }

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
    } catch (err) {
      console.error('Error fetching hospitals:', err);
      setError('Failed to fetch hospitals');
    } finally {
      setIsLoading(false);
    }
  };

  const updateHospital = async (hospitalId: number, updatedData: EditFormData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/hospitals/${hospitalId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedData),
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to update hospital`);
      }

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
      setSuccess('Hospital updated successfully!');
      setShowEditModal(false);
      return true;
    } catch (err) {
      console.error('Error updating hospital:', err);
      setError('Failed to update hospital');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deactivateHospital = async () => {
    if (!confirmAction?.hospitalId) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/hospitals/${confirmAction.hospitalId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to deactivate hospital`);
      }

      setHospitals(prev =>
        prev.map(h => (h.hospital_id === confirmAction.hospitalId ? { ...h, status: 'deactive' } : h))
      );
      setFilteredHospitals(prev =>
        prev.map(h => (h.hospital_id === confirmAction.hospitalId ? { ...h, status: 'deactive' } : h))
      );
      await fetchStats();
      setSuccess('Hospital deactivated successfully');
    } catch (err) {
      console.error('Error deactivating hospital:', err);
      setError('Failed to deactivate hospital');
    } finally {
      setLoading(false);
      setIsConfirmModalOpen(false);
      setConfirmAction(null);
    }
  };

  const activateHospital = async () => {
    if (!confirmAction?.hospitalId) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/hospitals/activate/${confirmAction.hospitalId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to activate hospital`);
      }

      setHospitals(prev =>
        prev.map(h => (h.hospital_id === confirmAction.hospitalId ? { ...h, status: 'active' } : h))
      );
      setFilteredHospitals(prev =>
        prev.map(h => (h.hospital_id === confirmAction.hospitalId ? { ...h, status: 'active' } : h))
      );
      await fetchStats();
      setSuccess('Hospital activated successfully');
    } catch (err) {
      console.error('Error activating hospital:', err);
      setError('Failed to activate hospital');
    } finally {
      setLoading(false);
      setIsConfirmModalOpen(false);
      setConfirmAction(null);
    }
  };

  const handleMoreClick = async (hospitalId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/hospitalData/${hospitalId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch hospital details`);
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
        setSelectedHospital(hospitals.find(x => x.hospital_id === hospitalId) ?? null);
      }
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Error fetching hospital details:', err);
      setError('Failed to fetch hospital details');
      setSelectedHospital(hospitals.find(x => x.hospital_id === hospitalId) ?? null);
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
    await updateHospital(selectedHospital.hospital_id, editFormData);
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

    filtered.sort((a, b) => {
      if (sortBy === 'district') {
        const districtComparison = a.district_name.localeCompare(b.district_name);
        if (districtComparison !== 0) return districtComparison;
        return a.hospital_id - b.hospital_id;
      }
      return a.hospital_id - b.hospital_id;
    });

    setFilteredHospitals(filtered);
    setCurrentPage(1);
  }, [hospitals, searchTerm, statusFilter, typeFilter, districtFilter, sortBy]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedHospitals(filteredHospitals.slice(startIndex, endIndex));
  }, [filteredHospitals, currentPage]);

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchHospitals(), fetchStats(), fetchDistricts()]);
    };
    init();
  }, []);

  const uniqueTypes = Array.from(new Set(hospitals.map(h => h.hospital_type))).filter(Boolean).sort();
  const uniqueDistricts = districts.map(d => d.district_name).filter(Boolean).sort();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <NotificationModals
          isConfirmModalOpen={isConfirmModalOpen}
          confirmAction={confirmAction}
          setIsConfirmModalOpen={setIsConfirmModalOpen}
          setConfirmAction={setConfirmAction}
          handleConfirm={confirmAction?.type === 'warning' ? deactivateHospital : activateHospital}
          loading={loading}
          error={error}
          setError={setError}
          success={success}
          setSuccess={setSuccess}
        />

        <PageHeader
          icon={<Hospital className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />}
          title="Hospital Management"
          subtitle="Manage hospitals and their status"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatsCard
            icon={<Building2 className="h-5 w-5 sm:h-6 sm:w-6" />}
            title="Total Hospitals"
            value={stats.totalHospitals}
            color="blue"
          />
          <StatsCard
            icon={<UserCheck className="h-5 w-5 sm:h-6 sm:w-6" />}
            title="Active Hospitals"
            value={stats.totalActiveHospitals}
            color="green"
          />
          <StatsCard
            icon={<UserX className="h-5 w-5 sm:h-6 sm:w-6" />}
            title="Inactive Hospitals"
            value={stats.totalDeactiveHospitals}
            color="red"
          />
        </div>

        <FilterBar>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search hospitals..."
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'All Status', label: 'All Status' },
              { value: 'Active', label: 'Active' },
              { value: 'Deactive', label: 'Inactive' }
            ]}
          />
          <FilterSelect
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: 'All Types', label: 'All Types' },
              ...uniqueTypes.map(t => ({ value: t, label: t }))
            ]}
          />
          <FilterSelect
            value={districtFilter}
            onChange={setDistrictFilter}
            options={[
              { value: 'All Districts', label: 'All Districts' },
              ...uniqueDistricts.map(d => ({ value: d, label: d }))
            ]}
          />
          <ActionButton
            icon={<ArrowUpDown />}
            label={`Sort by ${sortBy === 'id' ? 'ID' : 'District'}`}
            onClick={handleSortToggle}
            variant="secondary"
          />
        </FilterBar>

        {paginatedHospitals.length === 0 ? (
          <EmptyState
            icon={<Hospital />}
            title="No Hospitals Found"
            description="Try adjusting your search or filter criteria."
          />
        ) : (
          <>
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
                    <StatusBadge status={hospital.status ?? 'active'} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
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

                  <div className="flex flex-wrap gap-2 mt-4">
                    <ActionButton
                      icon={<Eye />}
                      label="View"
                      onClick={() => handleMoreClick(hospital.hospital_id)}
                      variant="secondary"
                    />
                    <ActionButton
                      icon={<Edit />}
                      label="Edit"
                      onClick={() => handleEditClick(hospital)}
                      variant="primary"
                    />
                    {hospital.status === 'active' ? (
                      <ActionButton
                        icon={<UserMinus />}
                        label="Deactivate"
                        onClick={() => {
                          setConfirmAction({
                            type: 'warning',
                            title: 'Deactivate Hospital',
                            message: `Are you sure you want to deactivate ${hospital.hospital_name}?`,
                            hospitalId: hospital.hospital_id
                          });
                          setIsConfirmModalOpen(true);
                        }}
                        variant="danger"
                      />
                    ) : (
                      <ActionButton
                        icon={<UserCheck />}
                        label="Activate"
                        onClick={() => {
                          setConfirmAction({
                            type: 'success',
                            title: 'Activate Hospital',
                            message: `Are you sure you want to activate ${hospital.hospital_name}?`,
                            hospitalId: hospital.hospital_id
                          });
                          setIsConfirmModalOpen(true);
                        }}
                        variant="success"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

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
                        {hospital.contact_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {hospital.district_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <StatusBadge status={hospital.status ?? 'active'} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <ActionButton
                            icon={<Eye />}
                            label="More"
                            onClick={() => handleMoreClick(hospital.hospital_id)}
                            variant="secondary"
                            size="sm"
                            title="View Details"
                          />
                          <ActionButton
                            icon={<Edit />}
                            label="Edit"
                            onClick={() => handleEditClick(hospital)}
                            variant="primary"
                            size="sm"
                            title="Edit Hospital"
                          />
                          {hospital.status === 'active' ? (
                            <ActionButton
                              icon={<UserMinus />}
                              label="Deactivate"
                              onClick={() => {
                                setConfirmAction({
                                  type: 'warning',
                                  title: 'Deactivate Hospital',
                                  message: `Are you sure you want to deactivate ${hospital.hospital_name}?`,
                                  hospitalId: hospital.hospital_id
                                });
                                setIsConfirmModalOpen(true);
                              }}
                              variant="danger"
                              size="sm"
                              title="Deactivate Hospital"
                            />
                          ) : (
                            <ActionButton
                              icon={<UserCheck />}
                              label="Activate"
                              onClick={() => {
                                setConfirmAction({
                                  type: 'success',
                                  title: 'Activate Hospital',
                                  message: `Are you sure you want to activate ${hospital.hospital_name}?`,
                                  hospitalId: hospital.hospital_id
                                });
                                setIsConfirmModalOpen(true);
                              }}
                              variant="success"
                              size="sm"
                              title="Activate Hospital"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {filteredHospitals.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredHospitals.length / itemsPerPage)}
            totalItems={filteredHospitals.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            itemName="hospitals"
          />
        )}

        <ModalWrapper
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Hospital Details"
        >
          {selectedHospital && (
            <div className="space-y-3 text-gray-700">
              <p><strong>ID:</strong> <span>{selectedHospital.hospital_id}</span></p>
              <p><strong>Name:</strong> <span>{selectedHospital.hospital_name}</span></p>
              <p><strong>Type:</strong> <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getHospitalTypeColor(selectedHospital.hospital_type)}`}>
                {selectedHospital.hospital_type}
              </span></p>
              <p><strong>Address:</strong> <span>{selectedHospital.hospital_address}</span></p>
              <p><strong>Contact:</strong> <span>{selectedHospital.contact_number}</span></p>
              <p><strong>District:</strong> <span>{selectedHospital.district_name}</span></p>
              <p><strong>Status:</strong> <StatusBadge status={selectedHospital.status ?? 'active'} /></p>
            </div>
          )}
        </ModalWrapper>

        <ModalWrapper
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Hospital"
        >
          {selectedHospital && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="hospital_name" className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                <input
                  type="text"
                  id="hospital_name"
                  value={editFormData.hospital_name}
                  onChange={(e) => setEditFormData({ ...editFormData, hospital_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-shadow"
                  required
                />
              </div>
              <div>
                <label htmlFor="hospital_type" className="block text-sm font-medium text-gray-700 mb-1">Hospital Type</label>
                <select
                  id="hospital_type"
                  value={editFormData.hospital_type}
                  onChange={(e) => setEditFormData({ ...editFormData, hospital_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-shadow bg-white"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-shadow"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-shadow"
                  required
                />
              </div>
              <div>
                <label htmlFor="district_name" className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <select
                  id="district_name"
                  value={editFormData.district_name}
                  onChange={(e) => setEditFormData({ ...editFormData, district_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-shadow bg-white"
                  required
                >
                  <option value="">Select District</option>
                  {uniqueDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <ActionButton
                  icon={<X />}
                  label="Cancel"
                  onClick={() => setShowEditModal(false)}
                  variant="secondary"
                />
                <ActionButton
                  icon={<Save />}
                  label="Save Changes"
                  type="submit"
                  variant="primary"
                  disabled={loading}
                />
              </div>
            </form>
          )}
        </ModalWrapper>
      </div>
    </div>
  );
};

export default ManageHospitals;
