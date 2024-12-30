import { Card, Col, List, Progress, Row, Table, Typography } from "antd";
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
  const [bestSellingCategories, setBestSellingCategories] = useState([]);
  const [systemRatingStatistics, setSystemRatingStatistics] = useState({});
  const [systemPaymentStatistics, setSystemPaymentStatistics] = useState({});
  const [systemTransactionStatistics, setSystemTransactionStatistics] =
    useState({});
  const [monthOrderPurchaseStatistics, setMonthOrderPurchaseStatistics] =
    useState([]);
  const [monthOrderRentStatistics, setMonthOrderRentStatistics] = useState([]);
  const [allMonthOrderCostStatistics, setAllMonthOrderCostStatistics] =
    useState([]);
  const [orderStatusStatistics, setOrderStatusStatistics] = useState([]);
  const [systemTotalMoneyStatistics, setSystemTotalMoneyStatistics] =
    useState(0);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const bestSellingCategoriesData = await getBestSellingCategories(
  //         "2023-01-01",
  //         "2023-12-31"
  //       );
  //       setBestSellingCategories(bestSellingCategoriesData);

  //       const systemRatingStatisticsData = await getSystemRatingStatistics();
  //       setSystemRatingStatistics(systemRatingStatisticsData);

  //       const systemPaymentStatisticsData = await getSystemPaymentStatistics(
  //         "2023-01-01",
  //         "2023-12-31"
  //       );
  //       setSystemPaymentStatistics(systemPaymentStatisticsData);

  //       const systemTransactionStatisticsData =
  //         await getSystemTransactionStatistics("2023-01-01", "2023-12-31");
  //       setSystemTransactionStatistics(systemTransactionStatisticsData);

  //       const monthOrderPurchaseStatisticsData =
  //         await getMonthOrderPurchaseStatistics("2023-01-01", "2023-12-31");
  //       setMonthOrderPurchaseStatistics(monthOrderPurchaseStatisticsData);

  //       const monthOrderRentStatisticsData = await getMonthOrderRentStatistics(
  //         "2023-01-01",
  //         "2023-12-31"
  //       );
  //       setMonthOrderRentStatistics(monthOrderRentStatisticsData);

  //       const allMonthOrderCostStatisticsData =
  //         await getAllMonthOrderCostStatistics("2023-01-01", "2023-12-31");
  //       setAllMonthOrderCostStatistics(allMonthOrderCostStatisticsData);

  //       const orderStatusStatisticsData = await getOrderStatusStatistics();
  //       setOrderStatusStatistics(orderStatusStatisticsData);

  //       const systemTotalMoneyStatisticsData =
  //         await getSystemTotalMoneyStatistics();
  //       setSystemTotalMoneyStatistics(systemTotalMoneyStatisticsData);
  //     } catch (error) {
  //       console.error("Error fetching dashboard data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // const renderRatingDistribution = () => {
  //   if (!systemRatingStatistics.ratingDistribution) return null;
  //   return systemRatingStatistics.ratingDistribution.map((item) => (
  //     <div key={item.ratingValue} className="mb-2">
  //       <Text>{`Rating ${item.ratingValue}: ${item.count}`}</Text>
  //       <Progress
  //         percent={(item.count / systemRatingStatistics.totalRatings) * 100}
  //       />
  //     </div>
  //   ));
  // };

  // const renderTopRatedProducts = () => {
  //   if (!systemRatingStatistics.topRatedProducts) return null;
  //   return (
  //     <List
  //       dataSource={systemRatingStatistics.topRatedProducts}
  //       renderItem={(product) => (
  //         <List.Item>
  //           <Text>{`Product ID: ${product.productID}, Average Rating: ${product.averageRating}, Total Ratings: ${product.totalRatings}`}</Text>
  //         </List.Item>
  //       )}
  //     />
  //   );
  // };

  const orderStatusColumns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const { text, color, icon } = orderStatusMap[status] || {};
        return (
          <span style={{ color }}>
            <i className={`fas ${icon} mr-2`}></i>
            {text}
          </span>
        );
      },
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
    },
  ];

  return (
    <div className="p-4">
      <Title level={1} className="text-center mb-8">
        Dashboard
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={8}>
          <Card title="Best Selling Categories">
            <List
              dataSource={bestSellingCategories}
              renderItem={(category) => (
                <List.Item>
                  <Text>{category}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card title="System Rating Statistics">
            <div>
              <Text>Total Ratings: {systemRatingStatistics.totalRatings}</Text>
              <br />
              <Text>
                Average Rating: {systemRatingStatistics.averageRating}
              </Text>
              {renderRatingDistribution()}
              <Title level={4}>Top Rated Products</Title>
              {renderTopRatedProducts()}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card title="System Payment Statistics">
            <Text>Total Revenue: {systemPaymentStatistics.totalRevenue}</Text>
            <br />
            <Text>Payment Count: {systemPaymentStatistics.paymentCount}</Text>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card title="System Transaction Statistics">
            <Text>
              Total Revenue: {systemTransactionStatistics.totalRevenue}
            </Text>
            <br />
            <Text>
              Transaction Count: {systemTransactionStatistics.transactionCount}
            </Text>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card title="Month Order Purchase Statistics">
            <List
              dataSource={monthOrderPurchaseStatistics}
              renderItem={(item) => (
                <List.Item>
                  <Text>{JSON.stringify(item)}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card title="Month Order Rent Statistics">
            <List
              dataSource={monthOrderRentStatistics}
              renderItem={(item) => (
                <List.Item>
                  <Text>{JSON.stringify(item)}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card title="All Month Order Cost Statistics">
            <List
              dataSource={allMonthOrderCostStatistics}
              renderItem={(item) => (
                <List.Item>
                  <Text>{JSON.stringify(item)}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card title="Order Status Statistics">
            <Table
              dataSource={orderStatusStatistics}
              columns={orderStatusColumns}
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card title="System Total Money Statistics">
            <Text>Total Money: {systemTotalMoneyStatistics}</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
