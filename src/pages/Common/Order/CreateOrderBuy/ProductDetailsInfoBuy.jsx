import {
  DollarOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Card, Col, Descriptions, Row, Spin, Form, InputNumber } from "antd";
import React from "react";

const ProductDetailsInfoBuy = ({ product, loading }) => {
  return (
    <Card
      title={
        <div style={{
          fontSize: "24px",
          fontWeight: "600",
          background: "linear-gradient(90deg, #1890ff, #52c41a)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Thông tin sản phẩm
        </div>
      }
      bordered={false}
      style={{
        marginBottom: "24px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
      }}
    >
      {loading ? (
        <div style={{ 
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px" 
        }}>
          <Spin size="large" tip={
            <div style={{ marginTop: "15px", color: "#1890ff" }}>
              Đang tải thông tin sản phẩm...
            </div>
          } />
        </div>
      ) : product ? (
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Descriptions
              column={1}
              bordered
              size="middle"
              labelStyle={{
                fontWeight: "600",
                backgroundColor: "#f8f9fa",
                width: "140px",
                padding: "16px",
                borderRadius: "4px 0 0 4px"
              }}
              contentStyle={{
                backgroundColor: "white",
                padding: "16px",
                borderRadius: "0 4px 4px 0"
              }}
            >
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
                    <DollarOutlined /> Giá bán
                  </span>
                }
              >
                <div style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#52c41a",
                  padding: "8px",
                  background: "#f6ffed",
                  borderRadius: "6px",
                  display: "inline-block"
                }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.priceBuy)}
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
                <span style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#1890ff"
                }}>
                  <PictureOutlined /> Hình ảnh sản phẩm
                </span>
              }
              bordered={false}
              style={{
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
              }}
            >
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: "12px",
                padding: "12px"
              }}>
                {product.listImage?.length > 0 ? (
                  product.listImage.map((imageObj) => (
                    <div
                      key={imageObj.productImagesID}
                      style={{
                        position: "relative",
                        paddingTop: "100%",
                        overflow: "hidden",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        transition: "transform 0.3s"
                      }}
                    >
                      <img
                        src={imageObj.image}
                        alt="Product"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#999",
                    background: "#f5f5f5",
                    borderRadius: "8px"
                  }}>
                    <PictureOutlined style={{ fontSize: "32px", marginBottom: "8px" }} />
                    <div>Không có hình ảnh cho sản phẩm này.</div>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      ) : (
        <div style={{
          padding: "40px",
          textAlign: "center",
          background: "#f5f5f5",
          borderRadius: "8px",
          color: "#999"
        }}>
          <InfoCircleOutlined style={{ fontSize: "32px", marginBottom: "16px" }} />
          <p>Không tìm thấy thông tin sản phẩm.</p>
        </div>
      )}
      <Form.Item
        name="orderQuantity"
        label="Số lượng đặt hàng"
        rules={[{ required: true, message: "Vui lòng nhập số lượng đặt hàng" }]}
      >
        <InputNumber min={1} />
      </Form.Item>
    </Card>
  );
};

export default ProductDetailsInfoBuy;
