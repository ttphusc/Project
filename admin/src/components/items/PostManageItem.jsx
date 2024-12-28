import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiMessageCircle,
  FiHeart,
  FiEye,
  FiCheckCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";

const PostManageItem = () => {
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    tags: [],
  });
  // Access token (use environment variables or secure storage in real projects)
  const accessToken = localStorage.getItem("accessToken");
  // Function to select or deselect posts
  const handleSelectPost = (index) => {
    setSelectedPosts((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  // Function to fetch posts from the server
  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/post`,
        {
          params: { page, limit: 10, search: searchQuery },
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.data.success) {
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
      } else {
        setErrorMessage("Failed to fetch posts.");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setErrorMessage("Failed to load posts. Please try again later.");
    }
    setLoading(false);
  };
  const submitDeletedPost = async (pid) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/post/admin/${pid}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.success) {
        fetchPosts(currentPage);
      } else {
        console.error("Failed to delete post:", response.data);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      setErrorMessage("Failed to update post. Please try again later.");
    }
  };
  const submitUpdatedPost = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/post/${editingPost._id}`,
        editingPost,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.success) {
        setEditingPost(null);
        fetchPosts(currentPage);
      } else {
        console.error("Failed to update user:", response.data);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setErrorMessage("Failed to update user. Please try again later.");
    }
  };
  const handleCreatePost = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/`,
        newPost,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.success) {
        setNewPost({
          title: "",
          content: "",
          tags: [],
        });
        fetchPosts(currentPage); // Refresh user list after adding
        setIsCreateFormVisible(false); // Close form after successful creation
      } else {
        console.error("Failed to create post:", response.data);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setErrorMessage("Failed to create post. Please try again later.");
    }
  };
  const submitBlockPost = async (pid) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/post/block/${pid}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.success) {
        fetchPosts(currentPage);
      } else {
        console.error("Failed to block post:", response.data);
      }
    } catch (error) {
      console.error(
        "Error blocking post:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage("Failed to block post. Please try again later.");
    }
  };
  // Fetch posts on component mount and when currentPage or searchQuery changes
  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage, searchQuery]);

  // Function to change the current page
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Function to count the total number of comments including replies
  const countTotalComments = (comments) => {
    if (!comments || comments.length === 0) return 0;
    return comments.reduce((total, comment) => {
      return (
        total + 1 + (comment.replies ? countTotalComments(comment.replies) : 0)
      );
    }, 0);
  };
  const handleMenuClick = (index) => {
    setMenuVisible(menuVisible === index ? null : index);
  };
  const handleUpdatePost = (post) => {
    setEditingPost(post);
  };
  // Hàm để xoa người dùng
  const handleDeletePost = (post) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${post._id}?`
    );
    if (confirmDelete) {
      submitDeletedPost(post._id);
    }
  };

  const handleBlockPost = (post) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to update status of post with id: ${post._id}?`
    );
    if (confirmDelete) {
      submitBlockPost(post._id);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "tags") {
      setNewPost((prevPost) => ({
        ...prevPost,
        [name]: value.split(" ").filter((tag) => tag !== ""), // Split by space and remove empty strings
      }));
    } else {
      setNewPost((prevPost) => ({
        ...prevPost,
        [name]: value,
      }));
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "tags") {
      setEditingPost((prevPost) => ({
        ...prevPost,
        [name]: value.split(" ").filter((tag) => tag !== ""), // Split by space and remove empty strings
      }));
    } else {
      setEditingPost((prevPost) => ({
        ...prevPost,
        [name]: value,
      }));
    }
  };
  return (
    <div className="p-8">
      <div className="w-[1400px] mx-auto bg-white rounded-2xl shadow-sm">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Post Management
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreateFormVisible(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#6374AE] text-white rounded-lg hover:bg-[#4A5578] transition-colors"
              >
                <FiPlus size={20} />
                <span>Create Post</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6374AE] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Edit Form Modal */}
        {editingPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
              <h3 className="text-xl font-semibold mb-4">Edit Post</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editingPost.title}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    name="content"
                    value={editingPost.content}
                    onChange={handleEditInputChange}
                    rows={4}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={editingPost.tags.join(" ")}
                    onChange={handleEditInputChange}
                    placeholder="Separate tags with spaces"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitUpdatedPost}
                  className="px-4 py-2 bg-[#6374AE] text-white rounded-lg hover:bg-[#4A5578]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Form Modal */}
        {isCreateFormVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
              <h3 className="text-xl font-semibold mb-4">Create New Post</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newPost.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    name="content"
                    value={newPost.content}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={newPost.tags.join(" ")}
                    onChange={handleInputChange}
                    placeholder="Separate tags with spaces"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsCreateFormVisible(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  className="px-4 py-2 bg-[#6374AE] text-white rounded-lg hover:bg-[#4A5578]"
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <div
              key={post._id}
              className={`bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow ${
                post.isBlocked ? "opacity-50" : ""
              }`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-900 line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="relative">
                    <button
                      onClick={() => handleMenuClick(index)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FiMoreVertical size={20} />
                    </button>
                    {menuVisible === index && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                        <button
                          onClick={() => handleUpdatePost(post)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <FiEdit2 className="mr-3" size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                        >
                          <FiTrash2 className="mr-3" size={16} />
                          Delete
                        </button>
                        <button
                          onClick={() => handleBlockPost(post)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                        >
                          {post.isBlocked ? (
                            <>
                              <FiCheckCircle className="mr-3" size={16} />
                              Unblock
                            </>
                          ) : (
                            <>
                              <FiTrash2 className="mr-3" size={16} />
                              Block
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {post.content}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <FiHeart size={16} />
                      <span>{post.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiMessageCircle size={16} />
                      <span>{post.comments?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiEye size={16} />
                      <span>{post.views || 0}</span>
                    </div>
                  </div>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                {post.isBlocked && (
                  <div className="mt-2 text-red-600 text-sm">
                    This post is blocked.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Showing {posts.length} of {totalPages * 10} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-200 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === i + 1
                    ? "bg-[#6374AE] text-white"
                    : "border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-200 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostManageItem;
