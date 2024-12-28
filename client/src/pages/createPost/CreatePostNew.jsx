import React from "react";
import CreatePostItem from "../../components/input/CreatePostItem";
import SideBar from "../../layout/sidebar/SideBar";
import SideBarRight from "../../layout/sidebar/SideBarRight";

const CreatePostNew = () => {
  return (
    <div className="w-full bg-[#F2F7FB] flex flex-row ">
      <div className="w-1/6">
        <SideBar />
      </div>
      <div className="w-4/6">
        <CreatePostItem />
      </div>

      <div className="w-1/6">
        <SideBarRight />
      </div>
    </div>
  );
};

export default CreatePostNew;
