import React, { useState, useEffect } from "react";
import PostItemSuperLarge from "../../components/postItem/PostItemSuperLarge";
import SideBarRight from "../../layout/sidebar/SideBarRight";
import SideBar from "../../layout/sidebar/SideBar";
import PostItemLarge from "../../components/postItem/PostItemLarge";
import Pagination from "../../components/pagination/Pagination"; // Import Pagination
import axios from "axios";
import NavBarEvent from "../../layout/navBar/NavBarEvent";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import EventItemManage from "../../components/eventItem/EventItemManage";

const EventManage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Thêm state loading

  const fetchEvents = async (page = 1, sortType = "newest") => {
    setIsLoading(true); // Bắt đầu loading
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/event/expert`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setEvents(response.data.events);
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
    fetchEvents(); // Fetch posts based on the current page
  }, []);

  return (
    <div className="w-full bg-[#F2F7FB] flex">
      <div className="w-1/6">
        <SideBar />
      </div>
      <div className="w-4/6">
        <div className="pb-5">
          <NavBarEvent />
        </div>
        {errorMessage && (
          <div className="text-red-500 text-center my-4">{errorMessage}</div>
        )}
        {isLoading && <LoadingSpinner />}
        <div className="w-full"></div>
        {!isLoading && (
          <>
            {events.map((event) => (
              <EventItemManage key={event._id} event={event} />
            ))}
          </>
        )}
      </div>
      <div className="w-1/6">
        <SideBarRight />
      </div>
    </div>
  );
};

export default EventManage;
