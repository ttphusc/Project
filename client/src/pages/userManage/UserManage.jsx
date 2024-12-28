import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import SideBarUser from "../../layout/sidebar/SideBarUser";
import SideBarRight from "../../layout/sidebar/SideBarRight";

const UserManage = () => {
  const [posts, setPosts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [activeTab, setActiveTab] = useState("post");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [type, setType] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded._id);

      // Tạo hàm async để fetch tất cả dữ liệu
      const fetchAllData = async (id) => {
        try {
          setLoading(true);
          // Fetch tất cả dữ liệu song song để tối ưu performance
          await Promise.all([
            fetchPosts(id),
            fetchQuestions(id),
            fetchFollowers(id),
            fetchFollowings(id),
          ]);
        } catch (error) {
          toast.error("Lỗi khi tải dữ liệu");
        } finally {
          setLoading(false);
        }
      };

      fetchAllData(decoded._id);
    }
  }, []);

  const fetchPosts = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/${id}/posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      toast.error("Error fetching posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/${id}/questions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        setQuestions(response.data.questions);
      }
    } catch (error) {
      toast.error("Error fetching questions");
    }
  };

  const fetchFollowers = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/${id}/followers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setFollowers(response.data.followers);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách người theo dõi");
    }
  };

  const fetchFollowings = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/${id}/followings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setFollowings(response.data.followings);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách đang theo dõi");
    }
  };

  const handleDelete = async (type, id) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${id}?`
    );
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/v1/${type}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(`${type} deleted successfully`);
        console.log(response.data);
        // Refresh the list
        if (type === "post") {
          fetchPosts(userId);
        } else {
          fetchQuestions(userId);
        }
      } catch (error) {
        console.log(error);
        toast.error(`Error deleting ${type}`);
      }
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "post") {
      fetchPosts(userId);
    } else if (tab === "question") {
      fetchQuestions(userId);
    } else if (tab === "follower") {
      fetchFollowers(userId);
    } else if (tab === "following") {
      fetchFollowings(userId);
    }
  };

  const getStats = () => {
    return {
      posts: posts.length,
      questions: questions.length,
      followers: followers.length,
      following: followings.length,
    };
  };

  const stats = getStats();

  return (
    <div className="w-full min-h-screen bg-[#F2F7FB] flex">
      <ToastContainer />
      {/* <SideBarUser /> */}
      <div className="w-1/6"></div>
      <div className="flex-1 p-8 ">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Manage Your Content
          </h1>
          <p className="text-gray-600">
            View and manage your posts, questions, and connections
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: "Posts", value: stats.posts, color: "blue" },
            { label: "Questions", value: stats.questions, color: "green" },
            { label: "Followers", value: stats.followers, color: "purple" },
            { label: "Following", value: stats.following, color: "pink" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className={`bg-white rounded-xl shadow-sm p-6 border-l-4 border-${color}-500`}
            >
              <p className="text-gray-500 text-sm mb-1">{label}</p>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8 ">
          <div className="flex border-b">
            {["post", "question", "follower", "following"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}s
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Posts Grid */}
              {activeTab === "post" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <div
                      key={post._id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <i className="fas fa-file-alt text-blue-600"></i>
                          </div>
                          <div className="ml-3">
                            <h3 className="font-semibold text-gray-800">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.content}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <i className="far fa-heart mr-1"></i>
                              {post.likes?.length || 0}
                            </span>
                            <span className="flex items-center">
                              <i className="far fa-comment mr-1"></i>
                              {post.comments?.length || 0}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Link
                              to={`/post/edit/${post._id}`}
                              className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete("post", post._id)}
                              className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Questions Grid - Similar structure */}
              {activeTab === "question" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {questions.map((question) => (
                    <div
                      key={question._id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <i className="fas fa-question text-green-600"></i>
                          </div>
                          <div className="ml-3">
                            <h3 className="font-semibold text-gray-800">
                              {question.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {new Date(
                                question.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {question.content}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <i className="far fa-thumbs-up mr-1"></i>
                              {question.likes?.length || 0}
                            </span>
                            <span className="flex items-center">
                              <i className="far fa-comment mr-1"></i>
                              {question.comments?.length || 0}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Link
                              to={`/question/edit/${question._id}`}
                              className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete("question", question._id)
                              }
                              className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "follower" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {followers.map((follower) => (
                    <div
                      key={follower._id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-center">
                          <img
                            src={follower.avatar}
                            alt={follower.firstname}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <h3 className="font-semibold text-gray-800">
                              {follower.firstname} {follower.lastname}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {follower.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "following" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {followings.map((following) => (
                    <div
                      key={following._id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-center">
                          <img
                            src={following.avatar}
                            alt={following.firstname}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <h3 className="font-semibold text-gray-800">
                              {following.firstname} {following.lastname}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {following.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="w-1/6"></div>
      {/* <SideBarRight /> */}
    </div>
  );
};

export default UserManage;
