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
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/signup" className="text-gray-300 hover:text-red-400 transition-colors">Donor Registration</a></li>
              <li><a href="/campaigns" className="text-gray-300 hover:text-red-400 transition-colors">Blood Campaigns</a></li>
              <li><a href="/donor/bloodRequestsPage" className="text-gray-300 hover:text-red-400 transition-colors">Emergency Requests</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              <li><a href="/contact" className="text-gray-300 hover:text-red-400 transition-colors">Contact Us</a></li>
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