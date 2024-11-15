import React, { useContext, useEffect, useState } from "react";
// import { Products } from "./data";
import ReactPaginate from "react-paginate";
import "./Product.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";
import { LoadingContext } from "../../contexts/LoadingContext";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { env } from "../../config/environment";
import { message } from "antd";
import { addToCart } from "../../redux/cartSlice";
import BuyProductForm from "../../components/buyProductForm/BuyProductForm";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại bắt đầu từ 0
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [type, setType] = useState();
  const productsPerPage = 6; // Số lượng sản phẩm trên mỗi trang
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setIsLoading } = useContext(LoadingContext);
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const product = async () => {
      try {
        setIsLoading(true);
        const res = await authorizedAxiosInstance.get(
          `${env.API_URL}/v1/products`
        );
        setProducts(res.data);
        setTotalPage(Math.ceil(products.length / productsPerPage));
        setIsLoading(false);
        return res.data;
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    product();
  }, []);

  useEffect(() => {
    if (!products || products.length === 0) return;
    const filtered = type
      ? products.filter((product) => product.type.name === type)
      : products;
    setTotalPage(Math.ceil(filtered.length / 6));
    const start = currentPage * productsPerPage;
    const end = start + productsPerPage;
    setDisplayedProducts(filtered.slice(start, end));
  }, [currentPage, products, productsPerPage, type]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get("user");
    if (user) {
      const userInfo = JSON.parse(decodeURIComponent(user));
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      dispatch(loginSuccess(userInfo));
      navigate("/product");
    }
  }, [dispatch, navigate]);

  // Danh sách sản phẩm để hiển thị trên trang hiện tại

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  const handleTypeProductChange = (newType) => () => {
    setType(newType);
    setCurrentPage(0);
  };

  const handleCart = (productId) => async () => {
    if (!user) {
      message.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      navigate("/login");
      return;
    }
    try {
      setIsLoading(true);
      const res = await authorizedAxiosInstance.post(`${env.API_URL}/v1/cart`, {
        productId,
      });
      message.success("Thêm vào giỏ hàng thành công!");
      dispatch(addToCart(res.data));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handlePurchase = async (values) => {
    const data = {
      nameOrder: values.userData.nameOrder,
      userInfo: {
        name: values.name,
        telephone: values.telephone,
        address: values.address,
      },
      items: [
        { productId: values.userData.productId, quantity: values.quantity },
      ],
      totalPrice: (
        parseFloat(values.userData.price) * parseFloat(values.quantity)
      ).toString(),
    };
    try {
      setIsLoading(true);
      await authorizedAxiosInstance.post(`${env.API_URL}/v1/orders`, data);
      message.success("Đặt hàng thành công!");
      navigate("/order");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-4 mx-auto xl:px-24">
      <div className="text-3xl font-medium p-4 uppercase">Sản phẩm</div>
      <div className="flex flex-col md:flex-row w-full">
        <div className="basis-1/4 text-center flex flex-col md:block mb-4 md:mb-0">
          <div className="uppercase text-xl mb-4 md:mb-8">Danh mục</div>
          <ul className="flex flex-wrap gap-2 justify-center items-center md:block">
            <li>
              <button
                className={`border-[1px] border-gray-300 rounded-xl px-4 mb-2 hover:border-gray-500 ${
                  !type ? "border-gray-950" : ""
                }`}
                onClick={handleTypeProductChange()}
              >
                Tất cả sản phẩm
              </button>
            </li>
            {[...new Set(products.map((item) => item.type.name))].map(
              (item, index) => (
                <li key={index}>
                  <button
                    className={`border-[1px] border-gray-300 rounded-xl px-4 mb-2 hover:border-gray-500 ${
                      type === item ? "border-gray-950" : ""
                    }`}
                    onClick={handleTypeProductChange(item)}
                  >
                    {item}
                  </button>
                </li>
              )
            )}
          </ul>
        </div>
        <div className="basis-3/4 flex flex-col gap-4">
          <div className="flex flex-row gap-1.5 justify-center items-center px-4 sm:px-0">
            <div className="ct-form-item">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="px-4 py-2 w-[350px] bg-inherit border-[1px] border-gray-700 outline-none leading-5 hover:border-gray-300 duration-500 focus:border-gray-300 placeholder:uppercase placeholder:text-xs placeholder:tracking-widest placeholder:font-semibold"
              />
            </div>
            <div className="ct-form-item text-center">
              <button className="uppercase bg-blue-400 text-yellow-100 tracking-wider px-2 py-2 text-xs font-semibold rounded hover:bg-opacity-80 h-[37.6px] w-max">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="">
            <div className="xl:px-[305px] xl:text-left text-center text-2xl">
              {type
                ? type.charAt(0).toUpperCase() + type.slice(1)
                : "Tất cả sản phẩm"}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center xl:justify-normal">
            {displayedProducts.map((item) => (
              <div
                key={item._id}
                className="ct-card-item w-[180px] sm:w-[200px] lg:w-[242px] flex flex-col justify-center items-center border-[1px] border-gray-700 p-4"
              >
                <a href={`/product-detail/${item._id}`}>
                  <img
                    src={item.image.url}
                    alt={item.name.alt}
                    className="w-[200px] h-[200px]"
                  />
                </a>
                <div className="text-xl font-semibold mt-2">{item.name}</div>
                <div className="text-base mt-2">
                  Giá: {item.price} <sup>đ/kg</sup>
                </div>
                <div className="text-base mt-2">
                  Số lượng: {item.countInStock} <sup>kg</sup>
                </div>
                <div className="ct-form-item mt-3 text-center flex gap-2 w-full">
                  <button
                    onClick={handleCart(item._id)}
                    className="uppercase bg-blue-400 text-yellow-100 tracking-wider text-xs font-semibold rounded hover:bg-opacity-80 p-2 w-4/5 lg:w-full basis-1/3"
                  >
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
                  </button>
                  <BuyProductForm
                    classButtonName="basis-2/3 bg-blue-400 uppercase text-yellow-100 tracking-wider text-xs font-semibold rounded hover:bg-opacity-80"
                    buttonText="Mua ngay"
                    onPurchase={handlePurchase}
                    countInStock={item.countInStock}
                    userData={{
                      productId: item._id,
                      price: item.price,
                      nameOrder: item.name,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <ReactPaginate
            previousLabel="Trước"
            nextLabel="Tiếp"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            pageCount={totalPage}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName="pagination"
            activeClassName="active"
            forcePage={currentPage}
          />
        </div>
      </div>
    </div>
  );
}
