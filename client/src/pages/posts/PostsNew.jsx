import React, { useState, useEffect } from "react";
import PostItemSuperLarge from "../../components/postItem/PostItemSuperLarge";
import SideBarRight from "../../layout/sidebar/SideBarRight";
import SideBar from "../../layout/sidebar/SideBar";
import PostItemLarge from "../../components/postItem/PostItemLarge";
import Pagination from "../../components/pagination/Pagination"; // Import Pagination
import axios from "axios";
import NavBarNew from "../../layout/navBar/NavBarNew";
import LoadingSpinner from "../../components/loading/LoadingSpinner";

const PostsNew = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const [isLoading, setIsLoading] = useState(true); // Thêm state loading
  const [sortType, setSortType] = useState("newest");

  const handleSortChange = (newSortType) => {
    setSortType(newSortType);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi sắp xếp
    fetchPosts(1, newSortType);
  };
  const getSortLabel = (type) => {
    switch (type) {
      case "newest":
        return "Newest";
      case "oldest":
        return "Oldest";
      case "likiest":
        return "Most Liked";
      case "viewest":
        return "Most Viewed";
      default:
        return "";
    }
  };

  const fetchPosts = async (page = 1, sortType = "newest") => {
    setIsLoading(true); // Bắt đầu loading
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/post/sort/posts`,
        {
          params: { page, limit: 10, sort: sortType }, // Include page and limit parameters
        }
      );
      if (response.data.success) {
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages); // Set total pages
        // console.log(response.data.posts);
      } else {
        console.error("Failed to fetch posts:", response.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setErrorMessage("Failed to load questions. Please try again later.");
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  useEffect(() => {
    fetchPosts(currentPage); // Fetch posts based on the current page
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the current page when changed
  };

  return (
    <div className="w-full bg-[#F2F7FB] flex">
      <div className="w-1/6">
        <SideBar onSortChange={handleSortChange} />
      </div>
      <div className="w-4/6">
        <div className="pb-5">
          <NavBarNew />
        </div>
        {errorMessage && (
          <div className="text-red-500 text-center my-4">{errorMessage}</div>
        )}
        {isLoading && <LoadingSpinner />}
        <div className="w-[1200px]"></div>
        {!isLoading && (
          <>
            {posts.map((post) => (
              <PostItemLarge key={post._id} post={post} />
            ))}
            <div className="pb-10">
              
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
      <div className="w-1/6">
        <SideBarRight />
      </div>
    </div>
  );
};

export default PostsNew;
