import React from "react";
import { Modal, Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UpdateSupplierModal = ({
  isModalVisible,
  handleCancel,
  handleUpdateSupplier,
  supplierInfo,
  fileList,
  handleUploadChange,
}) => {
  return (
    <Modal
      title="Cập nhật thông tin nhà cung cấp"
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        layout="vertical"
        onFinish={handleUpdateSupplier}
        initialValues={supplierInfo}
      >
        <Form.Item
          label="Tên nhà cung cấp"
          name="supplierName"
          rules={[
            { required: true, message: "Vui lòng nhập tên nhà cung cấp!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="supplierDescription"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          name="supplierAddress"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="contactNumber"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Logo nhà cung cấp"
          name="supplierLogo"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload
            listType="picture"
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />}>Chọn logo</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật thông tin
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateSupplierModal;
