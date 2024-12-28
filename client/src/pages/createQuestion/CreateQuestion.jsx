import React from "react";
import SideBar from "../../layout/sidebar/SideBar";
import SideBarRight from "../../layout/sidebar/SideBarRight";
import NavBarNew from "../../layout/navBar/NavBarNew";
import InputQuestion from "../../components/input/InputQuestion";

const CreateQuestion = () => {
  return (
    <div className="w-full bg-[#F2F7FB] flex flex-row justify-between">
      <div className="w-1/6">
        <SideBar />
      </div>

      <div className="w-4/6">
        {/* <NavBarNew /> */}
        <InputQuestion />
      </div>
      <div className="w-1/6">
        <SideBarRight />
      </div>
    </div>
  );
};

export default CreateQuestion;
