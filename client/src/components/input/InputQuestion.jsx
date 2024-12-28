import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import TitleIcon from "@mui/icons-material/Title";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SendIcon from "@mui/icons-material/Send";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CircularProgress from "@mui/material/CircularProgress";

const InputQuestion = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error("Please enter a question title");
      return;
    }
    if (!content.trim()) {
      toast.error("Please enter question content");
      return;
    }
    if (!tags.trim()) {
      toast.error("Please add at least one tag");
      return;
    }

    const arrTags = tags.split(" ").filter((tag) => tag.trim());
    if (arrTags.length > 5) {
      toast.error("Maximum 5 tags allowed");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please login to create a question");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/question/`,
        {
          title: title.trim(),
          content: content.trim(),
          tags: arrTags,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        toast.success("Question created successfully!");
        navigate("/question/questions");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create question");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className=" w-full mx-auto p-6"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6374AE] to-[#8693d0] p-6">
          <div className="flex items-center gap-3 text-white mb-2">
            <HelpOutlineIcon className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Ask a Question</h1>
          </div>
          <p className="text-white/80">
            Share your question with the community and get helpful answers
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleCreate} className="p-6 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <TitleIcon className="text-[#6374AE]" />
              Question Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question?"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#6374AE] focus:ring-2 focus:ring-[#6374AE]/20 outline-none transition-all"
              maxLength={200}
            />
            <p className="text-sm text-gray-500 flex justify-end">
              {title.length}/200
            </p>
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <LocalOfferIcon className="text-[#6374AE]" />
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Add up to 5 tags separated by spaces (e.g. javascript react nodejs)"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#6374AE] focus:ring-2 focus:ring-[#6374AE]/20 outline-none transition-all"
            />
            <p className="text-sm text-gray-500">
              {tags.split(" ").filter((tag) => tag.trim()).length}/5 tags
            </p>
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium mb-2">
              Question Details
            </label>
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={modules}
                theme="snow"
                placeholder="Describe your question in detail..."
                className="h-[300px]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <motion.button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium
                transition-all duration-200 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#6374AE] to-[#8693d0] hover:shadow-lg"
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <SendIcon />
                  <span>Post Question</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default InputQuestion;
