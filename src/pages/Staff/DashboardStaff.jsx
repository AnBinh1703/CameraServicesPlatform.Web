import { Col, Row, Divider } from "antd";
import React, { useEffect, useState } from "react";
import { 
  getSystemRatingStatistics,
  getSystemTransactionStatistics,
  getMonthOrderStatistics,
  getOrderStatusStatistics,
  getSystemTotalMoneyStatistics,
  getSystemCounts
} from "../../api/dashboardmanageApi";
import RatingDistributionCard from "../../components/Dashboard/RatingDistributionCard";
import RatingStatisticsCard from "../../components/Dashboard/RatingStatisticsCard";
import TopRatedProductsCard from "../../components/Dashboard/TopRatedProductsCard";
import StatisticsOverviewCard from "../../components/Dashboard/StatisticsOverviewCard";

const DashboardStaff = () => {
  const [ratingStats, setRatingStats] = useState(null);
  const [transactionStats, setTransactionStats] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const [statusStats, setStatusStats] = useState(null);
  const [totalMoney, setTotalMoney] = useState(0);
  const [systemCounts, setSystemCounts] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const [ratings, transactions, orders, status, money, counts] = await Promise.all([
          getSystemRatingStatistics(),
          getSystemTransactionStatistics(startDate, endDate),
          getMonthOrderStatistics(startDate, endDate),
          getOrderStatusStatistics(),
          getSystemTotalMoneyStatistics(),
          getSystemCounts()
        ]);

        setRatingStats(ratings);
        setTransactionStats(transactions);
        setOrderStats(orders);
        setStatusStats(status);
        setTotalMoney(money);
        setSystemCounts(counts);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container" style={{ padding: "24px" }}>
      <h1 style={{ 
        fontSize: "24px", 
        marginBottom: "24px",
        color: "#1890ff",
        fontWeight: "bold"
      }}>
        Thống Kê Tổng Quan Hệ Thống
      </h1>

      <StatisticsOverviewCard />

      <Divider />

      <h1 style={{ 
        fontSize: "24px", 
        marginBottom: "24px",
        color: "#1890ff",
        fontWeight: "bold"
      }}>
        Thống Kê Đánh Giá Hệ Thống
      </h1>
      
      <RatingStatisticsCard ratingStats={ratingStats} />
      
      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        <Col xs={24} lg={12}>
          <RatingDistributionCard ratingStats={ratingStats} />
        </Col>
        <Col xs={24} lg={12}>
          <TopRatedProductsCard topRatedProducts={ratingStats?.topRatedProducts} />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardStaff;
