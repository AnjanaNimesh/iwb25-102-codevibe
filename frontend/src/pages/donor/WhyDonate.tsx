import React from "react";
import { Heart } from "lucide-react";

const WhyDonate = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Heart
            className="h-16 w-16 text-red-500 mx-auto mb-6"
            fill="currentColor"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Why Donate Blood?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Your blood donation can save lives and make a profound impact on
            your community. Discover the reasons why giving blood is one of the
            most generous acts you can do.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Save Lives
            </h2>
            <p className="text-gray-600">
              Every donation can help up to three people in need of blood
              transfusions, from accident victims to cancer patients.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Community Impact
            </h2>
            <p className="text-gray-600">
              Your donation strengthens the community's blood supply, ensuring
              hospitals can provide critical care when it’s needed most.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Personal Benefits
            </h2>
            <p className="text-gray-600">
              Donating blood can improve your mental well-being, giving you a
              sense of purpose and connection to others.
            </p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Who Can You Help?
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            Blood donations are critical for:
          </p>
          <ul className="text-gray-600 max-w-2xl mx-auto text-left list-disc list-inside">
            <li>Accident and trauma victims</li>
            <li>Patients undergoing major surgeries</li>
            <li>Individuals with chronic illnesses like sickle cell anemia</li>
            <li>Cancer patients requiring transfusions</li>
            <li>Mothers and babies during childbirth complications</li>
          </ul>
        </div>

        <div className="text-center mt-12">
          <a
            href="/signup"
            className="inline-block bg-red-500 text-white px-8 py-3 rounded-full hover:bg-red-600 text-lg font-medium"
          >
            Become a Donor Today
          </a>
        </div>
      </div>
    </div>
  );
};

export default WhyDonate;
