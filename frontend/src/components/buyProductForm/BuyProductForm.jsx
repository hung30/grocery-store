import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";

const BuyProductForm = ({
  buttonText,
  error,
  onPurchase,
  classButtonName,
  countInStock = 0,
  userData,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const initialValues = {
    name: user?.name,
    telephone: user?.telephone,
    address: user?.address,
  };

  const showModal = () => {
    if (!user) {
      message.error("Vui lòng đăng nhập để mua hàng!");
      navigate("/login");
    } else {
      setIsModalVisible(true);
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (buttonText === "Mua ngay") {
          onPurchase({ ...values, userData });
        } else {
          error.length > 0 ? message.error("Lỗi!!!") : onPurchase(values);
        }
        setIsModalVisible(false);
      })
      .catch((errorInfo) => {
        message.error("Vui lòng kiểm tra lại thông tin!");
        console.log(errorInfo);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [form] = Form.useForm();
  return (
    <>
      <button
        className={
          classButtonName ||
          "flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-blue-500"
        }
        onClick={showModal}
      >
        {buttonText || "Mua hàng"}
      </button>
      <Modal
        title="Nhập thông tin mua hàng"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" initialValues={initialValues}>
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Nhập họ và tên của bạn" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="telephone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Số điện thoại phải có 10 chữ số!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input placeholder="Nhập địa chỉ giao hàng" />
          </Form.Item>
          {buttonText === "Mua ngay" && (
            <Form.Item
              label="Số lượng"
              name="quantity"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng cần mua" },
                {
                  pattern: /^-?[0-9]*[.,]?[0-9]+$/,
                  message: "Số lượng phải là số!",
                },
                {
                  validator: (_, value) =>
                    value > 0
                      ? Promise.resolve()
                      : Promise.reject("Số lượng phải lớn hơn 0!"),
                },
              ]}
            >
              <Input
                placeholder={`Nhập số lượng cần mua (<${countInStock} kg)`}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default BuyProductForm;
