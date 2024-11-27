import { Button, Modal } from "antd";
import React, { useState } from "react";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { SearchOutlined } from "@ant-design/icons";

export default function ViewOrderDetail(props) {
  const { order, isAdminOrder = false } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <div>
      {isAdminOrder ? (
        <Button
          type="dashed"
          icon={<SearchOutlined />}
          onClick={showModal}
        ></Button>
      ) : (
        <button
          className="w-full inline-flex justify-center rounded-lg  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto"
          onClick={showModal}
        >
          Xem chi tiết
        </button>
      )}
      <Modal
        title={<span className="text-xl font-semibold">Chi tiết đơn hàng</span>}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="p-4">
          <p className="mb-2">
            <strong>Tên đơn hàng:</strong> {order?.nameOrder}
          </p>
          <p className="mb-2">
            <strong>Tên người đặt:</strong> {order?.userInfo?.name}
          </p>
          <p className="mb-2">
            <strong>Số điện thoại:</strong> {order?.userInfo?.telephone}
          </p>
          <p className="mb-2">
            <strong>Ngày đặt:</strong> {formatDate(order?.createdAt)}
          </p>
          <p className="mb-2">
            <strong>Địa chỉ nhận:</strong> {order?.userInfo?.address}
          </p>
          <p className="mb-2">
            <strong>Tổng giá:</strong> {formatCurrency(order?.totalPrice)}
          </p>
          <p className="mb-4">
            <strong>Trạng thái:</strong> {order?.statusInfo[0]?.statusName}
          </p>
          <h3 className="text-lg font-semibold mb-2">Danh sách món hàng:</h3>
          <ul className="list-disc pl-5">
            {order?.items?.map((item) => (
              <li key={item.productId} className="mb-2">
                <p>
                  <strong>Tên món hàng:</strong> {item?.productInfo?.name}
                </p>
                <p>
                  <strong>Số lượng:</strong> {item?.quantity} kg
                </p>
                <p>
                  <strong>Giá:</strong>{" "}
                  {formatCurrency(item?.productInfo?.price)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
}
