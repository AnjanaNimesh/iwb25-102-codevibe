// import React, { useState } from "react";
// import { SearchIcon, FilterIcon, MapPinIcon, DropletIcon } from "lucide-react";
// export const BloodRequestsPage = () => {
//   const [filter, setFilter] = useState("all");
//   const bloodRequests = [
//     {
//       id: 1,
//       patientName: "John Doe",
//       bloodType: "A+",
//       location: "Central Hospital",
//       urgency: "High",
//       requiredUnits: 3,
//       requestDate: "2023-06-15",
//       description: "Emergency surgery for accident victim",
//     },
//     {
//       id: 2,
//       patientName: "Jane Smith",
//       bloodType: "O-",
//       location: "Memorial Hospital",
//       urgency: "Critical",
//       requiredUnits: 2,
//       requestDate: "2023-06-14",
//       description: "Cancer patient requiring blood transfusion",
//     },
//     {
//       id: 3,
//       patientName: "Robert Johnson",
//       bloodType: "B+",
//       location: "City Medical Center",
//       urgency: "Medium",
//       requiredUnits: 1,
//       requestDate: "2023-06-16",
//       description: "Scheduled surgery next week",
//     },
//     {
//       id: 4,
//       patientName: "Sarah Williams",
//       bloodType: "AB+",
//       location: "Community Hospital",
//       urgency: "High",
//       requiredUnits: 4,
//       requestDate: "2023-06-15",
//       description: "Multiple transfusions needed for treatment",
//     },
//     {
//       id: 5,
//       patientName: "Michael Brown",
//       bloodType: "O+",
//       location: "University Hospital",
//       urgency: "Medium",
//       requiredUnits: 2,
//       requestDate: "2023-06-17",
//       description: "Regular transfusion for chronic condition",
//     },
//   ];
//   const filteredRequests =
//     filter === "all"
//       ? bloodRequests
//       : bloodRequests.filter((request) =>
//           filter === "critical"
//             ? request.urgency === "Critical"
//             : request.urgency === "High"
//         );
//   return (
//     <div className="w-full bg-gray-50 py-12">
//       <div className="container mx-auto px-4">
//         <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
//           Blood <span className="text-[#B02629]">Requests</span>
//         </h1>
//         <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
//           These are current blood donation requests in your area. Your donation
//           can directly help these patients in need.
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
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredRequests.map((request) => (
//             <div
//               key={request.id}
//               className="bg-white rounded-lg shadow-md overflow-hidden"
//             >
//               <div
//                 className={`p-4 ${
//                   request.urgency === "Critical"
//                     ? "bg-red-600"
//                     : request.urgency === "High"
//                     ? "bg-orange-500"
//                     : "bg-yellow-500"
//                 } text-white`}
//               >
//                 <div className="flex justify-between items-center">
//                   <span className="font-bold">{request.urgency} Priority</span>
//                   <span className="text-xl font-bold">{request.bloodType}</span>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                   Patient: {request.patientName}
//                 </h3>
//                 <p className="text-gray-600 mb-4">{request.description}</p>
//                 <div className="flex items-center text-gray-500 mb-2">
//                   <MapPinIcon size={16} className="mr-2" />
//                   <span>{request.location}</span>
//                 </div>
//                 <div className="flex items-center text-gray-500 mb-4">
//                   <DropletIcon size={16} className="mr-2" />
//                   <span>{request.requiredUnits} units needed</span>
//                 </div>
//                 <button className="w-full bg-[#B02629] hover:bg-[#9a1f22] text-white py-2 rounded-full transition-colors">
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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SearchIcon, MapPinIcon, DropletIcon } from "lucide-react";

// Define the BloodRequest type to match the backend's BloodRequest record
interface BloodRequest {
  request_id?: number;
  hospital_id: number;
  blood_group: string;
  units_required: number;
  request_date?: string;
  request_status: string;
  notes?: string | null;
}

// Define the Donor type to fetch blood_group
interface Donor {
  donor_id: number;
  donor_name: string;
  email: string;
  phone_number: string;
  district_name: string;
  blood_group: string;
  last_donation_date?: string;
}

export const BloodRequestsPage: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "critical" | "high">("all");
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [userBloodGroup, setUserBloodGroup] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Hardcoded donor_id for demo (replace with auth context in real app)
  const donorId = 1;

  // Define blood group compatibility
  const bloodCompatibility: { [key: string]: string[] } = {
    "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    "O+": ["O+", "A+", "B+", "AB+"],
    "A-": ["A-", "A+", "AB-", "AB+"],
    "A+": ["A+", "AB+"],
    "B-": ["B-", "B+", "AB-", "AB+"],
    "B+": ["B+", "AB+"],
    "AB-": ["AB-", "AB+"],
    "AB+": ["AB+"],
  };

  // Fetch blood requests and user blood group
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user blood group
        const donorResponse = await axios.get<Donor>(
          `http://localhost:9095/donors/${donorId}`
        );
        setUserBloodGroup(donorResponse.data.blood_group);

        // Fetch blood requests
        const response = await axios.get<BloodRequest[]>(
          "http://localhost:9094/bloodrequests/requests"
        );
        setRequests(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter requests based on status and blood group compatibility
  const filteredRequests = requests
    .filter((request) =>
      filter === "all"
        ? true
        : request.request_status ===
          (filter === "critical" ? "Pending" : "Urgent")
    )
    .filter((request) =>
      userBloodGroup && bloodCompatibility[userBloodGroup]
        ? bloodCompatibility[userBloodGroup].includes(request.blood_group)
        : false
    );

  // Map request_status to urgency for display
  const getUrgency = (status: string): string => {
    switch (status) {
      case "Pending":
        return "Medium";
      case "Urgent":
        return "High";
      case "Fulfilled":
        return "Low";
      default:
        return "Medium";
    }
  };

  // Map request_status to background color for display
  const getUrgencyColor = (status: string): string => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";
      case "Urgent":
        return "bg-orange-500";
      case "Fulfilled":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
          Blood <span className="text-[#B02629]">Requests</span>
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          These are current blood donation requests you can donate to based on
          your blood type ({userBloodGroup || "Unknown"}).
        </p>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search requests..."
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent"
            />
            <SearchIcon
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-full ${
                filter === "all"
                  ? "bg-[#B02629] text-white"
                  : "bg-white text-gray-800 border border-gray-300"
              }`}
              onClick={() => setFilter("all")}
            >
              All Requests
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                filter === "critical"
                  ? "bg-[#B02629] text-white"
                  : "bg-white text-gray-800 border border-gray-300"
              }`}
              onClick={() => setFilter("critical")}
            >
              Critical
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                filter === "high"
                  ? "bg-[#B02629] text-white"
                  : "bg-white text-gray-800 border border-gray-300"
              }`}
              onClick={() => setFilter("high")}
            >
              High Priority
            </button>
          </div>
        </div>
        {loading && (
          <div className="text-center text-gray-600">Loading requests...</div>
        )}
        {error && <div className="text-center text-red-600">{error}</div>}
        {!loading && !error && filteredRequests.length === 0 && (
          <div className="text-center text-gray-600">
            No blood requests found for your blood type.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <div
              key={request.request_id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div
                className={`p-4 ${getUrgencyColor(
                  request.request_status
                )} text-white`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold">
                    {getUrgency(request.request_status)} Priority
                  </span>
                  <span className="text-xl font-bold">
                    {request.blood_group}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Request ID: {request.request_id}
                </h3>
                <p className="text-gray-600 mb-4">
                  {request.notes || "No additional details"}
                </p>
                <div className="flex items-center text-gray-500 mb-2">
                  <MapPinIcon size={16} className="mr-2" />
                  <span>Hospital ID: {request.hospital_id}</span>
                </div>
                <div className="flex items-center text-gray-500 mb-4">
                  <DropletIcon size={16} className="mr-2" />
                  <span>{request.units_required} units needed</span>
                </div>
                <div className="flex items-center text-gray-500 mb-4">
                  <span>Status: {request.request_status}</span>
                </div>
                <div className="flex items-center text-gray-500 mb-4">
                  <span>Requested on: {request.request_date}</span>
                </div>
                <button
                  className="w-full bg-[#B02629] hover:bg-[#9a1f22] text-white py-2 rounded-full transition-colors"
                  onClick={() => navigate(`eligibility/${request.request_id}`)}
                >
                  Donate Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
