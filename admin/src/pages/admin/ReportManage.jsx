import React from "react";
import SidebarAdmin from "../../components/layout/sidebar/SidebarAdmin";
import ReportManageItem from "../../components/items/ReportManageItem";

const ReportManage = () => {
  return (
    <div className="flex flex-row w-full bg-[#F2F7FB] justify-between">
      <SidebarAdmin />
      <ReportManageItem />
    </div>
  );
};

export default ReportManage;
