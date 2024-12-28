import React from "react";
import { FaEye, FaComment, FaBookmark } from "react-icons/fa"; // Change icons
import countCommentsAndReplies from "../../helps/countCommentsAndReplies";

const ViewAndComment = ({ views, comments }) => {
  return (
    <div className="flex items-center space-x-2">
      <FaEye size={20} className="text-gray-400" />
      <span className="text-sm text-gray-400 font-semibold">{views}</span>
      <FaComment size={20} className="text-gray-400" />
      <span className="text-sm text-gray-400 font-semibold">
        {countCommentsAndReplies(comments)}
      </span>
      <FaBookmark className="text-gray-400" size={20} />
    </div>
  );
};

export default ViewAndComment;
