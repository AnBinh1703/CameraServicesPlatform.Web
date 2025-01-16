import { Button, Modal, Spin, Table, Breadcrumb, Card, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  getAllTransactions,
  getTransactionById,
} from "../../../api/transactionApi";

const { Title } = Typography;

const TransactionType = {
  0: "Thanh toán",
  1: "Hoàn tiền",
};

const PaymentStatus = {
  0: "Đang chờ",
  1: "Hoàn thành",
  2: "Thất bại",
};

const PaymentMethod = {
  0: "VNPAY",
  1: "Thẻ tín dụng",
  2: "Chuyển khoản ngân hàng",
};

const VNPAYTransactionStatus = {
  0: "Thành công",
  1: "Thất bại",
  2: "Đang chờ",
};

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const data = await getAllTransactions(pageIndex, pageSize);
      if (data) {
        setTransactions(data.result);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [pageIndex, pageSize]);

  const handleNextPage = () => {
    setPageIndex((prevPageIndex) => prevPageIndex + 1);
  };

  const handlePreviousPage = () => {
    setPageIndex((prevPageIndex) => Math.max(prevPageIndex - 1, 1));
  };

  const handleRowDoubleClick = async (record) => {
    const data = await getTransactionById(record.transactionID);
    if (data) {
      setSelectedTransaction(data.result);
      setIsModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedTransaction(null);
  };

  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "transactionID",
      key: "transactionID",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Ngày giao dịch",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (transactionDate) =>
        moment(transactionDate).format("DD - MM - YYYY HH:mm"),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount),
    },
    {
      title: "Loại giao dịch",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (type) => TransactionType[type],
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => PaymentStatus[status],
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => PaymentMethod[method],
    },
  ];

  return (
    <div className="site-card-border-less-wrapper">
      <Card bordered={false} className="criclebox h-full">
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item href="/">
                <HomeOutlined />
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/staff">Nhân viên</Breadcrumb.Item>
              <Breadcrumb.Item>Danh sách giao dịch</Breadcrumb.Item>
            </Breadcrumb>
            <Title level={2} className="font-medium text-2xl">
              Danh sách giao dịch
            </Title>
          </div>

          <div className="table-wrapper flex-1">
            <Table
              columns={columns}
              dataSource={transactions}
              rowKey="transactionID"
              loading={loading}
              scroll={{ x: 'max-content', y: 'calc(100vh - 280px)' }}
              className="transactions-table"
              pagination={false}
              onRow={(record) => ({
                onDoubleClick: () => handleRowDoubleClick(record),
                className: "hover:bg-gray-50 cursor-pointer",
              })}
            />
          </div>
        </div>
      </Card>

      <style jsx>{`
        .site-card-border-less-wrapper {
          padding: 24px;
          background: #f0f2f5;
          min-height: 100vh;
        }
        :global(.transactions-table) {
          background: white;
          border-radius: 8px;
        }
        :global(.ant-table-wrapper) {
          width: 100%;
          overflow: auto;
        }
        :global(.table-wrapper) {
          margin: -24px;
          padding: 24px;
          background: white;
          border-radius: 0 0 8px 8px;
        }
        :global(.criclebox) {
          box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
};

export default TransactionList;
