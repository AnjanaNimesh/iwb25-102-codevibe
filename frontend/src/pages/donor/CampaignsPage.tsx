


import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";

// Define the BloodCampaign type based on the backend record, including image
interface BloodCampaign {
  campaign_id: number;
  hospital_id: number;
  hospital_name: string;
  title: string;
  location: string;
  date: string;
  status: string;
  image?: string; // Optional base64-encoded image string
}

const CampaignsPage = () => {
  // Explicitly type campaigns as an array of BloodCampaign
  const [campaigns, setCampaigns] = useState<BloodCampaign[]>([]);
  // Allow error to be string or null
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("http://localhost:9095/donors/campaigns", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for authentication if needed
        });

        const data = await response.json();
        if (data.status === "success") {
          setCampaigns(data.campaigns);
        } else {
          setError(data.message || "Failed to fetch campaigns");
        }
      } catch (err) {
        setError("Error fetching campaigns. Please try again later.");
      } finally{
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

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

        {loading && (
          <div className="text-center text-gray-600">Loading campaigns...</div>
        )}

        {error && (
          <div className="text-center text-red-500 mb-8">
            {error}
          </div>
        )}

        {!loading && !error && campaigns.length === 0 && (
          <div className="text-center text-gray-600">
            No active campaigns found.
          </div>
        )}

        {!loading && !error && campaigns.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {campaigns.map((campaign) => (
              <div
                key={campaign.campaign_id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                {campaign.image ? (
                  <img
                    src={`data:image/jpeg;base64,${campaign.image}`}
                    alt={campaign.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/150"; // Fallback image
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {campaign.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  Organized by {campaign.hospital_name} at {campaign.location}.
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Date: {new Date(campaign.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

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