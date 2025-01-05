import { DatePicker, Form, Input, Modal, Select, message } from "antd";
import moment from "moment";
import { useState, useEffect } from "react";
import { getOrderDetailsById } from "../../../../api/orderApi";
import { getProductById } from "../../../../api/productApi";

const ExtendModal = ({
  isVisible,
  onCancel,
  onExtend,
  durationOptions,
  selectedOrder,
}) => {
  // Create form instance inside the component
  const [form] = Form.useForm();
  
  const [productPrices, setProductPrices] = useState({
    pricePerHour: 0,
    pricePerDay: 0,
    pricePerWeek: 0,
    pricePerMonth: 0,
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isVisible) {
      form.resetFields();
    }
  }, [isVisible, form]);

  useEffect(() => {
    const fetchProductPrices = async () => {
      if (selectedOrder?.orderID) {
        try {
          // First get order details to get productID
          const orderDetails = await getOrderDetailsById(
            selectedOrder.orderID,
            1,
            10
          );
          if (orderDetails && orderDetails.result?.length > 0) {
            const productID = orderDetails.result[0].productID;

            // Then get product details
            const product = await getProductById(productID);
            if (product) {
              setProductPrices({
                pricePerHour: product.pricePerHour,
                pricePerDay: product.pricePerDay,
                pricePerWeek: product.pricePerWeek,
                pricePerMonth: product.pricePerMonth,
              });
            }
          }
        } catch (error) {
          console.error("Error fetching product prices:", error);
        }
      }
    };

    fetchProductPrices();
  }, [selectedOrder]);

  const calculateProductPriceRent = (values) => {
    const { durationUnit, durationValue } = values;
    if (!durationOptions[durationUnit]) {
      message.error("Đơn vị thời gian không hợp lệ");
      return 0;
    }

    // Check if the selected duration unit has a valid price
    const priceMap = {
      0: productPrices.pricePerHour,
      1: productPrices.pricePerDay,
      2: productPrices.pricePerWeek,
      3: productPrices.pricePerMonth
    };

    if (!priceMap[durationUnit]) {
      message.error("Không hỗ trợ đơn vị thời gian này");
      return 0;
    }

    if (!durationValue || durationValue <= 0) {
      message.error("Thời lượng phải lớn hơn 0");
      return 0;
    }

    const { min, max } = durationOptions[durationUnit];
    if (durationValue < min || durationValue > max) {
      message.error(
        `Thời lượng không hợp lệ. Vui lòng chọn từ ${min} đến ${max}.`
      );
      return 0;
    }

    let price = 0;
    switch (durationUnit) {
      case 0:
        price = durationValue * productPrices.pricePerHour;
        break;
      case 1:
        price = durationValue * productPrices.pricePerDay;
        break;
      case 2:
        price = durationValue * productPrices.pricePerWeek;
        break;
      case 3:
        price = durationValue * productPrices.pricePerMonth;
        break;
      default:
        price = 0;
    }
    return price;
  };

  const handleFormValuesChange = (changedValues, allValues) => {
    if (
      changedValues.durationUnit !== undefined ||
      changedValues.durationValue !== undefined ||
      changedValues.rentalExtendStartDate !== undefined
    ) {
      const { rentalExtendStartDate, durationUnit, durationValue } = allValues;

      if (rentalExtendStartDate && durationUnit !== undefined && durationValue) {
        const startDate = moment(rentalExtendStartDate);

        if (startDate.hours() < 8) {
          startDate.hours(8).minutes(0).seconds(0);
          form.setFieldsValue({ rentalExtendStartDate: startDate });
        }

        let endDate;
        switch (durationUnit) {
          case 0:
            endDate = startDate.clone().add(durationValue, "hours");
            break;
          case 1:
            endDate = startDate.clone().add(durationValue, "days").hours(17);
            break;
          case 2:
            endDate = startDate.clone().add(durationValue, "weeks").hours(17);
            break;
          case 3:
            endDate = startDate.clone().add(durationValue, "months").hours(17);
            break;
          default:
            return;
        }

        const returnDate = endDate.clone().add(1, "hours");

        // Calculate total amount using the local function
        const totalAmount = calculateProductPriceRent({ durationUnit, durationValue });

        // Update all calculated fields at once
        form.setFieldsValue({
          rentalExtendEndDate: endDate,
          extendReturnDate: returnDate,
          totalAmount: totalAmount,
          totalAmountDisplay: new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
          }).format(totalAmount)
        });
      }
    }
  };

  const isWithinBusinessHours = (time, isStartDate = true) => {
    const hours = time.hours();
    if (isStartDate) {
      return hours >= 8 && hours <= 17;
    }
    return hours >= 8 && hours <= 20;
  };

  const renderDurationOptions = () => (
    <Select>
      <Select.Option value={0} disabled={!productPrices.pricePerHour}>
        Giờ - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productPrices.pricePerHour)}/giờ
        (tối thiểu {durationOptions[0].min} tối đa {durationOptions[0].max})
      </Select.Option>
      <Select.Option value={1} disabled={!productPrices.pricePerDay}>
        Ngày - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productPrices.pricePerDay)}/ngày
        (tối thiểu {durationOptions[1].min} tối đa {durationOptions[1].max})
      </Select.Option>
      <Select.Option value={2} disabled={!productPrices.pricePerWeek}>
        Tuần - {productPrices.pricePerWeek ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productPrices.pricePerWeek) : 'Không khả dụng'}/tuần
        (tối thiểu {durationOptions[2].min} tối đa {durationOptions[2].max})
      </Select.Option>
      <Select.Option value={3} disabled={!productPrices.pricePerMonth}>
        Tháng - {productPrices.pricePerMonth ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productPrices.pricePerMonth) : 'Không khả dụng'}/tháng
        (tối thiểu {durationOptions[3].min} tối đa {durationOptions[3].max})
      </Select.Option>
    </Select>
  );

  return (
    <Modal
      title={`Gia hạn đơn hàng #${selectedOrder?.orderID || ""}`}
      open={isVisible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
    >
      <Form
        form={form} // Pass the form instance here
        layout="vertical"
        onFinish={(values) => {
          const formData = {
            ...values,
            orderID: selectedOrder?.orderID,
          };
          onExtend(formData);
        }}
        onValuesChange={handleFormValuesChange}
        initialValues={{ 
          orderID: selectedOrder?.orderID,
          durationUnit: 0,
          durationValue: 1
        }}
      >
        <Form.Item
          name="orderID"
          hidden
          initialValue={selectedOrder?.orderID} // Set initial value here too
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="orderID"
          hidden
          initialValue={selectedOrder?.productID} // Set initial value here too
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="durationUnit"
          label="Đơn vị thời gian"
          rules={[
            { required: true, message: "Vui lòng chọn đơn vị thời gian" },
          ]}
        >
          {renderDurationOptions()}
        </Form.Item>

        <Form.Item
          name="durationValue"
          label="Thời gian gia hạn"
          rules={[
            { required: true, message: "Vui lòng nhập thời gian gia hạn" },
          ]}
        >
          <Input type="number" min={1} />
        </Form.Item>

        <Form.Item
          name="rentalExtendStartDate"
          label="Ngày bắt đầu gia hạn"
          rules={[
            { required: true, message: "Vui lòng chọn ngày bắt đầu" },
            {
              validator: (_, value) => {
                if (value && !isWithinBusinessHours(moment(value), true)) {
                  return Promise.reject(
                    "Thời gian bắt đầu phải trong khoảng 8:00 - 17:00"
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker
            showTime={{
              format: "HH:mm",
              hourStep: 1,
              minuteStep: 15,
              disabledHours: () => [
                ...Array.from({ length: 8 }, (_, i) => i), // Hours before 8:00
                ...Array.from({ length: 7 }, (_, i) => i + 17), // Hours after 17:00
              ],
            }}
            format="YYYY-MM-DD HH:mm"
            disabledDate={(current) => {
              // Disable dates before today and after one month from today
              return (
                current &&
                (current < moment().startOf("day") ||
                  current > moment().add(1, "month").endOf("day"))
              );
            }}
            showToday={true}
            allowClear={false}
          />
        </Form.Item>

        <Form.Item
          name="rentalExtendEndDate"
          label="Ngày kết thúc gia hạn"
          rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            disabled // Make it read-only since it's auto-calculated
            allowClear={false}
          />
        </Form.Item>

        <Form.Item
          name="extendReturnDate"
          label="Ngày trả đồ"
          rules={[{ required: true, message: "Vui lòng chọn ngày trả đồ" }]}
        >
          <DatePicker
            showTime
            disabled // Make it read-only since it's auto-calculated
            format="YYYY-MM-DD HH:mm"
            allowClear={false}
          />
        </Form.Item>

        <Form.Item
          name="totalAmount"
          label="Tổng tiền"
          rules={[{ required: true, message: "Vui lòng nhập tổng tiền" }]}
        >
          <Input
            disabled
            style={{ color: '#000' }}
            value={form.getFieldValue('totalAmountDisplay')}
            addonAfter="VND"
          />
        </Form.Item>

        {/* Hidden field for actual numeric value */}
        <Form.Item
          name="totalAmount"
          hidden
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item className="text-right">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Xác nhận gia hạn
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExtendModal;
