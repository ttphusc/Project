import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import countCommentsAndReplies from "../../helps/countCommentsAndReplies";
import ReportQuestionInput from "../../components/report/ReportQuestionInput";
import ReportQuestion from "../../components/report/ReportQuestion";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ReportIcon from "@mui/icons-material/Report";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const LikeAndDislikeNew = ({ question }) => {
  const [like, setLike] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReportInput, setShowReportInput] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (question) {
      const likeCount = Array.isArray(question.likes)
        ? question.likes.length
        : 0;
      setLike(likeCount);

      const userId = localStorage.getItem("userId");
      const storedIsLiked = localStorage.getItem(`liked_${question._id}`);
      if (storedIsLiked !== null) {
        setIsLiked(storedIsLiked === "true");
      } else if (userId) {
        const userLiked =
          Array.isArray(question.likes) && question.likes.includes(userId);
        setIsLiked(userLiked);
      }

      const storedIsFavorite = localStorage.getItem(`favorite_${question._id}`);
      setIsFavorite(storedIsFavorite === "true");
    }
  }, [question]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Vui lòng đăng nhập để thích câu hỏi");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/question/like/${question._id}`,
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

      localStorage.setItem(`liked_${question._id}`, userLiked);

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

      console.log("Question ID:", question._id);

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/favoritelist/question/${
          question._id
        }`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setIsFavorite(response.data.isFavorited);
        localStorage.setItem(
          `favorite_${question._id}`,
          response.data.isFavorited
        );

        toast.success(
          response.data.isFavorited
            ? "Đã thêm vào danh sách yêu thích"
            : "Đã xóa khỏi danh sách yêu thích"
        );
      }
    } catch (error) {
      console.log("Error details:", error.response);
      toast.error("Không thể cập nhật danh sách yêu thích");
      console.error("Cập nhật danh sách yêu thích thất bại:", error);
    }
  };

  const handleReportClick = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để báo cáo câu hỏi");
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            backgroundColor: isLiked ? "#6374AE" : "#FFFFFF",
            color: isLiked ? "#FFFFFF" : "#6374AE",
            borderColor: "#6374AE",
            borderWidth: 2,
          }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden h-[70px] rounded-2xl font-bold text-xl"
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={false}
            animate={{
              y: isLiked ? 0 : "100%",
              opacity: isLiked ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <FavoriteIcon className="w-6 h-6 mr-2" />
            <span>Loved it!</span>
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={false}
            animate={{
              y: isLiked ? "-100%" : 0,
              opacity: isLiked ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <FavoriteBorderIcon className="w-6 h-6 mr-2" />
            <span>Love this!</span>
          </motion.div>
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
          <span>Add to favorite</span>
        </motion.button>

        {/* Report Button */}
        <motion.button
          onClick={handleReportClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="h-[70px] rounded-2xl font-bold text-xl bg-white text-[#6374AE] border-2 border-[#6374AE] 
            hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3"
        >
          <ReportIcon className="w-6 h-6" />
          <span>Report</span>
        </motion.button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-8">
        {/* Likes Count */}
        <div className="flex items-center gap-3">
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
          <span className="text-xl font-medium text-gray-700">{like}</span>
        </div>

        {/* Comments Count */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gray-50">
            <ChatBubbleOutlineIcon className="w-6 h-6 text-gray-500" />
          </div>
          <span className="text-xl font-medium text-gray-700">
            {countCommentsAndReplies(question.comments)}
          </span>
        </div>
      </div>

      {/* Report Modals */}
      <AnimatePresence>
        {showReportInput && (
          <ReportQuestionInput
            onClose={() => setShowReportInput(false)}
            onSelectReason={handleSelectReason}
          />
        )}
        {showReport && (
          <ReportQuestion
            reason={reportReason}
            onClose={() => setShowReport(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LikeAndDislikeNew;
