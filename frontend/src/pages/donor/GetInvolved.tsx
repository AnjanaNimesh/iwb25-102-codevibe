import React from "react";
import { Heart } from "lucide-react";

const GetInvolved = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Heart
            className="h-16 w-16 text-red-500 mx-auto mb-6"
            fill="currentColor"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get Involved
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Join our mission to save lives by getting involved with LifeDrop.
            Whether through donating blood, volunteering, or spreading
            awareness, your contribution makes a difference.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Donate Blood
            </h2>
            <p className="text-gray-600">
              Become a blood donor and help save lives. Your donation can make a
              critical difference for patients in need.
            </p>
            <a
              href="/signup"
              className="inline-block mt-4 text-red-500 hover:text-red-600 font-medium"
            >
              Sign Up to Donate
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Volunteer
            </h2>
            <p className="text-gray-600">
              Support our blood drives and community events by volunteering your
              time and skills.
            </p>
            <a
              href="/contact"
              className="inline-block mt-4 text-red-500 hover:text-red-600 font-medium"
            >
              Contact Us to Volunteer
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Spread Awareness
            </h2>
            <p className="text-gray-600">
              Share our mission on social media or in your community to
              encourage others to donate.
            </p>
            <a
              href="/campaigns"
              className="inline-block mt-4 text-red-500 hover:text-red-600 font-medium"
            >
              Explore Campaigns
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetInvolved;
