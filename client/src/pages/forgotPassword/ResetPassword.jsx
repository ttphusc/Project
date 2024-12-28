import React, { useState } from "react";
import coverImage from "../../assets/cover.png";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/reset-password/${token}`,
        { password }
      );

      toast.success("Reset password successfully!", {
        position: "top-right",
        autoClose: 5000,
      });

      setTimeout(() => {
        navigate("/signin");
      }, 5000);
    } catch (error) {
      setErrorMessage("Cannot reset password. Please try again.");
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
              Set your new password
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Password Form */}
      <div className="w-1/2 bg-[#FAF8F6] px-20 py-12 overflow-y-auto">
        <div className="max-w-[500px]">
          <h1 className="font-lobster text-[#6374AE] text-5xl mb-10">
            Set your new password
          </h1>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block font-wixmadefor text-[#6374AE] font-semibold text-lg mb-2">
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-[60px] px-5 bg-white border-2 border-[#9CB6DD] rounded-xl
                  text-[#6374AE] text-lg focus:outline-none focus:border-[#6374AE] transition-colors"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block font-wixmadefor text-[#6374AE] font-semibold text-lg mb-2">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full h-[60px] px-5 bg-white border-2 border-[#9CB6DD] rounded-xl
                  text-[#6374AE] text-lg focus:outline-none focus:border-[#6374AE] transition-colors"
                placeholder="Confirm new password"
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
                rounded-xl hover:bg-[#5A6A9F] transition-colors"
            >
              Set your new password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
