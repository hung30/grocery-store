import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function TitleUpdater() {
  const location = useLocation();
  useEffect(() => {
    switch (location.pathname) {
      case "/":
        document.title = "Trang chủ";
        break;
      case "/login":
        document.title = "Đăng nhập";
        break;
      case "/register":
        document.title = "Đăng ký";
        break;
      case "/forgot-password":
        document.title = "Quên mật khẩu";
        break;
      case "/product":
        document.title = "Sản phẩm";
        break;
      case "/news":
        document.title = "Tin tức";
        break;
      case "/contact":
        document.title = "Liên hệ";
        break;
      case "/cart":
        document.title = "Giỏ hàng";
        break;
      case "/order":
        document.title = "Đơn đặt";
        break;
      case "/user":
        document.title = "Tài khoản";
        break;
      case "/user/change-password":
        document.title = "Đổi mật khẩu";
        break;
      case "/admin":
        document.title = "Trang quản trị";
        break;
      case "/admin/customers":
        document.title = "Quản lý khách hàng";
        break;
      case "/admin/inventory":
        document.title = "Quản lý kho";
        break;
      case "/admin/orders":
        document.title = "Quản lý đơn hàng";
        break;
      default:
        document.title = "404 Not Found";
    }
  }, [location]);
  return null;
}

export default TitleUpdater;
