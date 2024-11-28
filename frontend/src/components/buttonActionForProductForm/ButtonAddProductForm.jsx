import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, message, Modal, Upload } from "antd";
import React, { useState } from "react";
import TypeSelect from "../typeSelect/TypeSelect";

function ButtonAddProductForm(props) {
  const { onUpdate } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const initialValues = {
    name: "",
    typeId: "",
    price: 1000,
    countInStock: 1,
    image: "",
    alt: "",
    description: "",
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("typeId", values.typeId);
        formData.append("price", values.price.toString());
        formData.append("countInStock", values.countInStock.toString());
        formData.append("image", values.image.file);
        formData.append("alt", values.alt);
        formData.append("description", values.description);
        onUpdate(formData);
        form.resetFields();
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

  const handleTypeSelect = (value) => {
    form.setFieldsValue({ typeId: value });
  };

  const [form] = Form.useForm();

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Thêm sản phẩm
      </Button>
      <Modal
        title="Thêm sản phẩm"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" initialValues={initialValues}>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên sản phẩm" },
              { min: 2, message: "Tên sản phẩm phải có ít nhất 2 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>
          <Form.Item
            label="Danh mục sản phẩm"
            name="typeId"
            rules={[{ required: true, message: "Chưa chọn danh mục sản phẩm" }]}
          >
            <TypeSelect onTypeSelect={handleTypeSelect} />
          </Form.Item>
          <Form.Item
            label="Giá(VNĐ)"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
          >
            <InputNumber
              placeholder="Nhập giá tiền"
              min={1000}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label="Số lượng(kg)"
            name="countInStock"
            rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
          >
            <InputNumber
              placeholder="Nhập số lượng"
              step={0.1}
              min={1}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label="Hình minh hoạ"
            name="image"
            rules={[{ required: true, message: "Vui lòng nhập hình ảnh!" }]}
          >
            <Upload
              showUploadList={true}
              beforeUpload={() => {
                return false;
              }}
            >
              <Button style={{ marginLeft: 50 }} icon={<UploadOutlined />}>
                Chọn hình ảnh
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Nội dung của ảnh"
            name="alt"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung của ảnh" },
              { min: 2, message: "Nội dung của ảnh phải có ít nhất 2 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập nội dung của ảnh" />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả sản phẩm!" },
              { min: 10, message: "Mô tả phải có ít nhất 10 ký tự!" },
            ]}
          >
            <Input.TextArea placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ButtonAddProductForm;
