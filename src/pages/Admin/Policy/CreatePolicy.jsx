import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, DatePicker, Divider, Form, Input, message, Select, Space, Tooltip } from "antd";
import React from "react";
import { createPolicy } from "../../../api/policyApi";

const CreatePolicy = ({ onClose, fetchPolicies }) => {
  const [form] = Form.useForm();

  const policyTypes = [
    { value: 0, label: "Hệ thống" },
    { value: 1, label: "Nhà cung cấp" },
    { value: 2, label: "Thành viên" },
  ];

  const applicableObjects = [
    { value: 0, label: "Hệ thống" },
    { value: 1, label: "Nhà cung cấp" },
    { value: 2, label: "Thành viên" },
  ];

  const handleSubmit = async (values) => {
    const response = await createPolicy(values);
    if (response) {
      message.success("Policy created successfully!");
      form.resetFields();
      fetchPolicies(); // Fetch updated policies
      onClose(); // Close the modal after creating
    } else {
      message.error("Error creating policy.");
    }
  };

  return (
    <Form 
      form={form} 
      onFinish={handleSubmit} 
      layout="vertical"
      className="max-w-2xl mx-auto"
    >
      <Divider />
      <Space direction="vertical" className="w-full" size="large">
        <div className="bg-gray-50 p-6 rounded-lg">
          <Form.Item
            name="policyType"
            label={
              <span className="text-base">
                Loại Chính Sách{" "}
                <Tooltip title="Chọn loại chính sách áp dụng">
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: "Vui lòng chọn loại chính sách!" }]}
          >
            <Select
              placeholder="Chọn loại chính sách"
              options={policyTypes}
              className="w-full"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="policyContent"
            label={
              <span className="text-base">
                Nội Dung Chính Sách{" "}
                <Tooltip title="Nhập nội dung chi tiết của chính sách">
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: "Vui lòng nhập nội dung chính sách!" }]}
          >
            <Input.TextArea 
              rows={4}
              placeholder="Nhập nội dung chính sách"
              className="w-full"
              autoSize={{ minRows: 4, maxRows: 8 }}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="applicableObject"
            label={
              <span>
                Đối Tượng Áp Dụng{" "}
                <Tooltip title="Chọn đối tượng áp dụng chính sách">
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: "Vui lòng chọn đối tượng áp dụng!" }]}
          >
            <Select
              placeholder="Chọn đối tượng áp dụng"
              options={applicableObjects}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="effectiveDate"
            label={
              <span>
                Ngày Hiệu Lực{" "}
                <Tooltip title="Chọn ngày chính sách bắt đầu có hiệu lực">
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: "Vui lòng chọn ngày hiệu lực!" }]}
          >
            <DatePicker 
              className="w-full"
              format="DD/MM/YYYY HH:mm"
              showTime
              placeholder="Chọn ngày hiệu lực"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="value"
            label={
              <span>
                Giá Trị{" "}
                <Tooltip title="Chọn giá trị của chính sách">
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: "Vui lòng nhập giá trị!" }]}
          >
            <DatePicker 
              className="w-full"
              format="DD/MM/YYYY HH:mm"
              showTime
              placeholder="Chọn giá trị"
              size="large"
            />
          </Form.Item>
        </div>

        <Form.Item className="flex justify-end mt-6">
          <Space size="middle">
            <Button size="large" onClick={onClose}>
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              className="bg-blue-600 hover:bg-blue-500"
            >
              Tạo Chính Sách
            </Button>
          </Space>
        </Form.Item>
      </Space>
    </Form>
  );
};

export default CreatePolicy;
