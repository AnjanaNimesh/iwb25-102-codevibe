import React from "react";
import { Heart } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Heart
            className="h-16 w-16 text-red-500 mx-auto mb-6"
            fill="currentColor"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Have questions or want to get involved? Reach out to the LifeDrop
            team. We’re here to help you make a difference.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-2">
              <strong>Email:</strong> support@lifedrop.org
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Phone:</strong> (123) 456-7890
            </p>
            <p className="text-gray-600">
              <strong>Address:</strong> 123 LifeDrop Way, Health City, HC 12345
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Support Hours
            </h2>
            <p className="text-gray-600 mb-2">Monday - Friday: 9 AM - 5 PM</p>
            <p className="text-gray-600 mb-2">Saturday: 10 AM - 2 PM</p>
            <p className="text-gray-600">Sunday: Closed</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Send Us a Message
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Your Email"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-gray-700 font-medium mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={5}
                placeholder="Your Message"
              ></textarea>
            </div>
            <div className="text-center">
              <button className="bg-red-500 text-white px-8 py-3 rounded-full hover:bg-red-600 text-lg font-medium">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
