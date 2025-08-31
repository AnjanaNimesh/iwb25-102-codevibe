

import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HeartIcon,
  HomeIcon,
  UsersIcon,
  DropletIcon,
  ActivityIcon,
  LogOutIcon,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext"; 

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path
      ? "bg-red-50 text-red-600"
      : "text-gray-700 hover:bg-gray-100";
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <HeartIcon className="h-6 w-6 text-red-500" />
          <h1 className="ml-2 text-xl font-bold text-gray-800">Blood Bank</h1>
        </div>
      </div>
      <nav className="mt-4 flex flex-col h-[calc(100%-80px)]">
        <Link
          to="/hospital/dashboard"
          className={`flex items-center px-4 py-3 ${isActive("/hospital/dashboard")}`}
        >
          <HomeIcon className="h-5 w-5 mr-3" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/hospital/donors"
          className={`flex items-center px-4 py-3 ${isActive("/hospital/donors")}`}
        >
          <UsersIcon className="h-5 w-5 mr-3" />
          <span>Donors</span>
        </Link>
        <Link
          to="/hospital/blood-stock"
          className={`flex items-center px-4 py-3 ${isActive("/hospital/blood-stock")}`}
        >
          <DropletIcon className="h-5 w-5 mr-3" />
          <span>Blood Stock</span>
        </Link>
        <Link
          to="/hospital/patient-requests"
          className={`flex items-center px-4 py-3 ${isActive("/hospital/patient-requests")}`}
        >
          <HeartIcon className="h-5 w-5 mr-3" />
          <span>Patient Requests</span>
        </Link>
        <Link
          to="/hospital/campaigns"
          className={`flex items-center px-4 py-3 ${isActive("/hospital/campaigns")}`}
        >
          <ActivityIcon className="h-5 w-5 mr-3" />
          <span>Campaigns</span>
        </Link>
        <button
          onClick={handleLogout}
          className={`flex items-center px-4 py-3 mt-auto text-gray-700 hover:bg-gray-100 ${isActive("/logout")}`}
        >
          <LogOutIcon className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;