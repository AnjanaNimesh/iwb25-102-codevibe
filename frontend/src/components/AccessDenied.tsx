import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Stethoscope, Settings, Heart, Lock, Home, HelpCircle } from 'lucide-react';

// Type definitions
interface AccessDeniedProps {
  userRole: 'admin' | 'hospital_user' | 'donor';
  attemptedPath: string;
  userInfo?: {
    name?: string;
    email?: string;
    [key: string]: any;
  };
}

interface RoleConfig {
  name: string;
  icon: React.ReactNode;
  color: string;
  dashboardPath: string;
  description: string;
}

interface AccessError {
  title: string;
  message: string;
  reason: string;
  suggestion: string;
  severity: 'high' | 'medium' | 'low';
}

// AccessDenied Component
const AccessDenied: React.FC<AccessDeniedProps> = ({ 
  userRole, 
  attemptedPath, 
  userInfo = {} 
}) => {
  const navigate = useNavigate();

  // Define role configurations
  const roleConfig: Record<string, RoleConfig> = {
    admin: {
      name: 'System Administrator',
      icon: <Settings className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-800',
      dashboardPath: '/admin/dashboard',
      description: 'System Administration'
    },
    hospital_user: {
      name: 'Hospital Staff',
      icon: <Stethoscope className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-800',
      dashboardPath: '/hospital/dashboard',
      description: 'Hospital Management'
    },
    donor: {
      name: 'Blood Donor',
      icon: <Heart className="w-5 h-5" />,
      color: 'bg-red-100 text-red-800',
      dashboardPath: '/donor/dashboard',
      description: 'Donor Portal'
    }
  };

  // Define route access rules and messages
  const getAccessError = (userRole: string, path: string): AccessError => {
    // Admin routes
    if (path.startsWith('/admin')) {
      if (userRole === 'hospital_user') {
        return {
          title: "Administrative Access Required",
          message: "You're trying to access the system administration panel. This area is restricted to system administrators only.",
          reason: "Hospital staff accounts don't have administrative privileges for security and data integrity reasons.",
          suggestion: "If you need administrative access, please contact your IT department or system administrator.",
          severity: "high"
        };
      }
      if (userRole === 'donor') {
        return {
          title: "Access Restricted - Admin Panel",
          message: "You're attempting to access administrative functions that are not available to donors.",
          reason: "Donor accounts are designed for personal use and don't include system management capabilities.",
          suggestion: "Use your donor dashboard to manage your profile, view donation requests, and check eligibility.",
          severity: "high"
        };
      }
    }

    // Hospital routes
    if (path.startsWith('/hospital')) {
      if (userRole === 'admin') {
        return {
          title: "Hospital Operations Panel",
          message: "You're trying to access the hospital staff interface with an administrator account.",
          reason: "While you have system-wide access, this interface is optimized for hospital operations staff.",
          suggestion: "Use the admin panel to oversee hospital management, or contact the hospital if you need operational access.",
          severity: "medium"
        };
      }
      if (userRole === 'donor') {
        return {
          title: "Hospital Staff Access Required",
          message: "You're trying to access hospital management functions that require medical staff credentials.",
          reason: "This area contains sensitive medical data and operational tools restricted to authorized healthcare professionals.",
          suggestion: "If you're a healthcare worker, please contact your hospital administrator to get proper staff credentials.",
          severity: "high"
        };
      }
    }

    // Donor routes
    if (path.startsWith('/donor')) {
      if (userRole === 'admin') {
        return {
          title: "Donor Portal Access",
          message: "You're trying to access the donor portal with an administrator account.",
          reason: "This interface is designed for individual donors to manage their personal information and donation history.",
          suggestion: "Use the admin panel to manage donors system-wide, or create a separate donor account for personal use.",
          severity: "low"
        };
      }
      if (userRole === 'hospital_user') {
        return {
          title: "Personal Donor Portal",
          message: "You're attempting to access the individual donor interface with a hospital staff account.",
          reason: "This portal is for donors to manage their personal profiles and donation eligibility.",
          suggestion: "Use the hospital management panel to view and manage donors, or create a personal donor account if you wish to donate.",
          severity: "low"
        };
      }
    }

    // Default error
    return {
      title: "Access Denied",
      message: "You don't have permission to access this area of the LifeDrop system.",
      reason: "This page requires different user privileges than your current account provides.",
      suggestion: "Please check your account type or contact system support if you believe this is an error.",
      severity: "medium"
    };
  };

  const currentRole = roleConfig[userRole];
  const error = getAccessError(userRole, attemptedPath);
  
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string): React.ReactNode => {
    switch (severity) {
      case 'high': return <Lock className="w-5 h-5 text-red-600" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'low': return <HelpCircle className="w-5 h-5 text-blue-600" />;
      default: return <Lock className="w-5 h-5 text-gray-600" />;
    }
  };

  if (!currentRole) {
    return <div>Invalid user role</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-pink-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">LifeDrop</h1>
                <p className="text-red-100 text-sm">Access Control Notice</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Error Icon and Title */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                {getSeverityIcon(error.severity)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{error.title}</h2>
                <p className="text-sm text-gray-500">Attempted to access: {attemptedPath}</p>
              </div>
            </div>

            {/* Current User Info */}
            <div className={`rounded-xl p-4 mb-6 ${currentRole.color.replace('text-', 'border-').replace('100', '200')} border-2`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${currentRole.color}`}>
                  {currentRole.icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Currently logged in as: {userInfo.name || currentRole.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Role: {currentRole.description} • Account Type: {userRole}
                  </div>
                </div>
              </div>
            </div>

            {/* Error Details */}
            <div className={`rounded-xl border-2 p-6 mb-6 ${getSeverityColor(error.severity)}`}>
              <h3 className="font-semibold text-gray-900 mb-3">What happened?</h3>
              <p className="text-gray-700 mb-4">{error.message}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => navigate(currentRole.dashboardPath)}
                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Go to My Dashboard</span>
              </button>
            </div>          
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;