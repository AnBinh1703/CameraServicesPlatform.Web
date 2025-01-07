import { Card, Col, Row, Spin, Statistic, Typography } from "antd";
import { Line, Column, Pie } from '@ant-design/charts';
import React, { useEffect, useState } from "react";
import {
  getCategoryCount,
  getComboCount,
  getOrderCount,
  getProductCount,
  getProductReportCount,
  getReportCount,
  getStaffCount,
  getSupplierCount,
  getSystemTotalMoneyStatistics,
  getUserCount,
  getSystemRatingStatistics,
  getSystemPaymentStatistics,
  getBestSellingCategories,
  getSystemTransactionStatistics,
  getMonthOrderPurchaseStatistics,
  getMonthOrderRentStatistics,
} from "../../api/dasshboardmanageApi";
import { getStatCards } from "../../config/dashboardConfig";
import { formatNumber } from "../../utils/formatNumber";

const { Title } = Typography;

const DashboardStaff = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMoney: 0,
    userCount: 0,
    reportCount: 0,
    productCount: 0,
    supplierCount: 0,
    staffCount: 0,
    categoryCount: 0,
    comboCount: 0,
    orderCount: 0,
    productReportCount: 0,
    totalRatings: 0,
    averageRating: 0,
    totalRevenue: 0,
    paymentCount: 0,
    completedPayments: 0,
    pendingPayments: 0,
    monthlyRevenue: [],
    bestSellingCategories: [],
    transactionStats: {},
    purchaseStats: [],
    rentStats: [],
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [
          totalMoney,
          users,
          reports,
          products,
          suppliers,
          staff,
          categories,
          combos,
          orders,
          productReports,
          ratingStats,
          paymentStats,
          bestSelling,
          transactionStats,
          purchaseStats,
          rentStats,
        ] = await Promise.all([
          getSystemTotalMoneyStatistics(),
          getUserCount(),
          getReportCount(),
          getProductCount(),
          getSupplierCount(),
          getStaffCount(),
          getCategoryCount(),
          getComboCount(),
          getOrderCount(),
          getProductReportCount(),
          getSystemRatingStatistics(),
          getSystemPaymentStatistics(
            "01/01/2024", // You might want to make these dates dynamic
            "01/02/2025"
          ),
          getBestSellingCategories("01/01/2024", "01/02/2025"),
          getSystemTransactionStatistics("01/01/2024", "01/02/2025"),
          getMonthOrderPurchaseStatistics("01/01/2024", "01/02/2025"),
          getMonthOrderRentStatistics("01/01/2024", "01/02/2025"),
        ]);

        const completedPayments = paymentStats.paymentStatusCounts.find(s => s.status === 2)?.count || 0;
        const pendingPayments = paymentStats.paymentStatusCounts.find(s => s.status === 1)?.count || 0;

        setStats({
          totalMoney,
          userCount: users,
          reportCount: reports,
          productCount: products,
          supplierCount: suppliers,
          staffCount: staff,
          categoryCount: categories,
          comboCount: combos,
          orderCount: orders,
          productReportCount: productReports,
          totalRatings: ratingStats.totalRatings,
          averageRating: ratingStats.averageRating,
          totalRevenue: paymentStats.totalRevenue,
          paymentCount: paymentStats.paymentCount,
          completedPayments,
          pendingPayments,
          monthlyRevenue: paymentStats.monthlyRevenue.map(item => ({
            month: `${item.month}/${item.year}`,
            revenue: item.totalRevenue
          })),
          bestSellingCategories: bestSelling,
          transactionStats,
          purchaseStats,
          rentStats,
        });
      } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div
        className="loading-container"
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f0f2f5",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const statCards = getStatCards({
    ...stats,
    totalMoney: formatNumber(stats.totalMoney),
  });

  const config = {
    data: stats.monthlyRevenue,
    xField: 'month',
    yField: 'revenue',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  const categoryConfig = {
    data: stats.bestSellingCategories,
    xField: 'categoryName',
    yField: 'totalSold',
    label: {
      style: { fill: '#aaa' },
    },
  };

  const compareConfig = {
    data: [...stats.purchaseStats.map(item => ({
      month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      value: item.totalCost,
      type: 'Mua'
    })), ...stats.rentStats.map(item => ({
      month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      value: item.totalCost,
      type: 'Thuê'
    }))],
    isGroup: true,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
  };

  return (
    <div className="dashboard-container" style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Title level={2} style={{ marginBottom: "24px", color: "#1a3353", fontWeight: 600, textAlign: "center" }}>
        Tổng quan hệ thống
      </Title>

      <Row gutter={[16, 16]}>
        {statCards.map((stat, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              style={{
                background: stat.color.gradient,
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Statistic
                title={<span style={{ color: stat.color.textColor, fontSize: "16px" }}>{stat.title}</span>}
                value={stat.value}
                suffix={stat.suffix}
                valueStyle={{
                  color: stat.color.textColor,
                  fontSize: "24px",
                  fontWeight: "bold"
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col span={12}>
          <Card title="Danh mục bán chạy nhất">
            <Column {...categoryConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="So sánh doanh thu mua và thuê">
            <Column {...compareConfig} />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: "24px" }}>
        <Title level={3} style={{ marginBottom: "24px", color: "#1a3353" }}>
          Doanh thu theo tháng
        </Title>
        <Line {...config} />
      </Card>
    </div>
  );
};

export default DashboardStaff;
