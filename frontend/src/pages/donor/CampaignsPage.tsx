import React from "react";
import { Heart } from "lucide-react";

const CampaignsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Heart
            className="h-16 w-16 text-red-500 mx-auto mb-6"
            fill="currentColor"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Campaigns
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Discover our ongoing campaigns to promote blood donation and save
            lives. Join us in making a difference in your community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Summer Blood Drive
            </h2>
            <p className="text-gray-600 mb-4">
              Join our annual summer blood drive to help maintain blood supplies
              during high-demand periods. Every donation counts!
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Date: June - August 2025
            </p>
            <a
              href="/signup"
              className="inline-block text-red-500 hover:text-red-600 font-medium"
            >
              Register to Donate
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Community Heroes Campaign
            </h2>
            <p className="text-gray-600 mb-4">
              Celebrate local heroes by donating blood in their honor. Help us
              ensure hospitals are ready for emergencies.
            </p>
            <p className="text-gray-500 text-sm mb-4">Date: Ongoing</p>
            <a
              href="/signup"
              className="inline-block text-red-500 hover:text-red-600 font-medium"
            >
              Join the Campaign
            </a>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Start Your Own Campaign
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            Want to lead a blood donation campaign in your community? Contact us
            to learn how you can organize an event and inspire others.
          </p>
          <a
            href="/contact"
            className="inline-block bg-red-500 text-white px-8 py-3 rounded-full hover:bg-red-600 text-lg font-medium"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;
