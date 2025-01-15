import { Tabs } from "antd";
import React, { useState } from "react";
import CreateReportProductForm from "./CreateReportProductForm";
import CreateReportSystemForm from "./CreateReportSystemForm";
const ManageCreateReportForm = () => {
  const [refreshList, setRefreshList] = useState(false);

  const tabItems = [
    {
      key: "1",
      label: "BÁO CÁO SẢN PHẨM",
      children: <CreateReportProductForm refresh={refreshList} />,
    },
    {
      key: "2",
      label: "BÁO CÁO HỆ THỐNG",
      children: <CreateReportSystemForm refresh={refreshList} />,
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-6">
        Quản Lý Báo Cáo Sản Phẩm Của Bạn
      </h1>
      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
};

export default ManageCreateReportForm;
