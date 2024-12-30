import { EyeOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Tag, Typography } from "antd";
import React from "react";
import { getBrandName, getProductStatusEnum } from "../../../utils/constant";

const { Paragraph, Text } = Typography;

const getStatusClass = (status) => {
  switch (status) {
    case 0:
      return "green"; // For Sale
    case 1:
      return "blue"; // For Rent
    case 2:
      return "orange"; // Rented Out
    case 3:
      return "red"; // Sold
    case 4:
      return "default"; // Unavailable
    default:
      return "default"; // Default case
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const ProductCard = ({
  product,
  categoryNames,
  expandedDescriptions,
  handleExpandDescription,
  handleView,
}) => (
  <Card
    title={
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Tag color={getStatusClass(product.status)}>
          {getProductStatusEnum(product.status)}
        </Tag>
        <Text strong>{product.productName}</Text>
      </div>
    }
    extra={
      <Button
        type="default"
        icon={<EyeOutlined />}
        onClick={() => handleView(product.productID)}
        style={{
          backgroundColor: "#1890ff",
          color: "#fff",
          borderColor: "#1890ff",
        }}
      />
    }
    style={{ marginBottom: "16px" }}
  >
    <Row gutter={16}>
      <Col span={8}>
        <img
          src={
            product.listImage && product.listImage.length > 0
              ? product.listImage[0].image
              : "https://via.placeholder.com/100?text=No+Image"
          }
          alt={product.productName}
          width="100%"
          style={{ borderRadius: "8px" }}
        />
      </Col>
      <Col span={16}>
        <p>
          <Text strong>Mã Sản Phẩm:</Text> {product.productID}
        </p>
        <p>
          <Text strong>Số Serial:</Text> {product.serialNumber}
        </p>
        <p>
          <Text strong>Mã Nhà Cung Cấp:</Text> {product.supplierID}
        </p>
        <p>
          <Text strong>Tên Loại Hàng:</Text>
          {categoryNames[product.categoryID] || "Không xác định"}
        </p>
        <p>
          <Text strong>Giá (Cọc):</Text> {product.depositProduct}
        </p>
        <p>
          <Text strong>Giá (Thuê):</Text> {product.priceRent}
        </p>
        <p>
          <Text strong>Giá (Bán):</Text> {product.priceBuy}
        </p>
        <p>
          <Text strong>Thương Hiệu:</Text> {getBrandName(product.brand)}
        </p>
        <p>
          <Text strong>Chất Lượng:</Text> {product.quality}
        </p>
        <p>
          <Text strong>Trạng Thái:</Text>{" "}
          <Tag color={getStatusClass(product.status)}>
            {getProductStatusEnum(product.status)}
          </Tag>
        </p>
        <p>
          <Text strong>Đánh Giá:</Text> {product.rating}
        </p>
        <p>
          <Text strong>Ngày Tạo:</Text> {formatDate(product.createdAt)}
        </p>
        <p>
          <Text strong>Ngày Cập Nhật:</Text> {formatDate(product.updatedAt)}
        </p>
        <Paragraph ellipsis={{ rows: 2, expandable: true }}>
          {expandedDescriptions[product.productID]
            ? product.productDescription
            : `${
                product.productDescription
                  ? product.productDescription.slice(0, 100)
                  : ""
              }...`}
        </Paragraph>
        {product.productDescription &&
          product.productDescription.length > 100 && (
            <Button
              type="link"
              onClick={() => handleExpandDescription(product.productID)}
              style={{ padding: 0 }}
            >
              {expandedDescriptions[product.productID] ? "Thu gọn" : "Xem thêm"}
            </Button>
          )}
      </Col>
    </Row>
  </Card>
);

const ProductTable = ({
  products,
  categoryNames,
  expandedDescriptions,
  handleExpandDescription,
  handleView,
}) => {
  return (
    <Row gutter={16}>
      {products.map((product) => (
        <Col span={8} key={product.productID}>
          <ProductCard
            product={product}
            categoryNames={categoryNames}
            expandedDescriptions={expandedDescriptions}
            handleExpandDescription={handleExpandDescription}
            handleView={handleView}
          />
        </Col>
      ))}
    </Row>
  );
};

export default ProductTable;
