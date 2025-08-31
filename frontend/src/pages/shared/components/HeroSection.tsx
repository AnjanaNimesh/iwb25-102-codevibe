// import {Heart, Users, Activity} from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const HeroSection = () => {
//   const navigate = useNavigate();
//   return (
//     <section className="bg-gradient-to-br from-red-50 via-pink-25 to-blue-50 py-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           <div>
//             {/* <div className="inline-flex items-center bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
//               <Heart className="h-4 w-4 mr-2" />
//               Trusted by 500+ Hospitals & 10,000+ Donors
//             </div> */}
            
//             <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
//               <span className="text-red-500">LifeDrop</span> Connects
//               <br />Lives Together
//             </h1>
            
//             <p className="text-xl text-gray-600 mb-8 leading-relaxed">
//               The most trusted blood donation management platform connecting donors and hospitals. 
//               Save lives with our secure, efficient and transparent system.
//             </p>
            
//             <div className="flex flex-col sm:flex-row gap-4 mb-12">
//               <button onClick={() => navigate('/signup')} className="bg-red-500 text-white px-8 py-4 rounded-full hover:bg-red-600 transition-all transform hover:scale-105 shadow-lg font-medium">
//                 <Users className="h-5 w-5 inline mr-2" />
//                 Join as Donor
//               </button>
//             </div>
//           </div>
          
//           <div className="relative">
//             <div className="bg-white rounded-3xl shadow-2xl p-8 border">
//               <div className="text-center mb-8">
//                 <div className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Activity className="h-8 w-8" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-2">Platform Statistics</h3>
//                 <p className="text-gray-600">Real-time impact of LifeDrop</p>
//               </div>
              
//               <div className="grid grid-cols-2 gap-6">
//                 <div className="text-center p-4 bg-red-50 rounded-xl">
//                   <div className="text-3xl font-bold text-red-500 mb-1">12,547 +</div>
//                   <div className="text-gray-600 text-sm">Active Donors</div>
//                 </div>
//                 <div className="text-center p-4 bg-blue-50 rounded-xl">
//                   <div className="text-3xl font-bold text-blue-500 mb-1">523 +</div>
//                   <div className="text-gray-600 text-sm">Partner Hospitals</div>
//                 </div>
//                 <div className="text-center p-4 bg-green-50 rounded-xl">
//                   <div className="text-3xl font-bold text-green-500 mb-1">8,934 +</div>
//                   <div className="text-gray-600 text-sm">Lives Saved</div>
//                 </div>
//                 <div className="text-center p-4 bg-purple-50 rounded-xl">
//                   <div className="text-3xl font-bold text-purple-500 mb-1">15,678 +</div>
//                   <div className="text-gray-600 text-sm">Successful Donations</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;



// import { Heart, Users, Activity } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../../contexts/AuthContext"; 

// const HeroSection = () => {
//   const navigate = useNavigate();
//   const { user, isAuthenticated } = useAuth();

//   // Check if logged-in user is a donor
//   const isDonor = isAuthenticated && user?.role === "donor";

//   return (
//     <section className="bg-gradient-to-br from-red-50 via-pink-25 to-blue-50 py-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           <div>
//             <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
//               <span className="text-red-500">LifeDrop</span> Connects
//               <br />Lives Together
//             </h1>

//             <p className="text-xl text-gray-600 mb-8 leading-relaxed">
//               The most trusted blood donation management platform connecting
//               donors and hospitals. Save lives with our secure, efficient and
//               transparent system.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 mb-12">
//               {isDonor ? (
//                 <button
//                   onClick={() => navigate("/donor/bloodRequestsPage")}
//                   className="bg-red-500 text-white px-8 py-4 rounded-full hover:opacity-90 transition-all transform hover:scale-105 shadow-lg font-medium"
//                 >
//                   <Heart className="h-5 w-5 inline mr-2" />
//                   Donate Now
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => navigate("/signup")}
//                   className="bg-red-500 text-white px-8 py-4 rounded-full hover:bg-red-600 transition-all transform hover:scale-105 shadow-lg font-medium"
//                 >
//                   <Users className="h-5 w-5 inline mr-2" />
//                   Join as Donor
//                 </button>
//               )}
//             </div>
//           </div>

//           <div className="relative">
//             <div className="bg-white rounded-3xl shadow-2xl p-8 border">
//               <div className="text-center mb-8">
//                 <div className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Activity className="h-8 w-8" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                   Platform Statistics
//                 </h3>
//                 <p className="text-gray-600">Real-time impact of LifeDrop</p>
//               </div>

//               <div className="grid grid-cols-2 gap-6">
//                 <div className="text-center p-4 bg-red-50 rounded-xl">
//                   <div className="text-3xl font-bold text-red-500 mb-1">
//                     12,547 +
//                   </div>
//                   <div className="text-gray-600 text-sm">Active Donors</div>
//                 </div>
//                 <div className="text-center p-4 bg-blue-50 rounded-xl">
//                   <div className="text-3xl font-bold text-blue-500 mb-1">
//                     523 +
//                   </div>
//                   <div className="text-gray-600 text-sm">Partner Hospitals</div>
//                 </div>
//                 <div className="text-center p-4 bg-green-50 rounded-xl">
//                   <div className="text-3xl font-bold text-green-500 mb-1">
//                     8,934 +
//                   </div>
//                   <div className="text-gray-600 text-sm">Lives Saved</div>
//                 </div>
//                 <div className="text-center p-4 bg-purple-50 rounded-xl">
//                   <div className="text-3xl font-bold text-purple-500 mb-1">
//                     15,678 +
//                   </div>
//                   <div className="text-gray-600 text-sm">
//                     Successful Donations
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;


import { Heart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext"; 

const HeroSection = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Check if logged-in user is a donor
  const isDonor = isAuthenticated && user?.role === "donor";

  return (
    <section className="bg-gradient-to-br from-red-50 via-pink-25 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="text-red-500">LifeDrop</span> Connects
              <br />Lives Together
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              The most trusted blood donation management platform connecting
              donors and hospitals. Save lives with our secure, efficient and
              transparent system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {isDonor ? (
                <button
                  onClick={() => navigate("/donor/bloodRequestsPage")}
                  className="bg-red-500 text-white px-8 py-4 rounded-full hover:opacity-90 transition-all transform hover:scale-105 shadow-lg font-medium"
                >
                  <Heart className="h-5 w-5 inline mr-2" />
                  Donate Now
                </button>
              ) : (
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-red-500 text-white px-8 py-4 rounded-full hover:bg-red-600 transition-all transform hover:scale-105 shadow-lg font-medium"
                >
                  <Users className="h-5 w-5 inline mr-2" />
                  Join as Donor
                </button>
              )}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <img
              src="" 
              alt="Blood Donation"
              className="rounded-3xl shadow-2xl w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

