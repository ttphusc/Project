import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { toast } from "react-toastify";
import SideBarReturn from "../../layout/sidebar/SideBarReturn";
import SideBarRight from "../../layout/sidebar/SideBarRight";
import LoadingSpinner from "../../components/loading/LoadingSpinner";

const modules = {
  toolbar: [
    [{ font: [] }, { size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ header: 1 }, { header: 2 }, { header: 3 }, { header: 4 }, { header: 5 }],
    [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
    [{ color: [] }, { background: [] }],
    ["link", "image", "code-block"],
    ["blockquote", "code", "formula"],
    [{ script: "sub" }, { script: "super" }],
    ["clean"],
  ],
};

const QuestionEdit = () => {
  const { qid } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    console.log("qid", qid);
    const fetchQuestion = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/question/${qid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          console.log("response.data", response.data);
          const questionData = response.data.rs;
          console.log("questionData", questionData);
          setQuestion(questionData);
          setTitle(questionData.title);
          setContent(questionData.content);
          setTags(questionData.tags.join(", "));
        }
      } catch (error) {
        console.error("Error fetching question:", error);
        toast.error("Failed to load question");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [qid]);

  const handleSubmit = async () => {
    try {
      if (!title.trim() || !content.trim()) {
        toast.error("Title and content are required");
        return;
      }

      const tagList = tags.split(",").map((tag) => tag.trim());
      if (tagList.length > 5) {
        toast.error("Maximum 5 tags allowed");
        return;
      }

      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/question/${qid}`,
        {
          title,
          content,
          tags: tagList,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Question updated successfully");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error updating question:", error);
      toast.error("Failed to update question");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-row justify-between">
      <div className="w-1/6">
        <SideBarReturn />
      </div>
      <div className="flex-1 p-8 w-full mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 w-[1200px] border border-gray-100">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
            Edit Question
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề câu hỏi của bạn"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out"
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Ví dụ: javascript, react, node.js (tối đa 5 tags)"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out"
              />
              <p className="text-sm text-gray-500 mt-2 italic">
                Tags separated by commas
              </p>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Content
              </label>
              <div className="border rounded-lg">
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  theme="snow"
                  className="h-[400px] mb-12"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8 space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 ease-in-out font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out font-medium shadow-md hover:shadow-lg"
            >
              Update
            </button>
          </div>
        </div>
      </div>
      <div className="w-1/6">
        <SideBarRight />
      </div>
    </div>
  );
};

export default QuestionEdit;
