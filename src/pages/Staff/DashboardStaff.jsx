import {
  BarChartOutlined,
  DollarOutlined,
  RiseOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Card, Col, List, Progress, Row, Statistic, Typography } from "antd";
import React, { useEffect, useState } from "react";
import {
  getAllMonthOrderCostStatistics,
  getBestSellingCategories,
  getMonthOrderPurchaseStatistics,
  getMonthOrderRentStatistics,
  getOrderStatusStatistics,
  getSystemPaymentStatistics,
  getSystemRatingStatistics,
  getSystemTotalMoneyStatistics,
  getSystemTransactionStatistics,
} from "../../api/dashboardApi";

const { Title, Text } = Typography;

// Update color scheme and styling constants
const colors = {
  primary: "#1890ff",
  success: "#52c41a",
  warning: "#faad14",
  error: "#f5222d",
  purple: "#722ed1",
  cyan: "#13c2c2",
  gradient: {
    blue: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
    green: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
    gold: "linear-gradient(135deg, #faad14 0%, #d48806 100%)",
    purple: "linear-gradient(135deg, #722ed1 0%, #531dab 100%)",
  },
};

const cardStyle = {
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  height: "100%",
  border: "none",
  overflow: "hidden",
};

const statCardStyle = {
  ...cardStyle,
  background: "#fff",
  padding: "24px",
};

const iconStyle = {
  fontSize: "24px",
  padding: "16px",
  borderRadius: "50%",
  marginBottom: "16px",
};

const orderStatusMap = {
  0: { text: "Chờ xử lý", color: "blue", icon: "fa-hourglass-start" },
  1: {
    text: "Sản phẩm sẵn sàng được giao",
    color: "green",
    icon: "fa-check-circle",
  },
  2: { text: "Hoàn thành", color: "yellow", icon: "fa-clipboard-check" },
  3: { text: "Đã nhận sản phẩm", color: "purple", icon: "fa-shopping-cart" },
  4: { text: "Đã giao hàng", color: "cyan", icon: "fa-truck" },
  5: { text: "Thanh toán thất bại", color: "cyan", icon: "fa-money-bill-wave" },
  6: { text: "Đang hủy", color: "lime", icon: "fa-box-open" },
  7: { text: "Đã hủy thành công", color: "red", icon: "fa-times-circle" },
  8: { text: "Đã Thanh toán", color: "orange", icon: "fa-money-bill-wave" },
  9: { text: "Hoàn tiền đang chờ xử lý", color: "pink", icon: "fa-clock" },
  10: { text: "Hoàn tiền thành công ", color: "brown", icon: "fa-undo" },
  11: { text: "Hoàn trả tiền đặt cọc", color: "gold", icon: "fa-piggy-bank" },
  12: { text: "Gia hạn", color: "violet", icon: "fa-calendar-plus" },
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    ratings: null,
    payments: null,
    bestSellers: [],
    transactions: null,
    orderStatus: [],
    totalMoney: 0,
    monthlyPurchases: [],
    monthlyRents: [],
    monthlyOrders: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const [
          ratings,
          payments,
          bestSellers,
          transactions,
          orderStatus,
          totalMoney,
          monthlyPurchases,
          monthlyRents,
          monthlyOrders,
        ] = await Promise.all([
          getSystemRatingStatistics(),
          getSystemPaymentStatistics(startDate, endDate),
          getBestSellingCategories(startDate, endDate),
          getSystemTransactionStatistics(startDate, endDate),
          getOrderStatusStatistics(),
          getSystemTotalMoneyStatistics(),
          getMonthOrderPurchaseStatistics(startDate, endDate),
          getMonthOrderRentStatistics(startDate, endDate),
          getAllMonthOrderCostStatistics(startDate, endDate),
        ]);

        setStatistics({
          ratings,
          payments,
          bestSellers,
          transactions,
          orderStatus,
          totalMoney,
          monthlyPurchases,
          monthlyRents,
          monthlyOrders,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const renderRatingStatistics = () => (
    <Card
      style={statCardStyle}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              background: colors.gradient.gold,
              padding: "12px",
              borderRadius: "12px",
              color: "white",
            }}
          >
            <StarOutlined style={{ fontSize: "20px" }} />
          </div>
          <span>Rating Statistics</span>
        </div>
      }
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title="Total Ratings"
            value={statistics.ratings?.totalRatings}
            prefix={<TeamOutlined style={{ color: colors.primary }} />}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Average Rating"
            value={statistics.ratings?.averageRating}
            precision={1}
            prefix={<StarOutlined style={{ color: colors.warning }} />}
            suffix="/ 5"
          />
        </Col>
        <Col span={24}>
          <List
            dataSource={statistics.ratings?.ratingDistribution}
            renderItem={(item) => (
              <List.Item>
                <Progress
                  percent={
                    (item.count / statistics.ratings?.totalRatings) * 100
                  }
                  format={() => `${item.count} (${item.ratingValue}★)`}
                  strokeColor={colors.gradient.gold}
                  strokeWidth={12}
                  style={{ width: "100%" }}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </Card>
  );
  const renderTopRatedProducts = () => (
    <Card title="Top Rated Products" loading={loading} style={cardStyle}>
      <List
        dataSource={statistics.ratings?.topRatedProducts}
        renderItem={(item) => (
          <List.Item>
            <Row style={{ width: "100%" }}>
              <Col span={12}>Product ID: {item.productID}</Col>
              <Col span={12}>
                <Progress
                  percent={(item.averageRating / 5) * 100}
                  format={() => `${item.averageRating}★ (${item.totalRatings})`}
                />
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </Card>
  );
  const renderTransactionStatistics = () => (
    <Card style={statCardStyle} bodyStyle={{ padding: 0 }}>
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <div
            style={{
              background: colors.gradient.blue,
              padding: "24px",
              borderRadius: "12px",
              height: "100%",
              color: "white",
            }}
          >
            <DollarOutlined
              style={{ fontSize: "32px", marginBottom: "16px" }}
            />
            <Statistic
              title={
                <Text style={{ color: "rgba(255,255,255,0.85)" }}>
                  Total Revenue
                </Text>
              }
              value={statistics.transactions?.totalRevenue}
              precision={0}
              suffix="VND"
              valueStyle={{ color: "white", fontSize: "24px" }}
            />
          </div>
        </Col>
        <Col span={8}>
          <div
            style={{
              background: colors.gradient.green,
              padding: "24px",
              borderRadius: "12px",
              height: "100%",
              color: "white",
            }}
          >
            <ShoppingCartOutlined
              style={{ fontSize: "32px", marginBottom: "16px" }}
            />
            <Statistic
              title={
                <Text style={{ color: "rgba(255,255,255,0.85)" }}>
                  Total Transactions
                </Text>
              }
              value={statistics.transactions?.transactionCount}
              valueStyle={{ color: "white", fontSize: "24px" }}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );

  const renderOrderStatusStatistics = () => (
    <Card title="Order Status Distribution" loading={loading} style={cardStyle}>
      <List
        dataSource={statistics.orderStatus}
        renderItem={(item) => (
          <List.Item>
            <Row style={{ width: "100%" }}>
              <Col span={12}>{orderStatusMap[item.status]?.text}</Col>
              <Col span={12}>
                <Progress
                  percent={
                    (item.count /
                      statistics.orderStatus.reduce(
                        (acc, curr) => acc + curr.count,
                        0
                      )) *
                    100
                  }
                  format={() => item.count}
                />
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </Card>
  );

  const renderBestSellingCategories = () => (
    <Card
      title={
        <span>
          <RiseOutlined style={{ color: colors.purple, marginRight: "8px" }} />
          Best Selling Categories
        </span>
      }
      loading={loading}
      style={cardStyle}
    >
      <List
        dataSource={statistics.bestSellers}
        renderItem={(item, index) => (
          <List.Item>
            <Row style={{ width: "100%", alignItems: "center" }}>
              <Col span={2}>
                <div
                  style={{
                    background: colors.primary + "15",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  {index + 1}
                </div>
              </Col>
              <Col span={14}>
                <Text strong>{item.categoryName}</Text>
              </Col>
              <Col span={8}>
                <Text type="secondary">{item.totalSold} sold</Text>
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </Card>
  );

  const renderPaymentStatistics = () => (
    <Card title="Payment Statistics" loading={loading} style={cardStyle}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Statistic
            title="Total Revenue"
            value={statistics.payments?.totalRevenue}
            suffix="VND"
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Payment Count"
            value={statistics.payments?.paymentCount}
          />
        </Col>
        <Col span={24}>
          <List
            dataSource={statistics.payments?.revenueByMethod}
            renderItem={(item) => (
              <List.Item>
                <Row style={{ width: "100%" }}>
                  <Col span={12}>Payment Method {item.paymentMethod}</Col>
                  <Col span={12}>{item.totalRevenue.toLocaleString()} VND</Col>
                </Row>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </Card>
  );

  const renderMonthlyPurchases = () => (
    <Card
      title="Monthly Purchase Statistics"
      loading={loading}
      style={cardStyle}
    >
      <List
        dataSource={statistics.monthlyPurchases}
        renderItem={(item) => (
          <List.Item>
            <Row style={{ width: "100%" }}>
              <Col span={12}>
                {new Date(item.month).toLocaleDateString("vi-VN", {
                  month: "long",
                  year: "numeric",
                })}
              </Col>
              <Col span={12}>{item.totalCost.toLocaleString()} VND</Col>
            </Row>
          </List.Item>
        )}
      />
    </Card>
  );

  const renderMonthlyRents = () => (
    <Card title="Monthly Rent Statistics" loading={loading} style={cardStyle}>
      <List
        dataSource={statistics.monthlyRents}
        renderItem={(item) => (
          <List.Item>
            <Row style={{ width: "100%" }}>
              <Col span={12}>
                {new Date(item.month).toLocaleDateString("vi-VN", {
                  month: "long",
                  year: "numeric",
                })}
              </Col>
              <Col span={12}>{item.totalCost.toLocaleString()} VND</Col>
            </Row>
          </List.Item>
        )}
      />
    </Card>
  );

  const renderMonthlyOrders = () => (
    <Card title="Monthly Order Statistics" loading={loading} style={cardStyle}>
      <List
        dataSource={statistics.monthlyOrders}
        renderItem={(item) => (
          <List.Item>
            <Row style={{ width: "100%" }}>
              <Col span={12}>
                {new Date(item.month).toLocaleDateString("vi-VN", {
                  month: "long",
                  year: "numeric",
                })}
              </Col>
              <Col span={12}>{item.totalCost.toLocaleString()} VND</Col>
            </Row>
          </List.Item>
        )}
      />
    </Card>
  );

  const dashboardContainerStyle = `
    .dashboard-container {
      padding: 24px;
      background: #f0f2f5;
    }

    .dashboard-card {
      transition: all 0.3s ease;
    }

    .dashboard-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    .ant-statistic-title {
      font-size: 14px;
      margin-bottom: 8px;
      color: rgba(0,0,0,0.65);
    }

    .ant-statistic-content {
      font-size: 28px;
      font-weight: 600;
    }

    .ant-list-item {
      padding: 16px;
      transition: background-color 0.3s ease;
    }

    .ant-list-item:hover {
      background-color: rgba(0,0,0,0.02);
    }

    .ant-progress-text {
      font-weight: 600;
    }
  `;

  return (
    <>
      <style>{dashboardContainerStyle}</style>
      <div className="dashboard-container">
        <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
          <Col span={24}>
            <Title
              level={2}
              style={{
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  background: colors.gradient.blue,
                  padding: "12px",
                  borderRadius: "12px",
                  color: "white",
                }}
              >
                <BarChartOutlined />
              </div>
              Dashboard Overview
            </Title>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={24}>{renderTransactionStatistics()}</Col>
          <Col span={12}>{renderRatingStatistics()}</Col>
          <Col span={12}>{renderOrderStatusStatistics()}</Col>
          <Col span={12}>{renderPaymentStatistics()}</Col>
          <Col span={12}>{renderTopRatedProducts()}</Col>
          <Col span={8}>{renderMonthlyPurchases()}</Col>
          <Col span={8}>{renderMonthlyRents()}</Col>
          <Col span={8}>{renderMonthlyOrders()}</Col>
          <Col span={24}>{renderBestSellingCategories()}</Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;

// Add this CSS to your styles file
const styles = `
.dashboard-container .ant-card {
  transition: all 0.3s ease;
}

.dashboard-container .ant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}

.dashboard-container .ant-progress-text {
  font-weight: bold;
}

.dashboard-container .ant-statistic-title {
  color: rgba(0,0,0,0.65);
  font-size: 14px;
  margin-bottom: 8px;
}

.dashboard-container .ant-statistic-content {
  font-size: 24px;
  font-weight: bold;
}
`;
