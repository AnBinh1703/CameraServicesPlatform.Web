import {
  DollarOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Card, Col, Descriptions, Row } from "antd";
import React from "react";

const OrderReviewBuy = ({
  product,
  form,
  deliveryMethod,
  supplierInfo,
  selectedVoucherDetails,
  totalAmount,
}) => {
  const formattedTotalAmount = isNaN(totalAmount) ? 0 : totalAmount;

  return (
    <Card className="order-review-container" bordered={false}>
      <h2 style={{ marginBottom: 24, color: '#1890ff' }}>Xem lại đơn hàng</h2>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card
            title={<span style={{ color: '#1890ff' }}><InfoCircleOutlined /> Thông tin sản phẩm</span>}
            bordered={false}
            className="inner-card"
          >
            <Row gutter={24}>
              <Col span={12}>
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item
                    label={
                      <span>
                        <TagOutlined /> Mã sản phẩm
                      </span>
                    }
                  >
                    {product.serialNumber}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span>
                        <InfoCircleOutlined /> Tên
                      </span>
                    }
                  >
                    {product.productName}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span>
                        <FileTextOutlined /> Mô tả
                      </span>
                    }
                  >
                    {product.productDescription}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span>
                        <DollarOutlined /> Giá
                      </span>
                    }
                  >
                    <div style={{ color: "#52c41a" }}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product?.priceBuy)}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span>
                        <InfoCircleOutlined /> Chất lượng
                      </span>
                    }
                  >
                    {product.quality}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Card
                  title={<span style={{ color: '#1890ff' }}><InfoCircleOutlined /> Thông tin giao hàng</span>}
                  bordered={false}
                  className="inner-card"
                >
                  <Descriptions bordered column={1}>
                    <Descriptions.Item label="Phương thức giao hàng">
                      {deliveryMethod === 0
                        ? "Nhận tại cửa hàng"
                        : "Giao hàng tận nơi"}
                    </Descriptions.Item>
                    {deliveryMethod === 1 && (
                      <Descriptions.Item label="Địa chỉ giao hàng">
                        {form.getFieldValue("shippingAddress")}
                      </Descriptions.Item>
                    )}
                    {deliveryMethod === 0 && supplierInfo && (
                      <>
                        <Descriptions.Item label="Tên nhà cung cấp">
                          {supplierInfo.supplierName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                          {supplierInfo.contactNumber}
                        </Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ nhà cung cấp">
                          {supplierInfo.supplierAddress}
                        </Descriptions.Item>
                      </>
                    )}
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card
            title={<span style={{ color: '#1890ff' }}><DollarOutlined /> Thanh toán</span>}
            bordered={false}
            className="inner-card"
          >
            <Row gutter={24}>
              <Col span={12}>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Voucher đã chọn">
                    {selectedVoucherDetails?.vourcherCode || "Không có"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mô tả">
                    {selectedVoucherDetails?.description || "Không có"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số tiền giảm">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(selectedVoucherDetails?.discountAmount || 0)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng số tiền">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(formattedTotalAmount)}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default OrderReviewBuy;
