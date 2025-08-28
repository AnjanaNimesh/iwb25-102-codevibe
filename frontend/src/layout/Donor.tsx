import { Outlet } from "react-router-dom";
import Navbar from "../pages/shared/components/Navbar"
import Footer from "../pages/shared/components/Footer";

const Donor = () => {
  return (
    // <div className="flex flex-col min-h-screen bg-white">
    //   <div className="flex flex-1">
    //     {/* Navbar */}
    //     <Navbar />

    //     {/* Main content */}
    //     {/* <div className="flex-1 overflow-auto"> */}
    //       {/* <div className="bg-gray-50"> */}
    //       <div></div>
    //       <Outlet />
    //       {/* </div> */}
    //     {/* </div> */}
    //   </div>

    //   <Footer />
    // </div>
    <div>
      <Navbar/>
      <Outlet />
      <Footer/>
    </div>
  );
};

export default Donor;
