import React from "react";
import SidebarAdmin from "../../components/layout/sidebar/SidebarAdmin";
import UserManageItem from "../../components/items/UserManageItem";
import QuestionManagementItem from "../../components/items/QuestionManageItem";

const QuestionManage = () => {
  return (
    <div className="flex flex-row w-full bg-[#F2F7FB] justify-between">
      <SidebarAdmin />
      <QuestionManagementItem />
    </div>
  );
};

export default QuestionManage;
