import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

const CommentInputPost = ({ post, addComment }) => {
  const [comment, setComment] = useState("");
  useEffect(() => {}, [post]);
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/post/comment/${post._id}`,
        {
          comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      console.log(response.data.rs);
      setComment("");
      addComment(response.data.rs.comments);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="w-full h-[200px] bg-[#FAF8F6] border-[3px] border-[#9CB6DD] rounded-[15px] flex flex-row">
      <div className="w-2/3 h-full p-5">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="p-5 h-[120px] w-full resize-none text-[#9CB6DD] text-xl font-wixmadefor font-medium bg-[#FAF8F6] focus:outline-none"
          placeholder="Leave a comment..."
        ></textarea>
      </div>
      <div className="w-1/3 h-full items-end  pr-5 pb-5 flex justify-end">
        <button
          onClick={handleUpdate}
          className="w-[300px] h-[70px] bg-[#6374AE] rounded-[15px] items-center justify-center flex text-[#F2F7FB] text-2xl font-bold"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CommentInputPost;
