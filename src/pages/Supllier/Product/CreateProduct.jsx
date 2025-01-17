import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Typography,
} from "antd"; // Added Row and Col
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { getAllCategories } from "../../../api/categoryApi";
import { createContractTemplate } from "../../../api/contractTemplateApi";
import { createProductBuy, createProductRent } from "../../../api/productApi";
import { getVouchersBySupplierId } from "../../../api/voucherApi";
import ContractTemplateFields from "../../../components/ContractTemplateFields"; // Import the new component
import ImageUpload from "../../../components/ImageUpload";
import PriceTypeSelector from "../../../components/PriceTypeSelector";
import SpecificationList from "../../../components/SpecificationList";
import VoucherSelector from "../../../components/VoucherSelector";

const { Option } = Select;
const { Title } = Typography;

const CreateProduct = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [specifications, setSpecifications] = useState([
    { feature: "", description: "" },
  ]);
  const [priceType, setPriceType] = useState([]);
  const [productType, setProductType] = useState("rent"); // Using productType state
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isVoucherModalVisible, setIsVoucherModalVisible] = useState(false);

  // State variables for Contract Template Modal
  const [isContractModalVisible, setIsContractModalVisible] = useState(false);
  const [createdProductID, setCreatedProductID] = useState(null);

  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user.id) {
        try {
          const response = await getSupplierIdByAccountId(user.id);
          if (response?.isSuccess) {
            setSupplierId(response.result);
          } else {
            message.error("Lấy ID Nhà cung cấp không thành công.");
          }
        } catch (error) {
          message.error("Lỗi khi lấy ID Nhà cung cấp.");
        }
      }
    };

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await getAllCategories(1, 100);
        if (data?.result) {
          setCategories(data.result);
        } else {
          message.error("Tải danh mục không thành công.");
        }
      } catch (error) {
        console.error("Lỗi tải:", error);
        message.error("Đã xảy ra lỗi khi tải danh mục.");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierId();
    fetchCategories();
  }, [user]);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await getVouchersBySupplierId(supplierId, 1, 100);
      if (response && response.result) {
        setVouchers(response.result);
      } else {
        message.error("Lấy dữ liệu voucher thất bại.");
      }
    } catch (error) {
      message.error("Lấy dữ liệu voucher thất bại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supplierId) {
      fetchVouchers();
    }
  }, [supplierId]);

  const handleFileChange = (info) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      setFile(info.file.originFileObj);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleCreateProduct = async (values) => {
    const validSpecifications = specifications.filter(
      (spec) => spec.feature && spec.description
    );

    // Transform specifications to array format
    const transformedSpecifications = validSpecifications.map(
      (spec) => spec.feature + ":" + spec.description
    );

    if (!supplierId) {
      message.error("Supplier ID is missing or invalid.");
      return;
    }

    const formData = new FormData();

    // Basic product info
    formData.append("SerialNumber", values.SerialNumber || "");
    formData.append("SupplierID", supplierId || "");
    formData.append("CategoryID", values.CategoryID || "");
    formData.append("ProductName", values.ProductName || "");
    formData.append("ProductDescription", values.ProductDescription || "");
    formData.append("Quality", values.Quality || "");
    formData.append("Brand", values.Brand || 0);
    formData.append("Status", productType === "rent" ? 1 : 0);
    formData.append("DateOfManufacture", values.DateOfManufacture || "");
    formData.append("OriginalPrice", values.OriginalPrice || 0);

    // Append each specification separately
    transformedSpecifications.forEach((spec, index) => {
      formData.append(`listProductSpecification[${index}]`, spec);
    });

    if (productType === "rent") {
      // Use productType state
      formData.append("DepositProduct", values.DepositProduct);
      formData.append("PricePerHour", values.PricePerHour || 0);
      formData.append("PricePerDay", values.PricePerDay || 0);
      formData.append("PricePerWeek", values.PricePerWeek || 0);
      formData.append("PricePerMonth", values.PricePerMonth || 0);
    } else {
      formData.append("Quantity", values.Quantity);
      formData.append("PriceRent", 0);
      formData.append("PriceBuy", values.PriceBuy || 0);
    }

    // Append voucher if selected
    if (selectedVoucher) {
      formData.append("VoucherID", selectedVoucher.vourcherID);
    }

    // Debugging: Log FormData entries
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      setLoading(true);
      let result;

      if (productType === "rent") {
        result = await createProductRent(formData);
      } else {
        result = await createProductBuy(formData);
      }

      // Debugging: Log the result to verify the structure
      console.log("API Response:", result);

      if (result?.isSuccess) {
        message.success("Product created successfully!");

        if (productType === "rent") {
          const productID = result.result?.productID;
          if (!productID) {
            message.error("Failed to retrieve Product ID.");
            return;
          }

          setCreatedProductID(productID);
          setIsContractModalVisible(true);
        }

        // Reset form and state
        form.resetFields();
        setFile(null);
        setFilePreview(null);
        setSpecifications([{ feature: description }]);
        setSelectedVoucher(null);
      } else {
        message.error(result?.message || "Failed to create product.");
      }
    } catch (error) {
      // Enhanced error logging
      if (error.response) {
        console.error("API Error:", error.response.data);
        message.error(
          error.response.data.message || "Failed to create product."
        );
      } else {
        console.error("Error when creating product:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePriceTypeChange = (value) => {
    setPriceType(value);
    // Reset other price fields based on selected price types
    const resetFields = {
      PricePerHour: 0,
      PricePerDay: 0,
      PricePerWeek: 0,
      PricePerMonth: 0,
    };
    Object.keys(resetFields).forEach((field) => {
      if (!value.includes(field)) {
        form.setFieldsValue({ [field]: 0 });
      }
    });
  };

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { feature: "", description: "" }]);
  };

  const handleSpecificationChange = (value, index) => {
    const newSpecifications = [...specifications];
    newSpecifications[index] = value;
    setSpecifications(newSpecifications);
  };

  const handleRemoveSpecification = (index) => {
    const newSpecifications = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecifications);
  };

  const handleVoucherSelect = (voucher) => {
    setSelectedVoucher(voucher);
    setIsVoucherModalVisible(false);
  };

  // New function to handle Contract Template submission
  const handleContractTemplateSubmit = async (templateValues) => {
    if (!createdProductID) {
      message.error("Invalid Product ID for creating contract template.");
      return;
    }

    const contractData = {
      templateName: templateValues.templateName || "Default Template",
      contractTerms: templateValues.contractTerms || "Default Terms",
      templateDetails: templateValues.templateDetails || "Default Details",
      penaltyPolicy: templateValues.penaltyPolicy || "Default Penalty Policy",
      accountID: user.id,
      productID: createdProductID,
    };

    try {
      setLoading(true);
      const contractResult = await createContractTemplate(contractData);
      if (contractResult?.isSuccess) {
        message.success("Contract template created successfully!");
        setIsContractModalVisible(false);
      } else {
        message.error(
          contractResult?.message || "Failed to create contract template."
        );
      }
    } catch (contractError) {
      if (contractError.response) {
        console.error("API Error:", contractError.response.data);
        message.error(
          contractError.response.data.message ||
            "Failed to create contract template."
        );
      } else {
        console.error(
          "Error creating contract template:",
          contractError.message
        );
        message.error(
          "An unexpected error occurred while creating the contract template."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card title={<Title level={3}>Tạo Sản Phẩm Mới</Title>} bordered={false}>
        <Form
          form={form}
          onFinish={handleCreateProduct}
          initialValues={{
            Quality: "0",
            Status: 0,
            PricePerHour: 0,
            PricePerDay: 0,
            PricePerWeek: 0,
            PricePerMonth: 0,
            PriceBuy: 0, // Added PriceBuy to initial values
          }}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Loại sản phẩm">
                <Radio.Group
                  onChange={(e) => setProductType(e.target.value)}
                  value={productType}
                >
                  <Radio value="rent">Thuê</Radio>
                  <Radio value="buy">Mua</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="Brand"
                label="Thương hiệu"
                rules={[
                  { required: true, message: "Vui lòng chọn một thương hiệu" },
                ]}
              >
                <Select placeholder="Chọn một thương hiệu">
                  <Option value={0}>Canon</Option>
                  <Option value={1}>Nikon</Option>
                  <Option value={2}>Sony</Option>
                  <Option value={3}>Fujifilm</Option>
                  <Option value={4}>Olympus</Option>
                  <Option value={5}>Panasonic</Option>
                  <Option value={6}>Leica</Option>
                  <Option value={7}>Pentax</Option>
                  <Option value={8}>Hasselblad</Option>
                  <Option value={9}>Sigma</Option>
                  <Option value={10}>Khác</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ProductName"
                label="Tên sản phẩm"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                ]}
              >
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="SerialNumber"
                label="Số Serial"
                rules={[
                  { required: true, message: "Vui lòng nhập số serial!" },
                ]}
              >
                <Input placeholder="Nhập số serial" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="CategoryID"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn một danh mục!" }]}
          >
            <Select placeholder="Chọn một danh mục">
              {categories.map((category) => (
                <Option key={category.categoryID} value={category.categoryID}>
                  {category.categoryName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="ProductDescription"
            label="Mô tả"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả sản phẩm!" },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Quality"
                label="Chất lượng"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập chất lượng sản phẩm!",
                  },
                ]}
              >
                <Select placeholder="Đánh giá chất lượng sản phẩm">
                  <Option value="Mới">Mới</Option>
                  <Option value="Đã qua sử dụng">Đã qua sử dụng</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="DateOfManufacture"
                label="Ngày sản xuất"
                rules={[
                  { required: true, message: "Vui lòng nhập ngày sản xuất!" },
                ]}
              >
                <Input type="date" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="OriginalPrice"
                label="Giá gốc"
                rules={[{ required: true, message: "Vui lòng nhập giá gốc!" }]}
              >
                <Input type="number" placeholder="Nhập giá gốc" />
              </Form.Item>
            </Col>
            {productType === "buy" && (
              <Col span={12}>
                <Form.Item
                  name="PriceBuy"
                  label="Giá"
                  rules={[
                    { required: true, message: "Vui lòng nhập giá sản phẩm!" },
                    { type: "number", transform: (value) => Number(value) },
                  ]}
                >
                  <Input type="number" placeholder="Nhập giá sản phẩm" />
                </Form.Item>
              </Col>
            )}
          </Row>

          {productType === "buy" && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="Quantity"
                  label="Số lượng"
                  rules={[
                    { required: true, message: "Vui lòng nhập số lượng!" },
                    { type: "number", transform: (value) => Number(value) },
                  ]}
                >
                  <Input type="number" min="1" placeholder="Nhập số lượng" />
                </Form.Item>
              </Col>
            </Row>
          )}

          {productType === "rent" && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="DepositProduct"
                    label="Cọc"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tiền cọc cho sản phẩm!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập tiền cọc" />
                  </Form.Item>
                </Col>
              </Row>

              <PriceTypeSelector
                priceType={priceType}
                handlePriceTypeChange={handlePriceTypeChange}
              />
            </>
          )}

          <SpecificationList
            specifications={specifications}
            handleSpecificationChange={handleSpecificationChange}
            handleAddSpecification={handleAddSpecification}
            handleRemoveSpecification={handleRemoveSpecification}
          />

          <Form.Item label="Hình ảnh">
            <ImageUpload
              file={file}
              filePreview={filePreview}
              handleFileChange={handleFileChange}
              handleRemoveFile={handleRemoveFile}
            />
          </Form.Item>

          <Form.Item label="Voucher">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsVoucherModalVisible(true)}
            >
              Chọn Voucher
            </Button>
            {selectedVoucher && (
              <div style={{ marginTop: 8 }}>
                <Card>
                  <Card.Meta
                    title={selectedVoucher.vourcherCode}
                    description={selectedVoucher.description}
                  />
                </Card>
              </div>
            )}
          </Form.Item>

          <VoucherSelector
            isVisible={isVoucherModalVisible}
            vouchers={vouchers}
            handleVoucherSelect={handleVoucherSelect}
            selectedVoucher={selectedVoucher}
            handleClose={() => setIsVoucherModalVisible(false)}
          />

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Tạo sản phẩm
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Modal for Contract Template Fields */}
      <Modal
        title="Tạo Mẫu Hợp Đồng"
        visible={isContractModalVisible}
        onCancel={() => setIsContractModalVisible(false)}
        footer={null}
        width={800} // Increased modal width for better layout
      >
        <ContractTemplateFields
          onSubmit={handleContractTemplateSubmit}
          products={[]}
          productID={createdProductID}
        />
      </Modal>
    </>
  );
};

export default CreateProduct;
