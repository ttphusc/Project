import React, { useState } from "react";
import coverImage from "../../assets/cover.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/forgot-password`,
        { email }
      );
      toast.success("Vui lòng kiểm tra email của bạn để đặt lại mật khẩu!", {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/signin");
    } catch (error) {
      setErrorMessage("Email không tồn tại trong hệ thống.");
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
              Set your password again
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="w-1/2 bg-[#FAF8F6] px-20 py-12 overflow-y-auto">
        <div className="max-w-[500px]">
          <h1 className="font-lobster text-[#6374AE] text-5xl mb-10">
            Forgot Password
          </h1>

          <form onSubmit={handleForgotPassword} className="space-y-6">
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

            {errorMessage && (
              <div className="text-red-500 text-center font-medium">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full h-[60px] bg-[#6374AE] text-white font-wixmadefor font-semibold text-xl
                rounded-xl hover:bg-[#5A6A9F] transition-colors mb-8"
            >
              Send reset password link
            </button>

            <Link to="/signin">
              <div className="w-full h-[60px] flex items-center justify-center">
                <span className="font-wixmadefor text-[#6374AE] font-semibold text-xl hover:text-[#5A6A9F] transition-colors">
                  Return to sign in
                </span>
              </div>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
