import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Admin from "./layout/Admin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Hospital from "./layout/Hospital";
import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import Home from "./pages/shared/Home";
import Donor from "./layout/Donor";
import DonorDashboard from "./pages/donor/DonorDashboard";
import AddHospitals from "./pages/admin/AddHospitals";
import AddHospitalUsers from "./pages/admin/AddHospitalUsers";
import ManageDonors from "./pages/admin/ManageDonors";
import ManageHospitals from "./pages/admin/ManageHospitals";
import ManageHospitalUsers from "./pages/admin/ManageHospitalUsers";
import SystemNotifications from "./pages/admin/SystemNotifications";
import ViewBloodStock from "./pages/admin/ViewBloodStock";
import Donors from "./pages/hospital/Donors";
import BloodStock from "./pages/hospital/BloodStock";
import PatientRequests from "./pages/hospital/PatientRequests";
import Campaigns from "./pages/hospital/Campaigns";
import { BloodDonationEligibilityForm } from "./pages/donor/BloodDonationEligibilityForm";

function App() {
  return (
    <Router>
      <Routes>
        {/* Shared pages */}
        <Route path="/" element={<Home />} />

        {/* Admin layout & pages */}
        <Route path="/admin" element={<Admin />}>
          <Route path="" element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="addHospital" element={<AddHospitals />} />
          <Route path="addHospitalUsers" element={<AddHospitalUsers />} />
          <Route path="manageHospitals" element={<ManageHospitals />} />
          <Route
            path="manageHosptitalUsers"
            element={<ManageHospitalUsers />}
          />
          <Route path="manageDonors" element={<ManageDonors />} />
          <Route path="systemNotifications" element={<SystemNotifications />} />
          <Route path="viewBloodStock" element={<ViewBloodStock />} />
        </Route>

        {/* Hospital layout & pages */}
        <Route path="/hospital" element={<Hospital />}>
          <Route path="" element={<HospitalDashboard />} />
          <Route path="dashboard" element={<HospitalDashboard />} />
          <Route path="donors" element={<Donors />} />
          <Route path="blood-stock" element={<BloodStock />} />
          <Route path="patient-requests" element={<PatientRequests />} />
          <Route path="campaigns" element={<Campaigns />} />
        </Route>

        {/* Donor layout & pages */}
        <Route path="/donor" element={<Donor />}>
          <Route path="" element={<DonorDashboard />} />
          <Route path="dashboard" element={<DonorDashboard />} />
          <Route path="form" element={<BloodDonationEligibilityForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
