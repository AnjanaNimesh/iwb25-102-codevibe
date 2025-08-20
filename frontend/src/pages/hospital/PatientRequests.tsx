import React, { useState, useEffect } from "react";
import { Heart, Search, Plus, Trash2, Edit } from "lucide-react";
import axios from "axios";

interface BloodRequest {
  request_id: number;
  hospital_id: number;
  admission_number: string;
  blood_group: string;
  units_required: number;
  request_date: string;
  request_status: string;
  notes: string;
}

const API_BASE = "http://localhost:9090/hospital";
const HOSPITAL_ID = 1;

const PatientRequests = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState<BloodRequest | null>(
    null
  );
  const [formData, setFormData] = useState({
    admission_number: "",
    blood_group: "A+",
    units_required: 1,
    notes: "",
    request_status: "Pending",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/bloodrequests?hospital_id=${HOSPITAL_ID}`
      );
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRequest) {
        await axios.put(
          `${API_BASE}/bloodrequests/${editingRequest.request_id}?hospital_id=${HOSPITAL_ID}`,
          formData
        );
      } else {
        await axios.post(
          `${API_BASE}/bloodrequests/add?hospital_id=${HOSPITAL_ID}`,
          formData
        );
      }
      fetchRequests();
      resetForm();
    } catch (err) {
      console.error("Error saving request", err);
    }
  };

  const handleEdit = (request: BloodRequest) => {
    setEditingRequest(request);
    setFormData({
      admission_number: request.admission_number,
      blood_group: request.blood_group,
      units_required: request.units_required,
      notes: request.notes,
      request_status: request.request_status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this request?")) {
      try {
        await axios.delete(
          `${API_BASE}/bloodrequests/${id}?hospital_id=${HOSPITAL_ID}`
        );
        fetchRequests();
      } catch (err) {
        console.error("Error deleting request", err);
      }
    }
  };

  const resetForm = () => {
    setEditingRequest(null);
    setFormData({
      admission_number: "",
      blood_group: "A+",
      units_required: 1,
      notes: "",
      request_status: "Pending",
    });
    setShowModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.admission_number
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request.blood_group.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || request.request_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRequests.length / pageSize);
  const currentData = filteredRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Heart className="h-6 w-6 text-red-500 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">
            Patient Blood Requests
          </h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-600 transition-colors"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Request
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by admission number or blood group..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="sm:w-48 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Admission #</th>
                <th className="px-6 py-3">Blood Group</th>
                <th className="px-6 py-3">Units</th>
                <th className="px-6 py-3">Request Date & Time</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Notes</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((request) => (
                <tr key={request.request_id}>
                  <td className="px-6 py-4 text-left">
                    {request.admission_number}
                  </td>{" "}
                  {/* left aligned */}
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">
                      {request.blood_group}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {request.units_required}
                  </td>{" "}
                  {/* right aligned */}
                  <td className="px-6 py-4 text-center">
                    {request.request_date}
                  </td>{" "}
                  {/* center aligned */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        request.request_status
                      )}`}
                    >
                      {request.request_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">{request.notes}</td>{" "}
                  {/* left aligned */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(request)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      aria-label="Edit request"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(request.request_id)}
                      className="text-red-600 hover:text-red-900"
                      aria-label="Delete request"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end items-center p-4 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {editingRequest ? "Edit Blood Request" : "New Blood Request"}
            </h2>
            <form onSubmit={handleSubmit}>
              <p>Admission</p>
              <input
                type="text"
                placeholder="Admission #"
                required
                value={formData.admission_number}
                onChange={(e) =>
                  setFormData({ ...formData, admission_number: e.target.value })
                }
                className="w-full border mb-3 p-2 rounded"
              />
              <p>Blood Group</p>
              <select
                value={formData.blood_group}
                onChange={(e) =>
                  setFormData({ ...formData, blood_group: e.target.value })
                }
                className="w-full border mb-3 p-2 rounded"
              >
                {bloodGroups.map((bg) => (
                  <option key={bg}>{bg}</option>
                ))}
              </select>
              <p>Unit</p>
              <input
                type="number"
                min={1}
                value={formData.units_required}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    units_required: parseInt(e.target.value),
                  })
                }
                className="w-full border mb-3 p-2 rounded"
              />
              <p>Note</p>
              <textarea
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full border mb-3 p-2 rounded"
              />
              {/* Status select */}
              <p>Status</p>
              <select
                value={formData.request_status}
                onChange={(e) =>
                  setFormData({ ...formData, request_status: e.target.value })
                }
                className="w-full border mb-3 p-2 rounded"
              >
                <option value="Pending">Pending</option>

                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRequests;
