

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
              src="https://media.istockphoto.com/id/1033906526/vector/donate-blood-concept-with-blood-bag-and-heart-blood-donation-vector-illustration-world-blood.jpg?s=612x612&w=0&k=20&c=bCDDE6DiGdlFspMA1RKRNeLBUWugSmi8U73ZCfYSbpg=" 
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

