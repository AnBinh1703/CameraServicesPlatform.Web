import {
  Button,
  Card,
  Col,
  Descriptions,
  Input,
  Layout,
  message,
  Modal,
  Pagination,
  Row,
  Tag,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getProductById,
  getProposalProductFollowJobBuy,
} from "../../../api/productApi";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";
import { getBrandName } from "../../../utils/constant";

const { Header, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const ProposalProductFollowJobBuy = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productDetail, setProductDetail] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 88; // Set items per page

  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;
  console.log(accountId);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productList = await getProposalProductFollowJobBuy(
          accountId,
          1,
          100
        );
        setProducts(productList || []);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [accountId]);

  const fetchProductDetail = async (productID) => {
    setLoading(true);
    try {
      const data = await getProductById(productID);
      if (data) {
        setProductDetail(data);
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
  };

  const handleSearchByName = async (value) => {
    setSearchTerm(value);
    setLoading(true);
    try {
      const productList = await getProposalProductFollowJobBuy(
        accountId,
        1,
        100
      );
      const filteredProducts = productList.filter((product) =>
        product.productName.toLowerCase().includes(value.toLowerCase())
      );
      setProducts(filteredProducts);
      setCurrentPage(1); // Reset to the first page when searching
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
        const productList = await getProposalProductFollowJobBuy(
          accountId,
          1,
          100
        );
        setProducts(productList || []);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  };

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalProducts = products.length;

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
          Đề Xuất Sản Phẩm Theo Công Việc 
        </Title>
      </Header>
      <Content style={{ padding: "20px" }}>
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
            <Row gutter={[16, 16]}>
              {currentProducts.map((product) => (
                <Col span={6} key={product.productID}>
                  <Card
                    hoverable
                    cover={
                      product.listImage.length > 0 && (
                        <img
                          alt={product.productName}
                          src={product.listImage[0].image}
                          style={{
                            height: 200,
                            objectFit: "cover",
                            borderRadius: "8px 8px 0 0",
                          }}
                          loading="lazy"
                        />
                      )
                    }
                    onDoubleClick={() =>
                      handleCardDoubleClick(product.productID)
                    }
                    style={{
                      marginBottom: "20px",
                      height: "100%",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.3s",
                    }}
                    bodyStyle={{ padding: "16px" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <Card.Meta
                      title={product.productName}
                      description={
                        <div>
                          <p>{product.productDescription}</p>
                          <p>
                            <strong>Serial Number:</strong>
                            <span
                              style={{ color: "green", fontWeight: "bold" }}
                            >
                              {product.serialNumber}
                            </span>
                          </p>
                          {product.priceRent != null && (
                            <p>
                              <strong>Giá (Thuê)/giờ:</strong>
                              <span style={{ color: "blue" }}>
                                VND{product.priceRent}
                              </span>
                            </p>
                          )}
                          {product.priceBuy != null && (
                            <p>
                              <strong>Giá (Mua):</strong>
                              <span
                                style={{ color: "green", fontWeight: "bold" }}
                              >
                                VND{product.priceBuy}
                              </span>
                            </p>
                          )}
                          {product.pricePerHour != null && (
                            <p>
                              <strong>Giá (Thuê)/giờ:</strong>
                              <span
                                style={{ color: "green", fontWeight: "bold" }}
                              >
                                VND{product.pricePerHour}
                              </span>
                            </p>
                          )}
                          {product.pricePerDay != null && (
                            <p>
                              <strong>Giá (Thuê)/ngày:</strong>
                              <span
                                style={{ color: "green", fontWeight: "bold" }}
                              >
                                VND{product.pricePerDay}
                              </span>
                            </p>
                          )}
                          {product.pricePerWeek != null && (
                            <p>
                              <strong>Giá (Thuê)/tuần:</strong>
                              <span
                                style={{ color: "green", fontWeight: "bold" }}
                              >
                                VND{product.pricePerWeek}
                              </span>
                            </p>
                          )}
                          {product.pricePerMonth != null && (
                            <p>
                              <strong>Giá (Thuê)/tháng:</strong>
                              <span
                                style={{ color: "green", fontWeight: "bold" }}
                              >
                                VND{product.pricePerMonth}
                              </span>
                            </p>
                          )}
                          {(product.priceBuy || product.pricePerDay || product.pricePerHour || product.pricePerMonth || product.pricePerWeek) && (
                            <div
                              style={{
                                background: product.priceBuy ? '#ff4d4f' : '#1890ff',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                color: 'white',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
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
                          <p>
                            <strong>Đánh giá:</strong>
                            {Array.from({ length: 5 }, (_, index) => (
                              <span
                                key={index}
                                style={{
                                  color:
                                    index < product.rating
                                      ? "yellow"
                                      : "lightgray",
                                  fontSize: "20px",
                                }}
                              >
                                {index < product.rating ? "★" : "☆"}
                              </span>
                            ))}
                          </p>
                          <p>
                            <strong>Thương hiệu:</strong>
                            {getBrandName(product.brand) || "Không xác định"}
                          </p>
                          <Tag color="blue">
                            <strong>Chất lượng:</strong> {product.quality}
                          </Tag>
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
          !loading && <p>Không tìm thấy sản phẩm nào phù hợp với công việc hiện tại của bạn. Rất xin lỗi. </p>
        )}
      </Content>
      <Modal
        title={productDetail?.productName || "Chi tiết sản phẩm"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Đóng
          </Button>,
        ]}
        bodyStyle={{ padding: "20px", borderRadius: "8px" }}
        centered
      >
        {productDetail ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={productDetail.listImage[0]?.image}
              alt={productDetail.productName}
              style={{
                width: "100%",
                height: "auto",
                marginBottom: "20px",
                borderRadius: "8px",
              }}
              loading="lazy"
            />
            <Descriptions
              bordered
              column={1}
              layout="vertical"
              style={{ width: "100%" }}
            >
              <Descriptions.Item label="Serial Number">
                <span style={{ color: "blue" }}>
                  {productDetail.serialNumber}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                {productDetail.productDescription}
              </Descriptions.Item>
              {productDetail.priceRent != null && (
                <Descriptions.Item label="Giá (Thuê)">
                  <span style={{ color: "blue" }}>
                    VND{productDetail.priceRent}
                  </span>
                </Descriptions.Item>
              )}
              {productDetail.priceBuy != null && (
                <Descriptions.Item label="Giá (Mua)">
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    VND{productDetail.priceBuy}
                  </span>
                </Descriptions.Item>
              )}
              {productDetail.pricePerHour != null && (
                <Descriptions.Item label="Giá (Thuê)/giờ">
                  <span style={{ color: "blue" }}>
                    VND{productDetail.pricePerHour}
                  </span>
                </Descriptions.Item>
              )}
              {productDetail.pricePerDay != null && (
                <Descriptions.Item label="Giá (Thuê)/ngày">
                  <span style={{ color: "blue" }}>
                    VND{productDetail.pricePerDay}
                  </span>
                </Descriptions.Item>
              )}
              {productDetail.pricePerWeek != null && (
                <Descriptions.Item label="Giá (Thuê)/tuần">
                  <span style={{ color: "blue" }}>
                    VND{productDetail.pricePerWeek}
                  </span>
                </Descriptions.Item>
              )}
              {productDetail.pricePerMonth != null && (
                <Descriptions.Item label="Giá (Thuê)/tháng">
                  <span style={{ color: "blue" }}>
                    VND{productDetail.pricePerMonth}
                  </span>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Chất lượng">
                <Tag color="blue">
                  <strong>Chất lượng:</strong> {productDetail.quality}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Specifications">
                <ul style={{ paddingLeft: "20px" }}>
                  {productDetail.listProductSpecification.map((spec) => (
                    <li key={spec.productSpecificationID}>
                      {spec.specification}: {spec.details}
                    </li>
                  ))}
                </ul>
              </Descriptions.Item>
            </Descriptions>
          </div>
        ) : (
          <p>Đang tải chi tiết sản phẩm...</p>
        )}
      </Modal>
    </Layout>
  );
};

export default ProposalProductFollowJobBuy;
