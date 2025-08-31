import {Users, Shield, Building2, CheckCircle} from 'lucide-react';

const UserTypesSection = () => {
  const userTypes = [
    {
      icon: <Users className="h-12 w-12" />,
      title: "Blood Donors",
      description: "Register as a donor, schedule appointments, track donation history, and receive notifications for urgent blood needs.",
      features: ["Easy registration", "Donation history", "Health tracking", "Rewards program"],
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
      //buttonText: "Register as Donor"
    },
    {
      icon: <Building2 className="h-12 w-12" />,
      title: "Hospitals",
      description: "Request blood units, manage inventory, track patient needs, and connect with verified donors efficiently.",
      features: ["Blood requests", "Inventory management", "Request tracking", "Emergency requests"],
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
      //buttonText: "Hospital Portal"
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: "System Admin",
      description: "Oversee platform operations, manage users, monitor compliance, and generate comprehensive analytics.",
      features: ["User management", "System monitoring", "Analytics dashboard", "Compliance oversight"],
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
      //buttonText: "Admin Access"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Who Uses LifeDrop?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform serves three key user types, each with specialized features and capabilities 
            designed to streamline the blood donation process.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {userTypes.map((type, index) => (
            <div key={index} className={`${type.bgColor} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-gray-200`}>
              <div className={`${type.iconColor} mb-6`}>
                {type.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{type.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{type.description}</p>
              
              <div className="space-y-3 mb-8">
                {type.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserTypesSection;