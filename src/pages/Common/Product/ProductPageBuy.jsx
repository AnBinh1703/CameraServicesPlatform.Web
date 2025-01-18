import {
  AppstoreAddOutlined,
  CalendarOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  StarOutlined,
  TagOutlined,
  TeamOutlined,
} from "@ant-design/icons"; // Import Ant Design icons
import { Button, Card, Input, Layout, message, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { getCategoryById } from "../../../api/categoryApi";
import {
  getAllProduct,
  getProductById,
  getProductByName,
} from "../../../api/productApi";
import { getSupplierById } from "../../../api/supplierApi";
import { getBrandName, getProductStatusEnum } from "../../../utils/constant";

const { Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const commonStyles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f6f8fc 0%, #f0f2f5 100%)",
    padding: "32px 24px",
  },
  searchSection: {
    width: "80%",
    maxWidth: "1000px",
    margin: "0 auto 40px",
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  },
  card: {
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "none",
    background: "white",
  },
  priceTag: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "rgba(0, 0, 0, 0.75)",
    color: "white",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "bold",
    zIndex: 1,
  },
};

const ProductPageBuy = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const productData = await getAllProduct(1, 100);
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

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await getProductById(id);
      if (data) {
        setProducts([data]);
        setProducts([data]);
        const supplierData = await getSupplierById(data.supplierID);
        const categoryData = await getCategoryById(data.categoryID);

        if (
          supplierData &&
          supplierData.result &&
          supplierData.result.items.length > 0
        ) {
          const supplier = supplierData.result.items[0];
          setSupplierName(supplier.supplierName);
        }

        if (
          categoryData &&
          categoryData.result &&
          categoryData.result.items.length > 0
        ) {
          const category = categoryData.result.items[0];
          setCategoryName(category.categoryName);
        }
      }
    } catch (error) {
      message.error("An error occurred while loading the product.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    setLoading(true);
    setSearchTerm(value);
    try {
      const productData = await getProductByName(value, 1, 100100);
      if (productData) {
        setProducts(productData);
      } else {
        message.error("No products found.");
        setProducts([]);
      }
    } catch (error) {
      message.error("An error occurred while searching for products.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCategory("");
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
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  const availableProducts = products.filter(
    (product) => product.status === 0 && product.quantity != 0
  );

  return (
    <Layout>
      <Content style={commonStyles.pageWrapper}>
        <Title
          level={2}
          className="text-center mb-12 text-3xl font-bold text-gray-800"
        >
          <TagOutlined className="mr-3" />
          Sản Phẩm Bán
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
          <div className="flex flex-col items-center mt-16">
            <Spin size="large" />
            <p className="mt-4 text-lg text-gray-600">Đang tải sản phẩm...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {availableProducts.map((product) => (
              <Card
                key={product.productID}
                style={commonStyles.card}
                className="hover:-translate-y-2 hover:shadow-2xl"
                cover={
                  <div className="relative pt-[75%] overflow-hidden group">
                    <img
                      src={
                        product.listImage[0]?.image ||
                        "https://placehold.co/300x200"
                      }
                      alt={product.productName}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300" />
                    <div style={commonStyles.priceTag}>
                      {formatPrice(product.priceBuy)}
                    </div>
                  </div>
                }
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 line-clamp-2 hover:text-blue-600 transition-colors">
                    {product.productName}
                  </h3>

                  <div className="space-y-4">
                    {/* Description */}
                    <p className="text-gray-600">
                      {product.productDescription}
                    </p>

                    {/* Price */}
                    {product.priceBuy && (
                      <div className="text-center py-3 border-t border-b">
                        <div className="text-2xl font-bold text-green-600">
                          {formatPrice(product.priceBuy)}
                        </div>
                      </div>
                    )}

                    {/* Product Details */}
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Keep existing details with improved layout */}
                        <p className="font-semibold text-left">
                          <TagOutlined className="inline mr-1" />
                          Thương hiệu: {getBrandName(product.brand)}
                        </p>
                        <p className="font-semibold text-left">
                          <InfoCircleOutlined className="inline mr-1" />
                          Chất lượng: {product.quality}
                        </p>
                        <p className="font-semibold text-left">
                          <InfoCircleOutlined className="inline mr-1" />
                          Trạng thái:
                          <span className={getStatusColor(product.status)}>
                            {getProductStatusEnum(product.status)}
                          </span>
                        </p>
                        <p className="font-semibold text-left">
                          <StarOutlined className="inline mr-1" />
                          Đánh giá: {product.rating}
                        </p>
                      </div>

                      <div className="mt-3 space-y-1 text-gray-600">
                        {/* Keep existing additional info */}
                        <p className="font-semibold text-left">
                          <InfoCircleOutlined className="inline mr-1" />
                          Số Serial: {product.serialNumber}
                        </p>
                        <p className="text-left">
                          <TeamOutlined className="inline mr-1" />
                          <strong>Nhà cung cấp:</strong> {product.supplierName}
                        </p>
                        <p className="text-left">
                          <AppstoreAddOutlined className="inline mr-1" />
                          <strong>Danh mục:</strong> {product.categoryName}
                        </p>
                        <p className="font-semibold text-left">
                          <CalendarOutlined className="inline mr-1" />
                          Ngày tạo:{" "}
                          {new Date(product.createdAt).toLocaleString()}
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
        )}
      </Content>
    </Layout>
  );
};

export default ProductPageBuy;
