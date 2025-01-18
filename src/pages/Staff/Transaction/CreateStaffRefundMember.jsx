import {
  CheckCircleFilled,
  CloseCircleFilled,
  FileSearchOutlined,
  HomeOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Image,
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
import {
  getAllOrders,
  getOrderDetailsById,
  updateOrderStatusDepositRefund,
  updateOrderStatusRefund,
} from "../../../api/orderApi";
import { getSupplierById } from "../../../api/supplierApi";
import {
  addImagePayment,
  createStaffRefundDeposit,
  createStaffRefundReturnDetail,
  getTransactionImage,
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

const CreateStaffRefundMember = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
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

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Use the current pageSize instead of hardcoding 30
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
                  ] = `${accountData.result.lastName} ${accountData.result.firstName}`;
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
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders");
    }
    setLoading(false);
  };

  useEffect(() => {
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

      let response;
      if (
        (orderStatus === 7 && orderType === 1) ||
        (orderStatus === 7 && orderType === 0) ||
        orderStatus === 9 ||
        orderStatus === 11
      ) {
        response = await createStaffRefundReturnDetail(orderID, staffId);
      } else if (orderStatus === 9 && orderType === 1) {
        response = await createStaffRefundDeposit(orderID, staffId);
      }

      if (response && response.isSuccess) {
        setSelectedOrderId(response.result.orderId);
        Modal.success({
          title: "Thông tin hoàn tiền",
          width: 600,
          content: (
            <div className="refund-info">
              <div className="info-section">
                <div className="info-row">
                  <span className="label">Ngân hàng:</span>
                  <span className="value">{response.result.bankName}</span>
                </div>
                <div className="info-row">
                  <span className="label">Số tài khoản:</span>
                  <span className="value">{response.result.accountNumber}</span>
                </div>
                <div className="info-row">
                  <span className="label">Chủ tài khoản:</span>
                  <span className="value">{response.result.accountHolder}</span>
                </div>
                <div className="info-row">
                  <span className="label">Mã đơn hàng:</span>
                  <span className="value">{response.result.orderId}</span>
                </div>
                <div className="info-row">
                  <span className="label">Tổng số tiền:</span>
                  <span className="value">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(response.result.refundAmount)}
                  </span>
                </div>
              </div>

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
                  onPreview={(file) => {
                    Modal.info({
                      title: "Xem hình ảnh",
                      width: 800,
                      centered: true,
                      content: (
                        <Image
                          alt="preview"
                          style={{ width: "100%" }}
                          src={file.thumbUrl || file.url}
                        />
                      ),
                    });
                  }}
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
          style: { top: 20 },
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
      message.error("Order ID is not available for upload.");
      return;
    }

    setUploading(true);
    try {
      const response = await addImagePayment(orderId, file);
      if (response.isSuccess) {
        message.success("Image uploaded successfully for order: " + orderId);
        setImageUrls((prev) => ({
          ...prev,
          [orderId]: URL.createObjectURL(file),
        }));
        fetchOrders(); // Refresh the orders list
      } else {
        message.error(
          "Failed to upload image: " + (response.messages || "Unknown error")
        );
      }
    } catch (error) {
      message.error(
        "Error uploading image: " + (error.message || "Unknown error")
      );
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderID, orderType) => {
    try {
      let response;
      if (orderType === 0) {
        response = await updateOrderStatusRefund(orderID);
      } else if (orderType === 1) {
        response = await updateOrderStatusDepositRefund(orderID);
      }
      console.log("Update Order Status Response:", response); // Log the response
      if (response.isSuccess) {
        message.success("Order status updated successfully.");
        // Refresh the orders list
        fetchOrders();
      } else {
        message.error("Failed to update order status.");
      }
    } catch (error) {
      message.error("Error updating order status.");
      console.error("Error updating order status:", error);
    }
  };

  const handleConfirmRefund = async (orderId) => {
    try {
      const response = await updateOrderStatusDepositRefund(orderId); // Updated function call
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
      console.error("Error confirming refund:", error);
    }
  };

  const handleViewImage = async (orderID) => {
    try {
      const response = await getTransactionImage(orderID);
      if (response.isSuccess && response.result) {
        // Use the URL directly from the response
        const imageUrl = response.result;

        Modal.info({
          title: `Hình ảnh giao dịch - Mã đơn hàng: ${orderID}`,
          width: 800,
          centered: true,
          maskClosable: true,
          content: (
            <div
              style={{
                textAlign: "center",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              <img
                src={imageUrl}
                alt={`Transaction ${orderID}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                }}
                onError={(e) => {
                  message.error("Không thể tải hình ảnh");
                  e.target.style.display = "none";
                }}
              />
            </div>
          ),
          onOk() {},
        });
      } else {
        message.warning("Không có hình ảnh cho giao dịch này");
      }
    } catch (error) {
      console.error("Error fetching transaction image:", error);
      message.error("Lỗi khi tải hình ảnh giao dịch");
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const result = await getOrderDetailsById(orderId, 1, 100);
      if (result && result.isSuccess && result.result) {
        // Set the order details directly from result array
        setSelectedOrderDetails(result.result);
        setIsModalVisible(true);
      } else {
        message.error("Không thể lấy chi tiết đơn hàng");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("Lỗi khi lấy chi tiết đơn hàng");
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
          onPressEnter={() => {
            confirm();
            setSearchText(selectedKeys[0]);
            setSearchedColumn(dataIndex);
          }}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              confirm();
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
            icon={<SearchOutlined />}
            size="small"
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters();
              setSearchText("");
            }}
            size="small"
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

  const handleTableChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
    setPageIndex(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columns = [
    {
      title: "Mã NCC",
      dataIndex: "supplierID",
      key: "supplierID",
      width: 100,
      render: (supplierID) => supplierNames[supplierID],
      ...getColumnSearchProps("supplierID"),
      sorter: (a, b) => a.supplierID - b.supplierID,
      sortOrder: sortedInfo.columnKey === "supplierID" && sortedInfo.order,
    },
    {
      title: "Mã ĐH",
      dataIndex: "orderID",
      key: "orderID",
      width: 80,
      ...getColumnSearchProps("orderID"),
      sorter: (a, b) => a.orderID - b.orderID,
      sortOrder: sortedInfo.columnKey === "orderID" && sortedInfo.order,
      render: (orderID) => (
        <Space>
          {orderID}
          <Button
            type="link"
            size="small"
            icon={<FileSearchOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleViewImage(orderID);
            }}
          />
        </Space>
      ),
    },
    {
      title: "Mã TK",
      dataIndex: "accountID",
      key: "accountID",
      width: 100,
      render: (accountID) => accountNames[accountID],
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      width: 120,
      render: (orderDate) => moment(orderDate).format("DD/MM/YY HH:mm"),
      sorter: (a, b) => moment(b.orderDate).unix() - moment(a.orderDate).unix(), // Sort in descending order
      defaultSortOrder: "descend", // Default to showing latest first
      sortOrder: sortedInfo.columnKey === "orderDate" && sortedInfo.order,
      filters: [
        { text: "Hôm nay", value: "today" },
        { text: "7 ngày qua", value: "week" },
        { text: "30 ngày qua", value: "month" },
      ],
      onFilter: (value, record) => {
        const orderDate = moment(record.orderDate);
        const now = moment();
        switch (value) {
          case "today":
            return orderDate.isSame(now, "day");
          case "week":
            return orderDate.isAfter(now.subtract(7, "days"));
          case "month":
            return orderDate.isAfter(now.subtract(30, "days"));
          default:
            return true;
        }
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      width: 120,
      defaultFilteredValue: ["9", "11"], // Default to showing status 9 and 11
      filters: [
        { text: "Hoàn tiền đang chờ xử lý (9)", value: "9" },
        { text: "Hoàn tiền đang chờ xử lý (11)", value: "11" },
        ...Object.entries(orderStatusMap)
          .filter(([key]) => !["9", "11"].includes(key))
          .map(([key, value]) => ({
            text: value.text,
            value: key,
          })),
      ],
      onFilter: (value, record) =>
        record.orderStatus.toString() === value.toString(),
      render: (orderStatus) => {
        const status = orderStatusMap[orderStatus];
        return (
          <Tag color={status.color}>
            <i className={`fa ${status.icon}`} /> {status.text}
          </Tag>
        );
      },
      sorter: (a, b) => {
        // Prioritize status 9 and 11
        if ([9, 11].includes(a.orderStatus) && ![9, 11].includes(b.orderStatus))
          return -1;
        if (![9, 11].includes(a.orderStatus) && [9, 11].includes(b.orderStatus))
          return 1;
        return a.orderStatus - b.orderStatus;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 100,
      render: (totalAmount) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(totalAmount),
    },
    {
      title: "Loại ĐH",
      dataIndex: "orderType",
      key: "orderType",
      width: 90,
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
      title: "PT Giao hàng",
      dataIndex: "deliveriesMethod",
      key: "deliveriesMethod",
      width: 120,
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
      title: "Đặt cọc",
      dataIndex: "deposit",
      key: "deposit",
      width: 100,
      render: (deposit) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(deposit),
    },
    {
      title: "T.Toán",
      dataIndex: "isPayment",
      key: "isPayment",
      width: 80,
      render: (isPayment) => (
        <span style={{ color: isPayment ? "#52c41a" : "#ff4d4f" }}>
          {isPayment ? (
            <>
              <CheckCircleFilled /> Đã Thanh Toán
            </>
          ) : (
            <>
              <CloseCircleFilled /> Chưa Thanh Toán
            </>
          )}
        </span>
      ),
    },
    {
      title: "Chi tiết",
      dataIndex: "orderID",
      key: "orderDetails",
      width: 80,
      render: (orderID) => (
        <Button
          type="link"
          size="small"
          icon={<FileSearchOutlined />}
          onClick={() => handleViewDetails(orderID)}
        >
          Xem
        </Button>
      ),
    },
    {
      title: "Tiền giữ chỗ",
      dataIndex: "reservationMoney",
      key: "reservationMoney",
      width: 100,
      render: (reservationMoney) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(reservationMoney),
    },
    {
      title: "Hành động",
      key: "action",
      width: 200,
      render: (text, record) => (
        <Space size="small">
          {/* Existing refund button */}
          {((record.orderStatus === 9 && record.isPayment) ||
            (record.orderStatus === 11 && record.isPayment) ||
            (record.orderStatus === 7 &&
              record.isPayment &&
              record.orderType === 1)) && (
            <Button
              type="primary"
              size="small"
              onClick={() =>
                handleRefund(
                  record.orderID,
                  record.orderStatus,
                  record.orderType
                )
              }
            >
              Hoàn tiền
            </Button>
          )}

          {/* Add new confirm button for status 9 */}
          {/* {record.orderStatus === 9 && (
            <Button
              type="default"
              size="small"
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
            ></Button>
          )} */}
        </Space>
      ),
    },
    {
      title: "Cập nhật",
      key: "updateStatus",
      width: 120,
      render: (text, record) =>
        record.orderStatus === 9 && record.orderType === 0 ? (
          <Button
            type="default"
            size="small"
            onClick={() => handleUpdateOrderStatus(record.orderID, 0)}
          >
            Xử lí giao dịch
          </Button>
        ) : record.orderStatus === 11 ? (
          <Button
            type="default"
            size="small"
            onClick={() => handleUpdateOrderStatus(record.orderID, 1)}
          >
            Xử lí giao dịch
          </Button>
        ) : null,
    },
    {
      title: "Hình ảnh",
      key: "upload",
      width: 120,
      render: (text, record) => (
        <Space size="small">
          <Upload
            name="img"
            beforeUpload={(file) => {
              handleUpload(file, record.orderID);
              return false;
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} size="small">
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
      <Card bordered={false} className="criclebox h-full">
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item href="/">
                <HomeOutlined />
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/staff">Nhân viên</Breadcrumb.Item>
              <Breadcrumb.Item>Quản lý hoàn tiền</Breadcrumb.Item>
            </Breadcrumb>
            <Title level={2} className="font-medium text-2xl">
              Danh Sách Đơn Hàng Cần Hoàn Tiền
            </Title>
          </div>

          <div className="table-wrapper flex-1">
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="orderID"
              loading={loading}
              onChange={handleTableChange}
              scroll={{ x: "max-content", y: "calc(100vh - 280px)" }}
              className="refund-table"
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
        </div>
      </Card>

      <Modal
        title={<div className="modal-title">Chi tiết Đơn hàng</div>}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
        className="refund-modal"
        bodyStyle={{ maxHeight: "calc(100vh - 200px)", overflow: "auto" }}
      >
        {selectedOrderDetails && (
          <div className="order-details-list">
            {selectedOrderDetails.map((detail) => (
              <Card
                key={detail.orderDetailsID}
                className="mb-4"
                bordered={false}
                style={{ backgroundColor: "#f5f5f5" }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p>
                      <strong>Mã Sản phẩm:</strong> {detail.productID}
                    </p>
                    <p>
                      <strong>Tên Sản phẩm:</strong> {detail.productName}
                    </p>
                    <p>
                      <strong>Chất lượng:</strong> {detail.productQuality}
                    </p>
                    <p>
                      <strong>Giá Sản phẩm:</strong>{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.productPrice)}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Tổng giá trị:</strong>{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.productPriceTotal)}
                    </p>
                    <p>
                      <strong>Giảm giá:</strong> {detail.discount}
                    </p>
                    <p>
                      <strong>Thời hạn thuê:</strong>{" "}
                      {moment(detail.periodRental).format("DD-MM-YYYY HH:mm")}
                    </p>
                    <p>
                      <strong>Ngày tạo:</strong>{" "}
                      {moment(detail.createdAt).format("DD-MM-YYYY HH:mm")}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Modal>

      <style jsx>{`
        .site-card-border-less-wrapper {
          padding: 24px;
          background: #f0f2f5;
          min-height: 100vh;
        }
        :global(.refund-table) {
          background: white;
          border-radius: 8px;
        }
        :global(.ant-table-wrapper) {
          width: 100%;
          overflow: auto;
        }
        :global(.table-wrapper) {
          margin: -24px;
          padding: 24px;
          background: white;
          border-radius: 0 0 8px 8px;
        }
        :global(.criclebox) {
          box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.05);
        }
        :global(.refund-modal .ant-modal-content) {
          border-radius: 8px;
          overflow: hidden;
        }
        :global(.refund-modal .ant-modal-body) {
          padding: 24px;
        }
        :global(.ant-tag) {
          margin: 4px;
        }
        :global(.ant-btn) {
          border-radius: 6px;
        }
        .ant-table-thead > tr > th {
          padding: 8px 6px;
          font-size: 13px;
        }
        .ant-table-tbody > tr > td {
          padding: 6px;
          font-size: 13px;
        }
        .ant-btn-sm {
          font-size: 12px;
          padding: 0 8px;
        }
        .ant-tag {
          margin: 0;
          font-size: 12px;
        }
        .ant-space-item {
          margin-right: 4px !important;
        }
        :global(.ant-table-thead > tr > th) {
          background: #f6f8fa;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 12px;
          padding: 12px 8px;
        }

        :global(.ant-table) {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        :global(.ant-table-tbody > tr:hover > td) {
          background: #f5f5f5;
        }

        :global(.ant-btn-link) {
          padding: 0 4px;
        }

        :global(.ant-tag) {
          border-radius: 4px;
          padding: 2px 8px;
          font-weight: 500;
        }

        :global(.ant-breadcrumb) {
          margin-bottom: 24px;
        }

        :global(.ant-card) {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        :global(.table-wrapper) {
          background: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        :global(.ant-btn) {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        :global(.anticon) {
          font-size: 14px;
        }

        :global(.ant-table-column-title) {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        :global(.refund-info) {
          padding: 20px;
        }

        :global(.info-section) {
          margin-bottom: 24px;
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
        }

        :global(.info-row) {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          padding: 8px 0;
          border-bottom: 1px dashed #e8e8e8;
        }

        :global(.info-row:last-child) {
          border-bottom: none;
          margin-bottom: 0;
        }

        :global(.label) {
          font-weight: 500;
          color: #666;
        }

        :global(.value) {
          color: #1890ff;
          font-weight: 500;
        }

        :global(.upload-section) {
          text-align: center;
        }

        :global(.ant-upload-list-picture-card .ant-upload-list-item) {
          padding: 0;
        }

        :global(.ant-upload.ant-upload-select-picture-card) {
          width: 100%;
          margin-bottom: 0;
        }

        :global(.ant-modal-body) {
          padding: 0;
        }

        :global(.ant-upload-list-picture-card-container) {
          width: 100%;
          height: 200px;
        }
      `}</style>
    </div>
  );
};

export default CreateStaffRefundMember;
