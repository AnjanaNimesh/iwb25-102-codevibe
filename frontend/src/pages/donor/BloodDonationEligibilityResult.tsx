

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
  gender?: string;
  failedCriteria?: string[];
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
  distance?: number;
}

// Fix Leaflet default icon path issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom marker icon to match red theme
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isEligible, result, gender, failedCriteria } =
    (location.state as LocationState) || {
      isEligible: false,
      result: "No eligibility data available.",
      gender: null,
      failedCriteria: [],
    };
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [donationCenters, setDonationCenters] = useState<DonationCenter[]>([]);
  const [loadingCenters, setLoadingCenters] = useState<boolean>(false);
  const [donationError, setDonationError] = useState<string | null>(null);
  const [pendingHospitals, setPendingHospitals] = useState<number[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [successHospitalName, setSuccessHospitalName] = useState<string>("");

  // Default map center (Colombo, Sri Lanka)
  const defaultCenter: LatLngExpression = [6.927079, 79.861244];

  const handleConfirmDonation = async (center: DonationCenter) => {
    if (pendingHospitals.includes(center.hospital_id)) {
      alert("You have already requested to donate at this hospital.");
      return;
    }

    try {
      console.log("Confirm Donation clicked", { 
        hospitalId: center.hospital_id,
        center 
      });

      const response = await axios.post(
        `http://localhost:9095/donors/donation`,
        {
          hospitalId: center.hospital_id,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("Donation creation response:", response.data);
      
      setSuccessHospitalName(center.hospital_name);
      setShowSuccessPopup(true);
      setDonationError(null);
      setPendingHospitals([...pendingHospitals, center.hospital_id]);

    } catch (err: any) {
      console.error("Error recording donation:", err);
      
      let errorMessage = "Failed to record donation.";
      
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;
        
        switch (status) {
          case 400:
            errorMessage = data?.message || "Invalid request data.";
            break;
          case 401:
            errorMessage = "Authentication required. Please log in again.";
            break;
          case 403:
            errorMessage = "Access denied. Authentication issue detected.";
            break;
          case 404:
            errorMessage = data?.message || "Donor or hospital not found.";
            break;
          case 409:
            errorMessage = "You have already requested to donate at this hospital.";
            setPendingHospitals([...pendingHospitals, center.hospital_id]);
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = data?.message || `Server error (${status}). Please try again.`;
        }
      } else if (err.request) {
        errorMessage = "Network error: Unable to reach server. Please check your connection.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setDonationError(errorMessage);
      alert(`Error: ${errorMessage}`);
    }
  };

  // Fetch nearby donation centers, pending requests, and user location if eligible
  useEffect(() => {
    if (isEligible) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log("User location:", { latitude, longitude });
            setUserLocation({ latitude, longitude });
            const cookies = document.cookie;
            console.log("Cookies sent with request:", cookies);
            try {
              setLoadingCenters(true);
              const [centersResponse, pendingResponse] = await Promise.all([
                axios.get<DonationCenter[]>(
                  `http://localhost:9095/donors/hospitals/nearby`,
                  {
                    params: {
                      latitude,
                      longitude,
                      radius: 300,
                    },
                    withCredentials: true,
                  }
                ),
                axios.get(
                  `http://localhost:9095/donors/donations/pending`,
                  {
                    withCredentials: true,
                  }
                )
              ]);
              console.log("API response:", centersResponse.data);
              setDonationCenters(centersResponse.data);
              const pendingIds = pendingResponse.data.map((d: any) => d.hospital_id);
              setPendingHospitals(pendingIds);
              if (centersResponse.data.length === 0) {
                setLocationError("No donation centers.");
              }
            } catch (err: any) {
              let errorMessage = "Failed to fetch donation centers or pending requests.";
              if (err.response) {
                if (err.response.status === 401) {
                  errorMessage = "Authentication failed: Please log in again.";
                } else if (err.response.status === 404) {
                  errorMessage =
                    "Donation centers endpoint not found on server.";
                } else if (err.response.status === 400) {
                  errorMessage = "Invalid request: Check location parameters.";
                } else {
                  errorMessage = `Failed to fetch donation centers: ${
                    err.response.data?.message || err.message
                  } (Status: ${err.response.status})`;
                }
              } else if (err.request) {
                errorMessage = `Network error: Unable to reach server at http://localhost:9095. ${err.message}`;
              }
              setLocationError(errorMessage);
              console.error("Error fetching centers or pending:", {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
                params: { latitude, longitude, radius: 10 },
                cookies,
              });
            } finally {
              setLoadingCenters(false);
            }
          },
          (error) => {
            const errorMessage = `Unable to retrieve your location: ${error.message}. Please ensure location services are enabled.`;
            setLocationError(errorMessage);
            console.error("Geolocation error:", error);
            setDonationCenters([]);
          }
        );
      } else {
        setLocationError("Geolocation is not supported by your browser.");
        console.error("Geolocation not supported");
        setDonationCenters([]);
      }
    }
  }, [isEligible]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1V3H9V1L3 7V9H1V11H3L4 21C4 21.6 4.4 22 5 22H19C19.6 22 20 21.6 20 21L21 11H23V9H21ZM11 11H13V17H11V11Z"/>
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Eligibility Assessment
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            Request ID: <span className="font-semibold text-white">{id || "N/A"}</span>
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-10">
        {/* Result Card */}
        <div className="max-w-4xl mx-auto">
          <div className={`bg-white rounded-2xl shadow-xl border-l-8 p-8 mb-8 ${
            isEligible 
              ? 'border-green-500' 
              : 'border-red-500'
          }`}>
            <div className="flex items-center justify-center mb-6">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
                isEligible 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {isEligible ? (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </div>
            
            <h2 className={`text-2xl md:text-3xl font-bold text-center mb-4 ${
              isEligible ? 'text-green-600' : 'text-red-600'
            }`}>
              {isEligible ? 'Congratulations! You are eligible to donate' : 'Unfortunately, you are not eligible at this time'}
            </h2>
            
            <p className={`text-lg text-center mb-6 ${
              isEligible ? 'text-green-700' : 'text-red-700'
            }`}>
              {result}
            </p>

            {/* Failed Criteria Display */}
            {!isEligible && failedCriteria && failedCriteria.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Eligibility Requirements Not Met
                </h3>
                <div className="space-y-2">
                  {failedCriteria.map((criterion, index) => (
                    <div key={index} className="flex items-start bg-white rounded-lg p-3 border border-red-100">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-red-700 text-sm">
                        {criterion === "ageValid" && "Age must be between 18 and 60."}
                        {criterion === "weightValid" && "Weight must be at least 45 kg."}
                        {criterion === "hemoglobinValid" && "Hemoglobin must be at least 12.5 g/dL or unknown."}
                        {criterion === "goodHealthValid" && "You must be in good general health."}
                        {criterion === "noFeverOrInfection" && "You must not have a fever, infection, or flu-like symptoms."}
                        {criterion === "wholeBloodDonationValid" && "Last whole blood donation must be more than 4 months ago."}
                        {criterion === "plateletDonationValid" && "Last platelet donation must be more than 14 days ago."}
                        {criterion === "noRecentTattoo" && "No tattoos or piercings in the past 6 months."}
                        {criterion === "notPregnantOrBreastfeeding" && "You must not be pregnant or breastfeeding (past 6 months)."}
                        {criterion === "noRecentSurgery" && "No major surgery or transfusion in the past 6–12 months."}
                        {criterion === "noRecentVaccination" && "No vaccinations in the past 2–4 weeks."}
                        {criterion === "noRecentAntibiotics" && "No antibiotics or infections in the past 2 weeks."}
                        {criterion === "noRecentDentalExtraction" && "No dental extractions in the past 1 week."}
                        {criterion === "noMenstruationWeakness" && "You must not be menstruating and feeling weak or anemic."}
                        {criterion === "noTravelMalaria" && "No travel to malaria-prone areas in the past 6 months."}
                        {criterion === "noChronicDisease" && "No chronic diseases (e.g., diabetes, cancer, epilepsy)."}
                        {criterion === "noHepatitisOrHIV" && "No history of Hepatitis B, Hepatitis C, or HIV/AIDS."}
                        {criterion === "noIntravenousDrugUse" && "No history of intravenous drug use."}
                        {criterion === "noHighRiskSexualBehavior" && "No high-risk sexual behavior."}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Donation Centers Section */}
          {isEligible && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Find <span className="text-red-500">Donation Centers</span>
                </h2>
                <p className="text-gray-600">
                  Locate nearby blood donation centers
                </p>
              </div>

              {/* Success Popup */}
              {showSuccessPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
                    <div className="flex items-center justify-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 text-center mb-4">
                      Donation Request Successful!
                    </h3>
                    <p className="text-gray-600 text-center mb-6">
                      Successfully added donation request! Please visit{" "}
                      <span className="font-semibold text-red-500">{successHospitalName}</span>{" "}
                      to donate.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowSuccessPopup(false)}
                      className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* Error Messages */}
              {locationError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700 font-medium">Location Error</span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">{locationError}</p>
                </div>
              )}
              
              {donationError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700 font-medium">Donation Error</span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">{donationError}</p>
                </div>
              )}

              {/* Loading State */}
              {loadingCenters && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mr-3"></div>
                    <span className="text-blue-700 font-medium">Loading donation centers...</span>
                  </div>
                </div>
              )}

              {/* User Location Display */}
              {userLocation && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-blue-700 font-medium">Your Location:</span>
                  </div>
                  <p className="text-blue-600 text-sm mt-1">
                    Coordinates: {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
                  </p>
                </div>
              )}

              {/* No Centers Found */}
              {!loadingCenters && !locationError && donationCenters.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6 text-center">
                  <svg className="w-12 h-12 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.674-2.64m0 0A7.962 7.962 0 014 9c0-4.418 3.582-8 8-8s8 3.582 8 8c0 1.508-.418 2.911-1.145 4.13M8.326 15.36A7.962 7.962 0 004 9c0-1.508.418-2.911 1.145-4.13" />
                  </svg>
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Centers Found</h3>
                  <p className="text-yellow-700">
                    No donation centers found. Please try checking with a local blood bank or expanding your search radius.
                  </p>
                </div>
              )}

              {/* Map and Hospital List */}
              {!loadingCenters && donationCenters.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Map Section */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                      </svg>
                      Interactive Map
                    </h3>
                    <div className="h-96 rounded-xl overflow-hidden border-2 border-red-100 shadow-lg">
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
                          minHeight: "384px",
                        }}
                        className="z-0"
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {userLocation && (
                          <Marker
                            position={[
                              userLocation.latitude,
                              userLocation.longitude,
                            ]}
                            icon={blueIcon}
                          >
                            <Popup>
                              <div className="text-center">
                                <h4 className="font-semibold text-blue-600">Your Location</h4>
                                <p className="text-sm text-gray-600">You are here</p>
                              </div>
                            </Popup>
                          </Marker>
                        )}
                        {donationCenters.map((center) => {
                          const isPending = pendingHospitals.includes(center.hospital_id);
                          return (
                            <Marker
                              key={center.hospital_id}
                              position={[center.latitude, center.longitude]}
                              icon={redIcon}
                            >
                              <Popup maxWidth={300}>
                                <div className="p-2">
                                  <h3 className="font-bold text-gray-800 mb-2">
                                    {center.hospital_name}
                                  </h3>
                                  <div className="space-y-1 unfair-600 mb-3">
                                    <p><span className="font-medium">Address:</span> {center.hospital_address || "Not provided"}</p>
                                    <p><span className="font-medium">Type:</span> {center.hospital_type || "N/A"}</p>
                                    <p><span className="font-medium">Contact:</span> {center.contact_number || "N/A"}</p>
                                    <p><span className="font-medium">District:</span> {center.district_name}</p>
                                    {center.distance !== undefined && (
                                      <p><span className="font-medium">Distance:</span> {center.distance.toFixed(2)} km</p>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleConfirmDonation(center)}
                                    disabled={isPending}
                                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                                      isPending 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                        : 'bg-red-500 hover:bg-red-600 text-white hover:shadow-lg transform hover:scale-105'
                                    }`}
                                  >
                                    {isPending ? 'Already Requested' : 'Donate Here'}
                                  </button>
                                </div>
                              </Popup>
                            </Marker>
                          );
                        })}
                      </MapContainer>
                    </div>
                  </div>

                  {/* Hospital List Section */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Available Centers ({donationCenters.length})
                    </h3>
                    <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                      {donationCenters.map((center) => {
                        const isPending = pendingHospitals.includes(center.hospital_id);
                        return (
                          <div
                            key={center.hospital_id}
                            className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-bold text-gray-800 text-lg leading-tight">
                                {center.hospital_name}
                              </h4>
                              {center.distance !== undefined && (
                                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                                  {center.distance.toFixed(1)} km
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex items-start">
                                <svg className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm text-gray-600">
                                  {center.hospital_address || "Address not provided"}
                                </span>
                              </div>
                              
                              <div className="flex items-center">
                                <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011images/1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className="text-sm text-gray-600">
                                  {center.hospital_type || "Hospital"}
                                </span>
                              </div>
                              
                              <div className="flex items-center">
                                <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-sm text-gray-600">
                                  {center.contact_number || "Contact not available"}
                                </span>
                              </div>
                              
                              <div className="flex items-center">
                                <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                                </svg>
                                <span className="text-sm text-gray-600">
                                  {center.district_name} District
                                </span>
                              </div>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => handleConfirmDonation(center)}
                              disabled={isPending}
                              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                                isPending 
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                  : 'bg-red-500 hover:bg-red-600 text-white hover:shadow-lg transform hover:scale-105'
                              }`}
                            >
                              {isPending ? (
                                <div className="flex items-center justify-center">
                                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Request Submitted
                                </div>
                              ) : (
                                <div className="flex items-center justify-center">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                  Donate Here
                                </div>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => navigate("/donor/bloodRequestsPage")}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {isEligible ? "Back to Blood Requests" : "Try Assessment Again"}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="mt-16 bg-gradient-to-r from-red-500 to-red-600 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-100 text-lg">
            Thank you for your interest in saving lives through blood donation
          </p>
          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-2 text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1V3H9V1L3 7V9H1V11H3L4 21C4 21.6 4.4 22 5 22H19C19.6 22 20 21.6 20 21L21 11H23V9H21Z"/>
              </svg>
              <span className="font-medium">Every donation saves up to 3 lives</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};