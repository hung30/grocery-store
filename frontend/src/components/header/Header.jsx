import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
export default function Header() {
  const [isUser, setIsUser] = useState(false);
  const [isToggleMenu, setIsToggleMenu] = useState(false);
  const [isToggleUser, setIsToggleUser] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  useEffect(() => {
    const handler = (event) => {
      if (isToggleMenu && ref.current && !ref.current.contains(event.target)) {
        setIsToggleMenu(false);
      }
      if (isToggleUser && ref.current && !ref.current.contains(event.target)) {
        setIsToggleUser(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handler);
    };
  }, [isToggleMenu, isToggleUser]);
  const getNavLinkClass = (path) => {
    return location.pathname === path ? "ct-top-menu-item-active" : "";
  };
  return (
    <header
      ref={ref}
      className="py-4 text-yellow-100 bg-blue-400 fixed w-full z-[100]"
    >
      <nav className="flex flex-row justify-between items-center">
        <div className="logo basis-2/6 text-center text-xl font-semibold cursor-pointer pl-2">
          <a href="/">TùngStore.</a>
        </div>
        <ul
          id="ct-top-menu"
          className="basis-3/6 hidden lg:flex lg:items-center lg:justify-end lg:gap-8 uppercase"
        >
          <li className={`ct-top-menu-item ${getNavLinkClass("/")}`}>
            <a href="/">Trang chủ</a>
          </li>
          <li className={`ct-top-menu-item ${getNavLinkClass("/product")}`}>
            <a href="/product">Sản phẩm</a>
          </li>
          <li className={`ct-top-menu-item ${getNavLinkClass("/news")}`}>
            <a href="/news">Tin tức</a>
          </li>
          <li className={`ct-top-menu-item ${getNavLinkClass("/contact")}`}>
            <a href="/contact">Liên hệ</a>
          </li>
        </ul>
        {!isUser ? (
          <div className="hidden lg:block lg:basis-1/6 lg:text-end lg:ml-16 mr-2">
            <a href="/login" className="bg-blue-500 p-2 rounded">
              Đăng nhập
            </a>
          </div>
        ) : (
          <ul className="basis-4/6 lg:basis-1/6 flex items-center justify-end lg:justify-end ml-16 gap-2">
            <li>
              <a href="/cart" className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="ct-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                <div className="rounded-full bg-yellow-400 text-xs text-center px-1.5">
                  0
                </div>
              </a>
            </li>
            <li
              className="hidden lg:block cursor-pointer relative"
              onClick={() => setIsToggleUser(!isToggleUser)}
            >
              <span>user</span>{" "}
              {!isToggleUser && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="ct-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              )}
              {isToggleUser && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="ct-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 15.75 7.5-7.5 7.5 7.5"
                  />
                </svg>
              )}
              {isToggleUser && (
                <ul className="absolute z-50 top-6 right-0 bg-white text-black text-sm p-2 whitespace-nowrap rounded-sm animate-sliceDown">
                  <li className="border-b border-gray-300 pb-1">
                    <a href="/">Cá nhân</a>
                  </li>
                  <li className="border-b border-gray-300 py-1">
                    <a href="/user">Đơn đặt</a>
                  </li>
                  <li className="border-b border-gray-300 py-1">
                    <a href="/setting">Cài đặt</a>
                  </li>
                  <li className="py-1">
                    <a href="/logout">Đăng xuất</a>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        )}
        <div
          id="ct-toggle-top-menu-icon"
          className="lg:hidden flex items-center px-2 sm:px-4 relative"
          onClick={() => setIsToggleMenu(!isToggleMenu)}
        >
          {!isToggleMenu ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="ct-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="ct-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          )}
          {isToggleMenu && isUser && (
            <ul className="absolute z-50 top-7 right-0 bg-white text-black text-sm p-2 whitespace-nowrap rounded-sm animate-sliceDown">
              <li className="border-b border-gray-300 py-1">
                <a href="/">Trang chủ</a>
              </li>
              <li className="border-b border-gray-300 py-1">
                <a href="/user">userName</a>
              </li>
              <li className="border-b border-gray-300 py-1">
                <a href="/order">Đơn đặt</a>
              </li>
              <li className="border-b border-gray-300 py-1">
                <a href="/setting">Cài đặt</a>
              </li>
              <li className="border-b border-gray-300 py-1">
                <a href="/product">Sản phẩm</a>
              </li>
              <li className="border-b border-gray-300 py-1">
                <a href="/news">Tin tức</a>
              </li>
              <li className="border-b border-gray-300">
                <a href="/contact">Liên hệ</a>
              </li>
              <li className="py-1">
                <a href="/logout" onClick={() => setIsUser(false)}>
                  Đăng xuất{" "}
                </a>
              </li>
            </ul>
          )}
          {isToggleMenu && !isUser && (
            <ul className="absolute z-50 top-7 right-0 bg-white text-black text-sm p-2 whitespace-nowrap rounded-sm animate-sliceDown">
              <li className="border-b border-gray-300 py-1">
                <a href="/">Trang chủ</a>
              </li>
              <li className="border-b border-gray-300 py-1">
                <a href="/setting">Cài đặt</a>
              </li>
              <li className="border-b border-gray-300 py-1">
                <a href="/product">Sản phẩm</a>
              </li>
              <li className="border-b border-gray-300 py-1">
                <a href="/news">Tin tức</a>
              </li>
              <li className="border-b border-gray-300 py-1">
                <a href="/contact">Liên hệ</a>
              </li>
              <li className="border-b border-gray-300 py-1">
                <a href="/login">Đăng nhập</a>
              </li>
              <li className="pt-1">
                <a href="/register">Đăng ký</a>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
}
