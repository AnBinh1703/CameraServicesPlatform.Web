import { Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { getAllTransactions } from "../../api/transactionApi";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchTransactions = async (page, pageSize) => {
    setLoading(true);
    const data = await getAllTransactions(page, pageSize);
    if (data?.result) {
      setTransactions(data.result);
      setPagination({
        ...pagination,
        total: data.result.length,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "transactionID",
      key: "transactionID",
      width: "20%",
    },
    {
      title: "Order ID",
      dataIndex: "orderID",
      key: "orderID",
      width: "20%",
    },
    {
      title: "Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (date) => new Date(date).toLocaleString(),
      width: "15%",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount),
      width: "15%",
    },
    {
      title: "Type",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (type) => (
        <Tag color={type === 0 ? "green" : "blue"}>
          {type === 0 ? "Payment" : "Refund"}
        </Tag>
      ),
      width: "15%",
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => {
        const statusConfig = {
          1: { color: "success", text: "Completed" },
          2: { color: "error", text: "Failed" },
          0: { color: "warning", text: "Pending" },
        };
        return (
          <Tag color={statusConfig[status].color}>
            {statusConfig[status].text}
          </Tag>
        );
      },
      width: "15%",
    },
  ];

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>
      <Table
        columns={columns}
        dataSource={transactions}
        rowKey="transactionID"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default Transaction;
