import { Table } from "antd";
import { productReportColumns } from "./columns";

const ProductReportsTable = ({ 
  data, 
  loading, 
  pagination, 
  onChange,
  productDetails,
  getColumnSearchProps,
  handleViewDetails,
  handleApprove,
  handleReject
}) => {
  const columns = productReportColumns(
    getColumnSearchProps, 
    productDetails, 
    handleViewDetails,
    handleApprove,
    handleReject
  );
  
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="productReportID" // Updated to match the correct key
      pagination={pagination}
      onChange={onChange}
      loading={loading}
    />
  );
};

export default ProductReportsTable;
