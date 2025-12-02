import React from "react";
import { Outlet } from "react-router";
import Sidebar from "../Components/shared/Sidebar";

const RootLayout = () => {
  return (
    <div>
      <Sidebar />
    </div>
  );
};

export default RootLayout;
