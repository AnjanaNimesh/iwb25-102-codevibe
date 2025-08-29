// import React, { useState } from "react";
// import { Heart, Menu, X, User } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../../contexts/AuthContext";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const { user, isAuthenticated, logout } = useAuth();

//   const handleLogout = async () => {
//     await logout();
//     navigate("/"); // Redirect to home after logout
//   };

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
//             <Link
//               to="/"
//               className="text-gray-700 hover:text-red-500 font-medium"
//             >
//               Home
//             </Link>
//             <Link
//               to="/why-donate"
//               className="text-gray-700 hover:text-red-500 font-medium"
//             >
//               Why Donate
//             </Link>
//             <Link
//               to="/get-involved"
//               className="text-gray-700 hover:text-red-500 font-medium"
//             >
//               Get Involved
//             </Link>
//             <Link
//               to="/campaigns"
//               className="text-gray-700 hover:text-red-500 font-medium"
//             >
//               Campaigns
//             </Link>
//             <Link
//               to="/contact"
//               className="text-gray-700 hover:text-red-500 font-medium"
//             >
//               Contact
//             </Link>

//             {/* Donor-specific buttons */}
//             {isAuthenticated && user?.role === "donor" && (
//               <button
//                 onClick={() => navigate("/donor/bloodRequestsPage")}
//                 className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
//               >
//                 Donate Now
//               </button>
//             )}

//             {/* Auth buttons */}
//             {!isAuthenticated ? (
//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={() => navigate("/login")}
//                   className="border border-red-500 text-red-500 px-6 py-2 rounded-full hover:bg-red-50"
//                 >
//                   Sign In
//                 </button>
//                 <button
//                   onClick={() => navigate("/signup")}
//                   className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
//                 >
//                   Sign Up
//                 </button>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={handleLogout}
//                   className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
//                 >
//                   Logout
//                 </button>
//                 <button
//                   onClick={() => navigate("/donor/profile")}
//                   className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"
//                   aria-label="Profile"
//                 >
//                   <User className="h-5 w-5 text-gray-800" />
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="lg:hidden p-2"
//           >
//             {isMenuOpen ? (
//               <X className="h-6 w-6" />
//             ) : (
//               <Menu className="h-6 w-6" />
//             )}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="lg:hidden pb-4 border-t border-gray-200 mt-4">
//             <div className="flex flex-col space-y-3 pt-4">
//               <a href="#home" className="text-gray-700 hover:text-red-500 py-2 font-medium">Home</a>
//               <a href="#about" className="text-gray-700 hover:text-red-500 py-2 font-medium">About</a>

//               {isAuthenticated && user?.role === "donor" && (
//                 <>
//                   <button
//                     onClick={() => {
//                       setIsMenuOpen(false);
//                       navigate("/donor/bloodRequestsPage");
//                     }}
//                     className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
//                   >
//                     Donate Now
//                   </button>
//                 </>
//               )}

//               {/* Auth buttons for mobile */}
//               {!isAuthenticated ? (
//                 <div className="flex flex-col space-y-2 pt-4">
//                   <button
//                     onClick={() => {
//                       setIsMenuOpen(false);
//                       navigate("/login");
//                     }}
//                     className="border border-red-500 text-red-500 px-6 py-2 rounded-full hover:bg-red-50"
//                   >
//                     Sign In
//                   </button>
//                   <button
//                     onClick={() => {
//                       setIsMenuOpen(false);
//                       navigate("/signup");
//                     }}
//                     className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
//                   >
//                     Sign Up
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex flex-col space-y-2 pt-4">
//                   <button
//                     onClick={() => {
//                       setIsMenuOpen(false);
//                       handleLogout();
//                     }}
//                     className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
//                   >
//                     Logout
//                   </button>
//                   <button
//                     onClick={() => {
//                       setIsMenuOpen(false);
//                       navigate("/donor/profile");
//                     }}
//                     className="flex items-center justify-center space-x-2 bg-gray-100 py-2 rounded-full hover:bg-gray-200"
//                   >
//                     <User className="h-5 w-5 text-gray-800" />
//                     <span>Profile</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import React, { useState } from "react";
import { Heart, Menu, X, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/"); // Redirect to home after logout
  };

  // Decide link prefix based on role
  const donorPrefix = isAuthenticated && user?.role === "donor" ? "/donor" : "";

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
            <Link
              to={`${donorPrefix}/`}
              className="text-gray-700 hover:text-red-500 font-medium"
            >
              Home
            </Link>
            <Link
              to={`${donorPrefix}/why-donate`}
              className="text-gray-700 hover:text-red-500 font-medium"
            >
              Why Donate
            </Link>
            <Link
              to={`${donorPrefix}/get-involved`}
              className="text-gray-700 hover:text-red-500 font-medium"
            >
              Get Involved
            </Link>
            <Link
              to={`${donorPrefix}/campaigns`}
              className="text-gray-700 hover:text-red-500 font-medium"
            >
              Campaigns
            </Link>
            <Link
              to={`${donorPrefix}/contact`}
              className="text-gray-700 hover:text-red-500 font-medium"
            >
              Contact
            </Link>

            {/* Donor-specific buttons */}
            {isAuthenticated && user?.role === "donor" && (
              <button
                onClick={() => navigate("/donor/bloodRequestsPage")}
                className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
              >
                Donate Now
              </button>
            )}

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
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
                >
                  Logout
                </button>
                <button
                  onClick={() => navigate("/donor/profile")}
                  className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"
                  aria-label="Profile"
                >
                  <User className="h-5 w-5 text-gray-800" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200 mt-4">
            <div className="flex flex-col space-y-3 pt-4">
              <Link
                to={`${donorPrefix}/`}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-red-500 py-2 font-medium"
              >
                Home
              </Link>
              <Link
                to={`${donorPrefix}/why-donate`}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-red-500 py-2 font-medium"
              >
                Why Donate
              </Link>
              <Link
                to={`${donorPrefix}/get-involved`}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-red-500 py-2 font-medium"
              >
                Get Involved
              </Link>
              <Link
                to={`${donorPrefix}/campaigns`}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-red-500 py-2 font-medium"
              >
                Campaigns
              </Link>
              <Link
                to={`${donorPrefix}/contact`}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-red-500 py-2 font-medium"
              >
                Contact
              </Link>

              {isAuthenticated && user?.role === "donor" && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/donor/bloodRequestsPage");
                  }}
                  className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
                >
                  Donate Now
                </button>
              )}

              {/* Auth buttons for mobile */}
              {!isAuthenticated ? (
                <div className="flex flex-col space-y-2 pt-4">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/login");
                    }}
                    className="border border-red-500 text-red-500 px-6 py-2 rounded-full hover:bg-red-50"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/signup");
                    }}
                    className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/donor/profile");
                    }}
                    className="flex items-center justify-center space-x-2 bg-gray-100 py-2 rounded-full hover:bg-gray-200"
                  >
                    <User className="h-5 w-5 text-gray-800" />
                    <span>Profile</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

