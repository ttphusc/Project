import React, { useState, useEffect } from "react";
import axios from "axios";
import countCommentsAndReplies from "../../helps/countCommentsAndReplies";
import ReportPostInput from "../../components/report/ReportPostInput";
import ReportPost from "../../components/report/ReportPost";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ReportIcon from "@mui/icons-material/Report";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

const LikeAndDislikePost = ({ post }) => {
  const [like, setLike] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReportInput, setShowReportInput] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (post) {
      const likeCount = Array.isArray(post.likes) ? post.likes.length : 0;
      setLike(likeCount);

      const userId = localStorage.getItem("userId");
      const storedIsLiked = localStorage.getItem(`liked_${post._id}`);
      if (storedIsLiked !== null) {
        setIsLiked(storedIsLiked === "true");
      } else if (userId) {
        const userLiked =
          Array.isArray(post.likes) && post.likes.includes(userId);
        setIsLiked(userLiked);
      }

      const storedIsFavorite = localStorage.getItem(`favorite_${post._id}`);
      setIsFavorite(storedIsFavorite === "true");
    }
  }, [post]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Vui lòng đăng nhập để thích bài viết");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/post/like/${post._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedLikeCount = response.data.rs.likes.length;
      setLike(updatedLikeCount);

      const userId = localStorage.getItem("userId");
      const userLiked = response.data.rs.likes.includes(userId);
      setIsLiked(!isLiked);

      localStorage.setItem(`liked_${post._id}`, userLiked);

      toast.success(
        userLiked ? "Đã thêm vào mục yêu thích!" : "Đã xóa khỏi mục yêu thích"
      );
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái thích");
      console.error("Cập nhật thất bại:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToFavorite = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/favoritelist/post/${post._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setIsFavorite(response.data.isFavorited);
        localStorage.setItem(`favorite_${post._id}`, response.data.isFavorited);

        toast.success(
          response.data.isFavorited
            ? "Đã thêm vào danh sách yêu thích"
            : "Đã xóa khỏi danh sách yêu thích"
        );
      }
      console.log(response.data);
    } catch (error) {
      toast.error("Không thể cập nhật danh sách yêu thích");
      console.error("Cập nhật danh sách yêu thích thất bại:", error);
    }
  };

  const handleReportClick = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Vui lòng đang nhập để báo cáo bài viết");
      return;
    }
    setShowReportInput(true);
  };

  const handleSelectReason = (reason) => {
    setReportReason(reason);
    setShowReportInput(false);
    setShowReport(true);
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-6">
        {/* Like Button */}
        <motion.button
          onClick={handleUpdate}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative overflow-hidden group h-[70px] rounded-2xl font-bold text-xl transition-all duration-300
            ${
              isLiked
                ? "bg-gradient-to-r from-[#6374AE] to-[#8693d0] text-white shadow-lg"
                : "bg-white text-[#6374AE] border-2 border-[#6374AE] hover:shadow-md"
            }`}
        >
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <>
                <motion.div
                  animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {isLiked ? (
                    <FavoriteIcon className="w-6 h-6" />
                  ) : (
                    <FavoriteBorderIcon className="w-6 h-6" />
                  )}
                </motion.div>
                <span>Love this!</span>
              </>
            )}
          </div>
          <div
            className={`absolute inset-0 transition-transform duration-300 
              bg-gradient-to-r from-[#4A5578] to-[#6374AE]
              opacity-0 group-hover:opacity-100
              transform translate-y-full group-hover:translate-y-0`}
          />
        </motion.button>

        {/* Add to Favorite Button */}
        <motion.button
          onClick={handleAddToFavorite}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`h-[70px] rounded-2xl font-bold text-xl transition-all duration-300 flex items-center justify-center gap-3
            ${
              isFavorite
                ? "bg-[#6374AE] text-white"
                : "bg-white text-[#6374AE] border-2 border-[#6374AE]"
            }`}
        >
          {isFavorite ? (
            <BookmarkIcon className="w-6 h-6" />
          ) : (
            <BookmarkBorderIcon className="w-6 h-6" />
          )}
          <span>Add to Favorite</span>
        </motion.button>

        {/* Report Button */}
        <motion.button
          onClick={handleReportClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="h-[70px] rounded-2xl font-bold text-xl bg-white text-[#6374AE] border-2 border-[#6374AE] 
            hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-md"
        >
          <ReportIcon className="w-6 h-6" />
          <span>Report</span>
        </motion.button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-8 px-2">
        {/* Likes Count */}
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
        >
          <div
            className={`p-2 rounded-full transition-colors duration-300
            ${isLiked ? "bg-pink-50" : "bg-gray-50"}`}
          >
            {isLiked ? (
              <FavoriteIcon className="w-6 h-6 text-pink-500" />
            ) : (
              <FavoriteBorderIcon className="w-6 h-6 text-gray-500" />
            )}
          </div>
          <motion.span
            className="text-xl font-medium text-gray-700"
            key={like}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {like}
          </motion.span>
        </motion.div>

        {/* Comments Count */}
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
        >
          <div className="p-2 rounded-full bg-gray-50">
            <ChatBubbleOutlineIcon className="w-6 h-6 text-gray-500" />
          </div>
          <span className="text-xl font-medium text-gray-700">
            {countCommentsAndReplies(post.comments)}
          </span>
        </motion.div>
      </div>

      {/* Report Modals */}
      <AnimatePresence>
        {showReportInput && (
          <ReportPostInput
            onClose={() => setShowReportInput(false)}
            onSelectReason={handleSelectReason}
          />
        )}
        {showReport && (
          <ReportPost
            reason={reportReason}
            onClose={() => setShowReport(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LikeAndDislikePost;
