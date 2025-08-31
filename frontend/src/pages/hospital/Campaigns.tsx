import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Plus,
  Edit,
  Trash,
  Search,
  AlertCircle,
  Heart,
  Clock,
  Image as ImageIcon,
  X,
  CheckCircle,
  AlertTriangle,
  Eye,
  Filter,
  XIcon,
} from "lucide-react";

interface Campaign {
  campaign_id: number;
  title: string;
  location: string;
  date: string;
  status: string;
}

interface AuthStatus {
  isAuthenticated: boolean;
  userInfo: {
    email?: string;
    hospital_id?: number;
    role?: string;
  };
}

const API_BASE_URL = "http://localhost:9090/hospital";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editCampaignId, setEditCampaignId] = useState<number | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    userInfo: {},
  });
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    location: "",
    date: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: string;
    title: string;
    message: string;
    action: () => void;
  } | null>(null);

  // Check authentication status
  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === "success") {
          setAuthStatus({
            isAuthenticated: true,
            userInfo: data.data,
          });
          return true;
        }
      }

      setAuthStatus({
        isAuthenticated: false,
        userInfo: {},
      });
      setError("Authentication required. Please login first.");
      return false;
    } catch (error) {
      setAuthStatus({
        isAuthenticated: false,
        userInfo: {},
      });
      setError("Failed to verify authentication. Please check your connection.");
      return false;
    }
  };

  // Fetch campaigns
  const fetchCampaigns = async () => {
    if (!authStatus.isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/bloodcampaigns`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Authentication failed. Please login again.");
          setAuthStatus({ isAuthenticated: false, userInfo: {} });
          return;
        }
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data.status === "success" && Array.isArray(data.data)) {
        setCampaigns(data.data);
      } else {
        setCampaigns([]);
      }
    } catch (error) {
      setError(
        `Failed to fetch campaigns: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      setIsLoading(true);
      const isAuthenticated = await checkAuth();
      setIsLoading(false);
    };

    initializeComponent();
  }, []);

  // Fetch campaigns when auth status changes
  useEffect(() => {
    if (authStatus.isAuthenticated) {
      fetchCampaigns();
    }
  }, [authStatus.isAuthenticated]);

  // Clean up image preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Auto-clear messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Show confirmation modal
  const showConfirmation = (type: string, title: string, message: string, action: () => void) => {
    setConfirmAction({ type, title, message, action });
    setIsConfirmModalOpen(true);
  };

  // Handle confirmation
  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction.action();
    }
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
  };

  const validateForm = () => {
    if (!newCampaign.title.trim()) {
      setError("Campaign title is required");
      return false;
    }
    if (!newCampaign.location.trim()) {
      setError("Location is required");
      return false;
    }
    if (!newCampaign.date) {
      setError("Date is required");
      return false;
    }
    if (!showEditForm && !newCampaign.image) {
      setError("Image is required for new campaigns");
      return false;
    }

    const selectedDate = new Date(newCampaign.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("Campaign date cannot be in the past");
      return false;
    }

    if (newCampaign.image) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(newCampaign.image.type)) {
        setError("Only JPEG and PNG images are allowed");
        return false;
      }

      const maxSize = 5 * 1024 * 1024;
      if (newCampaign.image.size > maxSize) {
        setError("Image size must be less than 5MB");
        return false;
      }
    }

    setError(null);
    return true;
  };

  const addCampaign = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("title", newCampaign.title.trim());
    formData.append("location", newCampaign.location.trim());
    formData.append("date", newCampaign.date);
    if (newCampaign.image) {
      formData.append("image", newCampaign.image);
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/bloodcampaigns/add`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        showConfirmation(
          "success",
          "Campaign Created",
          "The campaign has been successfully created!",
          () => {
            setShowAddForm(false);
            setNewCampaign({ title: "", location: "", date: "", image: null });
            setImagePreview(null);
            fetchCampaigns();
          }
        );
      } else {
        setError(result.message || "Failed to add campaign");
      }
    } catch (error) {
      setError(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const editCampaign = async () => {
    if (!validateForm() || !editCampaignId) return;

    const formData = new FormData();
    formData.append("title", newCampaign.title.trim());
    formData.append("location", newCampaign.location.trim());
    formData.append("date", newCampaign.date);
    if (newCampaign.image) {
      formData.append("image", newCampaign.image);
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/bloodcampaigns/${editCampaignId}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        showConfirmation(
          "success",
          "Campaign Updated",
          "The campaign has been successfully updated!",
          () => {
            setShowEditForm(false);
            setNewCampaign({ title: "", location: "", date: "", image: null });
            setImagePreview(null);
            setEditCampaignId(null);
            fetchCampaigns();
          }
        );
      } else {
        setError(result.message || "Failed to update campaign");
      }
    } catch (error) {
      setError(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCampaign = async (campaignId: number) => {
    const campaign = campaigns.find(c => c.campaign_id === campaignId);
    if (!campaign) return;

    showConfirmation(
      "warning",
      "Delete Campaign",
      `Are you sure you want to delete the campaign "${campaign.title}"? This action cannot be undone.`,
      async () => {
        try {
          setIsLoading(true);
          setError(null);

          const response = await fetch(
            `${API_BASE_URL}/bloodcampaigns/${campaignId}`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );

          const result = await response.json();

          if (response.ok) {
            showConfirmation(
              "success",
              "Campaign Deleted",
              result.message || "The campaign has been successfully deleted.",
              () => {
                fetchCampaigns();
              }
            );
          } else {
            setError(result.message || "Failed to delete campaign");
          }
        } catch (error) {
          setError(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  const startEditCampaign = (campaign: Campaign) => {
    setNewCampaign({
      title: campaign.title,
      location: campaign.location,
      date: campaign.date,
      image: null,
    });
    setImagePreview(`${API_BASE_URL}/bloodcampaigns/image/${campaign.campaign_id}`);
    setEditCampaignId(campaign.campaign_id);
    setShowEditForm(true);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPEG and PNG images are allowed");
        e.target.value = "";
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("Image size must be less than 5MB");
        e.target.value = "";
        return;
      }

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    } else {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
    }
    setNewCampaign({ ...newCampaign, image: file });
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setNewCampaign({ title: "", location: "", date: "", image: null });
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setEditCampaignId(null);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
  };

  const handleShowDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'long'
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "inactive":
        return <XIcon className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1";
    switch (status?.toLowerCase()) {
      case "active":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "inactive":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = 
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === "All" || campaign.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status?.toLowerCase() === "active").length,
    inactive: campaigns.filter(c => c.status?.toLowerCase() === "inactive").length,
    upcoming: campaigns.filter(c => new Date(c.date) > new Date()).length,
  };

  if (!authStatus.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl border border-red-100 max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please login to access the campaign management system.
          </p>
          <button className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold">
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-red-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Campaign Management
                </h1>
                <p className="text-gray-600">Organize blood donation campaigns</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* <button 
                onClick={() => fetchCampaigns()}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button> */}
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setError(null);
                }}
                disabled={isLoading}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg flex items-center hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-gray-500 text-sm">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-gray-500 text-sm">Active</p>
                <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-gray-500 text-sm">Upcoming</p>
                <p className="text-2xl font-bold text-gray-800">{stats.upcoming}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XIcon className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-gray-500 text-sm">Inactive</p>
                <p className="text-2xl font-bold text-gray-800">{stats.inactive}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Toast */}
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

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-red-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by title or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
              </div>
            </div>
            <div className="relative">
              <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
              >
                <option value="All">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add Campaign Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-red-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Create New Campaign</h2>
              <button
                onClick={cancelForm}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Community Blood Drive"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    value={newCampaign.title}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, title: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. City General Hospital"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    value={newCampaign.location}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, location: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Campaign Date *
                  </label>
                  <input
                    type="date"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    value={newCampaign.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, date: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Campaign Image * (JPEG/PNG, max 5MB)
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-red-300 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (imagePreview) URL.revokeObjectURL(imagePreview);
                          setImagePreview(null);
                          setNewCampaign({ ...newCampaign, image: null });
                        }}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <label className="cursor-pointer">
                          <span className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors inline-block">
                            Choose Image
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isLoading}
                          />
                        </label>
                        <p className="text-sm text-gray-500 mt-2">Upload campaign image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                onClick={cancelForm}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-colors font-semibold disabled:opacity-50 shadow-md"
                onClick={addCampaign}
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Campaign"}
              </button>
            </div>
          </div>
        )}

        {/* Edit Campaign Form */}
        {showEditForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-red-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Edit Campaign</h2>
              <button
                onClick={cancelForm}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Community Blood Drive"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    value={newCampaign.title}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, title: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. City General Hospital"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    value={newCampaign.location}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, location: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Campaign Date *
                  </label>
                  <input
                    type="date"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    value={newCampaign.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, date: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Campaign Image (optional - JPEG/PNG, max 5MB)
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-red-300 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/128?text=No+Image";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (imagePreview) URL.revokeObjectURL(imagePreview);
                          setImagePreview(null);
                          setNewCampaign({ ...newCampaign, image: null });
                        }}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <label className="cursor-pointer">
                          <span className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors inline-block">
                            Choose New Image
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isLoading}
                          />
                        </label>
                        <p className="text-sm text-gray-500 mt-2">Keep current or upload new image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                onClick={cancelForm}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-colors font-semibold disabled:opacity-50 shadow-md"
                onClick={editCampaign}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Campaign"}
              </button>
            </div>
          </div>
        )}

        {/* Campaigns Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-red-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-red-50 to-red-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Campaign</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCampaigns.map((campaign, index) => (
                  <tr 
                    key={campaign.campaign_id} 
                    className={`hover:bg-red-25 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {campaign.title.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{campaign.title}</div>
                          <div className="text-sm text-gray-500">ID: #{campaign.campaign_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-red-400 flex-shrink-0" />
                        <span className="truncate max-w-xs">{campaign.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <img
                          src={`${API_BASE_URL}/bloodcampaigns/image/${campaign.campaign_id}`}
                          alt={campaign.title}
                          className="h-12 w-12 object-cover rounded-xl shadow-md border-2 border-red-100"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/48?text=No+Image";
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(campaign.date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(campaign.status)}>
                        {getStatusIcon(campaign.status)}
                        {campaign.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditCampaign(campaign)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit Campaign"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteCampaign(campaign.campaign_id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Campaign"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No campaigns found</p>
                <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Campaign Details Modal */}
        {isModalOpen && selectedCampaign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-blue-600" />
                  Campaign Details
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-600">Campaign Title</label>
                  <p className="text-gray-800">{selectedCampaign.title}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-600">Location</label>
                  <p className="text-gray-800 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-red-400" />
                    {selectedCampaign.location}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-600">Campaign Date</label>
                  <p className="text-gray-800 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                    {formatDate(selectedCampaign.date)}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-600">Status</label>
                  <p className="text-gray-800">
                    <span className={getStatusBadge(selectedCampaign.status)}>
                      {getStatusIcon(selectedCampaign.status)}
                      {selectedCampaign.status || 'Unknown'}
                    </span>
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-600">Campaign Image</label>
                  <div className="mt-2">
                    <img
                      src={`${API_BASE_URL}/bloodcampaigns/image/${selectedCampaign.campaign_id}`}
                      alt={selectedCampaign.title}
                      className="w-full h-32 object-cover rounded-lg border-2 border-red-100"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/300x128?text=No+Image";
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => {
                    closeModal();
                    startEditCampaign(selectedCampaign);
                  }}
                  className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  <Edit className="h-4 w-4" />
                  Edit Campaign
                </button>
                <button
                  onClick={() => {
                    closeModal();
                    deleteCampaign(selectedCampaign.campaign_id);
                  }}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  <Trash className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
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
                
                <p className="text-gray-600 mb-6">
                  {confirmAction.message}
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setIsConfirmModalOpen(false);
                      setConfirmAction(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`flex-1 py-3 px-4 rounded-lg transition-colors font-semibold ${
                      confirmAction.type === "success"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : confirmAction.type === "warning"
                        ? "bg-yellow-600 text-white hover:bg-yellow-700"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                <span className="text-gray-800 font-medium">Processing...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;