import { Card, List, message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId, getUserById } from "../../../api/accountApi"; // Import the new API function
import { getProductById } from "../../../api/productApi"; // Import the new API function
import { getProductReportBySupplierId } from "../../../api/productReportApi";

const ReportListBySupplierId = () => {
  const statusTypeMap = {
    Suspended: "Tạm ngưng",
    Blocked: "Chặn",
    reject: "Từ chối"
  };

  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [productNames, setProductNames] = useState({}); // New state for product names
  const [userNames, setUserNames] = useState({}); // New state for user names

  const fetchSupplierId = async () => {
    if (user.id) {
      try {
        const response = await getSupplierIdByAccountId(user.id);
        console.log("Supplier ID Response:", response);
        if (response?.isSuccess) {
          setSupplierId(response.result);
        } else {
          message.error("Failed to get Supplier ID.");
        }
      } catch (error) {
        message.error("Error fetching Supplier ID.");
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
        message.error("Failed to get Product Report.");
      }
    } catch (error) {
      message.error("Error fetching Product Report.");
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
      message.error("Error fetching product name.");
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
      message.error("Error fetching user name.");
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

  return (
    <div className="p-4">
      {reportData.length > 0 ? (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={reportData}
          renderItem={(report) => (
            <List.Item>
              <Card
                title={`Tên sản phẩm: ${
                  productNames[report.productID] || "Đang tải..."
                }`}
                extra={`Tên tài khoản: ${
                  userNames[report.accountID] || "Đang tải..."
                }`}
              >
                <p>
                  <strong>Loại trạng thái:</strong>{" "}
                  {statusTypeMap[report.statusType] || report.statusType}
                </p>
                <p>
                  <strong>Ngày bắt đầu:</strong> {report.startDate}
                </p>
                <p>
                  <strong>Ngày kết thúc:</strong> {report.endDate}
                </p>
                <p>
                  <strong>Lý do:</strong> {report.reason}
                </p>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <p className="text-center text-gray-500">Không có báo cáo nào.</p>
      )}
    </div>
  );
};

export default ReportListBySupplierId;
