import React from "react";
import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              {/* <img
                src="/logo.png" // Thêm logo của bạn
                alt="FitNutritionHub Logo"
                className="h-8 w-auto"
              /> */}
              <span className="ml-3 text-xl font-bold text-white">
                FitNutritionHub
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for fitness and nutrition guidance. Join our community and start your journey to a healthier lifestyle today.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="hover:text-white transition-colors inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors inline-block">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/experts" className="hover:text-white transition-colors inline-block">
                  Meet Our Experts
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors inline-block">
                  Blog & News
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors inline-block">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="hover:text-white transition-colors inline-block">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors inline-block">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors inline-block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-white transition-colors inline-block">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <FiMapPin className="mr-3 text-gray-400" />
                <span>123 Fitness Street, Health City, HC 12345</span>
              </li>
              <li className="flex items-center">
                <FiPhone className="mr-3 text-gray-400" />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center">
                <FiMail className="mr-3 text-gray-400" />
                <a href="mailto:info@fitnutritionhub.com" className="hover:text-white transition-colors">
                  info@fitnutritionhub.com
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-white font-medium mb-2">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} FitNutritionHub. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
