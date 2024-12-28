import React, { useContext, useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown, FaBookmark } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const LikeDislikeQuestion = ({ likes, dislikes, qid }) => {
  const { accessToken } = useContext(AuthContext);
  const [like, setLike] = useState(likes);
  const [dislike, setDislike] = useState(dislikes);
  const [total, setTotal] = useState(0);

  // Function to calculate total likes minus dislikes
  const calTotal = () => {
    const likeCount = Array.isArray(like) ? like.length : 0;
    const dislikeCount = Array.isArray(dislike) ? dislike.length : 0;
    setTotal(likeCount - dislikeCount);
  };

  // Calculate total whenever likes or dislikes change
  useEffect(() => {
    calTotal();
  }, [like, dislike]);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!like.includes(qid)) {
      try {
        const response = await axios.put(
          `http://localhost:5001/api/v1/question/like/${qid}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.data && response.data.rs) {
          setLike(response.data.rs.likes);
          setDislike(response.data.rs.dislikes);
          calTotal();
        } else {
          console.error("No like data returned from API");
        }
      } catch (error) {
        console.error("Failed to submit like:", error);
      }
    }
  };

  const handleDislike = async (e) => {
    e.preventDefault();
    if (!dislike.includes(qid)) {
      try {
        const response = await axios.put(
          `http://localhost:5001/api/v1/question/dislike/${qid}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(response);
        if (response.data && response.data.rs) {
          setLike(response.data.rs.likes);
          setDislike(response.data.rs.dislikes);
          calTotal();
        } else {
          console.error("No dislike data returned from API");
        }
      } catch (error) {
        console.error("Failed to submit dislike:", error.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center sticky top-16 space-y-1">
      <button
        className="p-1 text-gray-400 hover:text-blue-600"
        onClick={handleLike}
        disabled={like.includes(qid)}
      >
        <FaArrowUp size={60} />
      </button>
      <span className="text-2xl text-gray-400 font-semibold">{total}</span>
      <button
        className="p-1 text-gray-400 hover:text-red-600"
        onClick={handleDislike}
        disabled={dislike.includes(qid)}
      >
        <FaArrowDown size={60} />
      </button>
      <button className="p-1 mt-2 text-gray-400 hover:text-yellow-500">
        <FaBookmark size={60} />
      </button>
    </div>
  );
};

export default LikeDislikeQuestion;
