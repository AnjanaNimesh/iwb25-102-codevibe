
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Eye,
  UserCheck,
  UserX,
  Users,
  Activity,
} from "lucide-react";

// Import shared components
import { PageHeader } from './components/PageHeader';
import { StatsCard } from './components/StatsCard';
import { FilterBar } from './components/FilterBar';
import { SearchInput } from './components/SearchInput';
import { FilterSelect } from './components/FilterSelect';
import { ActionButton } from './components/ActionButton';
import { EmptyState } from './components/EmptyState';
import { Pagination } from './components/Pagination';
import { ModalWrapper } from './components/ModalWrapper';
import { LoadingSpinner } from './components/LoadingSpinner';
import { getTokenFromCookie, getAuthHeaders } from './components/utils';

const API_BASE = "http://localhost:9092/dashboard/admin";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const ManageDonors = () => {
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState("all");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  // Sorting config: key and direction
  const [sortConfig, setSortConfig] = useState({
    key: "donor_id",
    direction: "asc",
  });

  // Fetch donors + stats
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Get donors
      const donorsRes = await fetch(`${API_BASE}/donors`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!donorsRes.ok) throw new Error(`HTTP error! status: ${donorsRes.status}`);
      const donorsData = await donorsRes.json();

      // Get counts
      const totalRes = await fetch(`${API_BASE}/donorCount`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!totalRes.ok) throw new Error(`HTTP error! status: ${totalRes.status}`);
      const totalData = await totalRes.json();

      const activeRes = await fetch(`${API_BASE}/activeDonorCount`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!activeRes.ok) throw new Error(`HTTP error! status: ${activeRes.status}`);
      const activeData = await activeRes.json();

      const inactiveRes = await fetch(`${API_BASE}/deactiveDonorCount`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!inactiveRes.ok) throw new Error(`HTTP error! status: ${inactiveRes.status}`);
      const inactiveData = await inactiveRes.json();

      setDonors(donorsData);
      setStats({
        total: totalData.totalDonors,
        active: activeData.totalActiveDonors,
        inactive: inactiveData.totalDeactiveDonors,
      });
    } catch (error) {
      console.error("Error fetching donor data:", error);
      setDonors([]);
      setStats({ total: 0, active: 0, inactive: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Filter donors based on search, status, blood group
  const filteredDonors = useMemo(() => {
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
  const sortedDonors = useMemo(() => {
    const sorted = [...filteredDonors];
    sorted.sort((a, b) => {
      let aKey = a[sortConfig.key];
      let bKey = b[sortConfig.key];

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedDonors.length / itemsPerPage);

  // Paginated donors to display on current page
  const paginatedDonors = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedDonors.slice(start, start + itemsPerPage);
  }, [sortedDonors, currentPage]);

  // Change sorting field & direction
  const requestSort = useCallback(
    (key) => {
      let direction = "asc";
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ key, direction });
    },
    [sortConfig]
  );

  // Update donor status (activate/deactivate)
  const handleStatusChange = async (donorId, newStatus) => {
    const confirmation = window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} this donor?`);
    if (!confirmation) return;

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
        console.log(data.message);

        // Refresh stats
        const totalRes = await fetch(`${API_BASE}/donorCount`, {
          headers: getAuthHeaders(),
          credentials: 'include',
        });
        const totalData = await totalRes.json();
        const activeRes = await fetch(`${API_BASE}/activeDonorCount`, {
          headers: getAuthHeaders(),
          credentials: 'include',
        });
        const activeData = await activeRes.json();
        const inactiveRes = await fetch(`${API_BASE}/deactiveDonorCount`, {
          headers: getAuthHeaders(),
          credentials: 'include',
        });
        const inactiveData = await inactiveRes.json();

        setStats({
          total: totalData.totalDonors,
          active: activeData.totalActiveDonors,
          inactive: inactiveData.totalDeactiveDonors,
        });
      } else {
        console.error(data.message || "Error updating donor status");
      }
    } catch (error) {
      console.error("Error updating donor status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (donor) => {
    setSelectedDonor(donor);
    setShowModal(true);
  };

  const getBloodGroups = () => {
    const bloodGroups = [...new Set(donors.map((donor) => donor.blood_group))];
    return bloodGroups.sort();
  };

  const getStatusBadge = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'deactive', label: 'Inactive' }
  ];

  const bloodGroupOptions = [
    { value: 'all', label: 'All Blood Groups' },
    ...getBloodGroups().map(group => ({ value: group, label: group }))
  ];

  if (loading && donors.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto relative">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50 rounded-lg">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
          </div>
        )}

        {/* Header */}
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

        {/* Filters */}
        <FilterBar>
          <SearchInput 
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
            placeholder="Search donors..."
            className="md:col-span-1"
          />
          <FilterSelect
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
            options={statusOptions}
            placeholder="All Status"
          />
          <FilterSelect
            value={bloodGroupFilter}
            onChange={(value) => {
              setBloodGroupFilter(value);
              setCurrentPage(1);
            }}
            options={bloodGroupOptions}
            placeholder="All Blood Groups"
          />
        </FilterBar>

        {/* Donors Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: "Donor ID", key: "donor_id" },
                    { label: "Name", key: "donor_name" },
                    { label: "Blood Group", key: "blood_group" },
                    { label: "District", key: "district_name" },
                    { label: "Status", key: "status" },
                    { label: "Actions" },
                  ].map((col) => (
                    <th
                      key={col.key || col.label}
                      onClick={() => col.key && requestSort(col.key)}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        col.key ? "cursor-pointer select-none" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{col.label}</span>
                        {col.key && sortConfig.key === col.key && (
                          <span>
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
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                          donor.status
                        )}`}
                      >
                        {donor.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <ActionButton
                        onClick={() => handleViewDetails(donor)}
                        icon={<Eye />}
                        label="More"
                        variant="secondary"
                        title="View Donor Details"
                      />

                      {donor.status === "active" ? (
                        <ActionButton
                          onClick={() => handleStatusChange(donor.donor_id, "deactive")}
                          icon={<UserX />}
                          label="Deactivate"
                          variant="danger"
                          disabled={loading}
                          title="Deactivate Donor"
                        />
                      ) : (
                        <ActionButton
                          onClick={() => handleStatusChange(donor.donor_id, "active")}
                          icon={<UserCheck />}
                          label="Activate"
                          variant="success"
                          disabled={loading}
                          title="Activate Donor"
                        />
                      )}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  <div className="flex items-center space-x-2">
    <ActionButton
      onClick={() => handleViewDetails(donor)}
      icon={<Eye />}
      label="More"
      variant="secondary"
      title="View Donor Details"
    />

    {donor.status === "active" ? (
      <ActionButton
        onClick={() => handleStatusChange(donor.donor_id, "deactive")}
        icon={<UserX />}
        label="Deactivate"
        variant="danger"
        disabled={loading}
        title="Deactivate Donor"
      />
    ) : (
      <ActionButton
        onClick={() => handleStatusChange(donor.donor_id, "active")}
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
                    <td colSpan={6}>
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
        {totalPages > 0 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filteredDonors.length}
              itemsPerPage={itemsPerPage}
              itemName="donors"
            />
          </div>
        )}

        {/* Modal */}
        <ModalWrapper
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Donor Details"
          maxWidth="max-w-md"
        >
          {selectedDonor && (
            <div className="space-y-4 text-sm text-gray-700">
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
                <span
                  className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                    selectedDonor.status
                  )}`}
                >
                  {selectedDonor.status === "active"
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>

              <div className="mt-6 flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Close
                </button>

                {selectedDonor.status === "active" ? (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedDonor.donor_id, "deactive");
                      setShowModal(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    Deactivate Donor
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedDonor.donor_id, "active");
                      setShowModal(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Activate Donor
                  </button>
                )}
              </div>
            </div>
          )}
        </ModalWrapper>

        {/* Loader styles */}
        <style>{`
          .loader {
            border-top-color: #ef4444;
            animation: spinner 1.5s linear infinite;
          }
          @keyframes spinner {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}</style>
      </div>
    </div>
  );
};

export default ManageDonors;