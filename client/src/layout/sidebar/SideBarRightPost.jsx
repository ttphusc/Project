import React, { useEffect, useState } from "react";
import axios from "axios";
import PostItemTini from "../../components/postItem/PostItemTini";

const SideBarRightPost = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/post`
        );
        if (response.data.success) {
          const sortedPosts = response.data.posts.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          // Lấy 3 câu hỏi mới nhất
          const latestPosts = sortedPosts.slice(0, 3);
          setPosts(latestPosts);
          console.log(latestPosts);
        } else {
          console.error("Failed to fetch posts:", response.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setErrorMessage("Failed to load posts. Please try again later.");
      }
    };

    fetchPosts();
  }, []);
  return (
    <div className="w-[400px] bg-white  py-5 h-fit bg-[#F2F7FB] shadow-md">
      <div className="flex items-center justify-between px-6">
        <h1 className="text-2xl font-wixmadefor text-[#6374AE] font-bold">
          Related posts
        </h1>
      </div>
      <div className="px-6 py-3">
        <hr className="w-full h-[2px] bg-[#9CB6DD] rounded-[5px]" />
      </div>

      <div>
        {posts.map((post) => (
          <PostItemTini
            _id={post._id}
            title={post.title}
            idAuthor={post.idAuthor}
            createdAt={post.createdAt}
            key={post._id}
          />
        ))}
      </div>
    </div>
  );
};

export default SideBarRightPost;
