
import { Users, Clock, Shield, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext"; // adjust path if needed

const WhyChooseSection = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const reasons = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Trusted & Secure",
      description: "Built with privacy and security at the core to keep your data safe",
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Real-time Tracking",
      description: "Live updates on blood availability and requests",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Growing Community",
      description: "Join our mission to build a strong network of donors and volunteers",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Round-the-clock emergency support",
    },
  ];

  // Check if logged-in user is a donor
  const isDonor = isAuthenticated && user?.role === "donor";

  const handleGetStarted = () => {
    if (isDonor) {
      navigate("/donor/bloodRequestsPage");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="py-20 bg-red-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose LifeDrop?
          </h2>
          <p className="text-xl text-red-100 max-w-3xl mx-auto">
            Join thousands of satisfied users who trust BloodLink for their blood donation needs.
            Experience the difference of a truly professional platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <div className="text-white">{reason.icon}</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{reason.title}</h3>
              <p className="text-red-100">{reason.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button
            onClick={handleGetStarted}
            className="bg-white text-red-500 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
