import React, { useContext } from "react";
import PersonalItem from "../../components/userInformation/PersonalItem";
import SideBarRight from "../../layout/sidebar/SideBarRight";
import SideBarUser from "../../layout/sidebar/SideBarUser";

const Personal = () => {
  return (
    <div className="w-full bg-[#F2F7FB] flex flex-row justify-between">
      <div className="w-1/6">
        <SideBarUser />
      </div>
      <div className="w-4/6">
        <PersonalItem />
      </div>
      <div className="w-1/6">
        <SideBarRight />
      </div>
    </div>
  );
};

export default Personal;
