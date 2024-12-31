import { Card, Descriptions, Form, Radio } from "antd";
import React, { useEffect } from "react";

const DeliveryMethod = ({
  setShippingAddress,
  deliveryMethod,
  setDeliveryMethod,
  supplierInfo,
}) => {
  useEffect(() => {
    setDeliveryMethod(0);
    // Debug supplier info
    console.log("Supplier Info:", supplierInfo);
  }, [supplierInfo]);

  const handleDeliveryMethodChange = (e) => {
    console.log("Selected delivery method:", e.target.value);
    setDeliveryMethod(e.target.value);
  };

  return (
    <Card title="Phương thức giao hàng" bordered={false}>
      <Form.Item
        label="Chọn phương thức giao hàng"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn phương thức giao hàng!",
          },
        ]}
      >
        <Radio.Group
          onChange={handleDeliveryMethodChange}
          value={deliveryMethod}
          defaultValue={0}
        >
          <Radio value={0}>Nhận tại cửa hàng</Radio>
        </Radio.Group>
      </Form.Item>

      {/* Modified supplier info display */}
      <div className="mt-4">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Tên nhà cung cấp">
            {supplierInfo?.supplierName || "Loading..."}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {supplierInfo?.contactNumber || "Loading..."}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ nhà cung cấp">
            {supplierInfo?.supplierAddress || "Loading..."}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Card>
  );
};

export default DeliveryMethod;
