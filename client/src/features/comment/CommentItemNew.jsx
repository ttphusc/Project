import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatTimeCreate } from "../../helps/dateformat";
import { Link } from "react-router-dom";

const CommentItemNew = ({ comment }) => {
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!comment.postedBy) {
        console.error("postedBy is undefined or null");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/user/${comment.postedBy}`
        );
        if (response.data.success) {
          setAuthor(response.data.rs);
        }
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };

    fetchAuthor();
  }, [comment.postedBy]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Author Avatar */}
        <Link to={`/user/personalprofile/${author?._id}`}>
          <div className="relative group">
            <img
              src={
                author?.avatar ||
                "https://cellphones.com.vn/sforum/wp-content/uploads/2023/11/avatar-dep-60.jpg"
              }
              alt="avatar"
              className="w-12 h-12 rounded-full border-2 border-[#6374AE] object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
          </div>
        </Link>

        {/* Comment Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Link to={`/user/personalprofile/${author?._id}`}>
                <h3 className="text-[#6374AE] font-semibold text-lg hover:text-[#839DD1] transition-colors">
                  {author?.firstname || "Unknown Author"}
                </h3>
              </Link>
              <p className="text-sm text-gray-500">
                {comment.createdAt
                  ? formatTimeCreate(comment.createdAt)
                  : "about ? hours ago"}
              </p>
            </div>

            {/* Like Button */}
            <button className="flex items-center gap-2 text-gray-500 hover:text-[#6374AE] transition-colors group">
              <svg
                width="20"
                height="18"
                viewBox="0 0 28 25"
                fill="none"
                className="transition-transform group-hover:scale-110"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.8835 13.1589L13.9443 22.8156L4.00507 13.1589C3.34949 12.533 2.83309 11.7808 2.48841 10.9496C2.14372 10.1184 1.97821 9.22614 2.0023 8.32908C2.02638 7.43203 2.23955 6.54958 2.62836 5.73731C3.01718 4.92504 3.57322 4.20054 4.26148 3.60944C4.94974 3.01834 5.75531 2.57345 6.62745 2.30277C7.4996 2.03209 8.41942 1.94149 9.32901 2.03667C10.2386 2.13186 11.1182 2.41077 11.9126 2.85584C12.7069 3.30091 13.3986 3.9025 13.9443 4.62273C14.4923 3.90773 15.1849 3.3114 15.9787 2.87105C16.7724 2.4307 17.6503 2.15582 18.5573 2.06361C19.4644 1.9714 20.3811 2.06384 21.25 2.33515C22.119 2.60646 22.9215 3.0508 23.6073 3.64036C24.2931 4.22992 24.8476 4.95201 25.2358 5.76143C25.6241 6.57085 25.8379 7.45018 25.8638 8.34439C25.8898 9.2386 25.7273 10.1284 25.3865 10.9582C25.0458 11.788 24.5341 12.5398 23.8835 13.1667"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-medium">12.3K</span>
            </button>
          </div>

          {/* Comment Text */}
          <div className="text-gray-700 text-base leading-relaxed">
            {comment.comment}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItemNew;
