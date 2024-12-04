import {
  DollarOutlined,
  FileDoneOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  message,
  Row,
  Space,
  Table,
  Tabs,
  Typography,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import {
  getCalculateTotalRevenueBySupplier,
  getMonthOrderCostStatistics,
  getSupplierOrderStatistics,
} from "../../../api/dashboardApi";
import OrderBuyListBySuplier from "../Order/OrderBuy/OrderBuyListBySuplier";
import OrderListBySuplier from "../Order/OrderListBySuplier";
import OrderRentListBySuplier from "../Order/OrderRent/OrderRentListBySuplier";

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
        const [orderCostStatistics, orderStatistics, totalRevenue] =
          await Promise.all([
            getMonthOrderCostStatistics(supplierId, startDate, endDate),
            getSupplierOrderStatistics(supplierId, startDate, endDate),
            getCalculateTotalRevenueBySupplier(supplierId),
          ]);
        setData({
          orderCostStatistics: Array.isArray(orderCostStatistics)
            ? orderCostStatistics
            : [],
          orderStatistics: orderStatistics || {},
          totalRevenue: totalRevenue || 0,
        });
      } catch {
        message.error("Lỗi khi tải dữ liệu thống kê.");
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

  const orderCostColumns = useMemo(
    () => [
      {
        title: "Tháng",
        dataIndex: "month",
        key: "month",
        render: (text) => dayjs(text).format("MM/YYYY"),
        sorter: (a, b) => dayjs(a.month).unix() - dayjs(b.month).unix(),
      },
      {
        title: "Tổng Chi Phí",
        dataIndex: "totalCost",
        key: "totalCost",
        render: (text) => formatCurrency(text),
        sorter: (a, b) => a.totalCost - b.totalCost,
      },
    ],
    []
  );

  const orderStatisticsColumns = useMemo(
    () => [
      {
        title: "Tổng Bán",
        dataIndex: "totalSales",
        key: "totalSales",
        sorter: (a, b) => a.totalSales - b.totalSales,
      },
      {
        title: "Tổng Đơn",
        dataIndex: "totalOrders",
        key: "totalOrders",
        sorter: (a, b) => a.totalOrders - b.totalOrders,
      },
      {
        title: "Đơn Đang Chờ",
        dataIndex: "pendingOrders",
        key: "pendingOrders",
        sorter: (a, b) => a.pendingOrders - b.pendingOrders,
      },
      {
        title: "Đơn Hoàn Thành",
        dataIndex: "completedOrders",
        key: "completedOrders",
        sorter: (a, b) => a.completedOrders - b.completedOrders,
      },
      {
        title: "Đơn Hủy",
        dataIndex: "canceledOrders",
        key: "canceledOrders",
        sorter: (a, b) => a.canceledOrders - b.canceledOrders,
      },
    ],
    []
  );

  const tabItems = [
    {
      key: "1",
      label: (
        <span className="font-medium text-lg text-gray-700 flex items-center">
          <ShoppingCartOutlined className="mr-2" />
          Danh sách đơn hàng
        </span>
      ),
      children: <OrderListBySuplier refresh={refreshList} />,
    },
    {
      key: "2",
      label: (
        <span className="font-medium text-lg text-gray-700 flex items-center">
          <DollarOutlined className="mr-2" />
          Danh sách đơn hàng mua
        </span>
      ),
      children: <OrderBuyListBySuplier refresh={refreshList} />,
    },
    {
      key: "3",
      label: (
        <span className="font-medium text-lg text-gray-700 flex items-center">
          <FileDoneOutlined className="mr-2" />
          Danh sách đơn hàng thuê
        </span>
      ),
      children: <OrderRentListBySuplier refresh={refreshList} />,
    },
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

  const summaryItems = [
    {
      title: "Tổng Doanh Thu",
      value: formatCurrency(data.totalRevenue),
      icon: <DollarOutlined style={{ color: "#52c41a", fontSize: "24px" }} />,
    },
    {
      title: "Tổng Đơn Hàng",
      value: data.orderStatistics.totalOrders,
      icon: (
        <ShoppingCartOutlined style={{ color: "#1890ff", fontSize: "24px" }} />
      ),
    },
    {
      title: "Đơn Hoàn Thành",
      value: data.orderStatistics.completedOrders,
      icon: <FileDoneOutlined style={{ color: "#52c41a", fontSize: "24px" }} />,
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-tr from-blue-100 to-white rounded-2xl shadow-lg max-w-8xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        TRANG QUẢN LÍ ĐƠN HÀNG
      </h1>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div className="flex justify-between items-center">
          <RangePicker
            onChange={handleDateChange}
            defaultValue={[startDate, endDate]}
            className="rounded-md"
            allowClear
          />
          <Space>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={refreshData}
            >
              Refresh
            </Button>
          </Space>
        </div>
        <Row gutter={[16, 16]}>
          {summaryItems.map((item) => (
            <Col xs={24} sm={12} md={8} key={item.title}>
              <Card className="summary-card flex items-center">
                <div className="icon-container mr-4">{item.icon}</div>
                <div>
                  <Text className="text-sm text-gray-500">{item.title}</Text>
                  <Text className="text-xl font-bold">{item.value}</Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title="Thống Kê Chi Phí Đơn Hàng"
              className="custom-card"
              bordered={false}
            >
              <Table
                dataSource={data.orderCostStatistics}
                columns={orderCostColumns}
                pagination={false}
                rowKey="month"
                className="custom-table"
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}></Col>
        </Row>
        <Card
          title="Thống Kê Đơn Hàng"
          className="custom-card"
          bordered={false}
        >
          <Table
            dataSource={[data.orderStatistics]}
            columns={orderStatisticsColumns}
            pagination={false}
            rowKey="key"
            className="custom-table"
          />
        </Card>
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
          display: flex;
          align-items: center;
          padding: 16px;
          border-radius: 12px;
          background: #f7f9fc;
        }
        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background-color: rgba(24, 144, 255, 0.1);
          border-radius: 50%;
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
