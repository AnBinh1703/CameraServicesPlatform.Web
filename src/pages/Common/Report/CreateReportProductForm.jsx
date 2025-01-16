import { Button, Form, Input, Modal, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getOrderOfAccount } from "../../../api/orderApi";
import { getProductById } from "../../../api/productApi";
import {
  createProductReport,
  getProductReportByAccountId,
} from "../../../api/productReportApi";
import { getSupplierById } from "../../../api/supplierApi";
import { formatDateTime, formatPrice } from "../../../utils/util";

// Update the status maps translations
const orderStatusMap = {
  0: { text: "Chờ xử lý", color: "blue", icon: "fa-hourglass-start" },
  1: { label: "Đang xử lý", color: "blue" },
  2: { label: "Hoàn thành", color: "green" },
  3: { label: "Đã hủy", color: "red" },
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

// Update StatusBadge component
const StatusBadge = ({ status, map }) => {
  const statusInfo = map[status] || {
    text: "Unknown",
    color: "gray",
    icon: "fa-question",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-sm font-semibold text-white bg-${statusInfo.color}-500 flex items-center gap-1`}
    >
      <i className={`fas ${statusInfo.icon}`}></i>
      {statusInfo.text}
    </span>
  );
};

const CreateReportProductForm = () => {
  const user = useSelector((state) => state.user.user || {});
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [data, setData] = useState([]);
  const [supplierMap, setSupplierMap] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productReports, setProductReports] = useState([]);
  const [form] = Form.useForm();
  const [productDetails, setProductDetails] = useState({});
  const [supplierDetails, setSupplierDetails] = useState({});
  const [reportProductDetails, setReportProductDetails] = useState({});

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching orders for user ID:", user.id);
      const response = await getOrderOfAccount(user.id, 1, 100);
      console.log("Orders API response:", response);

      if (response?.isSuccess && response.result?.length > 0) {
        console.log("Setting orders:", response.result);
        setOrders(response.result);
      } else {
        console.warn("No orders found or fetch failed:", response?.messages);
        message.warning("No orders available.");
      }
    } catch (error) {
      console.error("Error in fetchOrders:", error);
      message.error("Failed to fetch orders.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReportProductDetails = async (productId) => {
    try {
      const response = await getProductById(productId);
      if (response && response.productName) {
        setReportProductDetails(prev => ({
          ...prev,
          [productId]: response
        }));
      }
    } catch (error) {
      console.error(`Error fetching product details for ID ${productId}:`, error);
    }
  };

  const fetchProductReports = async () => {
    try {
      setIsLoading(true);
      const response = await getProductReportByAccountId(user.id, 1, 100);
      if (response?.isSuccess) {
        setProductReports(response.result || []);
        // Fetch product details for each report
        response.result?.forEach(report => {
          if (report.productID) {
            fetchReportProductDetails(report.productID);
          }
        });
      } else {
        message.error("Failed to fetch product reports");
      }
    } catch (error) {
      console.error("Error fetching product reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (order = null) => {
    if (!orders.length) {
      message.error("No orders available");
      return;
    }

    const orderToUse = order || orders[0];
    setSelectedOrder(orderToUse);
    setIsModalVisible(true);

    form.setFieldsValue({
      orderID: orderToUse.orderID,
      statusType: 0,
      reason: "",
    });
  };

  const handleClick = (order) => {
    if (order) {
      handleOpenModal(order);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (!selectedOrder) {
        console.error("No order selected");
        message.error("Please select an order first");
        return;
      }

      // Get the orderDetail with productID
      const orderDetail = selectedOrder.orderDetails?.[0];
      if (!orderDetail?.productID) {
        console.error("No product ID found in order");
        message.error("Invalid order details");
        return;
      }

      const currentDate = new Date();
      const reportData = {
        supplierID: selectedOrder.supplierID,
        productID: orderDetail.productID, // Use the correct productID from orderDetail
        statusType: 0, // Default status type
        startDate: currentDate.toISOString(),
        endDate: currentDate.toISOString(),
        reason: values.reason,
        accountID: user.id
      };

      console.log("Submitting report data:", reportData);
      const response = await createProductReport(reportData);
      console.log("Create report response:", response);

      if (response?.isSuccess) {
        message.success("Report created successfully");
        setIsModalVisible(false);
        form.resetFields();
        // Optionally refresh the reports list
        fetchProductReports();
      } else {
        message.error(response?.messages?.[0] || "Failed to create report");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      message.error("An error occurred while creating the report");
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      console.log('Fetching product details for ID:', productId);
      const response = await getProductById(productId);
      console.log('Raw product API response:', response);
      
      if (response && response.productName) { // Verify the response structure
        console.log('Valid product details received:', response);
        setProductDetails((prev) => {
          const newState = {
            ...prev,
            [productId]: response,
          };
          console.log('Updated product details state:', newState);
          return newState;
        });
      } else {
        console.warn('Invalid product details response:', response);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const fetchSupplierDetails = async (supplierId) => {
    try {
      console.log('Fetching supplier details for ID:', supplierId);
      const response = await getSupplierById(supplierId);
      if (response?.isSuccess) {
        // Extract the first item from the items array
        const supplierData = response.result?.items?.[0];
        console.log('Supplier data extracted:', supplierData);
        
        if (supplierData) {
          setSupplierDetails((prev) => ({
            ...prev,
            [supplierId]: supplierData
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching supplier details:", error);
    }
  };

  const handleOrderSelect = (orderId) => {
    const selected = orders.find((order) => order.orderID === orderId);
    if (selected) {
      console.log('Selected order:', selected);
      setSelectedOrder(selected);
      
      // Fetch details for the selected order
      const orderDetail = selected.orderDetails?.[0];
      console.log('Order detail:', orderDetail);
      
      if (orderDetail?.productID) {
        console.log('Fetching product for ID:', orderDetail.productID);
        fetchProductDetails(orderDetail.productID);
      } else {
        console.warn('No product ID found in order detail');
      }
      
      if (selected.supplierID) {
        console.log('Fetching supplier for ID:', selected.supplierID);
        fetchSupplierDetails(selected.supplierID);
      }

      form.setFieldsValue({
        orderID: orderId,
        statusType: 0,
        reason: "",
      });
    }
  };

  // Update status text in renderReportItems
  const renderReportItems = (report) => (
    <tr
      key={report.productReportID}
      className="cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <td className="py-4 px-6 border-b text-center w-24">{report.productReportID}</td>
      <td className="py-4 px-6 border-b text-center w-48">
        {reportProductDetails[report.productID]?.productName || report.productID}
      </td>
      <td className="py-4 px-6 border-b text-center w-32">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white 
          ${
            report.statusType === "Đã duyệt"
              ? "bg-green-500"
              : report.statusType === "Từ chối"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        >
          {report.statusType === "Approved" ? "Đã duyệt" 
            : report.statusType === "Reject" ? "Từ chối" 
            : "Chờ xử lý"}
        </span>
      </td>
      <td className="py-4 px-6 border-b w-64 truncate">{report.reason}</td>
      <td className="py-4 px-6 border-b w-48 truncate">{report.message || "-"}</td>
      <td className="py-4 px-6 border-b text-center w-40">{formatDateTime(report.createdAt)}</td>
      <td className="py-4 px-6 border-b text-center w-40">{formatDateTime(report.updatedAt)}</td>
    </tr>
  );

  useEffect(() => {
    if (orders.length > 0) {
      // Fetch supplier details for each unique supplier
      const uniqueSupplierIds = [
        ...new Set(orders.map((order) => order.supplierID)),
      ];
      uniqueSupplierIds.forEach(fetchSupplierDetails);
    }
  }, [orders]);

  useEffect(() => {
    // console.log("Component mounted/updated, user:", user);
    if (user?.id) {
      console.log("Fetching orders for user ID:", user.id);
      fetchOrders();
      fetchProductReports();
    }
  }, [user?.id]);

  const renderProductReports = () => (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Your Product Reports</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Report ID</th>
            <th>Product ID</th>
            <th>Status</th>
            <th>Reason</th>
            <th>Message</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>{productReports.map(renderReportItems)}</tbody>
      </table>
    </div>
  );

  const renderOrderDetails = (order) => {
    if (!order) return null;
    // Get the first order detail if it exists, otherwise use an empty object
    const orderDetail = order.orderDetails?.[0] || {};
    const productInfo = productDetails[orderDetail.productID];
    const supplierInfo = supplierDetails[order.supplierID];

    console.log('Order detail in render:', orderDetail);
    console.log('All product details:', productDetails);
    console.log('Product info for ID:', orderDetail.productID, productInfo);
    console.log('Supplier info for rendering:', supplierInfo);

    return (
      <div className="mb-4 p-4 border rounded-lg bg-gray-50">
        <h3 className="font-semibold mb-2">Chi tiết đơn hàng</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Ngày đặt hàng:</strong> {formatDateTime(order.orderDate)}
            </p>
            <p>
              <strong>Loại đơn hàng:</strong>{" "}
              {order.orderType === 0 ? "Mua" : "Thuê"}
            </p>
            <p>
              <strong>Tổng tiền:</strong> {formatPrice(order.totalAmount)}
            </p>
            <p>
              <strong>Phương thức giao hàng:</strong>{" "}
              {order.deliveriesMethod === 0 ? "Nhận tại cửa hàng" : "Giao hàng tận nơi"}
              <p>
                {order.deliveriesMethod === 1 ? order.shippingAddress : " "}
              </p>
            </p>
          </div>
          <div>
            <p>
              <strong>Sản phẩm:</strong>{" "}
              {productInfo ? productInfo.productName : orderDetail.productID}
            </p>
            <p>
              <strong>Nhà cung cấp:</strong>{" "}
              {supplierInfo ? supplierInfo.supplierName : order.supplierID}
            </p>
            <p>
              <strong>Giá sản phẩm:</strong>{" "}
              {formatPrice(orderDetail.productPrice)}
            </p>
            <p>
              <strong>Chất lượng:</strong> {orderDetail.productQuality}
            </p>
            <p>
              <strong>Giảm giá:</strong> {formatPrice(orderDetail.discount)}
            </p>
            {order.orderType === 1 && (
              <>
                <p>
                  <strong>Thời gian thuê:</strong>{" "}
                  {formatDateTime(order.rentalStartDate)} -{" "}
                  {formatDateTime(order.rentalEndDate)}
                </p>
                <p>
                  <strong>Đặt cọc:</strong> {formatPrice(order.deposit)}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <Button
          type="primary"
          onClick={() => handleOpenModal()}
          className="bg-blue-500 px-6 py-2"
        >
          Tạo báo cáo mới
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <p>Đang tải...</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 border-b text-center w-24">Mã báo cáo</th>
                <th className="py-4 px-6 border-b text-center w-48">Tên sản phẩm</th>
                <th className="py-4 px-6 border-b text-center w-32">Trạng thái</th>
                <th className="py-4 px-6 border-b text-center w-64">Lý do</th>
                <th className="py-4 px-6 border-b text-center w-48">Phản hồi</th>
                <th className="py-4 px-6 border-b text-center w-40">Ngày tạo</th>
                <th className="py-4 px-6 border-b text-center w-40">Ngày cập nhật</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productReports.map(renderReportItems)}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        title="Tạo báo cáo sản phẩm"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="orderID"
            label="Chọn đơn hàng"
            rules={[{ required: true, message: "Vui lòng chọn đơn hàng" }]}
          >
            <Select onChange={handleOrderSelect}>
              {orders.map((order) => (
                <Select.Option key={order.orderID} value={order.orderID}>
                  #{order.orderID} - {formatDateTime(order.orderDate)} -{" "}
                  {formatPrice(order.totalAmount)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {selectedOrder && renderOrderDetails(selectedOrder)}

          <Form.Item
            name="reason"
            label="Lý do báo cáo"
            rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Vui lòng mô tả vấn đề với đơn hàng của bạn..."
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" className="bg-blue-500">
                Gửi báo cáo
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {isLoading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b">Mã báo cáo</th>
              <th className="py-3 px-4 border-b">Mã sản phẩm</th>
              <th className="py-3 px-4 border-b">Trạng thái</th>
              <th className="py-3 px-4 border-b">Lý do</th>
              <th className="py-3 px-4 border-b">Tin nhắn</th>
              <th className="py-3 px-4 border-b">Ngày tạo</th>
              <th className="py-3 px-4 border-b">Ngày cập nhật</th>
            </tr>
          </thead>
          <tbody>{productReports.map(renderReportItems)}</tbody>
        </table>
      )}

      {/* ...rest of the code (Modal and other components) ... */}
    </div>
  );
};

export default CreateReportProductForm;
