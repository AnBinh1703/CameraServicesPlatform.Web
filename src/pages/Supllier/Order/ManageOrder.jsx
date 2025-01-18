import { ShoppingCartOutlined } from "@ant-design/icons";
import { Card, DatePicker, message, Row, Space, Tabs, Typography } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import {
  getCalculateTotalRevenueBySupplier,
  getMonthOrderCostStatisticsBySupplier,
  getSupplierOrderStatistics,
} from "../../../api/dashboardApi";
import OrderListBySuplier from "../Order/OrderListBySuplier";

const { Text } = Typography;
const { RangePicker } = DatePicker;

const ManageOrder = () => {
  const [refreshList, setRefreshList] = useState(false);
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    orderCostStatistics: [],
    orderStatistics: {},
    totalRevenue: 0,
  });
  const [startDate, setStartDate] = useState(() =>
    dayjs().subtract(1, "month")
  );
  const [endDate, setEndDate] = useState(() => dayjs());
  const [collapseStates, setCollapseStates] = useState({
    costStats: true,
    orderStats: true,
  });

  const fetchSupplierId = async () => {
    if (user.id) {
      try {
        const response = await getSupplierIdByAccountId(user.id);
        if (response?.isSuccess) {
          setSupplierId(response.result);
        } else {
          message.error("Không thể lấy ID nhà cung cấp.");
        }
      } catch {
        message.error("Lỗi khi lấy ID nhà cung cấp.");
      }
    }
  };

  const fetchDashboardData = async () => {
    if (supplierId) {
      try {
        setLoading(true);
        const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
        const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");

        const [orderCostStatistics, orderStatistics, totalRevenue] =
          await Promise.all([
            getMonthOrderCostStatisticsBySupplier(
              supplierId,
              formattedStartDate,
              formattedEndDate
            ),
            getSupplierOrderStatistics(
              supplierId,
              formattedStartDate,
              formattedEndDate
            ),
            getCalculateTotalRevenueBySupplier(supplierId),
          ]);

        console.log("Order Cost Statistics:", orderCostStatistics);
        console.log("Order Statistics:", orderStatistics);
        console.log("Total Revenue:", totalRevenue);

        setData({
          orderCostStatistics: Array.isArray(orderCostStatistics?.result)
            ? orderCostStatistics.result
            : [],
          orderStatistics: orderStatistics?.result || {},
          totalRevenue: totalRevenue?.result || 0,
        });

        console.log("Final Data State:", {
          orderCostStatistics: Array.isArray(orderCostStatistics?.result)
            ? orderCostStatistics.result
            : [],
          orderStatistics: orderStatistics?.result || {},
          totalRevenue: totalRevenue?.result || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        message.error(
          "Lỗi khi tải dữ liệu thống kê: " + (error.message || "Unknown error")
        );
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchSupplierId();
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [supplierId, startDate, endDate]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const tabItems = [
    {
      key: "1",
      label: (
        <span className="font-medium text-lg text-gray-700 flex items-center">
          <ShoppingCartOutlined className="mr-2" />
          Danh sách đơn hàng NCC
        </span>
      ),
      children: <OrderListBySuplier refresh={refreshList} />,
    },
    // {
    //   key: "2",
    //   label: (
    //     <span className="font-medium text-lg text-gray-700 flex items-center">
    //       <DollarOutlined className="mr-2" />
    //       Danh sách đơn hàng mua
    //     </span>
    //   ),
    //   children: <OrderBuyListBySuplier refresh={refreshList} />,
    // },
    // {
    //   key: "3",
    //   label: (
    //     <span className="font-medium text-lg text-gray-700 flex items-center">
    //       <FileDoneOutlined className="mr-2" />
    //       Danh sách đơn hàng thuê
    //     </span>
    //   ),
    //   children: <OrderRentListBySuplier refresh={refreshList} />,
    // },
  ];

  const handleDateChange = (dates) => {
    if (dates) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    } else {
      setStartDate(dayjs().subtract(1, "month"));
      setEndDate(dayjs());
    }
  };

  const refreshData = () => {
    setRefreshList(!refreshList);
  };

  const toggleCollapse = (key) => {
    setCollapseStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="p-6 bg-gradient-to-tr from-blue-100 to-white rounded-2xl shadow-lg max-w-8xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        TRANG QUẢN LÍ ĐƠN HÀNG
      </h1>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Row gutter={[8, 8]}>
          {/* {summaryItems.map((item) => (
            <Col xs={24} sm={12} md={6} lg={3} key={item.title}>
              <Card className="summary-card" bodyStyle={{ padding: "8px" }}>
                <div className="flex items-center space-x-2">
                  <div className="icon-container-sm">{item.icon}</div>
                  <div className="flex flex-col">
                    <Text className="text-xs text-gray-500 mb-1">
                      {item.title}
                    </Text>
                    <Text className="text-sm font-semibold">{item.value}</Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))} */}
        </Row>

        <Card
          title="Danh Sách Đơn Hàng"
          className="custom-card"
          bordered={false}
        >
          <Tabs
            defaultActiveKey="1"
            items={tabItems}
            className="custom-tabs"
            tabBarStyle={{
              padding: "0.5rem",
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          />
        </Card>
      </Space>
      <style jsx>{`
        .custom-card {
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .custom-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }
        .summary-card {
          padding: 8px;
          border-radius: 8px;
          background: #f7f9fc;
        }
        .icon-container-sm {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background-color: rgba(24, 144, 255, 0.1);
          border-radius: 50%;
        }
        .icon-container-sm svg {
          font-size: 16px;
        }
        .custom-tabs .ant-tabs-tab {
          padding: 8px 16px;
          border-radius: 8px;
          margin-right: 8px;
          transition: background-color 0.3s, color 0.3s;
        }
        .custom-tabs .ant-tabs-tab-active {
          background-color: #1890ff;
          color: #ffffff;
        }
        .custom-tabs .ant-tabs-ink-bar {
          display: none;
        }
        .custom-table {
          border-radius: 8px;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .flex {
            flex-direction: column;
            align-items: stretch;
          }
          .summary-card {
            justify-content: center;
            text-align: center;
          }
          .icon-container {
            margin-bottom: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageOrder;
