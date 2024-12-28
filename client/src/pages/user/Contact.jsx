import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import ContactItem from "../../components/userInformation/ContactItem";
import SideBarUser from "../../layout/sidebar/SideBarUser";
import SideBarRight from "../../layout/sidebar/SideBarRight";

const Contact = () => {
  // const { user } = useContext(AuthContext);

  return (
    <div className="w-full bg-[#F2F7FB] flex flex-row justify-between">
      <div className="w-1/6">
        <SideBarUser />
      </div>
      <div className="w-4/6">
        <ContactItem />
      </div>
      <div className="w-1/6">
        <SideBarRight />
      </div>
    </div>
  );
};

export default Contact;
