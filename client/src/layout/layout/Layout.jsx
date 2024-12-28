import React from "react";
import BlockNotification from '../../layout/blockNotification/BlockNotification';
import { Outlet } from "react-router-dom";
import Footer from "../footer/Footer";
import HeaderNew from "../header/HeaderNew";

const Layout = () => {
  return (
    <>
      <HeaderNew />
      <BlockNotification />
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
