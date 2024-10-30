import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Input, message, Pagination, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { getCategoryById } from "../../../api/categoryApi"; // Import the API for fetching category by ID
import { deleteProduct, getProductBySupplierId } from "../../../api/productApi";
import { getBrandName, getProductStatusEnum } from "../../../utils/constant";
import EditProductForm from "./EditProductForm";

const { Title } = Typography;

const ProductListBySupplier = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [categoryNames, setCategoryNames] = useState({}); // Store category names keyed by ID

  // Fetch supplier ID on component mount
  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user.id) {
        try {
          const response = await getSupplierIdByAccountId(user.id);
          if (response?.isSuccess) {
            setSupplierId(response.result);
          } else {
            message.error("Failed to fetch supplier ID.");
          }
        } catch (error) {
          message.error("Error fetching supplier ID.");
        }
      }
    };

    fetchSupplierId();
  }, [user]);

  // Fetch products based on supplier ID, page index, and page size
  const fetchProducts = async () => {
    if (!supplierId) return;

    setLoading(true);
    try {
      const result = await getProductBySupplierId(
        supplierId,
        pageIndex,
        pageSize
      );
      if (Array.isArray(result)) {
        setProducts(result);
        setTotal(result.totalCount || 0);

        // Fetch category names for each product
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
        await Promise.all(categoryPromises); // Wait for all category fetches to complete
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
    if (supplierId) {
      fetchProducts();
    }
  }, [supplierId, pageIndex, pageSize]);

  // Handle product deletion
  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmed) {
      try {
        await deleteProduct(productId);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.productID !== productId)
        );
        message.success("Product deleted successfully.");
      } catch (error) {
        message.error("Failed to delete product.");
      }
    }
  };

  // Handle product edit modal visibility and product update
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditModalVisible(true);
  };

  const handleUpdateSuccess = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.productID === updatedProduct.productID
          ? updatedProduct
          : product
      )
    );
  };

  const handleModalClose = () => {
    setIsEditModalVisible(false);
    setSelectedProduct(null);
  };

  // Search and filter products
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const getPriceLabelAndStyle = (price) => {
    if (price < priceThresholds.low) {
      return { color: "green" };
    } else if (price < priceThresholds.medium) {
      return { color: "orange" };
    } else {
      return { color: "red" };
    }
  };

  const priceThresholds = {
    low: 10000,
    medium: 50000,
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 0:
        return "text-green-500 text-sm font-bold"; // For Sale
      case 1:
        return "text-blue-500 text-sm font-bold"; // For Rent
      case 2:
        return "text-orange-500 text-sm font-bold"; // Rented Out
      case 3:
        return "text-red-500 text-sm font-bold"; // Sold
      case 4:
        return "text-gray-500 text-sm font-bold"; // Unavailable
      default:
        return "text-gray-400 text-sm font-bold"; // Default case
    }
  };

  const columns = [
    {
      title: "Product ID",
      dataIndex: "productID",
      sorter: (a, b) => a.productID - b.productID,
    },
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      sorter: (a, b) => a.serialNumber.localeCompare(b.serialNumber),
    },
    {
      title: "Supplier ID",
      dataIndex: "supplierID",
      sorter: (a, b) => a.supplierID - b.supplierID,
    },
    {
      title: "Category Name",
      dataIndex: "categoryID",
      render: (categoryID) => categoryNames[categoryID] || "Unknown",
      sorter: (a, b) =>
        (categoryNames[a.categoryID] || "").localeCompare(
          categoryNames[b.categoryID] || ""
        ),
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },
    {
      title: "Description",
      dataIndex: "productDescription",
    },
    {
      title: "Giá (Thuê)",
      dataIndex: "priceRent",
      render: (priceRent, record) => {
        const priceRentLabel = getPriceLabelAndStyle(priceRent);
        const pricePerHourLabel = getPriceLabelAndStyle(record.pricePerHour);
        const pricePerDayLabel = getPriceLabelAndStyle(record.pricePerDay);
        const pricePerWeekLabel = getPriceLabelAndStyle(record.pricePerWeek);
        const pricePerMonthLabel = getPriceLabelAndStyle(record.pricePerMonth);

        return (
          <div>
            {priceRent !== null && (
              <span style={{ color: priceRentLabel.color }}>
                {priceRent} VND - {priceRentLabel.label}
              </span>
            )}
            {record.pricePerHour !== null && (
              <div style={{ color: pricePerHourLabel.color }}>
                (Hourly: {record.pricePerHour} VND - {pricePerHourLabel.label})
              </div>
            )}
            {record.pricePerDay !== null && (
              <div style={{ color: pricePerDayLabel.color }}>
                (Daily: {record.pricePerDay} VND - {pricePerDayLabel.label})
              </div>
            )}
            {record.pricePerWeek !== null && (
              <div style={{ color: pricePerWeekLabel.color }}>
                (Weekly: {record.pricePerWeek} VND - {pricePerWeekLabel.label})
              </div>
            )}
            {record.pricePerMonth !== null && (
              <div style={{ color: pricePerMonthLabel.color }}>
                (Monthly: {record.pricePerMonth} VND -{" "}
                {pricePerMonthLabel.label})
              </div>
            )}
            {priceRent === null &&
              record.pricePerHour === null &&
              record.pricePerDay === null &&
              record.pricePerWeek === null &&
              record.pricePerMonth === null && (
                <span>N/A</span> // Show 'N/A' if all price options are null
              )}
          </div>
        );
      },
      sorter: (a, b) => a.priceRent - b.priceRent,
    },
    {
      title: "Giá (Bán)",
      dataIndex: "priceBuy",
      render: (priceBuy) => (
        <span
          style={{
            fontWeight: "bold",
            color: priceBuy !== null ? "#007bff" : "#888",
          }}
        >
          {priceBuy !== null ? `${priceBuy} VND` : "N/A"}
        </span>
      ),
      sorter: (a, b) => a.priceBuy - b.priceBuy,
    },

    {
      title: "Giá (Bán)",
      dataIndex: "priceBuy",
      render: (priceBuy) => `${priceBuy} VND`,
      sorter: (a, b) => a.priceBuy - b.priceBuy,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      render: (brand) => getBrandName(brand),
      sorter: (a, b) =>
        getBrandName(a.brand).localeCompare(getBrandName(b.brand)),
    },
    {
      title: "Quality",
      dataIndex: "quality",
      sorter: (a, b) => a.quality.localeCompare(b.quality),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span className={getStatusClass(status)}>
          {getProductStatusEnum(status)}
        </span>
      ),
      sorter: (a, b) => a.status - b.status,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      render: (updatedAt) => new Date(updatedAt).toLocaleString(),
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
    },
    {
      title: "List of Images",
      dataIndex: "listImage",
      render: (listImage, record) => (
        <img
          src={
            listImage.length > 0
              ? listImage[0].image
              : "https://via.placeholder.com/100?text=No+Image"
          }
          alt={record.productName}
          width="100"
        />
      ),
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: "8px" }}
          ></Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.productID)}
          ></Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Product List</Title>

      {/* Search Box */}
      <Input
        placeholder="Search by product name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "20px", width: "300px" }}
      />

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div>
          {filteredProducts.length > 0 ? (
            <>
              <Table
                dataSource={filteredProducts}
                columns={columns}
                rowKey="productID"
                pagination={false}
                bordered
              />
              <Pagination
                total={filteredProducts.length}
                showSizeChanger
                onShowSizeChange={(current, size) => {
                  setPageSize(size);
                }}
                style={{ marginTop: "20px", textAlign: "center" }}
              />
            </>
          ) : (
            <p>No products available.</p>
          )}
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalVisible && (
        <EditProductForm
          visible={isEditModalVisible}
          onClose={handleModalClose}
          product={selectedProduct}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default ProductListBySupplier;
