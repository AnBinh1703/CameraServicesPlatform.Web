import {
  EyeOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  UserOutlined,
  StarOutlined,
  MessageOutlined,
  IdcardOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Descriptions,
  Input,
  message,
  Modal,
  Space,
  Table,
  Typography,
  Tabs,
} from "antd";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { getAllProductReports } from "../../api/productReportApi";
import { getAllReports } from "../../api/reportApi";
import { getAllRatings } from "../../api/ratingApi";
import { getProductById } from "../../api/productApi";
import DetailModal from "./ReportRating/DetailModal";
import ProductReportsTable from "./ReportRating/ProductReportsTable";
import RatingsTable from "./ReportRating/RatingsTable";
import UserReportsTable from "./ReportRating/UserReportsTable";
import { getProductReportById, approveProductReport, rejectProductReport } from "../../api/productReportApi";

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
  const [modalType, setModalType] = useState('view'); // 'view', 'approve', 'reject'
  const [messageInput, setMessageInput] = useState('');
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

  const fetchData = async (type) => {
    setLoading(true);
    try {
      let response;
      if (type === "userReports") {
        response = await getAllReports(pageIndex, pageSize);
        if (response && response.result) {
          setUserReports(response.result);
          setTotalPages(Math.ceil(response.result.length / pageSize));
        }
      } else if (type === "productReports") {
        response = await getAllProductReports(pageIndex, pageSize);
        if (response && response.result) {
          setProductReports(response.result);
          setTotalPages(Math.ceil(response.result.length / pageSize));
          await fetchProductNames(response.result);
        }
      } else if (type === "ratings") {
        response = await getAllRatings(pageIndex, pageSize);
        if (response && response.result) {
          setRatings(response.result);
          setTotalPages(Math.ceil(response.result.length / pageSize));
          await fetchProductNames(response.result);
        }
      }
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData("reports");
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
        setModalType('view');
      }
    } catch (error) {
      message.error("Lỗi khi tải chi tiết báo cáo");
    }
  };

  const handleApprove = (record) => {
    setProcessingItem(record);
    setProcessingType('approve');
    setIsProcessModalVisible(true);
  };

  const handleReject = (record) => {
    setProcessingItem(record);
    setProcessingType('reject');
    setIsProcessModalVisible(true);
  };

  const handleProcessSubmit = async () => {
    setProcessingLoading(true);
    try {
      const result = processingType === 'approve' 
        ? await approveProductReport(processingItem.productReportID, messageInput)
        : await rejectProductReport(processingItem.productReportID, messageInput);

      if (result?.isSuccess) {
        message.success(`Đã ${processingType === 'approve' ? 'phê duyệt' : 'từ chối'} báo cáo thành công`);
        setIsProcessModalVisible(false);
        setMessageInput('');
        fetchData("productReports");
      } else {
        message.error(result?.messages?.[0] || `Lỗi khi ${processingType === 'approve' ? 'phê duyệt' : 'từ chối'} báo cáo`);
      }
    } catch (error) {
      message.error(`Lỗi khi ${processingType === 'approve' ? 'phê duyệt' : 'từ chối'} báo cáo`);
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

  const userReportColumns = [
    {
      title: "Người báo cáo",
      dataIndex: "reportBy",
      key: "reportBy",
      ...getColumnSearchProps("reportBy"),
    },
    {
      title: "Người bị báo cáo",
      dataIndex: "reportedUser",
      key: "reportedUser",
      ...getColumnSearchProps("reportedUser"),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      ...getColumnSearchProps("content"),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        />
      ),
    },
  ];

  const productReportColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "productId",
      key: "productId",
      render: (productId) => (
        <Space direction="vertical" size="small">
          <span>Mã: {productId}</span>
          <span>Tên: {productDetails[productId]?.name || "N/A"}</span>
        </Space>
      ),
      ...getColumnSearchProps("productId"),
    },
    {
      title: "Người báo cáo",
      dataIndex: "reportBy",
      key: "reportBy",
      ...getColumnSearchProps("reportBy"),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      ...getColumnSearchProps("content"),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        />
      ),
    },
  ];

  const ratingColumns = [
    {
      title: "Mã đánh giá",
      dataIndex: "ratingID",
      key: "ratingID",
      ...getColumnSearchProps("ratingID"),
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "productID",
      key: "productID",
      render: (productID) => (
        <Space direction="vertical" size="small">
          <span>Mã: {productID}</span>
          <span>Tên: {productDetails[productID]?.name || "N/A"}</span>
        </Space>
      ),
      ...getColumnSearchProps("productID"),
    },
    {
      title: "Điểm đánh giá",
      dataIndex: "ratingValue",
      key: "ratingValue",
      render: (rating) => `${rating} sao`,
    },
    {
      title: "Nội dung",
      dataIndex: "reviewComment",
      key: "reviewComment",
      ...getColumnSearchProps("reviewComment"),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        />
      ),
    },
  ];

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
        title={processingType === 'approve' ? 'Phê duyệt báo cáo' : 'Từ chối báo cáo'}
        visible={isProcessModalVisible}
        onCancel={() => {
          setIsProcessModalVisible(false);
          setMessageInput('');
        }}
        onOk={handleProcessSubmit}
        okButtonProps={{ 
          loading: processingLoading,
          disabled: !messageInput.trim(),
          style: processingType === 'approve' ? { background: '#52c41a' } : {}
        }}
        okType={processingType === 'approve' ? 'primary' : 'danger'}
        okText={processingType === 'approve' ? 'Duyệt' : 'Từ chối'}
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
