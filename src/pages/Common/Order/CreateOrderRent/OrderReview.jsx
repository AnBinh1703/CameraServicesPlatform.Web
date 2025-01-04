import {
  DollarOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Card, Col, Descriptions, Row, Spin, Empty } from "antd";
import React from "react";

const OrderReview = ({
  product,
  form,
  deliveryMethod,
  supplierInfo,
  selectedVoucherDetails,
  totalAmount,
  contractTemplate,
  loading,
  depositProduct,
  productPriceRent,
  reservationMoney,
}) => {
  const totalAmountWithDeposit = totalAmount;

  return (
    <Card className="order-review-container" bordered={false}>
      <h2 style={{ marginBottom: 24, color: '#1890ff' }}>Xem lại đơn hàng của bạn</h2>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card
            title={<span style={{ color: '#1890ff' }}><InfoCircleOutlined /> Thông tin sản phẩm</span>}
            bordered={false}
            className="inner-card"
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin tip="Đang tải thông tin sản phẩm..." />
              </div>
            ) : product ? (
              <>
                <Row gutter={16}>
                  <Col span={12}>
                    <Descriptions column={1} bordered>
                      <Descriptions.Item
                        label={
                          <span>
                            <TagOutlined /> Mã sản phẩm
                          </span>
                        }
                      >
                        {product.productID}
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
                            <DollarOutlined /> Giá thuê
                          </span>
                        }
                      >
                        <div style={{ color: "#1890ff" }}>
                          <strong>Ngày:</strong>
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.pricePerDay)}
                        </div>
                        <div style={{ color: "#52c41a" }}>
                          <strong>Giờ: </strong>
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.pricePerHour)}
                        </div>
                        <div style={{ color: "#faad14" }}>
                          <strong>Tuần:</strong>
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.pricePerWeek)}
                        </div>
                        <div style={{ color: "#f5222d" }}>
                          <strong>Tháng:</strong>
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.pricePerMonth)}
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
                      title={
                        <span>
                          <PictureOutlined /> Hình ảnh sản phẩm
                        </span>
                      }
                      bordered={false}
                    >
                      <div className="flex flex-wrap mt-2">
                        {product.listImage && product.listImage.length > 0 ? (
                          product.listImage.map((imageObj, index) => (
                            <img
                              key={imageObj.productImagesID}
                              src={imageObj.image}
                              alt={`Hình ảnh sản phẩm ${index + 1}`}
                              className="w-24 h-24 mr-2 mb-2 object-cover"
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                margin: "4px",
                              }}
                            />
                          ))
                        ) : (
                          <p>Không có hình ảnh cho sản phẩm này.</p>
                        )}
                      </div>
                    </Card>
                  </Col>
                </Row>
                {contractTemplate && contractTemplate.length > 0 && (
                  <Card
                    title="Điều khoản hợp đồng"
                    bordered={false}
                    style={{ marginTop: "24px" }}
                  >
                    <Row gutter={16}>
                      <Col span={24}>
                        <Descriptions column={1} bordered>
                          {contractTemplate.map((item) => (
                            <Descriptions.Item
                              key={item.contractTemplateID}
                              label={
                                <span>
                                  <FileTextOutlined /> {item.templateName}
                                </span>
                              }
                            >
                              <p>
                                <strong>Điều khoản hợp đồng:</strong>
                                {item.contractTerms}
                              </p>
                              <p>
                                <strong>Chính sách phạt:</strong>
                                {item.penaltyPolicy}
                              </p>
                              <p>
                                <strong>Chi tiết mẫu:</strong>
                                {item.templateDetails}
                              </p>
                            </Descriptions.Item>
                          ))}
                        </Descriptions>
                      </Col>
                    </Row>
                  </Card>
                )}
              </>
            ) : (
              <Empty description="Không tìm thấy thông tin sản phẩm" />
            )}
          </Card>
        </Col>

        <Col span={24}>
          <Card
            title={<span style={{ color: '#1890ff' }}><InfoCircleOutlined /> Thông tin giao hàng</span>}
            bordered={false}
            className="inner-card"
          >
            <Descriptions bordered column={1} size="small">
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

        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Card
                title={<span style={{ color: '#1890ff' }}><TagOutlined /> Chi tiết Voucher</span>}
                bordered={false}
                className="inner-card"
              >
                {selectedVoucherDetails ? (
                  <Descriptions bordered column={1}>
                    <Descriptions.Item label="Mã Voucher">
                      {selectedVoucherDetails.vourcherCode}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mô tả">
                      {selectedVoucherDetails.description}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số tiền giảm">
                      {selectedVoucherDetails.discountAmount}
                    </Descriptions.Item>
                  </Descriptions>
                ) : (
                  <p>Không có voucher được chọn.</p>
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title={<span style={{ color: '#1890ff' }}><DollarOutlined /> Tổng kết đơn hàng</span>}
                bordered={false}
                className="inner-card"
                style={{ height: '100%' }}
              >
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="Giá thuê sản phẩm">
                    <span style={{ color: '#52c41a', fontSize: '18px', fontWeight: 'bold' }}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(productPriceRent)}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tiền cọc sản phẩm">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(depositProduct)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tiền giữ sản phẩm">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(reservationMoney)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng số tiền">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(totalAmountWithDeposit)}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <style jsx>{`
        .order-review-container {
          background: #f0f2f5;
          padding: 24px;
        }
        .inner-card {
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          border-radius: 8px;
        }
        .ant-descriptions-item-label {
          width: 30%;
        }
      `}</style>
    </Card>
  );
};

export default OrderReview;
