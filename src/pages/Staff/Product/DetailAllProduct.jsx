import { Col, Image, message, Row, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../../api/productApi"; // Adjust path as necessary
import { getBrandName, getProductStatusEnum } from "../../../utils/constant";

const DetailProduct = ({ product, loading, onClose }) => {
  const { id } = useParams(); // Assume `id` is passed via URL parameters
  const [productDetails, setProductDetails] = useState(product);
  const [isLoading, setIsLoading] = useState(loading);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const fetchedProduct = await getProductById(id);
        setProductDetails(fetchedProduct);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product details. Please try again later.");
        message.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (!product) {
      fetchProduct();
    }
  }, [id, product]);

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!productDetails) {
    return <div>Đang tải thông tin sản phẩm...</div>; // Temporary loading message
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
  } = productDetails;

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
    },
  ];

  const data = [
    { key: "1", field: "Mã Sản Phẩm", value: productID },
    { key: "2", field: "Số Serial", value: serialNumber },
    { key: "3", field: "Mã Nhà Cung Cấp", value: supplierID },
    { key: "4", field: "Tên Loại Hàng", value: categoryID },
    { key: "5", field: "Tên Sản Phẩm", value: productName },
    { key: "6", field: "Mô Tả", value: productDescription },
    {
      key: "7",
      field: "Giá Đặt Cọc",
      value: depositProduct !== null ? `${depositProduct} VND` : "Không có",
    },

    {
      key: "8",
      field: "Giá Bán",
      value: priceBuy !== null ? `${priceBuy} VND` : "Không có",
    },
    {
      key: "9",
      field: "Giá Theo Giờ",
      value: pricePerHour ? `${pricePerHour} VND` : "Không có",
    },
    {
      key: "10",
      field: "Giá Theo Ngày",
      value: pricePerDay ? `${pricePerDay} VND` : "Không có",
    },
    {
      key: "11",
      field: "Giá Theo Tuần",
      value: pricePerWeek ? `${pricePerWeek} VND` : "Không có",
    },
    {
      key: "12",
      field: "Giá Theo Tháng",
      value: pricePerMonth ? `${pricePerMonth} VND` : "Không có",
    },
    { key: "13", field: "Thương Hiệu", value: getBrandName(brand) },
    { key: "14", field: "Chất Lượng", value: quality },
    { key: "15", field: "Trạng Thái", value: getProductStatusEnum(status) },
    { key: "16", field: "Đánh Giá", value: rating },
    {
      key: "17",
      field: "Ngày Tạo",
      value: new Date(createdAt).toLocaleString(),
    },
    {
      key: "18",
      field: "Ngày Cập Nhật",
      value: new Date(updatedAt).toLocaleString(),
    },
    { key: "19", field: "Hình Ảnh", value: renderImages() },
  ];

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
      dataIndex: "value",
      key: "value",
    },
  ];

  return (
    <div className="product-detail-container">
      <Row justify="space-between" align="middle">
        <Col>
          <h1>Chi Tiết Sản Phẩm</h1>
        </Col>
      </Row>
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
    </div>
  );
};

export default DetailProduct;
