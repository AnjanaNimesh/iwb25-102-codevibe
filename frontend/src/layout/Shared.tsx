import Navbar from "../pages/shared/components/Navbar"
import { Outlet } from "react-router-dom";
import Footer from "../pages/shared/components/Footer";

const Shared = () => {
  return (
    <div>
      <Navbar/>
      <Outlet />
      <Footer/>
    </div>
  );
};

export default Shared;