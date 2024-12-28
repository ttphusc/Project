import React, { useEffect, useState } from "react";
import { FaHeart, FaEye, FaComment } from "react-icons/fa";
import { Link } from "react-router-dom";
import UserAvatar from "../userInformation/UserAvatar";
import UserInfomation from "../userInformation/UserInfomation";
import Tags from "../tags/Tags";
import axios from "axios";
import { formatTimeCreate } from "../../helps/dateformat";
import countCommentsAndReplies from "../../helps/countCommentsAndReplies";

const PostItem = ({
  id,
  title,
  content,
  tags,
  comments,
  views,
  likes,
  dislikes,
  idAuthor,
  createdAt,
}) => {
  const [user, setUser] = useState([]);
  // Function to truncate text
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };
  const likeCount = Array.isArray(likes) ? likes.length : 0;
  const dislikeCount = Array.isArray(dislikes) ? dislikes.length : 0;
  const total = likeCount - dislikeCount;

  useEffect(() => {
    const fetchUser = async () => {
      if (!idAuthor) {
        console.error("postedBy is undefined or null");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/user/${idAuthor}`
        );
        if (response.data.success) {
          setUser(response.data.rs);
        } else {
          console.error("Failed to fetch user:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [idAuthor]);

  return (
    <Link to={`/posts/${id}`}>
      <div className="p-1 border-b border-gray-300">
        <div className="flex items-start bg-white w-[70rem] p-5 space-x-4 ">
          <UserAvatar src="https://st.quantrimang.com/photos/image/2021/02/04/Hinh-nen-Quoc-Ky-VN-6.jpg" />
          <div className="flex-1">
            <UserInfomation
              name={user.firstname}
              timecreate={formatTimeCreate(createdAt)}
            />

            {/* Post Title (Truncated) */}
            <h2 className="text-sm text-gray-800">
              {truncateText(title, 50)} {/* Adjust maxLength as needed */}
            </h2>

            {/* Post Content (Truncated) */}
            <p className="text-sm text-gray-600">
              {truncateText(content, 100)} {/* Adjust maxLength as needed */}
            </p>

            {/* Post Tags */}
            <Tags tags={tags} />

            {/* Interaction Icons */}
            <div className="flex space-x-4 mt-2 text-gray-500">
              <div className="flex items-center space-x-1">
                <FaHeart />
                <span className="text-sm">{total}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaEye />
                <span className="text-sm">{views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaComment />
                <span className="text-sm">
                  {countCommentsAndReplies(comments)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </Link>
  );
};

export default PostItem;
