import React from "react";

import { Outlet } from "react-router-dom";
import HeaderAdmin from "../header/HeaderAdmin";

const Layout = () => {
  return (
    <>
      <HeaderAdmin />
      <Outlet />
    </>
  );
};

export default Layout;
