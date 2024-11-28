import { DeleteOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  message,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/formatCurrency";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { env } from "../../config/environment";
import ButtonAddProductForm from "../../components/buttonActionForProductForm/ButtonAddProductForm";
import ButtonUpdateProductForm from "../../components/buttonActionForProductForm/ButtonUpdateProductForm";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const products = async () => {
      try {
        setLoading(true);
        const res = await authorizedAxiosInstance.get(
          `${env.API_URL}/v1/products`
        );
        setProducts(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    products();
  }, []);

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const res = await authorizedAxiosInstance.post(
        `${env.API_URL}/v1/products`,
        values,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProducts([...products, res.data]);
      setLoading(false);
      message.success("Thêm sản phẩm thành công!");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await authorizedAxiosInstance.delete(
        `${env.API_URL}/v1/products/${productId}`
      );
      setProducts(products.filter((product) => product._id !== productId));
      message.success("Xoá sản phẩm thành công!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateProduct = async (values, productId) => {
    try {
      setLoading(true);
      const res = await authorizedAxiosInstance.put(
        `${env.API_URL}/v1/products/${productId}`,
        values,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProducts(
        products.map((product) => {
          if (product._id === productId) {
            return res.data;
          }
          return product;
        })
      );
      setLoading(false);
      message.success("Cập nhật sản phẩm thành công!");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="p-5 w-full">
      <Space size={20} direction="vertical" style={{ width: "100%", gap: 10 }}>
        <div className="flex justify-between">
          <Typography.Title level={4}>Sản phẩm</Typography.Title>
          <ButtonAddProductForm onUpdate={handleUpdate} />
        </div>
        <Table
          loading={loading}
          columns={[
            {
              title: "Ảnh",
              dataIndex: "image",
              render: (link) => {
                return <Avatar src={link.url} alt={link.alt} />;
              },
            },
            {
              title: "Tên sản phẩm",
              dataIndex: "name",
            },
            {
              title: "Giá",
              dataIndex: "price",
              render: (price) => <span>{formatCurrency(price)}</span>,
              sorter: (a, b) => b.price - a.price,
            },
            {
              title: "Số lượng",
              dataIndex: "countInStock",
              render: (countInStock) => (
                <span>{parseFloat(countInStock).toFixed(2).toString()} kg</span>
              ),
              sorter: (a, b) => b.countInStock - a.countInStock,
            },
            {
              title: "Mô tả",
              dataIndex: "description",
            },

            {
              title: "Loại",
              dataIndex: "type",
              render: (type) => <span>{type.name}</span>,
              filters: Array.from(
                new Set(products.map((product) => product.type.name))
              ).map((type) => ({ text: type, value: type })),
              onFilter: (value, record) => record.type.name.includes(value),
            },
            {
              title: "Hành động",
              key: "actions",
              width: "1%",
              render: (text, record) => {
                return (
                  <Space>
                    {/*BUTTON XÓA DỮ LIỆU */}
                    <Popconfirm
                      style={{ width: 800 }}
                      title="Bạn có chắc muốn xoá sản phẩm này không?"
                      onConfirm={() => handleDeleteProduct(record._id)}
                      onCancel={() => {}}
                      okText="Đồng ý"
                      cancelText="Đóng"
                    >
                      <Button danger type="dashed" icon={<DeleteOutlined />} />
                    </Popconfirm>
                    {/*BUTTON UPDATE DỮ LIỆU */}
                    <ButtonUpdateProductForm
                      onProduct={record}
                      onUpdate={(formData) =>
                        handleUpdateProduct(formData, record._id)
                      }
                    />
                  </Space>
                );
              },
            },
          ]}
          dataSource={products.map((product) => ({
            ...product,
            key: product._id,
          }))}
          pagination={{
            pageSize: 5,
            position: ["bottomCenter"],
          }}
        ></Table>
      </Space>
    </div>
  );
}

export default Inventory;
