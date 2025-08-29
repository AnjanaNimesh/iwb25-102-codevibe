import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Save, Edit, X, Check } from 'lucide-react';

// Types
interface ProfileDetails {
  admin_email: string;
  password_hash: string;
}

interface UpdateProfileRequest {
  new_email?: string;
  new_password?: string;
  confirm_password?: string;
}

interface ApiResponse {
  status: string;
  message: string;
  updated_field?: string;
}

// API Service
const profileService = {
  async getProfile(): Promise<ProfileDetails[]> {
    const response = await fetch('http://localhost:9092/dashboard/admin/profile', {
      method: 'GET',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    return response.json();
  },

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse> {
    const response = await fetch('http://localhost:9092/dashboard/admin/profile', {
      method: 'POST',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.statusText}`);
    }

    return response.json();
  },
};

// Main Profile Component
const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateType, setUpdateType] = useState<'success' | 'error' | ''>('');

  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const profileData = await profileService.getProfile();
      if (profileData && profileData.length > 0) {
        setProfile(profileData[0]);
        setNewEmail(profileData[0].admin_email);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string, confirm: string): boolean => {
    if (password && password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    if (password && password !== confirm) {
      setPasswordError('Password and confirm password do not match');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSave = async () => {
    if (!profile) return;

    // Reset messages
    setUpdateMessage('');
    setUpdateType('');

    // Validate inputs
    const isEmailValid = validateEmail(newEmail);
    const isPasswordValid = validatePassword(newPassword, confirmPassword);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    // Check if anything changed
    const emailChanged = newEmail !== profile.admin_email;
    const passwordChanged = newPassword.trim() !== '';

    if (!emailChanged && !passwordChanged) {
      setUpdateMessage('No changes detected');
      setUpdateType('error');
      return;
    }

    try {
      setUpdateLoading(true);
      
      const updateData: UpdateProfileRequest = {};
      
      if (emailChanged) {
        updateData.new_email = newEmail;
      }
      
      if (passwordChanged) {
        updateData.new_password = newPassword;
        updateData.confirm_password = confirmPassword;
      }

      const result = await profileService.updateProfile(updateData);
      
      if (result.status === 'success') {
        setUpdateMessage(result.message);
        setUpdateType('success');
        setIsEditing(false);
        
        // Clear password fields
        setNewPassword('');
        setConfirmPassword('');
        
        // Reload profile to get updated data
        await loadProfile();
      } else {
        setUpdateMessage(result.message);
        setUpdateType('error');
      }
    } catch (err) {
      setUpdateMessage(err instanceof Error ? err.message : 'Failed to update profile');
      setUpdateType('error');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setNewEmail(profile.admin_email);
    }
    setNewPassword('');
    setConfirmPassword('');
    setEmailError('');
    setPasswordError('');
    setUpdateMessage('');
    setUpdateType('');
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="flex items-center space-x-3 text-red-600 mb-4">
            <X className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Error Loading Profile</h2>
          </div>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={loadProfile}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-full p-3">
                <User className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Profile</h1>
                <p className="text-blue-100">Manage your account settings</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Update Message */}
            {updateMessage && (
              <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
                updateType === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {updateType === 'success' ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <X className="h-5 w-5" />
                )}
                <span>{updateMessage}</span>
              </div>
            )}

            {/* Profile Form */}
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                      isEditing 
                        ? 'bg-white border-gray-300' 
                        : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                    } ${emailError ? 'border-red-500' : ''}`}
                    placeholder="Enter your email address"
                  />
                </div>
                {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
              </div>

              {/* Password Field */}
              {isEditing && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="inline h-4 w-4 mr-2" />
                    New Password (optional)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 pr-12 ${
                        passwordError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter new password (leave empty to keep current)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password Field */}
              {isEditing && newPassword && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="inline h-4 w-4 mr-2" />
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 pr-12 ${
                        passwordError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:to-pink-700 transition duration-200"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-200"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={updateLoading}
                      className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updateLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      <span>{updateLoading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;