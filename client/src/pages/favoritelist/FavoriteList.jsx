import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import SideBarReturn from "../../layout/sidebar/SideBarReturn";
import SideBarRight from "../../layout/sidebar/SideBarRight";
import QuestionCard from "../../components/card/QuestionCard";
import PostCard from "../../components/card/PostCard";

const FavoriteList = () => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'questions', 'posts'

  const fetchFavoriteList = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please login to view favorite list");
        return;
      }

      const user = localStorage.getItem("user");
      const favoriteListId = JSON.parse(user).idFavoriteList;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/favoritelist/${favoriteListId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setFavoriteItems(response.data.rs.sortedItems);
      }
    } catch (error) {
      console.error("Error fetching favorite list:", error);
      toast.error("Cannot load favorite list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteList();
  }, []);

  const filteredItems = favoriteItems.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "questions") return item.type === "question";
    if (activeTab === "posts") return item.type === "post";
    return true;
  });

  const getItemCounts = () => {
    const questions = favoriteItems.filter(
      (item) => item.type === "question"
    ).length;
    const posts = favoriteItems.filter((item) => item.type === "post").length;
    return { questions, posts, total: favoriteItems.length };
  };

  const counts = getItemCounts();

  return (
    <div className="w-full min-h-screen bg-[#F2F7FB] flex flex-row justify-between ">
      <div className="w-1/6">
        <SideBarReturn />
      </div>
      <div className="flex-1 p-6 w-4/6 mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 ">
            My Favorites
          </h1>
          <p className="text-gray-600 mb-4">
            Manage your favorite questions and posts in one place
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {counts.total}
              </div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {counts.questions}
              </div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {counts.posts}
              </div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors
                ${
                  activeTab === "all"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
              All ({counts.total})
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors
                ${
                  activeTab === "questions"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Questions ({counts.questions})
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors
                ${
                  activeTab === "posts"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Posts ({counts.posts})
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-full border-b-2 border-blue-600"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-500 text-lg mb-2">
              No favorite items found
            </div>
            <p className="text-gray-400">Items you favorite will appear here</p>
          </div>
        ) : (
          <div className="space-y-4 ">
            {filteredItems.map((item) => (
              <div key={item._id}>
                {item.type === "question" ? (
                  <QuestionCard
                    question={item}
                    onFavoriteChange={fetchFavoriteList}
                  />
                ) : (
                  <PostCard post={item} onFavoriteChange={fetchFavoriteList} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col w-1/6">
        <SideBarRight />
      </div>
    </div>
  );
};

export default FavoriteList;
