// src/layout/Admin.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const Admin: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="bg-gray-50">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
