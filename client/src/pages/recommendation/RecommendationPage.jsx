import React, { useState } from "react";
import axios from "axios";
import PostItemTini from "../../components/postItem/PostItemTini";
import { Skeleton } from "@mui/material";
import { FaRedo } from "react-icons/fa";
import { AiOutlineRobot } from "react-icons/ai";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
const RecommendationPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasRecommended, setHasRecommended] = useState(false);
  const token = localStorage.getItem("accessToken");

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/recommendation`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        if (response.data.recommendations.length === 0) {
          toast.info("No post to suggest");
        } else {
          setRecommendations(response.data.recommendations);
          setHasRecommended(true);
        }
      } else {
        // Hiển thị thông báo lỗi từ server
        toast.error(response.data.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      // Hiển thị thông báo lỗi từ exception
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F7FB] via-white to-[#EDF2F7] py-8 px-6">
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-100">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-1.5 h-16 bg-gradient-to-b from-blue-600 via-blue-500 to-blue-400 rounded-full"></div>
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-wixmadefor font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                  Recommended For You
                </h1>
                <p className="text-gray-500 text-lg">
                  Discover content perfectly matched to your interests
                </p>
              </div>
            </div>

            {!loading && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={fetchRecommendations}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#6374AE] via-[#7A8AC5] to-[#8E9BD8] 
                text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                border border-white/20 backdrop-blur-sm"
              >
                {hasRecommended ? (
                  <>
                    <FaRedo className="w-5 h-5 animate-spin-slow" />
                    <span className="font-medium text-lg">Recommend Again</span>
                  </>
                ) : (
                  <>
                    <AiOutlineRobot className="w-6 h-6" />
                    <span className="font-medium text-lg">
                      Get Recommendations
                    </span>
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Content Section */}
          {loading ? (
            <div className="space-y-6">
              {[1, 2].map((item) => (
                <div key={item} className="animate-pulse">
                  <Skeleton
                    variant="rectangular"
                    height={120}
                    className="rounded-2xl"
                    animation="wave"
                  />
                </div>
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 divide-y divide-gray-100"
            >
              {recommendations.map((rec, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  key={rec.post._id}
                  className="relative group pt-4 first:pt-0 hover:bg-gray-50/50 rounded-2xl"
                >
                  <div className="transform transition-all duration-300 group-hover:scale-[1.01]">
                    <PostItemTini {...rec.post} />
                  </div>
                  {/* <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <div className="bg-blue-50/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-blue-100">
                      <p className="text-sm font-semibold text-blue-600">
                        Match Score: {Math.round(rec.final_score * 100)}%
                      </p>
                    </div>
                  </div> */}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20 px-4"
            >
              <div className="text-gray-400 mb-8">
                <AiOutlineRobot className="mx-auto h-20 w-20 animate-bounce" />
              </div>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                {hasRecommended
                  ? "No Matches Found"
                  : "Ready for Recommendations?"}
              </h3>
              <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed">
                {hasRecommended
                  ? "Try updating your preferences or checking back later for new content."
                  : "Click the button above to get personalized post recommendations tailored just for you."}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RecommendationPage;
