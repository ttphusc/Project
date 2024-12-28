import React, { useEffect, useState } from "react";
import axios from "axios";
import PostItem from "../../components/postItem/PostItem";
import Pagination from "../../components/pagination/Pagination";
import NavBar from "../../layout/navBar/NavBar";
import { stripHtml } from "../../helps/stripHtml";
import { FaBell, FaComment, FaHeart } from "react-icons/fa";
import UserInfomation from "../../components/userInformation/UserInfomation";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/post?page=${currentPage}`
        );
        if (response.data.success) {
          setPosts(response.data.posts);
          setTotalPages(response.data.totalPages); // Update total pages for pagination
        } else {
          console.error("Failed to fetch posts:", response.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [currentPage]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [1]);
  return (
    <div className="pt-20">
      <NavBar />
      <div className="flex space-x-1 ">
        <div className="space-y-3 pl-48 pb-8">
          {posts.map((post) => (
            <PostItem
              key={post._id}
              id={post._id}
              title={post.title}
              content={stripHtml(post.content)}
              tags={post.tags}
              views={post.views}
              likes={post.likes}
              dislikes={post.dislikes}
              comments={post.comments}
              idAuthor={post.idAuthor}
              createdAt={post.createdAt}
            />
          ))}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage} // Update the current page when changed
          />
        </div>

        {/* Right Section (Questions) */}
        <div className="space-y-3">
          <div className="w-[28rem] h-screen bg-inherit">
            <div>
              <h1 className="font-bold text-green-600 text-lg border-b-2 border-gray-300 pb-1">
                NEWEST QUESTIONS
              </h1>
              <div className="flex items-start bg-white border-b border-gray-300 w-[25rem] p-4 space-x-4">
                <div className="flex-1">
                  <UserInfomation
                    name="Kathleen Brown"
                    timecreate="about 4 hours ago"
                  />
                  <h2 className="text-sm text-gray-800">
                    Ethical and Environmental Impacts of AI in the Energy
                    Sector...
                  </h2>

                  {/* Post Tags */}
                  <div className="flex space-x-2 my-2">
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 text-sm rounded">
                      Cooking
                    </span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 text-sm rounded">
                      Asia
                    </span>
                  </div>

                  {/* Interaction Icons */}
                  <div className="flex space-x-4 mt-2 text-gray-500">
                    <div className="flex items-center space-x-1">
                      <FaHeart />
                      <span className="text-sm">10</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaBell />
                      <span className="text-sm">2</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaComment />
                      <span className="text-sm">2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
