import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions } from "antd";
import React from "react";

const SupplierInfoCard = ({ supplierDetails, showModal }) => (
  <Card
    title={
      <span>
        <EditOutlined /> Thông Tin Nhà Cung Cấp
      </span>
    }
    className="flex-1 shadow-lg"
  >
    <Descriptions bordered column={1} size="small">
      <Descriptions.Item label="Tên Nhà Cung Cấp">
        {supplierDetails.supplierName}
      </Descriptions.Item>
      <Descriptions.Item label="Mô Tả Nhà Cung Cấp">
        {supplierDetails.supplierDescription}
      </Descriptions.Item>
      <Descriptions.Item label="Địa Chỉ Nhà Cung Cấp">
        {supplierDetails.supplierAddress}
      </Descriptions.Item>
      <Descriptions.Item label="Số Điện Thoại Liên Hệ">
        {supplierDetails.contactNumber}
      </Descriptions.Item>
    </Descriptions>
    <Button
      type="primary"
      icon={<EditOutlined />}
      onClick={showModal}
      className="mt-4"
    >
      Cập Nhật
    </Button>
  </Card>
);

export default SupplierInfoCard;
