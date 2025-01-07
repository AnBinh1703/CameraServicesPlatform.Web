import {
  AppstoreOutlined,
  BarChartOutlined,
  BugOutlined,
  CalendarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  FlagOutlined,
  InboxOutlined,
  OrderedListOutlined,
  RiseOutlined,
  RollbackOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  StarOutlined,
  StopOutlined,
  SyncOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  List,
  Progress,
  Row,
  Space,
  Statistic,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  getAllMonthOrderCostStatistics,
  getBestSellingCategories,
  getCategoryCount,
  getComboCount,
  getMonthOrderPurchaseStatistics,
  getMonthOrderRentStatistics,
  getOrderCount,
  getOrderStatusStatistics,
  getProductById,
  getProductCount,
  getProductReportCount,
  getReportCount,
  getStaffCount,
  getSupplierCount,
  getSystemPaymentStatistics,
  getSystemRatingStatistics,
  getSystemTotalMoneyStatistics,
  getSystemTransactionStatistics,
  getUserCount,
} from "../../api/dasshboardmanageApi";
import { getSupplierById } from "../../api/supplierApi";

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
    red: "linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%)",
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
  0: {
    text: "Chờ xử lý",
    color: "#1890ff",
    bgColor: "#e6f7ff",
    icon: <ClockCircleOutlined />,
  },
  1: {
    text: "Sản phẩm sẵn sàng được giao",
    color: "#52c41a",
    bgColor: "#f6ffed",
    icon: <CheckCircleOutlined />,
  },
  2: {
    text: "Hoàn thành",
    color: "#faad14",
    bgColor: "#fffbe6",
    icon: <CheckSquareOutlined />,
  },
  3: {
    text: "Đã nhận sản phẩm",
    color: "#722ed1",
    bgColor: "#f9f0ff",
    icon: <InboxOutlined />,
  },
  4: {
    text: "Đã giao hàng",
    color: "#13c2c2",
    bgColor: "#e6fffb",
    icon: <CarOutlined />,
  },
  5: {
    text: "Thanh toán thất bại",
    color: "#ff4d4f",
    bgColor: "#fff1f0",
    icon: <CloseCircleOutlined />,
  },
  6: {
    text: "Đang hủy",
    color: "#a0d911",
    bgColor: "#fcffe6",
    icon: <ExclamationCircleOutlined />,
  },
  7: {
    text: "Đã hủy thành công",
    color: "#f5222d",
    bgColor: "#fff1f0",
    icon: <StopOutlined />,
  },
  8: {
    text: "Đã Thanh toán",
    color: "#fa8c16",
    bgColor: "#fff7e6",
    icon: <DollarOutlined />,
  },
  9: {
    text: "Hoàn tiền đang chờ xử lý",
    color: "#eb2f96",
    bgColor: "#fff0f6",
    icon: <SyncOutlined spin />,
  },
  10: {
    text: "Hoàn tiền thành công",
    color: "#873800",
    bgColor: "#fff1e6",
    icon: <CheckCircleOutlined />,
  },
  11: {
    text: "Hoàn trả tiền đặt cọc",
    color: "#d48806",
    bgColor: "#fffbe6",
    icon: <RollbackOutlined />,
  },
  12: {
    text: "Gia hạn",
    color: "#531dab",
    bgColor: "#f9f0ff",
    icon: <CalendarOutlined />,
  },
};

// Update transaction type mapping
const transactionTypeMap = {
  0: { text: "Mua hàng", color: colors.primary },
  1: { text: "Thuê", color: colors.success },
};

// Update transaction status mapping
const transactionStatusMap = {
  1: { text: "Đang xử lý", color: colors.warning },
  2: { text: "Hoàn thành", color: colors.success },
};

const DashboardCard = ({ children, title, icon, ...props }) => (
  <Card
    title={
      title && (
        <Space>
          {icon && (
            <div
              style={{
                background: colors.gradient.blue,
                padding: "8px",
                borderRadius: "8px",
                color: "white",
              }}
            >
              {icon}
            </div>
          )}
          <span>{title}</span>
        </Space>
      )
    }
    style={cardStyle}
    {...props}
  >
    {children}
  </Card>
);

const StatisticCard = ({ title, value, prefix, color, ...props }) => (
  <Card style={statCardStyle} {...props}>
    <Statistic
      title={title}
      value={value}
      prefix={React.cloneElement(prefix, {
        style: { color: color || colors.primary },
      })}
    />
  </Card>
);

const DashboardStaff = () => {
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
    users: 0,
    products: 0,
    categories: 0,
    combos: 0,
    orders: 0,
    reports: 0,
    productReports: 0,
    suppliers: 0,
    staff: 0,
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
          users,
          products,
          categories,
          combos,
          orders,
          reports,
          productReports,
          suppliers,
          staff,
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
          getUserCount(),
          getProductCount(),
          getCategoryCount(),
          getComboCount(),
          getOrderCount(),
          getReportCount(),
          getProductReportCount(),
          getSupplierCount(),
          getStaffCount(),
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
          users,
          products,
          categories,
          combos,
          orders,
          reports,
          productReports,
          suppliers,
          staff,
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
          <span>Thống kê đánh giá</span>
        </div>
      }
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title="Tổng số đánh giá"
            value={statistics.ratings?.totalRatings}
            prefix={<TeamOutlined style={{ color: colors.primary }} />}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Đánh giá trung bình"
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
  const renderTopRatedProducts = () => {
    const [productNames, setProductNames] = useState({});
    const [loadingProducts, setLoadingProducts] = useState({});

    useEffect(() => {
      const fetchProductNames = async () => {
        const names = { ...productNames };
        const loading = { ...loadingProducts };

        if (statistics.ratings?.topRatedProducts) {
          await Promise.all(
            statistics.ratings.topRatedProducts.map(async (item) => {
              if (!names[item.productID]) {
                loading[item.productID] = true;
                setLoadingProducts(loading);

                try {
                  const response = await getProductById(item.productID);
                  console.log("Product API Response:", response);

                  // Update this line to access productName directly from result
                  const productName = response?.productName;
                  console.log("Found product name:", productName);

                  names[item.productID] =
                    productName || `Product ${item.productID}`;
                } catch (err) {
                  console.error(
                    `Error loading product ${item.productID}:`,
                    err
                  );
                  names[item.productID] = `Product ${item.productID}`;
                }

                loading[item.productID] = false;
              }
            })
          );

          console.log("Final product names mapping:", names);
          setProductNames(names);
          setLoadingProducts(loading);
        }
      };

      fetchProductNames();
    }, [statistics.ratings?.topRatedProducts]);

    return (
      <DashboardCard
        title="Sản phẩm được đánh giá cao nhất"
        icon={<StarOutlined />}
        loading={loading}
      >
        <List
          dataSource={statistics.ratings?.topRatedProducts}
          renderItem={(item) => (
            <List.Item>
              <Row style={{ width: "100%", alignItems: "center" }}>
                <Col span={12}>
                  {loadingProducts[item.productID] ? (
                    <Text type="secondary">Loading...</Text>
                  ) : (
                    <Text strong>
                      {productNames[item.productID] ||
                        `Product ${item.productID}`}
                    </Text>
                  )}
                </Col>
                <Col span={12}>
                  <Progress
                    percent={(item.averageRating / 5) * 100}
                    format={() =>
                      `${item.averageRating}★ (${item.totalRatings})`
                    }
                    strokeColor={colors.gradient.gold}
                  />
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </DashboardCard>
    );
  };
  const renderTransactionStatistics = () => {
    const [supplierNames, setSupplierNames] = useState({});
    const [loadingSuppliers, setLoadingSuppliers] = useState({});

    useEffect(() => {
      const fetchSupplierNames = async () => {
        const names = { ...supplierNames };
        const loading = { ...loadingSuppliers };

        if (statistics.transactions?.revenueBySupplier) {
          await Promise.all(
            statistics.transactions.revenueBySupplier.map(async (item) => {
              if (!names[item.supplierID]) {
                loading[item.supplierID] = true;
                setLoadingSuppliers(loading);

                try {
                  const response = await getSupplierById(item.supplierID);
                  console.log(
                    "Raw API Response for supplier",
                    item.supplierID,
                    ":",
                    response
                  );

                  // Access the supplier name from the correct path in the response
                  const supplierName =
                    response?.result?.items?.[0]?.supplierName;
                  console.log("Found supplier name:", supplierName);

                  names[item.supplierID] =
                    supplierName || `Supplier ${item.supplierID}`;
                } catch (err) {
                  console.error(
                    `Error loading supplier ${item.supplierID}:`,
                    err
                  );
                  names[item.supplierID] = `Supplier ${item.supplierID}`;
                }

                loading[item.supplierID] = false;
              }
            })
          );

          setSupplierNames(names);
          setLoadingSuppliers(loading);
        }
      };

      fetchSupplierNames();
    }, [statistics.transactions?.revenueBySupplier]);

    return (
      <Card style={statCardStyle}>
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
                    Tổng doanh thu
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
                    Tổng giao dịch
                  </Text>
                }
                value={statistics.transactions?.transactionCount}
                valueStyle={{ color: "white", fontSize: "24px" }}
              />
            </div>
          </Col>
          <Col span={24}>
            <Title level={4}>Doanh thu theo loại giao dịch</Title>
            <List
              dataSource={statistics.transactions?.revenueByTransactionType}
              renderItem={(item) => (
                <List.Item>
                  <Row style={{ width: "100%" }}>
                    <Col span={8}>
                      {transactionTypeMap[item.transactionType].text}
                    </Col>
                    <Col span={8}>{item.transactionCount} transactions</Col>
                    <Col span={8}>{item.totalRevenue.toLocaleString()} VND</Col>
                  </Row>
                </List.Item>
              )}
            />
          </Col>
          <Col span={24}>
            <Title level={4}>Doanh thu theo tháng</Title>
            <List
              dataSource={statistics.transactions?.monthlyRevenue}
              renderItem={(item) => (
                <List.Item>
                  <Row style={{ width: "100%" }}>
                    <Col span={12}>{`${item.month}/${item.year}`}</Col>
                    <Col span={12}>
                      {item.totalRevenue.toLocaleString()} VND
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </Col>
          <Col span={24}>
            <Title level={4}>Doanh thu theo nhà cung cấp</Title>
            <List
              dataSource={statistics.transactions?.revenueBySupplier}
              renderItem={(item) => (
                <List.Item>
                  <Row style={{ width: "100%" }}>
                    <Col span={8}>
                      {loadingSuppliers[item.supplierID] ? (
                        <Text type="secondary">Loading...</Text>
                      ) : (
                        <Text>
                          Nhà cung cấp:{" "}
                          {supplierNames[item.supplierID] || item.supplierID}
                        </Text>
                      )}
                    </Col>
                    <Col span={8}>{item.transactionCount} giao dịch</Col>
                    <Col span={8}>{item.totalRevenue.toLocaleString()} VND</Col>
                  </Row>
                </List.Item>
              )}
            />
          </Col>
          <Col span={24}>
            <Title level={4}>Trạng thái giao dịch</Title>
            {statistics.transactions?.transactionStatusCounts.map((status) => (
              <div key={status.status} style={{ marginBottom: "16px" }}>
                <Text>{transactionStatusMap[status.status].text}</Text>
                <Progress
                  percent={
                    (status.count / statistics.transactions.transactionCount) *
                    100
                  }
                  strokeColor={transactionStatusMap[status.status].color}
                  format={() => status.count}
                />
              </div>
            ))}
          </Col>
        </Row>
      </Card>
    );
  };
  const renderReportStatistics = () => (
    <Card style={statCardStyle} bodyStyle={{ padding: 0 }}>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <div
            style={{
              background: colors.gradient.blue,
              padding: "24px",
              borderRadius: "12px",
              height: "100%",
              color: "white",
            }}
          >
            <FlagOutlined style={{ fontSize: "32px", marginBottom: "16px" }} />
            <Statistic
              title={
                <Text style={{ color: "rgba(255,255,255,0.85)" }}>
                  Báo cáo chung
                </Text>
              }
              value={statistics.reports}
              valueStyle={{ color: "white", fontSize: "24px" }}
            />
          </div>
        </Col>
        <Col span={12}>
          <div
            style={{
              background: colors.gradient.red,
              padding: "24px",
              borderRadius: "12px",
              height: "100%",
              color: "white",
            }}
          >
            <BugOutlined style={{ fontSize: "32px", marginBottom: "16px" }} />
            <Statistic
              title={
                <Text style={{ color: "rgba(255,255,255,0.85)" }}>
                  Báo cáo sản phẩm
                </Text>
              }
              value={statistics.productReports}
              valueStyle={{ color: "white", fontSize: "24px" }}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );

  // Update Vietnamese translations in the stats cards
  const renderOverviewStatistics = () => (
    <Row gutter={[24, 24]}>
      <Col span={6}>
        <Card style={statCardStyle}>
          <Statistic
            title="Tổng người dùng"
            value={statistics.users}
            prefix={<UserOutlined style={{ color: colors.primary }} />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card style={statCardStyle}>
          <Statistic
            title="Tổng sản phẩm"
            value={statistics.products}
            prefix={<ShoppingOutlined style={{ color: colors.success }} />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card style={statCardStyle}>
          <Statistic
            title="Tổng đơn hàng"
            value={statistics.orders}
            prefix={<ShoppingCartOutlined style={{ color: colors.warning }} />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card style={statCardStyle}>
          <Statistic
            title="Danh mục"
            value={statistics.categories}
            prefix={<AppstoreOutlined style={{ color: colors.purple }} />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card style={statCardStyle}>
          <Statistic
            title="Combo"
            value={statistics.combos}
            prefix={<AppstoreOutlined style={{ color: colors.cyan }} />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card style={statCardStyle}>
          <Statistic
            title="Nhân viên"
            value={statistics.staff}
            prefix={<TeamOutlined style={{ color: colors.gold }} />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card style={statCardStyle}>
          <Statistic
            title="Nhà cung cấp"
            value={statistics.suppliers}
            prefix={<ShoppingOutlined style={{ color: colors.purple }} />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card style={statCardStyle}>
          <Statistic
            title="Tổng báo cáo"
            value={statistics.reports + statistics.productReports}
            prefix={<FlagOutlined style={{ color: colors.error }} />}
          />
        </Card>
      </Col>
    </Row>
  );

  const renderOrderStatusStatistics = () => {
    const totalOrders = statistics.orderStatus.reduce(
      (sum, item) => sum + item.count,
      0
    );

    // Sort status by count in descending order
    const sortedStatus = [...statistics.orderStatus].sort(
      (a, b) => b.count - a.count
    );

    return (
      <Card
        title={
          <Space>
            <OrderedListOutlined style={{ color: colors.primary }} />
            <span>Phân bố trạng thái đơn hàng</span>
          </Space>
        }
        loading={loading}
        style={cardStyle}
      >
        <List
          dataSource={sortedStatus}
          renderItem={(item) => {
            const status = orderStatusMap[item.status];
            const percentage = ((item.count / totalOrders) * 100).toFixed(1);

            return (
              <List.Item>
                <Row style={{ width: "100%", alignItems: "center" }}>
                  <Col span={1}>{status?.icon}</Col>
                  <Col span={11}>
                    <Text style={{ color: status?.color }}>{status?.text}</Text>
                  </Col>
                  <Col span={12}>
                    <Progress
                      percent={Number(percentage)}
                      strokeColor={status?.color}
                      format={() => `${item.count} (${percentage}%)`}
                      size="small"
                    />
                  </Col>
                </Row>
              </List.Item>
            );
          }}
        />
        <div style={{ textAlign: "right", marginTop: "16px" }}>
          <Text type="secondary">Total Orders: {totalOrders}</Text>
        </div>
      </Card>
    );
  };

  const renderBestSellingCategories = () => (
    <Card
      title={
        <span>
          <RiseOutlined style={{ color: colors.purple, marginRight: "8px" }} />
          Danh mục bán chạy nhất
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
                <Text type="secondary">{item.totalSold} sản phẩm</Text>
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </Card>
  );

  const renderPaymentStatistics = () => (
    <Card title="Thống kê thanh toán" loading={loading} style={cardStyle}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Statistic
            title="Tổng doanh thu"
            value={statistics.payments?.totalRevenue}
            suffix="VND"
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Số lượng thanh toán"
            value={statistics.payments?.paymentCount}
          />
        </Col>
        <Col span={24}>
          <List
            dataSource={statistics.payments?.revenueByMethod}
            renderItem={(item) => (
              <List.Item>
                <Row style={{ width: "100%" }}>
                  <Col span={12}>
                    Phương thức thanh toán {item.paymentMethod}
                  </Col>
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
      title="Thống kê mua hàng theo tháng"
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
    <Card
      title="Thống kê cho thuê theo tháng"
      loading={loading}
      style={cardStyle}
    >
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
    <Card
      title="Thống kê đơn hàng theo tháng"
      loading={loading}
      style={cardStyle}
    >
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

  // Update section titles in dashboardSections array
  const dashboardSections = [
    {
      title: "Tổng quan",
      span: 24,
      content: renderOverviewStatistics,
    },
    {
      title: "Giao dịch & Doanh thu",
      span: 24,
      content: renderTransactionStatistics,
    },
    {
      title: "Chỉ số hiệu suất",
      children: [
        {
          title: "Đánh giá",
          span: 12,
          content: renderRatingStatistics,
        },
        {
          title: "Trạng thái đơn hàng",
          span: 12,
          content: renderOrderStatusStatistics,
        },
      ],
    },
    {
      title: "Phân tích tài chính",
      children: [
        {
          title: "Thanh toán",
          span: 12,
          content: renderPaymentStatistics,
        },
        {
          title: "Sản phẩm hàng đầu",
          span: 12,
          content: renderTopRatedProducts,
        },
      ],
    },
    {
      title: "Thống kê theo tháng",
      children: [
        {
          title: "Mua hàng",
          span: 8,
          content: renderMonthlyPurchases,
        },
        {
          title: "Cho thuê",
          span: 8,
          content: renderMonthlyRents,
        },
        {
          title: "Đơn hàng",
          span: 8,
          content: renderMonthlyOrders,
        },
      ],
    },
    {
      title: "Thông tin bổ sung",
      children: [
        {
          title: "Danh mục bán chạy nhất",
          span: 24,
          content: renderBestSellingCategories,
        },
        {
          title: "Tổng quan báo cáo",
          span: 24,
          content: renderReportStatistics,
        },
      ],
    },
  ];

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
        {/* Dashboard Header */}
        <DashboardCard
          style={{ marginBottom: 24 }}
          title="Tổng quan bảng điều khiển"
          icon={<BarChartOutlined />}
        >
          <Text type="secondary">
            Chào mừng đến với bảng điều khiển. Đây là tổng quan về hiệu suất hệ
            thống của bạn.
          </Text>
        </DashboardCard>

        {/* Dashboard Sections */}
        {dashboardSections.map((section, index) => (
          <div key={index} style={{ marginBottom: 24 }}>
            {section.title && !section.children && (
              <Title level={3} style={{ marginBottom: 16 }}>
                {section.title}
              </Title>
            )}
            <Row gutter={[24, 24]}>
              {section.children ? (
                <>
                  <Col span={24}>
                    <Title level={3} style={{ marginBottom: 16 }}>
                      {section.title}
                    </Title>
                  </Col>
                  {section.children.map((child, childIndex) => (
                    <Col key={childIndex} span={child.span}>
                      {child.content()}
                    </Col>
                  ))}
                </>
              ) : (
                <Col span={section.span}>{section.content()}</Col>
              )}
            </Row>
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardStaff;

// Update styles to be more consistent
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
