import { Table, message } from "antd";
import { useState } from "react";
import { userReportColumns } from "./columns";
import { getReportById } from "../../../api/reportApi";

const UserReportsTable = ({ 
  data = [], // Add default empty array
  loading, 
  pagination, 
  onChange, 
  getColumnSearchProps,
  onApprove,
  onReject
}) => {
  const [selectedReport, setSelectedReport] = useState(null);

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
    onReject
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
