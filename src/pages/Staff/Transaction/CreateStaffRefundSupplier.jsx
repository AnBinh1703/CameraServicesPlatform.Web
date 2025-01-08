import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Modal, Table, Tag, Typography, Upload } from "antd";
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
  const handleTableChange = (pagination, filters, sorter) => {
    setPageIndex(pagination.current);
    setPageSize(pagination.pageSize);
  };
  const columns = [
    {
      title: "Mã nhà cung cấp",
      dataIndex: "supplierID",
      key: "supplierID",
      render: (supplierID) => supplierNames[supplierID],
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
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
          <Button
            type="primary"
            onClick={() =>
              handleRefund(record.orderID, record.orderStatus, record.orderType)
            }
          >
            Thanh toán cho nhà cung cấp
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
    <div className="p-4 max-w-4xl ">
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
          pageSizeOptions: ['10', '30', '50', '100'],
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng số ${total} mục`,
        }}
      />
      <Modal
        title="Chi tiết đơn hàng"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedOrderDetails && (
          <ul>
            {selectedOrderDetails.map((detail) => (
              <li key={detail.orderDetailsID}>
                <p>Product ID: {detail.productID}</p>
                <p>Product Name: {detail.productName}</p>
                <p>Product Quality: {detail.productQuality}</p>
                <p>
                  Product Price:
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(detail.productPrice)}
                </p>
                <p>
                  Product Price Total:
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(detail.productPriceTotal)}
                </p>
                <p>Discount: {detail.discount}</p>
                <p>
                  Period Rental:
                  {moment(detail.periodRental).format("DD-MM-YYYY HH:mm")}
                </p>
                <p>
                  Created At:
                  {moment(detail.createdAt).format("DD-MM-YYYY HH:mm")}
                </p>
                <p>
                  Updated At:
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

export default CreateStaffRefundSupplier;
