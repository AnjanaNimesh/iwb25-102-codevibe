// import React, { useState } from 'react';
// import { Heart, Menu, X } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   return (
//     <nav className="bg-white shadow-lg sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center py-4">
//           {/* Logo */}
//           <div className="flex items-center space-x-3">
//             <div className="relative">
//               <Heart className="h-10 w-10 text-red-500" fill="currentColor" />
//             </div>
//             <div>
//               <span className="text-2xl font-bold text-gray-900">LifeDrop</span>
//               <div className="text-xs text-gray-500">Connecting Lives</div>
//             </div>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden lg:flex items-center space-x-8">
//             <a href="#home" className="text-gray-700 hover:text-red-500 transition-colors font-medium">Home</a>
//             <a href="#about" className="text-gray-700 hover:text-red-500 transition-colors font-medium">About</a>
//             <a href="#contact" className="text-gray-700 hover:text-red-500 transition-colors font-medium">Contact</a>

//             {/* Login/Register Buttons */}
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={() => navigate('/login')}
//                 className="border border-red-500 text-red-500 px-6 py-2 rounded-full hover:bg-red-50 transition-colors"
//               >
//                 Sign In
//               </button>
//               <button
//                 onClick={() => navigate('/signup')}
//                 className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
//               >
//                 Sign Up
//               </button>
//             </div>
//           </div>

//           {/* Mobile Menu Button */}
//           <button 
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="lg:hidden p-2"
//           >
//             {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="lg:hidden pb-4 border-t border-gray-200 mt-4">
//             <div className="flex flex-col space-y-3 pt-4">
//               <a href="#home" className="text-gray-700 hover:text-red-500 py-2 font-medium">Home</a>
//               <a href="#services" className="text-gray-700 hover:text-red-500 py-2 font-medium">Services</a>
//               <a href="#donor-portal" className="text-gray-700 hover:text-red-500 py-2 ml-4">• Donor Portal</a>
//               <a href="#hospital-portal" className="text-gray-700 hover:text-red-500 py-2 ml-4">• Hospital Portal</a>
//               <a href="#admin-portal" className="text-gray-700 hover:text-red-500 py-2 ml-4">• Admin Portal</a>
//               <a href="#about" className="text-gray-700 hover:text-red-500 py-2 font-medium">About</a>
//               <a href="#contact" className="text-gray-700 hover:text-red-500 py-2 font-medium">Contact</a>
//               <div className="flex flex-col space-y-2 pt-4">
//                 <button
//                   onClick={() => { setIsMenuOpen(false); navigate('/login'); }}
//                   className="border border-red-500 text-red-500 px-6 py-2 rounded-full hover:bg-red-50 transition-colors"
//                 >
//                   Sign In
//                 </button>
//                 <button
//                   onClick={() => { setIsMenuOpen(false); navigate('/signup'); }}
//                   className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
//                 >
//                   Sign Up
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;










import React, { useState } from "react";
import { Heart, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext"; 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth(); // ✅ get user + auth state

  const handleLogout = async () => {
    await logout();
    navigate("/"); // redirect to home after logout
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Heart className="h-10 w-10 text-red-500" fill="currentColor" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">LifeDrop</span>
              <div className="text-xs text-gray-500">Connecting Lives</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-red-500 font-medium">Home</a>
            <a href="/about" className="text-gray-700 hover:text-red-500 font-medium">About</a>

            {/* Role-based link */}
            {isAuthenticated && user?.role === "donor" && (
              <a
                onClick={() => navigate("/donor/bloodRequestsPage")}
                className="text-gray-700 hover:text-red-500 font-medium cursor-pointer"
              >
              Dashboard
              </a>
            )}

            <a href="#contact" className="text-gray-700 hover:text-red-500 font-medium">Contact</a>

            {/* Auth buttons */}
            {!isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate("/login")}
                  className="border border-red-500 text-red-500 px-6 py-2 rounded-full hover:bg-red-50"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200 mt-4">
            <div className="flex flex-col space-y-3 pt-4">
              <a href="/" className="text-gray-700 hover:text-red-500 py-2 font-medium">Home</a>
              <a href="/about" className="text-gray-700 hover:text-red-500 py-2 font-medium">About</a>

              {isAuthenticated && user?.role === "donor" && (
                <a
                  onClick={() => { setIsMenuOpen(false); navigate("/donor-dashboard"); }}
                  className="text-gray-700 hover:text-red-500 py-2 font-medium cursor-pointer"
                >
                  Donor Dashboard
                </a>
              )}

              <a href="#contact" className="text-gray-700 hover:text-red-500 py-2 font-medium">Contact</a>

              {!isAuthenticated ? (
                <div className="flex flex-col space-y-2 pt-4">
                  <button
                    onClick={() => { setIsMenuOpen(false); navigate("/login"); }}
                    className="border border-red-500 text-red-500 px-6 py-2 rounded-full hover:bg-red-50"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setIsMenuOpen(false); navigate("/signup"); }}
                    className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                  className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
