import React, { useState, useEffect } from "react";
import countCommentsAndReplies from "../../helps/countCommentsAndReplies";
import { formatTimeCreate } from "../../helps/dateformat";
import axios from "axios";
import { Link } from "react-router-dom";

const PostItemLarge = ({ post }) => {
  console.log(post);
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const [author, setAuthor] = useState(null);
  const fetchAuthor = async () => {
    if (!post.idAuthor) {
      console.error("postedBy is undefined or null");
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/${post.idAuthor}`
      );
      if (response.data.success) {
        setAuthor(response.data.rs);
        console.log(author);
      } else {
        console.error("Failed to fetch author:", response.data);
      }
    } catch (error) {
      console.error("Error fetching author:", error);
    }
  };

  useEffect(() => {
    fetchAuthor();
  }, [post.idAuthor]);

  return (
    <div
      className="w-full bg-[#F2F7FB] rounded-[30px] border-2 border-[#6374AE] 
                    hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1
                    mb-8 last:mb-0"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between p-8 border-b border-[#E5EDF5]">
        <div className="flex items-center gap-4">
          <img
            src={
              author?.avatar ||
              "https://cellphones.com.vn/sforum/wp-content/uploads/2023/11/avatar-dep-60.jpg"
            }
            alt=""
            className="w-14 h-14 rounded-xl object-cover border-2 border-[#9CB6DD] 
                     hover:border-[#6374AE] transition-colors shadow-sm"
          />
          <div>
            <h1
              className="text-[#6374AE] font-wixmadefor font-semibold text-xl 
                         hover:text-[#4F5C89] transition-colors"
            >
              {author?.firstname || "Unknown Author"}
            </h1>
            <p className="text-[#839DD1] font-wixmadefor text-sm">
              {post.createdAt
                ? formatTimeCreate(post.createdAt)
                : "about ? hours ago"}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {post.tags.map((tag, index) => (
            <div
              key={index}
              className="px-4 py-2 bg-[#6374AE] text-white font-wixmadefor rounded-lg
                       text-sm font-medium hover:bg-[#4F5C89] transition-colors shadow-sm"
            >
              {tag || "none"}
            </div>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 space-y-4">
        <h1 className="text-2xl text-[#262C40] font-bold hover:text-[#6374AE] transition-colors">
          {post.title
            ? truncateText(post.title, 50)
            : "Wholesome Eats: Nutritious Recipes to Keep You Energized and..."}
        </h1>

        <div className="prose max-w-none">
          <p
            className="text-lg text-[#262C40]/80 line-clamp-4 leading-relaxed"
            {...(post.content
              ? {
                  dangerouslySetInnerHTML: {
                    __html: truncateText(post.content, 200),
                  },
                }
              : {
                  children:
                    "Wholesome Eats: Nutritious Recipes to Keep You Energized and...",
                })}
          ></p>
        </div>

        <Link
          to={`/post/postdetail/${post._id}`}
          className="inline-flex items-center gap-2 text-[#6374AE] hover:text-[#4F5C89] 
                       font-medium transition-colors group"
        >
          Read the whole post
          <span className="transform transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      {/* Footer Section */}
      <div className="px-8 py-4 border-t border-[#E5EDF5] flex items-center gap-6">
        <div className="flex items-center gap-2 text-[#262C40] group">
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
          <span className="font-medium group-hover:text-[#6374AE]">
            {post.views}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[#262C40] group">
          <svg
            width="24"
            height="24"
            viewBox="0 0 26 25"
            fill="none"
            className="transition-transform group-hover:scale-110 text-[#6374AE]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 8.25H18M8 13.25H15.5M20.5 2C21.4946 2 22.4484 2.39509 23.1517 3.09835C23.8549 3.80161 24.25 4.75544 24.25 5.75V15.75C24.25 16.7446 23.8549 17.6984 23.1517 18.4017C22.4484 19.1049 21.4946 19.5 20.5 19.5H14.25L8 23.25V19.5H5.5C4.50544 19.5 3.55161 19.1049 2.84835 18.4017C2.14509 17.6984 1.75 16.7446 1.75 15.75V5.75C1.75 4.75544 2.14509 3.80161 2.84835 3.09835C3.55161 2.39509 4.50544 2 5.5 2H20.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-medium group-hover:text-[#6374AE]">
            {countCommentsAndReplies(post.comments)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostItemLarge;
