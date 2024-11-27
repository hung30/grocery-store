import { Space, Table, Tag, Typography } from "antd";
import React, { useEffect, useState } from "react";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { env } from "../../config/environment";
import { formatDate } from "./../../utils/formatDate";
import ViewOrderDetail from "../../components/viewOrderDetail/ViewOrderDetail";
import UpdateStatusForm from "../../components/buttonActionForUpdateOrderForm/UpdateStatusForm";

function Orders() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await authorizedAxiosInstance.get(
        `${env.API_URL}/v1/orders/admin`
      );
      res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <div className="p-5 w-full">
      <Space size={20} direction="vertical" style={{ width: "100%", gap: 10 }}>
        <Typography.Title level={4}>Đơn đặt</Typography.Title>
        <Table
          loading={loading}
          columns={[
            {
              title: "Tên khách hàng",
              dataIndex: "userInfo",
              render: (userInfo) => userInfo.name,
            },
            {
              title: "Đơn hàng",
              dataIndex: "nameOrder",
              render: (nameOrder) => nameOrder,
            },
            {
              title: "Tổng tiền",
              dataIndex: "totalPrice",
            },
            {
              title: "Trạng thái",
              dataIndex: "statusInfo",
              render: (statusInfo) => {
                switch (statusInfo[0].statusName) {
                  case "Đã xác nhận":
                    return <Tag color="green">{statusInfo[0].statusName}</Tag>;
                  case "Đang vận chuyển":
                    return <Tag color="yellow">{statusInfo[0].statusName}</Tag>;
                  case "Đã giao hàng":
                    return <Tag color="pink">{statusInfo[0].statusName}</Tag>;
                  case "Đã huỷ":
                    return <Tag color="red">{statusInfo[0].statusName}</Tag>;
                  default:
                    return <Tag color="blue">{statusInfo[0].statusName}</Tag>;
                }
              },
              filters: [
                { text: "Chờ xác nhận", value: "Chờ xác nhận" },
                { text: "Đã xác nhận", value: "Đã xác nhận" },
                { text: "Đang vận chuyển", value: "Đang vận chuyển" },
                { text: "Đã giao hàng", value: "Đã giao hàng" },
                { text: "Đã huỷ", value: "Đã huỷ" },
              ],
              onFilter: (value, record) =>
                record.statusInfo[0].statusName === value,
            },
            {
              title: "Ngày đặt",
              dataIndex: "createdAt",
              render: (createdAt) => formatDate(createdAt),
              sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            },
            {
              title: "Hành động",
              key: "action",
              width: "1%",
              render: (text, record) => {
                return (
                  <Space>
                    <ViewOrderDetail order={record} isAdminOrder={true} />
                    <UpdateStatusForm
                      onOrder={record}
                      onUpdateSuccess={fetchOrders}
                    />
                  </Space>
                );
              },
            },
          ]}
          dataSource={orders.map((order) => ({
            ...order,
            key: order._id,
          }))}
          pagination={{ pageSize: 10, position: ["bottomCenter"] }}
        ></Table>
      </Space>
    </div>
  );
}

export default Orders;
