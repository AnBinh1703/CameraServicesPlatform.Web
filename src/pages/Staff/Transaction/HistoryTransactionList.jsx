import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, Card, Table, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { getUserById } from "../../../api/accountApi";
import { getStaffById } from "../../../api/staffApi";
import { getAllHistoryTransactions } from "../../../api/transactionApi";

const { Title } = Typography;

const HistoryTransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10); // You can make this dynamic if needed
  const [loading, setLoading] = useState(false);
  const [accountNames, setAccountNames] = useState({});
  const [staffNames, setStaffNames] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const data = await getAllHistoryTransactions(pageIndex, pageSize);
      if (data) {
        setTransactions(data.result);
        setTotal(data.totalCount);
        // Fetch account names and staff names for each transaction
        const accountNamesMap = {};
        const staffNamesMap = {};
        await Promise.all(
          data.result.map(async (transaction) => {
            if (transaction.accountID) {
              const accountData = await getUserById(transaction.accountID);
              if (accountData && accountData.result) {
                accountNamesMap[
                  transaction.accountID
                ] = `${accountData.result.lastName} ${accountData.result.firstName}`;
              }
            }
            if (transaction.staffID) {
              const staffData = await getStaffById(transaction.staffID);
              if (staffData) {
                staffNamesMap[
                  transaction.staffID
                ] = `${staffData.result.account.firstName} ${staffData.result.account.lastName} `;
              }
            }
          })
        );
        setAccountNames(accountNamesMap);
        setStaffNames(staffNamesMap);
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

  const columns = [
    {
      title: "Mã giao dịch lịch sử",
      dataIndex: "historyTransactionId",
      key: "historyTransactionId",
    },
    {
      title: "Tên tài khoản",
      dataIndex: "accountID",
      key: "accountID",
      render: (accountID) => accountNames[accountID],
    },

    {
      title: "Số tiền",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price),
    },
    {
      title: "Mô tả giao dịch",
      dataIndex: "transactionDescription",
      key: "transactionDescription",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("DD - MM - YYYY HH:mm"),
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
              <Breadcrumb.Item>Lịch sử giao dịch</Breadcrumb.Item>
            </Breadcrumb>
            <Title level={2} className="font-medium text-2xl">
              Lịch sử giao dịch
            </Title>
          </div>

          <div className="table-wrapper flex-1">
            <Table
              columns={columns}
              dataSource={transactions}
              rowKey="transactionID"
              loading={loading}
              scroll={{ x: "max-content", y: "calc(100vh - 280px)" }}
              className="history-table"
              pagination={{
                current: pageIndex,
                pageSize: pageSize,
                total: total,
                pageSizeOptions: ["10", "30", "50", "100"],
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Tổng số ${total} mục`,
                className: "ant-pagination-custom",
              }}
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
        :global(.history-table) {
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

export default HistoryTransactionList;
