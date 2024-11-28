import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";

function SideMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/admin");

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  return (
    <div className="h-full">
      <Menu
        className="h-full"
        mode="vertical"
        onClick={(item) => {
          navigate(item.key);
        }}
        selectedKeys={[selectedKeys]}
        items={[
          {
            label: "Dashboard",
            icon: <AppstoreOutlined />,
            key: "/admin",
          },
          {
            label: "Sản phẩm",
            key: "/admin/inventory",
            icon: <ShopOutlined />,
          },
          {
            label: "Đơn đặt",
            key: "/admin/orders",
            icon: <ShoppingCartOutlined />,
          },
          {
            label: "Khách hàng",
            key: "/admin/customers",
            icon: <UserOutlined />,
          },
        ]}
      ></Menu>
    </div>
  );
}

export default SideMenu;
