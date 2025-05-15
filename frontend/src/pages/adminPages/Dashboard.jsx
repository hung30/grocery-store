import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Space, Statistic, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { env } from "../../config/environment";
import { formatCurrency } from "./../../utils/formatCurrency";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function DashBoard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [ordersWaiting, setOrdersWaiting] = useState([]);
  const [ordersDone, setOrdersDone] = useState(0);
  const [orderCancel, setOrderCancel] = useState([]);

  useEffect(() => {
    const getAllOrders = async () => {
      try {
        const res = await authorizedAxiosInstance.get(
          `${env.API_URL}/v1/orders/admin`
        );
        setOrders(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const getAllProducts = async () => {
      try {
        const res = await authorizedAxiosInstance.get(
          `${env.API_URL}/v1/products`
        );
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const getAllUsers = async () => {
      try {
        const res = await authorizedAxiosInstance.get(
          `${env.API_URL}/v1/users`
        );
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllOrders();
    getAllProducts();
    getAllUsers();
  }, []);

  useEffect(() => {
    const revenue = orders.reduce((acc, order) => {
      if (
        order.statusInfo[0].statusName !== "Đã huỷ" &&
        order.statusInfo[0].statusName !== "Chờ xác nhận" &&
        order.statusInfo[0].statusName !== "Chờ thanh toán"
      ) {
        return acc + parseFloat(order.totalPrice);
      }
      return acc;
    }, 0);
    setRevenue(revenue);

    const ordersWaiting = orders.filter((order) => {
      return order.statusInfo[0].statusName === "Chờ xác nhận";
    });
    setOrdersWaiting(ordersWaiting);

    const orderCancel = orders.filter((order) => {
      return order.statusInfo[0].statusName === "Đã huỷ";
    });
    setOrderCancel(orderCancel);

    setOrdersDone(orders.length - ordersWaiting.length - orderCancel.length);
  }, [orders]);

  return (
    <div className="pl-3 mt-5">
      <Space size={20} direction="vertical">
        <Typography.Title level={4}>Dashboard</Typography.Title>
        <Space direction="horizontal">
          <DashboardCard
            icon={
              <ShoppingCartOutlined
                style={{
                  color: "green",
                  backgroundColor: "rgba(0,255,0,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Lượt đặt hàng"}
            value={orders.length}
          />
          <DashboardCard
            icon={
              <ClockCircleOutlined
                style={{
                  color: "green",
                  backgroundColor: "rgba(255, 255, 0, 0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Chờ xử lý"}
            value={ordersWaiting.length}
          />
          <DashboardCard
            icon={
              <CheckCircleOutlined
                style={{
                  color: "orange",
                  backgroundColor: "rgba(255,165,0,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Đã xử lý"}
            value={ordersDone}
          />
          <DashboardCard
            icon={
              <CloseCircleOutlined
                style={{
                  color: "gray",
                  backgroundColor: "rgba(128, 128, 128, 0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Đã huỷ"}
            value={orderCancel.length}
          />
          <DashboardCard
            icon={
              <ShoppingOutlined
                style={{
                  color: "blue",
                  backgroundColor: "rgba(0,0,255,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Sản phẩm hiện có"}
            value={products.length}
          />
          <DashboardCard
            icon={
              <UserOutlined
                style={{
                  color: "purple",
                  backgroundColor: "rgba(0,255,255,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Số lượng khách hàng"}
            value={users.length}
          />
          <DashboardCard
            icon={
              <DollarCircleOutlined
                style={{
                  color: "red",
                  backgroundColor: "rgba(255,0,0,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Doanh thu"}
            value={formatCurrency(revenue)}
          />
        </Space>
        <Space style={{ marginTop: 20 }}>
          <RecentOrders />
          <DashboardChart />
        </Space>
      </Space>
    </div>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <Card>
      <Space direction="horizontal">
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}
function RecentOrders() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllOrders = async () => {
      try {
        setLoading(true);
        const res = await authorizedAxiosInstance.get(
          `${env.API_URL}/v1/orders/admin`
        );
        const ordersWaiting = res.data.filter((order) => {
          return order.statusInfo[0].statusName === "Chờ xác nhận";
        });

        const sortedData = ordersWaiting.sort((a, b) => {
          return b.createdAt - a.createdAt;
        });

        setRecentOrders(sortedData.slice(0, 3));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    getAllOrders();
  }, []);

  return (
    <>
      <Typography.Text>Đơn đặt gần đây</Typography.Text>
      <Table
        columns={[
          {
            title: "Tên",
            dataIndex: "nameOrder",
          },
          {
            title: "Số lượng",
            dataIndex: "quantity",
          },
          {
            title: "Giá",
            dataIndex: "totalPrice",
          },
        ]}
        loading={loading}
        dataSource={recentOrders.map((order) => {
          return {
            key: order._id,
            nameOrder: order.nameOrder,
            quantity:
              order.items
                .reduce((acc, item) => {
                  return acc + parseFloat(item.quantity);
                }, 0)
                .toString() + " kg",
            totalPrice: formatCurrency(
              parseFloat(order.totalPrice).toFixed(2).toString()
            ),
          };
        })}
        pagination={false}
      ></Table>
    </>
  );
}

function DashboardChart() {
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const getMonthlyRevenue = async () => {
      try {
        const res = await authorizedAxiosInstance.get(
          `${env.API_URL}/v1/orders/admin`
        );
        const ordersDone = res.data.filter((order) => {
          return (
            order.statusInfo[0].statusName !== "Chờ xác nhận" &&
            order.statusInfo[0].statusName !== "Đã huỷ" &&
            order.statusInfo[0].statusName !== "Chờ thanh toán"
          );
        });
        const monthlyRevenue = ordersDone.reduce((acc, order) => {
          const month = new Date(order.createdAt).getMonth();
          const year = new Date(order.createdAt).getFullYear();
          const key = `${month + 1}-${year}`;
          if (!acc[key]) {
            acc[key] = 0;
          }
          acc[key] += parseFloat(order.totalPrice);
          return acc;
        }, {});

        const labels = Object.keys(monthlyRevenue);
        const data = Object.values(monthlyRevenue);

        const dataSource = {
          labels,
          datasets: [
            {
              label: "Revenue",
              data: data,
              backgroundColor: "rgba(255, 0, 0, 1)",
            },
          ],
        };

        setRevenueData(dataSource);
      } catch (error) {
        console.log(error);
      }
    };

    getMonthlyRevenue();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Doanh thu theo tháng",
      },
    },
  };

  return (
    <Card style={{ width: 500, height: 250 }}>
      <Bar options={options} data={revenueData} />
    </Card>
  );
}

export default DashBoard;
