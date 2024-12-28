import React from "react";
import SidebarAdmin from "../../components/layout/sidebar/SidebarAdmin";
import Dashboard from "../../components/items/Dashboard";

const Home = () => {
  return (
    <div className="flex flex-row w-full bg-[#F2F7FB] justify-between">
      <SidebarAdmin />
      <Dashboard />
    </div>
  );
};

export default Home;
