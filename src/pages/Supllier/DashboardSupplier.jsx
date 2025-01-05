import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Spin,
  Typography,
  Image, // Add this import
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../api/accountApi";
import { getComboById, getCombosBySupplierId } from "../../api/comboApi";
import {
  getBestSellingCategoriesBySupplier,
  getCalculateMonthlyRevenueBySupplier,
  getCalculateTotalRevenueBySupplier,
  getMonthOrderCostStatistics,
  getOrderStatusStatisticsBySupplier,
  getSupplierOrderStatistics,
  getSupplierPaymentStatistics,
  getSupplierProductStatistics,
  getSupplierRatingStatistics,
  getSupplierTransactionStatistics,
} from "../../api/dashboardApi";
import { getSupplierById, updateSupplier } from "../../api/supplierApi";
import ComboCarousel from "./DashboardComponent/ComboCarousel";
import MonthlyRevenueChart from "./DashboardComponent/MonthlyRevenueChart";
import OrderCostStatisticsTable from "./DashboardComponent/OrderCostStatisticsTable";
import OrderStatisticsTable from "./DashboardComponent/OrderStatisticsTable";
import ProductStatisticsTable from "./DashboardComponent/ProductStatisticsTable";
import RevenueCard from "./DashboardComponent/RevenueCard";
import SupplierInfoCard from "./DashboardComponent/SupplierInfoCard";

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
            message.error("Không thể lấy thông tin combo.");
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
          ); // Format dates

          const bestSellingCategories =
            await getBestSellingCategoriesBySupplier(
              supplierId,
              startDate,
              endDate
            );
          const productStatistics = await getSupplierProductStatistics(
            supplierId
          );
          const orderCostStatistics = await getMonthOrderCostStatistics(
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

  const handleAddCombo = () => {
    setIsAddComboModalVisible(true);
  };

  const columns = useMemo(
    () => [
      {
        title: "Tên Sản Phẩm",
        dataIndex: "productName",
        key: "productName",
      },
    ],
    []
  );

  const orderCostColumns = useMemo(
    () => [
      {
        title: "Tháng",
        dataIndex: "month",
        key: "month",
        render: (text) => new Date(text).toLocaleDateString(),
      },
      {
        title: "Tổng Chi Phí",
        dataIndex: "totalCost",
        key: "totalCost",
        render: (text) => formatter.format(text),
      },
    ],
    []
  );

  const orderStatisticsColumns = useMemo(
    () => [
      {
        title: "Tổng Doanh Thu",
        dataIndex: "totalSales",
        key: "totalSales",
        render: (text) => formatter.format(text),
      },
      {
        title: "Tổng Số Đơn Hàng",
        dataIndex: "totalOrders",
        key: "totalOrders",
      },
      {
        title: "Chờ Xử Lý",
        dataIndex: "pendingOrders",
        key: "pendingOrders",
      },
      {
        title: "Hoàn Thành",
        dataIndex: "completedOrders",
        key: "completedOrders",
      },
      {
        title: "Bị Hủy",
        dataIndex: "canceledOrders",
        key: "canceledOrders",
      },
      {
        title: "Được Duyệt",
        dataIndex: "approvedOrders",
        key: "approvedOrders",
      },
      {
        title: "Đã Đặt",
        dataIndex: "placedOrders",
        key: "placedOrders",
      },
      {
        title: "Đã Giao",
        dataIndex: "shippedOrders",
        key: "shippedOrders",
      },
      {
        title: "Thanh Toán Thất Bại",
        dataIndex: "paymentFailOrders",
        key: "paymentFailOrders",
      },
      {
        title: "Đang Hủy",
        dataIndex: "cancelingOrders",
        key: "cancelingOrders",
      },
      {
        title: "Thanh Toán",
        dataIndex: "paymentOrders",
        key: "paymentOrders",
      },
      {
        title: "Chờ Hoàn Tiền",
        dataIndex: "pendingRefundOrders",
        key: "pendingRefundOrders",
      },
      {
        title: "Đã Hoàn Tiền",
        dataIndex: "refundOrders",
        key: "refundOrders",
      },
      {
        title: "Trả Lại Tiền Đặt Cọc",
        dataIndex: "depositReturnOrders",
        key: "depositReturnOrders",
      },
      {
        title: "Gia Hạn",
        dataIndex: "extendOrders",
        key: "extendOrders",
      },
    ],
    []
  );

  return (
    <div className="container mx-auto p-4 bg-gray-50">
      <Title level={1} className="text-center mb-8 text-blue-600">
        Bảng Điều Khiển Nhà Cung Cấp
      </Title>
      {supplierDetails && (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <SupplierInfoCard
              supplierDetails={supplierDetails}
              showModal={showModal}
            />
          </Col>
          <Col xs={24} lg={12}>
            <ComboCarousel
              combos={combos}
              totalCombos={totalCombos}
              totalDuration={totalDuration}
            />
          </Col>
        </Row>
      )}
      <Modal
        title="Cập Nhật Thông Tin Nhà Cung Cấp"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        bodyStyle={{ padding: "20px" }}
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
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                </div>
              )}
              <Input 
                type="file" 
                onChange={handleLogoChange}
                accept="image/*"
              />
            </div>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Cập Nhật
          </Button>
        </Form>
      </Modal>

      <Card className="mb-4 shadow-md">
        <RangePicker
          onChange={handleDateChange}
          defaultValue={[startDate, endDate]}
          className="rounded-md"
          allowClear
          ranges={{
            "Last 7 Days": [moment().subtract(7, "days"), moment()],
            "Last 30 Days": [moment().subtract(30, "days"), moment()],
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
          <Col xs={24} lg={12}>
            <RevenueCard totalRevenue={data.totalRevenue} />
          </Col>
          <Col xs={24} lg={12}>
            <OrderCostStatisticsTable
              orderCostStatistics={data.orderCostStatistics}
            />
          </Col>
          <Col xs={24}>
            <OrderStatisticsTable orderStatistics={data.orderStatistics} />
          </Col>
          <Col xs={24} lg={12}>
            <ProductStatisticsTable
              productStatistics={data.productStatistics}
            />
          </Col>
          <Col xs={24}>
            <MonthlyRevenueChart monthlyRevenue={data.monthlyRevenue} />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default DashboardSupplier;
