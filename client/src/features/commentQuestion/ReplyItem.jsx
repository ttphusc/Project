import React, { useState, useEffect } from "react";
import UserInfomation from "../../components/userInformation/UserInfomation";
import UserAvatar from "../../components/userInformation/UserAvatar";
import ReplyInput from "./ReplyInput";
import { formatTimeCreate } from "../../helps/dateformat";
import axios from "axios";

const ReplyItem = ({
  _id,
  user,
  comment,
  dateCreate,
  replies: initialReplies,
  qid,
  accessToken,
  addReply,
  postedBy,
  cid,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [author, setAuthor] = useState([]);

  const handleReplyClick = () => setShowReplyInput(!showReplyInput);

  // const addNestedReply = (newReply) => {
  //   // setReplies((prevReplies) => [...prevReplies, newReply]);
  //   setReplies(newReply);
  // };
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
    <div className="pl-8">
      <div className="text-lg pl-4">
        <div className="flex items-center space-x-4 pt-5">
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
            qid={pid}
            accessToken={accessToken}
            addReply={addReply}
            changeInput={changeInput}
            cid={cid}
          />
        )}
      </div>
    </div>
  );
};

export default ReplyItem;
