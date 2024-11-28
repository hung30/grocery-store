import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/header/AdminHeader";
import AdminFooter from "../components/footer/AdminFooter";
import SideMenu from "../components/sideMenu/SideMenu";
import { App as AntdApp } from "antd";

const AdminLayout = () => {
  return (
    <AntdApp>
      <div className="flex flex-col w-screen h-screen">
        <AdminHeader />
        {/* Các route con sẽ được render ở đây */}
        <div className="flex flex-1 justify-start items-start bg-gray-200">
          <SideMenu />
          <Outlet />
        </div>
        <AdminFooter />
      </div>
    </AntdApp>
  );
};

export default AdminLayout;
