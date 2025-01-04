import { AppstoreOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Modal, Table, Typography, Form, message } from "antd";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getComboById, createComboOfSupplier, getAllCombos } from "../../../api/comboApi";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import ComboRegistrationModal from "../Combo/ComboRegistrationModal";

const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const calculateRemainingTime = (endTime) => {
  const now = new Date();
  const end = new Date(endTime);
  const remainingTime = end - now;
  return remainingTime > 0 ? remainingTime : 0;
};

const durationMap = {
  0: 1,
  1: 2,
  2: 3,
  3: 5,
};

const ComboCarousel = ({ 
  combos: initialCombos, 
  totalCombos, 
  totalDuration
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comboDetails, setComboDetails] = useState(null);
  const [isComboModalVisible, setIsComboModalVisible] = useState(false);
  const [selectedComboId, setSelectedComboId] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [combos, setCombos] = useState(initialCombos || []);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.accountId) {
        try {
          const supplierResponse = await getSupplierIdByAccountId(user.accountId);
          if (supplierResponse?.isSuccess) {
            setSupplierId(supplierResponse.result);
          }
          
          const comboResponse = await getAllCombos();
          if (comboResponse?.isSuccess) {
            setCombos(comboResponse.result);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          message.error("Không thể tải dữ liệu.");
        }
      }
    };
    fetchData();
  }, [user]);

  const steps = [
    {
      title: "Chọn Gói",
      content: "Chọn gói dịch vụ",
    },
    {
      title: "Chọn thời gian",
      content: "Chọn thời gian bắt đầu",
    },
    {
      title: "Xác nhận",
      content: "Xác nhận thông tin",
    },
  ];

  const showComboModal = () => {
    setIsComboModalVisible(true);
  };

  const handleComboModalCancel = () => {
    setIsComboModalVisible(false);
    setCurrentStep(0);
  };

  const handleCardClick = (comboId) => {
    setSelectedComboId(comboId);
    form.setFieldsValue({ comboId });
  };

  const handleChoosePlan = (comboId) => {
    handleCardClick(comboId);
    next();
  };

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCreateCombo = async () => {
    setConfirmLoading(true);
    try {
      const comboData = {
        supplierID: supplierId,
        comboId: selectedComboId,
      };
      
      const response = await createComboOfSupplier(comboData);
      if (response?.isSuccess) {
        message.success("Tạo combo thành công.");
        form.resetFields();
        if (response.result) {
          window.location.href = response.result;
        }
      } else {
        message.error("Tạo combo thất bại.");
      }
    } catch (error) {
      console.error("Error creating combo:", error);
      message.error("Lỗi khi tạo combo.");
    } finally {
      setConfirmLoading(false);
      setIsComboModalVisible(false);
    }
  };

  const formatCurrency = (amount) => {
    return formatter.format(amount);
  };

  const viewDetails = async (id) => {
    try {
      const combo = await getComboById(id);
      setComboDetails(combo.result);
      console.log("Combo details:", combo.result); // Log combo details to verify
      setIsModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch combo details:", error);
      setComboDetails(null);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setComboDetails(null);
  };

  // Sort combos by startTime (latest first)
  const sortedCombos = [...combos].sort((a, b) => 
    new Date(b.startTime) - new Date(a.startTime)
  );

  const columns = [
    {
      title: "Tên Combo",
      dataIndex: "comboName",
      key: "comboName",
    },
    {
      title: "Giá Combo",
      dataIndex: "comboPrice",
      key: "comboPrice",
      render: (text) => formatter.format(text),
    },
    {
      title: "Bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      render: (text) => formatDateTime(text),
    },
    {
      title: "Kết Thúc",
      dataIndex: "endTime",
      key: "endTime",
      render: (text) => {
        const remainingTime = calculateRemainingTime(text);
        const isExpired = remainingTime <= 0;
        return (
          <span style={{ 
            color: isExpired ? '#ff4d4f' : '#52c41a',
            fontWeight: 'bold'
          }}>
            {isExpired 
              ? `${formatDateTime(text)} (Đã hết hạn)`
              : `${formatDateTime(text)} (Còn lại: ${Math.ceil(
                  remainingTime / (1000 * 60 * 60 * 24)
                )} ngày)`
            }
          </span>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Button onClick={() => viewDetails(record.comboId)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <AppstoreOutlined /> Gói Combo Đăng Kí
            </span>
            <Button type="primary" onClick={showComboModal}>
              Đăng Ký Gói Dịch Vụ
            </Button>
          </div>
        }
      >
        {sortedCombos.length > 0 ? (
          <>
            <Table
              dataSource={sortedCombos}
              columns={columns}
              rowKey="comboOfSupplierId"
              pagination={false}
              rowClassName={(record) => 
                calculateRemainingTime(record.endTime) <= 0 ? 'text-gray-400' : ''
              }
            />
            <Modal
              title="Chi tiết Combo"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              {comboDetails && (
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="Tên Combo">
                    {comboDetails.comboName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giá Combo">
                    {formatter.format(comboDetails.comboPrice)}
                  </Descriptions.Item>

                  <Descriptions.Item label="Thời lượng Combo">
                    {durationMap[comboDetails.durationCombo]} Tháng
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày tạo">
                    {formatDateTime(comboDetails.createdAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày cập nhật">
                    {formatDateTime(comboDetails.updatedAt)}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Modal>
          </>
        ) : (
          <Typography.Text>Không có Combo nào.</Typography.Text>
        )}
      </Card>

      <ComboRegistrationModal
        isComboModalVisible={isComboModalVisible}
        handleComboModalCancel={handleComboModalCancel}
        currentStep={currentStep}
        steps={steps}
        combos={combos}
        selectedComboId={selectedComboId}
        handleCardClick={handleCardClick}
        handleChoosePlan={handleChoosePlan}
        form={form}
        next={next}
        prev={prev}
        handleCreateCombo={handleCreateCombo}
        confirmLoading={confirmLoading}
        formatCurrency={formatCurrency}
      />
    </>
  );
};

export default ComboCarousel;
