import React from "react";
import SideBarRight from "../../layout/sidebar/SideBarRight";
import SideBarReturn from "../../layout/sidebar/SideBarReturn";
import InputEvent from "../../components/input/InputEvent";
import UpdateEventItem from "../../components/eventItem/UpdateEvent";

const UpdateEvent = () => {
  return (
    <div className="w-full bg-[#F2F7FB] flex flex-row justify-between">
      <div className="w-1/6">
        /
        <SideBarReturn />
      </div>
      <div className="w-4/6">
        <UpdateEventItem />
      </div>
      <div className="w-1/6">
        <SideBarRight />
      </div>
    </div>
  );
};

export default UpdateEvent;
