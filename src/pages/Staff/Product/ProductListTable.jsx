import { message, Pagination, Spin, Typography } from "antd";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../../api/productApi";
import HandleSearchAndFilter from "./HandleSearchFilter";
import ProductDetailsModal from "./ProductDetailsModal";
import ProductTable from "./ProductTable";
import useFetchProducts from "./useFetchProducts";

const { Title } = Typography;

const ProductListTable = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const { products, total, categoryNames } = useFetchProducts(
    pageIndex,
    pageSize
  );

  // Update filteredProducts only when products or searchQuery changes
  const handleFilter = React.useCallback((filteredProducts) => {
    setFilteredProducts(filteredProducts);
  }, []);

  const handleView = React.useCallback(async (productId) => {
    console.log('handleView called with productId:', productId);
    setLoading(true);
    try {
      console.log('Fetching product data...');
      const response = await getProductById(productId);
      console.log('API Response:', response);
      
      if (response && response.productID) {  // Check for direct product data
        console.log('Setting product data:', response);
        setSelectedProduct(response);  // Set the response directly
        setIsModalVisible(true);
        console.log('Modal visibility set to true');
      } else {
        console.log('No product data in response');
        message.error("Không thể tải thông tin sản phẩm");
      }
    } catch (error) {
      console.error("Error details:", error);
      message.error("Lỗi khi tải thông tin sản phẩm");
    } finally {
      console.log('Loading finished');
      setLoading(false);
    }
  }, []);

  const handleExpandDescription = React.useCallback((productId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  }, []);

  // Reset filtered products when products change
  React.useEffect(() => {
    setFilteredProducts([]);
  }, [products]);

  return (
    <Spin spinning={loading}>
      <Title level={2}>Danh Sách Sản Phẩm</Title>
      <HandleSearchAndFilter
        products={products}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFilter={handleFilter}
      />
      <ProductTable
        products={filteredProducts.length > 0 ? filteredProducts : products}
        categoryNames={categoryNames}
        expandedDescriptions={expandedDescriptions}
        handleExpandDescription={handleExpandDescription}
        handleView={handleView}
      />
      <Pagination
        current={pageIndex}
        pageSize={pageSize}
        total={total}
        onChange={(page, pageSize) => {
          setPageIndex(page);
          setPageSize(pageSize);
        }}
        style={{ marginTop: "16px", textAlign: "center" }}
      />
      <ProductDetailsModal
        visible={isModalVisible}
        product={selectedProduct}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedProduct(null);
        }}
      />
    </Spin>
  );
};

export default ProductListTable;
