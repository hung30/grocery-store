import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import HomePage from "./pages/homepage/HomePage";
import Product from "./pages/product/Product";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import ForgotPasswordPage from "./pages/authpage/ForgotPasswordPage";
import LoginPage from "./pages/authpage/LoginPage";
import RegisterPage from "./pages/authpage/RegisterPage";
import NewsPage from "./pages/authpage/NewsPage";
import CartPage from "./pages/cartpage/CartPage";
import AdminLayout from "./layouts/AdminLayout";
import { LoadingContext, LoadingProvider } from "./contexts/LoadingContext";
import { useContext, useEffect, useState } from "react";
import Spinner from "./components/spinner/Spinner";
import OrderPage from "./pages/orderpage/OrderPage";
import { ConfigProvider } from "antd";
import ContactPage from "./pages/authpage/ContactPage";
import ProductDetailPage from "./pages/productDetail/ProductDetailPage";
import UserPage from "./pages/authpage/UserPage";
import ChangePasswordPage from "./pages/authpage/ChangePasswordPage";
import PasswordEmptyModal from "./components/passwordEmptyModal/PasswordEmptyModal";

const ProtectedRoutes = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }
  return <Outlet />;
};

const UnauthorizedRoutes = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  if (user) {
    return <Navigate to="/" replace={true} />;
  }
  return <Outlet />;
};

const LoadingSpin = () => {
  const { isLoading } = useContext(LoadingContext);
  return isLoading && <Spinner />;
};

function Layout() {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode");
    darkMode === "true" ? setDarkMode(true) : setDarkMode(false);
  }, []);

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextBase: darkMode ? "#f0f0f0" : "#333",
          colorBgElevated: darkMode ? "#1f2937" : "#fff",
        },
        components: {
          Pagination: {
            itemActiveBg: darkMode && "#1f2937",
          },
          Select: {
            optionSelectedBg: darkMode && "#1D4ED8",
            selectorBg: darkMode && "#1f2937",
          },
          Button: {
            defaultBg: darkMode && "#4B5563",
          },
          Input: {
            colorText: darkMode && "#333",
            colorBgContainer: darkMode && "#F3F4F6",
            colorTextPlaceholder: darkMode && "#6B7280",
          },
        },
      }}
    >
      <div className={`${darkMode && "dark"}`}>
        <div className="grid grid-rows-[auto_1fr_auto] min-h-screen max-w-screen-2xl text-base dark:bg-neutral-900">
          {!isAdminRoute && (
            <div className="h-[70px] dark:bg-neutral-900"></div>
          )}
          {!isAdminRoute && <Header />}
          <LoadingSpin />
          <Outlet />
          <div className="fixed bottom-0 right-0 m-7 flex justify-center items-center">
            <button
              className=" w-16 h-16  rounded-full bg-blue-400 dark:bg-white text-white dark:text-black"
              onClick={handleDarkMode}
            >
              {darkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 w-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 w-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                  />
                </svg>
              )}
            </button>
          </div>
          {!isAdminRoute && <Footer />}
        </div>
      </div>
    </ConfigProvider>
  );
}

function App() {
  return (
    <LoadingProvider>
      <BrowserRouter>
        <PasswordEmptyModal />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/product" element={<Product />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/product-detail/:productId"
              element={<ProductDetailPage />}
            />

            <Route element={<UnauthorizedRoutes />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            <Route element={<ProtectedRoutes />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/user" element={<UserPage />} />
              <Route
                path="/user/change-password"
                element={<ChangePasswordPage />}
              />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<HomePage />} />
              <Route path="product" element={<Product />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  );
}

export default App;
