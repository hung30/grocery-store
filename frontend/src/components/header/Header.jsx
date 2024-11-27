import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { message } from "antd";
import { handleLogoutAPI } from "../../apis/authApis";
import { useContext } from "react";
import { LoadingContext } from "../../contexts/LoadingContext";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { env } from "../../config/environment";
import { setCart } from "../../redux/cartSlice";

export default function Header() {
  const [isToggleMenu, setIsToggleMenu] = useState(false);
  const [isToggleUser, setIsToggleUser] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoadingContext);
  const cartNumberItems = useSelector((state) => state.cart.totalItems);

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

  useEffect(() => {
    const cart = async () => {
      try {
        const res = await authorizedAxiosInstance.get(`${env.API_URL}/v1/cart`);
        dispatch(setCart(res.data));
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      cart();
    }
  }, [user, dispatch]);

  return (
    <header
      ref={ref}
      className="py-4 text-yellow-100 bg-blue-400 fixed w-full z-[100] dark:bg-slate-700 dark:text-white"
    >
      <nav className="flex flex-row justify-between items-center">
        <div className="logo basis-2/6 text-center text-xl font-semibold cursor-pointer pl-2">
          <Link to="/">TùngStore.</Link>
        </div>
        <ul
          id="ct-top-menu"
          className="basis-3/6 hidden lg:flex lg:items-center lg:justify-end lg:gap-8 uppercase"
        >
          <li className={`ct-top-menu-item ${getNavLinkClass("/")}`}>
            <Link to="/">Trang chủ</Link>
          </li>
          <li className={`ct-top-menu-item ${getNavLinkClass("/product")}`}>
            <Link to="/product">Sản phẩm</Link>
          </li>
          <li className={`ct-top-menu-item ${getNavLinkClass("/news")}`}>
            <Link to="/news">Tin tức</Link>
          </li>
          <li className={`ct-top-menu-item ${getNavLinkClass("/contact")}`}>
            <Link to="/contact">Liên hệ</Link>
          </li>
          {user && !user.isAdmin && (
            <li className={`ct-top-menu-item ${getNavLinkClass("/order")}`}>
              <Link to="/order">Đơn đặt</Link>
            </li>
          )}
          {user?.isAdmin && (
            <li className={`ct-top-menu-item ${getNavLinkClass("/admin")}`}>
              <Link to="/admin">Admin</Link>
            </li>
          )}
        </ul>
        {!user &&
          location.pathname !== "/login" &&
          location.pathname !== "/register" && (
            <div className="hidden lg:flex justify-center items-center lg:basis-1/6 text-sm xl:text-base mr-2 gap-2">
              <Link
                to="/register"
                title="Đăng ký"
                className="bg-blue-500 p-2 rounded"
              >
                Đăng ký
              </Link>
              <Link
                to="/login"
                title="Đăng nhập"
                className="bg-blue-500 p-2 rounded"
              >
                Đăng nhập
              </Link>
            </div>
          )}
        {!user && location.pathname === "/register" && (
          <div className="hidden lg:block lg:basis-1/6 lg:text-end lg:ml-16 mr-4">
            <Link
              to="/login"
              title="Đăng nhập"
              className="bg-blue-500 p-2 rounded"
            >
              Đăng nhập
            </Link>
          </div>
        )}
        {!user && location.pathname === "/login" && (
          <div className="hidden lg:block lg:basis-1/6 lg:text-end lg:ml-16 mr-4">
            <Link
              to="/register"
              title="Đăng ký"
              className="bg-blue-500 p-2 rounded"
            >
              Đăng ký
            </Link>
          </div>
        )}
        {user && (
          <ul className="basis-4/6 lg:basis-1/6 flex items-center justify-end lg:justify-end ml-16 gap-2">
            <li>
              <Link to="/cart" title="cart" className="flex items-center">
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
                  {cartNumberItems < 100 ? cartNumberItems : "99+"}
                </div>
              </Link>
            </li>
            <li
              title={user?.name ? user.name : "User"}
              className="hidden lg:block cursor-pointer relative"
              onClick={() => setIsToggleUser(!isToggleUser)}
            >
              <span>
                {user?.name.length <= 7
                  ? user.name
                  : user.name.slice(user.name.lastIndexOf(" ") + 1)}
              </span>{" "}
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
                    <Link to="/user">Cá nhân</Link>
                  </li>
                  {!user?.isAdmin && (
                    <li className="border-b border-gray-300 py-1">
                      <Link to="/order">Đơn đặt</Link>
                    </li>
                  )}
                  <li className="py-1">
                    <button onClick={handleLogout}>Đăng xuất</button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        )}
        <div
          id="ct-toggle-top-menu-icon"
          className="lg:hidden flex items-center px-2 sm:px-4 relative mr-3"
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
          {isToggleMenu && user && (
            <ul className="absolute z-50 top-7 right-0 bg-white text-black text-sm p-2 whitespace-nowrap rounded-sm animate-sliceDown">
              <li className="border-b border-gray-300 py-1">
                <Link to="/">Trang chủ</Link>
              </li>
              {!user?.isAdmin && (
                <li className="border-b border-gray-300 py-1">
                  <Link to="/user">Cá nhân</Link>
                </li>
              )}
              {!user?.isAdmin && (
                <li className="border-b border-gray-300 py-1">
                  <Link to="/order">Đơn đặt</Link>
                </li>
              )}
              {/* <li className="border-b border-gray-300 py-1">
                <Link to="/setting">Cài đặt</Link>
              </li> */}

              <li className="border-b border-gray-300 py-1">
                <Link to="/product">Sản phẩm</Link>
              </li>

              {!user?.isAdmin && (
                <li className="border-b border-gray-300 py-1">
                  <Link to="/news">Tin tức</Link>
                </li>
              )}
              {!user?.isAdmin && (
                <li className="border-b border-gray-300 py-1">
                  <Link to="/contact">Liên hệ</Link>
                </li>
              )}
              {user?.isAdmin && (
                <li className="border-b border-gray-300 py-1">
                  <Link to="/admin">Admin</Link>
                </li>
              )}
              <li className="">
                <button onClick={handleLogout}>Đăng xuất</button>
              </li>
            </ul>
          )}
          {isToggleMenu && !user && (
            <ul className="absolute z-50 top-7 right-0 bg-white text-black text-sm p-2 whitespace-nowrap rounded-sm animate-sliceDown">
              <li className="border-b border-gray-300 py-1">
                <Link to="/">Trang chủ</Link>
              </li>
              {/* <li className="border-b border-gray-300 py-1">
                <Link to="/setting">Cài đặt</Link>
              </li> */}
              <li className="border-b border-gray-300 py-1">
                <Link to="/product">Sản phẩm</Link>
              </li>
              <li className="border-b border-gray-300 py-1">
                <Link to="/news">Tin tức</Link>
              </li>
              <li className="border-b border-gray-300 py-1">
                <Link to="/contact">Liên hệ</Link>
              </li>
              <li className="border-b border-gray-300 py-1">
                <Link to="/login">Đăng nhập</Link>
              </li>
              <li className="pt-1">
                <Link to="/register">Đăng ký</Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
}
