import React, { useContext, useEffect, useMemo, useState } from "react";
import { formatCurrency } from "./../../utils/formatCurrency";
import ViewOrderDetail from "../../components/viewOrderDetail/ViewOrderDetail";
import { LoadingContext } from "../../contexts/LoadingContext";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { env } from "../../config/environment";
import { formatDate } from "../../utils/formatDate";
import OrderStatus from "../../components/orderStatus/OrderStatus";
import { message, Pagination } from "antd";
import moment from "moment";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(5);
  const [totalOrders, setTotalOrders] = useState(0);
  const [orderType, setOrderType] = useState("tat-ca-don");
  const [duration, setDuration] = useState("this-week");
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    const order = async () => {
      try {
        setIsLoading(true);
        const res = await authorizedAxiosInstance.get(
          `${env.API_URL}/v1/orders`
        );
        setOrders(res.data.orders);
        setTotalOrders(res.data.totalOrders);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    order();
  }, [setIsLoading]);

  useEffect(() => {
    setCurrentPage(1);
  }, [orderType, duration]);

  const handleCancelOrder = async (id) => {
    const confirmCancel = window.confirm(
      "Bạn có chắc chắc muốn huỷ đơn hàng này không?"
    );
    if (confirmCancel) {
      try {
        setIsLoading(true);
        const res = await authorizedAxiosInstance.put(
          `${env.API_URL}/v1/orders/${id}`,
          {
            statusId: "67321305f823c69a6e65659f",
          }
        );
        setOrders(res.data.orders);
        message.success("Huỷ đơn hàng thành công!");
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }
  };
  const handleOrderAgain = async (order) => {
    const confirmOrderAgain = window.confirm("Bạn có muốn mua lại đơn hàng?");
    if (confirmOrderAgain) {
      const data = {
        nameOrder: order.nameOrder,
        userInfo: order.userInfo,
        items: order.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        totalPrice: order.totalPrice,
      };
      try {
        setIsLoading(true);
        const res = await authorizedAxiosInstance.post(
          `${env.API_URL}/v1/orders`,
          {
            ...data,
          }
        );
        const newOrders = [...orders, res.data.order];
        setOrders(newOrders);
        setOrderType("tat-ca-don");
        setDuration("this-week");
        setCurrentPage(1);
        message.success("Mua lại đơn hàng thành công!");
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }
  };

  const handlePageSizeChange = (current, size) => {
    setOrdersPerPage(size);
    setCurrentPage(1);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = moment(order.createdAt);
      let isValid = true;

      if (orderType !== "tat-ca-don") {
        isValid = order.statusInfo[0].statusName === orderType;
      }

      if (isValid) {
        switch (duration) {
          case "this-week":
            isValid = orderDate.isSame(moment(), "week");
            break;
          case "today":
            isValid = orderDate.isSame(moment(), "day");
            break;
          case "this-month":
            isValid = orderDate.isSame(moment(), "month");
            break;
          case "last-3-months":
            isValid = orderDate.isAfter(moment().subtract(3, "months"));
            break;
          case "last-6-months":
            isValid = orderDate.isAfter(moment().subtract(6, "months"));
            break;
          case "this-year":
            isValid = orderDate.isSame(moment(), "year");
            break;
          default:
            isValid = true;
        }
      }

      return isValid;
    });
  }, [orders, orderType, duration]);

  useEffect(() => {
    setTotalOrders(filteredOrders.length);
  }, [filteredOrders]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  return (
    <div className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-5xl">
          <div className="gap-4 sm:flex sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Đơn của tôi
            </h2>

            <div className="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
              <div>
                <label
                  htmlFor="order-type"
                  className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Chọn loại đơn
                </label>
                <select
                  id="order-type"
                  className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <option value="tat-ca-don">Tất cả đơn</option>
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Đang vận chuyển">Đang vận chuyển</option>
                  <option value="Đã giao hàng">Đã giao hàng</option>
                  <option value="Đã huỷ">Đã hủy</option>
                </select>
              </div>

              <span className="inline-block text-gray-500 dark:text-gray-400">
                {" "}
                từ{" "}
              </span>

              <div>
                <label
                  htmlFor="duration"
                  className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Chọn khoảng thời gian
                </label>
                <select
                  id="duration"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="this-week">Tuần này</option>
                  <option value="today">Hôm nay</option>
                  <option value="this-month">Tháng này</option>
                  <option value="last-3-months">Ba tháng gần đây</option>
                  <option value="lats-6-months">Sáu tháng gần đây</option>
                  <option value="this-year">Năm nay</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flow-root sm:mt-8">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentOrders.length !== 0 ? (
                currentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex flex-wrap items-center gap-y-4 py-6"
                  >
                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                        Tên đơn hàng
                      </dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                        {order?.nameOrder?.length < 50
                          ? order?.nameOrder
                          : order?.nameOrder?.slice(0, 50) + "..."}
                      </dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                        Ngày đặt:
                      </dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                        {formatDate(order?.createdAt)}
                      </dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                        Tổng Giá:
                      </dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(order?.totalPrice)}
                      </dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                        Trạng thái:
                      </dt>
                      <OrderStatus
                        statusName={order?.statusInfo[0].statusName}
                      />
                    </dl>

                    {order?.statusInfo[0].statusName === "Đã giao hàng" ||
                    order?.statusInfo[0].statusName === "Đã huỷ" ? (
                      <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
                        <button
                          type="button"
                          className="w-full rounded-lg bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 lg:w-auto min-w-[80px]"
                          onClick={() => handleOrderAgain(order)}
                        >
                          Mua lại
                        </button>
                        <ViewOrderDetail order={order} />
                      </div>
                    ) : order?.statusInfo[0].statusName === "Chờ xác nhận" ||
                      order?.statusInfo[0].statusName === "Đã xác nhận" ? (
                      <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
                        <button
                          type="button"
                          className="w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 lg:w-auto"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          Huỷ đơn
                        </button>
                        <ViewOrderDetail order={order} />
                      </div>
                    ) : (
                      <div className="w-full  lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
                        <ViewOrderDetail order={order} />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div>Không có đơn hàng nào</div>
              )}
            </div>
          </div>
          <nav className="mt-6 flex items-center justify-center sm:mt-8">
            <Pagination
              current={currentPage}
              pageSize={ordersPerPage}
              total={totalOrders}
              showSizeChanger
              pageSizeOptions={["5", "10", "15", "20", "50"]}
              onChange={(page) => setCurrentPage(page)}
              onShowSizeChange={handlePageSizeChange}
            />
          </nav>
        </div>
      </div>
    </div>
  );
}
