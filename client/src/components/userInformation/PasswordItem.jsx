import React, { useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import SecurityIcon from "@mui/icons-material/Security";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const PasswordItem = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("accessToken");
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (verifyPassword !== newPassword) {
      toast.error("New password and verify password do not match");
      // setErrorMessage("New password and verify password do not match");
      // return;
    } else {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/v1/user/password`,
          {
            newPassword: newPassword,
            oldPassword: currentPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response.data);
        // setAttributes(response.data.updateAttributes);
        toast.success("Update attributes success!!");
        clear();
      } catch (error) {
        // console.error("Update failed:", error);
        toast.error("New password and verify password do not match" + error);
      }
    }
  };

  const clear = () => {
    setCurrentPassword("");
    setNewPassword("");
    setVerifyPassword("");
    setErrorMessage("");
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "" };
    const strength =
      password.length >= 8
        ? password.match(/[A-Z]/) &&
          password.match(/[a-z]/) &&
          password.match(/[0-9]/)
          ? 3
          : password.match(/[A-Z]/) || password.match(/[0-9]/)
          ? 2
          : 1
        : 1;

    const texts = ["Weak", "Medium", "Strong"];
    const colors = ["red", "yellow", "green"];
    return {
      strength,
      text: texts[strength - 1],
      color: colors[strength - 1],
    };
  };

  return (
    <div className="p-8 w-full mx-auto">
      <ToastContainer />￼ Back © 2024 FitNutritionHub. All rights reserved.
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6374AE] to-[#8693d0] p-6">
          <div className="flex items-center gap-3">
            <LockOutlinedIcon className="text-white w-8 h-8" />
            <h1 className="text-3xl font-bold text-white">Change Password</h1>
          </div>
          <p className="text-gray-100 mt-2">
            Ensure your account is using a strong password to stay secure
          </p>
        </div>

        <div className="p-8">
          {/* Security Notice */}
          <div className="flex items-start gap-4 bg-blue-50 p-4 rounded-lg mb-8">
            <SecurityIcon className="text-blue-600 w-6 h-6 mt-1" />
            <div>
              <h3 className="text-blue-800 font-medium mb-1">
                Password Requirements
              </h3>
              <ul className="text-blue-600 text-sm space-y-1">
                <li>• Minimum 8 characters long</li>
                <li>• At least one uppercase letter</li>
                <li>• At least one number</li>
                <li>• Avoid using personal information</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-4 pr-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE] focus:border-transparent transition-all"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <VisibilityOffOutlinedIcon />
                  ) : (
                    <VisibilityOutlinedIcon />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-4 pr-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE] focus:border-transparent transition-all"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <VisibilityOffOutlinedIcon />
                  ) : (
                    <VisibilityOutlinedIcon />
                  )}
                </button>
              </div>
              {newPassword && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          getPasswordStrength(newPassword).color === "red"
                            ? "bg-red-500"
                            : getPasswordStrength(newPassword).color ===
                              "yellow"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${
                            (getPasswordStrength(newPassword).strength / 3) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <span
                      className={`text-sm ${
                        getPasswordStrength(newPassword).color === "red"
                          ? "text-red-500"
                          : getPasswordStrength(newPassword).color === "yellow"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {getPasswordStrength(newPassword).text}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Verify Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Verify Password
              </label>
              <div className="relative">
                <input
                  type={showVerifyPassword ? "text" : "password"}
                  value={verifyPassword}
                  onChange={(e) => setVerifyPassword(e.target.value)}
                  className="w-full p-4 pr-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE] focus:border-transparent transition-all"
                  placeholder="Verify new password"
                />
                <button
                  type="button"
                  onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showVerifyPassword ? (
                    <VisibilityOffOutlinedIcon />
                  ) : (
                    <VisibilityOutlinedIcon />
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={clear}
                className="flex items-center gap-2 px-6 py-3 border-2 border-[#6374AE] text-[#6374AE] rounded-lg hover:bg-gray-50 transition-colors"
              >
                <CancelIcon className="w-5 h-5" />
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-[#6374AE] text-white rounded-lg hover:bg-[#4A5578] transition-colors"
              >
                <SaveIcon className="w-5 h-5" />
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordItem;
