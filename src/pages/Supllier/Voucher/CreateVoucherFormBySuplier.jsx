import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { createVoucher } from "../../../api/voucherApi";

const CreateVoucherFormBySuplier = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);

  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user.id) {
        try {
          const response = await getSupplierIdByAccountId(user.id);
          if (response?.isSuccess) {
            setSupplierId(response.result);
          } else {
            message.error("Lấy mã nhà cung cấp không thành công.");
          }
        } catch (error) {
          message.error("Lỗi khi lấy mã nhà cung cấp.");
        }
      }
    };

    fetchSupplierId();
  }, [user.id]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await createVoucher({
        supplierID: supplierId,
        vourcherCode: values.vourcherCode,
        discountAmount: values.discountAmount,
        description: values.description,
        validFrom: values.validFrom,
        expirationDate: values.expirationDate,
      });
      if (response.isSuccess) {
        message.success("Tạo voucher thành công!");
      } else {
        message.error(response.messages.join(", "));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center">
      <Col span={12}>
        <Card
          title="Tạo Voucher"
          bordered={false}
          className="bg-gray-100 p-4 rounded-lg"
        >
          <Form onFinish={onFinish} layout="vertical">
            <Form.Item
              name="vourcherCode"
              label="Mã Voucher"
              rules={[{ required: true, message: "Vui lòng nhập mã voucher!" }]}
            >
              <Input placeholder="Nhập mã voucher" />
            </Form.Item>

            <Form.Item
              name="discountAmount"
              label="Số Tiền Giảm"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số tiền giảm!",
                },
              ]}
            >
              <InputNumber
                min={0}
                className="w-full"
                placeholder="Nhập số tiền giảm"
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô Tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <Input.TextArea rows={4} placeholder="Nhập mô tả voucher" />
            </Form.Item>

            <Form.Item
              name="validFrom"
              label="Ngày Bắt Đầu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngày bắt đầu hợp lệ!",
                },
              ]}
            >
              <DatePicker
                showTime
                className="w-full"
                placeholder="Chọn ngày bắt đầu"
              />
            </Form.Item>

            <Form.Item
              name="expirationDate"
              label="Ngày Hết Hạn"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngày hết hạn!",
                },
              ]}
            >
              <DatePicker
                showTime
                className="w-full"
                placeholder="Chọn ngày hết hạn"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="bg-blue-500 border-blue-500 hover:bg-blue-600"
              >
                Tạo Voucher
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default CreateVoucherFormBySuplier;
