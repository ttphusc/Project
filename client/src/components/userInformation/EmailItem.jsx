import React, { useState, useEffect } from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SecurityIcon from "@mui/icons-material/Security";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import axios from "axios";

const EmailItem = () => {
  const [primaryEmail, setPrimaryEmail] = useState("none@gmail.com");
  const [backupEmail, setBackupEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const getEmail = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/user/get/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setPrimaryEmail(response.data.rs.email);
      } catch (error) {
        console.error("Error fetching attributes:", error);
      }
    };

    getEmail();
  }, [token]);

  const handleSubmit = () => {
    // Xử lý logic submit
    toast.success("Email updated successfully!");
    setIsEditing(false);
  };

  return (
    <div className="p-8 w-full mx-auto">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6374AE] to-[#8693d0] p-6">
          <div className="flex items-center gap-3">
            <MailOutlineIcon className="text-white w-8 h-8" />
            <h1 className="text-3xl font-bold text-white">Email Settings</h1>
          </div>
        </div>

        <div className="p-8">
          {/* Security Notice */}
          <div className="flex items-start gap-4 bg-blue-50 p-4 rounded-lg mb-8">
            <SecurityIcon className="text-blue-600 w-6 h-6 mt-1" />
            <div>
              <h3 className="text-blue-800 font-medium mb-1">
                Security Notice
              </h3>
              <p className="text-blue-600">
                Your backup email will receive notifications related to account
                security and can be used to reset your password.
              </p>
            </div>
          </div>

          {/* Primary Email */}
          <div className="mb-8">
            <label className="flex items-center text-gray-700 font-medium mb-2">
              <MailOutlineIcon className="w-5 h-5 mr-2 text-[#6374AE]" />
              Primary Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={primaryEmail}
                onChange={(e) => setPrimaryEmail(e.target.value)}
                disabled={!isEditing}
                className={`w-full p-4 border-2 rounded-lg 
                  ${
                    isEditing
                      ? "border-[#6374AE] bg-white focus:ring-2 focus:ring-[#6374AE] focus:border-transparent"
                      : "border-gray-200 bg-gray-50"
                  } 
                  transition-all text-gray-700`}
              />
              {!isEditing && (
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  Primary
                </span>
              )}
            </div>
          </div>

          {/* Backup Email */}
          <div className="mb-8">
            <label className="flex items-center text-gray-700 font-medium mb-2">
              <AddCircleOutlineIcon className="w-5 h-5 mr-2 text-[#6374AE]" />
              Backup Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={backupEmail}
                onChange={(e) => setBackupEmail(e.target.value)}
                disabled={!isEditing}
                placeholder="Add a backup email address"
                className={`w-full p-4 border-2 rounded-lg 
                  ${
                    isEditing
                      ? "border-[#6374AE] bg-white focus:ring-2 focus:ring-[#6374AE] focus:border-transparent"
                      : "border-gray-200 bg-gray-50"
                  } 
                  transition-all text-gray-700 placeholder-gray-400`}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#6374AE] text-white rounded-lg hover:bg-[#4A5578] transition-colors"
              >
                <MailOutlineIcon className="w-5 h-5" />
                Edit Emails
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-[#6374AE] text-[#6374AE] rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <CancelIcon className="w-5 h-5" />
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-3 bg-[#6374AE] text-white rounded-lg hover:bg-[#4A5578] transition-colors"
                >
                  <SaveIcon className="w-5 h-5" />
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailItem;
