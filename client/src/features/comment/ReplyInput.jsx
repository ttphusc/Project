import React, { useState, useRef, useContext } from "react";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";

const ReplyInput = ({ pid, accessToken, addReply, cid, changeInput }) => {
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
      console.log(cid);
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/post/comment/${pid}/reply/${cid}`,
        { comment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Reply added:", response.data);

      // Assuming the response structure includes the whole post
      if (response.data && response.data.post && response.data.post.comments) {
        // Find the comment by cid to get the updated replies array
        const updatedComment = response.data.post.comments.find(
          (comment) => comment._id === cid
        );
        if (updatedComment && updatedComment.replies) {
          addReply(updatedComment.replies); // Update the replies in the state
          setComment(""); // Clear input after successful submission
          changeInput(false);
        } else {
          console.error("No updated replies found in the response");
        }
      } else {
        console.error("No reply data returned from API");
      }
    } catch (error) {
      console.error("Failed to submit reply:", error);
      console.error("Request config:", error.config);
      console.error("Response data:", error.response?.data);
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
      />
      <button
        onClick={handleComment}
        className="text-gray-600 hover:text-gray-800 w-10 h-10 p-2 ml-2"
      >
        <FaPaperPlane className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ReplyInput;
