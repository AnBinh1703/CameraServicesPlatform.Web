import React from "react";
import { Button, Input, Space, Row, Col } from "antd"; // Added Row and Col

const SpecificationList = ({
  specifications,
  handleSpecificationChange,
  handleAddSpecification,
  handleRemoveSpecification,
}) => {
  return (
    <>
      {specifications.map((specification, index) => (
        <Row gutter={16} key={index} style={{ marginBottom: 8 }}>
          <Col span={10}>
            <Input
              value={specification.feature}
              onChange={(e) =>
                handleSpecificationChange(
                  { feature: e.target.value, description: specification.description },
                  index
                )
              }
              placeholder={`Đặc điểm ${index + 1}`}
            />
          </Col>
          <Col span={12}>
            <Input
              value={specification.description}
              onChange={(e) =>
                handleSpecificationChange(
                  { feature: specification.feature, description: e.target.value },
                  index
                )
              }
              placeholder={`Mô tả ${index + 1}`}
            />
          </Col>
          <Col span={2}>
            <Button
              type="danger"
              onClick={() => handleRemoveSpecification(index)}
              style={{ width: "100%" }}
            >
              Xóa
            </Button>
          </Col>
        </Row>
      ))}
      <Button type="dashed" onClick={handleAddSpecification} block>
        Thêm đặc điểm
      </Button>
    </>
  );
};

export default SpecificationList;
