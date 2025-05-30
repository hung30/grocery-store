import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { formatCurrency } from "../../utils/formatCurrency";
import { LoadingContext } from "../../contexts/LoadingContext";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { env } from "../../config/environment";
import { message } from "antd";
import { clearCart, removeFromCart } from "../../redux/cartSlice";
import BuyProductForm from "../../components/buyProductForm/BuyProductForm";
import { Link } from "react-router-dom";

function CartPage() {
  // const cart = useSelector((state) => state.cart.cartItems);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState([]);
  const [errorText, setErrorText] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantities, setQuantities] = useState({});
  const { setIsLoading } = useContext(LoadingContext);
  const dispatch = useDispatch();

  useEffect(() => {
    const cartData = async () => {
      try {
        setIsLoading(true);
        const res = await authorizedAxiosInstance.get(`${env.API_URL}/v1/cart`);
        setCart(res.data);
        setIsLoading(false);
        return res.data;
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    cartData();
  }, [setIsLoading]);

  useEffect(() => {
    let total = 0;
    error.length === 0 &&
      cart.forEach((item) => {
        const quantity = quantities[item?.productId] || 1;
        const priceToInt = parseFloat(item?.products?.price);

        total += priceToInt * quantity;
      });
    setTotalPrice(total);
  }, [cart, quantities, error]);

  useEffect(() => {
    const storedQuantities = JSON.parse(localStorage.getItem("quantities"));
    if (storedQuantities) {
      setQuantities(storedQuantities);
    }
  }, []);

  const handleQuantityChange = (productId, countInStock) => (e) => {
    console.log(typeof countInStock);
    const value = e.target.value.trim();
    const numberRegex = /^-?[0-9]*[.,]?[0-9]+$/;
    if (!value || parseFloat(value) <= 0) {
      let newError = [...error];
      !newError.includes(productId) && newError.push(productId);
      setError(newError);

      if (!numberRegex.test(value)) {
        let newErrorText = errorText.filter(
          (item) => item.productId !== productId
        );
        newErrorText.push({ productId, message: "Số lượng phải là số" });
        setErrorText(newErrorText);
      } else {
        let newErrorText = errorText.filter(
          (item) => item.productId !== productId
        );
        newErrorText.push({ productId, message: "Số lượng phải lớn hơn 0" });
        setErrorText(newErrorText);
      }
    } else {
      setError(error.filter((id) => id !== productId));
      setErrorText(errorText.filter((item) => item.productId !== productId));

      if (parseFloat(value) > parseFloat(countInStock)) {
        let newError = [...error];
        !newError.includes(productId) && newError.push(productId);
        setError(newError);
        let newErrorText = errorText.filter(
          (item) => item.productId !== productId
        );
        newErrorText.push({
          productId,
          message: `Số lượng phải bé hơn ${countInStock}kg`,
        });
        setErrorText(newErrorText);
      } else {
        setError(error.filter((id) => id !== productId));
        setErrorText(errorText.filter((item) => item.productId !== productId));
        const newQuantity = parseFloat(value);

        const storedQuantities =
          JSON.parse(localStorage.getItem("quantities")) || {};
        storedQuantities[productId] = newQuantity;
        localStorage.setItem("quantities", JSON.stringify(storedQuantities));

        setQuantities({
          ...quantities,
          [productId]: newQuantity,
        });
      }
    }
  };

  const handleDeleteCart = async (productId) => {
    try {
      setIsLoading(true);
      await authorizedAxiosInstance.delete(
        `${env.API_URL}/v1/cart?productId=${productId}`
      );
      dispatch(removeFromCart(productId));
      setCart(cart.filter((item) => item.productId !== productId));
      message.success("Xóa sản phẩm thành công!");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handlePurchase = async (values) => {
    const { paymentMethod, ...valuesWithOutPaymentMethod } = values;
    let nameOrder = "";
    cart.forEach((item, index) => {
      nameOrder += item.products.name;
      if (index < cart.length - 1) {
        nameOrder += ", ";
      }
    });
    const orderItems = {
      nameOrder: nameOrder,
      userInfo: valuesWithOutPaymentMethod,
      items: cart.map((item) => {
        return {
          productId: item.productId,
          quantity: quantities[item.productId]
            ? quantities[item.productId].toString()
            : "1",
        };
      }),
      totalPrice: totalPrice.toString(),
    };
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const userId = user._id;
    try {
      if (values.paymentMethod === "1") {
        setIsLoading(true);
        await authorizedAxiosInstance.post(
          `${env.API_URL}/v1/orders`,
          orderItems
        );
        await authorizedAxiosInstance.delete(
          `${env.API_URL}/v1/cart/${userId}`
        );
        dispatch(clearCart());
        setCart([]);
        message.success("Đặt hàng thành công!");
        setIsLoading(false);
      } else if (values.paymentMethod === "2") {
        setIsLoading(true);
        const res = await authorizedAxiosInstance.post(
          `${env.API_URL}/v1/VNPay/create_payment_url`,
          orderItems
        );
        await authorizedAxiosInstance.delete(
          `${env.API_URL}/v1/cart/${userId}`
        );
        dispatch(clearCart());
        setCart([]);
        setIsLoading(false);
        if (res.data.paymentUrl) {
          window.location.href = res.data.paymentUrl;
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  return (
    <div className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl text-center font-semibold text-gray-900 dark:text-white sm:text-2xl sm:text-start">
          Giỏ hàng của bạn
        </h2>
        {cart?.length === 0 ? (
          <div className="dark:text-white">
            Chưa có sản phẩm nào trong giỏ hàng
          </div>
        ) : (
          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-2"
                  >
                    <div className="sm:flex items-center sm:justify-between sm:gap-4">
                      <div className="basis-2/6 flex items-center justify-center sm:justify-start mb-4">
                        <img
                          src={item.products.image.url}
                          alt={item.products.image.alt}
                          className="w-32 h-32 rounded-lg"
                        />
                      </div>
                      <div className="sm:text-start basis-1/6 text-center mb-4 sm:mb-0 dark:text-white">
                        <strong>{item.products.name}</strong>
                      </div>
                      <div className="basis-3/6 flex justify-center items-center gap-4 text-center">
                        <div className="basis-1/4">
                          <input
                            type="number"
                            placeholder="Nhập số kg"
                            min={0.1}
                            step={0.1}
                            onChange={handleQuantityChange(
                              item.productId,
                              item.products.countInStock
                            )}
                            className={`dark:bg-slate-100 w-28 border-[1px] rounded-md pl-2 relative ${
                              error.some((id) => id === item.productId)
                                ? "dark:border-[2px] border-red-500 outline-red-500"
                                : "border-gray-500"
                            }`}
                            defaultValue={quantities[item.productId] || 1}
                          />
                          {errorText.some(
                            (product) => product.productId === item.productId
                          ) && (
                            <p className="text-red-500 text-xs ">
                              {
                                errorText.find(
                                  (product) =>
                                    product.productId === item.productId
                                ).message
                              }
                            </p>
                          )}
                        </div>
                        <div className="basis-2/4 dark:text-white">
                          <strong>{formatCurrency(item.products.price)}</strong>
                        </div>
                        <div className="basis-1/4 text-end sm:text-center">
                          <button
                            onClick={() => handleDeleteCart(item.productId)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="ct-icon text-red-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  Tổng cộng
                </p>

                <div className="space-y-4">
                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="text-base font-bold text-gray-900 dark:text-white">
                      Tổng tiền
                    </dt>
                    <dd className="text-base font-bold text-gray-900 dark:text-white">
                      {formatCurrency(totalPrice)}
                    </dd>
                  </dl>
                </div>

                <BuyProductForm
                  buttonText="Mua hàng"
                  error={error}
                  onPurchase={handlePurchase}
                />

                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {" "}
                    hoặc{" "}
                  </span>
                  <Link
                    to="/product"
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 underline hover:no-underline dark:text-blue-500"
                  >
                    Mua sắm tiếp
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 12H5m14 0-4 4m4-4-4-4"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
