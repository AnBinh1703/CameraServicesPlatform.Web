import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Spin, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import {
  createCombo,
  getAllCombos,
  getComboById,
  updateCombo,
} from "../../../api/comboApi";

const { Option } = Select;

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const durationText = {
  0: "1 tháng",
  1: "2 tháng",
  2: "3 tháng",
  3: "5 tháng",
};

const ComboList = ({ refresh }) => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [newCombo, setNewCombo] = useState({
    comboName: "",
    comboPrice: 0,
    durationCombo: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCombos = async () => {
      setLoading(true);
      const response = await getAllCombos();
      if (response.isSuccess) {
        setCombos(response.result);
      } else {
        console.error(response.messages);
      }
      setLoading(false);
    };

    fetchCombos();
  }, [refresh]);

  const handleViewDetails = async (comboId) => {
    const response = await getComboById(comboId);
    if (response.isSuccess) {
      setSelectedCombo(response.result);
      setIsUpdateMode(true);
      setIsModalVisible(true);
      form.setFieldsValue({
        comboName: response.result.comboName,
        comboPrice: response.result.comboPrice,
        durationCombo: response.result.durationCombo,
      });
    } else {
      console.error(response.messages);
    }
  };

  const handleCreateCombo = async (values) => {
    const response = await createCombo(values);
    if (response.isSuccess) {
      setCombos([...combos, response.result]);
      closeModal();
    } else {
      console.error(response.messages);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (isUpdateMode) {
        const updatedCombo = {
          ...selectedCombo,
          ...values,
        };
        await handleUpdateCombo(updatedCombo);
      } else {
        await handleCreateCombo(values);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleUpdateCombo = async (updatedCombo) => {
    const response = await updateCombo(updatedCombo);
    if (response.isSuccess) {
      setCombos(
        combos.map((combo) =>
          combo.comboId === updatedCombo.comboId ? response.result : combo
        )
      );
      closeModal();
    } else {
      console.error(response.messages);
    }
  };

  const openCreateModal = () => {
    setIsUpdateMode(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedCombo(null);
    form.resetFields();
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <PlusOutlined className="mr-2" /> Danh sách combo
      </h2>
      <div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
          className="mb-4"
        >
          Tạo Combo Mới
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {combos.map((combo) => (
          <div
            key={combo.comboId}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            onDoubleClick={() => handleViewDetails(combo.comboId)}
          >
            <h3 className="text-xl font-semibold text-blue-600 mb-3">
              {combo.comboName}
            </h3>
            <div className="space-y-2">
              <p className="text-lg font-medium">
                <span className="text-gray-600">Giá: </span>
                <span className="text-green-600">
                  {formatCurrency(combo.comboPrice)}
                </span>
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Thời gian: </span>
                {durationText[combo.durationCombo]}
              </p>
              <div className="text-sm text-gray-500">
                <p>
                  Ngày tạo:{" "}
                  {new Date(combo.createdAt).toLocaleDateString("vi-VN")}
                </p>
                <p>
                  Cập nhật:{" "}
                  {new Date(combo.updatedAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Tooltip title="Chỉnh sửa">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => handleViewDetails(combo.comboId)}
                  className="hover:scale-105 transition-transform duration-200"
                />
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={isUpdateMode ? "Cập nhật Combo" : "Tạo Combo Mới"}
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <Form.Item
            name="comboName"
            label="Tên Gói"
            rules={[{ required: true, message: "Vui lòng nhập tên gói!" }]}
          >
            <Input className="w-full" placeholder="Nhập tên Gói" />
          </Form.Item>
          <Form.Item
            name="comboPrice"
            label="Giá Gói (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập giá gói!" }]}
          >
            <Input
              type="number"
              className="w-full"
              placeholder="Nhập giá gói"
              min={0}
              step={1000}
            />
          </Form.Item>
          <Form.Item
            name="durationCombo"
            label="Thời gian"
            rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}
          >
            <Select placeholder="Chọn thời gian">
              {Object.entries(durationText).map(([key, value]) => (
                <Option key={key} value={Number(key)}>
                  {value}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit" className="w-full">
              {isUpdateMode ? "Cập nhật" : "Tạo"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ComboList;
