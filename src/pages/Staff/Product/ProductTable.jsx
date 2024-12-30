import { EyeOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Spin, Tag, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getSupplierById } from "../../../api/supplierApi";
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

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const ProductCard = ({
  product,
  categoryNames,
  expandedDescriptions,
  handleExpandDescription,
  handleView,
}) => {
  const [supplierName, setSupplierName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupplierData = async () => {
      const data = await getSupplierById(product.supplierID);
      if (data && data.result && data.result.items.length > 0) {
        setSupplierName(data.result.items[0].supplierName);
      }
      setLoading(false);
    };
    fetchSupplierData();
  }, [product.supplierID]);

  return (
    <Card
      hoverable
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tag color={getStatusClass(product.status)}>
            {getProductStatusEnum(product.status)}
          </Tag>
          <Text strong style={{ fontSize: '16px' }}>{product.productName}</Text>
        </div>
      }
      extra={
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleView(product.productID)}
        />
      }
      style={{ 
        marginBottom: '16px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}
    >
      <Row gutter={16}>
        <Col span={8}>
          <div style={{ 
            position: 'relative',
            paddingTop: '100%',
            overflow: 'hidden',
            borderRadius: '8px'
          }}>
            <img
              src={product.listImage?.[0]?.image || "https://via.placeholder.com/100?text=No+Image"}
              alt={product.productName}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
          </div>
        </Col>
        <Col span={16}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ marginBottom: '12px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>Thông tin cơ bản</Text>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '4px' }}>
                <Text strong>Mã Sản Phẩm:</Text>
                <Text>{product.productID}</Text>
                <Text strong>Số Serial:</Text>
                <Text>{product.serialNumber}</Text>
                <Text strong>Nhà Cung Cấp:</Text>
                <Text>{loading ? <Spin size="small" /> : supplierName || "Không xác định"}</Text>
                <Text strong>Loại Hàng:</Text>
                <Text>{categoryNames[product.categoryID] || "Không xác định"}</Text>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>Giá</Text>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '4px' }}>
                <Text strong>Giá Cọc:</Text>
                <Text>{formatPrice(product.depositProduct)}</Text>
                <Text strong>Giá Thuê:</Text>
                <Text>{formatPrice(product.priceRent)}</Text>
                <Text strong>Giá Bán:</Text>
                <Text>{formatPrice(product.priceBuy)}</Text>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>Chi tiết</Text>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '4px' }}>
                <Text strong>Thương Hiệu:</Text>
                <Text>{getBrandName(product.brand)}</Text>
                <Text strong>Chất Lượng:</Text>
                <Text>{product.quality}</Text>
                <Text strong>Đánh Giá:</Text>
                <Text>{product.rating}</Text>
              </div>
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>Mô tả</Text>
              <Paragraph
                ellipsis={{ rows: 2, expandable: true, symbol: 'Xem thêm' }}
                onClick={() => handleExpandDescription(product.productID)}
              >
                {product.productDescription}
              </Paragraph>
            </div>

            <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: 'auto' }}>
              Cập nhật: {formatDate(product.updatedAt)}
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

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
