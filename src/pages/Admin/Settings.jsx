import { InfoCircleOutlined, PlusOutlined, UpOutlined } from "@ant-design/icons";
import {
  Alert,
  BackTop,
  Button,
  Card,
  Form,
  InputNumber,
  message,
  Modal,
  Select,
  Table,
  Tooltip,
  Typography,
  Space,
  Divider,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  createSystemAdmin,
  getAllSystemAdmins,
  getNewCancelAcceptValue,
  getNewCancelValue,
  getNewReservationMoney,
} from "../../services/systemAdminService";

const { Title, Text } = Typography;

const Settings = () => {
  const [form] = Form.useForm();
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSettings, setCurrentSettings] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalForm] = Form.useForm();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const timeUnitOptions = [
    { value: 0, label: "Giờ" },
    { value: 1, label: "Ngày" },
  ];

  const getTimeUnitDisplay = (value, unit) => {
    const timeUnit = unit === 0 ? "giờ" : "ngày";
    return `${value} ${timeUnit}`;
  };

  const columns = [
    {
      title: <Text strong>Tiền Giữ Chỗ</Text>,
      dataIndex: "reservationMoney",
      key: "reservationMoney",
      render: (value) => formatCurrency(value),
      className: 'whitespace-nowrap',
    },
    {
      title: <Text strong>Đơn Vị Thời Gian Hủy Đơn Hàng</Text>,
      dataIndex: "cancelDurationUnit",
      key: "cancelDurationUnit",
      render: (value) => (value === 0 ? "Giờ" : "Ngày"),
      className: 'whitespace-nowrap',
    },
    {
      title: <Text strong>Thời Gian Cho Phép Khách Hàng Hủy Đơn Hàng</Text>,
      dataIndex: "cancelVaule",
      key: "cancelVaule",
      render: (value, record) =>
        getTimeUnitDisplay(value, record.cancelDurationUnit),
    },
    {
      title: <Text strong>Đơn Vị Thời Gian Hủy Đơn Hàng Bởi Nhà Cung Cấp</Text>,
      dataIndex: "cancelAcceptDurationUnit",
      key: "cancelAcceptDurationUnit",
      render: (value) => (value === 0 ? "Giờ" : "Ngày"),
    },
    {
      title: <Text strong>Thời Gian Tối Đa Chờ Đồng Ý Hủy Bởi Nhà Cung Cấp</Text>,
      dataIndex: "cancelAcceptVaule",
      key: "cancelAcceptVaule",
      render: (value, record) =>
        getTimeUnitDisplay(value, record.cancelAcceptDurationUnit),
    },
    {
      title: <Text strong>Ngày Cập Nhật</Text>,
      dataIndex: "reservationMoneyCreatedAt",
      key: "reservationMoneyCreatedAt",
      render: (text) => new Date(text).toLocaleString("vi-VN"),
    },
  ];

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getAllSystemAdmins(1, 10);
      setSettings(response.result.items);

      // Fetch current settings
      const [reservationMoney, cancelValue, cancelAcceptValue] =
        await Promise.all([
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
      message.error("Không thể tải cài đặt hệ thống");
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
      if (values.cancelVaule > 100 || values.cancelAcceptVaule > 100) {
        message.error("Giá trị phần trăm không thể vượt quá 100%");
        return;
      }
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
    <div className="p-6 max-w-7xl mx-auto">
      <Card 
        className="shadow-md rounded-lg"
        title={
          <Space direction="vertical" size="small">
            <Title level={4} className="m-0">Cài Đặt Hệ Thống</Title>
            <Text type="secondary">Quản lý thông số và cấu hình hệ thống</Text>
          </Space>
        }
        extra={
          <Button
            type="primary"
            onClick={() => setIsModalVisible(true)}
            className="bg-blue-600 hover:bg-blue-500"
            icon={<PlusOutlined />}
          >
            Thêm Cài Đặt Mới
          </Button>
        }
      >
        <Space direction="vertical" className="w-full" size="large">
          <Alert
            message="Lưu ý"
            description="Các cài đặt này sẽ ảnh hưởng trực tiếp đến hoạt động của hệ thống."
            type="info"
            showIcon
            className="mb-4"
          />
          
          <Table
            columns={columns}
            dataSource={settings}
            rowKey="systemAdminID"
            loading={loading}
            className="border rounded-lg shadow-sm"
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Tổng số: ${total} cài đặt`,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['5', '10', '20'],
            }}
          />
        </Space>
      </Card>

      <Modal
        title={
          <Space direction="vertical" size={0}>
            <Title level={4} className="m-0">Thêm Cài Đặt Mới</Title>
            <Text type="secondary">Nhập thông tin cho cài đặt mới</Text>
          </Space>
        }
        open={isModalVisible}
        onOk={handleModalSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          modalForm.resetFields();
        }}
        confirmLoading={loading}
        okText="Xác Nhận"
        cancelText="Hủy"
        width={700}
        className="top-20"
        destroyOnClose
      >
        <Divider />
        <Form 
          form={modalForm} 
          layout="vertical"
          className="max-w-2xl mx-auto"
        >
          <Space direction="vertical" className="w-full" size="large">
            {/* Money Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <Title level={5} className="mb-4">Cài Đặt Tiền Giữ Chỗ</Title>
              <Form.Item
                label={
                  <span>
                    Tiền Giữ Chỗ{" "}
                    <Tooltip title="Số tiền khách hàng phải đặt trước để giữ chỗ thiết bị">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                name="reservationMoney"
                rules={[
                  { required: true, message: "Vui lòng nhập tiền đặt cọc" },
                  { type: "number", min: 0, message: "Tiền đặt cọc không thể âm" },
                ]}
              >
                <InputNumber
                  className="w-full"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Nhập tiền đặt cọc"
                  addonAfter="VNĐ"
                  size="large"
                />
              </Form.Item>
            </div>

            {/* Customer Cancel Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <Title level={5} className="mb-4">Cài Đặt Hủy Đơn Hàng</Title>
              <Space direction="vertical" className="w-full">
                <Form.Item
                  label={
                    <span>
                      Đơn Vị Thời Gian{" "}
                      <Tooltip title="Chọn đơn vị thời gian (giờ/ngày)">
                        <InfoCircleOutlined />
                      </Tooltip>
                    </span>
                  }
                  name="cancelDurationUnit"
                  rules={[
                    { required: true, message: "Vui lòng chọn đơn vị thời gian" },
                  ]}
                >
                  <Select
                    options={timeUnitOptions}
                    placeholder="Chọn đơn vị thời gian"
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span>
                      Thời Gian Cho Phép Hủy{" "}
                      <Tooltip title="Khoảng thời gian cho phép khách hàng hủy đơn">
                        <InfoCircleOutlined />
                      </Tooltip>
                    </span>
                  }
                  name="cancelVaule"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập thời gian cho phép hủy",
                    },
                    { type: "number", min: 1, message: "Thời gian phải lớn hơn 0" },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    placeholder="Nhập thời gian cho phép hủy"
                    size="large"
                  />
                </Form.Item>
              </Space>
            </div>

            {/* Provider Cancel Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <Title level={5} className="mb-4">Cài Đặt Hủy Đơn Hàng Bởi Nhà Cung Cấp</Title>
              <Space direction="vertical" className="w-full">
                <Form.Item
                  label={
                    <span>
                      Đơn Vị Thời Gian{" "}
                      <Tooltip title="Chọn đơn vị thời gian (giờ/ng��y)">
                        <InfoCircleOutlined />
                      </Tooltip>
                    </span>
                  }
                  name="cancelAcceptDurationUnit"
                  rules={[
                    { required: true, message: "Vui lòng chọn đơn vị thời gian" },
                  ]}
                >
                  <Select
                    options={timeUnitOptions}
                    placeholder="Chọn đơn vị thời gian"
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span>
                      Thời Gian Đồng Ý Hủy{" "}
                      <Tooltip title="Khoảng thời gian cho phép chấp nhận yêu cầu hủy">
                        <InfoCircleOutlined />
                      </Tooltip>
                    </span>
                  }
                  name="cancelAcceptVaule"
                  rules={[
                    { required: true, message: "Vui lòng nhập thời gian đồng ý hủy" },
                    { type: "number", min: 1, message: "Thời gian phải lớn hơn 0" },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    placeholder="Nhập thời gian đồng ý hủy"
                    size="large"
                  />
                </Form.Item>
              </Space>
            </div>
          </Space>
        </Form>
      </Modal>

      <BackTop>
        <div className="bg-blue-600 text-white p-3 rounded-full shadow-lg">
          <UpOutlined />
        </div>
      </BackTop>
    </div>
  );
};

export default Settings;
