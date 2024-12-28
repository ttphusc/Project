import React from "react";
import SidebarAdmin from "../../components/layout/sidebar/SidebarAdmin";
import PostManageItem from "../../components/items/PostManageItem";

const PostManage = () => {
  return (
    <div className="flex flex-row w-full bg-[#F2F7FB] justify-between">
      <SidebarAdmin />
      <PostManageItem />
    </div>
  );
};

export default PostManage;
