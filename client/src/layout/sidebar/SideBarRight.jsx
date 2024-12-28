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
          // Lấy 3 bài viết mới nhất
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
    <div className="w-full bg-[#F2F7FB] py-5 ">
      <div className="px-10">
        <h1
          className="text-3xl font-wixmadefor text-[#6374AE] font-bold relative
          after:content-[''] after:absolute after:bottom-[-8px] after:left-0 
          after:w-16 after:h-1 after:bg-[#6374AE] after:rounded-full"
        >
          Related <br /> posts
        </h1>
      </div>

      <div className="px-10 py-5">
        <hr className="w-full h-[3px] bg-[#9CB6DD] rounded-[5px] transition-all duration-300 hover:bg-[#6374AE]" />
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post._id}
            className="hover:translate-x-2 transition-transform duration-300"
          >
            <PostItemTini
              _id={post._id}
              title={post.title}
              idAuthor={post.idAuthor}
              createdAt={post.createdAt}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBarRightPost;
