// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Admin from "./layout/Admin";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import Hospital from "./layout/Hospital";
// import HospitalDashboard from "./pages/hospital/HospitalDashboard";
// import Home from "./pages/shared/Home";
// import Donor from "./layout/Donor";
// import DonorDashboard from "./pages/donor/DonorDashboard";
// import AddHospitals from "./pages/admin/AddHospitals";
// import AddHospitalUsers from "./pages/admin/AddHospitalUsers";
// import ManageDonors from "./pages/admin/ManageDonors";
// import ManageHospitals from "./pages/admin/ManageHospitals";
// import ManageHospitalUsers from "./pages/admin/ManageHospitalUsers";
// import SystemNotifications from "./pages/admin/SystemNotifications";
// import ViewBloodStock from "./pages/admin/ViewBloodStock";
// import Donors from "./pages/hospital/Donors";
// import BloodStock from "./pages/hospital/BloodStock";
// import PatientRequests from "./pages/hospital/PatientRequests";
// import Campaigns from "./pages/hospital/Campaigns";
// // import { BloodDonationEligibilityForm } from "./pages/donor/BloodDonationEligibilityForm";
// import { BloodRequestsPage } from "./pages/donor/BloodRequestsPage";
// import { ProfilePage } from "./pages/donor/ProfilePage";
// import { BloodDonationEligibilityForm } from "./pages/donor/BloodDonationEligibilityForm";
// import Login from "./pages/shared/Login";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Shared pages */}
//         <Route path="/" element={<Home />} />,
//         <Route path="/login" element={<Login/>}/>

//         {/* Admin layout & pages */}
//         <Route path="/admin" element={<Admin />}>
//           <Route path="" element={<AdminDashboard />} />
//           <Route path="dashboard" element={<AdminDashboard />} />
//           <Route path="addHospital" element={<AddHospitals />} />
//           <Route path="addHospitalUsers" element={<AddHospitalUsers />} />
//           <Route path="manageHospitals" element={<ManageHospitals />} />
//           <Route
//             path="manageHosptitalUsers"
//             element={<ManageHospitalUsers />}
//           />
//           <Route path="manageDonors" element={<ManageDonors />} />
//           <Route path="systemNotifications" element={<SystemNotifications />} />
//           <Route path="viewBloodStock" element={<ViewBloodStock />} />
//         </Route>

//         {/* Hospital layout & pages */}
//         <Route path="/hospital" element={<Hospital />}>
//           <Route path="" element={<HospitalDashboard />} />
//           <Route path="dashboard" element={<HospitalDashboard />} />
//           <Route path="donors" element={<Donors />} />
//           <Route path="blood-stock" element={<BloodStock />} />
//           <Route path="patient-requests" element={<PatientRequests />} />
//           <Route path="campaigns" element={<Campaigns />} />
//         </Route>

//         {/* Donor layout & pages */}
//         <Route path="/donor" element={<Donor />}>
//           <Route path="" element={<DonorDashboard />} />
//           <Route path="dashboard" element={<DonorDashboard />} />
//        <Route
//   path="bloodRequestsPage/eligibility/:id"
//   element={<BloodDonationEligibilityForm />}
// />

//           <Route path="bloodRequestsPage" element={<BloodRequestsPage />} />
//           <Route path="profile" element={<ProfilePage />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;






// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // Context
// import { AuthProvider } from "./contexts/AuthContext";

// // Protected Route Components
// import {
//   ProtectedRoute,
//   AdminRoute,
//   HospitalRoute,
//   DonorRoute,
//   PublicRoute,
// } from "./components/ProtectedRoute";

// // Layout Components
// import Admin from "./layout/Admin";
// import Hospital from "./layout/Hospital";
// import Donor from "./layout/Donor";

// // Shared Pages
// import Home from "./pages/shared/Home";
// import Login from "./pages/shared/Login";

// // Admin Pages
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AddHospitals from "./pages/admin/AddHospitals";
// import AddHospitalUsers from "./pages/admin/AddHospitalUsers";
// import ManageDonors from "./pages/admin/ManageDonors";
// import ManageHospitals from "./pages/admin/ManageHospitals";
// import ManageHospitalUsers from "./pages/admin/ManageHospitalUsers";
// import SystemNotifications from "./pages/admin/SystemNotifications";
// import ViewBloodStock from "./pages/admin/ViewBloodStock";

// // Hospital Pages
// import HospitalDashboard from "./pages/hospital/HospitalDashboard";
// import Donors from "./pages/hospital/Donors";
// import BloodStock from "./pages/hospital/BloodStock";
// import PatientRequests from "./pages/hospital/PatientRequests";
// import Campaigns from "./pages/hospital/Campaigns";

// // Donor Pages
// import DonorDashboard from "./pages/donor/DonorDashboard";
// import { BloodRequestsPage } from "./pages/donor/BloodRequestsPage";
// import { ProfilePage } from "./pages/donor/ProfilePage";
// import { BloodDonationEligibilityForm } from "./pages/donor/BloodDonationEligibilityForm";

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Public routes - only accessible when not logged in */}
//           <Route
//             path="/"
//             element={
//               <PublicRoute>
//                 <Home />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/login"
//             element={
//               <PublicRoute>
//                 <Login />
//               </PublicRoute>
//             }
//           />

//           {/* Admin protected routes */}
//           <Route
//             path="/admin"
//             element={
//               <AdminRoute>
//                 <Admin />
//               </AdminRoute>
//             }
//           >
//             <Route path="" element={<AdminDashboard />} />
//             <Route path="dashboard" element={<AdminDashboard />} />
//             <Route path="addHospital" element={<AddHospitals />} />
//             <Route path="addHospitalUsers" element={<AddHospitalUsers />} />
//             <Route path="manageHospitals" element={<ManageHospitals />} />
//             <Route
//               path="manageHosptitalUsers"
//               element={<ManageHospitalUsers />}
//             />
//             <Route path="manageDonors" element={<ManageDonors />} />
//             <Route
//               path="systemNotifications"
//               element={<SystemNotifications />}
//             />
//             <Route path="viewBloodStock" element={<ViewBloodStock />} />
//           </Route>

//           {/* Hospital protected routes */}
//           <Route
//             path="/hospital"
//             element={
//               <HospitalRoute>
//                 <Hospital />
//               </HospitalRoute>
//             }
//           >
//             <Route path="" element={<HospitalDashboard />} />
//             <Route path="dashboard" element={<HospitalDashboard />} />
//             <Route path="donors" element={<Donors />} />
//             <Route path="blood-stock" element={<BloodStock />} />
//             <Route path="patient-requests" element={<PatientRequests />} />
//             <Route path="campaigns" element={<Campaigns />} />
//           </Route>

//           {/* Donor protected routes */}
//           <Route
//             path="/donor"
//             element={
//               <DonorRoute>
//                 <Donor />
//               </DonorRoute>
//             }
//           >
//             <Route path="" element={<DonorDashboard />} />
//             <Route path="dashboard" element={<DonorDashboard />} />
//             <Route
//               path="bloodRequestsPage/eligibility/:id"
//               element={<BloodDonationEligibilityForm />}
//             />
//             <Route path="bloodRequestsPage" element={<BloodRequestsPage />} />
//             <Route path="profile" element={<ProfilePage />} />
//           </Route>

//           {/* Fallback for unknown routes - redirect to login */}
//           <Route path="*" element={<Login />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;





import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Context
import { AuthProvider } from "./contexts/AuthContext";

// Protected Route Components
import {
  ProtectedRoute,
  AdminRoute,
  HospitalRoute,
  DonorRoute,
  PublicRoute,
} from "./components/ProtectedRoute";

// Layout Components
import Admin from "./layout/Admin";
import Hospital from "./layout/Hospital";
import Donor from "./layout/Donor";

// Shared Pages
import Home from "./pages/shared/Home";
import Login from "./pages/shared/Login";
import DonorSignup from "./pages/shared/DonorSignup";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddHospitals from "./pages/admin/AddHospitals";
import AddHospitalUsers from "./pages/admin/AddHospitalUsers";
import ManageDonors from "./pages/admin/ManageDonors";
import ManageHospitals from "./pages/admin/ManageHospitals";
import ManageHospitalUsers from "./pages/admin/ManageHospitalUsers";
import SystemNotifications from "./pages/admin/SystemNotifications";
import ViewBloodStock from "./pages/admin/ViewBloodStock";

// Hospital Pages
import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import Donors from "./pages/hospital/Donors";
import BloodStock from "./pages/hospital/BloodStock";
import PatientRequests from "./pages/hospital/PatientRequests";
import Campaigns from "./pages/hospital/Campaigns";

// Donor Pages
import DonorDashboard from "./pages/donor/DonorDashboard";
import { BloodRequestsPage } from "./pages/donor/BloodRequestsPage";
import { ProfilePage } from "./pages/donor/ProfilePage";
import { BloodDonationEligibilityForm } from "./pages/donor/BloodDonationEligibilityForm";
import { BloodDonationEligibilityResult } from "./pages/donor/BloodDonationEligibilityResult";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes - only accessible when not logged in */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <DonorSignup />
              </PublicRoute>
            }
          />

          {/* Admin protected routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          >
            <Route path="" element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="addHospital" element={<AddHospitals />} />
            <Route path="addHospitalUsers" element={<AddHospitalUsers />} />
            <Route path="manageHospitals" element={<ManageHospitals />} />
            <Route path="manageHosptitalUsers" element={<ManageHospitalUsers />} />
            <Route path="manageDonors" element={<ManageDonors />} />
            <Route path="systemNotifications" element={<SystemNotifications />} />
            <Route path="viewBloodStock" element={<ViewBloodStock />} />
          </Route>

          {/* Hospital protected routes */}
          <Route
            path="/hospital"
            element={
              <HospitalRoute>
                <Hospital />
              </HospitalRoute>
            }
          >
            <Route path="" element={<HospitalDashboard />} />
            <Route path="dashboard" element={<HospitalDashboard />} />
            <Route path="donors" element={<Donors />} />
            <Route path="blood-stock" element={<BloodStock />} />
            <Route path="patient-requests" element={<PatientRequests />} />
            <Route path="campaigns" element={<Campaigns />} />
          </Route>

          {/* Donor protected routes */}
          <Route
            path="/donor"
            element={
              <DonorRoute>
                <Donor />
              </DonorRoute>
            }
          >
            <Route path="" element={<DonorDashboard />} />
            <Route path="dashboard" element={<DonorDashboard />} />
            <Route
              path="bloodRequestsPage/eligibility/:id"
              element={<BloodDonationEligibilityForm />}
            />
            <Route
              path="eligibility/:id/result"
              element={<BloodDonationEligibilityResult />}
            />
            <Route path="bloodRequestsPage" element={<BloodRequestsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
