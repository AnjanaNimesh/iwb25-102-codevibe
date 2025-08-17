import React from "react";
import {
  HeartIcon,
  ClockIcon,
  AwardIcon,
  HeartHandshakeIcon,
} from "lucide-react";
export const WhyDonateSection = () => {
  const reasons = [
    {
      icon: <HeartIcon size={32} className="text-[#B02629]" />,
      title: "Save Lives",
      description:
        "One donation can save up to three lives. Your blood helps patients undergoing surgeries, trauma victims, and those battling cancer.",
    },
    {
      icon: <ClockIcon size={32} className="text-[#B02629]" />,
      title: "Takes Only an Hour",
      description:
        "The actual blood donation only takes about 8-10 minutes. The entire process, from registration to refreshments, takes about an hour.",
    },
    {
      icon: <AwardIcon size={32} className="text-[#B02629]" />,
      title: "Health Benefits",
      description:
        "Regular blood donation reduces the risk of heart attacks and cancer. It also helps in reducing excess iron stores in the body.",
    },
    {
      icon: <HeartHandshakeIcon size={32} className="text-[#B02629]" />,
      title: "Community Impact",
      description:
        "By donating blood, you become part of a vital community support system that ensures blood is available whenever and wherever it is needed.",
    },
  ];
  return (
    <section id="why-donate" className="py-16 w-full bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
          Why <span className="text-[#B02629]">Donate Blood?</span>
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Blood donation is a simple yet powerful act that can make a
          significant difference in someone's life.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-[#F5F5F5] p-6 rounded-lg">
              <div className="inline-flex justify-center items-center w-16 h-16 mb-4 bg-white rounded-full shadow-sm">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {reason.title}
              </h3>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center"></div>
      </div>
    </section>
  );
};
