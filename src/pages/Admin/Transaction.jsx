import { Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { getAllTransactions } from "../../api/transactionApi";

const TransactionType = {
  Payment: 0,
  Refund: 1,
};

const TransactionTypeText = {
  [TransactionType.Payment]: "Thanh Toán",
  [TransactionType.Refund]: "Hoàn Tiền",
};

const PaymentStatus = {
  Pending: 0,
  Completed: 1,
  Failed: 2,
};

const PaymentStatusConfig = {
  [PaymentStatus.Completed]: { color: "success", text: "Hoàn Thành" },
  [PaymentStatus.Failed]: { color: "error", text: "Thất Bại" },
  [PaymentStatus.Pending]: { color: "warning", text: "Đang Xử Lý" },
};

const PaymentMethod = {
  VNPAY: 0,
  CreditCard: 1,
  BankTransfer: 2,
};

const PaymentMethodText = {
  [PaymentMethod.VNPAY]: "VNPAY",
  [PaymentMethod.CreditCard]: "Thẻ Tín Dụng",
  [PaymentMethod.BankTransfer]: "Chuyển Khoản",
};

const VNPAYTransactionStatus = {
  Success: 0,
  Failed: 1,
  Pending: 2,
};

const VNPAYTransactionStatusText = {
  [VNPAYTransactionStatus.Success]: "Thành Công",
  [VNPAYTransactionStatus.Failed]: "Thất Bại",
  [VNPAYTransactionStatus.Pending]: "Đang Xử Lý",
};

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
      title: "Mã Giao Dịch",
      dataIndex: "transactionID",
      key: "transactionID",
      width: "20%",
    },
    {
      title: "Mã Đơn Hàng",
      dataIndex: "orderID",
      key: "orderID",
      width: "20%",
    },
    {
      title: "Ngày Giao Dịch",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (date) => new Date(date).toLocaleString('vi-VN'),
      width: "15%",
    },
    {
      title: "Số Tiền",
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
      title: "Loại Giao Dịch",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (type) => (
        <Tag color={type === TransactionType.Payment ? "green" : "blue"}>
          {TransactionTypeText[type]}
        </Tag>
      ),
      width: "15%",
    },
    {
      title: "Trạng Thái",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag color={PaymentStatusConfig[status].color}>
          {PaymentStatusConfig[status].text}
        </Tag>
      ),
      width: "15%",
    },
    {
      title: "Phương Thức",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => PaymentMethodText[method],
      width: "15%",
    },
    {
      title: "Trạng Thái VNPAY",
      dataIndex: "vnpayTransactionStatus",
      key: "vnpayTransactionStatus",
      render: (status) => VNPAYTransactionStatusText[status],
      width: "15%",
    },
  ];

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản Lý Giao Dịch</h1>
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
