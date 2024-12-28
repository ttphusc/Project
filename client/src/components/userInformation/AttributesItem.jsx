import React, { useContext, useState, useEffect } from "react";
import HeightIcon from "@mui/icons-material/Height";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoodIcon from "@mui/icons-material/Mood";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const AttributesItem = () => {
  const [weight, setWeight] = useState();
  const [height, setHeight] = useState();
  const [sleepHour, setSleepHour] = useState();
  const [activityLevel, setActivityLevel] = useState();
  const [dietaryPreferences, setDietaryPreferences] = useState();
  const [healthCondition, setHealthCondition] = useState();
  const [stressLevel, setStressLevel] = useState();
  const [fitnessExperiences, setFitnessExperiences] = useState();
  const [fitnessGoal, setFitnessGoal] = useState();
  const [exercisePreference, setExercisePreference] = useState();
  const [attributes, setAttributes] = useState();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const getAttributes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/attributes/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAttributes(response.data.attributes);
        console.log(response.data.attributes);
      } catch (error) {
        console.error("Error fetching attributes:", error);
      }
    };

    getAttributes();
  }, [token]);
  const setAllAttributes = () => {
    if (attributes) {
      setHeight(attributes.height);
      setWeight(attributes.weight);
      setSleepHour(attributes.sleepHours);
      setActivityLevel(attributes.activityLevel);
      setDietaryPreferences(attributes.dietaryPreferences);
      setHealthCondition(attributes.heathCondition);
      setStressLevel(attributes.stressLevel);
      setFitnessExperiences(attributes.fitnessExperience);
      setFitnessGoal(attributes.fitnessGoal);
      setExercisePreference(attributes.exercisePreferences);
    }
  };

  useEffect(() => {
    setAllAttributes();
  }, [attributes]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/attributes/${attributes._id}`,
        {
          weight: weight,
          height: height,
          sleepHour: sleepHour,
          activityLevel: activityLevel,
          dietaryPreferences: dietaryPreferences,
          healthCondition: healthCondition,
          stressLevel: stressLevel,
          fitnessExperiences: fitnessExperiences,
          fitnessGoal: fitnessGoal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setAttributes(response.data.updateAttributes);
      toast.success("Update attributes success!!");
      setAllAttributes();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="p-8 w-full mx-auto">
      <ToastContainer />
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6374AE] to-[#8693d0] p-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Personal Attributes
          </h1>
          <p className="text-gray-100 text-lg">
            Help us personalize your experience by providing your health and
            fitness details
          </p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Height */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <HeightIcon className="w-5 h-5 mr-2 text-[#6374AE]" />
                Height (cm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE] focus:border-transparent transition-all"
                  placeholder="Enter your height"
                />
              </div>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <MonitorWeightIcon className="w-5 h-5 mr-2 text-[#6374AE]" />
                Weight (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE] focus:border-transparent transition-all"
                  placeholder="Enter your weight"
                />
              </div>
            </div>

            {/* Sleep Hours */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <BedtimeIcon className="w-5 h-5 mr-2 text-[#6374AE]" />
                Sleep Hours
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={sleepHour}
                  onChange={(e) => setSleepHour(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE] focus:border-transparent transition-all"
                  placeholder="Hours of sleep per day"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <DirectionsRunIcon className="w-5 h-5 mr-2 text-[#6374AE]" />
                Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE] focus:border-transparent transition-all"
              >
                <option value="">Select level</option>
                <option value="Sedentary">Sedentary</option>
                <option value="Lightly Active">Lightly Active</option>
                <option value="Moderately Active">Moderately Active</option>
                <option value="Very Active">Very Active</option>
                <option value="Super Active">Super Active</option>
              </select>
            </div>

            {/* Dietary Preferences */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <RestaurantIcon className="w-5 h-5 mr-2 text-[#6374AE]" />
                Dietary Preferences
              </label>
              <select
                value={dietaryPreferences}
                onChange={(e) => setDietaryPreferences(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE] focus:border-transparent transition-all"
              >
                <option value="">Select preference</option>
                <option value="None">None</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Keto">Keto</option>
                <option value="Paleo">Paleo</option>
                <option value="Mediterranean">Mediterranean</option>
              </select>
            </div>

            {/* Health Condition */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <FavoriteIcon className="w-5 h-5 mr-2 text-[#6374AE]" />
                Health Condition
              </label>
              <select
                value={healthCondition}
                onChange={(e) => setHealthCondition(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE] focus:border-transparent transition-all"
              >
                <option value="">Select condition</option>
                <option value="None">None</option>
                <option value="Hypertension">Hypertension</option>
                <option value="Diabetes">Diabetes</option>
                <option value="Heart Disease">Heart Disease</option>
                <option value="Asthma">Asthma</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Stress Level */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <MoodIcon className="w-5 h-5 mr-2 text-[#6374AE]" />
                Stress Level
              </label>
              <select
                value={stressLevel}
                onChange={(e) => setStressLevel(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE] focus:border-transparent transition-all"
              >
                <option value="">Select level</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Fitness Experience */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <FitnessCenterIcon className="w-5 h-5 mr-2 text-[#6374AE]" />
                Fitness Experience
              </label>
              <select
                value={fitnessExperiences}
                onChange={(e) => setFitnessExperiences(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE] focus:border-transparent transition-all"
              >
                <option value="">Select experience</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Fitness Goal */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <TrackChangesIcon className="w-5 h-5 mr-2 text-[#6374AE]" />
                Fitness Goal
              </label>
              <select
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE] focus:border-transparent transition-all"
              >
                <option value="">Select goal</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Endurance">Endurance</option>
              </select>
            </div>
          </div>

          {/* Exercise Preferences */}
          <div className="mt-6 space-y-2">
            <label className="flex items-center text-gray-700 font-medium">
              <EmojiEventsIcon className="w-5 h-5 mr-2 text-[#6374AE]" />
              Exercise Preferences
            </label>
            <textarea
              value={exercisePreference}
              onChange={(e) => setExercisePreference(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE] focus:border-transparent transition-all"
              rows="4"
              placeholder="Describe your exercise preferences..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={setAllAttributes}
              className="px-6 py-2 border-2 border-[#6374AE] text-[#6374AE] rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-6 py-2 bg-[#6374AE] text-white rounded-lg hover:bg-[#4A5578] transition-colors font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributesItem;
