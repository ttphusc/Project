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
  FiThumbsUp,
  FiEye,
  FiTag,
} from "react-icons/fi";
import { toast } from "react-toastify";

const QuestionManageItem = () => {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
    tags: [],
  });
  // Access token (use environment variables or secure storage in real projects)
  const accessToken = localStorage.getItem("accessToken");
  // Function to select or deselect questions
  const handleSelectQuestion = (index) => {
    setSelectedQuestions((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  // Function to fetch questions from the server
  const fetchQuestions = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/question`,
        {
          params: { page, limit: 10, search: searchQuery },
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.data.success) {
        setQuestions(response.data.questions);
        setTotalPages(response.data.totalPages);
      } else {
        setErrorMessage("Failed to fetch questions.");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setErrorMessage("Failed to load questions. Please try again later.");
    }
    setLoading(false);
  };

  const submitDeletedQuestion = async (qid) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/question/admin/${qid}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.success) {
        fetchQuestions(currentPage);
      } else {
        console.error("Failed to delete question:", response.data);
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      setErrorMessage("Failed to delete question. Please try again later.");
    }
  };

  const submitUpdatedQuestion = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/question/${
          editingQuestion._id
        }`,
        editingQuestion,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.success) {
        setEditingQuestion(null);
        fetchQuestions(currentPage);
      } else {
        console.error("Failed to update question:", response.data);
      }
    } catch (error) {
      console.error("Error updating question:", error);
      setErrorMessage("Failed to update question. Please try again later.");
    }
  };

  const handleCreateQuestion = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/question/`,
        newQuestion,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.success) {
        setNewQuestion({
          title: "",
          content: "",
          tags: [],
        });
        fetchQuestions(currentPage); // Refresh question list after adding
        setIsCreateFormVisible(false); // Close form after successful creation
      } else {
        console.error("Failed to create question:", response.data);
      }
    } catch (error) {
      console.error("Error creating question:", error);
      setErrorMessage("Failed to create question. Please try again later.");
    }
  };

  // Fetch questions on component mount and when currentPage or searchQuery changes
  useEffect(() => {
    fetchQuestions(currentPage);
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

  const handleDeleteQuestion = (question) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${question._id}?`
    );
    if (confirmDelete) {
      submitDeletedQuestion(question._id);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "tags") {
      setNewQuestion((prevQuestion) => ({
        ...prevQuestion,
        [name]: value.split(" ").filter((tag) => tag !== ""), // Split by space and remove empty strings
      }));
    } else {
      setNewQuestion((prevQuestion) => ({
        ...prevQuestion,
        [name]: value,
      }));
    }
  };
  const handleUpdateQuestion = (question) => {
    setEditingQuestion(question);
  };
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "tags") {
      setEditingQuestion((prevQuestion) => ({
        ...prevQuestion,
        [name]: value.split(" ").filter((tag) => tag !== ""), // Split by space and remove empty strings
      }));
    } else {
      setEditingQuestion((prevQuestion) => ({
        ...prevQuestion,
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
              Question Management
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreateFormVisible(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#6374AE] text-white rounded-lg hover:bg-[#4A5578] transition-colors"
              >
                <FiPlus size={20} />
                <span>Add Question</span>
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
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6374AE] focus:border-transparent"
              />
            </div>
            {/* <div className="flex gap-3">
              <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6374AE]">
                <option value="">All Categories</option>
                <option value="nutrition">Nutrition</option>
                <option value="workout">Workout</option>
                <option value="health">Health</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FiDownload size={18} />
                <span>Export</span>
              </button>
            </div> */}
          </div>
        </div>

        {/* Questions List */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6">
            {questions.map((question, index) => (
              <div
                key={question._id}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {question.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{question.content}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {question.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#EEF2FF] text-[#6374AE]"
                        >
                          <FiTag className="mr-1" size={14} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="relative ml-4">
                    <button
                      onClick={() => handleMenuClick(index)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FiMoreVertical size={20} />
                    </button>
                    {menuVisible === index && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                        <button
                          onClick={() => handleUpdateQuestion(question)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <FiEdit2 className="mr-3" size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                        >
                          <FiTrash2 className="mr-3" size={16} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <FiThumbsUp size={16} />
                      <span>{question.likes?.length || 0} likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMessageCircle size={16} />
                      <span>
                        {countTotalComments(question.comments)} comments
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiEye size={16} />
                      <span>{question.views || 0} views</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400">
                      Posted by: {question.userCreate?.firstname || "Anonymous"}
                    </span>
                    <span className="text-gray-400">
                      {new Date(question.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Modal */}
        {editingQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
              <h3 className="text-xl font-semibold mb-4">Edit Question</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editingQuestion.title}
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
                    value={editingQuestion.content}
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
                    value={editingQuestion.tags.join(" ")}
                    onChange={handleEditInputChange}
                    placeholder="Separate tags with spaces"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitUpdatedQuestion}
                  className="px-4 py-2 bg-[#6374AE] text-white rounded-lg hover:bg-[#4A5578]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Showing {questions.length} of {totalPages * 10} results
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

export default QuestionManageItem;
