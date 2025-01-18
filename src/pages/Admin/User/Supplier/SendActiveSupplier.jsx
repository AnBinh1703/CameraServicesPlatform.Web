import { Button, Form, Input, message, Typography } from "antd";
import React, { useState } from "react";
import { sendOTP } from "../../../../api/accountApi";

const { Title } = Typography;

const SendActivationCode = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendActivation = async () => {
    if (!email) {
      message.error("Vui lòng nhập email của nhà cung cấp"); // Dịch thông báo lỗi
      return;
    }

    setLoading(true);
    console.log("Gửi email đến:", email);

    const result = await sendOTP(email);
    if (result) {
      message.success("Mã kích hoạt đã được gửi thành công!");
    } else {
      message.error("Gửi mã kích hoạt thất bại");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <Title level={3} style={{ textAlign: "center" }}>
        Gửi Mã Kích Hoạt
      </Title>
      <Form layout="vertical">
        <Form.Item label="Email của Nhà Cung Cấp">
          <Input
            type="email"
            placeholder="Nhập email của nhà cung cấp"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            block
            onClick={handleSendActivation}
            loading={loading}
          >
            Gửi Mã Kích Hoạt
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SendActivationCode;
