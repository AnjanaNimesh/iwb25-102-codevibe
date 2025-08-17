// import { useState, useRef } from "react";
// import { ChevronLeftIcon, ChevronRightIcon, Calendar } from "lucide-react";
// import { CampaignModal, Campaign } from "./CampaignModal";
// export const CampaignsSection = () => {
//   const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
//     null
//   );
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const sliderRef = useRef<HTMLDivElement>(null);
//   const campaigns: Campaign[] = [
//     {
//       id: 1,
//       title: "World Blood Donor Day",
//       image:
//         "https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
//       shortDescription:
//         "Join us for a special blood drive on World Blood Donor Day.",
//       date: "June 14, 2023",
//       time: "9:00 AM - 5:00 PM",
//       location: "Central Hospital, 123 Main St",
//       fullDescription:
//         "World Blood Donor Day is celebrated every year on June 14th. This year, we're organizing a major blood donation drive to help replenish our blood banks and raise awareness about the importance of regular blood donation. Your single donation can save up to three lives! We'll have refreshments, t-shirts for donors, and educational resources available.",
//       requiredBloodTypes: ["A+", "A-", "O+", "O-", "B+", "B-", "AB+", "AB-"],
//     },
//     {
//       id: 2,
//       title: "Campus Heroes Campaign",
//       image:
//         "https://images.unsplash.com/photo-1579154392429-0e6b4e200b8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
//       shortDescription:
//         "University students unite to donate blood and save lives.",
//       date: "September 5, 2023",
//       time: "10:00 AM - 4:00 PM",
//       location: "University Student Center",
//       fullDescription:
//         "Our Campus Heroes Campaign targets university students to become regular blood donors. This campaign aims to educate young adults about the importance of blood donation and create a new generation of lifelong donors. The event will feature music, games, and prizes for participants. Faculty members are also encouraged to participate.",
//       requiredBloodTypes: ["A+", "O+", "O-", "B+"],
//     },
//     {
//       id: 3,
//       title: "Corporate Lifesavers",
//       image:
//         "https://images.unsplash.com/photo-1612277795421-9bc7706a4a41?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
//       shortDescription:
//         "Businesses come together in this corporate blood donation drive.",
//       date: "October 10, 2023",
//       time: "8:00 AM - 3:00 PM",
//       location: "Downtown Business Center",
//       fullDescription:
//         "Corporate Lifesavers brings together businesses from across the city for a friendly competition to see which company can donate the most blood. This initiative not only helps save lives but also promotes corporate social responsibility. Companies will receive recognition for their participation and the winning company will receive a special award.",
//       requiredBloodTypes: ["A-", "O+", "O-", "AB+"],
//     },
//     {
//       id: 4,
//       title: "Holiday Heroes",
//       image:
//         "https://images.unsplash.com/photo-1608434536950-d7d084398bf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
//       shortDescription: "Give the gift of life this holiday season.",
//       date: "December 15, 2023",
//       time: "11:00 AM - 7:00 PM",
//       location: "Community Center, 456 Pine Ave",
//       fullDescription:
//         "During the holiday season, blood donations typically decrease while the need often increases due to holiday travel and accidents. Our Holiday Heroes campaign encourages people to give the gift of life during this special time of year. Hot chocolate, holiday cookies, and festive music will make this a joyful donation experience.",
//       requiredBloodTypes: ["O+", "O-", "B-", "AB-"],
//     },
//     {
//       id: 5,
//       title: "Emergency Response Drive",
//       image:
//         "https://images.unsplash.com/photo-1612277795163-49a1a64ae8a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
//       shortDescription:
//         "Critical need for blood donors following recent emergencies.",
//       date: "July 22, 2023",
//       time: "7:00 AM - 9:00 PM",
//       location: "Multiple Locations Citywide",
//       fullDescription:
//         "Due to recent emergency situations and natural disasters, our blood supplies are critically low. This emergency response drive will be held at multiple locations throughout the city to make donating as convenient as possible. Walk-ins are welcome, but appointments are encouraged to minimize wait times. All blood types are urgently needed.",
//       requiredBloodTypes: ["All Types"],
//     },
//   ];
//   const openModal = (campaign: Campaign) => {
//     setSelectedCampaign(campaign);
//     setIsModalOpen(true);
//   };
//   const closeModal = () => {
//     setIsModalOpen(false);
//   };
//   const scroll = (direction: "left" | "right") => {
//     if (sliderRef.current) {
//       const { current } = sliderRef;
//       const scrollAmount =
//         direction === "left" ? -current.offsetWidth : current.offsetWidth;
//       current.scrollBy({
//         left: scrollAmount,
//         behavior: "smooth",
//       });
//     }
//   };
//   return (
//     <section className="py-16 w-full bg-white">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
//           Upcoming <span className="text-[#B02629]">Campaigns</span>
//         </h2>
//         <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
//           Join our blood donation campaigns and events happening in your
//           community. Click on a campaign to learn more and register.
//         </p>
//         <div className="relative">
//           <button
//             onClick={() => scroll("left")}
//             className="absolute top-1/2 -left-4 z-10 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 p-2 rounded-full transition-colors hidden md:block"
//             aria-label="Previous campaigns"
//           >
//             <ChevronLeftIcon size={24} className="text-gray-800" />
//           </button>
//           <div
//             ref={sliderRef}
//             className="flex overflow-x-auto space-x-6 pb-6 hide-scrollbar snap-x"
//             style={{
//               scrollbarWidth: "none",
//               msOverflowStyle: "none",
//             }}
//           >
//             {campaigns.map((campaign) => (
//               <div
//                 key={campaign.id}
//                 className="min-w-[300px] max-w-[300px] bg-white rounded-lg overflow-hidden shadow-md flex-shrink-0 snap-start cursor-pointer hover:shadow-lg transition-shadow"
//                 onClick={() => openModal(campaign)}
//               >
//                 <img
//                   src={campaign.image}
//                   alt={campaign.title}
//                   className="w-full h-40 object-cover"
//                 />
//                 <div className="p-4">
//                   <h3 className="text-xl font-bold text-gray-800 mb-2">
//                     {campaign.title}
//                   </h3>
//                   <p className="text-gray-600 mb-4 line-clamp-2">
//                     {campaign.shortDescription}
//                   </p>
//                   <div className="flex items-center text-sm text-gray-500">
//                     <Calendar size={14} className="text-[#B02629]" />
//                     <span>{campaign.date}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <button
//             onClick={() => scroll("right")}
//             className="absolute top-1/2 -right-4 z-10 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 p-2 rounded-full transition-colors hidden md:block"
//             aria-label="Next campaigns"
//           >
//             <ChevronRightIcon size={24} className="text-gray-800" />
//           </button>
//         </div>
//       </div>
//       <CampaignModal
//         campaign={selectedCampaign}
//         isOpen={isModalOpen}
//         onClose={closeModal}
//       />
//     </section>
//   );
// };
