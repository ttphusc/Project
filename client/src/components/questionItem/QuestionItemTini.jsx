import React, { useState, useEffect } from "react";
import { formatTimeCreate } from "../../helps/dateformat";
import axios from "axios";
import { Link } from "react-router-dom";

const QuestionItemTini = ({ _id, title, idAuthor, createdAt }) => {
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
    <Link to={`/question/questiondetail/${_id}`}>
      <div className="px-10 pb-3 group hover:bg-white transition-all duration-300">
        <div className="flex items-center gap-3 mb-2">
          <img
            src={author?.avatar || "/default-avatar.png"}
            alt={author?.firstname || "User"}
            className="w-8 h-8 rounded-full object-cover border-2 border-[#9CB6DD]"
          />
          <div>
            <h1 className="font-wixmadefor text-[#6374AE] font-bold text-lg group-hover:text-[#4F5C89]">
              {author?.firstname || "Unknown Author"}
            </h1>
            <h3 className="font-wixmadefor text-[#839DD1] text-sm">
              {createdAt ? formatTimeCreate(createdAt) : "about ? hours ago"}
            </h3>
          </div>
        </div>

        <p
          className="font-wixmadefor text-lg text-[#262C40] font-medium pb-3 
                    group-hover:text-[#6374AE] transition-colors"
        >
          {title
            ? truncateText(title, 30)
            : "Wholesome Eats: Nutritious Recipes to Keep You Energized and..."}
        </p>

        <hr
          className="bg-[#D3E2F2] rounded-[5px] h-[2px] w-full 
                     group-hover:bg-[#9CB6DD] transition-colors"
        />
      </div>
    </Link>
  );
};

export default QuestionItemTini;
