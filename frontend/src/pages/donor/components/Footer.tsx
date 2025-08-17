import React from "react";
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
} from "lucide-react";
export const Footer = () => {
  return (
    <footer className="bg-[#F5F5F5] w-full">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-[#B02629] mb-4">LifeDrop</h3>
            <p className="text-gray-600 mb-4">
              Connecting donors with those in need, saving lives one donation at
              a time.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-[#B02629]"
                aria-label="Facebook"
              >
                <FacebookIcon size={20} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-[#B02629]"
                aria-label="Twitter"
              >
                <TwitterIcon size={20} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-[#B02629]"
                aria-label="Instagram"
              >
                <InstagramIcon size={20} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-[#B02629]"
                aria-label="YouTube"
              >
                <YoutubeIcon size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#B02629]">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#why-donate"
                  className="text-gray-600 hover:text-[#B02629]"
                >
                  Why Donate
                </a>
              </li>
              <li>
                <a
                  href="#get-involved"
                  className="text-gray-600 hover:text-[#B02629]"
                >
                  Get Involved
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-600 hover:text-[#B02629]"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#B02629]">
                  Find Donation Centers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#B02629]">
                  Donation Process
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#B02629]">
                  Eligibility Requirements
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#B02629]">
                  Blood Types
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#B02629]">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#B02629]">
                  News & Events
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Newsletter</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter for updates on blood drives and
              donation opportunities.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#B02629] flex-grow"
              />
              <button
                type="submit"
                className="bg-[#B02629] text-white px-4 py-2 rounded-r-md hover:bg-[#9a1f22]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} LifeDrop Blood Donation. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
