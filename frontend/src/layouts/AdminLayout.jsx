import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      hello world
      {/* Các route con sẽ được render ở đây */}
      <Outlet />
    </div>
  );
};

export default AdminLayout;
