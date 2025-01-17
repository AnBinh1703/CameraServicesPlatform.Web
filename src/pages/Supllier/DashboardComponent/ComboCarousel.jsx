import { AppstoreOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Descriptions,
  Form,
  Modal,
  Table,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import {
  createComboOfSupplier,
  getAllCombos,
  getComboById,
} from "../../../api/comboApi";
import ComboRegistrationModal from "../Combo/ComboRegistrationModal";

const formatter = new Intl.NumberFormat("vi-VN", {
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
  combos,
  totalCombos,
  totalDuration,
  onComboCreated,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comboDetails, setComboDetails] = useState(null);
  const [isComboModalVisible, setIsComboModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [servicePlans, setServicePlans] = useState([]);
  const { user } = useSelector((state) => state.user || {});
  const [supplierId, setSupplierId] = useState(null);

  useEffect(() => {
    const fetchServicePlans = async () => {
      try {
        const response = await getAllCombos();
        if (response.isSuccess) {
          setServicePlans(response.result);
        }
      } catch (error) {
        console.error("Failed to fetch service plans:", error);
        message.error("Không thể tải danh sách gói dịch vụ");
      }
    };

    fetchServicePlans();
  }, []);

  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user?.id) {
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
  }, [user?.id]);

  const steps = [{ title: "Chọn Gói" }, { title: "Xác Nhận" }];

  const showComboModal = () => {
    setIsComboModalVisible(true);
  };

  const handleComboModalCancel = () => {
    setIsComboModalVisible(false);
    setCurrentStep(0);
    setSelectedPlanId(null);
    form.resetFields();
  };

  const handleCardClick = (planId) => {
    setSelectedPlanId(planId);
  };

  const handleChoosePlan = (planId) => {
    setSelectedPlanId(planId);
    next();
  };

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
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

  const handleCreateCombo = async () => {
    if (!supplierId) {
      message.error("Không tìm thấy thông tin nhà cung cấp");
      return;
    }

    if (!selectedPlanId) {
      message.error("Vui lòng chọn gói dịch vụ");
      return;
    }

    try {
      const response = await createComboOfSupplier({
        supplierId: supplierId,
        comboId: selectedPlanId,
      });

      if (response?.isSuccess) {
        message.success("Tạo gói dịch vụ thành công.");
        form.resetFields();
        if (response.result) {
          window.location.href = response.result;
        }
      } else {
        message.error(response?.message || "Đăng ký gói dịch vụ thất bại");
      }
    } catch (error) {
      console.error("Failed to create combo:", error);
      message.error("Đăng ký gói dịch vụ thất bại");
    } finally {
      setConfirmLoading(false);
    }
  };

  // Sort combos by startTime (latest first)
  const sortedCombos = [...combos].sort(
    (a, b) => new Date(b.startTime) - new Date(a.startTime)
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
          <span
            style={{
              color: isExpired ? "#ff4d4f" : "#52c41a",
              fontWeight: "bold",
            }}
          >
            {isExpired
              ? `${formatDateTime(text)} (Đã hết hạn)`
              : `${formatDateTime(text)} (Còn lại: ${Math.ceil(
                  remainingTime / (1000 * 60 * 60 * 24)
                )} ngày)`}
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
    <Card
      title={
        <span>
          <AppstoreOutlined /> Gói Combo Đăng Kí
        </span>
      }
    >
      <Button type="primary" onClick={showComboModal} className="my-4">
        <PlusOutlined /> Đăng Ký Gói Dịch Vụ
      </Button>

      {sortedCombos.length > 0 ? (
        <>
          <Table
            dataSource={sortedCombos}
            columns={columns}
            rowKey="comboOfSupplierId"
            pagination={false}
            rowClassName={(record) =>
              calculateRemainingTime(record.endTime) <= 0 ? "text-gray-400" : ""
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

      <ComboRegistrationModal
        isComboModalVisible={isComboModalVisible}
        handleComboModalCancel={handleComboModalCancel}
        currentStep={currentStep}
        steps={steps}
        servicePlans={servicePlans}
        selectedPlanId={selectedPlanId}
        handleCardClick={handleCardClick}
        handleChoosePlan={handleChoosePlan}
        form={form}
        next={next}
        prev={prev}
        handleCreateCombo={handleCreateCombo}
        confirmLoading={confirmLoading}
        formatCurrency={formatter.format}
      />
    </Card>
  );
};

export default ComboCarousel;
