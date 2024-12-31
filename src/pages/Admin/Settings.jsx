import React, { useState, useEffect } from "react";
import {
  getAllSystemAdmins,
  createSystemAdmin,
  getNewCancelAcceptValue,
  getNewCancelValue,
  getNewReservationMoney,
} from "../../services/systemAdminService";
import { Card, Form, Input, Button, Table, message, Modal } from "antd";

const Settings = () => {
  const [form] = Form.useForm();
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSettings, setCurrentSettings] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalForm] = Form.useForm();

  const columns = [
    {
      title: "Tiền Đặt Cọc",
      dataIndex: "reservationMoney",
      key: "reservationMoney",
    },
    {
      title: "Đơn Vị Thời Gian Hủy",
      dataIndex: "cancelDurationUnit",
      key: "cancelDurationUnit",
    },
    {
      title: "Giá Trị Hủy",
      dataIndex: "cancelVaule",
      key: "cancelVaule",
    },
    {
      title: "Đơn Vị Thời Gian Chấp Nhận Hủy",
      dataIndex: "cancelAcceptDurationUnit",
      key: "cancelAcceptDurationUnit",
    },
    {
      title: "Giá Trị Chấp Nhận Hủy",
      dataIndex: "cancelAcceptVaule",
      key: "cancelAcceptVaule",
    },
    {
      title: "Ngày Tạo",
      dataIndex: "reservationMoneyCreatedAt",
      key: "reservationMoneyCreatedAt",
      render: (text) => new Date(text).toLocaleString('vi-VN'),
    },
  ];

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getAllSystemAdmins(1, 10);
      setSettings(response.result.items);
      
      // Fetch current settings
      const [reservationMoney, cancelValue, cancelAcceptValue] = await Promise.all([
        getNewReservationMoney(),
        getNewCancelValue(),
        getNewCancelAcceptValue(),
      ]);
      
      setCurrentSettings({
        reservationMoney: reservationMoney.result.reservationMoney,
        cancelValue: cancelValue.result.cancelVaule,
        cancelAcceptValue: cancelAcceptValue.result.cancelAcceptVaule,
      });
    } catch (error) {
      message.error("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleModalSubmit = async () => {
    try {
      const values = await modalForm.validateFields();
      setLoading(true);
      await createSystemAdmin({
        ...values,
        reservationMoneyCreatedAt: new Date(),
        cancelVauleCreatedAt: new Date(),
        cancelAcceptVauleCreatedAt: new Date(),
      });
      message.success("Cập nhật cài đặt thành công");
      setIsModalVisible(false);
      modalForm.resetFields();
      fetchSettings();
    } catch (error) {
      message.error("Không thể cập nhật cài đặt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card title="Cài Đặt Hệ Thống" className="mb-6">
        <Button 
          type="primary" 
          onClick={() => setIsModalVisible(true)}
          className="mb-4"
        >
          Tạo Cài Đặt Mới
        </Button>

        <Table
          columns={columns}
          dataSource={settings}
          rowKey="systemAdminID"
          loading={loading}
        />
      </Card>

      <Modal
        title="Tạo Cài Đặt Mới"
        open={isModalVisible}
        onOk={handleModalSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          modalForm.resetFields();
        }}
        confirmLoading={loading}
        okText="Xác Nhận"
        cancelText="Hủy"
      >
        <Form form={modalForm} layout="vertical">
          <Form.Item
            label="Tiền Đặt Cọc"
            name="reservationMoney"
            rules={[{ required: true, message: 'Vui lòng nhập tiền đặt cọc' }]}
          >
            <Input type="number" placeholder="Nhập tiền đặt cọc" />
          </Form.Item>
          
          <Form.Item
            label="Đơn Vị Thời Gian Hủy"
            name="cancelDurationUnit"
            rules={[{ required: true, message: 'Vui lòng nhập đơn vị thời gian hủy' }]}
          >
            <Input type="number" placeholder="Nhập đơn vị thời gian hủy" />
          </Form.Item>
          
          <Form.Item
            label="Giá Trị Hủy"
            name="cancelVaule"
            rules={[{ required: true, message: 'Vui lòng nhập giá trị hủy' }]}
          >
            <Input type="number" placeholder="Nhập giá trị hủy" />
          </Form.Item>

          <Form.Item
            label="Đơn Vị Thời Gian Chấp Nhận Hủy"
            name="cancelAcceptDurationUnit"
            rules={[{ required: true, message: 'Vui lòng nhập đơn vị thời gian chấp nhận hủy' }]}
          >
            <Input type="number" placeholder="Nhập đơn vị thời gian chấp nhận hủy" />
          </Form.Item>
          
          <Form.Item
            label="Giá Trị Chấp Nhận Hủy"
            name="cancelAcceptVaule"
            rules={[{ required: true, message: 'Vui lòng nhập giá trị chấp nhận hủy' }]}
          >
            <Input type="number" placeholder="Nhập giá trị chấp nhận hủy" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Settings;
