import {
  ClockCircleOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Empty,
  Input,
  message,
  Pagination,
  Row,
  Select,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById } from "../../../api/categoryApi";
import { getProductBySupplierId } from "../../../api/productApi";
import { getProductStatusEnum } from "../../../utils/constant";
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const ProductCardViewOfSupplier = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryNames, setCategoryNames] = useState({});
  const [brandFilter, setBrandFilter] = useState(null);
  const { id } = useParams(); // This is the supplier ID from URL
  const navigate = useNavigate();

  const fetchProducts = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const result = await getProductBySupplierId(id, pageIndex, pageSize);
      if (Array.isArray(result)) {
        setProducts(result);
        setTotal(result.totalCount || 0);

        const categoryPromises = result.map(async (product) => {
          if (product.categoryID) {
            const categoryResponse = await getCategoryById(product.categoryID);
            if (categoryResponse?.isSuccess) {
              setCategoryNames((prev) => ({
                ...prev,
                [product.categoryID]: categoryResponse.result.categoryName,
              }));
            }
          }
        });
        await Promise.all(categoryPromises);
      } else {
        message.error("Unable to fetch products.");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      message.error("Error fetching products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProducts();
    }
  }, [id, pageIndex, pageSize]);

  const handleView = (productID) => {
    navigate(`/product/${productID}`);
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

  const handleBrandFilterChange = (value) => {
    setBrandFilter(value);
    setPageIndex(1);
  };

  const filteredProducts = products
    .filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) => (brandFilter ? product.brand === brandFilter : true));

  const startIndex = (pageIndex - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Input
            placeholder="Tìm kiếm theo tên sản phẩm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", maxWidth: 300 }}
            prefix={<SearchOutlined className="text-gray-400" />}
            className="rounded-md"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {paginatedProducts.length > 0 ? (
            <>
              <Row gutter={[16, 16]}>
                {paginatedProducts.map((product) => (
                  <Col key={product.productID} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      className="h-full flex flex-col justify-between overflow-hidden rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-lg"
                      cover={
                        <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                          <img
                            alt={product.productName}
                            src={
                              product.listImage && product.listImage.length > 0
                                ? product.listImage[0].image
                                : "https://via.placeholder.com/150?text=No+Image"
                            }
                            className="object-cover w-full h-48 transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      }
                    >
                      <div className="flex flex-col h-full">
                        <Title level={5} className="mb-2 text-lg font-medium">
                          {product.productName}
                        </Title>

                        <Paragraph
                          ellipsis={{ rows: 2 }}
                          className="text-gray-600 mb-4"
                        >
                          {product.productDescription}
                        </Paragraph>

                        <div className="space-y-2 text-sm text-gray-600">
                          {product.priceBuy && product.priceBuy !== 0 && (
                            <div className="flex items-center gap-2">
                              <DollarOutlined className="text-blue-500" />
                              <span>
                                Giá Bán:{" "}
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(product.priceBuy)}
                              </span>
                            </div>
                          )}

                          {product.depositProduct &&
                            product.depositProduct !== 0 && (
                              <div className="flex items-center gap-2">
                                <DollarOutlined className="text-red-500" />
                                <span>
                                  Đặt cọc:{" "}
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(product.depositProduct)}
                                </span>
                              </div>
                            )}

                          {product.pricePerHour &&
                            product.pricePerHour !== 0 && (
                              <div className="flex items-center gap-2">
                                <ClockCircleOutlined className="text-purple-500" />
                                <span>
                                  Thuê/giờ:{" "}
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(product.pricePerHour)}
                                </span>
                              </div>
                            )}

                          {product.pricePerDay && product.pricePerDay !== 0 && (
                            <div className="flex items-center gap-2">
                              <ClockCircleOutlined className="text-green-500" />
                              <span>
                                Thuê/ngày:{" "}
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(product.pricePerDay)}
                              </span>
                            </div>
                          )}

                          {product.pricePerWeek &&
                            product.pricePerWeek !== 0 && (
                              <div className="flex items-center gap-2">
                                <ClockCircleOutlined className="text-blue-500" />
                                <span>
                                  Thuê/tuần:{" "}
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(product.pricePerWeek)}
                                </span>
                              </div>
                            )}

                          {product.pricePerMonth &&
                            product.pricePerMonth !== 0 && (
                              <div className="flex items-center gap-2">
                                <ClockCircleOutlined className="text-yellow-500" />
                                <span>
                                  Thuê/tháng:{" "}
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(product.pricePerMonth)}
                                </span>
                              </div>
                            )}

                          {product.countRent !== undefined && (
                            <div className="flex items-center gap-2">
                              <ShoppingCartOutlined className="text-gray-500" />
                              <span>Đã thuê: {product.countRent} lần</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <InfoCircleOutlined className="text-gray-400" />
                            <span>
                              Trạng thái: {getProductStatusEnum(product.status)}
                            </span>
                          </div>
                        </div>

                        <Button
                          type="primary"
                          onClick={() => handleView(product.productID)}
                          className="mt-4 w-full bg-blue-500 hover:bg-blue-600"
                          icon={<InfoCircleOutlined />}
                        >
                          Xem Chi Tiết
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              <div className="mt-8 flex justify-center">
                <Pagination
                  current={pageIndex}
                  pageSize={pageSize}
                  total={filteredProducts.length}
                  showSizeChanger
                  onShowSizeChange={(current, size) => setPageSize(size)}
                  onChange={(page) => setPageIndex(page)}
                  className="bg-white px-4 py-2 rounded-lg shadow-sm"
                />
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg">
              <Empty description="Không có sản phẩm nào" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductCardViewOfSupplier;
