import React, { useState } from "react";
import RecipeItemInput from "./RecipeItemInput";
import ExcerciseItemInput from "./ExcerciseItemInput";
import axios from "axios";
import ReactQuill from "react-quill";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import PostAddIcon from "@mui/icons-material/PostAdd";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

const CreatePostItem = () => {
  const [showRecipe, setShowRecipe] = useState(false);
  const [showExcercise, setShowExcercise] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [excercise, setExcercise] = useState(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");

  const hideRecipe = () => setShowRecipe(false);
  const hideExcercise = () => setShowExcercise(false);

  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "code-block"],
      ["clean"],
    ],
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please login to create a post");
        return;
      }

      const arrTags = tags.split(" ").filter((tag) => tag.trim());
      const postData = {
        title: title.trim(),
        content: content.trim(),
        tags: arrTags,
        image: imageUrl,
      };

      console.log(postData);
      const postResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/`,
        postData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const postId = postResponse.data.createPost._id;

      const promises = [];

      if (recipe) {
        promises.push(
          axios.post(
            `${import.meta.env.VITE_API_URL}/api/v1/recipe/${postId}`,
            recipe,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        );
      }

      if (excercise) {
        console.log(excercise);
        promises.push(
          axios.post(
            `${import.meta.env.VITE_API_URL}/api/v1/excercise/${postId}`,
            excercise,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        );
      }

      await Promise.all(promises);
      toast.success("Post created successfully!");
      setTitle("");
      setContent("");
      setTags("");
      setRecipe(null);
      setExcercise(null);
      setShowRecipe(false);
      setShowExcercise(false);
      navigate("/post/posts");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setImageUrl(response.data.imageUrl);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6374AE] to-[#8693d0] p-6">
        <div className="flex items-center gap-3 text-white mb-2">
          <PostAddIcon className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Create a Post</h1>
        </div>
        <p className="text-white/80">
          Share your thoughts, recipes, or exercises with the community
        </p>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-6">
        {/* Title Input */}
        <div className="space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your post a title..."
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#6374AE] focus:ring-2 focus:ring-[#6374AE]/20 outline-none transition-all"
          />
        </div>

        {/* Tags Input */}
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg">
          <LocalOfferIcon className="text-[#6374AE]" />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add tags (separated by spaces)"
            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Rich Text Editor */}
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={modules}
            theme="snow"
            placeholder="Write your post content..."
            className="h-[300px]"
          />
        </div>

        {/* Additional Components */}
        <AnimatePresence>
          {showRecipe && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <RecipeItemInput
                hideRecipe={hideRecipe}
                setRecipeData={setRecipe}
              />
            </motion.div>
          )}

          {showExcercise && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <ExcerciseItemInput
                hideExcercise={hideExcercise}
                setExcerciseData={setExcercise}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <motion.button
              onClick={() => setShowRecipe(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                recipe
                  ? "bg-green-50 text-green-600"
                  : "bg-[#F2F7FB] text-[#6374AE] hover:bg-[#E2E8F0]"
              }`}
              disabled={showRecipe}
            >
              <RestaurantIcon />
              <span>{recipe ? "Recipe Added" : "Add Recipe"}</span>
            </motion.button>

            <motion.button
              onClick={() => setShowExcercise(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                excercise
                  ? "bg-green-50 text-green-600"
                  : "bg-[#F2F7FB] text-[#6374AE] hover:bg-[#E2E8F0]"
              }`}
              disabled={showExcercise}
            >
              <FitnessCenterIcon />
              <span>{excercise ? "Exercise Added" : "Add Exercise"}</span>
            </motion.button>
          </div>

          <motion.button
            onClick={handleCreate}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium
              transition-all duration-200 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#6374AE] to-[#8693d0] hover:shadow-lg"
              }`}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} color="inherit" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <SendIcon />
                <span>Create Post</span>
              </>
            )}
          </motion.button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-[#6374AE] file:text-white
              hover:file:bg-[#4A5A9E]"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Uploaded preview"
              className="mt-2 max-w-xs rounded-lg shadow-md"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CreatePostItem;
