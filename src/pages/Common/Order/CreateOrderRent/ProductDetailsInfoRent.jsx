import {
  DollarOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  InputNumber,
  Row,
  Select,
  Spin,
  message,
} from "antd";
import moment from "moment";
import React, { useEffect } from "react";

const { Option } = Select;

const ProductDetailsInfoRent = ({
  product,
  contractTemplate,
  durationUnit,
  setDurationUnit,
  durationValue,
  setDurationValue,
  productPriceRent,
  setProductPriceRent,
  loading,
  showContractTerms,
  toggleContractTerms,
  rentalStartDate,
  setRentalStartDate,
  rentalEndDate,
  setRentalEndDate,
  returnDate,
  setReturnDate,
}) => {
  const pricePerHour = product.pricePerHour;
  const pricePerDay = product.pricePerDay;
  const pricePerWeek = product.pricePerWeek;
  const pricePerMonth = product.pricePerMonth;

  const durationOptions = {
    0: { min: 2, max: 8 }, // Hour
    1: { min: 1, max: 3 }, // Day
    2: { min: 1, max: 2 }, // Week
    3: { min: 1, max: 1 }, // Month
  };

  const handleDurationValueChange = (value) => {
    setDurationValue(value);
  };

  useEffect(() => {
    if (durationUnit !== undefined && durationValue && rentalStartDate) {
      calculateProductPriceRent();
      const endDate = calculateRentalEndTime(
        rentalStartDate.toDate(),
        durationValue,
        durationUnit
      );
      setRentalEndDate(moment(endDate));

      // Calculate Return Date after setting rentalEndDate
      const calculatedReturnDate = calculateReturnDate(endDate);
      setReturnDate(moment(calculatedReturnDate));
    }
  }, [durationUnit, durationValue, rentalStartDate]);

  const handleDurationUnitChange = (value) => {
    setDurationUnit(value);
    setDurationValue(durationOptions[value].min);
    const { min, max } = durationOptions[value];
    message.info(`Please select a duration between ${min} and ${max}.`);
  };

  const calculateReturnDate = (endDate) => {
    if (!endDate) return null;
    return moment(endDate).clone().add(1, "hours");
  };

  // Add this debug check at the start of component
  useEffect(() => {
    console.log("Price variables:", {
      pricePerHour,
      pricePerDay,
      pricePerWeek,
      pricePerMonth,
    });
  }, []);

  const calculateProductPriceRent = () => {
    // Debug logging
    console.log("Calculating price with:", {
      durationUnit,
      durationValue,
      pricePerHour,
      pricePerDay,
      pricePerWeek,
      pricePerMonth,
    });

    if (!durationOptions[durationUnit]) {
      message.error("Invalid duration unit");
      return;
    }

    // Validate inputs
    if (!durationValue || durationValue <= 0) {
      message.error("Duration value must be greater than 0");
      return;
    }

    const { min, max } = durationOptions[durationUnit];
    if (durationValue < min || durationValue > max) {
      message.error(
        `Invalid duration value. Please choose between ${min} and ${max}.`
      );
      return;
    }

    let price = 0;
    switch (durationUnit) {
      case 0:
        price = durationValue * (pricePerHour || 0);
        break;
      case 1:
        price = durationValue * (pricePerDay || 0);
        break;
      case 2:
        price = durationValue * (pricePerWeek || 0);
        break;
      case 3:
        price = durationValue * (pricePerMonth || 0);
        break;
      default:
        price = 0;
    }

    // Debug final price
    console.log("Calculated price:", price);
    setProductPriceRent(price);
  };

  // Make sure calculation runs when needed
  useEffect(() => {
    if (durationUnit !== undefined && durationValue > 0) {
      calculateProductPriceRent();
    }
  }, [durationUnit, durationValue]);

  const handleRentalStartDateChange = (date) => {
    if (!date) {
      message.error("Vui lòng chọn ngày bắt đầu thuê");
      return;
    }

    setRentalStartDate(date);

    const calculatedEndDate = calculateRentalEndTime(
      date.toDate(),
      durationValue,
      durationUnit
    );
    if (calculatedEndDate) {
      setRentalEndDate(moment(calculatedEndDate));

      // Calculate Return Date after setting rentalEndDate
      const calculatedReturnDate = calculateReturnDate(calculatedEndDate);
      setReturnDate(moment(calculatedReturnDate));
    }
  };

  const calculateRentalEndTime = (
    rentalStartTime,
    rentalDuration,
    durationType
  ) => {
    let rentalEndTime;
    switch (durationType) {
      case 0: // Hour
        rentalEndTime = new Date(
          rentalStartTime.getTime() + rentalDuration * 60 * 60 * 1000
        );
        break;
      case 1: // Day
        rentalEndTime = new Date(
          rentalStartTime.getTime() + rentalDuration * 24 * 60 * 60 * 1000
        );
        break;
      case 2: // Week
        rentalEndTime = new Date(
          rentalStartTime.getTime() + rentalDuration * 7 * 24 * 60 * 60 * 1000
        );
        break;
      case 3: // Month
        rentalEndTime = new Date(
          rentalStartTime.getTime() + rentalDuration * 30 * 24 * 60 * 60 * 1000
        );
        break;
      default:
        throw new Error("Invalid duration type");
    }
    return rentalEndTime;
  };
  const disabledTime = () => ({
    disabledHours: () =>
      [...Array(24)].map((_, i) => i).filter((h) => h < 7 || h >= 20),
  });

  const [form] = Form.useForm();

  const handleFormSubmit = () => {
    form.validateFields()
      .then(values => {
        // Handle form submission
        console.log('Form values:', values);
      })
      .catch(errorInfo => {
        console.log('Validation Failed:', errorInfo);
      });
  };

  return (
    <Card
      title={<span style={{ fontSize: "18px", fontWeight: "600" }}>Thông tin sản phẩm</span>}
      bordered={false}
      style={{ marginBottom: "24px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" tip="Đang tải thông tin sản phẩm..." />
        </div>
      ) : product ? (
        <>
          <Row gutter={24}>
            <Col span={12}>
              <Descriptions 
                column={1} 
                bordered 
                style={{ 
                  background: "#fff",
                  borderRadius: "8px",
                  overflow: "hidden"
                }}
              >
                <Descriptions.Item
                  label={
                    <span>
                      <TagOutlined /> Mã sản phẩm
                    </span>
                  }
                >
                  {product.serialNumber}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <InfoCircleOutlined /> Tên
                    </span>
                  }
                >
                  {product.productName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <FileTextOutlined /> Mô tả
                    </span>
                  }
                >
                  {product.productDescription}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <FileTextOutlined /> Cọc sản phẩm
                    </span>
                  }
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.depositProduct)}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <FileTextOutlined /> Giá Gốc
                    </span>
                  }
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.originalPrice)}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <DollarOutlined /> Giá thuê
                    </span>
                  }
                >
                  <div style={{ color: "#52c41a" }}>
                    <strong>Giờ: </strong>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.pricePerHour)}
                  </div>
                  <div style={{ color: "#1890ff" }}>
                    <strong>Ngày:</strong>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.pricePerDay)}
                  </div>
                  <div style={{ color: "#faad14" }}>
                    <strong>Tuần:</strong>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.pricePerWeek)}
                  </div>
                  <div style={{ color: "#f5222d" }}>
                    <strong>Tháng:</strong>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.pricePerMonth)}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <InfoCircleOutlined /> Chất lượng
                    </span>
                  }
                >
                  {product.quality}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={12}>
              <Card
                title={
                  <span style={{ fontSize: "16px" }}>
                    <PictureOutlined /> Hình ảnh sản phẩm
                  </span>
                }
                bordered={false}
                style={{ borderRadius: "8px" }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {product.listImage && product.listImage.length > 0 ? (
                    product.listImage.map((imageObj, index) => (
                      <img
                        key={imageObj.productImagesID}
                        src={imageObj.image}
                        alt={`Hình ảnh sản phẩm ${index + 1}`}
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          transition: "transform 0.2s",
                          cursor: "pointer",
                          "&:hover": {
                            transform: "scale(1.05)"
                          }
                        }}
                      />
                    ))
                  ) : (
                    <p style={{ color: "#999" }}>Không có hình ảnh cho sản phẩm này.</p>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
          <Form
            layout="vertical"
            style={{ marginTop: "32px" }}
            form={form}
            onFinish={handleFormSubmit}
          >
            <Card
              title={<span style={{ fontSize: "16px" }}>Tính giá thuê</span>}
              bordered={false}
              style={{ 
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}
            >
              <Form.Item
                label="Đơn vị thời gian"
                style={{ width: "100%", marginBottom: "16px" }}
                name="durationUnit"
                rules={[{ required: true, message: "Vui lòng chọn đơn vị thời gian" }]}
              >
                <Select
                  value={durationUnit}
                  onChange={handleDurationUnitChange}
                  style={{ width: "100%" }}
                >
                  <Option value={0}>Giờ</Option>
                  <Option value={1}>Ngày</Option>
                  <Option value={2}>Tuần</Option>
                  <Option value={3}>Tháng</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Giá trị thời gian"
                style={{ width: "100%", marginBottom: "16px" }}
                name="durationValue"
                rules={[
                  { required: true, message: "Vui lòng nhập giá trị thời gian" },
                  {
                    type: "number",
                    min: durationOptions[durationUnit]?.min || 1,
                    max: durationOptions[durationUnit]?.max || 1,
                    message: `Vui lòng nhập giá trị từ ${durationOptions[durationUnit]?.min || 1} đến ${durationOptions[durationUnit]?.max || 1}`,
                  },
                ]}
              >
                <InputNumber
                  min={durationOptions[durationUnit]?.min || 1}
                  max={durationOptions[durationUnit]?.max || 1}
                  value={durationValue}
                  onChange={handleDurationValueChange}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label="Ngày bắt đầu thuê"
                style={{ width: "100%", marginBottom: "16px" }}
                name="rentalStartDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu thuê" }]}
              >
                <DatePicker
                  showTime={{
                    format: "HH:mm",
                    hideDisabledOptions: true,
                  }}
                  value={rentalStartDate}
                  onChange={handleRentalStartDateChange}
                  format="DD - MM - YYYY HH:mm"
                  style={{ width: "100%" }}
                  disabledTime={disabledTime}
                  onOk={(value) => {
                    const hour = value.hour();
                    if (hour < 7 || hour >= 20) {
                      message.error(
                        "Chỉ được chọn thời gian từ 7:00 đến 20:00"
                      );
                      return;
                    }
                    handleRentalStartDateChange(value);
                  }}
                  placeholder="Chọn ngày và giờ bắt đầu thuê"
                />
              </Form.Item>
              <Form.Item
                label="Ngày kết thúc thuê"
                style={{ width: "100%", marginBottom: "16px" }}
                name="rentalEndDate"
              >
                <DatePicker
                  showTime
                  value={rentalEndDate}
                  disabled
                  format="DD - MM - YYYY HH:mm"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item
                label="Ngày trả hàng"
                style={{ width: "100%", marginBottom: "16px" }}
                name="returnDate"
              >
                <DatePicker
                  showTime
                  value={returnDate}
                  disabled
                  format="DD - MM - YYYY HH:mm"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Card>
            <div style={{ marginTop: "24px", textAlign: "center" }}>
              <Card
                bordered={false}
                style={{
                  backgroundColor: "#f6ffed",
                  padding: "24px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  border: "1px solid #b7eb8f"
                }}
              >
                <div style={{ fontSize: "16px", color: "#333", marginBottom: "8px" }}>
                  Giá thuê sản phẩm
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    color: "#52c41a",
                    fontWeight: "bold"
                  }}
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(productPriceRent)}
                </div>
              </Card>
            </div>
            <Form.Item style={{ textAlign: "center", marginTop: "24px" }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                style={{ 
                  minWidth: "200px",
                  height: "40px",
                  borderRadius: "6px"
                }}
              >
                Xác nhận
              </Button>
            </Form.Item>
          </Form>

          <Button
            type="link"
            onClick={toggleContractTerms}
            style={{ marginTop: "24px", display: "block" }}
          >
            {showContractTerms ? "Ẩn điều khoản hợp đồng" : "Hiển thị điều khoản hợp đồng"}
          </Button>
          {showContractTerms &&
            contractTemplate &&
            contractTemplate.length > 0 && (
              <Card
                title="Điều khoản hợp đồng"
                bordered={false}
                style={{ marginTop: "24px" }}
              >
                <Row gutter={16}>
                  <Col span={24}>
                    <Descriptions column={1} bordered>
                      {contractTemplate.map((item) => (
                        <Descriptions.Item
                          key={item.contractTemplateID}
                          label={
                            <span>
                              <FileTextOutlined /> {item.templateName}
                            </span>
                          }
                        >
                          <p>
                            <strong>Điều khoản hợp đồng:</strong>
                            {item.contractTerms}
                          </p>
                          <p>
                            <strong>Chính sách phạt:</strong>
                            {item.penaltyPolicy}
                          </p>
                          <p>
                            <strong>Chi tiết mẫu:</strong>
                            {item.templateDetails}
                          </p>
                        </Descriptions.Item>
                      ))}
                    </Descriptions>
                  </Col>
                </Row>
              </Card>
            )}
        </>
      ) : (
        <Empty description="Không tìm thấy thông tin sản phẩm" />
      )}
    </Card>
  );
};

export default ProductDetailsInfoRent;
