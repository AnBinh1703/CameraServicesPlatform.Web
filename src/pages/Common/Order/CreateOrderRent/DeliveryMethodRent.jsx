
import React from "react";
import { Select } from "antd";

const { Option } = Select;

const DeliveryMethodRent = ({
  deliveryMethod,
  setDeliveryMethod,
  supplierInfo,
  form,
}) => {
  return (
    <div>
      <h3>Phương thức giao hàng</h3>
      <Select
        value={deliveryMethod}
        onChange={(value) => setDeliveryMethod(value)}
        style={{ width: "100%" }}
      >
        <Option value={0}>Giao hàng nhanh</Option>
        <Option value={1}>Nhận tại cửa hàng</Option>
      </Select>
      {deliveryMethod === 1 && supplierInfo && (
        <div>
          <p>Tên nhà cung cấp: {supplierInfo.name}</p>
          <p>Địa chỉ: {supplierInfo.address}</p>
          {/* Add more supplier info fields */}
        </div>
      )}
    </div>
  );
};

export default DeliveryMethodRent;
