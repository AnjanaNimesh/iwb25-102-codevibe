import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Plus,
  Edit,
  Trash,
  Search,
} from 'lucide-react';

interface Campaign {
  campaign_id: number;
  title: string;
  location: string;
  date: string;
  status: string;
}

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editCampaignId, setEditCampaignId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    location: '',
    date: '',
    image: null as File | null,
  });
  // New state for image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const hospitalId = 1; // Hardcoded for demo; replace with dynamic value in production

  // Fetch campaigns on component mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Clean up image preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:9090/hospital/bloodcampaigns?hospital_id=${hospitalId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError(`Failed to fetch campaigns: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!newCampaign.title.trim()) {
      setError('Campaign title is required');
      return false;
    }
    if (!newCampaign.location.trim()) {
      setError('Location is required');
      return false;
    }
    if (!newCampaign.date) {
      setError('Date is required');
      return false;
    }
    if (!showEditForm && !newCampaign.image) {
      setError('Image is required for new campaigns');
      return false;
    }
    
    const selectedDate = new Date(newCampaign.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isNaN(selectedDate.getTime())) {
      setError('Invalid date format');
      return false;
    }
    
    if (selectedDate < today) {
      setError('Campaign date cannot be in the past');
      return false;
    }
    
    if (newCampaign.image) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(newCampaign.image.type)) {
        setError('Only JPEG and PNG images are allowed');
        return false;
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (newCampaign.image.size > maxSize) {
        setError('Image size must be less than 5MB');
        return false;
      }
    }
    
    setError(null);
    return true;
  };

  const addCampaign = async () => {
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('title', newCampaign.title.trim());
    formData.append('location', newCampaign.location.trim());
    formData.append('date', newCampaign.date);
    
    if (newCampaign.image) {
      formData.append('image', newCampaign.image);
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:9090/hospital/bloodcampaigns/add?hospital_id=${hospitalId}`, {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(result.message || 'Campaign added successfully!');
        setShowAddForm(false);
        setNewCampaign({ title: '', location: '', date: '', image: null });
        setImagePreview(null); // Clear preview
        await fetchCampaigns();
      } else {
        const errorMsg = result.message || `HTTP ${response.status}: Failed to add campaign`;
        setError(errorMsg);
        alert(errorMsg);
      }
    } catch (error) {
      console.error('Error adding campaign:', error);
      const errorMsg = `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const editCampaign = async () => {
    if (!validateForm() || !editCampaignId) {
      return;
    }

    const formData = new FormData();
    formData.append('title', newCampaign.title.trim());
    formData.append('location', newCampaign.location.trim());
    formData.append('date', newCampaign.date);
    
    if (newCampaign.image) {
      formData.append('image', newCampaign.image);
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:9090/hospital/bloodcampaigns/${editCampaignId}?hospital_id=${hospitalId}`, {
        method: 'PUT',
        body: formData,
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(result.message || 'Campaign updated successfully!');
        setShowEditForm(false);
        setNewCampaign({ title: '', location: '', date: '', image: null });
        setImagePreview(null); // Clear preview
        setEditCampaignId(null);
        await fetchCampaigns();
      } else {
        const errorMsg = result.message || `HTTP ${response.status}: Failed to update campaign`;
        setError(errorMsg);
        alert(errorMsg);
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
      const errorMsg = `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCampaign = async (campaignId: number) => {
    if (!window.confirm('Are you sure you want to deactivate this campaign?')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:9090/hospital/bloodcampaigns/${campaignId}?hospital_id=${hospitalId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(result.message || 'Campaign deactivated successfully!');
        await fetchCampaigns();
      } else {
        const errorMsg = result.message || `HTTP ${response.status}: Failed to deactivate campaign`;
        setError(errorMsg);
        alert(errorMsg);
      }
    } catch (error) {
      console.error('Error deactivating campaign:', error);
      const errorMsg = `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditCampaign = (campaign: Campaign) => {
    setNewCampaign({
      title: campaign.title,
      location: campaign.location,
      date: campaign.date,
      image: null,
    });
    // Set preview to existing image URL
    setImagePreview(`http://localhost:9090/hospital/bloodcampaigns/image/${campaign.campaign_id}?hospital_id=${hospitalId}`);
    setEditCampaignId(campaign.campaign_id);
    setShowEditForm(true);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG and PNG images are allowed');
        e.target.value = '';
        return;
      }
      
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('Image size must be less than 5MB');
        e.target.value = '';
        return;
      }
      
      // Revoke previous preview URL if it exists
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      // Set new preview URL
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    } else {
      // Clear preview if no file is selected
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
    setNewCampaign({ title: '', location: '', date: '', image: null });
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setEditCampaignId(null);
    setError(null);
  };

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="h-6 w-6 text-red-500 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">
            Blood Donation Campaigns
          </h1>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setError(null);
          }}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Campaign
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {isLoading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          Loading...
        </div>
      )}

      {/* Add Campaign Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Campaign</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Community Blood Drive"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCampaign.title}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, title: e.target.value })
                }
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                placeholder="e.g. City General Hospital"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCampaign.location}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, location: e.target.value })
                }
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image * (JPEG/PNG, max 5MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="h-32 w-32 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/128?text=No+Image';
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Date *
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCampaign.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, date: e.target.value })
                }
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300 transition-colors disabled:opacity-50"
              onClick={cancelForm}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={addCampaign}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Campaign'}
            </button>
          </div>
        </div>
      )}

      {/* Edit Campaign Form */}
      {showEditForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">Edit Campaign</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Community Blood Drive"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCampaign.title}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, title: e.target.value })
                }
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                placeholder="e.g. City General Hospital"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCampaign.location}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, location: e.target.value })
                }
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image (optional - JPEG/PNG, max 5MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="h-32 w-32 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/128?text=No+Image';
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Date *
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCampaign.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, date: e.target.value })
                }
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300 transition-colors disabled:opacity-50"
              onClick={cancelForm}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={editCampaign}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Campaign'}
            </button>
          </div>
        </div>
      )}

      {/* Campaigns List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search campaigns by title or location..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
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
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {isLoading ? 'Loading campaigns...' : 'No campaigns found'}
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <tr key={campaign.campaign_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {campaign.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {campaign.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={`http://localhost:9090/hospital/bloodcampaigns/image/${campaign.campaign_id}?hospital_id=${hospitalId}`}
                        alt={campaign.title}
                        className="h-10 w-10 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/40?text=No+Image';
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {new Date(campaign.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          campaign.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50"
                        onClick={() => startEditCampaign(campaign)}
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        onClick={() => deleteCampaign(campaign.campaign_id)}
                        disabled={isLoading}
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredCampaigns.length}</span> of{' '}
            <span className="font-medium">{campaigns.length}</span> campaigns
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;