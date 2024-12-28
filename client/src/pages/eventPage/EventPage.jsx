import React from "react";
import SideBarReturn from "../../layout/sidebar/SideBarReturn";
import SideBarRight from "../../layout/sidebar/SideBarRight";
import EventCalendar from "../../components/calendar/EventCalendar";

export const EventPage = () => {
  return (
    <div className="w-full bg-[#F2F7FB] flex flex-row justify-between">
      <div className="w-1/6">
        <SideBarReturn />
      </div>
      <div className="w-4/6">
        <EventCalendar />
      </div>
      <div className="w-1/6">
        <SideBarRight />
      </div>
    </div>
  );
};
