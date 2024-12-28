import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { motion } from "framer-motion";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CloseIcon from '@mui/icons-material/Close';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const RecipeItemInput = ({ hideRecipe, setRecipeData }) => {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cooktime, setCooktime] = useState("");
  const [calories, setCalories] = useState("");

  useEffect(() => {
    setRecipeData({ name, ingredients, instructions, cooktime, calories });
  }, [name, ingredients, instructions, cooktime, calories, setRecipeData]);

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
          <RestaurantIcon className="text-[#6374AE] w-6 h-6" />
          <h2 className="text-xl font-semibold text-gray-800">Recipe Details</h2>
        </div>
        <motion.button
          onClick={hideRecipe}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <CloseIcon className="text-gray-500 w-5 h-5" />
        </motion.button>
      </div>

      {/* Recipe Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Recipe Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="E.g., Homemade Pizza, Chicken Curry, etc."
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#6374AE] focus:ring-2 focus:ring-[#6374AE]/20 outline-none transition-all"
        />
      </div>

      {/* Ingredients */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <ShoppingCartIcon className="text-[#6374AE] w-5 h-5" />
          Ingredients
        </label>
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <ReactQuill
            value={ingredients}
            onChange={setIngredients}
            modules={modules}
            theme="snow"
            placeholder="List your ingredients here..."
            className="h-[200px]"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <MenuBookIcon className="text-[#6374AE] w-5 h-5" />
          Cooking Instructions
        </label>
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <ReactQuill
            value={instructions}
            onChange={setInstructions}
            modules={modules}
            theme="snow"
            placeholder="Write your cooking instructions step by step..."
            className="h-[200px]"
          />
        </div>
      </div>

      {/* Cook Time and Calories */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <AccessTimeIcon className="text-[#6374AE] w-5 h-5" />
            Cooking Time
          </label>
          <input
            type="text"
            value={cooktime}
            onChange={(e) => setCooktime(e.target.value)}
            placeholder="E.g., 30 minutes, 1 hour"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#6374AE] focus:ring-2 focus:ring-[#6374AE]/20 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <LocalFireDepartmentIcon className="text-[#6374AE] w-5 h-5" />
            Calories
          </label>
          <input
            type="text"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="E.g., 350 kcal per serving"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#6374AE] focus:ring-2 focus:ring-[#6374AE]/20 outline-none transition-all"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeItemInput;
