import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { getAllCategories } from "../../../api/categoryApi";
import { createProductBuy } from "../../../api/productApi";

const { Option } = Select;

const CreateProductBuy = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // Define filePreview here
  const [specifications, setSpecifications] = useState([
    { feature: "", description: "" },
  ]);
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);

  // Lấy ID Nhà cung cấp và Danh mục
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

  const handleFileChange = (info) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      setFile(info.file.originFileObj);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result); // Update filePreview here
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null); // Xóa preview khi xóa file
  };

  const handleCreateProduct = async (values) => {
    const validSpecifications = specifications.filter(
      (spec) => spec.feature && spec.description
    );

    const {
      SerialNumber,
      CategoryID,
      ProductName,
      ProductDescription,
      Quality,
      PriceRent = 0,
      PriceBuy,
      Brand,
      Status = 0, // Trạng thái mặc định nếu không cung cấp
    } = values;

    // Kiểm tra các giá trị bắt buộc
    if (!supplierId || !CategoryID || !ProductName || !SerialNumber) {
      message.error("Vui lòng điền tất cả các trường bắt buộc.");
      return;
    }

    const productData = {
      SerialNumber,
      SupplierID: supplierId,
      CategoryID,
      ProductName,
      ProductDescription,
      Quality,
      PriceRent,
      PriceBuy,
      Brand,
      Status,
      File: file, // Kiểm tra xem file có cần thiết không
      listProductSpecification: validSpecifications,
    };
    console.log("Product Data:", productData);
    try {
      setLoading(true);
      const result = await createProductBuy(productData);
      if (result) {
        message.success("Sản phẩm đã được tạo thành công!");
        form.resetFields();
        setFile(null);
        setFilePreview(null); // Reset filePreview
        setSpecifications(["Cảm ứng"]); // Reset specifications
      } else {
        message.error("Tạo sản phẩm không thành công.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      message.error("Đã xảy ra lỗi khi tạo sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { feature: "", description: "" }]); // Ensure it's an object
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

  return (
    <Card title="Tạo Sản Phẩm Mới" bordered={false}>
      <Form
        form={form}
        onFinish={handleCreateProduct}
        initialValues={{ Status: 0 }}
        layout="vertical"
        className="create-product-form"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="SerialNumber"
              label="Số Serial"
              rules={[{ required: true, message: "Vui lòng nhập số serial!" }]}
            >
              <Input placeholder="Nhập số serial" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="CategoryID"
              label="Danh mục"
              rules={[
                { required: true, message: "Vui lòng chọn một danh mục!" },
              ]}
            >
              <Select placeholder="Chọn một danh mục">
                {categories.map((category) => (
                  <Option key={category.categoryID} value={category.categoryID}>
                    {category.categoryName}
                  </Option>
                ))}
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

        <Form.Item
          name="ProductDescription"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả sản phẩm!" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập mô tả chi tiết về sản phẩm"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="Quality"
              label="Chất lượng"
              rules={[{ required: true }]}
            >
              <Select placeholder="Đánh giá chất lượng">
                <Option value={"Mới"}>Mới</Option>
                <Option value={"Đã qua sử dụng"}>Đã qua sử dụng</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="PriceBuy" label="Giá (Mua)">
              <Input type="number" placeholder="Nhập giá bán" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="Status" label="Trạng thái">
              <Select placeholder="Chọn trạng thái">
                <Option value={0}>Sản phẩm để bán</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Card title="Tải lên Hình ảnh" size="small" className="upload-card">
          <Form.Item label="Hình ảnh sản phẩm">
            <Upload
              name="file"
              accept=".png,.jpg,.jpeg"
              showUploadList={false}
              onChange={handleFileChange}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {filePreview && (
              <div style={{ marginTop: "1rem" }}>
                <img
                  src={filePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    objectFit: "contain",
                    borderRadius: "4px",
                  }}
                />
                <Button
                  danger
                  onClick={handleRemoveFile}
                  style={{ marginTop: "0.5rem" }}
                >
                  Xóa ảnh
                </Button>
              </div>
            )}
          </Form.Item>
        </Card>

        <Card
          title="Đặc điểm sản phẩm"
          size="small"
          style={{ marginTop: "1rem" }}
        >
          {specifications.map((specification, index) => (
            <Space key={index} style={{ display: "flex", marginBottom: 8 }}>
              <Input
                value={specification.feature}
                onChange={(e) =>
                  handleSpecificationChange(e.target.value, index, "feature")
                }
                placeholder={`Đặc điểm ${index + 1}`}
                style={{ width: "100%" }}
              />
              <Input
                value={specification.description}
                onChange={(e) =>
                  handleSpecificationChange(
                    e.target.value,
                    index,
                    "description"
                  )
                }
                placeholder={`Mô tả ${index + 1}`}
                style={{ width: "40%" }}
              />
              <Button
                type="danger"
                onClick={() => handleRemoveSpecification(index)}
              >
                Xóa
              </Button>
            </Space>
          ))}
          <Button type="dashed" onClick={handleAddSpecification}>
            Thêm đặc điểm
          </Button>
        </Card>

        <Form.Item style={{ marginTop: "1rem", textAlign: "right" }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Tạo sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateProductBuy;
