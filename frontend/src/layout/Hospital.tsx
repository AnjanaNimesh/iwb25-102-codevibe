// import { Outlet } from "react-router-dom";
// import Sidebar from "../pages/hospital/components/Sidebar";

// const Hospital = () => {
//   return (
//     <div className="flex flex-col min-h-screen bg-white">
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <Sidebar />

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

// export default Hospital;


// // Hospital.tsx
// import { Outlet } from "react-router-dom";
// import Sidebar from "../pages/hospital/components/Sidebar";
// import NavBar from "../pages/hospital/components/NavBar";

// const Hospital = () => {
//   return (
//     <div className="flex min-h-screen bg-white">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main content */}
//       <div className="flex-1 ml-64 overflow-auto bg-gray-50 p-4">
//         <NavBar/>
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default Hospital;



// Hospital.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../pages/hospital/components/Sidebar";
import NavBar from "../pages/hospital/components/NavBar";

const Hospital = () => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar - fixed on left */}
      <div className="fixed top-0 left-0 h-full w-64 bg-white shadow">
        <Sidebar />
      </div>

      {/* Main content wrapper (shifted right by sidebar width) */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* NavBar - fixed on top */}
        <div className="fixed top-0 left-64 right-0 h-16 bg-white shadow z-10">
          <NavBar />
        </div>

        {/* Scrollable content area */}
        <div className="mt-16 p-4 flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Hospital;
