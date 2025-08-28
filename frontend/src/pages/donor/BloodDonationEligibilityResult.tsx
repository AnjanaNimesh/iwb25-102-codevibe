// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L, { type LatLngExpression } from "leaflet";
// import axios from "axios";

// // Import Leaflet CSS - CRITICAL for proper map display
// import "leaflet/dist/leaflet.css";

// // Define types
// interface EligibilityFormData {
//   age: number | null;
//   weight: number | null;
//   hemoglobin: number | null;
//   goodHealth: "yes" | "no" | null;
//   hasFeverOrInfection: "yes" | "no" | null;
//   lastWholeBloodDonation: string | null;
//   lastPlateletDonation: string | null;
//   recentTattooOrPiercing: "yes" | "no" | null;
//   isPregnantOrBreastfeeding: "yes" | "no" | null;
//   recentSurgeryOrTransfusion: "yes" | "no" | null;
//   recentVaccination: "yes" | "no" | null;
//   recentAntibiotics: "yes" | "no" | null;
//   recentDentalExtraction: "yes" | "no" | null;
//   menstruationWeakness: "yes" | "no" | null;
//   travelMalariaArea: "yes" | "no" | null;
//   hasChronicDisease: "yes" | "no" | null;
//   hasHepatitisOrHIV: "yes" | "no" | null;
//   intravenousDrugUse: "yes" | "no" | null;
//   highRiskSexualBehavior: "yes" | "no" | null;
// }

// interface LocationState {
//   isEligible: boolean;
//   formData: EligibilityFormData;
//   result: string;
//   gender?: string;
//   failedCriteria?: string[];
// }

// interface DonationCenter {
//   hospital_id: number;
//   hospital_name: string;
//   hospital_type: string | null;
//   hospital_address: string | null;
//   contact_number: string | null;
//   district_name: string;
//   latitude: number;
//   longitude: number;
//   distance?: number;
// }

// // Fix Leaflet default icon path issue
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// // Custom marker icon to match theme (#B02629)
// const redIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//   shadowSize: [41, 41],
// });

// // User location marker (blue to distinguish from donation centers)
// const blueIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//   shadowSize: [41, 41],
// });

// export const BloodDonationEligibilityResult: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { isEligible, result, gender, failedCriteria } =
//     (location.state as LocationState) || {
//       isEligible: false,
//       result: "No eligibility data available.",
//       gender: null,
//       failedCriteria: [],
//     };
//   const [userLocation, setUserLocation] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);
//   const [locationError, setLocationError] = useState<string | null>(null);
//   const [donationCenters, setDonationCenters] = useState<DonationCenter[]>([]);
//   const [loadingCenters, setLoadingCenters] = useState<boolean>(false);

//   // Default map center (Colombo, Sri Lanka)
//   const defaultCenter: LatLngExpression = [6.927079, 79.861244];

//   // Fetch nearby donation centers and user location if eligible
//   useEffect(() => {
//     if (isEligible) {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           async (position) => {
//             const { latitude, longitude } = position.coords;
//             console.log("User location:", { latitude, longitude });
//             setUserLocation({ latitude, longitude });
//             const cookies = document.cookie; // Moved outside try block
//             console.log("Cookies sent with request:", cookies);
//             try {
//               setLoadingCenters(true);
//               const response = await axios.get<DonationCenter[]>(
//                 `http://localhost:9095/donors/hospitals/nearby`,
//                 {
//                   params: {
//                     latitude,
//                     longitude,
//                     radius: 50,
//                   },
//                   withCredentials: true,
//                 }
//               );
//               console.log("API response:", response.data);
//               setDonationCenters(response.data);
//               if (response.data.length === 0) {
//                 setLocationError("No donation centers found within 50 km.");
//               }
//             } catch (err: any) {
//               let errorMessage = "Failed to fetch donation centers.";
//               if (err.response) {
//                 if (err.response.status === 401) {
//                   errorMessage = "Authentication failed: Please log in again.";
//                 } else if (err.response.status === 404) {
//                   errorMessage =
//                     "Donation centers endpoint not found on server.";
//                 } else if (err.response.status === 400) {
//                   errorMessage = "Invalid request: Check location parameters.";
//                 } else {
//                   errorMessage = `Failed to fetch donation centers: ${
//                     err.response.data?.message || err.message
//                   } (Status: ${err.response.status})`;
//                 }
//               } else if (err.request) {
//                 errorMessage = `Network error: Unable to reach server at http://localhost:9095. ${err.message}`;
//               }
//               setLocationError(errorMessage);
//               console.error("Error fetching centers:", {
//                 message: err.message,
//                 status: err.response?.status,
//                 data: err.response?.data,
//                 params: { latitude, longitude, radius: 50 },
//                 cookies,
//               });
//             } finally {
//               setLoadingCenters(false);
//             }
//           },
//           (error) => {
//             const errorMessage = `Unable to retrieve your location: ${error.message}. Please ensure location services are enabled.`;
//             setLocationError(errorMessage);
//             console.error("Geolocation error:", error);
//             setDonationCenters([]);
//           }
//         );
//       } else {
//         setLocationError("Geolocation is not supported by your browser.");
//         console.error("Geolocation not supported");
//         setDonationCenters([]);
//       }
//     }
//   }, [isEligible]);

//   return (
//     <div className="w-full bg-gray-50 py-12">
//       <div className="container mx-auto px-4">
//         <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
//           Eligibility <span className="text-[#B02629]">Result</span>
//         </h1>
//         <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
//           Eligibility result for blood donation request ID: {id || "N/A"}.
//         </p>
//         <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
//           <p
//             className={`text-lg text-center ${
//               isEligible ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             {result}
//           </p>
//           {!isEligible && failedCriteria && failedCriteria.length > 0 && (
//             <div className="mt-4">
//               <p className="text-red-600 text-sm">Reasons for ineligibility:</p>
//               <ul className="list-disc list-inside text-red-600 text-sm">
//                 {failedCriteria.map((criterion, index) => (
//                   <li key={index}>
//                     {criterion === "ageValid" &&
//                       "Age must be between 18 and 60."}
//                     {criterion === "weightValid" &&
//                       "Weight must be at least 45 kg."}
//                     {criterion === "hemoglobinValid" &&
//                       "Hemoglobin must be at least 12.5 g/dL or unknown."}
//                     {criterion === "goodHealthValid" &&
//                       "You must be in good general health."}
//                     {criterion === "noFeverOrInfection" &&
//                       "You must not have a fever, infection, or flu-like symptoms."}
//                     {criterion === "wholeBloodDonationValid" &&
//                       "Last whole blood donation must be more than 4 months ago."}
//                     {criterion === "plateletDonationValid" &&
//                       "Last platelet donation must be more than 14 days ago."}
//                     {criterion === "noRecentTattoo" &&
//                       "No tattoos or piercings in the past 6 months."}
//                     {criterion === "notPregnantOrBreastfeeding" &&
//                       "You must not be pregnant or breastfeeding (past 6 months)."}
//                     {criterion === "noRecentSurgery" &&
//                       "No major surgery or transfusion in the past 6–12 months."}
//                     {criterion === "noRecentVaccination" &&
//                       "No vaccinations in the past 2–4 weeks."}
//                     {criterion === "noRecentAntibiotics" &&
//                       "No antibiotics or infections in the past 2 weeks."}
//                     {criterion === "noRecentDentalExtraction" &&
//                       "No dental extractions in the past 1 week."}
//                     {criterion === "noMenstruationWeakness" &&
//                       "You must not be menstruating and feeling weak or anemic."}
//                     {criterion === "noTravelMalaria" &&
//                       "No travel to malaria-prone areas in the past 6 months."}
//                     {criterion === "noChronicDisease" &&
//                       "No chronic diseases (e.g., diabetes, cancer, epilepsy)."}
//                     {criterion === "noHepatitisOrHIV" &&
//                       "No history of Hepatitis B, Hepatitis C, or HIV/AIDS."}
//                     {criterion === "noIntravenousDrugUse" &&
//                       "No history of intravenous drug use."}
//                     {criterion === "noHighRiskSexualBehavior" &&
//                       "No high-risk sexual behavior."}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           {isEligible && (
//             <div className="mt-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">
//                 Nearby Donation Centers
//               </h2>
//               {locationError && (
//                 <p className="text-red-600 text-sm mb-4">{locationError}</p>
//               )}
//               {loadingCenters && (
//                 <p className="text-gray-600 text-sm mb-4">
//                   Loading donation centers...
//                 </p>
//               )}
//               {!loadingCenters &&
//                 !locationError &&
//                 donationCenters.length === 0 && (
//                   <p className="text-gray-600 text-sm mb-4">
//                     No donation centers found within 50 km. Try increasing the
//                     search radius.
//                   </p>
//                 )}
//               {userLocation && (
//                 <p className="text-gray-600 text-sm mb-4">
//                   Your location: ({userLocation.latitude.toFixed(6)},{" "}
//                   {userLocation.longitude.toFixed(6)})
//                 </p>
//               )}
//               <div
//                 className="h-96 w-full rounded-lg overflow-hidden border border-gray-200"
//                 style={{ position: "relative", zIndex: 0 }}
//               >
//                 <MapContainer
//                   center={
//                     userLocation
//                       ? [userLocation.latitude, userLocation.longitude]
//                       : defaultCenter
//                   }
//                   zoom={13}
//                   style={{
//                     height: "100%",
//                     width: "100%",
//                     minHeight: "384px",
//                   }}
//                   className="z-0"
//                 >
//                   <TileLayer
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                   />
//                   {userLocation && (
//                     <Marker
//                       position={[userLocation.latitude, userLocation.longitude]}
//                       icon={blueIcon}
//                     >
//                       <Popup>Your Location</Popup>
//                     </Marker>
//                   )}
//                   {donationCenters.map((center) => (
//                     <Marker
//                       key={center.hospital_id}
//                       position={[center.latitude, center.longitude]}
//                       icon={redIcon}
//                     >
//                       <Popup>
//                         <div>
//                           <h3 className="font-semibold">
//                             {center.hospital_name}
//                           </h3>
//                           <p>
//                             {center.hospital_address || "No address provided"}
//                           </p>
//                           <p>Type: {center.hospital_type || "N/A"}</p>
//                           <p>Contact: {center.contact_number || "N/A"}</p>
//                           <p>District: {center.district_name}</p>
//                           {center.distance !== undefined && (
//                             <p>Distance: {center.distance.toFixed(2)} km</p>
//                           )}
//                         </div>
//                       </Popup>
//                     </Marker>
//                   ))}
//                 </MapContainer>
//               </div>
//             </div>
//           )}
//           <div className="mt-6 flex space-x-4">
//             {isEligible ? (
//               <button
//                 type="button"
//                 onClick={() => navigate(`/donor/eligibility/${id}`)}
//                 className="w-full bg-[#B02629] hover:bg-[#9a1f22] text-white py-2 rounded-full transition-colors"
//               >
//                 Update Answers
//               </button>
//             ) : (
//               <button
//                 type="button"
//                 onClick={() => navigate(`/donor/eligibility/${id}`)}
//                 className="w-full bg-[#B02629] hover:bg-[#9a1f22] text-white py-2 rounded-full transition-colors"
//               >
//                 Try Again
//               </button>
//             )}
//             <button
//               type="button"
//               onClick={() => navigate("/donor/bloodRequestsPage")}
//               className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-full transition-colors"
//             >
//               Back to Requests
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L, { type LatLngExpression } from "leaflet";
// import axios from "axios";

// // Import Leaflet CSS - CRITICAL for proper map display
// import "leaflet/dist/leaflet.css";

// // Define types
// interface EligibilityFormData {
//   age: number | null;
//   weight: number | null;
//   hemoglobin: number | null;
//   goodHealth: "yes" | "no" | null;
//   hasFeverOrInfection: "yes" | "no" | null;
//   lastWholeBloodDonation: string | null;
//   lastPlateletDonation: string | null;
//   recentTattooOrPiercing: "yes" | "no" | null;
//   isPregnantOrBreastfeeding: "yes" | "no" | null;
//   recentSurgeryOrTransfusion: "yes" | "no" | null;
//   recentVaccination: "yes" | "no" | null;
//   recentAntibiotics: "yes" | "no" | null;
//   recentDentalExtraction: "yes" | "no" | null;
//   menstruationWeakness: "yes" | "no" | null;
//   travelMalariaArea: "yes" | "no" | null;
//   hasChronicDisease: "yes" | "no" | null;
//   hasHepatitisOrHIV: "yes" | "no" | null;
//   intravenousDrugUse: "yes" | "no" | null;
//   highRiskSexualBehavior: "yes" | "no" | null;
// }

// interface LocationState {
//   isEligible: boolean;
//   formData: EligibilityFormData;
//   result: string;
//   gender?: string;
//   failedCriteria?: string[];
// }

// interface DonationCenter {
//   hospital_id: number;
//   hospital_name: string;
//   hospital_type: string | null;
//   hospital_address: string | null;
//   contact_number: string | null;
//   district_name: string;
//   latitude: number;
//   longitude: number;
//   distance?: number;
// }

// // Fix Leaflet default icon path issue
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// // Custom marker icon to match theme (#B02629)
// const redIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//   shadowSize: [41, 41],
// });

// // User location marker (blue to distinguish from donation centers)
// const blueIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//   shadowSize: [41, 41],
// });

// export const BloodDonationEligibilityResult: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { isEligible, result, gender, failedCriteria } =
//     (location.state as LocationState) || {
//       isEligible: false,
//       result: "No eligibility data available.",
//       gender: null,
//       failedCriteria: [],
//     };
//   const [userLocation, setUserLocation] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);
//   const [locationError, setLocationError] = useState<string | null>(null);
//   const [donationCenters, setDonationCenters] = useState<DonationCenter[]>([]);
//   const [loadingCenters, setLoadingCenters] = useState<boolean>(false);

//   // Default map center (Colombo, Sri Lanka)
//   const defaultCenter: LatLngExpression = [6.927079, 79.861244];

//   // Handle Confirm Donation button click
//   const handleConfirmDonation = () => {
//     console.log("Confirm Donation clicked", { donorId: id, donationCenters });
//     alert(
//       "Thank you for choosing to donate! Please contact a donation center to schedule your appointment."
//     );
//   };

//   // Fetch nearby donation centers and user location if eligible
//   useEffect(() => {
//     if (isEligible) {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           async (position) => {
//             const { latitude, longitude } = position.coords;
//             console.log("User location:", { latitude, longitude });
//             setUserLocation({ latitude, longitude });
//             const cookies = document.cookie;
//             console.log("Cookies sent with request:", cookies);
//             try {
//               setLoadingCenters(true);
//               const response = await axios.get<DonationCenter[]>(
//                 `http://localhost:9095/donors/hospitals/nearby`,
//                 {
//                   params: {
//                     latitude,
//                     longitude,
//                     radius: 20, // 20 km radius
//                   },
//                   withCredentials: true,
//                 }
//               );
//               console.log("API response:", response.data);
//               setDonationCenters(response.data);
//               if (response.data.length === 0) {
//                 setLocationError("No donation centers found within 20 km.");
//               }
//             } catch (err: any) {
//               let errorMessage = "Failed to fetch donation centers.";
//               if (err.response) {
//                 if (err.response.status === 401) {
//                   errorMessage = "Authentication failed: Please log in again.";
//                 } else if (err.response.status === 404) {
//                   errorMessage =
//                     "Donation centers endpoint not found on server.";
//                 } else if (err.response.status === 400) {
//                   errorMessage = "Invalid request: Check location parameters.";
//                 } else {
//                   errorMessage = `Failed to fetch donation centers: ${
//                     err.response.data?.message || err.message
//                   } (Status: ${err.response.status})`;
//                 }
//               } else if (err.request) {
//                 errorMessage = `Network error: Unable to reach server at http://localhost:9095. ${err.message}`;
//               }
//               setLocationError(errorMessage);
//               console.error("Error fetching centers:", {
//                 message: err.message,
//                 status: err.response?.status,
//                 data: err.response?.data,
//                 params: { latitude, longitude, radius: 10 },
//                 cookies,
//               });
//             } finally {
//               setLoadingCenters(false);
//             }
//           },
//           (error) => {
//             const errorMessage = `Unable to retrieve your location: ${error.message}. Please ensure location services are enabled.`;
//             setLocationError(errorMessage);
//             console.error("Geolocation error:", error);
//             setDonationCenters([]);
//           }
//         );
//       } else {
//         setLocationError("Geolocation is not supported by your browser.");
//         console.error("Geolocation not supported");
//         setDonationCenters([]);
//       }
//     }
//   }, [isEligible]);

//   return (
//     <div className="w-full bg-gray-50 py-12">
//       <div className="container mx-auto px-4">
//         <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
//           Eligibility <span className="text-[#B02629]">Result</span>
//         </h1>
//         <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
//           Eligibility result for blood donation request ID: {id || "N/A"}.
//         </p>
//         <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
//           <p
//             className={`text-lg text-center ${
//               isEligible ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             {result}
//           </p>
//           {!isEligible && failedCriteria && failedCriteria.length > 0 && (
//             <div className="mt-4">
//               <p className="text-red-600 text-sm">Reasons for ineligibility:</p>
//               <ul className="list-disc list-inside text-red-600 text-sm">
//                 {failedCriteria.map((criterion, index) => (
//                   <li key={index}>
//                     {criterion === "ageValid" &&
//                       "Age must be between 18 and 60."}
//                     {criterion === "weightValid" &&
//                       "Weight must be at least 45 kg."}
//                     {criterion === "hemoglobinValid" &&
//                       "Hemoglobin must be at least 12.5 g/dL or unknown."}
//                     {criterion === "goodHealthValid" &&
//                       "You must be in good general health."}
//                     {criterion === "noFeverOrInfection" &&
//                       "You must not have a fever, infection, or flu-like symptoms."}
//                     {criterion === "wholeBloodDonationValid" &&
//                       "Last whole blood donation must be more than 4 months ago."}
//                     {criterion === "plateletDonationValid" &&
//                       "Last platelet donation must be more than 14 days ago."}
//                     {criterion === "noRecentTattoo" &&
//                       "No tattoos or piercings in the past 6 months."}
//                     {criterion === "notPregnantOrBreastfeeding" &&
//                       "You must not be pregnant or breastfeeding (past 6 months)."}
//                     {criterion === "noRecentSurgery" &&
//                       "No major surgery or transfusion in the past 6–12 months."}
//                     {criterion === "noRecentVaccination" &&
//                       "No vaccinations in the past 2–4 weeks."}
//                     {criterion === "noRecentAntibiotics" &&
//                       "No antibiotics or infections in the past 2 weeks."}
//                     {criterion === "noRecentDentalExtraction" &&
//                       "No dental extractions in the past 1 week."}
//                     {criterion === "noMenstruationWeakness" &&
//                       "You must not be menstruating and feeling weak or anemic."}
//                     {criterion === "noTravelMalaria" &&
//                       "No travel to malaria-prone areas in the past 6 months."}
//                     {criterion === "noChronicDisease" &&
//                       "No chronic diseases (e.g., diabetes, cancer, epilepsy)."}
//                     {criterion === "noHepatitisOrHIV" &&
//                       "No history of Hepatitis B, Hepatitis C, or HIV/AIDS."}
//                     {criterion === "noIntravenousDrugUse" &&
//                       "No history of intravenous drug use."}
//                     {criterion === "noHighRiskSexualBehavior" &&
//                       "No high-risk sexual behavior."}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           {isEligible && (
//             <div className="mt-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">
//                 Nearby Donation Centers (within 20 km)
//               </h2>
//               {locationError && (
//                 <p className="text-red-600 text-sm mb-4">{locationError}</p>
//               )}
//               {loadingCenters && (
//                 <p className="text-gray-600 text-sm mb-4">
//                   Loading donation centers...
//                 </p>
//               )}
//               {!loadingCenters &&
//                 !locationError &&
//                 donationCenters.length === 0 && (
//                   <p className="text-gray-600 text-sm mb-4">
//                     No donation centers found within 20 km. Try checking with a
//                     local blood bank.
//                   </p>
//                 )}
//               {userLocation && (
//                 <p className="text-gray-600 text-sm mb-4">
//                   Your location: ({userLocation.latitude.toFixed(6)},{" "}
//                   {userLocation.longitude.toFixed(6)})
//                 </p>
//               )}
//               {/* Map and Hospital List Side by Side */}
//               {!loadingCenters && donationCenters.length > 0 && (
//                 <div className="flex flex-col md:flex-row gap-4 mb-6">
//                   {/* Map (Left) */}
//                   <div
//                     className="w-full md:w-1/2 h-96 rounded-lg overflow-hidden border border-gray-200"
//                     style={{ position: "relative", zIndex: 0 }}
//                   >
//                     <MapContainer
//                       center={
//                         userLocation
//                           ? [userLocation.latitude, userLocation.longitude]
//                           : defaultCenter
//                       }
//                       zoom={13}
//                       style={{
//                         height: "100%",
//                         width: "100%",
//                         minHeight: "384px",
//                       }}
//                       className="z-0"
//                     >
//                       <TileLayer
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                       />
//                       {userLocation && (
//                         <Marker
//                           position={[
//                             userLocation.latitude,
//                             userLocation.longitude,
//                           ]}
//                           icon={blueIcon}
//                         >
//                           <Popup>Your Location</Popup>
//                         </Marker>
//                       )}
//                       {donationCenters.map((center) => (
//                         <Marker
//                           key={center.hospital_id}
//                           position={[center.latitude, center.longitude]}
//                           icon={redIcon}
//                         >
//                           <Popup>
//                             <div>
//                               <h3 className="font-semibold">
//                                 {center.hospital_name}
//                               </h3>
//                               <p>
//                                 {center.hospital_address ||
//                                   "No address provided"}
//                               </p>
//                               <p>Type: {center.hospital_type || "N/A"}</p>
//                               <p>Contact: {center.contact_number || "N/A"}</p>
//                               <p>District: {center.district_name}</p>
//                               {center.distance !== undefined && (
//                                 <p>Distance: {center.distance.toFixed(2)} km</p>
//                               )}
//                             </div>
//                           </Popup>
//                         </Marker>
//                       ))}
//                     </MapContainer>
//                   </div>
//                   {/* Hospital List (Right) */}
//                   <div className="w-full md:w-1/2">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                       Donation Centers List
//                     </h3>
//                     <div className="max-h-96 overflow-y-auto pr-2">
//                       <ul className="space-y-4">
//                         {donationCenters.map((center) => (
//                           <li
//                             key={center.hospital_id}
//                             className="bg-gray-50 p-4 rounded-lg border border-gray-200"
//                           >
//                             <h4 className="font-semibold text-gray-800">
//                               {center.hospital_name}
//                             </h4>
//                             <p className="text-sm text-gray-600">
//                               Address:{" "}
//                               {center.hospital_address || "Not provided"}
//                             </p>
//                             <p className="text-sm text-gray-600">
//                               Type: {center.hospital_type || "N/A"}
//                             </p>
//                             <p className="text-sm text-gray-600">
//                               Contact: {center.contact_number || "N/A"}
//                             </p>
//                             <p className="text-sm text-gray-600">
//                               District: {center.district_name}
//                             </p>
//                             {center.distance !== undefined && (
//                               <p className="text-sm text-gray-600">
//                                 Distance: {center.distance.toFixed(2)} km
//                               </p>
//                             )}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               {/* Confirm Donation Button */}
//               {!loadingCenters && donationCenters.length > 0 && (
//                 <button
//                   type="button"
//                   onClick={handleConfirmDonation}
//                   className="w-full bg-[#B02629] hover:bg-[#9a1f22] text-white py-2 rounded-full transition-colors mb-4"
//                 >
//                   Confirm Donation
//                 </button>
//               )}
//             </div>
//           )}
//           <div className="mt-6">
//             <button
//               type="button"
//               onClick={() => navigate("/donor/bloodRequestsPage")}
//               className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-full transition-colors"
//             >
//               {isEligible ? "Back to Requests" : "Try Again"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



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

  // Default map center (Colombo, Sri Lanka)
  const defaultCenter: LatLngExpression = [6.927079, 79.861244];

  // Handle Confirm Donation button click
  // const handleConfirmDonation = async (center: DonationCenter) => {
  //   if (pendingHospitals.includes(center.hospital_id)) {
  //     alert("You have already requested to donate at this hospital.");
  //     return;
  //   }

  //   try {
  //     console.log("Confirm Donation clicked", { donorId: id, center });
  //     const response = await axios.post(
  //       `http://localhost:9095/donors/donation`,
  //       {
  //         donorId: id,
  //         hospitalId: center.hospital_id,
  //       },
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     console.log("Donation creation response:", response.data);
  //     alert(
  //       `Thank you for choosing to donate at ${center.hospital_name}! Your donation request has been recorded. Please contact the center to schedule your appointment.`
  //     );
  //     setDonationError(null);
  //     setPendingHospitals([...pendingHospitals, center.hospital_id]);
  //   } catch (err: any) {
  //     let errorMessage = "Failed to record donation.";
  //     if (err.response) {
  //       errorMessage = err.response.data?.message || err.message;
  //     } else if (err.request) {
  //       errorMessage = "Network error: Unable to reach server.";
  //     }
  //     setDonationError(errorMessage);
  //     console.error("Error recording donation:", err);
  //     alert(`Error: ${errorMessage}`);
  //   }
  // };

  // Improved handleConfirmDonation function for your React component

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
        // Only send hospitalId - donorId will be extracted from auth token
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
    
    // Show success message
    alert(
      `Thank you for choosing to donate at ${center.hospital_name}! Your donation request has been recorded. Please contact the center to schedule your appointment.`
    );
    
    // Update state to reflect the new pending request
    setDonationError(null);
    setPendingHospitals([...pendingHospitals, center.hospital_id]);

  } catch (err: any) {
    console.error("Error recording donation:", err);
    
    let errorMessage = "Failed to record donation.";
    
    if (err.response) {
      // Server responded with error status
      const status = err.response.status;
      const data = err.response.data;
      
      switch (status) {
        case 400:
          errorMessage = data?.message || "Invalid request data.";
          break;
        case 401:
          errorMessage = "Authentication required. Please log in again.";
          // Optionally redirect to login
          // navigate('/login');
          break;
        case 403:
          errorMessage = "Access denied. Authentication issue detected.";
          break;
        case 404:
          errorMessage = data?.message || "Donor or hospital not found.";
          break;
        case 409:
          errorMessage = "You have already requested to donate at this hospital.";
          // Update local state to reflect this
          setPendingHospitals([...pendingHospitals, center.hospital_id]);
          break;
        case 500:
          errorMessage = "Server error. Please try again later.";
          break;
        default:
          errorMessage = data?.message || `Server error (${status}). Please try again.`;
      }
    } else if (err.request) {
      // Network error
      errorMessage = "Network error: Unable to reach server. Please check your connection.";
    } else if (err.message) {
      // Request setup error
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
                      radius: 20, // 20 km radius
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
                setLocationError("No donation centers found within 20 km.");
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
    <div className="w-full bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
          Eligibility <span className="text-[#B02629]">Result</span>
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          Eligibility result for blood donation request ID: {id || "N/A"}.
        </p>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <p
            className={`text-lg text-center ${
              isEligible ? "text-green-600" : "text-red-600"
            }`}
          >
            {result}
          </p>
          {!isEligible && failedCriteria && failedCriteria.length > 0 && (
            <div className="mt-4">
              <p className="text-red-600 text-sm">Reasons for ineligibility:</p>
              <ul className="list-disc list-inside text-red-600 text-sm">
                {failedCriteria.map((criterion, index) => (
                  <li key={index}>
                    {criterion === "ageValid" &&
                      "Age must be between 18 and 60."}
                    {criterion === "weightValid" &&
                      "Weight must be at least 45 kg."}
                    {criterion === "hemoglobinValid" &&
                      "Hemoglobin must be at least 12.5 g/dL or unknown."}
                    {criterion === "goodHealthValid" &&
                      "You must be in good general health."}
                    {criterion === "noFeverOrInfection" &&
                      "You must not have a fever, infection, or flu-like symptoms."}
                    {criterion === "wholeBloodDonationValid" &&
                      "Last whole blood donation must be more than 4 months ago."}
                    {criterion === "plateletDonationValid" &&
                      "Last platelet donation must be more than 14 days ago."}
                    {criterion === "noRecentTattoo" &&
                      "No tattoos or piercings in the past 6 months."}
                    {criterion === "notPregnantOrBreastfeeding" &&
                      "You must not be pregnant or breastfeeding (past 6 months)."}
                    {criterion === "noRecentSurgery" &&
                      "No major surgery or transfusion in the past 6–12 months."}
                    {criterion === "noRecentVaccination" &&
                      "No vaccinations in the past 2–4 weeks."}
                    {criterion === "noRecentAntibiotics" &&
                      "No antibiotics or infections in the past 2 weeks."}
                    {criterion === "noRecentDentalExtraction" &&
                      "No dental extractions in the past 1 week."}
                    {criterion === "noMenstruationWeakness" &&
                      "You must not be menstruating and feeling weak or anemic."}
                    {criterion === "noTravelMalaria" &&
                      "No travel to malaria-prone areas in the past 6 months."}
                    {criterion === "noChronicDisease" &&
                      "No chronic diseases (e.g., diabetes, cancer, epilepsy)."}
                    {criterion === "noHepatitisOrHIV" &&
                      "No history of Hepatitis B, Hepatitis C, or HIV/AIDS."}
                    {criterion === "noIntravenousDrugUse" &&
                      "No history of intravenous drug use."}
                    {criterion === "noHighRiskSexualBehavior" &&
                      "No high-risk sexual behavior."}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {isEligible && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Nearby Donation Centers (within 20 km)
              </h2>
              {locationError && (
                <p className="text-red-600 text-sm mb-4">{locationError}</p>
              )}
              {donationError && (
                <p className="text-red-600 text-sm mb-4">{donationError}</p>
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
                    No donation centers found within 20 km. Try checking with a
                    local blood bank.
                  </p>
                )}
              {userLocation && (
                <p className="text-gray-600 text-sm mb-4">
                  Your location: ({userLocation.latitude.toFixed(6)},{" "}
                  {userLocation.longitude.toFixed(6)})
                </p>
              )}
              {/* Map and Hospital List Side by Side */}
              {!loadingCenters && donationCenters.length > 0 && (
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  {/* Map (Left) */}
                  <div
                    className="w-full md:w-1/2 h-96 rounded-lg overflow-hidden border border-gray-200"
                    style={{ position: "relative", zIndex: 0 }}
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
                          <Popup>Your Location</Popup>
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
                            <Popup>
                              <div>
                                <h3 className="font-semibold">
                                  {center.hospital_name}
                                </h3>
                                <p>
                                  {center.hospital_address ||
                                    "No address provided"}
                                </p>
                                <p>Type: {center.hospital_type || "N/A"}</p>
                                <p>Contact: {center.contact_number || "N/A"}</p>
                                <p>District: {center.district_name}</p>
                                {center.distance !== undefined && (
                                  <p>Distance: {center.distance.toFixed(2)} km</p>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleConfirmDonation(center)}
                                  disabled={isPending}
                                  className={`mt-2 w-full ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#B02629] hover:bg-[#9a1f22]'} text-white py-1 rounded-full transition-colors text-sm`}
                                >
                                  {isPending ? 'Requested' : 'Donate Here'}
                                </button>
                              </div>
                            </Popup>
                          </Marker>
                        );
                      })}
                    </MapContainer>
                  </div>
                  {/* Hospital List (Right) */}
                  <div className="w-full md:w-1/2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Donation Centers List
                    </h3>
                    <div className="max-h-96 overflow-y-auto pr-2">
                      <ul className="space-y-4">
                        {donationCenters.map((center) => {
                          const isPending = pendingHospitals.includes(center.hospital_id);
                          return (
                            <li
                              key={center.hospital_id}
                              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                            >
                              <h4 className="font-semibold text-gray-800">
                                {center.hospital_name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Address:{" "}
                                {center.hospital_address || "Not provided"}
                              </p>
                              <p className="text-sm text-gray-600">
                                Type: {center.hospital_type || "N/A"}
                              </p>
                              <p className="text-sm text-gray-600">
                                Contact: {center.contact_number || "N/A"}
                              </p>
                              <p className="text-sm text-gray-600">
                                District: {center.district_name}
                              </p>
                              {center.distance !== undefined && (
                                <p className="text-sm text-gray-600">
                                  Distance: {center.distance.toFixed(2)} km
                                </p>
                              )}
                              <button
                                type="button"
                                onClick={() => handleConfirmDonation(center)}
                                disabled={isPending}
                                className={`mt-2 w-full ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#B02629] hover:bg-[#9a1f22]'} text-white py-1 rounded-full transition-colors text-sm`}
                              >
                                {isPending ? 'Requested' : 'Donate Here'}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate("/donor/bloodRequestsPage")}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-full transition-colors"
            >
              {isEligible ? "Back to Requests" : "Try Again"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};