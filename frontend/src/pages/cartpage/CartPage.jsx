import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatCurrency } from "../../utils/formatCurrency";
import { LoadingContext } from "../../contexts/LoadingContext";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { env } from "../../config/environment";
import { message } from "antd";
import { setCart } from "../../redux/cartSlice";

function CartPage() {
  const cart = useSelector((state) => state.cart.cartItems);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantities, setQuantities] = useState({});
  const { setIsLoading } = useContext(LoadingContext);
  const dispatch = useDispatch();

  useEffect(() => {
    let total = 0;
    cart.forEach((item) => {
      const quantity = quantities[item.productId] || 1;
      const priceToInt = parseInt(item.products.price);

      total += priceToInt * quantity;
      console.log(total);
    });
    setTotalPrice(total);
  }, [cart, quantities]);

  const handleQuantityChange = (productId) => (e) => {
    const newQuantity = parseFloat(e.target.value);
    setQuantities({
      ...quantities,
      [productId]: newQuantity,
    });
  };

  const handleDeleteCart = async (productId) => {
    try {
      setIsLoading(true);
      await authorizedAxiosInstance.delete(
        `${env.API_URL}/v1/cart?productId=${productId}`
      );
      message.success("Xóa sản phẩm thành công!");
      dispatch(setCart(cart.filter((item) => item.productId !== productId)));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <div class="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 class="text-xl text-center font-semibold text-gray-900 dark:text-white sm:text-2xl sm:text-start">
          Giỏ hàng của bạn
        </h2>
        {cart.length === 0 ? (
          <div>Chưa có sản phẩm nào trong giỏ hàng</div>
        ) : (
          <div class="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div class="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <div class="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-2"
                  >
                    <div class="sm:flex items-center sm:justify-between sm:gap-4">
                      <div className="basis-2/6 flex items-center justify-center sm:justify-start mb-4">
                        <img
                          src={item.products.image.url}
                          alt={item.products.image.alt}
                          class="w-32 h-32 rounded-lg"
                        />
                      </div>
                      <div className="sm:text-start basis-1/6 text-center mb-4">
                        <strong>{item.products.name}</strong>
                      </div>
                      <div className="basis-3/6 flex justify-center gap-4 text-center">
                        <div className="basis-1/4">
                          <input
                            type="number"
                            placeholder="Nhập số kg"
                            min={1}
                            step={0.1}
                            onChange={handleQuantityChange(item.productId)}
                            className="w-28 border-[1px]  border-gray-500 rounded-md pl-2"
                            defaultValue={1}
                          />
                        </div>
                        <div className="basis-2/4">
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

            <div class="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <div class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <p class="text-xl font-semibold text-gray-900 dark:text-white">
                  Tổng cộng
                </p>

                <div class="space-y-4">
                  <dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt class="text-base font-bold text-gray-900 dark:text-white">
                      Tổng tiền
                    </dt>
                    <dd class="text-base font-bold text-gray-900 dark:text-white">
                      {formatCurrency(totalPrice)}
                    </dd>
                  </dl>
                </div>

                <button class="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-blue-500">
                  Mua ngay
                </button>

                <div class="flex items-center justify-center gap-2">
                  <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {" "}
                    hoặc{" "}
                  </span>
                  <a
                    href="/product"
                    title=""
                    class="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                  >
                    Mua sắm tiếp
                    <svg
                      class="h-5 w-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 12H5m14 0-4 4m4-4-4-4"
                      />
                    </svg>
                  </a>
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
