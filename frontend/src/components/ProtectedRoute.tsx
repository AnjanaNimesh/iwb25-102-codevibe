// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   allowedRoles?: ('admin' | 'hospital_user' | 'donor')[];
// }

// // Loading component
// const LoadingSpinner: React.FC = () => (
//   <div className="flex items-center justify-center min-h-screen">
//     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//   </div>
// );

// // Main protected route component
// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
//   children,
//   allowedRoles = [],
// }) => {
//   const { user, isLoading, isAuthenticated } = useAuth();
//   const location = useLocation();

//   // Show loading spinner while checking authentication
//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   // Redirect to login if not authenticated
//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // Check role-based access
//   if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
//     // Redirect to appropriate dashboard based on user role
//     const redirectPath = getRoleBasedDashboard(user.role);
//     return <Navigate to={redirectPath} replace />;
//   }

//   return <>{children}</>;
// };

// // Role-specific protected routes
// export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => (
//   <ProtectedRoute allowedRoles={['admin']}>{children}</ProtectedRoute>
// );

// export const HospitalRoute: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => (
//   <ProtectedRoute allowedRoles={['hospital_user']}>{children}</ProtectedRoute>
// );

// export const DonorRoute: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => (
//   <ProtectedRoute allowedRoles={['donor']}>{children}</ProtectedRoute>
// );

// // Public route (only for non-authenticated users)
// export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { user, isLoading } = useAuth();
  
//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   // If user is authenticated, redirect to their dashboard
//   if (user) {
//     const redirectPath = getRoleBasedDashboard(user.role);
//     return <Navigate to={redirectPath} replace />;
//   }

//   return <>{children}</>;
// };

// // Helper function to get dashboard path based on role
// const getRoleBasedDashboard = (role: string): string => {
//   switch (role) {
//     case 'admin':
//       return '/admin/dashboard';
//     case 'hospital_user':
//       return '/hospital/dashboard';
//     case 'donor':
//       return '/donor/dashboard';
//     default:
//       return '/login';
//   }
// };




import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AccessDenied from './AccessDenied'; // Import the AccessDenied component

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'hospital_user' | 'donor')[];
}

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Main protected route component
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Show AccessDenied component instead of redirecting
    return (
      <AccessDenied 
        userRole={user.role}
        attemptedPath={location.pathname}
        userInfo={{
          name: user.name,
          email: user.email,
          // Add any other user properties you want to display
        }}
      />
    );
  }

  return <>{children}</>;
};

// Role-specific protected routes with AccessDenied
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && user.role !== 'admin') {
    return (
      <AccessDenied 
        userRole={user.role}
        attemptedPath={location.pathname}
        userInfo={{
          name: user.name,
          email: user.email,
        }}
      />
    );
  }

  return <>{children}</>;
};

export const HospitalRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && user.role !== 'hospital_user') {
    return (
      <AccessDenied 
        userRole={user.role}
        attemptedPath={location.pathname}
        userInfo={{
          name: user.name,
          email: user.email,
        }}
      />
    );
  }

  return <>{children}</>;
};

export const DonorRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && user.role !== 'donor') {
    return (
      <AccessDenied 
        userRole={user.role}
        attemptedPath={location.pathname}
        userInfo={{
          name: user.name,
          email: user.email,
        }}
      />
    );
  }

  return <>{children}</>;
};

// Public route (only for non-authenticated users)
export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If user is authenticated, redirect to their dashboard
  if (user) {
    const redirectPath = getRoleBasedDashboard(user.role);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

// Helper function to get dashboard path based on role
const getRoleBasedDashboard = (role: string): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'hospital_user':
      return '/hospital/dashboard';
    case 'donor':
      return '/donor/dashboard';
    default:
      return '/login';
  }
};