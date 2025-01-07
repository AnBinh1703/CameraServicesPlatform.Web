import { StarFilled } from "@ant-design/icons";
import { Card, List, Rate, Typography, Spin } from "antd";
import { useEffect, useState } from "react";
import { getProductById } from "../../api/productApi"; // Add this import

const { Text } = Typography;

const TopRatedProductsCard = ({ topRatedProducts }) => {
  const [productsWithDetails, setProductsWithDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!topRatedProducts) return;
      
      try {
        const detailedProducts = await Promise.all(
          topRatedProducts.map(async (product) => {
            const details = await getProductById(product.productID);
            return {
              ...product,
              productName: details.productName || 'Unknown Product'
            };
          })
        );
        setProductsWithDetails(detailedProducts);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [topRatedProducts]);

  return (
    <Card 
      title={<Text strong style={{ fontSize: '18px' }}>Sản Phẩm Đánh Giá Cao Nhất</Text>}
      style={{ 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: '12px',
        background: 'linear-gradient(145deg, #ffffff, #f0f2f5)',
        border: 'none'
      }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <List
          dataSource={productsWithDetails}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '12px',
                background: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                ':hover': {
                  transform: 'translateX(5px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}
            >
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <Text strong style={{ color: '#1890ff', fontSize: '15px' }}>{item.productName}</Text>
                  <Text type="secondary">
                    {item.totalRatings} lượt đánh giá
                  </Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Rate 
                    disabled 
                    value={item.averageRating} 
                    allowHalf 
                    style={{ fontSize: '16px' }}
                  />
                  <Text style={{ marginLeft: '12px', color: '#faad14', fontWeight: 'bold' }}>
                    {item.averageRating.toFixed(1)}
                  </Text>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default TopRatedProductsCard;
