import { Button, DatePicker, Form, Modal, Steps } from "antd";
import moment from "moment";
import React from "react";

const durationMap = {
  0: 1,
  1: 2,
  2: 3,
  3: 5,
};

const ComboRegistrationModal = ({
  isComboModalVisible,
  handleComboModalCancel,
  currentStep,
  steps,
  servicePlans,
  selectedPlanId,
  handleCardClick,
  handleChoosePlan,
  form,
  next,
  prev,
  handleCreateCombo,
  confirmLoading,
  formatCurrency,
}) => {
  return (
    <Modal
      title="Đăng Ký Gói Dịch Vụ"
      open={isComboModalVisible}
      onCancel={handleComboModalCancel}
      footer={null}
      width={1000}
    >
      <Steps current={currentStep} className="mb-8">
        {steps.map((item) => (
          <Steps.Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">
        {currentStep === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicePlans.map((plan) => (
              <div
                key={plan.comboId}
                className={`p-6 rounded-lg shadow-lg transition-all duration-300 ${
                  selectedPlanId === plan.comboId
                    ? "border-2 border-blue-500 transform scale-105"
                    : "border border-gray-200 hover:border-blue-300"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleCardClick(plan.comboId);
                }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {plan.comboName}
                </h3>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-blue-600">
                    {formatCurrency(plan.comboPrice)}
                  </div>
                  <div className="text-gray-500">/tháng</div>
                </div>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    <span>
                      Thời hạn: {durationMap[plan.durationCombo]} tháng
                    </span>
                  </li>
                </ul>
                <button
                  type="button"
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    selectedPlanId === plan.comboId
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleChoosePlan(plan.comboId);
                  }}
                >
                  Chọn Gói
                </button>
              </div>
            ))}
          </div>
        )}
        {currentStep === 1 && (
          <Form
            form={form}
            layout="vertical"
            onFinish={next}
            initialValues={{
              startTime: moment(),
            }}
            className="max-w-md mx-auto"
          >
            <Form.Item
              label="Thời gian bắt đầu"
              name="startTime"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn thời gian bắt đầu!",
                },
                {
                  validator: (_, value) => {
                    if (value && value.isBefore(moment(), 'second')) {
                      return Promise.reject('Thời gian bắt đầu không thể ở quá khứ!');
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <DatePicker
                showTime
                style={{ width: "100%" }}
                placeholder="Chọn thời gian"
                disabledDate={(current) => {
                  return current && current < moment().startOf('day');
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Tiếp tục
              </Button>
            </Form.Item>
          </Form>
        )}
        {currentStep === 2 && (
          <div className="max-w-md mx-auto p-6 border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              Xác nhận thông tin đăng ký:
            </h3>
            <p className="text-gray-700 mb-4">
              Vui lòng kiểm tra kỹ thông tin trước khi xác nhận. 
              <span className="font-medium text-red-600">
                {" "}Lưu ý: Sau khi xác nhận đăng ký, bạn sẽ không thể hủy hoặc thay đổi gói dịch vụ đã chọn.
              </span>
            </p>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Gói dịch vụ:</span>

                <span className="font-medium">
                  {
                    servicePlans.find((plan) => plan.comboId === selectedPlanId)
                      ?.comboName
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giá gói:</span>
                <span className="font-medium text-blue-600">
                  {formatCurrency(
                    servicePlans.find((plan) => plan.comboId === selectedPlanId)
                      ?.comboPrice
                  )}
                </span>
              </div>
              <Button
                type="primary"
                onClick={handleCreateCombo}
                loading={confirmLoading}
                className="w-full mt-6"
              >
                Xác nhận đăng ký
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="steps-action mt-6 flex justify-between">
        {currentStep > 0 && <Button onClick={prev}>Quay lại</Button>}
      </div>
    </Modal>
  );
};

export default ComboRegistrationModal;
