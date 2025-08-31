import {MapPin, Calendar, Shield, Activity, UserPlus, TrendingUp} from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: <UserPlus className="h-8 w-8" />,
      title: "Donor Management",
      description: "Complete donor lifecycle management with health screening and eligibility tracking."
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Matching Requests",
      description: "View blood requests that match the donor’s blood group for faster response."
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: "Real-time Inventory",
      description: "View live blood inventory stocks in real time."
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Location Services",
      description: "Find nearby donation centers and hospitals with integrated mapping services."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security & Compliance",
      description: "End-to-end encryption with detailed audit trails to keep data secure."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Analytics & Reports",
      description: "Comprehensive analytics dashboard with custom reports."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Comprehensive Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            LifeDrop provides end-to-end blood donation management services with cutting-edge 
            technology and user-friendly interfaces.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="text-red-500 mb-6">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;