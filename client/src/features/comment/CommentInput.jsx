import React, { useState, useRef, useContext } from "react";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";

const CommentInput = ({ id, accessToken, addComment }) => {
  const [comment, setComment] = useState("");
  const textareaRef = useRef(null);

  const handleInput = () => {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/post/comment/${id}`,
        { comment: comment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Comment added:", response.data);
      if (response.data && response.data.rs) {
        addComment(response.data.rs.comments);
        setComment("");
      } else {
        console.error("No comment data returned from API");
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  return (
    <div className="items-center flex border-gray-300 border p-4 rounded w-full">
      <textarea
        ref={textareaRef}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border border-gray-300 px-4 py-2 rounded resize-none h-14"
        placeholder="Write your response here..."
        rows="1"
        onInput={handleInput}
        style={{ height: "auto", overflow: "hidden" }}
      />
      <button
        onClick={handleComment} // Trigger comment submission
        className="text-gray-600 hover:text-gray-800 w-10 h-10 p-2 ml-2"
      >
        <FaPaperPlane className="w-6 h-6" />
      </button>
    </div>
  );
};

export default CommentInput;
