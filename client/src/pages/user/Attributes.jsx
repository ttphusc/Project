import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import SideBarUser from "../../layout/sidebar/SideBarUser";
import SideBarRight from "../../layout/sidebar/SideBarRight";
import AttributesItem from "../../components/userInformation/AttributesItem";

const Attributes = () => {
  // const { user } = useContext(AuthContext);

  return (
    <div className="w-full bg-[#F2F7FB] flex flex-row justify-between">
      <div className="w-1/6">
        <SideBarUser />
      </div>
      <div className="w-4/6">
        <AttributesItem />
      </div>
      <div className="w-1/6">
        <SideBarRight />
      </div>
    </div>
  );
};

export default Attributes;
