import { Button, Card, Input, List, message, Modal, Tag } from "antd"; // Add Tag import
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId, getUserById } from "../../../api/accountApi"; // Import the new API function
import { getProductById } from "../../../api/productApi"; // Import the new API function
import {
  approveProductReport,
  getProductReportBySupplierId,
  rejectProductReport,
} from "../../../api/productReportApi";

const ReportListBySupplierId = () => {
  const statusTypeMap = {
    Pending: "Đang xử lí",
    Approved: "Đã xử lí",
    Reject: "Từ chối",
  };

  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [productNames, setProductNames] = useState({}); // New state for product names
  const [userNames, setUserNames] = useState({}); // New state for user names
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentReportId, setCurrentReportId] = useState(null);
  const [actionType, setActionType] = useState("");
  const [inputMessage, setInputMessage] = useState("");

  const fetchSupplierId = async () => {
    if (user.id) {
      try {
        const response = await getSupplierIdByAccountId(user.id);
        console.log("Supplier ID Response:", response);
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

  const fetchProductReport = async (supplierId) => {
    try {
      const response = await getProductReportBySupplierId(supplierId);
      console.log("Product Report Response:", response);
      if (response?.isSuccess) {
        setReportData(response.result);
      } else {
        message.error("Không thể lấy báo cáo sản phẩm.");
      }
    } catch (error) {
      message.error("Lỗi khi lấy báo cáo sản phẩm.");
    }
  };

  const fetchProductName = async (productId) => {
    try {
      const product = await getProductById(productId);
      setProductNames((prev) => ({
        ...prev,
        [productId]: product.productName,
      }));
    } catch (error) {
      message.error("Lỗi khi lấy tên sản phẩm.");
    }
  };

  const fetchUserName = async (accountId) => {
    try {
      const response = await getUserById(accountId);
      const user = response.result; // Correctly access the result property
      setUserNames((prev) => ({
        ...prev,
        [accountId]: `${user?.lastName} ${user?.firstName} `,
      }));
    } catch (error) {
      message.error("Lỗi khi lấy tên người dùng.");
    }
  };

  const showModal = (reportId, type) => {
    setCurrentReportId(reportId);
    setActionType(type);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (actionType === "approve") {
      await handleApprove(currentReportId, inputMessage);
    } else if (actionType === "reject") {
      await handleReject(currentReportId, inputMessage);
    }
    setIsModalVisible(false);
    setInputMessage("");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setInputMessage("");
  };

  const handleApprove = async (productReportID, message) => {
    const res = await approveProductReport(productReportID, message);
    if (res) {
      message.success("Báo cáo sản phẩm đã được phê duyệt thành công.");
      fetchProductReport(supplierId); // Refresh the report list
    } else {
      message.error("Không thể phê duyệt báo cáo sản phẩm.");
    }
  };

  const handleReject = async (productReportID, message) => {
    const res = await rejectProductReport(productReportID, message);
    if (res) {
      message.success("Báo cáo sản phẩm đã bị từ chối thành công.");
      fetchProductReport(supplierId); // Refresh the report list
    } else {
      message.error("Không thể từ chối báo cáo sản phẩm.");
    }
  };

  useEffect(() => {
    fetchSupplierId();
  }, [user.id]);

  useEffect(() => {
    if (supplierId) {
      fetchProductReport(supplierId);
    }
  }, [supplierId]);

  useEffect(() => {
    if (reportData.length > 0) {
      reportData.forEach((report) => {
        if (!productNames[report.productID]) {
          fetchProductName(report.productID);
        }
        if (!userNames[report.accountID]) {
          fetchUserName(report.accountID);
        }
      });
    }
  }, [reportData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'gold';
      case 'Approved': return 'green';
      case 'Reject': return 'red';
      default: return 'default';
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Danh sách báo cáo sản phẩm</h1>
      {reportData.length > 0 ? (
        <List
          grid={{ gutter: [16, 16], column: 1 }}
          dataSource={reportData}
          renderItem={(report) => (
            <List.Item>
              <Card
                className="shadow-md hover:shadow-lg transition-shadow"
                title={
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      {productNames[report.productID] || "Đang tải..."}
                    </span>
                    <Tag color={getStatusColor(report.statusType)}>
                      {statusTypeMap[report.statusType] || report.statusType}
                    </Tag>
                  </div>
                }
              >
                <div className="grid gap-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">ID: {report.productReportID}</span>
                    <span className="text-gray-500">
                      Người báo cáo: {userNames[report.accountID] || "Đang tải..."}
                    </span>
                  </div>
                  
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Ngày bắt đầu:</span>
                      <span>{report.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Ngày kết thúc:</span>
                      <span>{report.endDate}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="font-medium mb-2">Lý do:</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">
                      {report.reason}
                    </p>
                  </div>

                  {report.message && (
                    <div className="border-t pt-4">
                      <p className="font-medium mb-2">Phản hồi:</p>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded">
                        {report.message}
                      </p>
                    </div>
                  )}

                  {report.message === null && (
                    <div className="flex gap-4 justify-end mt-4">
                      <Button
                        type="primary"
                        className="px-6"
                        onClick={() => showModal(report.productReportID, "approve")}
                      >
                        Phê duyệt
                      </Button>
                      <Button
                        danger
                        className="px-6"
                        onClick={() => showModal(report.productReportID, "reject")}
                      >
                        Từ chối
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">Không có báo cáo nào.</p>
        </div>
      )}
      
      <Modal
        title="Nhập tin nhắn phản hồi"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Input.TextArea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Nhập tin nhắn phản hồi của bạn"
          rows={4}
        />
      </Modal>
    </div>
  );
};

export default ReportListBySupplierId;
