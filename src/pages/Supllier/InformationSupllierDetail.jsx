import { Button, Form, Input, message, Spin, Card, Avatar, Row, Col, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSupplierIdByAccountId } from "../../api/accountApi"; // Đảm bảo rằng đây là đường dẫn nhập đúng
import { getSupplierById, updateSupplier } from "../../api/supplierApi";
import ProductCardViewOfSupplier from "../Common/Product/ProductCardViewOfSupplier";

const { Title, Text } = Typography;

const InformationSupplierDetail = () => {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const role = useSelector((state) => state.user.role || "");
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);

  // Hàm lấy supplierId từ accountId của người dùng hiện tại
  const fetchSupplierId = async () => {
    if (user.id) {
      const response = await getSupplierIdByAccountId(user.id);
      if (response?.isSuccess) {
        setSupplierId(response.result); // Lưu supplierId từ phản hồi API
      } else {
      }
    }
  };

  useEffect(() => {
    fetchSupplierId();
  }, [user]);

  useEffect(() => {
    const fetchSupplierDetails = async () => {
      setLoading(true);
      const response = await getSupplierById(id);
      if (response && response.isSuccess) {
        const supplierData = response.result.items[0];
        setSupplier(supplierData);
        form.setFieldsValue(supplierData);
      } else {
        message.error("Lấy thông tin nhà cung cấp thất bại.");
      }
      setLoading(false);
    };

    fetchSupplierDetails();
  }, [id, form]);

  const handleUpdateSupplier = async (values) => {
    const formData = new FormData();
    formData.append("SupplierID", supplier.supplierID);
    formData.append("SupplierName", values.supplierName);
    formData.append("SupplierDescription", values.supplierDescription);
    formData.append("SupplierAddress", values.supplierAddress);
    formData.append("ContactNumber", values.contactNumber);

    const logoFile = values.supplierLogo?.file;
    if (logoFile) {
      formData.append("SupplierLogo", logoFile);
    }

    const response = await updateSupplier(formData);
    if (response && response.isSuccess) {
      message.success("Cập nhật nhà cung cấp thành công!");
      setIsEditing(false);
      setSupplier({ ...supplier, ...values });
      form.resetFields();
    } else {
      message.error("Cập nhật nhà cung cấp thất bại.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="text-center p-8">
        <Text type="secondary">Không tìm thấy dữ liệu nhà cung cấp.</Text>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="shadow-md">
        <div className="mb-6">
          <Title level={2} className="text-center mb-8">
            Thông Tin Nhà Cung Cấp
          </Title>

          {isEditing ? (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateSupplier}
              className="max-w-2xl mx-auto"
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Tên Nhà Cung Cấp"
                    name="supplierName"
                    rules={[{ required: true, message: "Vui lòng nhập tên nhà cung cấp!" }]}
                  >
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Mô Tả"
                    name="supplierDescription"
                    rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Địa Chỉ"
                    name="supplierAddress"
                    rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Số Điện Thoại"
                    name="contactNumber"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Logo Nhà Cung Cấp" name="supplierLogo">
                    <Input type="file" accept="image/*" className="p-2" />
                  </Form.Item>
                </Col>
              </Row>

              <div className="flex justify-center gap-4 mt-6">
                <Button type="primary" htmlType="submit" size="large">
                  Cập Nhật
                </Button>
                <Button size="large" onClick={() => setIsEditing(false)}>
                  Hủy
                </Button>
              </div>
            </Form>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <Avatar
                  size={120}
                  src={supplier.supplierLogo}
                  className="mb-4"
                />
                <Title level={3}>{supplier.supplierName}</Title>
              </div>

              <Card className="bg-gray-50">
                <Row gutter={[16, 24]}>
                  <Col span={24}>
                    <div className="mb-4">
                      <Text strong className="text-gray-600">Mô Tả</Text>
                      <div className="mt-2 p-3 bg-white rounded">
                        {supplier.supplierDescription}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <Text strong className="text-gray-600">Địa Chỉ</Text>
                    <div className="mt-2 p-3 bg-white rounded">
                      {supplier.supplierAddress}
                    </div>
                  </Col>
                  <Col span={12}>
                    <Text strong className="text-gray-600">Liên Hệ</Text>
                    <div className="mt-2 p-3 bg-white rounded">
                      {supplier.contactNumber}
                    </div>
                  </Col>
                </Row>
              </Card>

              {supplierId === supplier.supplierID && (
                <div className="text-center mt-6">
                  <Button type="primary" size="large" onClick={() => setIsEditing(true)}>
                    Chỉnh Sửa Thông tin
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
      
      <div className="mt-8">
        <ProductCardViewOfSupplier />
      </div>
    </div>
  );
};

export default InformationSupplierDetail;
