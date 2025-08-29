// import React from "react";
// import { Outlet } from "react-router-dom";
// import AdminSidebar from "../components/AdminSidebar";
// import AdminNavBar from "../pages/admin/components/AdminNavbar";

// const Admin: React.FC = () => {
//   return (
//     <div className="flex flex-col min-h-screen bg-white">
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <AdminSidebar />

//         {/* Main content */}
//         <div className="flex-1 overflow-auto">
//           <div className="bg-gray-50">
//             <Outlet />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Admin;





import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavBar from "../pages/admin/components/AdminNavbar";

const Admin: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-red-50 via-white to-pink-50">
        {/* Navbar (not fixed) */}
        <div>
          <AdminNavBar />
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;

