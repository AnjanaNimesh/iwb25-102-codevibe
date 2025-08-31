

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