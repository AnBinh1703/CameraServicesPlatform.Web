import { Button, Card, Empty, List, message, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProductById } from "../../../api/productApi"; // Import getProductById function
import {
  deleteWishlistItem,
  getWishlistByAccountId,
} from "../../../api/wishlistApi"; // Import necessary functions

const { Title } = Typography;

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const data = await getWishlistByAccountId(accountId);
        if (data && data.isSuccess) {
          const itemsWithDetails = await Promise.all(
            data.result.items.map(async (item) => {
              const product = await getProductById(item.productID);
              return {
                ...item,
                productName: product.productName,
                productDescription: product.productDescription,
                price: product.priceBuy || product.priceRent,
                productImage:
                  product.listImage?.[0]?.image || "default-image-url", // Ensure the image URL is included
              };
            })
          );
          setWishlist(itemsWithDetails);
        } else {
          message.error("Không thể tải danh sách yêu thích.");
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách yêu thích:", error);
        message.error("Lỗi khi tải danh sách yêu thích.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [accountId]);

  const handleDeleteWishlistItem = async (wishlistId) => {
    console.log("Đang xóa mục yêu thích", wishlistId);
    try {
      const result = await deleteWishlistItem(wishlistId);
      if (result && result.isSuccess) {
        message.success("Đã xóa mục yêu thích thành công!");
        setWishlist(wishlist.filter((item) => item.wishlistID !== wishlistId));
      } else {
        message.error("Không thể xóa mục yêu thích.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa mục yêu thích:", error);
      message.error("Không thể xóa mục yêu thích.");
    }
  };

  return (
    <div className="wishlist-container">
      <Title level={2}>Danh Sách Yêu Thích</Title>
      {loading ? (
        <div className="loading-spinner">
          <Spin size="large" />
        </div>
      ) : wishlist.length === 0 ? (
        <Empty description="Không có mục nào trong danh sách yêu thích" />
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={wishlist}
          renderItem={(item) => (
            <List.Item>
              <Card
                title={item.productName}
                extra={
                  <Button
                    type="danger"
                    onClick={() => handleDeleteWishlistItem(item.wishlistID)}
                  >
                    Xóa
                  </Button>
                }
                hoverable
              >
                <div style={{ display: "flex" }}>
                  <img
                    alt={item.productName}
                    src={item.productImage}
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      marginRight: "16px",
                    }} // Set specific styles for the image
                  />
                  <Card.Meta
                    description={
                      <>
                        <p>{item.productDescription}</p>
                        <p>
                          <strong>Giá:</strong> {item.price}
                        </p>
                      </>
                    }
                  />
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Wishlist;
