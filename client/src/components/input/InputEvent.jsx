import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import EventIcon from "@mui/icons-material/Event";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SendIcon from "@mui/icons-material/Send";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
const InputEvent = () => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [timeStart, setTimeStart] = useState(new Date());
  const [timeEnd, setTimeEnd] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter an event title");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter an event description");
      return;
    }
    if (timeEnd < timeStart) {
      toast.error("End time cannot be earlier than start time");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please login to create events");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/event/`,
        {
          title,
          description,
          timeStart,
          timeEnd,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Event created successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setTimeStart(new Date());
      setTimeEnd(new Date());
      navigate("/event/manage");
    } catch (error) {
      toast.error("Failed to create event. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ header: [1, 2, 3, 4, 5, false] }],
      [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
      [{ color: [] }, { background: [] }],
      ["link", "image", "code-block"],
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto p-8"
    >
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6374AE] to-[#8693d0] p-8">
          <div className="flex items-center gap-4">
            <EventIcon className="text-white w-10 h-10" />
            <div>
              <h1 className="text-4xl font-bold text-white">
                Create Your Event
              </h1>
              <p className="text-gray-100 mt-2 text-lg">
                Share your upcoming event with the community
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleCreate} className="p-8 space-y-8">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <TitleIcon className="text-[#6374AE]" />
              Event Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-4 border-2 border-[#9CB6DD] rounded-xl 
                placeholder:text-[#9CB6DD] text-gray-700 text-lg
                focus:outline-none focus:border-[#6374AE] focus:ring-2 focus:ring-[#6374AE]/20
                transition-all duration-200"
              placeholder="Give your event a catchy title..."
            />
          </div>

          {/* Description Editor */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <DescriptionIcon className="text-[#6374AE]" />
              Event Description
            </label>
            <div className="border-2 border-[#9CB6DD] rounded-xl overflow-hidden">
              <ReactQuill
                value={description}
                onChange={setDescription}
                modules={modules}
                theme="snow"
                placeholder="Write a detailed description about your event..."
                className="h-[300px]"
              />
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-8">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-medium">
                <AccessTimeIcon className="text-[#6374AE]" />
                Start Date
              </label>
              <div className="border-2 border-[#9CB6DD] rounded-xl p-4">
                <Calendar
                  onChange={setTimeStart}
                  value={timeStart}
                  className="w-full"
                />
                <p className="mt-4 text-[#6374AE] font-medium">
                  Selected: {timeStart.toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-medium">
                <AccessTimeIcon className="text-[#6374AE]" />
                End Date
              </label>
              <div className="border-2 border-[#9CB6DD] rounded-xl p-4">
                <Calendar
                  onChange={setTimeEnd}
                  value={timeEnd}
                  className="w-full"
                />
                <p className="mt-4 text-[#6374AE] font-medium">
                  Selected: {timeEnd.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl text-white font-medium
                transition-all duration-200 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#6374AE] to-[#8693d0] hover:shadow-lg"
                }`}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  <span>Creating Event...</span>
                </>
              ) : (
                <>
                  <SendIcon />
                  <span>Create Event</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default InputEvent;
