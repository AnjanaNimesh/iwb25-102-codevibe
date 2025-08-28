import {Heart, Phone} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <Heart className="h-8 w-8 text-red-500" fill="currentColor" />
              <div>
                <span className="text-2xl font-bold">LifeDrop</span>
                <div className="text-sm text-gray-400">Connecting Lives</div>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              LifeDrop is the most trusted blood donation management platform, connecting donors and 
              hospitals to save lives efficiently and securely.
            </p>
            {/* <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-400">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                HIPAA Compliant
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                FDA Approved
              </div>
            </div> */}
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#donor-registration" className="text-gray-300 hover:text-red-400 transition-colors">Donor Registration</a></li>
              <li><a href="#hospital-portal" className="text-gray-300 hover:text-red-400 transition-colors">Hospital Portal</a></li>
              <li><a href="#blood-camps" className="text-gray-300 hover:text-red-400 transition-colors">Blood Camps</a></li>
              <li><a href="#emergency" className="text-gray-300 hover:text-red-400 transition-colors">Emergency Requests</a></li>
              <li><a href="#mobile-app" className="text-gray-300 hover:text-red-400 transition-colors">Mobile App</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              <li><a href="#help" className="text-gray-300 hover:text-red-400 transition-colors">Help Center</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-red-400 transition-colors">Contact Us</a></li>
              <li><a href="#faq" className="text-gray-300 hover:text-red-400 transition-colors">FAQ</a></li>
              <li><a href="#privacy" className="text-gray-300 hover:text-red-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="text-gray-300 hover:text-red-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 LifeDrop. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center text-sm text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                Emergency: 1-800-BLOOD-911
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;