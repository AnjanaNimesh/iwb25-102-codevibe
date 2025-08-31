// // import React, { useState } from "react";
// // import { SearchIcon, FilterIcon, MapPinIcon, DropletIcon } from "lucide-react";
// // export const BloodRequestsPage = () => {
// //   const [filter, setFilter] = useState("all");
// //   const bloodRequests = [
// //     {
// //       id: 1,
// //       patientName: "John Doe",
// //       bloodType: "A+",
// //       location: "Central Hospital",
// //       urgency: "High",
// //       requiredUnits: 3,
// //       requestDate: "2023-06-15",
// //       description: "Emergency surgery for accident victim",
// //     },
// //     {
// //       id: 2,
// //       patientName: "Jane Smith",
// //       bloodType: "O-",
// //       location: "Memorial Hospital",
// //       urgency: "Critical",
// //       requiredUnits: 2,
// //       requestDate: "2023-06-14",
// //       description: "Cancer patient requiring blood transfusion",
// //     },
// //     {
// //       id: 3,
// //       patientName: "Robert Johnson",
// //       bloodType: "B+",
// //       location: "City Medical Center",
// //       urgency: "Medium",
// //       requiredUnits: 1,
// //       requestDate: "2023-06-16",
// //       description: "Scheduled surgery next week",
// //     },
// //     {
// //       id: 4,
// //       patientName: "Sarah Williams",
// //       bloodType: "AB+",
// //       location: "Community Hospital",
// //       urgency: "High",
// //       requiredUnits: 4,
// //       requestDate: "2023-06-15",
// //       description: "Multiple transfusions needed for treatment",
// //     },
// //     {
// //       id: 5,
// //       patientName: "Michael Brown",
// //       bloodType: "O+",
// //       location: "University Hospital",
// //       urgency: "Medium",
// //       requiredUnits: 2,
// //       requestDate: "2023-06-17",
// //       description: "Regular transfusion for chronic condition",
// //     },
// //   ];
// //   const filteredRequests =
// //     filter === "all"
// //       ? bloodRequests
// //       : bloodRequests.filter((request) =>
// //           filter === "critical"
// //             ? request.urgency === "Critical"
// //             : request.urgency === "High"
// //         );
// //   return (
// //     <div className="w-full bg-gray-50 py-12">
// //       <div className="container mx-auto px-4">
// //         <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
// //           Blood <span className="text-[#B02629]">Requests</span>
// //         </h1>
// //         <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
// //           These are current blood donation requests in your area. Your donation
// //           can directly help these patients in need.
// //         </p>
// //         <div className="flex flex-col md:flex-row justify-between items-center mb-8">
// //           <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
// //             <input
// //               type="text"
// //               placeholder="Search requests..."
// //               className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent"
// //             />
// //             <SearchIcon
// //               size={18}
// //               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
// //             />
// //           </div>
// //           <div className="flex space-x-2">
// //             <button
// //               className={`px-4 py-2 rounded-full ${
// //                 filter === "all"
// //                   ? "bg-[#B02629] text-white"
// //                   : "bg-white text-gray-800 border border-gray-300"
// //               }`}
// //               onClick={() => setFilter("all")}
// //             >
// //               All Requests
// //             </button>
// //             <button
// //               className={`px-4 py-2 rounded-full ${
// //                 filter === "critical"
// //                   ? "bg-[#B02629] text-white"
// //                   : "bg-white text-gray-800 border border-gray-300"
// //               }`}
// //               onClick={() => setFilter("critical")}
// //             >
// //               Critical
// //             </button>
// //             <button
// //               className={`px-4 py-2 rounded-full ${
// //                 filter === "high"
// //                   ? "bg-[#B02629] text-white"
// //                   : "bg-white text-gray-800 border border-gray-300"
// //               }`}
// //               onClick={() => setFilter("high")}
// //             >
// //               High Priority
// //             </button>
// //           </div>
// //         </div>
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //           {filteredRequests.map((request) => (
// //             <div
// //               key={request.id}
// //               className="bg-white rounded-lg shadow-md overflow-hidden"
// //             >
// //               <div
// //                 className={`p-4 ${
// //                   request.urgency === "Critical"
// //                     ? "bg-red-600"
// //                     : request.urgency === "High"
// //                     ? "bg-orange-500"
// //                     : "bg-yellow-500"
// //                 } text-white`}
// //               >
// //                 <div className="flex justify-between items-center">
// //                   <span className="font-bold">{request.urgency} Priority</span>
// //                   <span className="text-xl font-bold">{request.bloodType}</span>
// //                 </div>
// //               </div>
// //               <div className="p-6">
// //                 <h3 className="text-xl font-semibold text-gray-800 mb-2">
// //                   Patient: {request.patientName}
// //                 </h3>
// //                 <p className="text-gray-600 mb-4">{request.description}</p>
// //                 <div className="flex items-center text-gray-500 mb-2">
// //                   <MapPinIcon size={16} className="mr-2" />
// //                   <span>{request.location}</span>
// //                 </div>
// //                 <div className="flex items-center text-gray-500 mb-4">
// //                   <DropletIcon size={16} className="mr-2" />
// //                   <span>{request.requiredUnits} units needed</span>
// //                 </div>
// //                 <button className="w-full bg-[#B02629] hover:bg-[#9a1f22] text-white py-2 rounded-full transition-colors">
// //                   Donate Now
// //                 </button>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { SearchIcon, MapPinIcon, DropletIcon } from "lucide-react";

// // Define the BloodRequest type to match the backend's BloodRequest record
// interface BloodRequest {
//   request_id?: number;
//   hospital_id: number;
//   blood_group: string;
//   units_required: number;
//   request_date?: string;
//   request_status: string;
//   notes?: string | null;
// }

// // Define the Donor type to fetch blood_group
// interface Donor {
//   donor_id: number;
//   donor_name: string;
//   email: string;
//   phone_number: string;
//   district_name: string;
//   blood_group: string;
//   last_donation_date?: string;
// }

// export const BloodRequestsPage: React.FC = () => {
//   const [filter, setFilter] = useState<"all" | "critical" | "high">("all");
//   const [requests, setRequests] = useState<BloodRequest[]>([]);
//   const [userBloodGroup, setUserBloodGroup] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   // Hardcoded donor_id for demo (replace with auth context in real app)
//   const donorId = 1;

//   // Define blood group compatibility
//   const bloodCompatibility: { [key: string]: string[] } = {
//     "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
//     "O+": ["O+", "A+", "B+", "AB+"],
//     "A-": ["A-", "A+", "AB-", "AB+"],
//     "A+": ["A+", "AB+"],
//     "B-": ["B-", "B+", "AB-", "AB+"],
//     "B+": ["B+", "AB+"],
//     "AB-": ["AB-", "AB+"],
//     "AB+": ["AB+"],
//   };

//   // Fetch blood requests and user blood group
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Fetch user blood group
//         const donorResponse = await axios.get<Donor>(
//           `http://localhost:9095/donors/${donorId}`
//         );
//         setUserBloodGroup(donorResponse.data.blood_group);

//         // Fetch blood requests
//         const response = await axios.get<BloodRequest[]>(
//           "http://localhost:9094/bloodrequests/requests"
//         );
//         setRequests(response.data);
//         setError(null);
//       } catch (err) {
//         setError("Failed to fetch data. Please try again later.");
//         console.error("Error fetching data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Filter requests based on status and blood group compatibility
//   const filteredRequests = requests
//     .filter((request) =>
//       filter === "all"
//         ? true
//         : request.request_status ===
//           (filter === "critical" ? "Pending" : "Urgent")
//     )
//     .filter((request) =>
//       userBloodGroup && bloodCompatibility[userBloodGroup]
//         ? bloodCompatibility[userBloodGroup].includes(request.blood_group)
//         : false
//     );

//   // Map request_status to urgency for display
//   const getUrgency = (status: string): string => {
//     switch (status) {
//       case "Pending":
//         return "Medium";
//       case "Urgent":
//         return "High";
//       case "Fulfilled":
//         return "Low";
//       default:
//         return "Medium";
//     }
//   };

//   // Map request_status to background color for display
//   const getUrgencyColor = (status: string): string => {
//     switch (status) {
//       case "Pending":
//         return "bg-yellow-500";
//       case "Urgent":
//         return "bg-orange-500";
//       case "Fulfilled":
//         return "bg-green-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   return (
//     <div className="w-full bg-gray-50 py-12">
//       <div className="container mx-auto px-4">
//         <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
//           Blood <span className="text-[#B02629]">Requests</span>
//         </h1>
//         <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
//           These are current blood donation requests you can donate to based on
//           your blood type ({userBloodGroup || "Unknown"}).
//         </p>
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8">
//           <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
//             <input
//               type="text"
//               placeholder="Search requests..."
//               className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent"
//             />
//             <SearchIcon
//               size={18}
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//             />
//           </div>
//           <div className="flex space-x-2">
//             <button
//               className={`px-4 py-2 rounded-full ${
//                 filter === "all"
//                   ? "bg-[#B02629] text-white"
//                   : "bg-white text-gray-800 border border-gray-300"
//               }`}
//               onClick={() => setFilter("all")}
//             >
//               All Requests
//             </button>
//             <button
//               className={`px-4 py-2 rounded-full ${
//                 filter === "critical"
//                   ? "bg-[#B02629] text-white"
//                   : "bg-white text-gray-800 border border-gray-300"
//               }`}
//               onClick={() => setFilter("critical")}
//             >
//               Critical
//             </button>
//             <button
//               className={`px-4 py-2 rounded-full ${
//                 filter === "high"
//                   ? "bg-[#B02629] text-white"
//                   : "bg-white text-gray-800 border border-gray-300"
//               }`}
//               onClick={() => setFilter("high")}
//             >
//               High Priority
//             </button>
//           </div>
//         </div>
//         {loading && (
//           <div className="text-center text-gray-600">Loading requests...</div>
//         )}
//         {error && <div className="text-center text-red-600">{error}</div>}
//         {!loading && !error && filteredRequests.length === 0 && (
//           <div className="text-center text-gray-600">
//             No blood requests found for your blood type.
//           </div>
//         )}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredRequests.map((request) => (
//             <div
//               key={request.request_id}
//               className="bg-white rounded-lg shadow-md overflow-hidden"
//             >
//               <div
//                 className={`p-4 ${getUrgencyColor(
//                   request.request_status
//                 )} text-white`}
//               >
//                 <div className="flex justify-between items-center">
//                   <span className="font-bold">
//                     {getUrgency(request.request_status)} Priority
//                   </span>
//                   <span className="text-xl font-bold">
//                     {request.blood_group}
//                   </span>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                   Request ID: {request.request_id}
//                 </h3>
//                 <p className="text-gray-600 mb-4">
//                   {request.notes || "No additional details"}
//                 </p>
//                 <div className="flex items-center text-gray-500 mb-2">
//                   <MapPinIcon size={16} className="mr-2" />
//                   <span>Hospital ID: {request.hospital_id}</span>
//                 </div>
//                 <div className="flex items-center text-gray-500 mb-4">
//                   <DropletIcon size={16} className="mr-2" />
//                   <span>{request.units_required} units needed</span>
//                 </div>
//                 <div className="flex items-center text-gray-500 mb-4">
//                   <span>Status: {request.request_status}</span>
//                 </div>
//                 <div className="flex items-center text-gray-500 mb-4">
//                   <span>Requested on: {request.request_date}</span>
//                 </div>
//                 <button
//                   className="w-full bg-[#B02629] hover:bg-[#9a1f22] text-white py-2 rounded-full transition-colors"
//                   onClick={() => navigate(`eligibility/${request.request_id}`)}
//                 >
//                   Donate Now
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };






// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { SearchIcon, MapPinIcon, DropletIcon } from "lucide-react";

// // Define the BloodRequest type to match the backend's BloodRequest record
// interface BloodRequest {
//   request_id?: number;
//   hospital_id: number;
//   hospital_name?: string;
//   blood_group: string;
//   units_required: number;
//   request_date?: string;
//   request_status: string;
//   notes?: string | null;
// }

// // Define the Donor type to fetch blood_group
// interface Donor {
//   donor_id: number;
//   donor_name: string;
//   email: string;
//   phone_number: string;
//   district_name: string;
//   blood_group: string;
//   last_donation_date?: string;
//   status?: string;
// }

// export const BloodRequestsPage: React.FC = () => {
//   const [filter, setFilter] = useState<"all" | "critical" | "high">("all");
//   const [requests, setRequests] = useState<BloodRequest[]>([]);
//   const [userBloodGroup, setUserBloodGroup] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [debugInfo, setDebugInfo] = useState<string>("");
//   const navigate = useNavigate();

//   // Fetch blood requests and user blood group
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setDebugInfo("Starting to fetch data...");

//         // Step 1: Fetch the donor profile first to ensure the user is a donor
//         setDebugInfo("Fetching donor profile...");
//         const donorResponse = await fetch(`http://localhost:9095/donors/profile`, {
//           method: 'GET',
//           credentials: 'include', // Important: Include cookies for authentication
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!donorResponse.ok) {
//           const errorData = await donorResponse.json();
//           throw new Error(`Server Error (${donorResponse.status}): ${errorData?.message || donorResponse.statusText}`);
//         }
//         const donorData: Donor = await donorResponse.json();
//         const bloodGroup = donorData.blood_group;
//         setUserBloodGroup(bloodGroup);
//         setDebugInfo("Donor profile fetched successfully");

//         // Step 2: Now that we have verified the user is a donor, fetch compatible blood requests
//         setDebugInfo("Fetching blood requests...");
//         const requestsResponse = await fetch(`http://localhost:9094/bloodrequests/compatible`, {
//           method: 'GET',
//           credentials: 'include', // Important: Include cookies for authentication
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!requestsResponse.ok) {
//           const errorData = await requestsResponse.json();
//           throw new Error(`Server Error (${requestsResponse.status}): ${errorData?.message || requestsResponse.statusText}`);
//         }
//         const requestsData: BloodRequest[] = await requestsResponse.json();
//         setRequests(requestsData);
//         setDebugInfo("Blood requests fetched successfully");

//         setError(null);
//       } catch (err: any) {
//         console.error("Error fetching data:", err);
        
//         // More detailed error logging for fetch API
//         if (err.message.includes("Server Error")) {
//           setError(err.message);
//           // Try to extract more details if available, though it might be in err.message already
//           setDebugInfo(`Error detail: ${err.message}`);
//         } else if (err instanceof TypeError && err.message === "Failed to fetch") {
//           setError("Network Error: Could not connect to the server. Please check your internet connection or server status.");
//           setDebugInfo("Failed to fetch due to network error or CORS issue.");
//         } else {
//           setError(`Request Error: ${err.message}`);
//           setDebugInfo(`Error message: ${err.message}`);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []); // Empty dependency array means this effect runs once on mount

//   // Filter requests based on status
//   const filteredRequests = requests.filter((request) => {
//     if (filter === "all") {
//       return true;
//     }
//     if (filter === "critical" && request.request_status === "Pending") {
//       return true;
//     }
//     if (filter === "high" && request.request_status === "Urgent") {
//       return true;
//     }
//     return false;
//   });

//   // Map request_status to urgency for display
//   const getUrgency = (status: string): string => {
//     switch (status) {
//       case "Pending":
//         return "Medium";
//       case "Urgent":
//         return "High";
//       case "Fulfilled":
//         return "Low";
//       default:
//         return "Medium";
//     }
//   };

//   // Map request_status to background color for display
//   const getUrgencyColor = (status: string): string => {
//     switch (status) {
//       case "Pending":
//         return "bg-yellow-500";
//       case "Urgent":
//         return "bg-orange-500";
//       case "Fulfilled":
//         return "bg-green-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   return (
//     <div className="w-full bg-gray-50 py-12 font-inter"> {/* Added font-inter for consistency */}
//       <div className="container mx-auto px-4">
//         <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
//           Blood <span className="text-[#B02629]">Requests</span>
//         </h1>
//         <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
//           These are current blood donation requests you can donate to based on
//           your blood type ({userBloodGroup || "Unknown"}).
//         </p>
        
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8">
//           <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
//             <input
//               type="text"
//               placeholder="Search requests..."
//               className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent"
//             />
//             <SearchIcon
//               size={18}
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//             />
//           </div>
//           <div className="flex space-x-2">
//             <button
//               className={`px-4 py-2 rounded-full ${
//                 filter === "all"
//                   ? "bg-[#B02629] text-white"
//                   : "bg-white text-gray-800 border border-gray-300"
//               }`}
//               onClick={() => setFilter("all")}
//             >
//               All Requests
//             </button>
//             <button
//               className={`px-4 py-2 rounded-full ${
//                 filter === "critical"
//                   ? "bg-[#B02629] text-white"
//                   : "bg-white text-gray-800 border border-gray-300"
//               }`}
//               onClick={() => setFilter("critical")}
//             >
//               Pending
//             </button>
//             <button
//               className={`px-4 py-2 rounded-full ${
//                 filter === "high"
//                   ? "bg-[#B02629] text-white"
//                   : "bg-white text-gray-800 border border-gray-300"
//               }`}
//               onClick={() => setFilter("high")}
//             >
//               Urgent
//             </button>
//           </div>
//         </div>

//         {loading && (
//           <div className="text-center text-gray-600">Loading requests...</div>
//         )}
        
//         {error && (
//           <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//             <h3 className="font-bold">Error:</h3>
//             <p>{error}</p>
//           </div>
//         )}
        
//         {!loading && !error && filteredRequests.length === 0 && (
//           <div className="text-center text-gray-600">
//             No blood requests found for your blood type.
//           </div>
//         )}
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredRequests.map((request) => (
//             <div
//               key={request.request_id}
//               className="bg-white rounded-lg shadow-md overflow-hidden"
//             >
//               <div
//                 className={`p-4 ${getUrgencyColor(
//                   request.request_status
//                 )} text-white`}
//               >
//                 <div className="flex justify-between items-center">
//                   <span className="font-bold">
//                     {getUrgency(request.request_status)} Priority
//                   </span>
//                   <span className="text-xl font-bold">
//                     {request.blood_group}
//                   </span>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                   Request ID: {request.request_id}
//                 </h3>
//                 <p className="text-gray-600 mb-4">
//                   {request.notes || "No additional details"}
//                 </p>
//                 <div className="flex items-center text-gray-500 mb-2">
//                   <MapPinIcon size={16} className="mr-2" />
//                   <span>
//                     {request.hospital_name || `Hospital ID: ${request.hospital_id}`}
//                   </span>
//                 </div>
//                 <div className="flex items-center text-gray-500 mb-4">
//                   <DropletIcon size={16} className="mr-2" />
//                   <span>{request.units_required} units needed</span>
//                 </div>
//                 <div className="flex items-center text-gray-500 mb-4">
//                   <span>Status: {request.request_status}</span>
//                 </div>
//                 <div className="flex items-center text-gray-500 mb-4">
//                   <span>Requested on: {request.request_date}</span>
//                 </div>
//                 <button
//                   className="w-full bg-[#B02629] hover:bg-[#9a1f22] text-white py-2 rounded-full transition-colors"
//                   onClick={() => navigate(`eligibility/${request.request_id}`)}
//                 >
//                   Donate Now
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Droplet, Clock, Heart, AlertCircle, TrendingUp, Users, Calendar } from "lucide-react";

// Define the BloodRequest and Donor interfaces (unchanged)
interface BloodRequest {
  request_id?: number;
  hospital_id: number;
  hospital_name?: string;
  blood_group: string;
  units_required: number;
  request_date?: string;
  request_status: string;
  notes?: string | null;
}

interface Donor {
  donor_id: number;
  donor_name: string;
  email: string;
  phone_number: string;
  district_name: string;
  blood_group: string;
  last_donation_date?: string;
  status?: string;
}

export const BloodRequestsPage: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "critical" | "high">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [userBloodGroup, setUserBloodGroup] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const navigate = useNavigate();

  // Fetch blood requests and user blood group (unchanged)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setDebugInfo("Starting to fetch data...");

        setDebugInfo("Fetching donor profile...");
        const donorResponse = await fetch(`http://localhost:9095/donors/profile`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!donorResponse.ok) {
          const errorData = await donorResponse.json();
          throw new Error(`Server Error (${donorResponse.status}): ${errorData?.message || donorResponse.statusText}`);
        }
        const donorData: Donor = await donorResponse.json();
        const bloodGroup = donorData.blood_group;
        setUserBloodGroup(bloodGroup);
        setDebugInfo("Donor profile fetched successfully");

        setDebugInfo("Fetching blood requests...");
        const requestsResponse = await fetch(`http://localhost:9094/bloodrequests/compatible`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!requestsResponse.ok) {
          const errorData = await requestsResponse.json();
          throw new Error(`Server Error (${requestsResponse.status}): ${errorData?.message || requestsResponse.statusText}`);
        }
        const requestsData: BloodRequest[] = await requestsResponse.json();
        setRequests(requestsData);
        setDebugInfo("Blood requests fetched successfully");

        setError(null);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        
        if (err.message.includes("Server Error")) {
          setError(err.message);
          setDebugInfo(`Error detail: ${err.message}`);
        } else if (err instanceof TypeError && err.message === "Failed to fetch") {
          setError("Network Error: Could not connect to the server. Please check your internet connection or server status.");
          setDebugInfo("Failed to fetch due to network error or CORS issue.");
        } else {
          setError(`Request Error: ${err.message}`);
          setDebugInfo(`Error message: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter requests and other helper functions (unchanged)
  const filteredRequests = requests.filter((request) => {
    const matchesFilter = (() => {
      if (filter === "all") return true;
      if (filter === "critical" && request.request_status === "Pending") return true;
      if (filter === "high" && request.request_status === "Urgent") return true;
      return false;
    })();
    
    const matchesSearch = searchQuery === "" || 
      request.hospital_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.blood_group.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getUrgency = (status: string): string => {
    switch (status) {
      case "Pending": return "Medium";
      case "Urgent": return "High";
      case "Fulfilled": return "Low";
      default: return "Medium";
    }
  };

  const getUrgencyStyles = (status: string) => {
    switch (status) {
      case "Urgent":
        return {
          bgGradient: "bg-gradient-to-r from-red-500 to-red-600",
          textColor: "text-red-600",
          borderColor: "border-red-200",
          bgLight: "bg-red-50",
          icon: AlertCircle
        };
      case "Pending":
        return {
          bgGradient: "bg-gradient-to-r from-amber-500 to-orange-500",
          textColor: "text-amber-600",
          borderColor: "border-amber-200",
          bgLight: "bg-amber-50",
          icon: Clock
        };
      case "Fulfilled":
        return {
          bgGradient: "bg-gradient-to-r from-green-500 to-green-600",
          textColor: "text-green-600",
          borderColor: "border-green-200",
          bgLight: "bg-green-50",
          icon: Heart
        };
      default:
        return {
          bgGradient: "bg-gradient-to-r from-blue-500 to-blue-600",
          textColor: "text-blue-600",
          borderColor: "border-blue-200",
          bgLight: "bg-blue-50",
          icon: Clock
        };
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section - Modified */}
      <div className="bg-gradient-to-r  text-red-500 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Heart className="w-10 h-10 mr-3 text-red-500 animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Blood Requests
              </h1>
            </div>
            <p className="text-xl text-black max-w-3xl mx-auto mb-6">
              Make a difference today. Find blood donation requests compatible with your blood type.
            </p>
            <div className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3">
              <Droplet className="w-5 h-5 mr-2 text-red-500" />
              <span className="font-semibold text-lg">
                Your Blood Type: {userBloodGroup || "Loading..."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the component remains unchanged */}
      <div className="container mx-auto px-4 -mt-6 relative z-10">
        {/* Stats Section */}
        {!loading && !error && requests.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-red-600 to-red-400 rounded-xl p-4 text-white text-center">
                <Users className="w-6 h-6 mx-auto mb-2 opacity-80" />
                <div className="text-2xl font-bold mb-1">{requests.length}</div>
                <div className="text-white text-sm">Total Requests</div>
              </div>
              <div className="bg-gradient-to-r from-red-600 to-red-400 rounded-xl p-4 text-white text-center">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-80" />
                <div className="text-2xl font-bold mb-1">
                  {requests.filter(r => r.request_status === "Urgent").length}
                </div>
                <div className="text-white text-sm">Urgent</div>
              </div>
              <div className="bg-gradient-to-r from-red-600 to-red-400 rounded-xl p-4 text-white text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 opacity-80" />
                <div className="text-2xl font-bold mb-1">
                  {requests.filter(r => r.request_status === "Pending").length}
                </div>
                <div className="text-white text-sm">Pending</div>
              </div>
              <div className="bg-gradient-to-r from-red-600 to-red-400 rounded-xl p-4 text-white text-center">
                <Droplet className="w-6 h-6 mx-auto mb-2 opacity-80" />
                <div className="text-2xl font-bold mb-1">
                  {requests.reduce((sum, r) => sum + r.units_required, 0)}
                </div>
                <div className="text-white text-sm">Units Needed</div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by hospital, blood type, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "all", label: "All Requests", count: requests.length, color: "red" },
                { key: "critical", label: "Pending", count: requests.filter(r => r.request_status === "Pending").length, color: "red" },
                { key: "high", label: "Urgent", count: requests.filter(r => r.request_status === "Urgent").length, color: "red" }
              ].map(({ key, label, count, color }) => (
                <button
                  key={key}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                    filter === key
                      ? `bg-${color}-500 text-white shadow-lg transform scale-105`
                      : `bg-${color}-50 text-${color}-700 hover:bg-${color}-100 border border-${color}-200`
                  }`}
                  onClick={() => setFilter(key as "all" | "critical" | "high")}
                >
                  {label}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    filter === key ? `bg-${color}-400` : `bg-${color}-200`
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading compatible blood requests...</p>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
              <h3 className="text-xl font-bold text-red-800">Unable to Load Requests</h3>
            </div>
            <p className="text-red-700 text-center text-lg">{error}</p>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && !error && filteredRequests.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-16 h-16 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Requests Found</h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              {searchQuery 
                ? "No blood requests match your search criteria. Try adjusting your search or filters."
                : "No blood requests found for your blood type at the moment."}
            </p>
          </div>
        )}
        
        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
          {filteredRequests.map((request) => {
            const urgencyStyles = getUrgencyStyles(request.request_status);
            const UrgencyIcon = urgencyStyles.icon;
            
            return (
              <div
                key={request.request_id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
              >
                <div className={`${urgencyStyles.bgGradient} p-5 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <UrgencyIcon className="w-5 h-5 mr-2" />
                        <span className="font-bold">
                          {getUrgency(request.request_status)} Priority
                        </span>
                      </div>
                      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-1">
                        <span className="text-sm font-medium">
                          {request.request_status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-2">
                        {request.blood_group}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Request #{request.request_id}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {request.notes || "Emergency blood donation needed. Your contribution can save lives."}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center bg-gray-50 rounded-xl p-3">
                      <div className="bg-blue-100 rounded-lg p-2 mr-3">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Hospital</p>
                        <p className="font-semibold text-gray-800">
                          {request.hospital_name || `Hospital ID: ${request.hospital_id}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center bg-gray-50 rounded-xl p-3">
                      <div className="bg-red-100 rounded-lg p-2 mr-3">
                        <Droplet className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Units Required</p>
                        <p className="font-semibold text-gray-800">
                          {request.units_required} units
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center bg-gray-50 rounded-xl p-3">
                      <div className="bg-purple-100 rounded-lg p-2 mr-3">
                        <Calendar className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Request Date</p>
                        <p className="font-semibold text-gray-800">
                          {formatDate(request.request_date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group"
                    onClick={() => navigate(`eligibility/${request.request_id}`)}
                  >
                    <Heart className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Donate Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};