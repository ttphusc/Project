import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import UserAvatar from "../../components/userInformation/UserAvatar";
import UserInfomation from "../../components/userInformation/UserInfomation";
import CommentItem from "../../features/comment/CommentItem";
import { formatTimeCreate } from "../../helps/dateformat";
import TableOfContents from "../../components/tableOfContent/TableOfContent";
import CommentInput from "../../features/comment/CommentInput";
import ViewAndComment from "../../features/favorite/ViewAndComment";
import LikeDislikeFavorite from "../../features/favorite/LikeAndDislike";
import { AuthContext } from "../../context/AuthContext";

const PostDetail = () => {
  const { pid } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState([]);
  const [comments, setComments] = useState([]);
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/post/${pid}`
        );
        console.log("Fetched post response:", response);
        setPost(response.data.rs);
        console.log("Fetched comments:", response.data.comments);
        setComments(
          Array.isArray(response.data.rs.comments)
            ? response.data.rs.comments
            : []
        );
        setIsLoading(false);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const addComment = (newComments) => {
    // setComments([]);
    setComments(newComments);
  };

  // Fetch user data based on post data
  useEffect(() => {
    const fetchUser = async () => {
      if (post?.idAuthor) {
        console.log("Fetching user data for idAuthor:", post.idAuthor);
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/user/${post?.idAuthor}`
          );
          console.log("User fetch response:", response);
          if (response.data.success) {
            setUser(response.data.rs);
          } else {
            console.error("Failed to fetch user:", response.data);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };

    if (post) {
      fetchUser();
    }
  }, [post]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w[120rem] mx-auto p-4 pt-24">
      {post && (
        <div className="flex">
          {/* Table of Contents bên trái */}
          <div className="w-1/6 pt-25 sticky space-y-8 pl-10">
            <LikeDislikeFavorite
              likes={post.likes}
              dislikes={post.dislikes}
              pid={id}
            />
          </div>
          {/* Nội dung chính */}
          <div className="w-3/4 pr-4">
            <div className="flex items-center mb-4">
              <div className="flex items-center space-x-4">
                <UserAvatar src={user.avatar} />
                <UserInfomation
                  name={user.firstname}
                  timecreate={formatTimeCreate(post.createdAt)}
                />
                <ViewAndComment
                  views={post.views}
                  comments={post.comments}
                  addComment={addComment}
                />
              </div>
            </div>
            <h3 className="text-lg border p-4 font-semibold mb-1">
              {post.title}
            </h3>
            <div className="border border-gray-300 p-4 mb-4 rounded">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
            <div className="flex space-x-2 my-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-700 px-2 py-1 text-sm rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="pb-5">
              <h1 className="py-2 font-bold text-lg">Comment</h1>
              <CommentInput
                id={id}
                accessToken={accessToken}
                addComment={addComment}
              />
            </div>

            <div className="space-y-4">
              {Array.isArray(comments) &&
                comments?.map((comment, index) => (
                  <CommentItem
                    key={index}
                    user={user}
                    _id={comment._id}
                    pid={id}
                    postedBy={comment.postedBy}
                    comment={comment.comment}
                    replies={comment.replies}
                    dateCreate={formatTimeCreate(comment.dateCreate)}
                  />
                ))}
            </div>
          </div>
          {/* Table of Contents bên phải */}
          <div className="w-1/4">
            <TableOfContents htmlContent={post.content} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
