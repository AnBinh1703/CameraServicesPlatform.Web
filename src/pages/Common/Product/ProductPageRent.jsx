import {
  CalendarOutlined,
  DollarOutlined,
  EditOutlined,
  FolderOpenOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  ShopOutlined,
  StarOutlined,
  TagOutlined,
} from "@ant-design/icons"; // Import Ant Design icons
import {
  Button,
  Card,
  Input,
  Layout,
  message,
  Pagination,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { getCategoryById } from "../../../api/categoryApi";
import { getAllProduct, getProductByName } from "../../../api/productApi";
import { getSupplierById } from "../../../api/supplierApi";
import { getBrandName, getProductStatusEnum } from "../../../utils/constant";

const { Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const commonStyles = {
  pageWrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(145deg, #f6f8fc 0%, #f0f2f5 100%)',
    padding: '24px',
  },
  searchSection: {
    width: '70%',
    maxWidth: '800px',
    margin: '0 auto 32px',
  },
  card: {
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  },
  infoSection: {
    padding: '20px',
    borderTop: '1px solid #f0f0f0',
  }
};

const ProductPageRent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const pageSize = 20;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const productData = await getAllProduct(1, 20);
      if (productData) {
        const productsWithDetails = await Promise.all(
          productData.map(async (product) => {
            const supplierData = await getSupplierById(product.supplierID);
            const categoryData = await getCategoryById(product.categoryID);

            return {
              ...product,
              supplierName:
                supplierData?.result?.items?.[0]?.supplierName || "Unknown",
              categoryName: categoryData?.result?.categoryName || "Unknown",
            };
          })
        );
        setProducts(productsWithDetails);
      } else {
        message.error("Failed to load products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("An error occurred while fetching products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearch = async (value) => {
    setLoading(true);
    setSearchTerm(value);
    try {
      const productData = await getProductByName(value, 1, 20);
      if (productData) {
        const productsWithDetails = await Promise.all(
          productData.map(async (product) => {
            const supplierData = await getSupplierById(product.supplierID);
            const categoryData = await getCategoryById(product.categoryID);

            return {
              ...product,
              supplierName:
                supplierData?.result?.items?.[0]?.supplierName || "Unknown",
              categoryName:
                categoryData?.result?.items?.[0]?.categoryName || "Unknown",
            };
          })
        );
        setProducts(productsWithDetails);
      } else {
        message.error("No products found.");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      message.error("An error occurred while searching for products.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    loadProducts(); // Reload products when clearing search
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0: // AvailableSell
        return "text-green-500"; // Green
      case 1: // AvailableRent
        return "text-blue-500"; // Blue
      case 2: // Rented
        return "text-yellow-500"; // Yellow
      case 3: // Sold
        return "text-red-500"; // Red
      case 4: // DiscontinuedProduct
        return "text-gray-500"; // Gray
      default:
        return "text-black"; // Default color
    }
  };
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const availableProducts = products.filter((product) => product.status === 1);

  return (
    <Layout>
      <Content style={commonStyles.pageWrapper}>
        <Title level={2} className="text-center mb-8 text-2xl font-bold text-gray-800">
          Sản Phẩm Cho Thuê
        </Title>

        <div style={commonStyles.searchSection} className="flex gap-4">
          <Search
            placeholder="Tìm kiếm sản phẩm..."
            enterButton={<SearchOutlined />}
            size="large"
            value={searchTerm}
            onSearch={handleSearch}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleClearSearch}
            size="large"
            className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg"
          >
            Xóa Tìm Kiếm
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center mt-10">
            <Spin size="large" />
            <p className="mt-4 text-lg">Đang tải sản phẩm...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {availableProducts.map((product) => (
                <Card
                  key={product.productID}
                  style={commonStyles.card}
                  className="hover:-translate-y-1 hover:shadow-xl"
                  cover={
                    <div className="relative pt-[75%] overflow-hidden">
                      <img
                        src={product.listImage[0]?.image || "https://placehold.co/300x200"}
                        alt={product.productName}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  }
                >
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                      {product.productName}
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Description */}
                      <p className="text-gray-600">{product.productDescription}</p>

                      {/* Pricing Section */}
                      <div className="space-y-2 border-t border-b py-3">
                        {product.depositProduct && (
                          <div className="flex justify-between text-red-500">
                            <span>Giá Cọc:</span>
                            <span className="font-bold">{formatPrice(product.depositProduct)}</span>
                          </div>
                        )}
                        {[
                          { price: product.pricePerHour, label: 'giờ' },
                          { price: product.pricePerDay, label: 'ngày' },
                          { price: product.pricePerWeek, label: 'tuần' },
                          { price: product.pricePerMonth, label: 'tháng' },
                          { price: product.priceBuy, label: 'Giá mua' }
                        ].map(({ price, label }) => price && (
                          <div key={label} className="flex justify-between text-green-600">
                            <span>Giá {label}:</span>
                            <span className="font-bold">{formatPrice(price)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Product Details */}
                      <div className="space-y-2 text-sm">
                        {/* Keep all existing detail fields but with improved layout */}
                        <div className="grid grid-cols-2 gap-4">
                          <p><TagOutlined className="mr-2" />Thương hiệu: {getBrandName(product.brand)}</p>
                          <p><StarOutlined className="mr-2" />Đánh giá: {product.rating}</p>
                          <p><InfoCircleOutlined className="mr-2" />Chất lượng: {product.quality}</p>
                          <p className={getStatusColor(product.status)}>
                            <InfoCircleOutlined className="mr-2" />
                            {getProductStatusEnum(product.status)}
                          </p>
                        </div>
                        
                        {/* Additional Info */}
                        <div className="mt-3 space-y-1 text-gray-600">
                          <p className="text-left">
                            <ShopOutlined className="inline mr-1" />
                            <strong>Nhà cung cấp:</strong> {product.supplierName}
                          </p>
                          <p className="text-left">
                            <FolderOpenOutlined className="inline mr-1" />
                            <strong>Danh mục:</strong> {product.categoryName}
                          </p>
                          <p className="font-semibold text-left">
                            <CalendarOutlined className="inline mr-1" />
                            Ngày tạo: {new Date(product.createdAt).toLocaleString()}
                          </p>
                          <p className="font-semibold text-left">
                            <EditOutlined className="inline mr-1" />
                            Ngày cập nhật:
                            {new Date(product.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <Button
                        type="primary"
                        block
                        size="large"
                        onClick={() => navigate(`/product/${product.productID}`)}
                        className="mt-4 bg-blue-500 hover:bg-blue-600"
                      >
                        Xem Chi Tiết
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalProducts}
                onChange={onPageChange}
                className="bg-white p-4 rounded-lg shadow"
              />
            </div>
          </>
        )}
      </Content>
    </Layout>
  );
};

export default ProductPageRent;
