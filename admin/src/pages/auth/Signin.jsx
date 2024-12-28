import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import admin from "../../assets/admin.png";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/login/admin`,
        {
          email: email,
          password: password,
        },
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      localStorage.setItem("user", JSON.stringify(response.data.userData));
      localStorage.setItem("accessToken", response.data.accessToken);
      window.location.href = "/";
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials.");
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="w-1/2 flex flex-col justify-center px-20 bg-white">
        <div className="max-w-[500px] mx-auto w-full">
          <h1 className="font-bold text-4xl text-[#2D3748] mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600 mb-8">
            Please sign in to your admin account
          </p>

          <form onSubmit={handleSignin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6374AE] focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6374AE] focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#6374AE] border-gray-300 rounded focus:ring-[#6374AE]"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-[#6374AE] hover:text-[#4A5578] font-medium"
              >
                Forgot password?
              </button>
            </div>

            {errorMessage && (
              <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#6374AE] text-white py-3 rounded-lg font-medium hover:bg-[#4A5578] transition-colors flex items-center justify-center space-x-2"
            >
              <span>Sign In</span>
              <FiArrowRight className="h-5 w-5" />
            </button>

            <p className="text-center text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#6374AE] hover:text-[#4A5578] font-medium"
              >
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="w-1/2 bg-[#F8FAFC] flex items-center justify-center">
        <div className="max-w-[600px] text-center px-8">
          <img
            src={admin} // Thêm ảnh minh họa vào đây
            alt="Admin Illustration"
            className="w-full max-w-md mx-auto mb-8"
          />
          <h2 className="text-2xl font-bold text-[#2D3748] mb-4">
            Manage Your Platform with Confidence
          </h2>
          <p className="text-gray-600">
            Access your admin dashboard to manage users, content, and maintain
            the platform's integrity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
