import { X as CloseIcon, Calendar, Clock, MapPin } from "lucide-react";
export type Campaign = {
  id: number;
  title: string;
  image: string;
  shortDescription: string;
  date: string;
  time: string;
  location: string;
  fullDescription: string;
  requiredBloodTypes: string[];
};
type CampaignModalProps = {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
};
export const CampaignModal = ({
  campaign,
  isOpen,
  onClose,
}: CampaignModalProps) => {
  if (!isOpen || !campaign) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <CloseIcon size={24} className="text-gray-800" />
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {campaign.title}
          </h2>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <Calendar size={18} className="mr-2 text-[#B02629]" />
              <span>{campaign.date}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock size={18} className="mr-2 text-[#B02629]" />
              <span>{campaign.time}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin size={18} className="mr-2 text-[#B02629]" />
              <span>{campaign.location}</span>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">About This Campaign</h3>
            <p className="text-gray-600">{campaign.fullDescription}</p>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Blood Types Needed</h3>
            <div className="flex flex-wrap gap-2">
              {campaign.requiredBloodTypes.map((type) => (
                <span
                  key={type}
                  className="bg-[#B02629]/10 text-[#B02629] px-3 py-1 rounded-full font-medium"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button className="bg-[#B02629] hover:bg-[#9a1f22] text-white font-bold py-3 px-8 rounded-full transition-colors">
              Register for This Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
