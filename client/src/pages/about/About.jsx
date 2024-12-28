import React from "react";
import { motion } from "framer-motion";
import avatar from "../../../src/assets/avatar.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-[#F2F7FB] py-16">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-[#6374AE] mb-4">
            About FitNutritionHub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vietnam's Leading Health and Nutrition Community Platform
          </p>
        </motion.div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-[#6374AE] mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We are committed to building a community where people can share,
              learn, and develop knowledge about health and nutrition.
              FitNutritionHub is a place that connects people who share a
              passion for healthy and scientific lifestyle.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-[#6374AE] mb-4">
              Our Vision
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To become the leading platform in providing health and nutrition
              information and knowledge in Vietnam. We aim to create a healthy
              and reliable interactive environment for the community.
            </p>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-[#6374AE]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#6374AE]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#6374AE] mb-2">Community</h3>
            <p className="text-gray-600">
              Connect with people who share your goals and passions
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-[#6374AE]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#6374AE]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#6374AE] mb-2">Knowledge</h3>
            <p className="text-gray-600">
              Share and learn from experts and community
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-[#6374AE]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#6374AE]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#6374AE] mb-2">Events</h3>
            <p className="text-gray-600">
              Join beneficial events and activities
            </p>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-[#6374AE] mb-8">
            Development Team
          </h2>
          <div className="grid md:grid-cols-5 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <img
                src={avatar}
                alt="Team Member"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold text-[#6374AE]">John Smith</h3>
              <p className="text-gray-600">Project Manager</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <img
                src={avatar}
                alt="Team Member"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold text-[#6374AE]">
                Sarah Johnson
              </h3>
              <p className="text-gray-600">Lead Developer</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <img
                src={avatar}
                alt="Team Member"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold text-[#6374AE]">Michael Chen</h3>
              <p className="text-gray-600">UI/UX Designer</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <img
                src={avatar}
                alt="Team Member"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold text-[#6374AE]">Emily Davis</h3>
              <p className="text-gray-600">Content Manager</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <img
                src={avatar}
                alt="Team Member"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold text-[#6374AE]">Alex Turner</h3>
              <p className="text-gray-600">Backend Developer</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
