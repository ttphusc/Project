import SideBarRight from "../../layout/sidebar/SideBarRight";
import QuestionItemDetail from "../../components/questionItem/QuestionItemDetail";
import SideBarRightPost from "../../layout/sidebar/SideBarRightPost";
import SideBarReturn from "../../layout/sidebar/SideBarReturn";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const QuestionDetail = () => {
  const { qid } = useParams();
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        console.log(qid);
        console.log("test");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/question/${qid}`
        );
        console.log("Fetched post response:", response);
        setQuestion(response.data.rs);
        console.log(response.data.rs);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
        console.log(error.response);
      }
    };

    fetchQuestion();
  }, [qid]);

  return (
    <div className="w-full bg-[#F2F7FB] flex flex-row justify-between">
      <div className="w-1/6">
        <SideBarReturn />
      </div>
      <div className="w-4/6">
        {/* <NavBarNew /> */}
        <QuestionItemDetail question={question} />
      </div>
      <div className="w-1/6">
        {/* <SideBarRightPost /> */}
        <SideBarRight />
      </div>
    </div>
  );
};

export default QuestionDetail;
