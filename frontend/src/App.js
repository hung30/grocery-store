import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/homepage/HomePage";
import Product from "./pages/product/Product";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import LoginPage from "./pages/authpage/LoginPage";
import RegisterPage from "./pages/authpage/RegisterPage";

function App() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen max-w-screen-2xl mx-auto text-base">
      <Header />
      <div className="h-[70px]"></div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product" element={<Product />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
