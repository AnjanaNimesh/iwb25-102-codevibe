import { Outlet } from "react-router-dom";
import Sidebar from "../pages/hospital/components/Sidebar";

const Hospital = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

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

export default Hospital;
