import { FileTextOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Carousel,
  Col,
  Descriptions,
  Input,
  Layout,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Tag,
  Typography,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getCategoryById } from "../../../api/categoryApi";
import { getAllProduct, getProductById } from "../../../api/productApi";
import { getSupplierById } from "../../../api/supplierApi";
import { createWishlist } from "../../../api/wishlistApi";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";
import { getBrandName } from "../../../utils/constant";

const { Header, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productDetail, setProductDetail] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Set items per page
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalProducts = products.length;
  const [supplierName, setSupplierName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [wishlistedProducts, setWishlistedProducts] = useState([]);

  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productList = await getAllProduct(1, 100);
        // Sort products by createdAt in descending order
        const sortedProducts = productList.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProducts(sortedProducts);
      } catch (error) {
        message.error("Có lỗi xảy ra khi tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const fetchProductDetail = async (productID) => {
    setLoading(true);
    try {
      const data = await getProductById(productID);
      if (data) {
        setProductDetail(data);
        // Fetch supplier and category information
        const supplierData = await getSupplierById(data.supplierID, 1, 1);
        const categoryData = await getCategoryById(data.categoryID);

        if (supplierData?.result?.items.length > 0) {
          setSupplierName(supplierData.result.items[0].supplierName);
        }

        if (categoryData?.isSuccess) {
          setCategoryName(categoryData.result.categoryName);
        } else {
          setCategoryName("Không xác định");
        }
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tải chi tiết sản phẩm.");
    } finally {
      setLoading(false);
      setIsModalVisible(true);
    }
  };

  const handleCardDoubleClick = (productID) => {
    fetchProductDetail(productID);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setProductDetail(null);
    setSupplierName("");
    setCategoryName("");
  };

  const handleSearchByName = async (value) => {
    setSearchTerm(value);
    setLoading(true);
    try {
      const productList = await getAllProduct(1, 100);
      const filteredProducts = productList.filter((product) =>
        product.productName.toLowerCase().includes(value.toLowerCase())
      );
      // Sort filtered products by createdAt in descending order
      const sortedProducts = filteredProducts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setProducts(sortedProducts);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Có lỗi xảy ra khi tìm kiếm sản phẩm.");
      setProducts([]);
    }
    setLoading(false);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const productList = await getAllProduct(1, 100);
        // Sort products by createdAt in descending order
        const sortedProducts = productList.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProducts(sortedProducts);
      } catch (error) {
        message.error("Có lỗi xảy ra khi tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  };

  const handleAddToWishlist = async (product) => {
    try {
      const data = {
        accountId: accountId,
        productID: product.productID,
        // Add any other necessary data here
      };
      const result = await createWishlist(data);
      if (result) {
        message.success("Product added to wishlist!");
        setWishlistedProducts([...wishlistedProducts, product.productID]);
      } else {
        message.error("Failed to add product to wishlist.");
      }
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      message.error("Failed to add product to wishlist.");
    }
  };

  return (
    <Layout>
      <LoadingComponent isLoading={loading} />
      <Header
        style={{
          backgroundImage: 'url("/path/to/your/image.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        <Title
          level={2}
          style={{
            color: "white",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          Danh Sách Sản Phẩm
        </Title>
      </Header>
      <Content style={{ padding: "20px" }}>
        <Carousel autoplay style={{ marginBottom: "20px" }}>
          {/* Add carousel items here */}
        </Carousel>

        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Search
            placeholder="Tìm kiếm sản phẩm theo tên"
            enterButton="Tìm kiếm"
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearchByName}
            style={{ width: 300, marginRight: 20 }}
          />
          <Button onClick={handleClearSearch} style={{ marginLeft: 20 }}>
            Xóa Tìm Kiếm
          </Button>
        </div>

        {!loading && currentProducts.length > 0 ? (
          <>
            <Row gutter={[24, 24]}>
              {currentProducts.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.productID}>
                  <Card
                    hoverable
                    cover={
                      <div style={{ position: 'relative', height: 240 }}>
                        {product.listImage.length > 0 && (
                          <img
                            alt={product.productName}
                            src={product.listImage[0].image}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            loading="lazy"
                          />
                        )}
                        <div
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                          }}
                        >
                          {(product.priceBuy || product.pricePerDay || product.pricePerHour || product.pricePerMonth || product.pricePerWeek) && (
                            <div
                              style={{
                                background: product.priceBuy ? '#ff4d4f' : '#1890ff',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                color: 'white',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontWeight: '500',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                              }}
                            >
                              {product.priceBuy ? (
                                <span>Chỉ bán</span>
                              ) : (product.pricePerDay || product.pricePerHour || product.pricePerMonth || product.pricePerWeek) ? (
                                <span>Chỉ cho thuê</span>
                              ) : (
                                <span>Cho thuê & Bán</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    }
                    onDoubleClick={() => handleCardDoubleClick(product.productID)}
                    className="product-card"
                    style={{
                      height: '100%',
                      overflow: 'hidden',
                    }}
                    bodyStyle={{ padding: '16px' }}
                  >
                    <Card.Meta
                      title={
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center' 
                        }}>
                          <Typography.Title level={5} ellipsis style={{ margin: 0, maxWidth: '80%' }}>
                            {product.productName}
                          </Typography.Title>
                          <button
                            onClick={() => handleAddToWishlist(product)}
                            className="wishlist-button"
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            {wishlistedProducts.includes(product.productID) ? (
                              <FaHeart style={{ color: '#ff4d4f', fontSize: '20px' }} />
                            ) : (
                              <FaRegHeart style={{ color: '#8c8c8c', fontSize: '20px' }} />
                            )}
                          </button>
                        </div>
                      }
                      description={
                        <div style={{ fontSize: '14px' }}>
                          <Typography.Paragraph
                            ellipsis={{ rows: 2 }}
                            style={{ color: '#666', marginBottom: 12 }}
                          >
                            {product.productDescription}
                          </Typography.Paragraph>

                          <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: '8px', 
                            marginBottom: 12 
                          }}>
                            <Tag color="gold">{product.serialNumber}</Tag>
                            <Tag color="blue">{getBrandName(product.brand)}</Tag>
                            <Tag color="green">{product.quality}</Tag>
                          </div>

                          <div style={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            marginBottom: 12,
                            background: '#f8f9fa',
                            padding: '8px',
                            borderRadius: '6px'
                          }}>
                            {product.priceBuy && (
                              <div className="price-row">
                                <span>Giá bán:</span>
                                <span className="price-buy">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(product.priceBuy)}
                                </span>
                              </div>
                            )}
                            {product.pricePerHour && (
                              <div className="price-row">
                                <span>Giá thuê/giờ:</span>
                                <span className="price">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(product.pricePerHour)}
                                </span>
                              </div>
                            )}
                            {product.pricePerDay && (
                              <div className="price-row">
                                <span>Giá thuê/ngày:</span>
                                <span className="price">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(product.pricePerDay)}
                                </span>
                              </div>
                            )}
                            {product.depositProduct && (
                              <div className="price-row">
                                <span>Tiền cọc:</span>
                                <span className="price-deposit">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(product.depositProduct)}
                                </span>
                              </div>
                            )}
                          </div>

                          <div style={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 12 
                          }}>
                            <div>
                              {Array.from({ length: 5 }, (_, index) => (
                                <span
                                  key={index}
                                  style={{
                                    color: index < (product.rating || 0) ? '#fadb14' : '#f0f0f0',
                                    fontSize: '16px',
                                  }}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span style={{ color: '#8c8c8c', fontSize: '12px' }}>
                              {moment(product.createdAt).format("DD/MM/YYYY")}
                            </span>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
            {/* Pagination */}
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={totalProducts}
              onChange={(page) => setCurrentPage(page)}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </>
        ) : (
          !loading && <p>Không tìm thấy sản phẩm nào.</p>
        )}
      </Content>
      <Modal
        title={
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '12px',
            marginBottom: '20px'
          }}>
            {productDetail?.productName || "Chi tiết sản phẩm"}
          </div>
        }
        visible={isModalVisible}
        onCancel={handleModalClose}
        width={1000}
        footer={[
          <Button key="close" onClick={handleModalClose} size="large">
            Đóng
          </Button>,
          <Button
            key="wishlist"
            onClick={() => handleAddToWishlist(productDetail)}
            className="focus:outline-none"
            type="primary"
            icon={wishlistedProducts.includes(productDetail?.productID) ? 
              <FaHeart /> : <FaRegHeart />}
            size="large"
          />
        ]}
        bodyStyle={{ padding: "24px", borderRadius: "8px" }}
        centered
      >
        {productDetail ? (
          <div style={{ display: "flex", gap: "24px" }}>
            {/* Left side - Image */}
            <div style={{ flex: "0 0 40%" }}>
              <div style={{ 
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <img
                  src={productDetail.listImage[0]?.image}
                  alt={productDetail.productName}
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "cover",
                  }}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right side - Details */}
            <div style={{ flex: "1" }}>
              <div style={{ marginBottom: "24px" }}>
                <Typography.Title level={4}>Thông tin cơ bản</Typography.Title>
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '16px', 
                  borderRadius: '8px',
                  marginBottom: '16px' 
                }}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <div style={{ color: '#666' }}>Mã Seri:</div>
                      <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
                        {productDetail.serialNumber}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ color: '#666' }}>Chất lượng:</div>
                      <Tag color="blue" style={{ padding: '4px 12px' }}>
                        {productDetail.quality}
                      </Tag>
                    </Col>
                  </Row>
                </div>
                
                <Typography.Title level={4}>Giá cả</Typography.Title>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                  background: '#f8f9fa',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  {productDetail.priceBuy && (
                    <div className="price-item">
                      <div style={{ color: '#666' }}>Giá Mua:</div>
                      <div style={{ color: '#52c41a', fontSize: '18px', fontWeight: 'bold' }}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(productDetail.priceBuy)}
                      </div>
                    </div>
                  )}
                  {productDetail.pricePerHour && (
                    <div className="price-item">
                      <div style={{ color: '#666' }}>Giá thuê/giờ:</div>
                      <div style={{ color: '#1890ff', fontSize: '16px' }}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(productDetail.pricePerHour)}
                      </div>
                    </div>
                  )}
                  {/* Similar blocks for other price types */}
                </div>

                <Typography.Title level={4} style={{ marginTop: '24px' }}>Mô tả</Typography.Title>
                <Typography.Paragraph style={{ 
                  background: '#f8f9fa',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '24px'
                }}>
                  {productDetail.productDescription}
                </Typography.Paragraph>

                <Typography.Title level={4}>Thông số kỹ thuật</Typography.Title>
                <div style={{ 
                  background: '#f8f9fa',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  {productDetail.listProductSpecification.map((spec) => (
                    <div 
                      key={spec.productSpecificationID}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: '1px solid #e8e8e8'
                      }}
                    >
                      <span style={{ color: '#666' }}>{spec.specification}:</span>
                      <span style={{ fontWeight: '500' }}>{spec.details}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <LoadingComponent />
            <p style={{ marginTop: '16px' }}>Đang tải chi tiết sản phẩm...</p>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default ProductList;

// Add this CSS
`
.price-item {
  padding: 12px;
  border-radius: 6px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.ant-modal-content {
  border-radius: 12px;
  overflow: hidden;
}

.ant-modal-header {
  border-bottom: none;
}

.ant-modal-footer {
  border-top: none;
  padding: 16px 24px;
}

.product-card {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px dashed #f0f0f0;
}

.price {
  color: #1890ff;
  font-weight: 500;
}

.price-deposit {
  color: #52c41a;
  font-weight: 500;
}

.wishlist-button:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.price-buy {
  color: #f5222d;
  font-weight: 600;
  font-size: 16px;
}
`
