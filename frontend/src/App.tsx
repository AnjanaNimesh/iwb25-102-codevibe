import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Admin from './layout/Admin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Hospital from './layout/Hospital';
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import Home from './pages/shared/Home';
import Donor from './layout/Donor';
import DonorDashboard from './pages/donor/DonorDashboard';
import AddHospitals from "./pages/admin/AddHospitals";
import AddHospitalUsers from "./pages/admin/AddHospitalUsers";
import ManageDonors from "./pages/admin/ManageDonors";
import ManageHospitals from "./pages/admin/ManageHospitals";
import ManageHospitalUsers from "./pages/admin/ManageHospitalUsers";
import SystemNotifications from "./pages/admin/SystemNotifications";
import ViewBloodStock from "./pages/admin/ViewBloodStock";



function App() {
  return (
    <Router>
      <Routes>
        {/* Shared pages */}
        <Route path="/" element={<Home />} />

        {/* Admin layout & pages */}
        <Route path="/admin" element={<Admin />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="addHospital" element={<AddHospitals/>} />
          <Route path="addHospitalUsers" element={<AddHospitalUsers/>} />
          <Route path="manageHospitals" element={<ManageHospitals/>} />
          <Route path="manageHosptitalUsers" element ={<ManageHospitalUsers/>}/>
          <Route path="manageDonors" element={<ManageDonors />} />
          <Route path="systemNotifications" element={<SystemNotifications/>}/> 
          <Route path="viewBloodStock" element ={<ViewBloodStock/>} />     
        </Route>

        {/* Hospital layout & pages */}
        <Route path="/hospital" element={<Hospital />}>
          <Route path="dashboard" element={<HospitalDashboard />} />
        </Route>

        {/* Donor layout & pages */}
        <Route path="/donor" element={<Donor />}>
          <Route path="dashboard" element={<DonorDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
