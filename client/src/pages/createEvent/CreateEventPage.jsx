import React from "react";
import InputQuestion from "../../components/input/InputQuestion";
import SideBarRight from "../../layout/sidebar/SideBarRight";
import SideBarReturn from "../../layout/sidebar/SideBarReturn";
import InputEvent from "../../components/input/InputEvent";

const CreateEvent = () => {
  return (
    <div className="w-full bg-[#F2F7FB] flex flex-row justify-between">
      <div className="w-1/6">
        <SideBarReturn />
      </div>

      <div className="w-4/6">
        <InputEvent />
      </div>
      <div className="w-1/6">
        <SideBarRight />
      </div>
    </div>
  );
};

export default CreateEvent;
