import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  message,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { getAllCategories } from "../../../api/categoryApi";
import { updateProduct, updateProductRent } from "../../../api/productApi";

const { Option } = Select;

const EditProductForm = ({ visible, onClose, product, onUpdateSuccess }) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    product?.categoryID || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(product?.status || 0);
  const [specifications, setSpecifications] = useState(
    product?.listProductSpecification.map((spec) => ({
      feature: spec.specification,
      description: spec.details,
    })) || [{ feature: "", description: "" }]
  );

  useEffect(() => {
    if (visible) {
      fetchCategories();
    }
  }, [visible]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCategories(1, 100);
      if (data && data.result) {
        setCategories(data.result);
      } else {
        message.error("Không thể tải danh mục. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
      message.error("Đã xảy ra lỗi khi tải danh mục.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        productName: product.productName,
        productDescription: product.productDescription,
        priceRent: product.priceRent,
        priceBuy: product.priceBuy,
        brand: product.brand,
        quality: product.quality,
        status: product.status,
        serialNumber: product.serialNumber,
        CategoryID: product.categoryID,
        pricePerHour: product.pricePerHour,
        pricePerDay: product.pricePerDay,
        pricePerWeek: product.pricePerWeek,
        pricePerMonth: product.pricePerMonth,
        dateOfManufacture:
          product.dateOfManufacture !== "0001-01-01T00:00:00"
            ? dayjs(product.dateOfManufacture)
            : null,
        originalPrice: product.originalPrice,
        depositProduct: product.depositProduct,
      });
      setSelectedCategory(product.categoryID);
      setStatus(product.status);
      setSpecifications(
        product.listProductSpecification.map((spec) => ({
          feature: spec.specification,
          description: spec.details,
        })) || [{ feature: "", description: "" }]
      );
    }
  }, [product, form]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { feature: "", description: "" }]);
  };

  const handleSpecificationChange = (value, index, field) => {
    const newSpecifications = [...specifications];
    newSpecifications[index][field] = value;
    setSpecifications(newSpecifications);
  };

  const handleRemoveSpecification = (index) => {
    const newSpecifications = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecifications);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const validSpecifications = specifications.filter(
        (spec) => spec.feature && spec.description
      );

      const formData = new FormData();
      formData.append("ProductID", product.productID);
      formData.append("SerialNumber", values.serialNumber);
      formData.append("CategoryID", selectedCategory);
      formData.append("ProductName", values.productName);
      formData.append("ProductDescription", values.productDescription);
      formData.append("PriceBuy", values.priceBuy);
      formData.append("Brand", values.brand);
      formData.append("Quality", values.quality);
      formData.append("Status", values.status);
      formData.append(
        "DateOfManufacture",
        values.dateOfManufacture
          ? values.dateOfManufacture.format("DD-MM-YYYY")
          : null
      );
      formData.append("OriginalPrice", values.originalPrice);
      formData.append(
        "listProductSpecification",
        JSON.stringify(validSpecifications)
      );
      formData.append("DepositProduct", values.depositProduct);
      formData.append("PricePerHour", values.pricePerHour);
      formData.append("PricePerDay", values.pricePerDay);
      formData.append("PricePerWeek", values.pricePerWeek);
      formData.append("PricePerMonth", values.pricePerMonth);

      if (file) {
        formData.append("File", file);
      }

      let result;
      if (values.status === 0) {
        result = await updateProduct(formData);
      } else if (values.status === 1) {
        result = await updateProductRent(formData);
      }

      if (result) {
        onUpdateSuccess(result);
        message.success("Cập nhật sản phẩm thành công!");
        form.resetFields();
        onClose();
      } else {
        message.error("Cập nhật sản phẩm thất bại.");
      }
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
      message.error("Cập nhật thất bại: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterOption = (inputValue, option) =>
    option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Chỉnh Sửa Sản Phẩm"
      visible={visible}
      onCancel={handleClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          name="productName"
          label="Tên Sản Phẩm"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="productDescription" label="Mô Tả">
          <Input.TextArea />
        </Form.Item>
        {status === 0 && (
          <>
            <Form.Item
              name="priceBuy"
              label="Giá Bán"
              rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
            >
              <Input type="number" />
            </Form.Item>
          </>
        )}
        <Form.Item
          name="brand"
          label="Thương Hiệu"
          rules={[{ required: true, message: "Vui lòng chọn thương hiệu" }]}
        >
          <Select placeholder="Chọn thương hiệu">
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
        <Form.Item
          name="quality"
          label="Chất Lượng"
          rules={[{ required: true, message: "Vui lòng chọn chất lượng" }]}
        >
          <Select placeholder="Chọn chất lượng">
            <Option value="High">Cao</Option>
            <Option value="Medium">Trung Bình</Option>
            <Option value="Low">Thấp</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng Thái"
          rules={[
            { required: true, message: "Vui lòng chọn trạng thái sản phẩm" },
          ]}
        >
          <Select
            placeholder="Chọn trạng thái"
            onChange={(value) => setStatus(value)}
          >
            <Option value={0}>Sẵn Bán</Option>
            <Option value={1}>Có Sẵn Để Thuê</Option>
            <Option value={4}>Ngừng Kinh Doanh</Option>
          </Select>
        </Form.Item>
        {status === 1 && (
          <>
            <Form.Item name="depositProduct" label="Giá Cọc">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="pricePerHour" label="Giá Theo Giờ">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="pricePerDay" label="Giá Theo Ngày">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="pricePerWeek" label="Giá Theo Tuần">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="pricePerMonth" label="Giá Theo Tháng">
              <Input type="number" />
            </Form.Item>
          </>
        )}

        <Form.Item
          name="CategoryID"
          label="Danh Mục"
          rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
        >
          <Select
            showSearch
            placeholder="Chọn danh mục"
            filterOption={filterOption}
            loading={isLoading}
            onChange={(value) => setSelectedCategory(value)}
            value={selectedCategory}
          >
            {categories.map((category) => (
              <Option key={category.categoryID} value={category.categoryID}>
                {category.categoryName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="dateOfManufacture"
          label="Ngày Sản Xuất"
          rules={[{ required: true, message: "Vui lòng chọn ngày sản xuất" }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="originalPrice"
          label="Giá Gốc"
          rules={[{ required: true, message: "Vui lòng nhập giá gốc" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Đặc điểm sản phẩm">
          {specifications.map((specification, index) => (
            <Space key={index} style={{ display: "flex", marginBottom: 8 }}>
              <Input
                value={specification.feature}
                onChange={(e) =>
                  handleSpecificationChange(e.target.value, index, "feature")
                }
                placeholder={`Đặc điểm ${index + 1}`}
                style={{ width: "60%" }}
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
        </Form.Item>
        <Form.Item label="Tải Lên Hình Ảnh">
          <Input type="file" accept="image/*" onChange={handleFileChange} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập Nhật Sản Phẩm
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProductForm;
