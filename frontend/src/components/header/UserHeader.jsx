import React from "react";
import { Link, useLocation } from "react-router-dom";
function UserHeader() {
  const location = useLocation();

  const getNavLinkClass = (path) => {
    return location.pathname === path ? "bg-gray-600 text-yellow-100" : "";
  };

  return (
    <>
      <nav className="">
        <ul className="flex justify-center items-center gap-4 bg-gray-400">
          <li className={`hover:text-white ${getNavLinkClass("/user")} p-2`}>
            <Link to="/user">TRANG CÁ NHÂN</Link>
          </li>
          <li
            className={`hover:text-white ${getNavLinkClass(
              "/user/change-password"
            )} p-2`}
          >
            <Link to="/user/change-password">ĐỔI MẬT KHẨU</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default UserHeader;
