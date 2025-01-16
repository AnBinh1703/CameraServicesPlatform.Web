import { Tabs } from "antd";
import React, { useState } from "react";
import CreateStaffRefundMember from "./CreateStaffRefundMember";
import CreateStaffRefundSupplier from "./CreateStaffRefundSupplier";
import HistoryTransactionList from "./HistoryTransactionList";
import TransactionList from "./TransactionList";
const ManageTransactionSystem = () => {
  const [refreshList, setRefreshList] = useState(false);

  const tabItems = [
    {
      key: "1",
      label: "Danh Sách Giao Dịch Đơn Hàng Hệ Thống",
      children: <TransactionList refresh={refreshList} />,
    },
    {
      key: "2",

      label: "Danh Sách Giao Dịch NCC",
      children: <HistoryTransactionList refresh={refreshList} />,
    },
    {
      key: "3",
      label: "Tạo Giao Dịch Hoàn Trả Cho Khách Hàng",
      children: <CreateStaffRefundMember refresh={refreshList} />,
    },
    {
      key: "4",
      label: "Tạo Giao Dịch Hoàn Trả Cho Nhà cung cấp",
      children: <CreateStaffRefundSupplier refresh={refreshList} />,
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-6">
        Quản Lí Giao Dịch Sản Phẩm
      </h1>
      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
};

export default ManageTransactionSystem;
