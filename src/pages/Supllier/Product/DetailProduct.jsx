import { Image, message, Row, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { getCategoryById } from "../../../api/categoryApi";
import { getContractTemplateByProductId } from "../../../api/contractTemplateApi";
import { getProductById } from "../../../api/productApi";
import { getSupplierById } from "../../../api/supplierApi";

const DetailProduct = ({ product, loading, onClose }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(loading);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [contractTemplates, setContractTemplates] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!product?.productID) return;
      
      setIsLoading(true);
      try {
        const response = await getProductById(product.productID);
        console.log('Product Details Response:', response);
        
        // Handle both response formats
        const productData = response?.result || response;
        
        if (productData) {
          setProductDetails(productData);
          
          // Fetch category name if needed
          if (productData.categoryID) {
            const categoryResponse = await getCategoryById(productData.categoryID);
            if (categoryResponse?.result) {
              setCategoryName(categoryResponse.result.categoryName);
            }
          }
          
          // Fetch supplier name if needed
          if (productData.supplierID) {
            const supplierResponse = await getSupplierById(productData.supplierID);
            if (supplierResponse?.result?.items?.[0]) {
              setSupplierName(supplierResponse.result.items[0].supplierName);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        message.error('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [product]); // Depend on product prop changes

  useEffect(() => {
    const fetchContractTemplates = async () => {
      try {
        console.log("Product object:", product);
        console.log(
          "Fetching contract templates for product ID:",
          product?.productID
        );
        const templates = await getContractTemplateByProductId(
          product?.productID
        );
        console.log("Fetched contract templates:", templates);
        setContractTemplates(templates);
      } catch (error) {
        console.error("Failed to fetch contract templates:", error);
        message.error(
          "Failed to load contract templates. Please try again later."
        );
      }
    };

    if (product?.productID) {
      fetchContractTemplates();
    }
  }, [product?.productID]);

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!productDetails && !isLoading) {
    return <div>No product details available</div>;
  }

  const {
    productID,
    serialNumber,
    supplierID,
    categoryID,
    productName,
    productDescription,
    depositProduct,
    priceBuy,
    pricePerHour,
    pricePerDay,
    pricePerWeek,
    pricePerMonth,
    brand,
    quality,
    status,
    rating,
    createdAt,
    updatedAt,
    listImage,
    listVoucher,
    listProductSpecification,
    originalPrice,
    countRent,
    category,
  } = productDetails || {};

  const renderImages = () => {
    if (listImage && listImage.length > 0) {
      return listImage.map((image, index) => (
        <Image
          key={index}
          src={image.image}
          alt={`${productName} - ${index + 1}`}
          width={100}
          style={{ margin: "5px" }}
        />
      ));
    }
    return <span>Không có hình ảnh</span>;
  };

  const columns = [
    {
      title: "Trường",
      dataIndex: "field",
      key: "field",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Giá Trị",
      dataIndex: "value",
      key: "value",
      render: (text, record) =>
        typeof text === "number" &&
        record.field !== "Đánh Giá" &&
        record.field !== "Số Lần Thuê"
          ? new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(text)
          : text,
    },
  ];

  const data = [
    { key: "1", field: "Mã Sản Phẩm", value: productID },
    { key: "2", field: "Số Serial", value: serialNumber },
    { key: "3", field: "Mã Nhà Cung C Cấp", value: supplierName },
    { key: "4", field: "Tên Loại Hàng", value: categoryName },
    { key: "5", field: "Tên Sản Phẩm", value: productName },
    { key: "6", field: "Mô Tả", value: productDescription },
    {
      key: "7",
      field: "Giá Đặt Cọc",
      value: depositProduct !== null ? depositProduct : null,
    },
    {
      key: "8",
      field: "Giá Bán",
      value: priceBuy !== null ? priceBuy : null,
    },
    {
      key: "9",
      field: "Giá Theo Giờ",
      value: pricePerHour ? pricePerHour : null,
    },
    {
      key: "10",
      field: "Giá Theo Ngày",
      value: pricePerDay ? pricePerDay : null,
    },
    {
      key: "11",
      field: "Giá Theo Tuần",
      value: pricePerWeek ? pricePerWeek : null,
    },
    {
      key: "12",
      field: "Giá Theo Tháng",
      value: pricePerMonth ? pricePerMonth : null,
    },
    {
      key: "20",
      field: "Giá Gốc",
      value: originalPrice !== null ? originalPrice : null,
    },
    { key: "21", field: "Số Lần Thuê", value: countRent },
    { key: "22", field: "Đánh Giá", value: rating },
    { key: "23", field: "Hình ảnh", value: renderImages() },
  ].filter((item) => item.value !== null);

  const voucherColumns = [
    {
      title: "Mã Voucher",
      dataIndex: "vourcherID",
      key: "vourcherID",
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Ngày Cập Nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  const specificationColumns = [
    {
      title: "Thông Số Kỹ Thuật",
      dataIndex: "specification",
      key: "specification",
    },
    {
      title: "Giá Trị",
      dataIndex: "details",
      key: "details",
    },
  ];

  const contractTemplateColumns = [
    {
      title: "Tên Mẫu",
      dataIndex: "templateName",
      key: "templateName",
    },
    {
      title: "Điều Khoản Hợp Đồng",
      dataIndex: "contractTerms",
      key: "contractTerms",
    },
    {
      title: "Chi Tiết Mẫu",
      dataIndex: "templateDetails",
      key: "templateDetails",
    },
    {
      title: "Chính Sách Phạt",
      dataIndex: "penaltyPolicy",
      key: "penaltyPolicy",
    },
  ];

  return (
    <div className="product-detail-container">
      <Row justify="space-between" align="middle"></Row>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        showHeader={false}
        bordered
      />
      <h2>Vouchers</h2>
      <Table
        columns={voucherColumns}
        dataSource={listVoucher}
        pagination={false}
        bordered
      />
      <h2>Thông Số Kỹ Thuật</h2>
      <Table
        columns={specificationColumns}
        dataSource={listProductSpecification}
        pagination={false}
        bordered
      />
      <h2>Mẫu Hợp Đồng</h2>
      <Table
        columns={contractTemplateColumns}
        dataSource={contractTemplates}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default DetailProduct;
