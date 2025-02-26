import {
  EditOutlined,
  EyeOutlined,
  FileAddOutlined,
  PlusOutlined,
} from "@ant-design/icons"; // Added FileAddOutlined import
import {
  Button,
  Input,
  message,
  Modal,
  Pagination,
  Select,
  Typography,
} from "antd"; // Import Select component
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { getCategoryById } from "../../../api/categoryApi"; // Import the API for fetching category by ID
import { createContractTemplate } from "../../../api/contractTemplateApi"; // Add this import
import {
  getProductById,
  getProductBySupplierId,
} from "../../../api/productApi";
import ContractTemplateFields from "../../../components/ContractTemplateFields"; // **Added Import**
import { getBrandName } from "../../../utils/constant";
import CreateProduct from "./CreateProduct";
import DetailProduct from "./DetailProduct";
import EditProductForm from "./EditProductForm";

const { Title } = Typography;
const { Option } = Select;

const ProductListBySupplier = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [categoryNames, setCategoryNames] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const { id } = useParams();
  const itemsPerPage = 20; // Define items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [sortField, setSortField] = useState("createdAt"); // State for sorting field
  const [sortOrder, setSortOrder] = useState("desc"); // State for sorting order
  const [isContractModalVisible, setIsContractModalVisible] = useState(false); // **Added State for Contract Modal**
  const [selectedRentableProducts, setSelectedRentableProducts] = useState([]); // **Added State for Selected Products**

  const [isSingleContractModalVisible, setIsSingleContractModalVisible] =
    useState(false); // **Added State for Single Contract Modal**
  const [selectedContractProduct, setSelectedContractProduct] = useState(null); // **Added State for Selected Product**

  // **Define handleCloseSingleContractModal Early in the Component**
  const handleCloseSingleContractModal = () => {
    setIsSingleContractModalVisible(false);
    setSelectedContractProduct(null);
  };

  // Fetch supplier ID on component mount
  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user.id) {
        try {
          const response = await getSupplierIdByAccountId(user.id);
          if (response?.isSuccess) {
            setSupplierId(response.result);
          } else {
            message.error("Không thể lấy ID nhà cung cấp.");
          }
        } catch (error) {
          message.error("Lỗi khi lấy ID nhà cung cấp.");
        }
      }
    };

    fetchSupplierId();
  }, [user]);

  // Fetch products based on supplier ID, page index, and page size
  const fetchProducts = async (page = 1) => {
    if (!supplierId) return;

    setLoading(true);
    try {
      const result = await getProductBySupplierId(
        supplierId,
        page,
        itemsPerPage,
        sortField,
        sortOrder // Pass sortField and sortOrder to the API
      );
      if (Array.isArray(result)) {
        setProducts(result);
        setTotalItems(result.totalCount || 0); // Ensure totalItems is set correctly

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
        message.error("Không thể lấy sản phẩm.");
        setProducts([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩẩm:", error);
      setProducts([]);
      message.error("Lỗi khi lấy sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supplierId) {
      fetchProducts(currentPage);
    }
  }, [supplierId, currentPage, sortField, sortOrder]);

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

  const handleView = async (productID) => {
    setLoading(true);
    try {
      const response = await getProductById(productID);
      console.log("Product View Response:", response);

      // Handle both response formats
      const productData = response?.result || response;

      if (!productData) {
        throw new Error("No product data found");
      }

      setSelectedProduct(productData); // Set the full product data
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
      message.error(`Không thể lấy chi tiết sản phẩm: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedProduct(null); // Clear selected product
  };

  const handleCreateProduct = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSortFieldChange = (value) => {
    setSortField(value);
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
  };

  // **Ensure handleCreateContract Passes the Correct Product**
  const handleCreateContract = (product) => {
    if (product && product.productID) {
      // **Add Validation**
      setSelectedContractProduct(product);
      setIsSingleContractModalVisible(true);
    } else {
      message.error("Sản phẩm không hợp lệ.");
    }
  };

  // **Added Function to Handle Opening Bulk Contract Template Modal**
  const handleOpenContractModal = () => {
    const rentableProducts = products.filter((product) => product.status === 1);
    if (rentableProducts.length === 0) {
      message.warning(
        "Không có sản phẩm nào có trạng thái 'Cho thuê' để tạo mẫu hợp đồng."
      );
      return;
    }
    setSelectedRentableProducts(rentableProducts);
    setIsContractModalVisible(true);
  };

  // **Added Function to Handle Closing Bulk Contract Template Modal**
  const handleCloseContractModal = () => {
    setIsContractModalVisible(false);
    setSelectedRentableProducts([]);
  };

  const filteredProducts = Array.isArray(products)
    ? products
        .filter((product) =>
          product.productName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
          if (sortOrder === "asc") {
            return a[sortField] > b[sortField] ? 1 : -1;
          } else {
            return a[sortField] < b[sortField] ? 1 : -1;
          }
        })
    : [];

  const getStatusClass = (status) => {
    switch (status) {
      case 0:
        return "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"; // For Sale
      case 1:
        return "bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"; // For Rent
      case 2:
        return "bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300"; // Rented Out
      case 3:
        return "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"; // Sold
      case 4:
        return "bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"; // Unavailable
      default:
        return "bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"; // Default case
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const renderPriceRent = (priceRent, record) => {
    const priceLabels = {
      hour: record.pricePerHour,
      day: record.pricePerDay,
      week: record.pricePerWeek,
      month: record.pricePerMonth,
    };

    return (
      <div>
        {record.pricePerHour !== null && record.pricePerHour !== 0 && (
          <span style={{ marginRight: "10px" }}>
            <strong>Giờ:</strong> {formatCurrency(record.pricePerHour)}
          </span>
        )}
        {record.pricePerDay !== null && record.pricePerDay !== 0 && (
          <span style={{ marginRight: "10px" }}>
            <strong>Ngày:</strong> {formatCurrency(record.pricePerDay)}
          </span>
        )}
        {record.pricePerWeek !== null && record.pricePerWeek !== 0 && (
          <span style={{ marginRight: "10px" }}>
            <strong>Tuần:</strong> {formatCurrency(record.pricePerWeek)}
          </span>
        )}
        {record.pricePerMonth !== null && record.pricePerMonth !== 0 && (
          <span style={{ marginRight: "10px" }}>
            <strong>Tháng:</strong> {formatCurrency(record.pricePerMonth)}
          </span>
        )}
        {Object.values(priceLabels).every(
          (val) => val === null || val === 0
        ) && <span>--</span>}
      </div>
    );
  };

  const renderPriceBuy = (priceBuy) => (
    <span
      style={{
        fontWeight: "bold",
        color: priceBuy !== null && priceBuy !== 0 ? "#007bff" : "#888",
      }}
    >
      {priceBuy !== null && priceBuy !== 0 ? formatCurrency(priceBuy) : "--"}
    </span>
  );

  const renderProductCard = (product) => (
    <a
      href="#"
      className="relative flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100"
      key={product.productID} // **Ensure Unique Key**
    >
      <img
        className="object-cover w-full rounded-t-lg h-40 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
        src={
          product.listImage && product.listImage.length > 0
            ? product.listImage[0].image
            : "https://via.placeholder.com/100?text=No+Image"
        }
        alt={product.productName}
      />
      <div className="flex flex-col justify-between p-2 leading-normal">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          {product.productName}
        </h5>
        <p className="mb-3 font-normal text-gray-700">
          <strong>Danh mục: </strong> {categoryNames[product.categoryID]}
        </p>
        <p className="mb-3 font-normal text-gray-700">
          <strong>Thương hiệu:</strong>
          {getBrandName(product.brand)}
        </p>
        <p className="mb-3 font-normal text-gray-700">
          <strong>Giá: </strong>
          {renderPriceBuy(product.priceBuy)}
        </p>
        <p className="mb-3 font-normal text-gray-700">
          <strong>Giá thuê: </strong>
          {renderPriceRent(product.pricePerHour, product)}
        </p>

        <p className="mb-3 font-normal text-gray-700">
          <strong>Chất lượng: </strong>
          {product.quality}
        </p>
        <p className="mb-3 font-normal text-gray-700">
          {product.rating ? (
            <span>
              {"★".repeat(product.rating)}
              {"☆".repeat(5 - product.rating)}
            </span>
          ) : (
            " "
          )}
        </p>
        <div className="flex mt-4 md:mt-6">
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => handleView(product.productID)}
            style={{
              marginRight: "8px",
              backgroundColor: "#1890ff",
              color: "#fff",
              borderColor: "#1890ff",
            }}
          >
            Xem
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(product)}
            style={{
              marginRight: "8px",
              backgroundColor: "#52c41a",
              color: "#fff",
              borderColor: "#52c41a",
            }}
          >
            Sửa
          </Button>
          {/* **Added Button for Creating Contract Template** */}
          {product.status === 1 && (
            <Button
              type="default"
              icon={<FileAddOutlined />}
              onClick={() => handleCreateContract(product)}
              style={{
                marginRight: "8px",
                backgroundColor: "#faad14",
                color: "#fff",
                borderColor: "#faad14",
              }}
            >
              Tạo Hợp Đồng
            </Button>
          )}
        </div>
      </div>
      <div
        className={`absolute top-0 left-0 m-2 p-1 ${getStatusClass(
          product.status
        )}`}
      >
        {product.status === 0 && "Đang bán"}
        {product.status === 1 && "Cho thuê"}
        {product.status === 2 && "Đã cho thuê"}
        {product.status === 3 && "Đã bán"}
        {product.status === 4 && "Không có sẵn"}
      </div>
    </a>
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Title level={2}>DANH SÁCH SẢN PHẨM</Title>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Input
          placeholder="Tìm kiếm sản phẩm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "200px", marginRight: "10px" }}
        />
        <Select
          value={sortField}
          onChange={handleSortFieldChange}
          style={{ width: "150px", marginRight: "10px" }}
        >
          <Option value="productName">Tên sản phẩm</Option>
          <Option value="priceBuy">Giá mua</Option>
          <Option value="pricePerDay">Giá thuê theo ngày</Option>
          <Option value="pricePerHour">Giá thuê theo giờ</Option>
          <Option value="pricePerMonth">Giá thuê theo tháng</Option>
          <Option value="status">Trạng thái</Option>
          <Option value="quality">Chất lượng</Option>
          <Option value="createdAt">Ngày tạo</Option>
        </Select>
        <Select
          value={sortOrder}
          onChange={handleSortOrderChange}
          style={{ width: "150px", marginRight: "10px" }}
        >
          <Option value="asc">Tăng dần</Option>
          <Option value="desc">Giảm dần</Option>
        </Select>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateProduct}
          style={{
            backgroundColor: "#52c41a",
            color: "#fff",
            borderColor: "#52c41a",
            marginRight: "10px", // **Added Margin for Spacing**
          }}
        >
          Thêm sản phẩm
        </Button>
      </div>

      {loading ? (
        <p>Đang tải sản phẩm...</p>
      ) : (
        <div>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => renderProductCard(product))}
            </div>
          ) : (
            <p>Không có sản phẩm nào.</p>
          )}
        </div>
      )}

      <div className="flex justify-center">
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={totalItems}
          onChange={handlePageChange}
        />
      </div>

      {/* Create Product Modal */}
      <Modal
        title="Tạo sản phẩm"
        visible={isCreateModalVisible}
        onCancel={handleCreateModalClose}
        footer={null}
      >
        <CreateProduct onClose={handleCreateModalClose} />
      </Modal>

      {/* Edit Product Modal */}
      {isEditModalVisible && (
        <EditProductForm
          visible={isEditModalVisible}
          onClose={handleModalClose}
          product={selectedProduct}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
      <Modal
        title="Chi tiết sản phẩm"
        visible={isModalVisible}
        onCancel={handleClose}
        footer={null}
      >
        <DetailProduct
          product={selectedProduct}
          loading={loading}
          onClose={handleClose}
        />
      </Modal>

      {/* Bulk Contract Template Modal */}
      <Modal
        title="Tạo Mẫu Hợp Đồng"
        visible={isContractModalVisible}
        onCancel={handleCloseContractModal}
        footer={null}
        width={800}
      >
        <ContractTemplateFields
          onSubmit={async (dataArray) => {
            try {
              for (const data of dataArray) {
                await createContractTemplate(data); // Assuming createContractTemplate is imported
              }
              message.success("Mẫu hợp đồng đã được tạo thành công.");
              handleCloseContractModal();
            } catch (error) {
              console.error("Error creating contract templates:", error);
              message.error("Có lỗi xảy ra khi tạo mẫu hợp đồng.");
            }
          }}
          products={selectedRentableProducts}
          productIDs={selectedRentableProducts.map(
            (product) => product.productID
          )} // **Added Prop**
        />
      </Modal>

      {/* Single Contract Template Modal */}
      <Modal
        title={`Tạo Mẫu Hợp Đồng cho ${
          selectedContractProduct?.productName || ""
        }`}
        visible={isSingleContractModalVisible}
        onCancel={handleCloseSingleContractModal}
        footer={null}
        width={800}
      >
        {selectedContractProduct && (
          <ContractTemplateFields
            onSubmit={(result) => {
              if (result) {
                message.success("Mẫu hợp đồng đã được tạo thành công.");
                handleCloseSingleContractModal();
              }
            }}
            products={[selectedContractProduct]}
            productID={selectedContractProduct.productID}
          />
        )}
      </Modal>
    </div>
  );
};

export default ProductListBySupplier;
