import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";
import axios from "axios";

// Import Leaflet CSS - CRITICAL for proper map display
import "leaflet/dist/leaflet.css";

// Define types
interface EligibilityFormData {
  age: number | null;
  weight: number | null;
  hemoglobin: number | null;
  goodHealth: "yes" | "no" | null;
  hasFeverOrInfection: "yes" | "no" | null;
  lastWholeBloodDonation: string | null;
  lastPlateletDonation: string | null;
  recentTattooOrPiercing: "yes" | "no" | null;
  isPregnantOrBreastfeeding: "yes" | "no" | null;
  recentSurgeryOrTransfusion: "yes" | "no" | null;
  recentVaccination: "yes" | "no" | null;
  recentAntibiotics: "yes" | "no" | null;
  recentDentalExtraction: "yes" | "no" | null;
  menstruationWeakness: "yes" | "no" | null;
  travelMalariaArea: "yes" | "no" | null;
  hasChronicDisease: "yes" | "no" | null;
  hasHepatitisOrHIV: "yes" | "no" | null;
  intravenousDrugUse: "yes" | "no" | null;
  highRiskSexualBehavior: "yes" | "no" | null;
}

interface LocationState {
  isEligible: boolean;
  formData: EligibilityFormData;
  result: string;
}

interface DonationCenter {
  hospital_id: number;
  hospital_name: string;
  hospital_type: string | null;
  hospital_address: string | null;
  contact_number: string | null;
  district_name: string;
  latitude: number;
  longitude: number;
  distance?: number; // Distance in kilometers
}

// Fix Leaflet default icon path issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom marker icon to match theme (#B02629)
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// User location marker (blue to distinguish from donation centers)
const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

export const BloodDonationEligibilityResult: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Changed from requestId to id
  const navigate = useNavigate();
  const location = useLocation();
  const { isEligible, result } = (location.state as LocationState) || {
    isEligible: false,
    result: "No eligibility data available.",
  };
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [donationCenters, setDonationCenters] = useState<DonationCenter[]>([]);
  const [loadingCenters, setLoadingCenters] = useState<boolean>(false);

  // Default map center (Colombo, Sri Lanka)
  const defaultCenter: LatLngExpression = [6.927079, 79.861244];

  // Fetch nearby donation centers and user location if eligible
  useEffect(() => {
    if (isEligible) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
            try {
              setLoadingCenters(true);
              const response = await axios.get<DonationCenter[]>(
                `http://localhost:9095/donors/hospitals/nearby`,
                {
                  params: {
                    latitude,
                    longitude,
                    radius: 50, // Default 50 km radius
                  },
                }
              );
              setDonationCenters(response.data);
            } catch (err) {
              setLocationError("Failed to fetch nearby donation centers.");
              console.error("Error fetching centers:", err);
            } finally {
              setLoadingCenters(false);
            }
          },
          (_error) => {
            setLocationError(
              "Unable to retrieve your location. Please ensure location services are enabled."
            );
            setDonationCenters([]);
          }
        );
      } else {
        setLocationError("Geolocation is not supported by your browser.");
        setDonationCenters([]);
      }
    }
  }, [isEligible]);

  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
          Eligibility <span className="text-[#B02629]">Result</span>
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          Eligibility result for blood donation request ID: {id || "N/A"}.
        </p>
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
          <p
            className={`text-lg text-center ${
              isEligible ? "text-green-600" : "text-red-600"
            }`}
          >
            {result}
          </p>
          {isEligible && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Nearby Donation Centers
              </h2>
              {locationError && (
                <p className="text-red-600 text-sm mb-4">{locationError}</p>
              )}
              {loadingCenters && (
                <p className="text-gray-600 text-sm mb-4">
                  Loading donation centers...
                </p>
              )}
              {!loadingCenters &&
                !locationError &&
                donationCenters.length === 0 && (
                  <p className="text-gray-600 text-sm mb-4">
                    No donation centers found within 50 km.
                  </p>
                )}
              {userLocation && (
                <p className="text-gray-600 text-sm mb-4">
                  Your location: ({userLocation.latitude.toFixed(6)},{" "}
                  {userLocation.longitude.toFixed(6)})
                </p>
              )}
              {/* FIXED: Proper container styling for the map */}
              <div 
                className="h-96 w-full rounded-lg overflow-hidden border border-gray-200"
                style={{ position: 'relative', zIndex: 0 }}
              >
                <MapContainer
                  center={
                    userLocation
                      ? [userLocation.latitude, userLocation.longitude]
                      : defaultCenter
                  }
                  zoom={13}
                  style={{ 
                    height: "100%", 
                    width: "100%",
                    minHeight: "384px" // Ensure minimum height
                  }}
                  className="z-0" // Ensure proper z-index
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {userLocation && (
                    <Marker
                      position={[userLocation.latitude, userLocation.longitude]}
                      icon={blueIcon}
                    >
                      <Popup>Your Location</Popup>
                    </Marker>
                  )}
                  {donationCenters.map((center) => (
                    <Marker
                      key={center.hospital_id}
                      position={[center.latitude, center.longitude]}
                      icon={redIcon}
                    >
                      <Popup>
                        <div>
                          <h3 className="font-semibold">
                            {center.hospital_name}
                          </h3>
                          <p>
                            {center.hospital_address || "No address provided"}
                          </p>
                          <p>Type: {center.hospital_type || "N/A"}</p>
                          <p>Contact: {center.contact_number || "N/A"}</p>
                          <p>District: {center.district_name}</p>
                          {center.distance !== undefined && (
                            <p>Distance: {center.distance.toFixed(2)} km</p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          )}
          <div className="mt-6 flex space-x-4">
            {isEligible ? (
              <button
                type="button"
                onClick={() => navigate(`/donor/eligibility/${id}`)}
                className="w-full bg-[#B02629] hover:bg-[#9a1f22] text-white py-2 rounded-full transition-colors"
              >
                Update Answers
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate(`/donor/eligibility/${id}`)}
                className="w-full bg-[#B02629] hover:bg-[#9a1f22] text-white py-2 rounded-full transition-colors"
              >
                Try Again
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/donor/bloodRequestsPage")}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-full transition-colors"
            >
              Back to Requests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};








