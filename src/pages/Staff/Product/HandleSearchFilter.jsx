import { Input, Select, Row, Col, Card, Badge } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";

const { Option } = Select;

const BrandEnum = {
  Canon: 0,
  Nikon: 1,
  Sony: 2,
  Fujifilm: 3,
  Olympus: 4,
  Panasonic: 5,
  Leica: 6,
  Pentax: 7,
  Hasselblad: 8,
  Sigma: 9,
};

const HandleSearchFilter = ({ products = [], onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState([0, Infinity]);

  useEffect(() => {
    if (!products) return;

    const filteredProducts = products.filter((product) => {
      const matchesSearchTerm = product.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === "" || product.status === Number(selectedStatus);
      const matchesBrand =
        selectedBrand === "" || product.brand === Number(selectedBrand);
      const matchesPrice =
        product.priceBuy >= priceRange[0] && product.priceBuy <= priceRange[1];

      return matchesSearchTerm && matchesStatus && matchesBrand && matchesPrice;
    });

    onFilter(filteredProducts);
  }, [
    searchTerm,
    selectedStatus,
    selectedBrand,
    priceRange,
    products,
    onFilter,
  ]);

  return (
    <Card className="filter-card" style={{ marginBottom: 24, borderRadius: 8 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={8} lg={8}>
          <Input
            placeholder="Tìm kiếm sản phẩm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Select
            placeholder="Chọn Trạng Thái"
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value)}
            style={{ width: "100%" }}
            allowClear
          >
            <Option value="">Tất Cả Trạng Thái</Option>
            <Option value="0">
              <Badge status="success" text="Đang Bán" />
            </Option>
            <Option value="1">
              <Badge status="processing" text="Cho Thuê" />
            </Option>
            <Option value="2">
              <Badge status="warning" text="Đã Cho Thuê" />
            </Option>
            <Option value="3">
              <Badge status="default" text="Đã Bán" />
            </Option>
             
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Select
            placeholder="Chọn Thương Hiệu"
            value={selectedBrand}
            onChange={(value) => setSelectedBrand(value)}
            style={{ width: "100%" }}
            allowClear
          >
            <Option value="">Tất Cả Thương Hiệu</Option>
            {Object.keys(BrandEnum).map((brand) => (
              <Option key={BrandEnum[brand]} value={BrandEnum[brand]}>
                {brand}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
    </Card>
  );
};

export default HandleSearchFilter;
