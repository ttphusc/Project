import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import axios from "axios";
import { toast } from "react-toastify";

const PostCard = ({ post, onFavoriteChange }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favoriteStatus = localStorage.getItem(`favorite_${post._id}`);
    setIsFavorite(favoriteStatus === "true");
  }, [post._id]);

  const handleFavorite = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please login to perform this action");
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
            ? "Added to favorites"
            : "Removed from favorites"
        );

        // Call the callback to refresh the list
        if (onFavoriteChange) {
          onFavoriteChange();
        }
      }
    } catch (error) {
      toast.error("Cannot update favorites");
      console.error("Error updating favorite:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow ">
      <div className="flex items-start space-x-4">
        {/* Avatar người đăng */}
        <div className="flex-shrink-0">
          <img
            src={post.idAuthor?.avatar || "/default-avatar.png"}
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
        </div>

        {/* Nội dung chính */}
        <div className="flex-1">
          {/* Tiêu đề và thông tin người đăng */}
          <Link
            to={`/post/postdetail/${post._id}`}
            className="text-lg font-semibold text-blue-600 hover:text-blue-800"
          >
            {post.title}
          </Link>

          <div className="flex items-center text-sm text-gray-500 mt-1">
            <span>{post.idAuthor?.email || "Ẩn danh"}</span>
            <span className="mx-2">•</span>
            <span>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: vi,
              })}
            </span>
          </div>

          {/* Nội dung rút gọn */}
          <p className="text-gray-600 mt-2 line-clamp-3">{post.content}</p>

          {/* Ảnh preview nếu có */}
          {post.images && post.images.length > 0 && (
            <div className="mt-3">
              <img
                src={post.images[0]}
                alt="Preview"
                className="rounded-lg max-h-48 object-cover"
              />
              {post.images.length > 1 && (
                <span className="text-sm text-gray-500 mt-1">
                  +{post.images.length - 1}
                </span>
              )}
            </div>
          )}

          {/* Thống kê tương tác */}
          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
            <div className="flex items-center">
              <i className="fas fa-thumbs-up mr-1"></i>
              <span>{post.likes?.length || 0}</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-thumbs-down mr-1"></i>
              <span>{post.dislikes?.length || 0}</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-comment mr-1"></i>
              <span>{post.comments?.length || 0} comments</span>
            </div>
          </div>
        </div>

        {/* Trạng thái và loại bài viết */}
        <div className="flex-shrink-0 flex flex-col gap-2">
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              post.state === "published"
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {post.state === "published" ? "Published" : "Draft"}
          </span>

          <span className="px-2 py-1 rounded-full text-sm bg-purple-100 text-purple-600">
            Post
          </span>

          {/* Add favorite button */}
          <button
            onClick={handleFavorite}
            className={`px-2 py-1 rounded-full text-sm ${
              isFavorite
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <i
              className={`fas fa-heart ${
                isFavorite ? "text-red-600" : "text-gray-600"
              }`}
            ></i>
            {isFavorite ? " Remove from favorites" : " Add to favorites"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
