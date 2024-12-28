import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";
import { toast } from "react-toastify";

const ContactItem = () => {
  const { user, setUser } = useContext(AuthContext);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/user/contact`,
        { phone, address },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data.rs);
      localStorage.setItem("user", JSON.stringify(response.data.rs));
      toast.success("Contact information updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update contact information");
      console.error("Update failed:", error);
    }
  };

  const handleCancel = () => {
    setPhone(user?.phone || "");
    setAddress(user?.address || "");
    setIsEditing(false);
  };

  return (
    <div className="p-8 w-full mx-auto">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6374AE] to-[#8693d0] p-6">
          <div className="flex items-center gap-3">
            <ContactMailIcon className="text-white w-8 h-8" />
            <h1 className="text-3xl font-bold text-white">
              Contact Information
            </h1>
          </div>
          <p className="text-gray-100 mt-2">
            Manage your contact details for better communication
          </p>
        </div>

        <div className="p-8">
          {/* Info Notice */}
          <div className="flex items-start gap-4 bg-blue-50 p-4 rounded-lg mb-8">
            <InfoIcon className="text-blue-600 w-6 h-6 mt-1" />
            <div>
              <h3 className="text-blue-800 font-medium mb-1">
                Why we need this information
              </h3>
              <p className="text-blue-600">
                Your contact information helps us provide better service and
                keep you updated about important changes or announcements.
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Phone Number */}
            <div>
              <label className="flex items-center text-gray-700 font-medium mb-2">
                <PhoneIcon className="w-5 h-5 mr-2 text-[#6374AE]" />
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your phone number"
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

            {/* Address */}
            <div>
              <label className="flex items-center text-gray-700 font-medium mb-2">
                <LocationOnIcon className="w-5 h-5 mr-2 text-[#6374AE]" />
                Address
              </label>
              <div className="relative">
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your full address"
                  rows="3"
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
            <div className="flex justify-end gap-4 pt-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-[#6374AE] text-white rounded-lg hover:bg-[#4A5578] transition-colors"
                >
                  <ContactMailIcon className="w-5 h-5" />
                  Edit Contact
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
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
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactItem;
