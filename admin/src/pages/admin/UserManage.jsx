import React from "react";
import SidebarAdmin from "../../components/layout/sidebar/SidebarAdmin";
import UserManageItem from "../../components/items/UserManageItem";

const UserManage = () => {
  return (
    <div className="flex flex-row w-full bg-[#F2F7FB] justify-between">
      <SidebarAdmin />
      <UserManageItem />
    </div>
  );
};

export default UserManage;
