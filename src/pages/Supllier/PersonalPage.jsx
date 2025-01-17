import { Button, Form, message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../api/accountApi";
import { createComboOfSupplier, getAllCombos } from "../../api/comboApi";
import { getSupplierById, updateSupplier } from "../../api/supplierApi";
import ComboRegistrationModal from "./Combo/ComboRegistrationModal";
import SupplierInfo from "./Information/SupplierInfo";
import UpdateSupplierModal from "./Information/UpdateSupplierModal";

const PersonalPage = () => {
  const { user } = useSelector((state) => state.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [supplierInfo, setSupplierInfo] = useState(null);
  const [servicePlans, setServicePlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComboModalVisible, setIsComboModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const steps = [
    {
      title: "Chọn Gói",
      content: "Chọn gói dịch vụ",
    },

    {
      title: "Xác nhận",
      content: "Xác nhận thông tin",
    },
  ];

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

  useEffect(() => {
    const fetchSupplierInfo = async () => {
      if (supplierId) {
        try {
          const response = await getSupplierById(supplierId);
          if (response?.isSuccess) {
            setSupplierInfo(response.result.items[0]);
            if (response.result.items[0].supplierLogo) {
              setFileList([
                {
                  uid: "-1",
                  name: "logo.png",
                  status: "done",
                  url: response.result.items[0].supplierLogo,
                },
              ]);
            }
          } else {
            message.error("Không thể lấy thông tin nhà cung cấp.");
          }
        } catch (error) {
          message.error("Lỗi khi lấy thông tin nhà cung cấp.");
        }
      }
    };

    fetchSupplierInfo();
  }, [supplierId]);

  useEffect(() => {
    const fetchServicePlans = async () => {
      try {
        const response = await getAllCombos();
        if (response?.isSuccess) {
          setServicePlans(response.result);
        } else {
          message.error("Không thể lấy danh sách gói dịch vụ.");
        }
      } catch (error) {
        message.error("Lỗi khi lấy danh sách gói dịch vụ.");
      }
    };

    fetchServicePlans();
  }, []);

  const handleCreateCombo = async () => {
    setConfirmLoading(true);

    const comboData = {
      supplierID: supplierId,
      comboId: selectedPlanId, // Changed from selectedComboId to selectedPlanId
    };

    try {
      const response = await createComboOfSupplier(comboData);
      if (response?.isSuccess) {
        message.success("Tạo gói dịch vụ thành công.");
        form.resetFields();
        if (response.result) {
          window.location.href = response.result;
        }
      } else {
        message.error("Tạo gói dịch vụ thất bại.");
      }
    } catch (error) {
      message.error("Lỗi khi tạo gói dịch vụ.");
    } finally {
      setConfirmLoading(false);
      setIsComboModalVisible(false);
    }
  };

  const handleCardClick = (comboId) => {
    setSelectedPlanId(comboId); // Changed from setSelectedComboId
    form.setFieldsValue({ comboId });
  };

  const handleUpdateSupplier = async (values) => {
    const formData = new FormData();
    formData.append("SupplierID", supplierId);
    formData.append("SupplierName", values.supplierName);
    formData.append("SupplierDescription", values.supplierDescription);
    formData.append("SupplierAddress", values.supplierAddress);
    formData.append("ContactNumber", values.contactNumber);
    if (values.supplierLogo && values.supplierLogo.file) {
      formData.append("SupplierLogo", values.supplierLogo.file);
    }

    try {
      const response = await updateSupplier(formData);
      if (response?.isSuccess) {
        message.success("Cập nhật thông tin nhà cung cấp thành công.");
        setSupplierInfo({ ...supplierInfo, ...values });
        setIsModalVisible(false);
      } else {
        message.error("Cập nhật thông tin nhà cung cấp thất bại.");
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật thông tin nhà cung cấp.");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList || []);
  };

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const showComboModal = () => {
    setIsComboModalVisible(true);
  };

  const handleComboModalCancel = () => {
    setIsComboModalVisible(false);
  };

  const handleChoosePlan = (comboId) => {
    setSelectedPlanId(comboId); // Changed from handleCardClick(comboId)
    next();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trang Cá Nhân</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý thông tin và gói dịch vụ của bạn
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8">
          {/* Supplier Info Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Thông Tin Nhà Cung Cấp
              </h2>
              <Button
                type="primary"
                onClick={showModal}
                className="hover:bg-blue-600 transition-colors"
              >
                Cập Nhật Thông Tin
              </Button>
            </div>
            <SupplierInfo supplierInfo={supplierInfo} showModal={showModal} />
          </div>

          {/* Service Plans Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Gói Dịch Vụ
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Đăng ký các gói dịch vụ để mở rộng kinh doanh
                </p>
              </div>
              <Button
                type="primary"
                onClick={showComboModal}
                className="bg-green-500 hover:bg-green-600 border-none h-10 px-6 flex items-center"
              >
                <span className="mr-2">+</span> Đăng Ký Gói Dịch Vụ
              </Button>
            </div>
          </div>
        </div>

        {/* Modals */}
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
          formatCurrency={formatCurrency}
        />
        <UpdateSupplierModal
          isModalVisible={isModalVisible}
          handleCancel={handleCancel}
          handleUpdateSupplier={handleUpdateSupplier}
          supplierInfo={supplierInfo}
          fileList={fileList}
          handleUploadChange={handleUploadChange}
        />
      </div>
    </div>
  );
};

export default PersonalPage;
