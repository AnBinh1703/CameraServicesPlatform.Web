import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  message,
  Modal,
  Row,
  Spin,
  Statistic,
  Table,
  Typography,
} from "antd";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import dayjs from "dayjs";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../api/accountApi";
import { getComboById, getCombosBySupplierId } from "../../api/comboApi";
import {
  getBestSellingCategoriesBySupplier,
  getCalculateMonthlyRevenueBySupplier,
  getCalculateTotalRevenueBySupplier,
  getMonthOrderCostStatisticsBySupplier, // Add this import
  getOrderStatusStatisticsBySupplier,
  getSupplierOrderStatistics,
  getSupplierPaymentStatistics,
  getSupplierProductStatistics,
  getSupplierRatingStatistics,
  getSupplierTransactionStatistics,
} from "../../api/dashboardApi";
import { getSupplierById, updateSupplier } from "../../api/supplierApi";
import ComboCarousel from "./DashboardComponent/ComboCarousel";
import OrderStatisticsTable from "./DashboardComponent/OrderStatisticsTable";
import ProductStatisticsTable from "./DashboardComponent/ProductStatisticsTable";
import RevenueCard from "./DashboardComponent/RevenueCard";
import SupplierInfoCard from "./DashboardComponent/SupplierInfoCard";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

// Add formatter at the top
const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

// Define duration mapping
const durationMap = {
  0: "1",
  1: "2",
  2: "3",
  3: "5",
};

const DashboardSupplier = () => {
  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;
  const [supplierId, setSupplierId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    bestSellingCategories: [],
    productStatistics: [],
    orderCostStatistics: [],
    orderStatistics: {},
    totalRevenue: 0,
    monthlyRevenue: [],
    ratingStatistics: [],
    paymentStatistics: [],
    transactionStatistics: [],
    orderStatusStatistics: [],
  });
  const [dateRange, setDateRange] = useState([
    moment().subtract(1, "months"),
    moment(),
  ]);
  const [supplierDetails, setSupplierDetails] = useState(null);
  const [combos, setCombos] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addComboForm] = Form.useForm();
  const [startDate, setStartDate] = useState(() =>
    dayjs().subtract(1, "month")
  );
  const [endDate, setEndDate] = useState(() => dayjs());
  const [totalCombos, setTotalCombos] = useState(0); // New state for total combos
  const [totalDuration, setTotalDuration] = useState(0); // New state for total duration
  const [logoPreview, setLogoPreview] = useState(null);
  const [statistics, setStatistics] = useState({
    bestSellingCategories: [],
    productStats: [],
    orderCosts: [],
    orderStats: {},
    totalRevenue: 0,
    monthlyRevenue: [],
    ratings: [],
    payments: [],
    transactions: [],
    orderStatus: [],
  });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user.id) {
        try {
          const response = await getSupplierIdByAccountId(user.id);
          if (response?.isSuccess) {
            setSupplierId(response.result);
          } else {
            message.error("Không thể lấy ID nhà cung cấp.");
          }
        } catch (error) {
          message.error("Lỗi khi lấy ID nhà cung cấp.");
        }
      }
    };

    fetchSupplierId();
  }, [user]);

  useEffect(() => {
    const fetchSupplierDetails = async () => {
      if (supplierId) {
        const response = await getSupplierById(supplierId);
        if (response?.isSuccess) {
          setSupplierDetails(response.result.items[0]);
        } else {
          message.error("Không thể lấy thông tin nhà cung cấp.");
        }
      }
    };

    fetchSupplierDetails();
  }, [supplierId]);

  useEffect(() => {
    const fetchCombos = async () => {
      if (supplierId) {
        try {
          console.log("Fetching combos for supplierId:", supplierId);
          const response = await getCombosBySupplierId(supplierId);
          console.log("Response from getCombosBySupplierId:", response);

          if (response?.isSuccess && Array.isArray(response.result)) {
            const comboDetailsPromises = response.result.map(async (combo) => {
              console.log("Fetching details for comboId:", combo.comboId);
              const comboDetail = await getComboById(combo.comboId);
              console.log("Response from getComboById:", comboDetail);

              return {
                ...combo,
                comboName: comboDetail?.result?.comboName,
                comboPrice: comboDetail?.result?.comboPrice,
                durationCombo: comboDetail?.result?.durationCombo,
                startTime: combo.startTime,
                endTime: combo.endTime,
                isDisable: true, // Set isDisable to true
              };
            });

            const comboDetails = await Promise.all(comboDetailsPromises);
            console.log("All combo details:", comboDetails);
            setCombos(comboDetails);
          } else {
          }
        } catch (error) {
          console.error("Error fetching combos:", error);
          message.error("Lỗi khi lấy thông tin combo.");
        }
      }
    };

    fetchCombos();
  }, [supplierId]);

  useEffect(() => {
    const fetchData = async () => {
      if (supplierId && dateRange.length === 2) {
        setLoading(true);
        try {
          const [startDate, endDate] = dateRange.map((date) =>
            date.format("MM-DD-YYYY")
          );

          const bestSellingCategories =
            await getBestSellingCategoriesBySupplier(
              supplierId,
              startDate,
              endDate
            );
          const productStatistics = await getSupplierProductStatistics(
            supplierId
          );
          const orderCostStatistics =
            await getMonthOrderCostStatisticsBySupplier(
              supplierId,
              startDate,
              endDate
            );
          const orderStatistics = await getSupplierOrderStatistics(
            supplierId,
            startDate,
            endDate
          );
          const totalRevenue = await getCalculateTotalRevenueBySupplier(
            supplierId
          );
          const monthlyRevenue = await getCalculateMonthlyRevenueBySupplier(
            supplierId,
            startDate,
            endDate
          );
          const ratingStatistics = await getSupplierRatingStatistics(
            supplierId
          );
          const paymentStatistics = await getSupplierPaymentStatistics(
            supplierId,
            startDate,
            endDate
          );
          const transactionStatistics = await getSupplierTransactionStatistics(
            supplierId,
            startDate,
            endDate
          );
          const orderStatusStatistics =
            await getOrderStatusStatisticsBySupplier(supplierId);

          setData({
            bestSellingCategories: Array.isArray(bestSellingCategories)
              ? bestSellingCategories
              : [],
            productStatistics: Array.isArray(productStatistics)
              ? productStatistics
              : [],
            orderCostStatistics: Array.isArray(orderCostStatistics)
              ? orderCostStatistics
              : [],
            orderStatistics: orderStatistics || {},
            totalRevenue: totalRevenue || 0,
            monthlyRevenue: Array.isArray(monthlyRevenue) ? monthlyRevenue : [],
            ratingStatistics: Array.isArray(ratingStatistics)
              ? ratingStatistics
              : [],
            paymentStatistics: Array.isArray(paymentStatistics)
              ? paymentStatistics
              : [],
            transactionStatistics: Array.isArray(transactionStatistics)
              ? transactionStatistics
              : [],
            orderStatusStatistics: Array.isArray(orderStatusStatistics)
              ? orderStatusStatistics
              : [],
          });
        } catch (error) {
          console.error("Error fetching data:", error); // Added logging
          message.error("Lỗi khi lấy dữ liệu.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [supplierId, dateRange]);

  useEffect(() => {
    if (combos.length > 0) {
      setTotalCombos(combos.length);
      const duration = combos.reduce(
        (sum, combo) => sum + (parseInt(combo.durationCombo) || 0),
        0
      );
      setTotalDuration(duration);
    } else {
      setTotalCombos(0);
      setTotalDuration(0);
    }
  }, [combos]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!supplierId || !dateRange[0] || !dateRange[1]) return;

      setLoading(true);
      try {
        const [startDate, endDate] = dateRange.map((date) =>
          date.format("YYYY-MM-DD")
        );

        const [
          bestSellingCategories,
          productStats,
          orderCosts,
          orderStats,
          totalRevenue,
          monthlyRevenue,
          ratings,
          payments,
          transactions,
          orderStatus,
        ] = await Promise.all([
          getBestSellingCategoriesBySupplier(supplierId, startDate, endDate),
          getSupplierProductStatistics(supplierId),
          getMonthOrderCostStatisticsBySupplier(supplierId, startDate, endDate),
          getSupplierOrderStatistics(supplierId, startDate, endDate),
          getCalculateTotalRevenueBySupplier(supplierId),
          getCalculateMonthlyRevenueBySupplier(supplierId, startDate, endDate),
          getSupplierRatingStatistics(supplierId),
          getSupplierPaymentStatistics(supplierId, startDate, endDate),
          getSupplierTransactionStatistics(supplierId, startDate, endDate),
          getOrderStatusStatisticsBySupplier(supplierId),
        ]);

        setStatistics({
          bestSellingCategories: bestSellingCategories || [],
          productStats: productStats || [],
          orderCosts: orderCosts || [],
          orderStats: orderStats || {},
          totalRevenue: totalRevenue || 0,
          monthlyRevenue: monthlyRevenue || [],
          ratings: ratings || [],
          payments: payments || [],
          orderStatus: orderStatus || [],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        message.error("Không thể tải dữ liệu bảng điều khiển");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [supplierId, dateRange]);

  const handleDateChange = (dates) => {
    if (dates) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    } else {
      setStartDate(dayjs().subtract(1, "month"));
      setEndDate(dayjs());
    }
  };

  const handleUpdateSupplier = async (formData) => {
    const result = await updateSupplier(formData);
    if (result) {
      message.success("Cập nhật nhà cung cấp thành công");
      setSupplierDetails(result);
      setIsModalVisible(false);
    } else {
      message.error("Cập nhật nhà cung cấp thất bại");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="container mx-auto p-2 bg-gray-50">
      <Title level={3} className="text-center mb-4 text-blue-600">
        Bảng Điều Khiển Nhà Cung Cấp
      </Title>
      {supplierDetails && (
        <Row gutter={[8, 8]}>
          <Col xs={24} lg={12}>
            <SupplierInfoCard
              supplierDetails={supplierDetails}
              showModal={showModal}
            />
          </Col>
          <Col xs={24} lg={12}>
            <RevenueCard totalRevenue={statistics.totalRevenue} />
          </Col>
        </Row>
      )}
      <Modal
        title="Cập Nhật Thông Tin Nhà Cung Cấp"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        bodyStyle={{ padding: "12px" }}
        width={400}
      >
        <Form
          layout="vertical"
          initialValues={supplierDetails}
          onFinish={handleUpdateSupplier}
        >
          <Form.Item name="supplierName" label="Tên Nhà Cung Cấp">
            <Input />
          </Form.Item>
          <Form.Item name="supplierDescription" label="Mô Tả Nhà Cung Cấp">
            <Input />
          </Form.Item>
          <Form.Item name="supplierAddress" label="Địa Chỉ Nhà Cung Cấp">
            <Input />
          </Form.Item>
          <Form.Item name="contactNumber" label="Số Điện Thoại Liên Hệ">
            <Input />
          </Form.Item>
          <Form.Item name="supplierLogo" label="Logo Nhà Cung Cấp">
            <div>
              {(logoPreview || supplierDetails?.supplierLogo) && (
                <div className="mb-2">
                  <Image
                    src={logoPreview || supplierDetails?.supplierLogo}
                    alt="Logo Preview"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                </div>
              )}
              <Input type="file" onChange={handleLogoChange} accept="image/*" />
            </div>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Cập Nhật
          </Button>
        </Form>
      </Modal>

      <Card className="mb-2 shadow-sm">
        <RangePicker
          onChange={handleDateChange}
          defaultValue={[startDate, endDate]}
          className="rounded-sm"
          size="small"
          allowClear
          ranges={{
            "This Month": [moment().startOf("month"), moment().endOf("month")],
            "Last Month": [
              moment().subtract(1, "months").startOf("month"),
              moment().subtract(1, "months").endOf("month"),
            ],
          }}
        />
      </Card>
      {loading ? (
        <Spin className="flex justify-center items-center h-64" size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <ComboCarousel
              combos={combos}
              totalCombos={totalCombos}
              totalDuration={totalDuration}
            />
          </Col>
          <Col xs={24}>
            <ProductStatisticsTable
              productStatistics={statistics.productStats}
            />
          </Col>
          <Col xs={24}>
            <OrderStatisticsTable orderStatistics={statistics.orderStats} />
          </Col>
          <Col xs={24}>
            <Card title="Thống kê trạng thái đơn hàng" className="shadow-md">
              <Table
                dataSource={[statistics.orderStatus].filter(Boolean)}
                columns={[
                  {
                    title: "Chờ xử lý",
                    dataIndex: "pendingOrders",
                    key: "pendingOrders",
                  },
                  {
                    title: "Hoàn thành",
                    dataIndex: "completedOrders",
                    key: "completedOrders",
                  },
                  {
                    title: "Đã hủy",
                    dataIndex: "canceledOrders",
                    key: "canceledOrders",
                  },
                  {
                    title: "Đang thanh toán",
                    dataIndex: "paymentOrders",
                    key: "paymentOrders",
                  },
                  {
                    title: "Chờ hoàn tiền",
                    dataIndex: "pendingRefundOrders",
                    key: "pendingRefundOrders",
                  },
                ]}
                pagination={false}
              />
            </Card>
          </Col>{" "}
          <Col xs={24} lg={12}>
            <Card title="Thống kê đánh giá" className="shadow-md">
              {statistics.ratings && (
                <>
                  <Statistic
                    title="Đánh giá trung bình"
                    value={statistics.ratings.averageRating}
                    precision={2}
                    suffix="/5"
                  />
                  <Pie
                    data={{
                      labels: statistics.ratings.ratingDistribution?.map(
                        (r) => `${r.ratingValue} sao`
                      ),
                      datasets: [
                        {
                          data: statistics.ratings.ratingDistribution?.map(
                            (r) => r.count
                          ),
                          backgroundColor: [
                            "#ff6384",
                            "#36a2eb",
                            "#ffce56",
                            "#4bc0c0",
                            "#9966ff",
                          ],
                        },
                      ],
                    }}
                  />
                </>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default DashboardSupplier;
