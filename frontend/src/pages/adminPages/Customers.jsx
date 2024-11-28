import { Button, message, Popconfirm, Space, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { env } from "../../config/environment";
import { DeleteOutlined } from "@ant-design/icons";

function Customers() {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await authorizedAxiosInstance.get(`${env.API_URL}/v1/users`);
      const filteredCustomers = res.data.filter(
        (customer) => !customer.isAdmin
      );
      setCustomers(filteredCustomers);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (customerId) => {
    try {
      await authorizedAxiosInstance.delete(
        `${env.API_URL}/v1/users/${customerId}`
      );
      setCustomers(customers.filter((customer) => customer._id !== customerId));
      message.success("Xoá khách hàng thành công!");
    } catch (error) {
      message.error("Xoá khách hàng thất bại!");
      console.log(error);
    }
  };

  return (
    <div className="p-5 w-full">
      <Space size={20} direction="vertical" style={{ width: "100%", gap: 10 }}>
        <Typography.Title level={4}>Khách hàng</Typography.Title>
        <Table
          loading={loading}
          columns={[
            {
              title: "Tên khách hàng",
              dataIndex: "name",
            },
            {
              title: "Email",
              dataIndex: "email",
            },
            {
              title: "Số điện thoại",
              dataIndex: "telephone",
              render: (telephone) => (telephone ? telephone : "Chưa cập nhật"),
            },
            {
              title: "Địa chỉ",
              dataIndex: "address",
              render: (address) => (address ? address : "Chưa cập nhật"),
            },
            {
              title: "Hành động",
              key: "action",
              width: "1%",
              render: (record) => {
                return (
                  <Popconfirm
                    style={{ width: 800 }}
                    title="Bạn có chắc muốn xoá người này không?"
                    onConfirm={() => handleDeleteCustomer(record._id)}
                    onCancel={() => {}}
                    okText="Đồng ý"
                    cancelText="Đóng"
                  >
                    <Button danger type="dashed" icon={<DeleteOutlined />} />
                  </Popconfirm>
                );
              },
            },
          ]}
          dataSource={customers.map((customer) => ({
            ...customer,
            key: customer._id,
          }))}
          pagination={{ pageSize: 10, position: ["bottomCenter"] }}
        ></Table>
      </Space>
    </div>
  );
}

export default Customers;
