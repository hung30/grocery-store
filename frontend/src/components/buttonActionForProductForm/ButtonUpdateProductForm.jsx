import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, InputNumber, Modal, Upload, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import TypeSelect from "../typeSelect/TypeSelect";
import { urlToFile } from "../../utils/urlToFile";

function ButtonUpdateProductForm(props) {
  const { onProduct, onUpdate } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (onProduct.image && onProduct.image.url) {
      setFileList([
        {
          uid: `${onProduct._id}_${Date.now()}`,
          name: `${onProduct._id}_oldImage.png`,
          status: "done",
          url: onProduct.image.url,
        },
      ]);
    }
  }, [onProduct]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("typeId", values.typeId);
      formData.append("price", values.price.toString());
      formData.append("countInStock", values.countInStock.toString());
      if (fileList.length > 0) {
        const file = fileList[0];
        if (file.url) {
          const convertedFile = await urlToFile(
            file.url,
            `${onProduct._id}_oldImage.jpg`,
            "image/jpeg"
          );
          formData.append("image", convertedFile);
        } else if (file.originFileObj) {
          formData.append("image", file.originFileObj);
        }
      }

      formData.append("alt", values.alt);
      formData.append("description", values.description);
      onUpdate(formData);
      setFileList([]);
      setIsModalVisible(false);
    } catch (errorInfo) {
      message.error("Vui lòng kiểm tra lại thông tin!");
      console.log(errorInfo);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleTypeSelect = (value) => {
    form.setFieldsValue({ typeId: value });
  };

  const initialValues = {
    name: onProduct.name,
    typeId: onProduct.type._id,
    price: onProduct.price,
    countInStock: onProduct.countInStock,
    alt: onProduct.image.alt,
    description: onProduct.description,
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };
  const [form] = Form.useForm();

  return (
    <>
      <Button type="dashed" icon={<EditOutlined />} onClick={showModal} />
      <Modal
        title="Cập nhật sản phẩm"
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
            <TypeSelect
              onTypeSelect={handleTypeSelect}
              value={form.getFieldValue("typeId")}
            />
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
          <Form.Item label="Hình minh hoạ" name="image">
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              showUploadList={true}
              listType="picture"
              beforeUpload={() => {
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
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

export default ButtonUpdateProductForm;
