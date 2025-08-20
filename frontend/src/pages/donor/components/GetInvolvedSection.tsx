import React from "react";
import { SearchIcon, CalendarIcon, DropletIcon, SmileIcon } from "lucide-react";
export const GetInvolvedSection = () => {
  const steps = [
    {
      number: 1,
      icon: <SearchIcon size={32} className="text-[#B02629]" />,
      title: "Find a Donation Center",
      description:
        "Use our locator to find the nearest blood donation center or mobile drive in your area.",
    },
    {
      number: 2,
      icon: <CalendarIcon size={32} className="text-[#B02629]" />,
      title: "Schedule Your Appointment",
      description:
        "Book your donation appointment online or call our helpline to secure your preferred time slot.",
    },
    {
      number: 3,
      icon: <DropletIcon size={32} className="text-[#B02629]" />,
      title: "Donate Blood",
      description:
        "Complete a quick health screening and donate blood. The donation process takes only about 10 minutes.",
    },
    {
      number: 4,
      icon: <SmileIcon size={32} className="text-[#B02629]" />,
      title: "Save Lives & Feel Great",
      description:
        "Enjoy refreshments after donation and feel the satisfaction of knowing you've helped save lives.",
    },
  ];
  return (
    <section id="get-involved" className="py-16 w-full bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
          Get <span className="text-[#B02629]">Involved</span>
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Becoming a blood donor is easy and straightforward. Follow these four
          simple steps to make a difference.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative bg-white p-6 pt-12 rounded-lg shadow-sm"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-[#B02629] text-white flex items-center justify-center font-bold text-xl">
                {step.number}
              </div>
              <div className="text-center mb-4">
                <div className="inline-flex justify-center items-center w-16 h-16 mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <button className="bg-[#B02629] hover:bg-[#9a1f22] text-white font-bold py-3 px-8 rounded-full transition-colors">
            Find Donation Centers
          </button>
        </div>
      </div>
    </section>
  );
};
