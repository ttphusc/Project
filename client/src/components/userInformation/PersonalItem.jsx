import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import WcIcon from "@mui/icons-material/Wc";
import CakeIcon from "@mui/icons-material/Cake";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";
import { toast } from "react-toastify";

const PersonalItem = () => {
  const { user, setUser } = useContext(AuthContext);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstname(user.firstname || "");
      setLastname(user.lastname || "");
      setGender(user.gender || "");
      setDob(user.dob ? user.dob.split("T")[0] : "");
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const newDob = new Date(dob);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/user/personal`,
        { firstname, lastname, dob: newDob, gender },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Personal information updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update personal information");
      console.error("Update failed:", error);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFirstname(user.firstname || "");
      setLastname(user.lastname || "");
      setGender(user.gender || "");
      setDob(user.dob ? user.dob.split("T")[0] : "");
    }
    setIsEditing(false);
  };

  return (
    <div className="p-8 w-full mx-auto">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6374AE] to-[#8693d0] p-6">
          <div className="flex items-center gap-3">
            <PersonIcon className="text-white w-8 h-8" />
            <h1 className="text-3xl font-bold text-white">
              Personal Information
            </h1>
          </div>
          <p className="text-gray-100 mt-2">
            Manage your personal details and information
          </p>
        </div>

        <div className="p-8">
          {/* Info Notice */}
          <div className="flex items-start gap-4 bg-blue-50 p-4 rounded-lg mb-8">
            <InfoIcon className="text-blue-600 w-6 h-6 mt-1" />
            <div>
              <h3 className="text-blue-800 font-medium mb-1">
                Keep Your Profile Updated
              </h3>
              <p className="text-blue-600">
                Accurate personal information helps us provide you with a
                better, more personalized experience.
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* First Name */}
            <div>
              <label className="flex items-center text-gray-700 font-medium mb-2">
                <BadgeIcon className="w-5 h-5 mr-2 text-[#6374AE]" />
                First Name
              </label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your first name"
                className={`w-full p-4 border-2 rounded-lg 
                  ${
                    isEditing
                      ? "border-[#6374AE] bg-white focus:ring-2 focus:ring-[#6374AE] focus:border-transparent"
                      : "border-gray-200 bg-gray-50"
                  } 
                  transition-all text-gray-700 placeholder-gray-400`}
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="flex items-center text-gray-700 font-medium mb-2">
                <BadgeIcon className="w-5 h-5 mr-2 text-[#6374AE]" />
                Last Name
              </label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your last name"
                className={`w-full p-4 border-2 rounded-lg 
                  ${
                    isEditing
                      ? "border-[#6374AE] bg-white focus:ring-2 focus:ring-[#6374AE] focus:border-transparent"
                      : "border-gray-200 bg-gray-50"
                  } 
                  transition-all text-gray-700 placeholder-gray-400`}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="flex items-center text-gray-700 font-medium mb-2">
                <WcIcon className="w-5 h-5 mr-2 text-[#6374AE]" />
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={!isEditing}
                className={`w-full p-4 border-2 rounded-lg 
                  ${
                    isEditing
                      ? "border-[#6374AE] bg-white focus:ring-2 focus:ring-[#6374AE] focus:border-transparent"
                      : "border-gray-200 bg-gray-50"
                  } 
                  transition-all text-gray-700`}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="flex items-center text-gray-700 font-medium mb-2">
                <CakeIcon className="w-5 h-5 mr-2 text-[#6374AE]" />
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={!isEditing}
                className={`w-full p-4 border-2 rounded-lg 
                  ${
                    isEditing
                      ? "border-[#6374AE] bg-white focus:ring-2 focus:ring-[#6374AE] focus:border-transparent"
                      : "border-gray-200 bg-gray-50"
                  } 
                  transition-all text-gray-700`}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-[#6374AE] text-white rounded-lg hover:bg-[#4A5578] transition-colors"
                >
                  <PersonIcon className="w-5 h-5" />
                  Edit Profile
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

export default PersonalItem;
