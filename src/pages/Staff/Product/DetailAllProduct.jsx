import { Col, Divider, Image, Row, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getCategoryById } from "../../../api/categoryApi";
import { getSupplierById } from "../../../api/supplierApi";
import { getVoucherById } from "../../../api/voucherApi";
import { getBrandName, getProductStatusEnum } from "../../../utils/constant";

const { Title } = Typography;

const DetailAllProduct = ({ product, onClose }) => {
  if (!product) {
    return <div>Không có thông tin sản phẩm</div>;
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
  } = product;

  const [voucherDetails, setVoucherDetails] = useState({});
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [supplierDetails, setSupplierDetails] = useState(null);

  useEffect(() => {
    const fetchVoucherDetails = async () => {
      if (listVoucher && listVoucher.length > 0) {
        const details = {};
        for (const voucher of listVoucher) {
          const voucherData = await getVoucherById(voucher.vourcherID);
          if (voucherData) {
            details[voucher.vourcherID] = voucherData;
          }
        }
        setVoucherDetails(details);
      }
    };

    fetchVoucherDetails();
  }, [listVoucher]);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (categoryID) {
        const response = await getCategoryById(categoryID);
        if (response.isSuccess) {
          setCategoryDetails(response.result);
        }
      }
    };

    const fetchSupplierDetails = async () => {
      if (supplierID) {
        const response = await getSupplierById(supplierID);
        if (response.isSuccess && response.result.items && response.result.items.length > 0) {
          setSupplierDetails(response.result.items[0]);
        }
      }
    };

    fetchCategoryDetails();
    fetchSupplierDetails();
  }, [categoryID, supplierID]);

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

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "Không có";
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const data = [
    { key: "1", field: "Mã Sản Phẩm", value: productID },
    { key: "2", field: "Số Serial", value: serialNumber },
    {
      key: "3",
      field: "Nhà Cung Cấp",
      value: supplierDetails ? supplierDetails.supplierName : supplierID,
    },
    {
      key: "4",
      field: "Danh mục",
      value: categoryDetails ? categoryDetails.categoryName : categoryID,
    },
    { key: "5", field: "Tên Sản Phẩm", value: productName },
    { key: "6", field: "Mô Tả", value: productDescription },
    {
      key: "7",
      field: "Giá Đặt Cọc",
      value: formatCurrency(depositProduct),
    },
    {
      key: "8",
      field: "Giá Bán",
      value: formatCurrency(priceBuy),
    },
    {
      key: "9",
      field: "Giá Theo Giờ",
      value: formatCurrency(pricePerHour),
    },
    {
      key: "10",
      field: "Giá Theo Ngày",
      value: formatCurrency(pricePerDay),
    },
    {
      key: "11",
      field: "Giá Theo Tuần",
      value: formatCurrency(pricePerWeek),
    },
    {
      key: "12",
      field: "Giá Theo Tháng",
      value: formatCurrency(pricePerMonth),
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
      render: (vourcherID) => {
        const voucher = voucherDetails[vourcherID];
        return voucher ? (
          <div style={{ padding: "8px 0" }}>
            <div style={{ marginBottom: "4px" }}>
              <strong style={{ color: "#1890ff" }}>Mã: </strong>
              <span
                style={{
                  background: "#f0f2f5",
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}
              >
                {voucher.vourcherCode}
              </span>
            </div>
            <div>
              <strong style={{ color: "#1890ff" }}>Mô tả: </strong>
              <span>{voucher.description || "Không có mô tả"}</span>
            </div>
          </div>
        ) : (
          vourcherID
        );
      },
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

  return (
    <div className="product-detail-container" style={{ padding: "24px" }}>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "24px" }}
      >
        <Col>
          <Title level={2}>{product.productName}</Title>
        </Col>
      </Row>

      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          showHeader={false}
          bordered
          style={{ marginBottom: "32px" }}
        />

        <Divider />

        <div style={{ marginTop: "32px" }}>
          <Title level={3} style={{ marginBottom: "16px" }}>
            Vouchers
          </Title>
          <Table
            columns={voucherColumns}
            dataSource={listVoucher}
            pagination={false}
            bordered
            style={{ marginBottom: "32px" }}
          />
        </div>

        <Divider />

        <div style={{ marginTop: "32px" }}>
          <Title level={3} style={{ marginBottom: "16px" }}>
            Thông Số Kỹ Thuật
          </Title>
          <Table
            columns={specificationColumns}
            dataSource={listProductSpecification}
            pagination={false}
            bordered
          />
        </div>
      </div>

      <style jsx>{`
        .product-detail-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .ant-table-wrapper {
          background: #fff;
        }
        .ant-table-cell {
          padding: 12px 16px !important;
        }
        .ant-image {
          border-radius: 4px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default DetailAllProduct;
