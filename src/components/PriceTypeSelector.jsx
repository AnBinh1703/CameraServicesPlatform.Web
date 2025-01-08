import React from "react";
import { Form, Checkbox, Input, Row, Col } from "antd"; // Added Row and Col

const PriceTypeSelector = ({ priceType, handlePriceTypeChange }) => {
  return (
    <>
      <Form.Item label="Chọn loại giá">
        <Checkbox.Group onChange={handlePriceTypeChange} value={priceType}>
          <Checkbox value="PricePerHour">Giá theo giờ</Checkbox>
          <Checkbox value="PricePerDay">Giá theo ngày</Checkbox>
          <Checkbox value="PricePerWeek">Giá theo tuần</Checkbox>
          <Checkbox value="PricePerMonth">Giá theo tháng</Checkbox>
        </Checkbox.Group>
      </Form.Item>

      <Row gutter={16}>
        {priceType.includes("PricePerHour") && (
          <Col span={12}>
            <Form.Item
              name="PricePerHour"
              label="Giá theo giờ"
              rules={[
                { required: true, message: "Vui lòng nhập giá theo giờ!" },
                { type: "number", transform: (value) => Number(value) },
              ]}
            >
              <Input type="number" placeholder="Nhập giá theo giờ" />
            </Form.Item>
          </Col>
        )}

        {priceType.includes("PricePerDay") && (
          <Col span={12}>
            <Form.Item
              name="PricePerDay"
              label="Giá theo ngày"
              rules={[
                { required: true, message: "Vui lòng nhập giá theo ngày!" },
                { type: "number", transform: (value) => Number(value) },
              ]}
            >
              <Input type="number" placeholder="Nhập giá theo ngày" />
            </Form.Item>
          </Col>
        )}
      </Row>

      <Row gutter={16}>
        {priceType.includes("PricePerWeek") && (
          <Col span={12}>
            <Form.Item
              name="PricePerWeek"
              label="Giá theo tuần"
              rules={[
                { required: true, message: "Vui lòng nhập giá theo tuần!" },
                { type: "number", transform: (value) => Number(value) },
              ]}
            >
              <Input type="number" placeholder="Nhập giá theo tuần" />
            </Form.Item>
          </Col>
        )}

        {priceType.includes("PricePerMonth") && (
          <Col span={12}>
            <Form.Item
              name="PricePerMonth"
              label="Giá theo tháng"
              rules={[
                { required: true, message: "Vui lòng nhập giá theo tháng!" },
                { type: "number", transform: (value) => Number(value) },
              ]}
            >
              <Input type="number" placeholder="Nhập giá theo tháng" />
            </Form.Item>
          </Col>
        )}
      </Row>
    </>
  );
};

export default PriceTypeSelector;
