import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Space,
  Table,
  theme,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryByName,
  updateCategory,
} from "../../../api/categoryApi";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";

const { Title } = Typography;

const ManageCategory = () => {
  const { token } = theme.useToken();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form] = Form.useForm();

  const fetchCategories = async (page = 1, pageSize = 100) => {
    setLoading(true);
    try {
      const data = await getAllCategories(page, pageSize);
      if (data && data.isSuccess) {
        setCategories(data.result);
      } else {
        message.error("Không thể tải danh mục.");
      }
    } catch (error) {
      message.error("Không thể tải danh mục.");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (categoryID) => {
    const success = await deleteCategory(categoryID);
    if (success && success.isSuccess) {
      message.success("Xóa danh mục thành công!");
      setCategories(categories.filter((cat) => cat.categoryID !== categoryID));
    } else {
      message.error("Không thể xóa danh mục.");
    }
  };

  const handleCreate = async (values) => {
    try {
      // Check if category name already exists
      const existingCategory = await getCategoryByName(
        values.categoryName,
        1,
        1
      );
      if (
        existingCategory &&
        existingCategory.isSuccess &&
        existingCategory.result.length > 0
      ) {
        message.error("Tên danh mục đã tồn tại. Vui lòng chọn tên khác!");
        return;
      }

      const response = await createCategory(
        values.categoryName,
        values.categoryDescription
      );
      if (response && response.isSuccess) {
        message.success("Tạo danh mục thành công!");
        setCategories([...categories, response.result]);
        setModalVisible(false);
        form.resetFields();
      } else {
        const errorMessage = response.messages
          ? response.messages[0]
          : "Không thể tạo danh mục.";
        message.error(errorMessage);
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tạo danh mục!");
      console.error("Error creating category:", error);
    }
  };

  const handleSearch = async (values) => {
    const data = await getCategoryByName(values.filter || "", 1, 10);
    if (data && data.isSuccess) {
      setCategories(data.result);
    } else {
      message.error("Không thể tìm kiếm danh mục.");
    }
  };

  const handleUpdate = async (values) => {
    if (!selectedCategory || !selectedCategory.categoryID) {
      message.error("Danh mục được chọn không hợp lệ.");
      return;
    }

    const response = await updateCategory(
      selectedCategory.categoryID,
      values.categoryName,
      values.categoryDescription
    );

    if (response && response.isSuccess) {
      message.success("Cập nhật danh mục thành công!");
      setCategories(
        categories.map((cat) =>
          cat.categoryID === selectedCategory.categoryID
            ? { ...cat, ...values }
            : cat
        )
      );
      setModalVisible(false);
      setSelectedCategory(null);
      form.resetFields();
    } else {
      const errorMessage = response.messages
        ? response.messages[0]
        : "Không thể cập nhật danh mục.";
      message.error(errorMessage);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
    setIsUpdating(true);
    form.setFieldsValue({
      categoryName: category.categoryName,
      categoryDescription: category.categoryDescription,
    });
  };

  if (loading) {
    return <LoadingComponent />;
  }

  const pageHeaderStyle = {
    background: token.colorBgContainer,
    padding: "16px 24px",
    borderRadius: token.borderRadius,
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
    marginBottom: 16,
  };

  const cardStyle = {
    borderRadius: token.borderRadius,
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
  };

  return (
    <div
      style={{
        padding: 24,
        background: token.colorBgLayout,
        minHeight: "100vh",
      }}
    >
      {/* Page Header */}
      <div style={pageHeaderStyle}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, fontSize: 24 }}>
              Quản lý danh mục
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setModalVisible(true);
                setIsUpdating(false);
                form.resetFields();
              }}
              style={{
                height: 40,
                borderRadius: token.borderRadius,
                padding: "0 24px",
              }}
            >
              Tạo danh mục
            </Button>
          </Col>
        </Row>
      </div>

      {/* Search Section */}
      <Card style={{ ...cardStyle, marginBottom: 16 }}>
        <Form layout="inline" onFinish={handleSearch}>
          <Row gutter={16} style={{ width: "100%" }}>
            <Col flex="auto">
              <Form.Item
                name="filter"
                style={{ marginBottom: 0, width: "100%" }}
              >
                <Input
                  prefix={
                    <SearchOutlined
                      style={{ color: token.colorTextSecondary }}
                    />
                  }
                  placeholder="Tìm kiếm theo tên danh mục"
                  allowClear
                  size="large"
                  style={{ borderRadius: token.borderRadius }}
                />
              </Form.Item>
            </Col>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ borderRadius: token.borderRadius }}
              >
                Tìm kiếm
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Table Section */}
      <Card style={cardStyle}>
        <Table
          dataSource={categories}
          rowKey="categoryID"
          columns={[
            {
              title: "Tên danh mục",
              dataIndex: "categoryName",
              width: "30%",
              ellipsis: true,
            },
            {
              title: "Mô tả",
              dataIndex: "categoryDescription",
              width: "50%",
              ellipsis: true,
            },
            {
              title: "Hành động",
              width: "20%",
              align: "center",
              render: (_, record) => (
                <Space>
                  <Button
                    type="primary"
                    ghost
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(record)}
                    style={{ borderRadius: token.borderRadius }}
                  >
                    Sửa
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(record.categoryID)}
                    style={{ borderRadius: token.borderRadius }}
                  >
                    Xóa
                  </Button>
                </Space>
              ),
            },
          ]}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} danh mục`,
            style: { marginTop: 16 },
          }}
          style={{ borderRadius: token.borderRadius }}
        />
      </Card>

      {/* Modal */}
      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            {isUpdating ? "Cập nhật danh mục" : "Tạo danh mục mới"}
          </Title>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedCategory(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
        destroyOnClose
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={isUpdating ? handleUpdate : handleCreate}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="Tên danh mục"
            name="categoryName"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input
              placeholder="Nhập tên danh mục"
              size="large"
              style={{ borderRadius: token.borderRadius }}
            />
          </Form.Item>
          <Form.Item
            label="Mô tả danh mục"
            name="categoryDescription"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả danh mục!" },
            ]}
          >
            <Input.TextArea
              placeholder="Nhập mô tả danh mục"
              rows={4}
              showCount
              maxLength={500}
              style={{ borderRadius: token.borderRadius }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Row justify="end" gutter={16}>
              <Col>
                <Button
                  onClick={() => {
                    setModalVisible(false);
                    setSelectedCategory(null);
                    form.resetFields();
                  }}
                  style={{ borderRadius: token.borderRadius }}
                >
                  Hủy
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ borderRadius: token.borderRadius }}
                >
                  {isUpdating ? "Cập nhật" : "Tạo mới"}
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageCategory;
