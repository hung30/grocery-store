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
import LoginPage from "./pages/authpage/LoginPage";
import RegisterPage from "./pages/authpage/RegisterPage";
import NewsPage from "./pages/authpage/NewsPage";
import CartPage from "./pages/cartpage/CartPage";
import AdminLayout from "./layouts/AdminLayout";
import { LoadingContext, LoadingProvider } from "./contexts/LoadingContext";
import { useContext } from "react";
import Spinner from "./components/spinner/Spinner";
import ForgotPasswordPage from "./pages/authpage/ForgotPassWordPage";

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
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen max-w-screen-2xl mx-auto text-base">
      {!isAdminRoute && <div className="h-[70px]"></div>}
      {!isAdminRoute && <Header />}
      <LoadingSpin />
      <Outlet />
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <LoadingProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/product" element={<Product />} />
            <Route path="/news" element={<NewsPage />} />

            <Route element={<UnauthorizedRoutes />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            <Route element={<ProtectedRoutes />}>
              <Route path="/cart" element={<CartPage />} />
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
