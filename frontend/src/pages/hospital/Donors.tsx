import { useState, useEffect } from "react";
import {
  UsersIcon,
  SearchIcon,
  TrashIcon,
  XIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BookOpenIcon as BookMarked,
  Eye,
} from "lucide-react";
import DOMPurify from "dompurify";
import type { Donation } from "./types/index.ts";
import axios from "axios";

const API_BASE_URL = "http://localhost:9090/hospital";
const HOSPITAL_ID = 3; // Change this to match your backend test data

const Donors = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDonor, setSelectedDonor] = useState<Donation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [certificateHtml, setCertificateHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDonations = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/donationsWithDonors?hospital_id=${HOSPITAL_ID}`
      );

      const mappedDonations = response.data.map((item: any) => ({
        donation_id: item.donation_id,
        donor_id: item.donor_id,
        donor_name: item.donor_name,
        email: item.email,
        blood_group: item.blood_group,
        phone_number: item.phone_number,
        donate_date: item.donate_date,
        donate_status: item.donate_status,
        last_donation_date: item.last_donation_date,
      })) as Donation[];

      setDonations(mappedDonations);
    } catch (error) {
      console.error("Error fetching donations:", error);
      alert("Failed to fetch donations. Please try again.");
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleUpdateStatus = async (donationId: number, newStatus: string) => {
    setLoading(true);
    try {
      // Update donation status
      const { data: statusResult } = await axios.post(
        `${API_BASE_URL}/updateStatus`,
        { donation_id: donationId, new_status: newStatus },
        { params: { hospital_id: HOSPITAL_ID } }
      );
      console.log(statusResult.message);

      // Send certificate if status is "Complete"
      if (newStatus === "Complete") {
        const { data: certificateResult } = await axios.post(
          `${API_BASE_URL}/sendCertificate`,
          { donation_id: donationId, hospital_name: "City General Hospital" },
          { params: { hospital_id: HOSPITAL_ID } }
        );
        console.log(certificateResult.message);
        alert(certificateResult.message);
      }

      await fetchDonations();
    } catch (error) {
      console.error("Error:", error);
      alert(`Failed to process request: ${(error as Error).message}`);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const fetchCertificatePreview = async (donationId: number) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/certificatePreview/${donationId}`,
        {
          params: {
            hospital_id: HOSPITAL_ID,
            hospital_name: "City General Hospital",
          },
        }
      );

      if (data.success) {
        setCertificateHtml(DOMPurify.sanitize(data.html));
        setIsCertificateModalOpen(true);
      } else {
        throw new Error("Certificate preview not available");
      }
    } catch (error) {
      console.error("Error fetching certificate preview:", error);
      alert("Failed to load certificate preview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = (donation: Donation) => {
    setSelectedDonor(donation);
    setIsModalOpen(true);
  };

  const handleDelete = async (donor_id: number) => {
    if (confirm("Are you sure you want to delete this donor?")) {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/donors/${donor_id}?hospital_id=${HOSPITAL_ID}`
        );

        alert(response.data.message || "Donor deactivated successfully");

        // Refresh donor list after delete
        fetchDonations();
      } catch (err) {
        console.error("Error deleting donor", err);
        alert("Failed to delete donor. Please try again.");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDonor(null);
  };

  const closeCertificateModal = () => {
    setIsCertificateModalOpen(false);
    setCertificateHtml("");
  };

  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return "N/A";
    try {
      return new Date(dateTime).toLocaleString();
    } catch (error) {
      return dateTime;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Complete":
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case "Reject":
        return <XCircleIcon className="h-4 w-4 text-red-600" />;
      default:
        return <ClockIcon className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getDateLabel = (status: string) => {
    return status === "Complete" ? "Completion Date" : "Donation Date";
  };

  const filteredDonations = donations.filter(
    (donation) =>
      donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.blood_group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <UsersIcon className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">
            Donation Management
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search donations by donor name or blood group..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonations.map((donation) => (
                <tr key={donation.donation_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {donation.donor_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {donation.blood_group}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {donation.phone_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDateTime(donation.donate_date)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getDateLabel(donation.donate_status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(donation.donate_status)}
                      <span
                        className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          donation.donate_status === "Complete"
                            ? "bg-green-100 text-green-800"
                            : donation.donate_status === "Reject"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {donation.donate_status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 ">
                      <Eye
                        className="h-4 w-4 cursor-pointer mr-3"
                        onClick={() => handleShowDetails(donation)}
                      />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <TrashIcon
                        className="h-4 w-4"
                        onClick={() => handleDelete(donation.donor_id)}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">{filteredDonations.length}</span> of{" "}
            <span className="font-medium">{donations.length}</span> donations
          </div>
          <div className="flex-1 flex justify-end">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      {isModalOpen && selectedDonor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Donor Details</h2>
              <button onClick={closeModal}>
                <XIcon className="h-6 w-6 text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="font-medium text-gray-700">Donor Name:</span>{" "}
                {selectedDonor.donor_name}
              </div>
              <div>
                <span className="font-medium text-gray-700">Blood Group:</span>{" "}
                {selectedDonor.blood_group}
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>{" "}
                {selectedDonor.email || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-700">Phone Number:</span>{" "}
                {selectedDonor.phone_number}
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Last Donation Date:
                </span>{" "}
                {selectedDonor.last_donation_date || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  {getDateLabel(selectedDonor.donate_status)}:
                </span>{" "}
                {formatDateTime(selectedDonor.donate_date)}
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-700">Status:</span>
                <div className="flex items-center ml-2">
                  {getStatusIcon(selectedDonor.donate_status)}
                  <span className="ml-1">{selectedDonor.donate_status}</span>
                </div>
              </div>
              {selectedDonor.donate_status === "Complete" && (
                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <div className="flex items-center text-green-800 text-sm">
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    <span className="font-medium">Donation completed on:</span>
                  </div>
                  <div className="text-green-700 font-medium mt-1">
                    {formatDateTime(selectedDonor.donate_date)}
                  </div>
                </div>
              )}
            </div>

            {selectedDonor.donate_status === "Complete" && (
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600 disabled:opacity-50"
                  disabled={loading}
                  onClick={() =>
                    fetchCertificatePreview(selectedDonor.donation_id)
                  }
                >
                  <BookMarked className="h-4 w-4 mr-1" />
                  View Certificate
                </button>
                <button
                  className="bg-purple-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-purple-600 disabled:opacity-50"
                  disabled={loading}
                  onClick={async () => {
                    try {
                      const response = await fetch(
                        `${API_BASE_URL}/sendCertificate?hospital_id=${HOSPITAL_ID}`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            donation_id: selectedDonor.donation_id,
                            hospital_name: "City General Hospital",
                          }),
                        }
                      );
                      if (!response.ok) {
                        throw new Error("Failed to send certificate");
                      }
                      const result = await response.json();
                      alert(result.message);
                    } catch (error) {
                      console.error("Error sending certificate:", error);
                      alert("Failed to send certificate. Please try again.");
                    }
                  }}
                >
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Send Certificate
                </button>
              </div>
            )}

            {selectedDonor.donate_status !== "Complete" &&
              selectedDonor.donate_status !== "Reject" && (
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center disabled:opacity-50"
                    disabled={loading}
                    onClick={async () => {
                      await handleUpdateStatus(
                        selectedDonor.donation_id,
                        "Complete"
                      );
                      closeModal();
                    }}
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Mark as Complete
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center disabled:opacity-50"
                    disabled={loading}
                    onClick={async () => {
                      await handleUpdateStatus(
                        selectedDonor.donation_id,
                        "Reject"
                      );
                      closeModal();
                    }}
                  >
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    Mark as Reject
                  </button>
                </div>
              )}

            {loading && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center px-4 py-2 font-medium text-blue-600">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Updating...
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isCertificateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Donation Certificate Preview
              </h2>
              <button onClick={closeCertificateModal}>
                <XIcon className="h-6 w-6 text-gray-600 hover:text-gray-800" />
              </button>
            </div>
            <div
              className="certificate-preview"
              dangerouslySetInnerHTML={{ __html: certificateHtml }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Donors;
