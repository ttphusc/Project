import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { motion } from "framer-motion";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CloseIcon from '@mui/icons-material/Close';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import BuildIcon from '@mui/icons-material/Build';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const ExcerciseItemInput = ({ hideExcercise, setExcerciseData }) => {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [instructions, setIntructions] = useState("");
  const [equipment, setEquipment] = useState("");
  const [primaryMuscles, setPrimaryMuscles] = useState("");
  const [secondaryMuscles, setSecondaryMuscles] = useState("");

  useEffect(() => {
    console.log(name, level, instructions, equipment, primaryMuscles, secondaryMuscles);
    setExcerciseData({
      name,
      level,
      instructions,
      equipment,
      primaryMuscles,
      secondaryMuscles,
    });
    // console.log(setExcerciseData);
  }, [name, level, instructions, equipment, primaryMuscles, secondaryMuscles]);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-xl p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FitnessCenterIcon className="text-[#6374AE] w-6 h-6" />
          <h2 className="text-xl font-semibold text-gray-800">Exercise Details</h2>
        </div>
        <motion.button
          onClick={hideExcercise}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <CloseIcon className="text-gray-500 w-5 h-5" />
        </motion.button>
      </div>

      {/* Exercise Name and Level */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <SportsGymnasticsIcon className="text-[#6374AE] w-5 h-5" />
            Exercise Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g., Push-ups, Squats, etc."
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#6374AE] focus:ring-2 focus:ring-[#6374AE]/20 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <SignalCellularAltIcon className="text-[#6374AE] w-5 h-5" />
            Difficulty Level
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#6374AE] focus:ring-2 focus:ring-[#6374AE]/20 outline-none transition-all appearance-none bg-white"
          >
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Equipment */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <BuildIcon className="text-[#6374AE] w-5 h-5" />
          Required Equipment
        </label>
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <ReactQuill
            value={equipment}
            onChange={setEquipment}
            modules={modules}
            theme="snow"
            placeholder="List required equipment..."
            className="h-[150px]"
          />
        </div>
      </div>

      {/* Muscles */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <AccessibilityNewIcon className="text-[#6374AE] w-5 h-5" />
            Primary Muscles
          </label>
          <textarea
            value={primaryMuscles}
            onChange={(e) => setPrimaryMuscles(e.target.value)}
            placeholder="E.g., Chest, Quadriceps"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#6374AE] focus:ring-2 focus:ring-[#6374AE]/20 outline-none transition-all resize-none h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <AccessibilityNewIcon className="text-[#6374AE] w-5 h-5" />
            Secondary Muscles
          </label>
          <textarea
            value={secondaryMuscles}
            onChange={(e) => setSecondaryMuscles(e.target.value)}
            placeholder="E.g., Triceps, Hamstrings"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#6374AE] focus:ring-2 focus:ring-[#6374AE]/20 outline-none transition-all resize-none h-[100px]"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <MenuBookIcon className="text-[#6374AE] w-5 h-5" />
          Exercise Instructions
        </label>
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <ReactQuill
            value={instructions}
            onChange={setIntructions}
            modules={modules}
            theme="snow"
            placeholder="Write detailed exercise instructions..."
            className="h-[200px]"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ExcerciseItemInput;
