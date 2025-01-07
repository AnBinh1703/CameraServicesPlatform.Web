import { Table } from "antd";
import { userReportColumns } from "./columns";

const UserReportsTable = ({ 
  data, 
  loading, 
  pagination, 
  onChange, 
  getColumnSearchProps,
  handleViewDetails 
}) => {
  const columns = userReportColumns(getColumnSearchProps, handleViewDetails);
  
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={pagination}
      onChange={onChange}
      loading={loading}
    />
  );
};

export default UserReportsTable;
