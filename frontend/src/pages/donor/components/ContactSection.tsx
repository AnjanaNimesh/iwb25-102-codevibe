import React from "react";
import { PhoneIcon, MailIcon, MapPinIcon, ClockIcon } from "lucide-react";
export const ContactSection = () => {
  return (
    <section id="contact" className="py-16 w-full bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Contact <span className="text-[#B02629]">Us</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              Get in Touch
            </h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <PhoneIcon size={20} className="text-[#B02629]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Phone</h4>
                  <p className="text-gray-600">+1 (800) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <MailIcon size={20} className="text-[#B02629]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Email</h4>
                  <p className="text-gray-600">contact@lifedrop.org</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <MapPinIcon size={20} className="text-[#B02629]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Address</h4>
                  <p className="text-gray-600">
                    123 Blood Donor Avenue
                    <br />
                    Medical District, CA 90210
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <ClockIcon size={20} className="text-[#B02629]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Hours</h4>
                  <p className="text-gray-600">
                    Monday - Friday: 8:00 AM - 8:00 PM
                    <br />
                    Saturday: 9:00 AM - 5:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              Send us a Message
            </h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B02629]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B02629]"
                    placeholder="Your email"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B02629]"
                  placeholder="Subject"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B02629]"
                  placeholder="Your message"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-[#B02629] hover:bg-[#9a1f22] text-white font-bold py-3 px-6 rounded-md transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
