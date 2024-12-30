import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { getNearExpiredCombosOfSupplier } from "../../../api/comboApi";

const NearExpiredCombosOfSupplier = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const columns = [
    {
      title: "Combo Of Supplier ID",
      dataIndex: "comboOfSupplierId",
      key: "comboOfSupplierId",
      width: 300,
    },
    {
      title: "Combo ID",
      dataIndex: "comboId",
      key: "comboId",
      width: 300,
    },
    {
      title: "Supplier ID",
      dataIndex: "supplierID",
      key: "supplierID",
      width: 300,
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      width: 200,
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      width: 200,
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Near Expiry Mail",
      dataIndex: "isMailNearExpired",
      key: "isMailNearExpired",
      width: 150,
      render: (value) => (
        <span className={value ? "text-green-500" : "text-red-500"}>
          {value ? "Sent" : "Not Sent"}
        </span>
      ),
    },
    {
      title: "Expiry Mail",
      dataIndex: "isSendMailExpired",
      key: "isSendMailExpired",
      width: 150,
      render: (value) => (
        <span className={value ? "text-green-500" : "text-red-500"}>
          {value ? "Sent" : "Not Sent"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isDisable",
      key: "isDisable",
      width: 120,
      render: (value) => (
        <span className={value ? "text-red-500" : "text-green-500"}>
          {value ? "Disabled" : "Active"}
        </span>
      ),
    },
  ];

  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    const response = await getNearExpiredCombosOfSupplier(page, pageSize);
    if (response.isSuccess) {
      setData(response.result.items);
      setPagination({
        ...pagination,
        total: response.result.totalPages * pageSize,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchData(newPagination.current, newPagination.pageSize);
  };

  return (
    <div className="p-6 bg-gray-50 text-medium text-gray-500 rounded-lg w-full">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Gói sắp hết hạn</h3>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="comboOfSupplierId"
      />
    </div>
  );
};

export default NearExpiredCombosOfSupplier;
