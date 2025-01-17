import { Button, DatePicker, Form, Input, InputNumber, message } from "antd";
import moment from "moment";
import React from "react";
import { createReturnDetail } from "../../../api/returnDetailApi"; // Adjust the import path according to your project structure

const CreateReturnDetailForm = ({ orderID, onSuccess }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const data = {
      orderID,
      returnDate: values.returnDate.toISOString(),
      condition: values.condition,
      penaltyApplied: values.penaltyApplied,
    };

    const result = await createReturnDetail(data);
    if (result) {
      message.success("Chi tiết trả hàng đã được tạo thành công!");
      form.resetFields();
      if (onSuccess) {
        onSuccess();
      }
    } else {
      message.error("Không thể tạo chi tiết trả hàng.");
    }
  };

  const setCurrentTime = () => {
    form.setFieldsValue({ returnDate: moment() });
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="returnDate"
        label="Ngày trả hàng"
        rules={[{ required: true, message: "Vui lòng chọn ngày trả hàng" }]}
        initialValue={moment()} // Set the default value to the current date and time
      >
        <DatePicker showTime format="DD-MM-YYYY HH:mm:ss" />
      </Form.Item>
      <Button onClick={setCurrentTime}>Đặt thời gian hiện tại</Button>

      <Form.Item
        name="condition"
        label="Tình trạng"
        rules={[{ required: true, message: "Vui lòng nhập tình trạng" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="penaltyApplied"
        label="Phụ thu"
        rules={[
          { required: true, message: "Vui lòng nhập số tiền phạt áp dụng" },
        ]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Tạo chi tiết trả hàng
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateReturnDetailForm;
