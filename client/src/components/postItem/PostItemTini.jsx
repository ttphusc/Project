import React, { useState, useEffect } from "react";
import { formatTimeCreate } from "../../helps/dateformat";
import axios from "axios";
import { Link } from "react-router-dom";
const PostItemTini = ({ _id, title, idAuthor, createdAt }) => {
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!idAuthor) {
        console.error("postedBy is undefined or null");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/user/${idAuthor}`
        );
        if (response.data.success) {
          setAuthor(response.data.rs);
        } else {
          console.error("Failed to fetch author:", response.data);
        }
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };

    fetchAuthor();
  }, [idAuthor]);

  return (
    <Link to={`/post/postdetail/${_id}`}>
      <div className="cursor-pointer hover:bg-gray-50">
        <div className="px-6 py-3">
          <div className="flex items-center gap-2">
            <h1 className="font-wixmadefor text-[#6374AE] font-semibold text-base">
              {author?.firstname || "Unknown Author"}
            </h1>
            <span className="text-gray-400">•</span>
            <h3 className="font-wixmadefor text-gray-400 text-sm">
              {createdAt ? formatTimeCreate(createdAt) : "about ? hours ago"}
            </h3>
          </div>
          <p className="font-wixmadefor text-[#262C40] font-medium text-base pt-1">
            {title
              ? truncateText(title, 80)
              : "Wholesome Eats: Nutritious Recipes to Keep You Energized and..."}
          </p>
          <hr className="mt-3 border-gray-200" />
        </div>
      </div>
    </Link>
  );
};

export default PostItemTini;
