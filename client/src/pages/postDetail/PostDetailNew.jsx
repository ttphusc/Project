import SideBarRight from "../../layout/sidebar/SideBarRight";
import SideBarRightPost from "../../layout/sidebar/SideBarRightPost";
import SideBarReturn from "../../layout/sidebar/SideBarReturn";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import PostItemDetail from "../../components/postItem/PostItemDetail";

const PostDetailNew = () => {
  const { pid } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log(pid);
        console.log("test");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/post/${pid}`
        );
        console.log("Fetched post response:", response);
        setPost(response.data.rs);
        console.log(response.data.rs);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
        console.log(error.response);
      }
    };

    fetchPost();
  }, [pid]);

  return (
    <div className="w-full bg-[#F2F7FB] flex flex-row justify-between">
      <div className="w-1/6">
        <SideBarReturn />
      </div>
      <div className="w-4/6">
        <div className="w-full">
          {/* <NavBarNew /> */}
          <PostItemDetail post={post} />
        </div>
      </div>
      <div className="w-1/6">
        {/* <SideBarRightPost /> */}
        <SideBarRight />
      </div>
    </div>
  );
};

export default PostDetailNew;
