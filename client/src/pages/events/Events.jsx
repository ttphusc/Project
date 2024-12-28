import React, { useEffect, useState } from "react";
import axios from "axios";
import PostItem from "../../components/postItem/PostItem";
import Pagination from "../../components/pagination/Pagination";
import NavBar from "../../layout/navBar/NavBar";
import { stripHtml } from "../../helps/stripHtml";
import { FaBell, FaComment, FaHeart } from "react-icons/fa";
import UserInfomation from "../../components/userInformation/UserInfomation";
import EventItem from "../../components/eventItem/EventItem";
import SideBarReturn from "../../layout/sidebar/SideBarReturn";
import SideBarRight from "../../layout/sidebar/SideBarRight";
import SideBar from "../../layout/sidebar/SideBar";

const Events = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/event?page=${currentPage}`
      );
      if (response.data.success) {
        setEvents(response.data.events);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      setErrorMessage("Failed to load events. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [1]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const refreshEvents = () => {
    fetchEvents(currentPage);
  };

  return (
    <div className="w-full bg-[#F2F7FB] flex flex-row justify-between">
      <div className="w-1/6">
        <SideBar />
      </div>
      <div className="w-4/6">
        {errorMessage && (
          <div className="text-red-500 text-center my-4">{errorMessage}</div>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6374AE]"></div>
          </div>
        ) : (
          <>
            {events.map((event) => (
              <EventItem
                key={event._id}
                event={event}
                onEventUpdate={refreshEvents}
              />
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

export default Events;
