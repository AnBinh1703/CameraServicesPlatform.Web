import { EyeOutlined } from "@ant-design/icons";
import { Button, Modal, Spin, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { getAllCombos, getComboById } from "../../../api/comboApi";

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
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      setIsModalVisible(true);
    } else {
      console.error(response.messages);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedCombo(null);
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Danh sách combo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {combos.map((combo) => (
          <div
            key={combo.comboId}
            className={`p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ${
              combo.isDisable ? 'opacity-60' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">
                {combo.comboName}
              </h3>
              {combo.isDisable && (
                <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded">
                  Vô hiệu hóa
                </span>
              )}
            </div>
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
              <Tooltip title="Xem chi tiết">
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={() => handleViewDetails(combo.comboId)}
                  className="hover:scale-105 transition-transform duration-200"
                />
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title="Chi tiết Combo"
        visible={isModalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Đóng
          </Button>
        ]}
      >
        {selectedCombo && (
          <div className="space-y-6 p-4">
            <div className="grid grid-cols-3 items-center border-b pb-3">
              <label className="font-semibold text-gray-600">Tên Combo:</label>
              <p className="col-span-2 text-lg font-medium text-blue-600">
                {selectedCombo.comboName}
              </p>
            </div>
            <div className="grid grid-cols-3 items-center border-b pb-3">
              <label className="font-semibold text-gray-600">Giá Combo:</label>
              <p className="col-span-2 text-lg font-medium text-green-600">
                {formatCurrency(selectedCombo.comboPrice)}
              </p>
            </div>
            <div className="grid grid-cols-3 items-center border-b pb-3">
              <label className="font-semibold text-gray-600">Thời gian:</label>
              <p className="col-span-2 text-lg">
                {durationText[selectedCombo.durationCombo]}
              </p>
            </div>
            <div className="grid grid-cols-3 items-center border-b pb-3">
              <label className="font-semibold text-gray-600">Ngày tạo:</label>
              <p className="col-span-2 text-gray-700">
                {new Date(selectedCombo.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div className="grid grid-cols-3 items-center">
              <label className="font-semibold text-gray-600">Cập nhật:</label>
              <p className="col-span-2 text-gray-700">
                {new Date(selectedCombo.updatedAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div className="grid grid-cols-3 items-center border-b pb-3">
              <label className="font-semibold text-gray-600">Trạng thái:</label>
              <p className="col-span-2">
                {selectedCombo.isDisable ? (
                  <span className="text-red-600 font-medium">Vô hiệu hóa</span>
                ) : (
                  <span className="text-green-600 font-medium">Đang hoạt động</span>
                )}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ComboList;
