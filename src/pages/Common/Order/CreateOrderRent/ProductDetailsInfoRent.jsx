import {
  DollarOutlined,
  DownOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  TagOutlined,
  UpOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Empty, // Add this import
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

const customDatePickerStyle = {
  width: "100%",
  ".ant-picker-input > input": {
    fontSize: "14px",
  },
  ".ant-picker-suffix": {
    color: "#1890ff",
  },
};

const priceCardStyle = {
  background: "linear-gradient(135deg, #1890ff 0%, #52c41a 100%)",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(24,144,255,0.2)",
  padding: "24px",
  textAlign: "center",
  color: "white",
  transition: "transform 0.3s ease",
  ":hover": {
    transform: "translateY(-2px)",
  },
};

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
  form, // Add form prop
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
    message.info(`Vui lòng chọn thời lượng từ ${min} đến ${max}.`);
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
      message.error("Đơn vị thời gian không hợp lệ");
      return;
    }

    // Validate inputs
    if (!durationValue || durationValue <= 0) {
      message.error("Thời lượng phải lớn hơn 0");
      return;
    }

    const { min, max } = durationOptions[durationUnit];
    if (durationValue < min || durationValue > max) {
      message.error(
        `Thời lượng không hợp lệ. Vui lòng chọn từ ${min} đến ${max}.`
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
  return (
    <div>
      {" "}
      {/* Change outer Card to div to avoid nesting forms */}
      <Card
        title={
          <div
            style={{
              fontSize: "24px",
              fontWeight: "600",
              background: "linear-gradient(90deg, #1890ff, #52c41a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Thông tin sản phẩm
          </div>
        }
        bordered={false}
        className="product-details-card"
        style={{
          marginBottom: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "60px",
            }}
          >
            <Spin
              size="large"
              tip={
                <div style={{ marginTop: "15px", color: "#1890ff" }}>
                  Đang tải thông tin sản phẩm...
                </div>
              }
            />
          </div>
        ) : product ? (
          <>
            <Row gutter={[32, 32]}>
              <Col span={12}>
                <Descriptions
                  column={1}
                  bordered
                  size="middle"
                  labelStyle={{
                    fontWeight: "600",
                    backgroundColor: "#f8f9fa",
                    width: "160px",
                    padding: "16px",
                    borderRadius: "4px 0 0 4px",
                  }}
                  contentStyle={{
                    backgroundColor: "white",
                    padding: "16px",
                    borderRadius: "0 4px 4px 0",
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
                    <div style={{ padding: "8px 0" }}>
                      {[
                        {
                          label: "Giờ",
                          price: product.pricePerHour,
                          color: "#52c41a",
                          icon: "⏱️",
                        },
                        {
                          label: "Ngày",
                          price: product.pricePerDay,
                          color: "#1890ff",
                          icon: "📅",
                        },
                        {
                          label: "Tuần",
                          price: product.pricePerWeek,
                          color: "#722ed1",
                          icon: "📆",
                        },
                        {
                          label: "Tháng",
                          price: product.pricePerMonth,
                          color: "#eb2f96",
                          icon: "📋",
                        },
                      ].map(({ label, price, color, icon }) => (
                        <div
                          key={label}
                          style={{
                            marginBottom: "12px",
                            padding: "8px",
                            background: `${color}10`,
                            borderRadius: "6px",
                            transition: "all 0.3s",
                          }}
                        >
                          <span style={{ marginRight: "8px" }}>{icon}</span>
                          <strong
                            style={{
                              color,
                              width: "60px",
                              display: "inline-block",
                            }}
                          >
                            {label}:
                          </strong>
                          <span
                            style={{
                              color,
                              fontWeight: "600",
                              fontSize: "15px",
                            }}
                          >
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(price)}
                          </span>
                        </div>
                      ))}
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
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#1890ff",
                      }}
                    >
                      <PictureOutlined /> Hình ảnh sản phẩm
                    </span>
                  }
                  bordered={false}
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(120px, 1fr))",
                      gap: "12px",
                      padding: "12px",
                    }}
                  >
                    {product.listImage?.length > 0 ? (
                      product.listImage.map((imageObj) => (
                        <div
                          key={imageObj.productImagesID}
                          style={{
                            position: "relative",
                            paddingTop: "100%",
                            overflow: "hidden",
                            borderRadius: "8px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            transition: "transform 0.3s",
                            cursor: "pointer",
                            ":hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          <img
                            src={imageObj.image}
                            alt="Product"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <div
                        style={{
                          padding: "40px",
                          textAlign: "center",
                          color: "#999",
                          background: "#f5f5f5",
                          borderRadius: "8px",
                        }}
                      >
                        <PictureOutlined
                          style={{ fontSize: "32px", marginBottom: "8px" }}
                        />
                        <div>Không có hình ảnh cho sản phẩm này.</div>
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            </Row>

            <div
              style={{
                marginTop: "32px",
                background: "#fff",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <Card
                title={
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#1890ff",
                    }}
                  >
                    Tính giá thuê
                  </span>
                }
                bordered={false}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Đơn vị thời gian">
                      <Select
                        value={durationUnit}
                        onChange={handleDurationUnitChange}
                        style={{ width: "100%" }}
                        size="large"
                      >
                        {[
                          { value: 0, label: "Giờ" },
                          { value: 1, label: "Ngày" },
                          { value: 2, label: "Tuần" },
                          { value: 3, label: "Tháng" },
                        ].map(({ value, label }) => (
                          <Option key={value} value={value}>
                            {label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Giá trị thời gian">
                      <InputNumber
                        min={durationOptions[durationUnit]?.min || 1}
                        max={durationOptions[durationUnit]?.max || 1}
                        value={durationValue}
                        onChange={handleDurationValueChange}
                        style={{ width: "100%" }}
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="Ngày bắt đầu thuê">
                      <DatePicker
                        showTime
                        value={rentalStartDate}
                        onChange={handleRentalStartDateChange}
                        format="DD-MM-YYYY HH:mm"
                        style={customDatePickerStyle}
                        className="custom-datepicker"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Ngày kết thúc thuê">
                      <DatePicker
                        showTime
                        value={rentalEndDate}
                        disabled
                        format="DD-MM-YYYY HH:mm"
                        style={customDatePickerStyle}
                        className="custom-datepicker"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Ngày trả hàng">
                      <DatePicker
                        showTime
                        value={returnDate}
                        disabled
                        format="DD-MM-YYYY HH:mm"
                        style={customDatePickerStyle}
                        className="custom-datepicker"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <div style={{ marginTop: "24px" }}>
                <Card bordered={false} style={priceCardStyle}>
                  <div style={{ padding: "16px 0" }}>
                    <div
                      style={{
                        fontSize: "20px",
                        marginBottom: "16px",
                        opacity: 0.9,
                      }}
                    >
                      Tổng giá thuê sản phẩm
                    </div>
                    <div
                      style={{
                        fontSize: "36px",
                        fontWeight: "bold",
                        textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        letterSpacing: "1px",
                      }}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(productPriceRent)}
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Contract Terms section */}
            <div style={{ marginTop: "32px" }}>
              <Button
                type="link"
                onClick={toggleContractTerms}
                style={{
                  padding: "12px 24px",
                  height: "auto",
                  display: "flex",
                  alignItems: "center",
                  background: "#f0f5ff",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  ":hover": {
                    background: "#e6f7ff",
                    transform: "translateY(-1px)",
                  },
                }}
                icon={showContractTerms ? <UpOutlined /> : <DownOutlined />}
              >
                {showContractTerms
                  ? "Ẩn điều khoản hợp đồng"
                  : "Hiển thị điều khoản hợp đồng"}
              </Button>

              {showContractTerms && contractTemplate?.length > 0 && (
                <Card
                  title={
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#1890ff",
                      }}
                    >
                      Điều khoản hợp đồng
                    </span>
                  }
                  bordered={false}
                  style={{
                    marginTop: "16px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
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
            </div>
          </>
        ) : (
          <Empty
            description={
              <span style={{ color: "#999", fontSize: "16px" }}>
                Không tìm thấy thông tin sản phẩm
              </span>
            }
            style={{
              padding: "40px",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default ProductDetailsInfoRent;
