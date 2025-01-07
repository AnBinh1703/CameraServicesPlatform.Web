import { Table, message } from "antd";
import { useEffect, useState } from "react";
import { getUserById } from "../../../api/accountApi";
import { getReportById } from "../../../api/reportApi";
import { userReportColumns } from "./columns";
const UserReportsTable = ({
  data = [],
  loading,
  pagination,
  onChange,
  getColumnSearchProps,
  onApprove,
  onReject,
}) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userMap = {};
      for (const report of data) {
        if (report.accountId && !userDetails[report.accountId]) {
          const userResponse = await getUserById(report.accountId);
          if (userResponse?.result) {
            userMap[report.accountId] = userResponse.result;
          }
        }
      }
      setUserDetails((prev) => ({ ...prev, ...userMap }));
    };

    fetchUserDetails();
  }, [data]);

  const handleViewDetails = async (record) => {
    if (!record?.reportID) {
      message.error("Invalid report data");
      return;
    }

    try {
      const response = await getReportById(record.reportID);
      if (response?.isSuccess && response?.result) {
        setSelectedReport(response.result);
        // Handle showing details - you might want to pass this up to parent
      } else {
        message.error("Không thể tải thông tin báo cáo");
      }
    } catch (error) {
      console.error("Error in handleViewDetails:", error);
      message.error("Có lỗi xảy ra khi xem chi tiết");
    }
  };

  const validData = Array.isArray(data) ? data : [];

  const columns = userReportColumns(
    getColumnSearchProps,
    handleViewDetails,
    onApprove,
    onReject,
    userDetails // Pass userDetails to columns
  );

  return (
    <Table
      columns={columns}
      dataSource={validData}
      rowKey="reportID"
      pagination={pagination}
      onChange={onChange}
      loading={loading}
    />
  );
};

export default UserReportsTable;
