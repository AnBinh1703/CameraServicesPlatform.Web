import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
} from "antd"; // Import Select from antd
import moment from "moment";
import React, { useEffect, useState } from "react";
import { createExtend } from "../../../api/extendApi";
import { getProductById } from "../../../api/productApi"; // Import the getProductById function
import { createReturnDetailForMember } from "../../../api/returnDetailApi";
import { formatDateTime, formatPrice } from "../../../utils/util";
import OrderCancelButton from "./OrderCancelButton";

const StatusBadge = ({ status, map }) => {
  const statusInfo = map[status] || {
    text: "Thanh toán thất bại",
    color: "gray",
    icon: "fa-question-circle",
  };
  return (
    <span className="flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full bg-opacity-20">
      <i
        className={`fa-solid ${statusInfo.icon} text-${statusInfo.color}-500`}
      ></i>
      <span className={`text-${statusInfo.color}-700`}>{statusInfo.text}</span>
    </span>
  );
};

const OrderItem = ({
  order,
  supplierMap,
  orderStatusMap,
  deliveryStatusMap,
  orderTypeMap,
  handleClick,
  handlePaymentAgain,
  updateOrderStatusPlaced,
}) => {
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isExtendModalVisible, setIsExtendModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [extendForm] = Form.useForm();
  const [durationUnit, setDurationUnit] = useState(0);
  const [durationValue, setDurationValue] = useState(1);
  const [productPriceRent, setProductPriceRent] = useState(0);
  const [rentalStartDate, setRentalStartDate] = useState(null);
  const [rentalEndDate, setRentalEndDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [product, setProduct] = useState(null);

  const durationOptions = {
    0: { min: 2, max: 8 }, // Hour
    1: { min: 1, max: 3 }, // Day
    2: { min: 1, max: 2 }, // Week
    3: { min: 1, max: 1 }, // Month
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (order.orderDetails && order.orderDetails.length > 0) {
        const productId = order.orderDetails[0].productID;
        try {
          const productData = await getProductById(productId);
          setProduct(productData);
        } catch (error) {
          message.error("Failed to fetch product details");
        }
      }
    };

    fetchProductDetails();
  }, [order]);

  const handleDurationValueChange = (value) => {
    setDurationValue(value);
  };

  useEffect(() => {
    if (durationUnit !== undefined && durationValue && rentalStartDate) {
      calculateProductPriceRent();
      const endDate = calculateRentalEndTime(
        rentalStartDate.toDate(),
        durationValue,
        durationUnit
      );
      setRentalEndDate(moment(endDate));

      // Calculate Return Date after setting rentalEndDate
      const calculatedReturnDate = calculateReturnDate(endDate);
      setReturnDate(moment(calculatedReturnDate));
    }
  }, [durationUnit, durationValue, rentalStartDate]);

  const handleDurationUnitChange = (value) => {
    setDurationUnit(value);
    setDurationValue(durationOptions[value].min);
    const { min, max } = durationOptions[value];
    message.info(`Please select a duration between ${min} and ${max}.`);
  };

  const calculateReturnDate = (endDate) => {
    if (!endDate) return null;
    return moment(endDate).clone().add(1, "hours");
  };

  const calculateProductPriceRent = () => {
    if (!durationOptions[durationUnit] || !product) {
      return;
    }

    if (!durationValue || durationValue <= 0) {
      return;
    }

    const { min, max } = durationOptions[durationUnit];
    if (durationValue < min || durationValue > max) {
      return;
    }

    let price = 0;
    switch (durationUnit) {
      case 0:
        price = durationValue * (product.pricePerHour || 0);
        break;
      case 1:
        price = durationValue * (product.pricePerDay || 0);
        break;
      case 2:
        price = durationValue * (product.pricePerWeek || 0);
        break;
      case 3:
        price = durationValue * (product.pricePerMonth || 0);
        break;
      default:
        price = 0;
    }

    setProductPriceRent(price);
    extendForm.setFieldsValue({ totalAmount: price });
  };

  useEffect(() => {
    if (durationUnit !== undefined && durationValue > 0) {
      calculateProductPriceRent();
    }
  }, [durationUnit, durationValue]);

  const handleRentalStartDateChange = (date) => {
    if (!date) {
      message.error("Vui lòng chọn ngày bắt đầu thuê");
      return;
    }

    setRentalStartDate(date);

    const calculatedEndDate = calculateRentalEndTime(
      date.toDate(),
      durationValue,
      durationUnit
    );
    if (calculatedEndDate) {
      setRentalEndDate(moment(calculatedEndDate));

      const calculatedReturnDate = calculateReturnDate(calculatedEndDate);
      setReturnDate(moment(calculatedReturnDate));
    }
  };

  const calculateRentalEndTime = (
    rentalStartTime,
    rentalDuration,
    durationType
  ) => {
    let rentalEndTime;
    switch (durationType) {
      case 0:
        rentalEndTime = new Date(
          rentalStartTime.getTime() + rentalDuration * 60 * 60 * 1000
        );
        break;
      case 1:
        rentalEndTime = new Date(
          rentalStartTime.getTime() + rentalDuration * 24 * 60 * 60 * 1000
        );
        break;
      case 2:
        rentalEndTime = new Date(
          rentalStartTime.getTime() + rentalDuration * 7 * 24 * 60 * 60 * 1000
        );
        break;
      case 3:
        rentalEndTime = new Date(
          rentalStartTime.getTime() + rentalDuration * 30 * 24 * 60 * 60 * 1000
        );
        break;
      default:
        throw new Error("Invalid duration type");
    }
    return rentalEndTime;
  };

  const handleCreateReturnDetail = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        orderID: order.orderID,
        returnDate: values.returnDate,
        condition: values.condition,
      };
      const result = await createReturnDetailForMember(data);
      if (result && result.isSuccess) {
        message.success("Return detail created successfully");
        setIsFormModalVisible(false);
      } else {
        message.error("Failed to create return detail");
      }
    } catch (error) {
      console.error("Error creating return detail:", error);
      message.error("An error occurred, please try again later.");
    }
  };

  const handleCreateExtend = async () => {
    try {
      const values = await extendForm.validateFields();
      const data = {
        orderID: order.orderID,
        durationUnit: values.durationUnit,
        durationValue: values.durationValue,
        extendReturnDate: values.extendReturnDate.toISOString(),
        rentalExtendStartDate: values.rentalExtendStartDate.toISOString(),
        totalAmount: values.totalAmount,
        rentalExtendEndDate: values.rentalExtendEndDate.toISOString(),
      };
      const result = await createExtend(data);
      if (result) {
        message.success("Extend created successfully");
        setIsExtendModalVisible(false);
      } else {
        message.error("Failed to create extend");
      }
    } catch (error) {
      console.error("Error creating extend:", error);
      message.error("An error occurred, please try again later.");
    }
  };

  return (
    <>
      <tr
        key={order.orderID}
        className={
          order.orderStatus === 1 && order.deliveriesMethod === 0
            ? "bg-yellow-100"
            : "cursor-pointer hover:bg-gray-50 transition-colors"
        }
        onClick={() => handleClick(order)}
      >
        <td className="py-3 px-4 border-b">{order.orderID}</td>
        <td className="py-3 px-4 border-b">
          <div>
            <strong>Tên nhà cung cấp:</strong>
            {supplierMap[order.supplierID]?.supplierName || " "}
          </div>
          <div>
            <strong>Địa chỉ:</strong>
            {supplierMap[order.supplierID]?.supplierAddress || " "}
          </div>
          <div>
            <strong>Mô tả:</strong>
            {supplierMap[order.supplierID]?.supplierDescription || " "}
          </div>
          <div>
            <strong>Số điện thoại liên hệ:</strong>
            {supplierMap[order.supplierID]?.contactNumber || ""}
          </div>
        </td>
        <td className="py-3 px-4 border-b">
          <StatusBadge status={order.orderStatus} map={orderStatusMap} />
        </td>
        <td className="py-3 px-4 border-b hidden md:table-cell">
          {order.shippingAddress}
        </td>
        <td className="py-3 px-4 border-b hidden lg:table-cell">
          <StatusBadge
            status={order.deliveriesMethod}
            map={deliveryStatusMap}
          />
        </td>
        <td className="py-3 px-4 border-b">
          <StatusBadge status={order.orderType} map={orderTypeMap} />
        </td>
        <td className="py-3 px-4 border-b hidden sm:table-cell">
          {formatDateTime(order.orderDate)}
        </td>
        <td className="py-3 px-4 border-b">{formatPrice(order.totalAmount)}</td>
        <td>
          {order.orderStatus === 0 && (
            <div className="flex justify-center">
              <button
                className="bg-primary text-white rounded-md py-2 px-4 my-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePaymentAgain(order.orderID);
                }}
              >
                Thanh toán ngay
              </button>
            </div>
          )}
        </td>
        <td>
          <OrderCancelButton order={order} />
          {order.orderStatus === 1 && order.deliveriesMethod === 0 && (
            <button
              className="bg-blue-500 text-white rounded-md py-2 px-4 my-2"
              onClick={async (e) => {
                e.stopPropagation();
                await updateOrderStatusPlaced(order.orderID);
                message.success("Order status updated to 'Đến nhận'");
              }}
            >
              Đến nhận
            </button>
          )}
        </td>
        <td>
          {order.orderStatus === 3 && order.orderType === 0 && (
            <>
              <button
                className="bg-green-500 text-white rounded-md py-2 px-4 my-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFormModalVisible(true);
                }}
              >
                Trả hàng
              </button>
            </>
          )}
          {order.orderStatus === 3 && order.orderType === 1 && (
            <>
              <button
                className="bg-orange-500 text-white rounded-md py-2 px-4 my-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExtendModalVisible(true);
                }}
              >
                Extend
              </button>
            </>
          )}
        </td>
        <td></td>
      </tr>

      {/* Modal: Input Form Data */}
      <Modal
        title="Trả hàng"
        visible={isFormModalVisible}
        onCancel={() => setIsFormModalVisible(false)}
        onOk={handleCreateReturnDetail}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="returnDate"
            label="Ngày trả"
            rules={[{ required: true, message: "Vui lòng chọn ngày trả" }]}
          >
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item
            name="condition"
            label="Tình trạng"
            rules={[{ required: true, message: "Vui lòng nhập tình trạng" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal: Extend Form Data */}
      <Modal
        title="Extend Order"
        visible={isExtendModalVisible}
        onCancel={() => setIsExtendModalVisible(false)}
        onOk={handleCreateExtend}
      >
        <Form form={extendForm} layout="vertical">
          <Form.Item
            name="durationUnit"
            label="Duration Unit"
            rules={[{ required: true, message: "Please enter duration unit" }]}
          >
            <Select onChange={handleDurationUnitChange}>
              <Select.Option value={0}>Hour</Select.Option>
              <Select.Option value={1}>Day</Select.Option>
              <Select.Option value={2}>Week</Select.Option>
              <Select.Option value={3}>Month</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="durationValue"
            label="Duration Value"
            rules={[{ required: true, message: "Please enter duration value" }]}
          >
            <InputNumber
              min={durationOptions[durationUnit]?.min || 1}
              max={durationOptions[durationUnit]?.max || 1}
              value={durationValue}
              onChange={handleDurationValueChange}
            />
          </Form.Item>
          <Form.Item
            name="extendReturnDate"
            label="Extend Return Date"
            rules={[
              { required: true, message: "Please select extend return date" },
            ]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item
            name="rentalExtendStartDate"
            label="Rental Extend Start Date"
            rules={[
              {
                required: true,
                message: "Please select rental extend start date",
              },
            ]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item
            name="totalAmount"
            label="Total Amount"
            rules={[{ required: true, message: "Please enter total amount" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="rentalExtendEndDate"
            label="Rental Extend End Date"
            rules={[
              {
                required: true,
                message: "Please select rental extend end date",
              },
            ]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default OrderItem;