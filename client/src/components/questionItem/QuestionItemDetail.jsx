import React, { useState, useEffect } from "react";
import LikeAndDislikeNew from "../../features/favorite/LikeAndDislikeNew";
import CommentInputNew from "../../features/comment/CommentInputNew";
import CommentItemNew from "../../features/comment/CommentItemNew";
import { formatTimeCreate } from "../../helps/dateformat";
import axios from "axios";
import { Link } from "react-router-dom";

const QuestionItemDetail = ({ question }) => {
  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-full border-t-2 border-b-2 border-[#6374AE]"></div>
      </div>
    );
  }

  const [comments, setComments] = useState(question.comments || []);
  const [author, setAuthor] = useState(null);

  const addComment = (newComments) => {
    setComments(newComments);
  };

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!question.idAuthor) {
        console.error("postedBy is undefined or null");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/user/${question.idAuthor}`
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
  }, [question.idAuthor]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [1]);
  useEffect(() => {
    setComments(question.comments || []);
  }, [question.comments]);
  return (
    <div className="px-4 py-8 w-full">
      <div className="flex items-center justify-between mb-8">
        <Link to={`/user/personalprofile/${author?._id}`}>
          <div className="flex items-center group hover:bg-gray-50 p-3 rounded-xl transition-all">
            <img
              src={
                author?.avatar ||
                "https://cellphones.com.vn/sforum/wp-content/uploads/2023/11/avatar-dep-60.jpg"
              }
              alt=""
              className="w-full h-16 rounded-full border-2 border-[#6374AE] object-cover transition-transform group-hover:scale-105"
            />
            <div className="ml-4">
              <h1 className="text-[#6374AE] font-semibold text-xl group-hover:text-[#839DD1] transition-colors">
                {author?.firstname || "Unknown Author"}
              </h1>
              <p className="text-gray-500 text-sm">
                {question.createdAt
                  ? formatTimeCreate(question.createdAt)
                  : "about ? hours ago"}
              </p>
            </div>
          </div>
        </Link>

        <div className="flex gap-2">
          {question.tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-[#6374AE] text-white text-sm font-medium rounded-lg"
            >
              {tag || "none"}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
        <h1 className="text-3xl font-bold text-[#262C40] mb-6 w-full">
          {question.title}
        </h1>

        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: question.content }} />
        </div>
      </div>

      <div className="space-y-6">
        <LikeAndDislikeNew question={question} />
        <CommentInputNew question={question} addComment={addComment} />

        <div className="space-y-4">
          {Array.isArray(comments) && comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItemNew key={comment._id} comment={comment} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionItemDetail;
