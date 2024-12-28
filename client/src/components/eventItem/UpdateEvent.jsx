import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useParams, useNavigate } from "react-router-dom";
import EventIcon from "@mui/icons-material/Event";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SaveIcon from "@mui/icons-material/Save";
import AddTaskIcon from "@mui/icons-material/AddTask";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

const UpdateEvent = () => {
  const { eid } = useParams();
  // const [eid, setEid] = useState("6733ed19bdd92149b174f523");
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [timeStart, setTimeStart] = useState(new Date());
  const [timeEnd, setTimeEnd] = useState(new Date());
  const [dailyToDoLists, setDailyToDoLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [taskInputs, setTaskInputs] = useState({});

  useEffect(() => {
    // eid = "672f7b12d6ac5eb66771fd03";
    fetchEvent();
  }, [eid]);

  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/event/${eid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const event = response.data.event;
      setTitle(event.title);
      setDescription(event.description);
      setTimeStart(new Date(event.timeStart));
      setTimeEnd(new Date(event.timeEnd));
      setDailyToDoLists(event.dailyToDoLists || []);
      console.log(event);
    } catch (error) {
      toast.error("Failed to fetch event data");
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (timeEnd < timeStart) {
      toast.error("End date cannot be earlier than start date");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/event/${eid}`,
        {
          title,
          description,
          timeStart,
          timeEnd,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Event updated successfully");
        navigate("/events");
      }
    } catch (error) {
      toast.error("Failed to update event");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (date) => {
    const taskInput = taskInputs[date] || "";
    if (!taskInput.trim()) {
      toast.error("Please enter a task description");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/event/${eid}/add-task`,
        {
          date,
          task: {
            description: taskInput,
            isCompleted: false,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setDailyToDoLists(response.data.dailyToDoLists);
        setTaskInputs((prev) => ({
          ...prev,
          [date]: "",
        }));
        toast.success("Task added successfully");
      }
    } catch (error) {
      toast.error("Failed to add task");
      console.error(error);
    }
  };

  const handleToggleTask = async (date, taskId, currentStatus) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/event/${eid}/todo/task`,
        {
          date,
          taskId,
          isCompleted: !currentStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setDailyToDoLists(response.data.dailyToDoLists);
        toast.success("Task status updated");
      }
    } catch (error) {
      toast.error("Failed to update task status");
      console.error(error);
    }
  };

  const handleTaskInputChange = (date, value) => {
    setTaskInputs((prev) => ({
      ...prev,
      [date]: value,
    }));
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
              <h1 className="text-4xl font-bold text-white">Update Event</h1>
              <p className="text-gray-100 mt-2 text-lg">
                Modify your event details and manage tasks
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
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
              className="w-full p-4 border-2 border-[#9CB6DD] rounded-xl 
                placeholder:text-[#9CB6DD] text-gray-700 text-lg
                focus:outline-none focus:border-[#6374AE] focus:ring-2 focus:ring-[#6374AE]/20
                transition-all duration-200"
              placeholder="Event title..."
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
              </div>
            </div>
          </div>

          {/* Daily Tasks */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Daily Tasks</h2>
            {dailyToDoLists.map((dayList) => (
              <div
                key={dayList._id}
                className="border-2 border-[#9CB6DD] rounded-xl p-4"
              >
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  {new Date(dayList.date).toLocaleDateString()}
                </h3>

                {/* Tasks List */}
                <div className="space-y-2 mb-4">
                  {dayList.tasks.map((task) => (
                    <motion.div
                      key={task._id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                      whileHover={{ scale: 1.01 }}
                    >
                      <button
                        onClick={() =>
                          handleToggleTask(
                            dayList.date,
                            task._id,
                            task.isCompleted
                          )
                        }
                        className={`p-2 rounded-full transition-colors
                          ${
                            task.isCompleted
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                      >
                        <CheckCircleIcon />
                      </button>
                      <span
                        className={`flex-1 ${
                          task.isCompleted
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                        }`}
                      >
                        {task.description}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Add Task Input - Sử dụng state riêng cho từng ngày */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={taskInputs[dayList.date] || ""}
                    onChange={(e) =>
                      handleTaskInputChange(dayList.date, e.target.value)
                    }
                    placeholder="Add new task..."
                    className="flex-1 p-2 border-2 border-gray-200 rounded-lg"
                  />
                  <button
                    onClick={() => handleAddTask(dayList.date)}
                    className="p-2 bg-[#6374AE] text-white rounded-lg hover:bg-[#4A5578]"
                  >
                    <AddTaskIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <motion.button
              onClick={() => navigate("/events")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </motion.button>

            <motion.button
              onClick={handleUpdate}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium
                transition-all duration-200 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#6374AE] to-[#8693d0] hover:shadow-lg"
                }`}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <SaveIcon />
                  <span>Save Changes</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UpdateEvent;
