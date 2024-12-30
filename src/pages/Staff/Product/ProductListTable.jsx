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
  const { id } = useParams();

  const { products, total, categoryNames } = useFetchProducts(
    pageIndex,
    pageSize
  );
  const [loading, setLoading] = useState(false);

  const handleView = async (productId) => {
    setLoading(true);
    try {
      const product = await getProductById(productId);
      if (product) {
        setSelectedProduct(product);
        setIsModalVisible(true);
      } else {
        message.error("Không thể tải thông tin sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin sản phẩm:", error);
      message.error("Lỗi khi tải thông tin sản phẩm");
    }
    setLoading(false);
  };

  const handleExpandDescription = (productId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này không?"
    );
    if (confirmed) {
      try {
        await deleteProduct(productId);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.productID !== productId)
        );
        message.success("Xóa sản phẩm thành công");
      } catch (error) {
        message.error("Không thể xóa sản phẩm");
      }
    }
  };

  const handleFilter = (filteredProducts) => {
    setFilteredProducts(filteredProducts);
  };

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
        handleDelete={handleDelete}
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
        onClose={() => setIsModalVisible(false)}
      />
    </Spin>
  );
};

export default ProductListTable;
