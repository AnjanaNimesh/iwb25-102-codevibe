import React, { useEffect, useState } from "react";
import { Building2Icon, UsersIcon, HeartPulseIcon } from "lucide-react";
export const StatsSection = () => {
  const [animatedStats, setAnimatedStats] = useState({
    hospitals: 0,
    donors: 0,
    donations: 0,
  });
  const targetStats = {
    hospitals: 250,
    donors: 15000,
    donations: 42500,
  };
  useEffect(() => {
    const duration = 2000; // 2 seconds animation
    const interval = 20; // update every 20ms
    const steps = duration / interval;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      setAnimatedStats({
        hospitals: Math.floor(targetStats.hospitals * progress),
        donors: Math.floor(targetStats.donors * progress),
        donations: Math.floor(targetStats.donations * progress),
      });
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);
    return () => clearInterval(timer);
  }, []);
  return (
    <section className="py-16 bg-[#F5F5F5] w-full">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Our <span className="text-[#B02629]">Impact</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="inline-flex justify-center items-center w-16 h-16 mb-6 bg-[#B02629]/10 rounded-full">
              <Building2Icon size={32} className="text-[#B02629]" />
            </div>
            <h3 className="text-4xl font-bold mb-2 text-[#B02629]">
              {animatedStats.hospitals.toLocaleString()}
            </h3>
            <p className="text-gray-600 font-medium text-lg">
              Partner Hospitals
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="inline-flex justify-center items-center w-16 h-16 mb-6 bg-[#B02629]/10 rounded-full">
              <UsersIcon size={32} className="text-[#B02629]" />
            </div>
            <h3 className="text-4xl font-bold mb-2 text-[#B02629]">
              {animatedStats.donors.toLocaleString()}
            </h3>
            <p className="text-gray-600 font-medium text-lg">
              Registered Donors
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="inline-flex justify-center items-center w-16 h-16 mb-6 bg-[#B02629]/10 rounded-full">
              <HeartPulseIcon size={32} className="text-[#B02629]" />
            </div>
            <h3 className="text-4xl font-bold mb-2 text-[#B02629]">
              {animatedStats.donations.toLocaleString()}
            </h3>
            <p className="text-gray-600 font-medium text-lg">
              Successful Donations
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
