import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
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
  11: {
    text: "Hoàn tiền đang chờ xử lý",
    color: "gold",
    icon: "fa-piggy-bank",
  },
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
        setSelectedOrderId(orderID);
        Modal.success({
          title: "Thông tin hoàn tiền",
          content: (
            <div>
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
              <Upload
                name="img"
                beforeUpload={(file) => {
                  handleUpload(file);
                  return false;
                }}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
            </div>
          ),
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

  const handleUpload = async (file) => {
    if (!selectedOrderId) {
      message.error("Order ID is not available.");
      return;
    }

    setUploading(true);
    try {
      const response = await addImagePayment(selectedOrderId, file);
      if (response.isSuccess) {
        message.success("Image uploaded successfully.");
        setImageUrls((prev) => ({
          ...prev,
          [selectedOrderId]: URL.createObjectURL(file),
        }));
      } else {
        message.error("Failed to upload image.");
      }
    } catch (error) {
      message.error("Error uploading image.");
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
      title: "Mã tài khoản",
      dataIndex: "accountID",
      key: "accountID",
      render: (accountID) => accountNames[accountID],
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (orderDate) => moment(orderDate).format("DD - MM - YYYY HH:mm"),
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
      render: (totalAmount) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(totalAmount),
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
      dataIndex: "orderID", // Changed from orderDetails to orderID
      key: "orderDetails",
      render: (
        orderID // Changed parameter to orderID
      ) => (
        <Button type="link" onClick={() => handleViewDetails(orderID)}>
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
        ((record.orderStatus === 7 && record.orderType === 0) ||
          (record.orderStatus === 7 && record.orderType === 1) ||
          record.orderStatus === 11 ||
          record.orderStatus === 9) && (
          <Button
            type="primary"
            onClick={() =>
              handleRefund(record.orderID, record.orderStatus, record.orderType)
            }
          >
            Hoàn tiền
          </Button>
        ),
    },
    {
      title: "Cập nhật trạng thái",
      key: "updateStatus",
      render: (text, record) =>
        (record.orderStatus === 9 && record.orderType === 0) ||
        record.orderStatus === 11 ? (
          <Button
            type="default"
            onClick={() => handleUpdateOrderStatus(record.orderID, 0)}
          >
            Cập nhật trạng thái hoàn tiền
          </Button>
        ) : record.orderStatus === 9 && record.orderType === 1 ? (
          <Button
            type="default"
            onClick={() => handleUpdateOrderStatus(record.orderID, 1)}
          >
            Cập nhật trạng thái hoàn tiền đặt cọc
          </Button>
        ) : null,
    },
    {
      title: "Hình ảnh giao dịch",
      key: "upload",
      render: (text, record) => (
        <div>
          <Upload
            name="img"
            beforeUpload={(file) => {
              setSelectedOrderId(record.orderID);
              handleUpload(file);
              return false;
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
          {imageUrls[record.orderID] && (
            <img
              src={imageUrls[record.orderID]}
              alt="Transaction"
              style={{ width: "100px", marginTop: "10px" }}
            />
          )}
          <Button type="link" onClick={() => handleViewImage(record.orderID)}>
            Xem
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 max-w-4xl">
      <Title level={2} className="text-center">
        Danh Sách Đơn Hàng
      </Title>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="orderID"
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          current: pageIndex,
          pageSize: pageSize,
          total: total,
          pageSizeOptions: ["10", "30", "50", "100"],
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng số ${total} mục`,
        }}
      />
      <Modal
        title="Chi tiết Đơn hàng"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedOrderDetails && (
          <ul>
            {selectedOrderDetails.map((detail) => (
              <li key={detail.orderDetailsID}>
                <p>Mã Sản phẩm: {detail.productID}</p>
                <p>Tên Sản phẩm: {detail.productName}</p>
                <p>Chất lượng: {detail.productQuality}</p>
                <p>
                  Giá Sản phẩm:
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(detail.productPrice)}
                </p>
                <p>
                  Tổng giá trị:
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(detail.productPriceTotal)}
                </p>
                <p>Giảm giá: {detail.discount}</p>
                <p>
                  Thời hạn thuê:
                  {moment(detail.periodRental).format("DD-MM-YYYY HH:mm")}
                </p>
                <p>
                  Ngày tạo:
                  {moment(detail.createdAt).format("DD-MM-YYYY HH:mm")}
                </p>
                <p>
                  Ngày cập nhật:
                  {moment(detail.updatedAt).format("DD-MM-YYYY HH:mm")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
};

export default CreateStaffRefundMember;
