import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MdSpaceDashboard,
  MdContactSupport,
  MdBloodtype,
} from "react-icons/md";
import { FaHospitalAlt, FaHospitalUser } from "react-icons/fa";
import { RiHospitalFill } from "react-icons/ri";
import { BiSolidDonateBlood } from "react-icons/bi";
import { AiOutlineMenu, AiOutlineLogout, AiOutlineClose } from "react-icons/ai";


// Import the auth context
import { useAuth } from "../contexts/AuthContext"; 

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
}

const AdminSidebar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use auth context
  const { user, logout } = useAuth();

  useEffect(() => {
    // Close sidebar on route change
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      //navigate to login even if logout request fails
      navigate("/login", { replace: true });
    }
  };

  const menuItems: MenuItem[] = [
    { icon: <MdSpaceDashboard size={18} />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <FaHospitalAlt size={18} />, label: "Add Hospitals", path: "/admin/addHospital" },
    { icon: <FaHospitalUser size={18} />, label: "Add Hospital Users", path: "/admin/addHospitalUsers" },
    { icon: <RiHospitalFill size={18} />, label: "Manage Hospitals", path: "/admin/manageHospitals" },
    { icon: <FaHospitalUser size={18} />, label: "Manage Hospital Users", path: "/admin/manageHosptitalUsers" },
    { icon: <BiSolidDonateBlood size={18} />, label: "Manage Donors", path: "/admin/manageDonors" },
    { icon: <MdBloodtype size={18} />, label: "View Blood Stock", path: "/admin/viewBloodStock" }
  ];

  

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        aria-label="Open menu"
        onClick={() => setMobileOpen(true)}
        className="fixed z-50 p-2 bg-white rounded-md shadow-md top-4 left-4 md:hidden"
      >
        <AiOutlineMenu size={20} />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-transparent bg-opacity-60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        tabIndex={-1}
        className={`fixed md:static z-50 flex flex-col bg-white border-r border-gray-200 shadow-lg md:shadow-none transition-transform duration-300 w-56
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          h-full
          overflow-y-auto
        `}
        aria-label="Admin Sidebar Navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-red-700">🩸LifeDrop - Admin</h1>
          {mobileOpen && (
            <button
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-full md:hidden hover:bg-gray-100"
            >
              <AiOutlineClose size={20} />
            </button>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-grow py-2 space-y-1">
          {menuItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={location.pathname === item.path}
              onClick={() => setMobileOpen(false)} // close menu on link click (mobile)
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="py-2 mt-auto space-y-1 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-left text-gray-700 transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-red-600"
          >
            <AiOutlineLogout size={20} />
            <span className="ml-3 text-sm font-medium">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

interface NavItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, path, active, onClick, ...props }) => {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={`flex items-center px-4 py-3 w-full text-left transition-colors duration-150 rounded-md ${
        active ? "bg-gradient-to-r from-red-600 to-pink-600 text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
      {...props}
    >
      {icon}
      <span className="ml-3 text-sm font-medium">{label}</span>
    </Link>
  );
};

export default AdminSidebar;