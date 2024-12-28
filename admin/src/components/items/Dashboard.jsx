import axios from "axios";
import React, { useState, useEffect } from "react";
import { FiUsers, FiFileText, FiHelpCircle, FiFlag } from "react-icons/fi";
import { BsCalendarEvent } from "react-icons/bs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [reports, setReports] = useState([]);
  const [events, setEvents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  console.log(import.meta.env.VITE_API_URL);
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/post/all`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.data.success) {
        setPosts(response.data.posts);
      } else {
        console.error("Failed to fetch users:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Failed to load users. Please try again later.");
    }
    setLoading(false);
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/all`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.data.message) {
        setUsers(response.data.rs);
      } else {
        console.error("Failed to fetch users:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Failed to load users. Please try again later.");
    }
    setLoading(false);
  };
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/question/all`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.data.success) {
        setQuestions(response.data.questions);
      } else {
        console.error("Failed to fetch users:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Failed to load users. Please try again later.");
    }
    setLoading(false);
  };
  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/report/all`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.data.success) {
        console.log(response.data.report);
        setReports(response.data.report);
      } else {
        console.error("Failed to fetch users:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Failed to load users. Please try again later.");
    }
    setLoading(false);
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/event/all`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.data.success) {
        setEvents(response.data.events);
      } else {
        console.error("Failed to fetch users:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Failed to load users. Please try again later.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    fetchUser();
    fetchQuestions();
    fetchReports();
    fetchEvents();
  }, []);

  const StatCard = ({ title, count, icon, trend, color }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 w-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{count}</h3>
          <div className="flex items-center mt-2">
            <span
              className={`text-sm ${
                trend >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend >= 0 ? "+" : ""}
              {trend}%
            </span>
            <span className="text-gray-400 text-sm ml-2">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="w-[1400px] mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          Dashboard Overview
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Users"
            count={users.length}
            icon={<FiUsers size={24} className="text-blue-500" />}
            trend={3.2}
            color="blue"
          />
          <StatCard
            title="Total Posts"
            count={posts.length}
            icon={<FiFileText size={24} className="text-indigo-500" />}
            trend={2.1}
            color="indigo"
          />
          <StatCard
            title="Questions"
            count={questions.length}
            icon={<FiHelpCircle size={24} className="text-purple-500" />}
            trend={-0.8}
            color="purple"
          />
          <StatCard
            title="Reports"
            count={reports.length}
            icon={<FiFlag size={24} className="text-red-500" />}
            trend={1.2}
            color="red"
          />
          <StatCard
            title="Events"
            count={events.length}
            icon={<BsCalendarEvent size={24} className="text-green-500" />}
            trend={4.5}
            color="green"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activity Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Activity Overview
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { name: "Jan", users: 400, posts: 240, questions: 200 },
                    { name: "Feb", users: 300, posts: 139, questions: 220 },
                    { name: "Mar", users: 200, posts: 980, questions: 290 },
                    { name: "Apr", users: 278, posts: 390, questions: 300 },
                    { name: "May", users: 189, posts: 480, questions: 181 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#6366F1" />
                  <Line type="monotone" dataKey="posts" stroke="#8B5CF6" />
                  <Line type="monotone" dataKey="questions" stroke="#EC4899" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Content Distribution
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Posts", value: posts.length },
                      { name: "Questions", value: questions.length },
                      { name: "Events", value: events.length },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#6366F1" />
                    <Cell fill="#8B5CF6" />
                    <Cell fill="#EC4899" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activity
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Add your recent activity data here */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
