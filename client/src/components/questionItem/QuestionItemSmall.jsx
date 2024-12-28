// QuestionItemSmall.js
import React, { useState, useEffect } from "react";
import { formatTimeCreate } from "../../helps/dateformat";
import countCommentsAndReplies from "../../helps/countCommentsAndReplies";
import axios from "axios";
import { Link } from "react-router-dom";

const QuestionItemSmall = ({
  _id,
  title,
  tags,
  comments,
  views,
  idAuthor,
  createdAt,
}) => {
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
      <div className="w-full h-[220px] bg-[#F2F7FB] rounded-[30px] border-[3px] border-[#6374AE] p-6 mb-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center">
            <img
              src={
                author?.avatar ||
                "https://cellphones.com.vn/sforum/wp-content/uploads/2023/11/avatar-dep-60.jpg"
              }
              alt="Author"
              className="w-[52px] h-[52px] border-[3px] border-[#9CB6DD] rounded-xl object-cover"
            />
            <div className="ml-4">
              <h1 className="text-[#6374AE] font-wixmadefor font-semibold text-lg mb-1">
                {author?.firstname || "Unknown Author"}
              </h1>
              <p className="text-[#839DD1] font-wixmadefor text-sm">
                {createdAt ? formatTimeCreate(createdAt) : "about ? hours ago"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-[#6374AE] text-white font-wixmadefor text-sm rounded-lg"
              >
                {tag || "none"}
              </div>
            ))}
          </div>
        </div>

        <h1 className="text-2xl text-[#262C40] font-bold font-wixmadefor mb-5 line-clamp-2">
          {title
            ? truncateText(title, 80)
            : "Wholesome Eats: Nutritious Recipes to Keep You Energized and..."}
        </h1>

        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="transition-transform group-hover:scale-110 text-[#6374AE]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4.5C7.5 4.5 3.5 8.5 2 12c1.5 3.5 5.5 7.5 10 7.5s8.5-4 10-7.5c-1.5-3.5-5.5-7.5-10-7.5zm0 12c-2.5 0-4.5-2-4.5-4.5S9.5 8.5 12 8.5 16.5 10.5 16.5 12 14.5 16.5 12 16.5zm0-7.5c-1.5 0-2.5 1-2.5 2.5S10.5 14 12 14s2.5-1 2.5-2.5S13.5 9 12 9z"
                fill="currentColor"
              />
            </svg>
            <span className="ml-2 font-wixmadefor font-medium text-[#262C40]">
              {views}
            </span>
          </div>

          <div className="flex items-center">
            <svg
              width="22"
              height="22"
              viewBox="0 0 26 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 8.25H18M8 13.25H15.5M20.5 2C21.4946 2 22.4484 2.39509 23.1517 3.09835C23.8549 3.80161 24.25 4.75544 24.25 5.75V15.75C24.25 16.7446 23.8549 17.6984 23.1517 18.4017C22.4484 19.1049 21.4946 19.5 20.5 19.5H14.25L8 23.25V19.5H5.5C4.50544 19.5 3.55161 19.1049 2.84835 18.4017C2.14509 17.6984 1.75 16.7446 1.75 15.75V5.75C1.75 4.75544 2.14509 3.80161 2.84835 3.09835C3.55161 2.39509 4.50544 2 5.5 2H20.5Z"
                stroke="#262C40"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-2 font-wixmadefor font-medium text-[#262C40]">
              {countCommentsAndReplies(comments)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default QuestionItemSmall;
