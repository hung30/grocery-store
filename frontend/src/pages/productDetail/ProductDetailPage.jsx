import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingContext } from "../../contexts/LoadingContext";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { env } from "../../config/environment";
import { formatCurrency } from "../../utils/formatCurrency";
import BuyProductForm from "../../components/buyProductForm/BuyProductForm";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { addToCart } from "../../redux/cartSlice";

function ProductDetailPage() {
  const [product, setProduct] = useState({});
  const { productId } = useParams();
  const { setIsLoading } = useContext(LoadingContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  useEffect(() => {
    const product = async () => {
      try {
        setIsLoading(true);
        const res = await authorizedAxiosInstance.get(
          `${env.API_URL}/v1/products/${productId}`
        );
        setProduct(res.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    product();
  }, [setIsLoading, productId]);

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
      navigate("/cart");
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
    <div>
      <div className="text-3xl font-medium p-4 uppercase dark:text-white text-center">
        Chi tiết sản phẩm
      </div>
      <div className="container mx-auto lg:px-4 py-8 md:text-left text-center">
        <div className="flex flex-wrap ">
          <div className="w-full md:w-1/2 px-4 mb-8">
            <img
              src={product?.image?.url}
              alt={product?.image?.alt}
              className="w-full h-auto rounded-lg shadow-md mb-4 lg:h-[330px]"
            />
          </div>
          <div className="w-full md:w-1/2 px-4">
            <h2 className="text-3xl font-bold mb-2 dark:text-white">
              {product?.name}
            </h2>
            <p className="mb-4 text-blue-500">{product?._id}</p>
            <div className="mb-4">
              <span className="text-2xl font-bold mr-2 text-pink-500">
                {formatCurrency(product?.price)}
              </span>
            </div>

            <p className="text-gray-700 mb-6 dark:text-white">
              {product?.description}
            </p>

            <div className="mb-6 text-green-500">
              <div>Số lượng:</div>
              <div className="pt-2">{product?.countInStock}kg</div>
            </div>

            <div className="flex space-x-4 mb-6 justify-center md:justify-start items-center">
              <button
                className="bg-indigo-600 flex gap-2 items-center text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={handleCart(product?._id)}
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
                Thêm vào giỏ hàng
              </button>
              <BuyProductForm
                classButtonName="bg-gray-200 flex gap-2 items-center  text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                buttonText="Mua ngay"
                onPurchase={handlePurchase}
                countInStock={product?.countInStock}
                userData={{
                  productId: product?._id,
                  price: product?.price,
                  nameOrder: product?.name,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
