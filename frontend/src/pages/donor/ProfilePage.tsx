// import React, { useState, useEffect } from "react";
// import { AwardIcon, PencilIcon, CheckIcon, XIcon } from "lucide-react";
// import axios from "axios";

// // Define types for donor and donation history
// interface Donor {
//   donor_id: number;
//   donor_name: string;
//   email: string;
//   phone_number: string;
//   district_name: string;
//   blood_group: string;
//   last_donation_date?: string;
// }

// interface DonationHistory {
//   donation_id: number;
//   donor_id: number;
//   donation_date: string;
//   location: string;
//   donation_type: string;
// }

// export const ProfilePage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<"personal" | "donations">(
//     "personal"
//   );
//   const [isEditing, setIsEditing] = useState(false);
//   const [userData, setUserData] = useState<Partial<Donor>>({
//     donor_name: "",
//     email: "",
//     phone_number: "",
//     district_name: "",
//     blood_group: "",
//   });
//   const [donations, setDonations] = useState<DonationHistory[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Hardcoded donor_id for demo (replace with auth context in real app)
//   const donorId = 1;

//   // Fetch donor details and donation history
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         // Fetch donor details
//         const donorResponse = await axios.get<Donor>(
//           `http://localhost:9095/donors/${donorId}`
//         );
//         setUserData(donorResponse.data);

//         // Fetch donation history
//         const historyResponse = await axios.get<DonationHistory[]>(
//           `http://localhost:9095/donors/${donorId}/history`
//         );
//         setDonations(historyResponse.data);
//       } catch (err) {
//         setError("Failed to load profile data. Please try again.");
//         console.error("Error fetching data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setUserData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSaveChanges = async () => {
//     try {
//       // Update donor details in the backend
//       await axios.put(`http://localhost:9095/donors/${donorId}`, {
//         donor_name: userData.donor_name,
//         email: userData.email,
//         phone_number: userData.phone_number,
//         district_name: userData.district_name,
//         blood_group: userData.blood_group,
//       });
//       setIsEditing(false);
//     } catch (err) {
//       setError("Failed to save changes. Please try again.");
//       console.error("Error saving changes:", err);
//     }
//   };

//   const getBadgeColor = (badge: string) => {
//     switch (badge) {
//       case "First Time":
//         return "bg-blue-100 text-blue-800";
//       case "Life Saver":
//         return "bg-purple-100 text-purple-800";
//       case "Regular Donor":
//         return "bg-green-100 text-green-800";
//       case "Critical Need":
//         return "bg-red-100 text-red-800";
//       case "Rare Type":
//         return "bg-yellow-100 text-yellow-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   // Compute badges client-side
//   const getBadges = (donation: DonationHistory, index: number) => {
//     const badges: string[] = [];
//     if (index === donations.length - 1) badges.push("First Time");
//     if (donation.donation_type === "Whole Blood") badges.push("Life Saver");
//     if (donations.length >= 2) badges.push("Regular Donor");
//     if (donation.donation_type === "Platelets") badges.push("Critical Need");
//     if (userData.blood_group === "O-" || userData.blood_group === "AB-")
//       badges.push("Rare Type");
//     return badges;
//   };

//   if (loading) {
//     return (
//       <div className="w-full bg-gray-50 py-12 text-center">
//         <p className="text-gray-600">Loading profile...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-full bg-gray-50 py-12 text-center">
//         <p className="text-red-600">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full bg-gray-50 py-12">
//       <div className="container mx-auto px-4">
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="bg-[#B02629] text-white p-6">
//             <div className="flex flex-col md:flex-row items-center">
//               <div className="bg-white rounded-full p-6 mb-4 md:mb-0 md:mr-6">
//                 <svg
//                   className="w-12 h-12 text-[#B02629]"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                   />
//                 </svg>
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold">{userData.donor_name}</h1>
//                 <p className="opacity-80">
//                   Blood Type: {userData.blood_group} • Total Donations:{" "}
//                   {donations.length}
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="border-b">
//             <div className="container mx-auto flex overflow-x-auto">
//               <button
//                 className={`px-6 py-4 font-medium text-sm focus:outline-none ${
//                   activeTab === "personal"
//                     ? "border-b-2 border-[#B02629] text-[#B02629]"
//                     : "text-gray-500"
//                 }`}
//                 onClick={() => setActiveTab("personal")}
//               >
//                 Personal Information
//               </button>
//               <button
//                 className={`px-6 py-4 font-medium text-sm focus:outline-none ${
//                   activeTab === "donations"
//                     ? "border-b-2 border-[#B02629] text-[#B02629]"
//                     : "text-gray-500"
//                 }`}
//                 onClick={() => setActiveTab("donations")}
//               >
//                 Donation History
//               </button>
//             </div>
//           </div>
//           <div className="p-6">
//             {activeTab === "personal" && (
//               <div>
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="text-2xl font-semibold text-gray-800">
//                     Personal Information
//                   </h2>
//                   {!isEditing ? (
//                     <button
//                       className="flex items-center text-[#B02629] hover:text-[#9a1f22]"
//                       onClick={() => setIsEditing(true)}
//                     >
//                       <PencilIcon size={16} className="mr-1" />
//                       Edit
//                     </button>
//                   ) : (
//                     <div className="flex space-x-2">
//                       <button
//                         className="flex items-center text-green-600 hover:text-green-800"
//                         onClick={handleSaveChanges}
//                       >
//                         <CheckIcon size={16} className="mr-1" />
//                         Save
//                       </button>
//                       <button
//                         className="flex items-center text-red-600 hover:text-red-800"
//                         onClick={() => setIsEditing(false)}
//                       >
//                         <XIcon size={16} className="mr-1" />
//                         Cancel
//                       </button>
//                     </div>
//                   )}
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {[
//                     { key: "donor_name", label: "Name" },
//                     { key: "email", label: "Email" },
//                     { key: "phone_number", label: "Phone Number" },
//                     { key: "district_name", label: "District" },
//                     { key: "blood_group", label: "Blood Type" },
//                     { key: "last_donation_date", label: "Last Donation Date" },
//                   ].map(({ key, label }) => (
//                     <div key={key} className="mb-4">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         {label}
//                       </label>
//                       {isEditing && key !== "last_donation_date" ? (
//                         <input
//                           type="text"
//                           name={key}
//                           value={userData[key] || ""}
//                           onChange={handleInputChange}
//                           className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent"
//                         />
//                       ) : (
//                         <p className="text-gray-900">
//                           {userData[key] || "N/A"}
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {activeTab === "donations" && (
//               <div>
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//                   Donation History
//                 </h2>
//                 <div className="space-y-6">
//                   {donations.map((donation, index) => (
//                     <div
//                       key={donation.donation_id}
//                       className="bg-gray-50 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between"
//                     >
//                       <div>
//                         <h3 className="text-lg font-medium text-gray-900 mb-1">
//                           {donation.donation_date}
//                         </h3>
//                         <p className="text-gray-500">
//                           {donation.location} • {donation.donation_type}
//                         </p>
//                       </div>
//                       <div className="flex flex-wrap mt-3 md:mt-0">
//                         {getBadges(donation, index).map((badge, badgeIndex) => (
//                           <span
//                             key={badgeIndex}
//                             className={`${getBadgeColor(
//                               badge
//                             )} text-xs font-medium px-3 py-1 rounded-full mr-2 mb-2 md:mb-0`}
//                           >
//                             {badge}
//                           </span>
//                         ))}
//                         <span className="bg-[#B02629] bg-opacity-10 text-[#B02629] text-xs font-medium px-3 py-1 rounded-full flex items-center">
//                           <AwardIcon size={14} className="mr-1" />
//                           +5 Points
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="mt-8 bg-gradient-to-r from-[#B02629] to-[#9a1f22] rounded-lg p-6 text-white">
//                   <div className="flex flex-col md:flex-row justify-between items-center">
//                     <div>
//                       <h3 className="text-xl font-bold mb-2">
//                         Your Donation Rewards
//                       </h3>
//                       <p className="opacity-90">
//                         You've earned {donations.length * 5} donation points so
//                         far!
//                       </p>
//                     </div>
//                     <button className="mt-4 md:mt-0 bg-white text-[#B02629] px-6 py-2 rounded-full hover:bg-gray-100 transition-colors">
//                       Redeem Rewards
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import { AwardIcon, PencilIcon, CheckIcon, XIcon } from "lucide-react";
import axios from "axios";

// Define types for donor and donation history
interface Donor {
  donor_id: number;
  donor_name: string;
  email: string;
  phone_number: string;
  district_name: string;
  blood_group: string;
  last_donation_date?: string;
}

interface DonationHistory {
  donation_id: number;
  donor_id: number;
  donation_date: string;
  location: string;
  donation_type: string;
}

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"personal" | "donations">(
    "personal"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<Partial<Donor>>({
    donor_name: "",
    email: "",
    phone_number: "",
    district_name: "",
    blood_group: "",
  });
  const [donations, setDonations] = useState<DonationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hardcoded donor_id for demo (replace with auth context in real app)
  const donorId = 1;

  // Fetch donor details and donation history
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch donor details
        const donorResponse = await axios.get<Donor>(
          `http://localhost:9095/donors/${donorId}`
        );
        setUserData(donorResponse.data);

        // Fetch donation history
        const historyResponse = await axios.get<DonationHistory[]>(
          `http://localhost:9095/donors/${donorId}/history`
        );
        setDonations(historyResponse.data);
      } catch (err) {
        setError("Failed to load profile data. Please try again.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Ensure name is a valid key of EditableDonorFields
    if (
      [
        "donor_name",
        "email",
        "phone_number",
        "district_name",
        "blood_group",
      ].includes(name)
    ) {
      setUserData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Update donor details in the backend
      await axios.put(`http://localhost:9095/donors/${donorId}`, {
        donor_name: userData.donor_name,
        email: userData.email,
        phone_number: userData.phone_number,
        district_name: userData.district_name,
        blood_group: userData.blood_group,
      });
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      console.error("Error saving changes:", err);
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "First Time":
        return "bg-blue-100 text-blue-800";
      case "Life Saver":
        return "bg-purple-100 text-purple-800";
      case "Regular Donor":
        return "bg-green-100 text-green-800";
      case "Critical Need":
        return "bg-red-100 text-red-800";
      case "Rare Type":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Compute badges client-side
  const getBadges = (donation: DonationHistory, index: number) => {
    const badges: string[] = [];
    if (index === donations.length - 1) badges.push("First Time");
    if (donation.donation_type === "Whole Blood") badges.push("Life Saver");
    if (donations.length >= 2) badges.push("Regular Donor");
    if (donation.donation_type === "Platelets") badges.push("Critical Need");
    if (userData.blood_group === "O-" || userData.blood_group === "AB-")
      badges.push("Rare Type");
    return badges;
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-50 py-12 text-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gray-50 py-12 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#B02629] text-white p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="bg-white rounded-full p-6 mb-4 md:mb-0 md:mr-6">
                <svg
                  className="w-12 h-12 text-[#B02629]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{userData.donor_name}</h1>
                <p className="opacity-80">
                  Blood Type: {userData.blood_group} • Total Donations:{" "}
                  {donations.length}
                </p>
              </div>
            </div>
          </div>
          <div className="border-b">
            <div className="container mx-auto flex overflow-x-auto">
              <button
                className={`px-6 py-4 font-medium text-sm focus:outline-none ${
                  activeTab === "personal"
                    ? "border-b-2 border-[#B02629] text-[#B02629]"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("personal")}
              >
                Personal Information
              </button>
              <button
                className={`px-6 py-4 font-medium text-sm focus:outline-none ${
                  activeTab === "donations"
                    ? "border-b-2 border-[#B02629] text-[#B02629]"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("donations")}
              >
                Donation History
              </button>
            </div>
          </div>
          <div className="p-6">
            {activeTab === "personal" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Personal Information
                  </h2>
                  {!isEditing ? (
                    <button
                      className="flex items-center text-[#B02629] hover:text-[#9a1f22]"
                      onClick={() => setIsEditing(true)}
                    >
                      <PencilIcon size={16} className="mr-1" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        className="flex items-center text-green-600 hover:text-green-800"
                        onClick={handleSaveChanges}
                      >
                        <CheckIcon size={16} className="mr-1" />
                        Save
                      </button>
                      <button
                        className="flex items-center text-red-600 hover:text-red-800"
                        onClick={() => setIsEditing(false)}
                      >
                        <XIcon size={16} className="mr-1" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(
                    [
                      { key: "donor_name", label: "Name" },
                      { key: "email", label: "Email" },
                      { key: "phone_number", label: "Phone Number" },
                      { key: "district_name", label: "District" },
                      { key: "blood_group", label: "Blood Type" },
                      {
                        key: "last_donation_date",
                        label: "Last Donation Date",
                      },
                    ] as const
                  ).map(({ key, label }) => (
                    <div key={key} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                      </label>
                      {isEditing && key !== "last_donation_date" ? (
                        <input
                          type="text"
                          name={key}
                          value={userData[key] || ""}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#B02629] focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {userData[key] || "N/A"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "donations" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Donation History
                </h2>
                <div className="space-y-6">
                  {donations.map((donation, index) => (
                    <div
                      key={donation.donation_id}
                      className="bg-gray-50 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between"
                    >
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {donation.donation_date}
                        </h3>
                        <p className="text-gray-500">
                          {donation.location} • {donation.donation_type}
                        </p>
                      </div>
                      <div className="flex flex-wrap mt-3 md:mt-0">
                        {getBadges(donation, index).map((badge, badgeIndex) => (
                          <span
                            key={badgeIndex}
                            className={`${getBadgeColor(
                              badge
                            )} text-xs font-medium px-3 py-1 rounded-full mr-2 mb-2 md:mb-0`}
                          >
                            {badge}
                          </span>
                        ))}
                        <span className="bg-[#B02629] bg-opacity-10 text-[#B02629] text-xs font-medium px-3 py-1 rounded-full flex items-center">
                          <AwardIcon size={14} className="mr-1" />
                          +5 Points
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 bg-gradient-to-r from-[#B02629] to-[#9a1f22] rounded-lg p-6 text-white">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        Your Donation Rewards
                      </h3>
                      <p className="opacity-90">
                        You've earned {donations.length * 5} donation points so
                        far!
                      </p>
                    </div>
                    <button className="mt-4 md:mt-0 bg-white text-[#B02629] px-6 py-2 rounded-full hover:bg-gray-100 transition-colors">
                      Redeem Rewards
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
