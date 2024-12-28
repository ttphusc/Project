import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import SideBarUser from "../../layout/sidebar/SideBarUser";
import SideBarRight from "../../layout/sidebar/SideBarRight";
import PasswordItem from "../../components/userInformation/PasswordItem";

const Password = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F2F7FB] flex flex-row justify-between">
      <div className="w-1/6">
        <SideBarUser />
      </div>
      <div className="w-4/6">
        <PasswordItem />
      </div>
      <div className="w-1/6">
        <SideBarRight />
      </div>
    </div>
  );
};

export default Password;
