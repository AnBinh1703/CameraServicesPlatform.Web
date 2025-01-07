import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  message,
  Modal,
  Space,
  Tabs,
  Typography,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { getProductById } from "../../api/productApi";
import {
  approveProductReport,
  getAllProductReports,
  getProductReportById,
  rejectProductReport,
} from "../../api/productReportApi";
import { getAllRatings } from "../../api/ratingApi";
import {
  approveReport,
  getAllReports,
  rejectReport,
} from "../../api/reportApi";
import DetailModal from "./ReportRating/DetailModal";
import ProductReportsTable from "./ReportRating/ProductReportsTable";
import RatingsTable from "./ReportRating/RatingsTable";
import UserReportsTable from "./ReportRating/UserReportsTable";

const { Title } = Typography;
const { TabPane } = Tabs;

const ManageReportRating = () => {
  const [userReports, setUserReports] = useState([]);
  const [productReports, setProductReports] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [productNames, setProductNames] = useState({});
  const [productDetails, setProductDetails] = useState({});
  const searchInput = useRef(null);
  const [modalType, setModalType] = useState("view"); // 'view', 'approve', 'reject'
  const [messageInput, setMessageInput] = useState("");
  const [isProcessModalVisible, setIsProcessModalVisible] = useState(false);
  const [processingType, setProcessingType] = useState(null); // 'approve' or 'reject'
  const [processingItem, setProcessingItem] = useState(null);
  const [processingLoading, setProcessingLoading] = useState(false);

  const fetchProductNames = async (items) => {
    try {
      const productPromises = items.map(async (item) => {
        const productId = item.productID || item.productId;
        if (productId) {
          const product = await getProductById(productId);
          return {
            id: productId,
            name: product?.productName || "N/A",
            // Add any other product details you need
          };
        }
        return { id: productId, name: "N/A" };
      });

      const products = await Promise.all(productPromises);
      const productMap = {};
      products.forEach((item) => {
        productMap[item.id] = item;
      });
      setProductDetails(productMap);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const fetchUserReports = async () => {
    setLoading(true);
    try {
      const response = await getAllReports(pageIndex, pageSize);
      if (response?.isSuccess && response?.result?.items) {
        setUserReports(response.result.items);
        setTotalPages(
          response.result.totalPages ||
            Math.ceil(response.result.items.length / pageSize)
        );
      } else {
        setUserReports([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching user reports:", error);
      message.error("Lỗi khi tải dữ liệu báo cáo người dùng");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductReports = async () => {
    setLoading(true);
    try {
      const response = await getAllProductReports(pageIndex, pageSize);
      if (response?.isSuccess && response?.result) {
        setProductReports(response.result);
        setTotalPages(Math.ceil(response.result.length / pageSize));
        await fetchProductNames(response.result);
      } else {
        setProductReports([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching product reports:", error);
      message.error("Lỗi khi tải dữ liệu báo cáo sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const response = await getAllRatings(pageIndex, pageSize);
      if (response?.isSuccess && response?.result) {
        setRatings(response.result);
        setTotalPages(Math.ceil(response.result.length / pageSize));
        await fetchProductNames(response.result);
      } else {
        setRatings([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
      message.error("Lỗi khi tải dữ liệu đánh giá");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (type) => {
    switch (type) {
      case "userReports":
        await fetchUserReports();
        break;
      case "productReports":
        await fetchProductReports();
        break;
      case "ratings":
        await fetchRatings();
        break;
      default:
        console.error("Unknown data type:", type);
    }
  };

  useEffect(() => {
    fetchData("userReports");
  }, [pageIndex, pageSize]);

  const handleTabChange = (key) => {
    setPageIndex(1);
    fetchData(key);
  };

  const handleViewDetails = async (record) => {
    try {
      const details = await getProductReportById(record.productReportID);
      if (details?.result) {
        setSelectedItem(details.result);
        setIsModalVisible(true);
        setModalType("view");
      }
    } catch (error) {
      message.error("Lỗi khi tải chi tiết báo cáo");
    }
  };

  const handleApprove = (record) => {
    setProcessingItem(record);
    setProcessingType("approve");
    setIsProcessModalVisible(true);
  };

  const handleReject = (record) => {
    setProcessingItem(record);
    setProcessingType("reject");
    setIsProcessModalVisible(true);
  };

  const handleUserReportApprove = (record) => {
    setProcessingItem(record);
    setProcessingType("userApprove");
    setIsProcessModalVisible(true);
  };

  const handleUserReportReject = (record) => {
    setProcessingItem(record);
    setProcessingType("userReject");
    setIsProcessModalVisible(true);
  };

  const handleProcessSubmit = async () => {
    setProcessingLoading(true);
    try {
      let result;

      switch (processingType) {
        case "userApprove":
          result = await approveReport(processingItem.reportID, messageInput);
          break;
        case "userReject":
          result = await rejectReport(processingItem.reportID, messageInput);
          break;
        case "approve":
          result = await approveProductReport(
            processingItem.productReportID,
            messageInput
          );
          break;
        case "reject":
          result = await rejectProductReport(
            processingItem.productReportID,
            messageInput
          );
          break;
      }

      if (result?.isSuccess) {
        message.success(
          `Đã ${
            processingType.includes("approve") ? "phê duyệt" : "từ chối"
          } báo cáo thành công`
        );
        setIsProcessModalVisible(false);
        setMessageInput("");
        // Refresh appropriate data based on type
        if (processingType.startsWith("user")) {
          fetchData("userReports");
        } else {
          fetchData("productReports");
        }
      } else {
        message.error(
          result?.messages?.[0] ||
            `Lỗi khi ${
              processingType.includes("approve") ? "phê duyệt" : "từ chối"
            } báo cáo`
        );
      }
    } catch (error) {
      console.error("Process error:", error);
      message.error(
        `Lỗi khi ${
          processingType.includes("approve") ? "phê duyệt" : "từ chối"
        } báo cáo`
      );
    } finally {
      setProcessingLoading(false);
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Đặt lại
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()) ?? false,
  });

  const handleTableChange = (pagination) => {
    setPageIndex(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const pagination = {
    current: pageIndex,
    pageSize,
    total: totalPages * pageSize,
    showSizeChanger: true,
  };

  return (
    <Card>
      <Title level={2}>Quản lý báo cáo & đánh giá</Title>
      <Tabs defaultActiveKey="userReports" onChange={handleTabChange}>
        <TabPane tab="Báo cáo người dùng" key="userReports">
          <UserReportsTable
            data={userReports}
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
            getColumnSearchProps={getColumnSearchProps}
            handleViewDetails={handleViewDetails}
            onApprove={handleUserReportApprove}
            onReject={handleUserReportReject}
          />
        </TabPane>
        <TabPane tab="Báo cáo sản phẩm" key="productReports">
          <ProductReportsTable
            data={productReports}
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
            productDetails={productDetails}
            getColumnSearchProps={getColumnSearchProps}
            handleViewDetails={handleViewDetails}
            handleApprove={handleApprove}
            handleReject={handleReject}
          />
        </TabPane>
        <TabPane tab="Đánh giá" key="ratings">
          <RatingsTable
            data={ratings}
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
            productDetails={productDetails}
            getColumnSearchProps={getColumnSearchProps}
          />
        </TabPane>
      </Tabs>

      <Modal
        title={
          processingType === "approve" || processingType === "userApprove"
            ? "Phê duyệt báo cáo"
            : "Từ chối báo cáo"
        }
        visible={isProcessModalVisible}
        onCancel={() => {
          setIsProcessModalVisible(false);
          setMessageInput("");
        }}
        onOk={handleProcessSubmit}
        okButtonProps={{
          loading: processingLoading,
          disabled: !messageInput.trim(),
          style: processingType === "approve" ? { background: "#52c41a" } : {},
        }}
        okType={
          processingType === "approve" || processingType === "userApprove"
            ? "primary"
            : "danger"
        }
        okText={
          processingType === "approve" || processingType === "userApprove"
            ? "Duyệt"
            : "Từ chối"
        }
      >
        <Input.TextArea
          placeholder="Nhập tin nhắn xử lý..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          rows={4}
        />
      </Modal>

      <DetailModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        item={selectedItem}
        productDetails={productDetails}
      />
    </Card>
  );
};

export default ManageReportRating;
