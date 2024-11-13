import { Card, Col, Descriptions, Row, Spin } from "antd";
import React from "react";

const ProductDetailsInfoRent = ({ product, contractTemplate, loading }) => (
  <Card
    title="Thông tin sản phẩm"
    bordered={false}
    style={{ marginBottom: "24px" }}
  >
    {loading ? (
      <Spin tip="Đang tải thông tin sản phẩm..." />
    ) : product ? (
      <>
        <Row gutter={16}>
          <Col span={12}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Mã sản phẩm">
                {product.productID}
              </Descriptions.Item>
              <Descriptions.Item label="Tên">
                {product.productName}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                {product.productDescription}
              </Descriptions.Item>
              <Descriptions.Item label="Giá thuê">
                {product.priceRent}
              </Descriptions.Item>
              <Descriptions.Item label="Chất lượng">
                {product.quality}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <Card title="Hình ảnh sản phẩm" bordered={false}>
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
                      label={item.templateName}
                    >
                      <p>
                        <strong>Điều khoản hợp đồng:</strong>{" "}
                        {item.contractTerms}
                      </p>
                      <p>
                        <strong>Chính sách phạt:</strong> {item.penaltyPolicy}
                      </p>
                      <p>
                        <strong>Chi tiết mẫu:</strong> {item.templateDetails}
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
      <p>Không tìm thấy thông tin sản phẩm.</p>
    )}
  </Card>
);

export default ProductDetailsInfoRent;
