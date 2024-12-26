import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Select,
  Upload,
  message,
} from "antd";
import React, { useState } from "react";
import { createStaff } from "../../../../api/accountApi";

const { Option } = Select;

const CreateStaffForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("FirstName", values.FirstName);
    formData.append("LastName", values.LastName);
    formData.append("Email", values.Email);
    formData.append("PhoneNumber", values.PhoneNumber);
    formData.append("JobTitle", values.JobTitle);
    formData.append("Department", values.Department);
    formData.append("StaffStatus", values.StaffStatus);
    formData.append("HireDate", values.HireDate.format()); // Format as ISO string
    formData.append("IsAdmin", values.IsAdmin);

    if (fileList.length > 0) {
      formData.append("Img", fileList[0].originFileObj);
    }

    const result = await createStaff(formData);
    if (result) {
      message.success("Tạo nhân viên thành công!");
      form.resetFields();
      setFileList([]); // Clear file input
    } else {
      message.error("Tạo nhân viên thất bại.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">
        TẠO TÀI KHOẢN NHÂN VIÊN
      </h2>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{
          IsAdmin: false,
        }}
      >
        <Form.Item
          label="Tên"
          name="FirstName"
          rules={[{ required: true, message: "Vui lòng nhập tên của bạn!" }]}
        >
          <Input placeholder="Nhập tên" />
        </Form.Item>

        <Form.Item
          label="Họ"
          name="LastName"
          rules={[{ required: true, message: "Vui lòng nhập họ của bạn!" }]}
        >
          <Input placeholder="Nhập họ" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Vui lòng nhập email hợp lệ!",
            },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="PhoneNumber"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại của bạn!" },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Chức vụ"
          name="JobTitle"
          rules={[
            { required: true, message: "Vui lòng nhập chức vụ của bạn!" },
          ]}
        >
          <Input placeholder="Nhập chức vụ" />
        </Form.Item>

        <Form.Item
          label="Phòng ban"
          name="Department"
          rules={[
            { required: true, message: "Vui lòng nhập phòng ban của bạn!" },
          ]}
        >
          <Input placeholder="Nhập phòng ban" />
        </Form.Item>

        <Form.Item
          label="Trạng thái nhân viên"
          name="StaffStatus"
          rules={[
            { required: true, message: "Vui lòng chọn trạng thái nhân viên!" },
          ]}
        >
          <Select placeholder="Chọn trạng thái nhân viên">
            <Option value="active">Hoạt động</Option>
            <Option value="suspended">Đình chỉ</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Ngày tuyển dụng"
          name="HireDate"
          rules={[
            { required: true, message: "Vui lòng chọn ngày tuyển dụng!" },
          ]}
        >
          <DatePicker showTime placeholder="Chọn ngày tuyển dụng" />
        </Form.Item>

        <Form.Item name="IsAdmin" valuePropName="checked">
          <Checkbox>Là quản trị viên</Checkbox>
        </Form.Item>

        <Form.Item
          label="Tải lên hình ảnh"
          valuePropName="fileList"
          getValueFromEvent={handleFileChange}
        >
          <Upload
            beforeUpload={() => false} // Prevent automatic upload
            onChange={handleFileChange}
            fileList={fileList}
          >
            <Button icon={<UploadOutlined />}>Tải lên</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Tạo Nhân Viên
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateStaffForm;
