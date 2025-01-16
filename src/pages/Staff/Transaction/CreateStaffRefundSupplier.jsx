import {
  HomeOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Input,
  message,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getStaffByAccountId, getUserById } from "../../../api/accountApi";
import { getAllOrders } from "../../../api/orderApi";
import { getProductById } from "../../../api/productApi"; // Import the function
import { getSupplierById } from "../../../api/supplierApi";
import {
  addImagePayment,
  createStaffRefundSupplier,
  getTransactionImage,
  updateOrderStatusRefund, // Add this import
} from "../../../api/transactionApi";

const { Title } = Typography;

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
  5: {
    text: "Thanh toán thất bại",
    color: "cyan",
    icon: "fa-money-bill-wave",
  },
  6: { text: "Đang hủy", color: "lime", icon: "fa-box-open" },
  7: { text: "Đã hủy thành công", color: "red", icon: "fa-times-circle" },
  8: { text: "Đã Thanh toán", color: "orange", icon: "fa-money-bill-wave" },
  9: { text: "Hoàn tiền đang chờ xử lý", color: "pink", icon: "fa-clock" },
  10: { text: "Hoàn tiền thành công ", color: "brown", icon: "fa-undo" },
  11: { text: "Hoàn trả tiền đặt cọc", color: "gold", icon: "fa-piggy-bank" },
  12: { text: "Gia hạn", color: "violet", icon: "fa-calendar-plus" },
};

const orderTypeMap = {
  0: { text: "Mua", color: "indigo", icon: "fa-shopping-bag" },
  1: { text: "Thuê", color: "green", icon: "fa-warehouse" },
};

const deliveryStatusMap = {
  0: { text: "Nhận tại cửa hàng", color: "blue", icon: "fa-store" },
  1: { text: "Giao hàng tận nơi", color: "green", icon: "fa-truck" },
  2: { text: "Trả lại", color: "red", icon: "fa-undo" },
};

const CreateStaffRefundSupplier = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [total, setTotal] = useState(0);
  const [supplierNames, setSupplierNames] = useState({});
  const [accountNames, setAccountNames] = useState({});
  const [staffId, setStaffId] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const user = useSelector((state) => state.user.user || {});

  useEffect(() => {
    const fetchStaffId = async () => {
      if (!user || !user.id) {
        console.error("User ID is not available");
        return;
      }

      try {
        const staffData = await getStaffByAccountId(user.id);
        if (staffData && staffData.isSuccess) {
          setStaffId(staffData.result);
          console.log("Fetched staffId:", staffData.result);
        } else {
          console.error("Failed to fetch staffId:", staffData.messages);
        }
      } catch (error) {
        console.error("Error fetching staffId:", error);
      }
    };

    fetchStaffId();
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const result = await getAllOrders(pageIndex, pageSize);
      if (result && result.isSuccess) {
        setOrders(result.result);
        setTotal(result.totalCount);

        // Fetch supplier and account names
        const supplierNamesMap = {};
        const accountNamesMap = {};
        await Promise.all(
          result.result.map(async (order) => {
            if (order.supplierID) {
              try {
                const supplierData = await getSupplierById(order.supplierID);
                if (
                  supplierData &&
                  supplierData.isSuccess &&
                  supplierData.result.items.length > 0
                ) {
                  supplierNamesMap[order.supplierID] =
                    supplierData.result.items[0].supplierName;
                } else {
                  console.error(
                    `No data found for supplierID: ${order.supplierID}`
                  );
                }
              } catch (error) {
                console.error(
                  `Error fetching supplierID: ${order.supplierID}`,
                  error
                );
              }
            }
            if (order.accountID) {
              try {
                const accountData = await getUserById(order.accountID);
                if (accountData && accountData.isSuccess) {
                  accountNamesMap[
                    order.accountID
                  ] = ` ${accountData.result.firstName} ${accountData.result.lastName}`;
                } else {
                  console.error(
                    `No data found for accountID: ${order.accountID}`
                  );
                }
              } catch (error) {
                console.error(
                  `Error fetching accountID: ${order.accountID}`,
                  error
                );
              }
            }
          })
        );
        setSupplierNames(supplierNamesMap);
        setAccountNames(accountNamesMap);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [pageIndex, pageSize]);

  const handleRefund = async (orderID, orderStatus, orderType) => {
    if (!user || !user.id) {
      console.error("User ID is not available");
      return;
    }

    try {
      const staffData = await getStaffByAccountId(user.id);
      if (!staffData || !staffData.isSuccess) {
        console.error(
          "Failed to fetch staffId:",
          staffData ? staffData.messages : "No response"
        );
        return;
      }

      const staffId = staffData.result;
      console.log("Staff ID:", staffId);

      let response = await createStaffRefundSupplier(orderID, staffId);

      if (response && response.isSuccess) {
        setSelectedOrderId(response.result.orderId); // Make sure to set the orderId
        Modal.success({
          title: "Thông tin hoàn tiền",
          width: 600,
          content: (
            <div className="refund-info">
              <p>Ngân hàng: {response.result.bankName}</p>
              <p>Số tài khoản: {response.result.accountNumber}</p>
              <p>Chủ tài khoản: {response.result.accountHolder}</p>
              <p>Mã đơn hàng: {response.result.orderId}</p>
              <p>
                Tổng số tiền:
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(response.result.refundAmount)}
              </p>
              <div className="upload-section">
                <Upload
                  name="img"
                  listType="picture-card"
                  showUploadList={{
                    showPreviewIcon: true,
                    showRemoveIcon: true,
                    showDownloadIcon: false,
                  }}
                  beforeUpload={(file) => {
                    handleUpload(file, response.result.orderId);
                    return false;
                  }}
                  maxCount={1}
                >
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên hình ảnh</div>
                  </div>
                </Upload>
              </div>
            </div>
          ),
          className: "refund-modal",
        });
      } else {
        message.error("Không thể khởi tạo thanh toán.");
      }
    } catch (error) {
      message.error(
        "Không thể tạo đơn hàng. " + (error.response?.data?.title || "")
      );
      console.error("Error creating refund:", error);
    }
  };

  const handleUpload = async (file, orderId) => {
    if (!orderId) {
      message.error("Mã đơn hàng không có sẵn cho tải lên.");
      return;
    }

    setUploading(true);
    try {
      const response = await addImagePayment(orderId, file);
      if (response.isSuccess) {
        message.success(`Tải lên hình ảnh thành công cho đơn hàng: ${orderId}`);
        setImageUrls((prev) => ({
          ...prev,
          [orderId]: URL.createObjectURL(file),
        }));
        // Optionally refresh the orders list
        // fetchOrders();
      } else {
        message.error(
          "Không thể tải lên hình ảnh: " +
            (response.messages || "Lỗi không xác định")
        );
      }
    } catch (error) {
      message.error(
        "Lỗi khi tải lên hình ảnh: " + (error.message || "Lỗi không xác định")
      );
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleViewImage = async (orderID) => {
    try {
      const response = await getTransactionImage(orderID);
      if (response.isSuccess) {
        Modal.info({
          title: "Hình ảnh giao dịch",
          content: (
            <div>
              <img
                src={response.result}
                alt="Transaction"
                style={{ width: "100%", marginBottom: "10px" }}
              />
            </div>
          ),
        });
      } else {
        message.error("Không thể lấy hình ảnh giao dịch.");
      }
    } catch (error) {
      message.error("Error fetching transaction image.");
      console.error("Error fetching transaction image:", error);
    }
  };
  const handleConfirmRefund = async (orderId) => {
    try {
      const response = await updateOrderStatusRefund(orderId);
      if (response.isSuccess) {
        message.success("Xác nhận hoàn tiền thành công");
        fetchOrders(); // Refresh the table data
      } else {
        message.error(
          "Không thể xác nhận hoàn tiền: " +
            (response.messages || "Lỗi không xác định")
        );
      }
    } catch (error) {
      message.error(
        "Lỗi khi xác nhận hoàn tiền: " + (error.message || "Lỗi không xác định")
      );
      console.error("Error confirming refund:", error);
    }
  };
  const handleViewDetails = async (orderDetails) => {
    const detailsWithProductNames = await Promise.all(
      orderDetails.map(async (detail) => {
        if (!detail.productName) {
          try {
            const productData = await getProductById(detail.productID);
            detail.productName = productData.name;
          } catch (error) {
            console.error("Error fetching product name:", error);
            detail.productName = "N/A";
          }
        }
        return detail;
      })
    );
    setSelectedOrderDetails(detailsWithProductNames);
    setIsModalVisible(true);
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
          placeholder={`Search ${dataIndex}`}
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
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
    setPageIndex(pagination.current);
    setPageSize(pagination.pageSize);
  };
  const columns = [
    {
      title: "Mã nhà cung cấp",
      dataIndex: "supplierID",
      key: "supplierID",
      render: (supplierID) => supplierNames[supplierID],
      ...getColumnSearchProps("supplierID"),
      sorter: (a, b) => a.supplierID - b.supplierID,
      sortOrder: sortedInfo.columnKey === "supplierID" && sortedInfo.order,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
      ...getColumnSearchProps("orderID"),
      sorter: (a, b) => a.orderID - b.orderID,
      sortOrder: sortedInfo.columnKey === "orderID" && sortedInfo.order,
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (orderDate) => moment(orderDate).format("DD - MM - YYYY HH:mm"),
      sorter: (a, b) => moment(a.orderDate).unix() - moment(b.orderDate).unix(),
      sortOrder: sortedInfo.columnKey === "orderDate" && sortedInfo.order,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Space direction="vertical">
            <Input
              placeholder="YYYY-MM-DD"
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => confirm()}
              style={{ width: 188, marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => confirm()}
                size="small"
                style={{ width: 90 }}
              >
                Filter
              </Button>
              <Button
                onClick={() => clearFilters()}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
            </Space>
          </Space>
        </div>
      ),
      onFilter: (value, record) => {
        if (!value) return true;
        const orderDate = moment(record.orderDate).format("YYYY-MM-DD");
        return orderDate.includes(value);
      },
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "orderStatus",
      key: "orderStatus",
      filters: Object.entries(orderStatusMap).map(([key, value]) => ({
        text: value.text,
        value: parseInt(key),
      })),
      onFilter: (value, record) => record.orderStatus === value,
      render: (orderStatus) => {
        const status = orderStatusMap[orderStatus];
        return (
          <Tag color={status.color}>
            <i className={`fa ${status.icon}`} /> {status.text}
          </Tag>
        );
      },
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      sortOrder: sortedInfo.columnKey === "totalAmount" && sortedInfo.order,
      render: (totalAmount) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(totalAmount),
    },
    {
      title: "Mã tài khoản",
      dataIndex: "accountID",
      key: "accountID",
      render: (accountID) => accountNames[accountID],
    },
    {
      title: "Loại đơn hàng",
      dataIndex: "orderType",
      key: "orderType",
      render: (orderType) => {
        const type = orderTypeMap[orderType];
        return (
          <Tag color={type.color}>
            <i className={`fa ${type.icon}`} /> {type.text}
          </Tag>
        );
      },
    },

    {
      title: "Phương thức giao hàng",
      dataIndex: "deliveriesMethod",
      key: "deliveriesMethod",
      render: (deliveriesMethod) => {
        const method = deliveryStatusMap[deliveriesMethod];
        return (
          <Tag color={method.color}>
            <i className={`fa ${method.icon}`} /> {method.text}
          </Tag>
        );
      },
    },
    {
      title: "Tiền đặt cọc",
      dataIndex: "deposit",
      key: "deposit",
      render: (deposit) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(deposit),
    },
    {
      title: "Thanh toán",
      dataIndex: "isPayment",
      key: "isPayment",
      render: (isPayment) => (isPayment ? "Đã thanh toán" : "Chưa thanh toán"),
    },
    {
      title: "Chi tiết đơn hàng",
      dataIndex: "orderDetails",
      key: "orderDetails",
      render: (orderDetails) => (
        <Button type="link" onClick={() => handleViewDetails(orderDetails)}>
          Xem chi tiết
        </Button>
      ),
    },
    {
      title: "Tiền giữ chỗ",
      dataIndex: "reservationMoney",
      key: "reservationMoney",
      render: (reservationMoney) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(reservationMoney),
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) =>
        (record.orderType === 0 && record.reservationMoney > 0) ||
        record.orderStatus === 2 ? (
          <Space size="small">
            <Button
              type="primary"
              onClick={() =>
                handleRefund(
                  record.orderID,
                  record.orderStatus,
                  record.orderType
                )
              }
            >
              Thanh toán cho nhà cung cấp
            </Button>
            {record.orderStatus === 2 && ( // Only show confirm button for status 9
              <Button
                type="default"
                onClick={() => {
                  Modal.confirm({
                    title: "Xác nhận hoàn tiền",
                    content:
                      "Bạn có chắc chắn muốn xác nhận đã hoàn tiền thành công?",
                    okText: "Xác nhận",
                    cancelText: "Hủy",
                    onOk: () => handleConfirmRefund(record.orderID),
                  });
                }}
              >
                Xác nhận hoàn tiền
              </Button>
            )}
          </Space>
        ) : null,
    },
    {
      title: "Hình ảnh giao dịch",
      key: "upload",
      render: (text, record) => (
        <Space size="small">
          <Upload
            name="img"
            showUploadList={false}
            beforeUpload={(file) => {
              handleUpload(file, record.orderID);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />} size="small" loading={uploading}>
              Upload
            </Button>
          </Upload>
          <Button
            type="link"
            size="small"
            onClick={() => handleViewImage(record.orderID)}
          >
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="site-card-border-less-wrapper">
      <Card bordered={false} className="criclebox">
        <div className="mb-4">
          <Breadcrumb>
            <Breadcrumb.Item href="/">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/staff">Nhân viên</Breadcrumb.Item>
            <Breadcrumb.Item>Hoàn tiền nhà cung cấp</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="table-responsive">
          <Title level={2} className="mb-4">
            Danh sách đơn hàng cần hoàn tiền cho nhà cung cấp
          </Title>

          <Table
            columns={columns}
            dataSource={orders}
            rowKey="orderID"
            loading={loading}
            onChange={handleTableChange}
            scroll={{ x: 1500 }}
            className="ant-table-content"
            pagination={{
              current: pageIndex,
              pageSize: pageSize,
              total: total,
              pageSizeOptions: ["10", "30", "50", "100"],
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Tổng số ${total} mục`,
              className: "ant-pagination-custom",
            }}
          />
        </div>
      </Card>

      <style jsx>{`
        .site-card-border-less-wrapper {
          padding: 24px;
          background: #f0f2f5;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .order-details-list {
          max-height: 60vh;
          overflow-y: auto;
          padding: 0 10px;
        }
        .modal-title {
          font-size: 18px;
          font-weight: 600;
          color: #1890ff;
        }
        .custom-modal .ant-modal-content {
          border-radius: 8px;
        }
        .ant-pagination-custom {
          margin-top: 16px;
          text-align: right;
        }
      `}</style>
    </div>
  );
};

export default CreateStaffRefundSupplier;
