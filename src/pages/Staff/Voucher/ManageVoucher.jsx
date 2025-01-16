import { Tabs, message } from "antd";
import React, { useState } from "react";
import VoucherList from "../../Staff/Voucher/VoucherList";

const { TabPane } = Tabs;

const ManageVoucher = () => {
  const [refreshList, setRefreshList] = useState(false);

  const handleVoucherCreated = () => {
    message.success("Tạo voucher thành công!");
    setRefreshList(!refreshList);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-6">Quản Lý Voucher</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Danh Sách Voucher" key="1">
          <VoucherList refresh={refreshList} />
        </TabPane>

        {/* Tab for creating a new voucher
        <TabPane tab="Tạo Voucher" key="2">
          <CreateVoucherForm onVoucherCreated={handleVoucherCreated} />
        </TabPane> */}
      </Tabs>
    </div>
  );
};

export default ManageVoucher;
