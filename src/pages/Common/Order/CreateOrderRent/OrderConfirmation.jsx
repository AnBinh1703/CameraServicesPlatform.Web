import {
  CheckCircleOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Card, Descriptions, Typography } from "antd";
import styled from "styled-components";

const { Title, Text } = Typography;

const StyledCard = styled(Card)`
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  transition: all 0.3s ease;
  margin: 20px 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12);
  }

  .ant-card-head {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-bottom: 1px solid #edf2f7;
    border-radius: 12px 12px 0 0;
    padding: 16px 24px;
  }

  .ant-descriptions-item-label {
    transition: all 0.3s ease;
    border-radius: 6px;
    &:hover {
      background-color: #e6f7ff !important;
      transform: translateX(4px);
    }
  }

  .total-amount {
    .ant-descriptions-item-label,
    .ant-descriptions-item-content {
      background: linear-gradient(45deg, #f6ffed 0%, #e6fffb 100%) !important;
      font-weight: bold;
      border-radius: 6px;
    }
  }

  .ant-descriptions-bordered .ant-descriptions-item-label {
    background: #fafafa;
  }

  .ant-descriptions-bordered .ant-descriptions-item-content {
    background: white;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .anticon {
    transition: all 0.3s ease;
    &:hover {
      transform: scale(1.2);
      filter: brightness(1.2);
    }
  }
`;

const PriceText = styled(Text)`
  font-size: 16px;
  margin-left: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const StyledTooltipIcon = styled(ExclamationCircleOutlined)`
  color: #1890ff;
  cursor: pointer;
  margin-right: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: rotate(15deg);
    color: #40a9ff;
  }
`;

const OrderConfirmation = ({
  totalAmount,
  depositProduct,
  productPriceRent,
  selectedVoucherDetails,
  reservationMoney,
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <StyledCard
      title={
        <IconWrapper>
          <CheckCircleOutlined style={{ color: "#52c41a", fontSize: "24px" }} />
          <Title
            level={4}
            style={{ margin: 0, color: "#262626", fontWeight: 600 }}
          >
            Xác nhận đơn hàng thuê
          </Title>
        </IconWrapper>
      }
      bordered={false}
      className="order-confirmation-card"
    >
      <Descriptions
        bordered
        column={1}
        labelStyle={{
          width: "240px",
          padding: "18px 24px",
          fontWeight: 500,
        }}
        contentStyle={{
          padding: "18px 24px",
        }}
      >
        <Descriptions.Item
          label={
            <IconWrapper>
              <DollarOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
              <span>Giá thuê sản phẩm</span>
            </IconWrapper>
          }
        >
          <StyledTooltipIcon title="Giá thuê sản phẩm - Tiền này bạn sẽ thanh toán cho Nhà cung cấp" />
          <PriceText strong>{formatCurrency(productPriceRent)}</PriceText>
        </Descriptions.Item>
        {selectedVoucherDetails && (
          <>
            <Descriptions.Item
              label={
                <IconWrapper>
                  <span>Mã Voucher</span>
                  <StyledTooltipIcon title="Mã giảm giá được áp dụng cho đơn hàng" />
                </IconWrapper>
              }
            >
              <Text code>{selectedVoucherDetails.vourcherCode}</Text>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <IconWrapper>
                  <span>Số tiền giảm</span>
                </IconWrapper>
              }
            >
              <StyledTooltipIcon title="Số tiền được giảm từ voucher" />
              <PriceText type="success">
                {formatCurrency(selectedVoucherDetails.discountAmount)}
              </PriceText>
            </Descriptions.Item>
          </>
        )}
        <Descriptions.Item
          label={
            <IconWrapper>
              <Text strong style={{ fontSize: "18px", color: "#262626" }}>
                Tiền cọc sản phẩm
              </Text>
            </IconWrapper>
          }
          className="total-amount"
        >
          <StyledTooltipIcon title="Số tiền đặt cọc để đảm bảo sản phẩm với nhà cung cấp - Tiền này bạn sẽ cọc cho Nhà cung cấp và được Nhà cung cấp hoàn trả lại sau khi trả lại sản phẩm, họăc dùng để đền bù SSản phẩm bạn thuê nếu có hư hại (Điều kiện: Nếu số tiền cần đền bù nhỏ hơn số tiền đặt cọc .) " />
          <PriceText strong type="warning">
            {formatCurrency(depositProduct)}
          </PriceText>
        </Descriptions.Item>{" "}
        <Descriptions.Item
          label={
            <IconWrapper>
              <DollarOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
              <span>Tổng số tiền thanh toán trực tiếp với NCC </span>
            </IconWrapper>
          }
        >
          <StyledTooltipIcon title="Tổng số tiền cần thanh toán trực tiếp với nhà cung cấp - Bao gồm tiền cọc + tiền thuê sản phẩm. Tiền cọc sản phẩm sẽ được hoàn trả sau khi nhà cung cấp kiểm tra sản phẩm và xác nhận trả hàng." />
          <PriceText strong style={{ fontSize: "20px", color: "#52c41a" }}>
            {formatCurrency(totalAmount)}
          </PriceText>
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <IconWrapper>
              <DollarOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
              <span>Tiền giữ sản phẩm</span>
            </IconWrapper>
          }
        >
          <StyledTooltipIcon title="Số tiền cần đặt trước để giữ sản phẩm cho bạn -  Tiền này sẽ được hệ thống giữ lại, sau khi đơn hàng hoàn thành, hoặc đơn hàng được hủy trong vòng 24h kể từ khi bạn thanh toán thành công sẽ được Hoàn vào tài khoản cuả bạn. " />
          <PriceText strong>{formatCurrency(reservationMoney)}</PriceText>
        </Descriptions.Item>
      </Descriptions>
    </StyledCard>
  );
};

export default OrderConfirmation;
