import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

// Define types
interface EligibilityFormData {
  age: number | null;
  weight: number | null;
  recentTravel: boolean;
  hasMedicalCondition: boolean;
  isPregnant: boolean;
}

interface LocationState {
  isEligible: boolean;
  formData: EligibilityFormData;
  result: string;
}

interface DonationCenter {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number; // Distance in kilometers
}

export const BloodDonationEligibilityResult: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isEligible, result } = (location.state as LocationState) || {
    isEligible: false,
    result: "No eligibility data available.",
  };
  const [, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [donationCenters, setDonationCenters] = useState<DonationCenter[]>([]);

  // Mock donation centers (replace with backend data in the future)
  const mockCenters: DonationCenter[] = [
    {
      id: 1,
      name: "Central Hospital",
      address: "123 Main St, City",
      latitude: 12.9716,
      longitude: 77.5946,
    },
    {
      id: 2,
      name: "City Medical Center",
      address: "456 Oak Ave, City",
      latitude: 12.9616,
      longitude: 77.5846,
    },
    {
      id: 3,
      name: "Community Blood Bank",
      address: "789 Pine Rd, City",
      latitude: 12.9816,
      longitude: 77.6046,
    },
  ];

  // Haversine formula to calculate distance between two points (in kilometers)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Request user's location if eligible
  useEffect(() => {
    if (isEligible) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
            // Calculate distances for mock centers
            const centersWithDistance = mockCenters.map((center) => ({
              ...center,
              distance: calculateDistance(
                latitude,
                longitude,
                center.latitude,
                center.longitude
              ),
            }));
            // Sort by distance
            centersWithDistance.sort(
              (a, b) => (a.distance || 0) - (b.distance || 0)
            );
            setDonationCenters(centersWithDistance);
          },
          () => {
            setLocationError(
              "Unable to retrieve your location. Please ensure location services are enabled."
            );
            setDonationCenters(mockCenters); // Fallback to mock centers without distance
          }
        );
      } else {
        setLocationError("Geolocation is not supported by your browser.");
        setDonationCenters(mockCenters);
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
          Eligibility result for blood donation request ID: {requestId}.
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
              {donationCenters.length > 0 ? (
                <ul className="space-y-4">
                  {donationCenters.map((center) => (
                    <li
                      key={center.id}
                      className="border-b border-gray-200 pb-2"
                    >
                      <h3 className="text-lg font-semibold text-gray-800">
                        {center.name}
                      </h3>
                      <p className="text-gray-600">{center.address}</p>
                      {center.distance !== undefined && (
                        <p className="text-gray-500 text-sm">
                          Distance: {center.distance.toFixed(2)} km
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Loading donation centers...</p>
              )}
            </div>
          )}
          <div className="mt-6 flex space-x-4">
            {isEligible ? (
              <button
                type="button"
                onClick={() => navigate(`/eligibility/${requestId}`)}
                className="w-full bg-[#B02629] hover:bg-[#9a1f22] text-white py-2 rounded-full transition-colors"
              >
                Update Answers
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate(`/eligibility/${requestId}`)}
                className="w-full bg-[#B02629] hover:bg-[#9a1f22] text-white py-2 rounded-full transition-colors"
              >
                Try Again
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/blood-requests")}
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

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L, { LatLngExpression } from "leaflet";

// // Define types
// interface EligibilityFormData {
//   age: number | null;
//   weight: number | null;
//   recentTravel: boolean;
//   hasMedicalCondition: boolean;
//   isPregnant: boolean;
// }

// interface LocationState {
//   isEligible: boolean;
//   formData: EligibilityFormData;
//   result: string;
// }

// interface DonationCenter {
//   id: number;
//   name: string;
//   address: string;
//   latitude: number;
//   longitude: number;
//   distance?: number; // Distance in kilometers
// }

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
//   const { requestId } = useParams<{ requestId: string }>();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { isEligible, result } = (location.state as LocationState) || {
//     isEligible: false,
//     result: "No eligibility data available.",
//   };
//   const [userLocation, setUserLocation] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);
//   const [locationError, setLocationError] = useState<string | null>(null);
//   const [donationCenters, setDonationCenters] = useState<DonationCenter[]>([]);

//   // Default map center (Bangalore, India) if user location is unavailable
//   const defaultCenter: LatLngExpression = [12.9716, 77.5946];

//   // Mock donation centers (replace with backend data in the future)
//   const mockCenters: DonationCenter[] = [
//     {
//       id: 1,
//       name: "Central Hospital",
//       address: "123 Main St, City",
//       latitude: 12.9716,
//       longitude: 77.5946,
//     },
//     {
//       id: 2,
//       name: "City Medical Center",
//       address: "456 Oak Ave, City",
//       latitude: 12.9616,
//       longitude: 77.5846,
//     },
//     {
//       id: 3,
//       name: "Community Blood Bank",
//       address: "789 Pine Rd, City",
//       latitude: 12.9816,
//       longitude: 77.6046,
//     },
//   ];

//   // Haversine formula to calculate distance between two points (in kilometers)
//   const calculateDistance = (
//     lat1: number,
//     lon1: number,
//     lat2: number,
//     lon2: number
//   ): number => {
//     const R = 6371; // Earth's radius in kilometers
//     const dLat = (lat2 - lat1) * (Math.PI / 180);
//     const dLon = (lon2 - lon1) * (Math.PI / 180);
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(lat1 * (Math.PI / 180)) *
//         Math.cos(lat2 * (Math.PI / 180)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   };

//   // Request user's location if eligible
//   useEffect(() => {
//     if (isEligible) {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const { latitude, longitude } = position.coords;
//             setUserLocation({ latitude, longitude });
//             // Calculate distances for mock centers
//             const centersWithDistance = mockCenters.map((center) => ({
//               ...center,
//               distance: calculateDistance(
//                 latitude,
//                 longitude,
//                 center.latitude,
//                 center.longitude
//               ),
//             }));
//             // Sort by distance
//             centersWithDistance.sort(
//               (a, b) => (a.distance || 0) - (b.distance || 0)
//             );
//             setDonationCenters(centersWithDistance);
//           },
//           (error) => {
//             setLocationError(
//               "Unable to retrieve your location. Please ensure location services are enabled."
//             );
//             setDonationCenters(mockCenters); // Fallback to mock centers without distance
//           }
//         );
//       } else {
//         setLocationError("Geolocation is not supported by your browser.");
//         setDonationCenters(mockCenters);
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
//           Eligibility result for blood donation request ID: {requestId}.
//         </p>
//         <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
//           <p
//             className={`text-lg text-center ${
//               isEligible ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             {result}
//           </p>
//           {isEligible && (
//             <div className="mt-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">
//                 Nearby Donation Centers
//               </h2>
//               {locationError && (
//                 <p className="text-red-600 text-sm mb-4">{locationError}</p>
//               )}
//               <div className="h-96 w-full rounded-lg overflow-hidden">
//                 <MapContainer
//                   center={
//                     userLocation
//                       ? [userLocation.latitude, userLocation.longitude]
//                       : defaultCenter
//                   }
//                   zoom={13}
//                   style={{ height: "100%", width: "100%" }}
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
//                       key={center.id}
//                       position={[center.latitude, center.longitude]}
//                       icon={redIcon}
//                     >
//                       <Popup>
//                         <div>
//                           <h3 className="font-semibold">{center.name}</h3>
//                           <p>{center.address}</p>
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
//                 onClick={() => navigate(`/eligibility/${requestId}`)}
//                 className="w-full bg-[#B02629] hover:bg-[#9a1f22] text-white py-2 rounded-full transition-colors"
//               >
//                 Update Answers
//               </button>
//             ) : (
//               <button
//                 type="button"
//                 onClick={() => navigate(`/eligibility/${requestId}`)}
//                 className="w-full bg-[#B02629] hover:bg-[#9a1f22] text-white py-2 rounded-full transition-colors"
//               >
//                 Try Again
//               </button>
//             )}
//             <button
//               type="button"
//               onClick={() => navigate("/blood-requests")}
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
