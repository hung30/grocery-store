import React, { useContext } from "react";
import { Button, Layout, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoadingContext } from "../../contexts/LoadingContext";
import { handleLogoutAPI } from "../../apis/authApis";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
const { Header } = Layout;

function AdminHeader() {
  const { setIsLoading } = useContext(LoadingContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    height: 50,
    paddingInline: 48,
    lineHeight: "64px",
    backgroundColor: "#4096ff",
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await handleLogoutAPI();
      dispatch(logout());
      localStorage.removeItem("quantities");
      message.success("Đăng xuất thành công!");
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <Header style={headerStyle}>
      <Link to="/" style={{ color: "#fff", fontSize: "18px" }}>
        Home
      </Link>
      <Link to="/admin" style={{ color: "#fff", fontSize: "18px" }}>
        Admin Dashboard
      </Link>
      <Button type="primary" danger onClick={handleLogout}>
        Đăng xuất
      </Button>
    </Header>
  );
}

export default AdminHeader;
