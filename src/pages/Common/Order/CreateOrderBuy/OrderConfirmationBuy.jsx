import { Card, Descriptions, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import React from "react";

const { Title, Text } = Typography;

const OrderConfirmationBuy = ({ totalAmount, selectedVoucherDetails }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CheckCircleOutlined style={{ color: "#52c41a" }} />
          <Title level={4} style={{ margin: 0 }}>
            Xác nhận đơn hàng
          </Title>
        </div>
      }
      bordered={false}
      className="order-confirmation-card"
    >
      <Descriptions
        bordered
        column={1}
        labelStyle={{ width: "200px", backgroundColor: "#fafafa" }}
        contentStyle={{ backgroundColor: "#fff" }}
      >
        {selectedVoucherDetails && (
          <>
            <Descriptions.Item label="Mã Voucher">
              <Text code>{selectedVoucherDetails.vourcherCode}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Số tiền giảm">
              <Text type="success">
                {formatCurrency(selectedVoucherDetails.discountAmount)}
              </Text>
            </Descriptions.Item>
          </>
        )}
        <Descriptions.Item
          label={<Text strong>Tổng số tiền</Text>}
          className="total-amount"
        >
          <Text strong style={{ fontSize: "16px", color: "#76c6a8" }}>
            {formatCurrency(totalAmount)}
          </Text>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default OrderConfirmationBuy;
