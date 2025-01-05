import {
  Badge,
  Button,
  Card,
  Divider,
  List,
  Rate,
  Spin,
  Tag,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../../api/categoryApi";
import { getProductByCategoryId } from "../../api/productApi";

const { Title, Text } = Typography;

const Category = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      const data = await getAllCategories(pageIndex, pageSize);
      if (data && data.isSuccess) {
        setCategories(data.result || []);
      }
      setLoadingCategories(false);
    };

    fetchCategories();
  }, [pageIndex, pageSize]);

  const handleCategorySelect = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    setLoadingProducts(true);
    const productsData = await getProductByCategoryId(
      categoryId,
      pageIndex,
      pageSize
    );
    if (productsData) {
      setProducts(productsData);
    } else {
      setProducts([]);
    }
    setLoadingProducts(false);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 0: // AvailableSell
        return "success"; // Green
      case 1: // AvailableRent
        return "processing"; // Blue
      case 2: // Rented
        return "warning"; // Yellow
      case 3: // Sold
        return "error"; // Red
      case 4: // DiscontinuedProduct
        return "default"; // Gray
      default:
        return "default"; // Default color
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Title level={2} className="text-center mb-4">
        Danh mục
      </Title>

      <Spin spinning={loadingCategories}>
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={categories}
          renderItem={(category) => (
            <List.Item key={category.categoryID}>
              <Button
                type="primary"
                onClick={() => handleCategorySelect(category.categoryID)}
                className="w-full"
              >
                {category.categoryName}
              </Button>
            </List.Item>
          )}
        />
      </Spin>

      {selectedCategoryId && (
        <div className="mt-4">
          <Spin spinning={loadingProducts}>
            <List
              loading={loadingProducts}
              grid={{ gutter: 16, column: 2 }}
              dataSource={products}
              renderItem={(product) => (
                <List.Item>
                  <Card
                    title={
                      <Title level={4} style={{ marginBottom: 0 }}>
                        {product.productName}
                      </Title>
                    }
                    hoverable
                    className="shadow-md rounded-md overflow-hidden"
                    style={{ height: '800px', display: 'flex', flexDirection: 'column' }} // Add fixed height
                    cover={
                      <img
                        alt={product.productName}
                        src={
                          product.listImage[0]?.image ||
                          "https://via.placeholder.com/300"
                        }
                        style={{
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "8px 8px 0 0",
                        }}
                      />
                    }
                  >
                     <div style={{ 
                        marginTop: 'auto', 
                        textAlign: 'right',
                        paddingTop: '16px'
                      }}>
                        <Button
                          type="primary"
                          onClick={() => handleViewDetails(product.productID)}
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      height: '100%',
                      overflow: 'hidden' 
                    }}>
                      <Text
                        type="secondary"
                        style={{ 
                          marginBottom: "8px",
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {product.productDescription}
                      </Text>

                      <Divider style={{ margin: '12px 0' }} />

                      <div style={{ flexGrow: 1, overflow: 'auto' }}>
                        {/* Product info section */}
                        <div className="product-info" style={{ marginBottom: '16px' }}>
                          <div style={{ marginBottom: "8px" }}>
                            <Text strong>Số serial:</Text> {product.serialNumber}
                          </div>
                          <div style={{ marginBottom: "8px" }}>
                            <Text strong>Trạng thái:</Text>
                            <Badge
                              status={getStatusColor(product.status)}
                              text={
                                product.status === 0
                                  ? "Còn hàng"
                                  : product.status === 1
                                  ? "Cho thuê"
                                  : product.status === 2
                                  ? "Đã thuê"
                                  : product.status === 3
                                  ? "Đã bán"
                                  : "Ngừng kinh doanh"
                              }
                            />
                          </div>
                          <div style={{ marginBottom: "8px" }}>
                            <Text strong>Giá:</Text>
                            {product.priceBuy
                              ? new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(product.priceBuy)
                              : "Không có sẵn"}
                          </div>
                          <div style={{ marginBottom: "8px" }}>
                            <Text strong>Chất lượng:</Text>
                            <Tag
                              color={product.quality === "moi" ? "green" : "orange"}
                            >
                              {product.quality}
                            </Tag>
                          </div>

                          <div style={{ marginBottom: "8px" }}>
                            <Text strong>Đánh giá:</Text>
                            <Rate disabled value={product.rating} />
                          </div>
                          <div style={{ marginBottom: "8px" }}>
                            <Text strong>Ngày tạo:</Text>
                            {new Date(product.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Specifications section */}
                        {product.listProductSpecification?.length > 0 && (
                          <div style={{ marginBottom: '16px' }}>
                            <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '8px' }}>
                              Thông số kỹ thuật:
                            </Text>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 2fr',
                              gap: '8px 16px',
                              background: '#f9f9f9',
                              padding: '12px',
                              borderRadius: '8px',
                              maxHeight: '200px',
                              overflow: 'auto'
                            }}>
                              {product.listProductSpecification.map((spec) => (
                                <React.Fragment key={spec.productSpecificationID}>
                                  <Text
                                    style={{
                                      fontWeight: "500",
                                      color: "#595959",
                                    }}
                                  >
                                    {spec.specification}
                                  </Text>
                                  <Text>{spec.details}</Text>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Button section - always at bottom */}
                     
                    </div>
                  </Card>
                </List.Item>
              )}
              bordered
            />
          </Spin>
        </div>
      )}
    </div>
  );
};

export default Category;
