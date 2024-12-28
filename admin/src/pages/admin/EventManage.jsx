import React from "react";
import SidebarAdmin from "../../components/layout/sidebar/SidebarAdmin";
import EventManageItem from "../../components/items/EventManageItem";

const EventManage = () => {
  return (
    <div className="flex flex-row w-full bg-[#F2F7FB] justify-between">
      <SidebarAdmin />
      <EventManageItem />
    </div>
  );
};

export default EventManage;
