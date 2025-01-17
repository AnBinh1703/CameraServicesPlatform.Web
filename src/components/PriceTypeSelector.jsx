import React from "react";
import { Form, Checkbox, InputNumber, Row, Col } from "antd"; // Update import to include InputNumber

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
                { type: "number", min: 1000, message: "Giá theo giờ phải lớn hơn hoặc bằng 1.000" },
              ]}
            >
              <InputNumber
                className="w-full"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                placeholder="Nhập giá theo giờ"
                addonAfter="VNĐ"
                size="large"
              />
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
                { type: "number", min: 1000, message: "Giá theo ngày phải lớn hơn hoặc bằng 1.000" },
              ]}
            >
              <InputNumber
                className="w-full"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                placeholder="Nhập giá theo ngày"
                addonAfter="VNĐ"
                size="large"
              />
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
                { type: "number", min: 1000, message: "Giá theo tuần phải lớn hơn hoặc bằng 1.000" },
              ]}
            >
              <InputNumber
                className="w-full"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                placeholder="Nhập giá theo tuần"
                addonAfter="VNĐ"
                size="large"
              />
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
                { type: "number", min: 1000, message: "Giá theo tháng phải lớn hơn hoặc bằng 1.000" },
              ]}
            >
              <InputNumber
                className="w-full"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                placeholder="Nhập giá theo tháng"
                addonAfter="VNĐ"
                size="large"
              />
            </Form.Item>
          </Col>
        )}
      </Row>
    </>
  );
};

export default PriceTypeSelector;
