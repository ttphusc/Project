import React, { useEffect, useState } from "react";
import SideBar from "../../layout/sidebar/SideBar";
import SideBarRight from "../../layout/sidebar/SideBarRight";
import QuestionItemSmall from "../../components/questionItem/QuestionItemSmall";
import Pagination from "../../components/pagination/Pagination"; // Import Pagination
import axios from "axios";
import NavBarQuestion from "../../layout/navBar/NavBarQuestion";
import LoadingSpinner from "../../components/loading/LoadingSpinner";

const Questions = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [totalPages, setTotalPages] = useState(1); // State for total pages
  const [isLoading, setIsLoading] = useState(true); // Thêm state loading

  const [sortType, setSortType] = useState("newest");

  const handleSortChange = (newSortType) => {
    // console.log(newSortType);
    setSortType(newSortType);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi sắp xếp
    fetchQuestions(1, newSortType);
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

  const fetchQuestions = async (page = 1, sortType = "newest") => {
    setIsLoading(true); // Bắt đầu loading
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/question/sort/questions`,
        {
          params: { page, limit: 10, sort: sortType }, // Include page and limit parameters
        }
      );
      if (response.data.success) {
        setQuestions(response.data.questions);
        setTotalPages(response.data.totalPages); // Set total pages from response
        // console.log(response.data.questions);
        console.log("::::" + response.data);
      } else {
        console.error("Failed to fetch questions:", response.data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setErrorMessage("Failed to load questions. Please try again later.");
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  useEffect(() => {
    fetchQuestions(currentPage, sortType); // Fetch questions based on current page
  }, [currentPage, sortType]);

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the current page
  };

  return (
    <div className="w-full bg-[#F2F7FB] flex flex-row justify-between">
      <div className="w-1/6">
        <SideBar onSortChange={handleSortChange} />
      </div>
      <div className="w-4/6">
        <div className="pb-5">
          <NavBarQuestion />
        </div>

        {errorMessage && (
          <div className="text-red-500 text-center my-4">{errorMessage}</div>
        )}
        {isLoading && <LoadingSpinner />}
        <div className="w-[1200px]"></div>
        {questions.map((question) => (
          <QuestionItemSmall
            _id={question._id}
            title={question.title}
            views={question.views}
            idAuthor={question.idAuthor}
            tags={question.tags}
            createdAt={question.createdAt}
            comments={question.comments}
            key={question._id}
          />
        ))}
        <div className="pb-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <div className="w-1/6">
        <SideBarRight />
      </div>
    </div>
  );
};

export default Questions;
