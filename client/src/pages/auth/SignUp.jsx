import React, { useState, useContext } from "react";
import coverImage from "../../assets/cover.png";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/register`,
        {
          email,
          password,
          firstname,
          lastname,
          phone,
        }
      );
      toast.success("Now go to your email to verify your account!", {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        navigate("/signin");
      }, 10000);
      console.log(response.data);
    } catch (error) {
      setErrorMessage("Sign Up failed. Please check your credentials.");
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen">
      <ToastContainer />
      {/* Left Side - Cover Image */}
      <div className="relative w-1/2">
        <img src={coverImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#6374AE]/90 to-transparent">
          <div className="absolute bottom-0 p-16 text-white">
            <h1 className="font-lobster text-5xl mb-6">FitNutritionHub</h1>
            <p className="font-wixmadefor text-xl leading-relaxed opacity-90">
              Your go-to destination for delicious recipes, effective exercises,
              and health tips! Discover a variety of nutritious meals that fuel
              your body, explore workout routines to enhance your fitness
              journey, and access valuable health advice to support your
              well-being.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-1/2 bg-[#FAF8F6] px-20 py-12 overflow-y-auto">
        <div className="max-w-[500px]">
          <h1 className="font-lobster text-[#6374AE] text-5xl mb-10">
            Sign up
          </h1>

          <form onSubmit={handleSignup} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-wixmadefor text-[#6374AE] font-semibold text-lg mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  className="w-full h-[60px] px-5 bg-white border-2 border-[#9CB6DD] rounded-xl
                    text-[#6374AE] text-lg focus:outline-none focus:border-[#6374AE] transition-colors"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block font-wixmadefor text-[#6374AE] font-semibold text-lg mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  className="w-full h-[60px] px-5 bg-white border-2 border-[#9CB6DD] rounded-xl
                    text-[#6374AE] text-lg focus:outline-none focus:border-[#6374AE] transition-colors"
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block font-wixmadefor text-[#6374AE] font-semibold text-lg mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-[60px] px-5 bg-white border-2 border-[#9CB6DD] rounded-xl
                  text-[#6374AE] text-lg focus:outline-none focus:border-[#6374AE] transition-colors"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-wixmadefor text-[#6374AE] font-semibold text-lg mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-[60px] px-5 bg-white border-2 border-[#9CB6DD] rounded-xl
                  text-[#6374AE] text-lg focus:outline-none focus:border-[#6374AE] transition-colors"
                placeholder="Create a password"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block font-wixmadefor text-[#6374AE] font-semibold text-lg mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full h-[60px] px-5 bg-white border-2 border-[#9CB6DD] rounded-xl
                  text-[#6374AE] text-lg focus:outline-none focus:border-[#6374AE] transition-colors"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="text-red-500 text-center font-medium">
                {errorMessage}
              </div>
            )}

            {/* Submit Button và Sign In Link */}
            <div className="mt-8">
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-[60px] bg-[#6374AE] text-white font-wixmadefor font-semibold text-xl
                  rounded-xl hover:bg-[#5A6A9F] transition-colors mb-8"
              >
                Create Account
              </button>

              {/* Divider */}
              <div className="flex items-center justify-center mb-8">
                <div className="w-full h-[1px] bg-[#9CB6DD]"></div>
              </div>

              {/* Sign In Link */}
              <Link to="/signin">
                <div className="w-full h-[60px] flex items-center justify-center">
                  <span className="font-wixmadefor text-[#6374AE] font-semibold text-xl hover:text-[#5A6A9F] transition-colors">
                    Already have an account?
                  </span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="ml-3 text-[#6374AE] transform group-hover:translate-x-1 transition-transform"
                  >
                    <path
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
