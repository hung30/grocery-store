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
import NewsPage from "./pages/newsPage/NewsPage";
import CartPage from "./pages/cartpage/CartPage";
import AdminLayout from "./layouts/AdminLayout";
import { LoadingContext, LoadingProvider } from "./contexts/LoadingContext";
import { useContext } from "react";
import Spinner from "./components/spinner/Spinner";
import OrderPage from "./pages/orderpage/OrderPage";
import { ConfigProvider } from "antd";
import ContactPage from "./pages/contactPage/ContactPage";
import ProductDetailPage from "./pages/productDetail/ProductDetailPage";
import UserPage from "./pages/authpage/UserPage";
import ChangePasswordPage from "./pages/authpage/ChangePasswordPage";
import PasswordEmptyModal from "./components/passwordEmptyModal/PasswordEmptyModal";
import DashBoard from "./pages/adminPages/Dashboard";
import Customers from "./pages/adminPages/Customers";
import Inventory from "./pages/adminPages/Inventory";
import Orders from "./pages/adminPages/Orders";
import FloatButtonComponent from "./components/floatButton/FloatButton";
import { useSelector } from "react-redux";
import TitleUpdater from "./components/titleUpdater/TitleUpdater";

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

const AdminRoutes = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  if (user && user.isAdmin === "true") {
    return <AdminLayout />;
  }
  return <Navigate to="/" replace={true} />;
};

const LoadingSpin = () => {
  const { isLoading } = useContext(LoadingContext);
  return isLoading && <Spinner />;
};

function Layout() {
  const darkMode = useSelector((state) => state.darkMode.darkMode);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

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
        <div className="grid grid-rows-[auto_1fr_auto] min-h-screen text-base dark:bg-neutral-900">
          {!isAdminRoute && (
            <div className="h-[70px] dark:bg-neutral-900"></div>
          )}
          {!isAdminRoute && <Header />}
          <LoadingSpin />
          <Outlet />

          <FloatButtonComponent />
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
        <TitleUpdater />
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
          </Route>
          <Route path="/admin" element={<AdminRoutes />}>
            <Route index element={<DashBoard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  );
}

export default App;
