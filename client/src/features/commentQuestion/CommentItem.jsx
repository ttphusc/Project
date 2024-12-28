import React, { useState, useContext, useEffect } from "react";
import UserAvatar from "../../components/userInformation/UserAvatar";
import UserInfomation from "../../components/userInformation/UserInfomation";
import ReplyItem from "./ReplyItem";
import ReplyInput from "./ReplyInput";
import { formatTimeCreate } from "../../helps/dateformat";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const CommentItem = ({
  _id,
  pid,
  user,
  comment,
  dateCreate,
  postedBy,
  replies: initialReplies,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replies, setReplies] = useState(initialReplies);
  const [author, setAuthor] = useState([]);
  const { accessToken } = useContext(AuthContext);

  const handleReplyClick = () => setShowReplyInput(!showReplyInput);

  const addReply = (newReply) => {
    // setReplies((prevReplies) => [...prevReplies, newReply]);
    setReplies(newReply);
  };

  const changeInput = (newChange) => {
    setShowReplyInput(newChange);
  };

  useEffect(() => {
    const fetchAuthor = async () => {
      console.log("Fetching user data for idAuthor:", postedBy);
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/user/${postedBy}`
        );
        console.log("User fetch response:", response);
        if (response.data.success) {
          setAuthor(response.data.rs);
        } else {
          console.error("Failed to fetch user:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchAuthor();
  }, []);

  return (
    <div className="border bg-white max-w-7xl space-y-4 pb-8">
      <div className="text-lg">
        <div className="flex items-center space-x-4 pl-4 pt-5">
          <UserAvatar src={author.avatar} />
          <UserInfomation
            name={author.firstname}
            timecreate={formatTimeCreate(dateCreate)}
          />
        </div>
        <h3 className="text-lg pl-20 mb-1">{comment}</h3>
        <button onClick={handleReplyClick} className="ml-20 mt-2 text-blue-500">
          Reply
        </button>
        {showReplyInput && (
          <ReplyInput
            pid={pid}
            accessToken={accessToken}
            addReply={addReply}
            changeInput={changeInput}
            cid={_id}
          />
        )}
      </div>
      {replies.map((reply) => (
        <div key={reply._id}>
          <hr className="border-t border-gray-300 my-2" />
          <ReplyItem
            _id={reply._id}
            postedBy={reply.postedBy}
            pid={pid}
            user={user}
            comment={reply.comment}
            dateCreate={reply.dateCreate}
            replies={reply.replies}
            accessToken={accessToken}
            addReply={addReply}
            changeInput={changeInput}
            cid={_id}
          />
        </div>
      ))}
    </div>
  );
};

export default CommentItem;
