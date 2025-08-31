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