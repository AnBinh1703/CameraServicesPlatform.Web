import { Form, message } from "antd";
import moment from "moment"; // Add this import
import React, { useEffect, useState } from "react";
import { getCategoryById } from "../../../api/categoryApi";
import { createExtend } from "../../../api/extendApi";
import { getProductById } from "../../../api/productApi";
import { getSupplierById } from "../../../api/supplierApi";
import ExtendModal from "./components/ExtendModal";
import OrderCard from "./components/OrderCard";

const OrderList = ({
  orders,
  supplierMap: initialSupplierMap,
  orderStatusMap,
  deliveryStatusMap,
  handleClick,
  handlePaymentAgain,
  updateOrderStatusPlaced,
  openUploadPopup,
}) => {
  const [categoryMap, setCategoryMap] = useState({});
  const [localSupplierMap, setLocalSupplierMap] = useState(
    initialSupplierMap || {}
  );
  const [isExtendModalVisible, setIsExtendModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form] = Form.useForm();
  const [productPrices, setProductPrices] = useState({
    pricePerHour: 0,
    pricePerDay: 0,
    pricePerWeek: 0,
    pricePerMonth: 0,
  });

  const durationOptions = {
    0: { min: 2, max: 8 }, // Hour
    1: { min: 1, max: 3 }, // Day
    2: { min: 1, max: 2 }, // Week
    3: { min: 1, max: 1 }, // Month
  };

  const handleExtendClick = async (order) => {
    setSelectedOrder(order);
    setIsExtendModalVisible(true);

    const productId = order.orderDetails?.[0]?.productID; // Access first product ID from details array
    if (productId) {
      try {
        const product = await getProductById(productId);
        setProductPrices({
          pricePerHour: product.pricePerHour,
          pricePerDay: product.pricePerDay,
          pricePerWeek: product.pricePerWeek,
          pricePerMonth: product.pricePerMonth,
        });

        // Set form values including orderID
        form.setFieldsValue({
          orderID: order.orderID,
          rentalExtendStartDate: moment(order.rentalEndDate),
          durationUnit: 0,
          durationValue: durationOptions[0].min,
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
        message.error("Không thể lấy thông tin sản phẩm");
      }
    }
  };

  const handleExtend = async (values) => {
    try {
      // Ensure orderID is included in the request
      const extendData = {
        orderID: selectedOrder?.orderID, // Get from selected order
        durationUnit: values.durationUnit,
        durationValue: values.durationValue,
        extendReturnDate: values.extendReturnDate.toISOString(),
        rentalExtendStartDate: values.rentalExtendStartDate.toISOString(),
        rentalExtendEndDate: values.rentalExtendEndDate.toISOString(),
        totalAmount: values.totalAmount,
      };

      const result = await createExtend(extendData);
      if (result.isSuccess) {
        message.success("Gia hạn thành công");
        setIsExtendModalVisible(false);
        form.resetFields();
        setSelectedOrder(null); // Clear selected order
      } else {
        message.error(result.message || "Không thể gia hạn");
      }
    } catch (error) {
      console.error("Extend error:", error);
      message.error("Đã xảy ra lỗi khi gia hạn");
    }
  };

  const getDisplayValue = (map, key) => {
    if (!map || !map[key]) return "Không xác định";
    return typeof map[key] === "object" ? map[key].text : map[key];
  };

  const getSupplierInfo = (supplierId) => {
    if (!supplierId) {
      return "Không xác định";
    }

    const supplier = localSupplierMap[supplierId];
    if (!supplier) {
      return "Không xác định";
    }

    return supplier.supplierName || "Không xác định";
  };

  const handleUpdateOrderStatus = async (orderId) => {
    console.log("handleUpdateOrderStatus called with orderId:", orderId);
    try {
      const result = await updateOrderStatusPlaced(orderId);
      if (result.isSuccess) {
        message.success("Cập nhật trạng thái đơn hàng thành công");
      } else {
        message.error("Không thể cập nhật trạng thái đơn hàng");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng");
    }
  };

  const fetchCategoryAndSupplierNames = async (orderDetails) => {
    const uniqueCategoryIDs = [
      ...new Set(orderDetails.map((detail) => detail.product?.categoryID)),
    ].filter((id) => id);
    const uniqueSupplierIDs = [
      ...new Set(orderDetails.map((detail) => detail.product?.supplierID)),
    ].filter((id) => id);

    try {
      const categoryPromises = uniqueCategoryIDs.map((id) =>
        getCategoryById(id)
      );
      const supplierPromises = uniqueSupplierIDs.map((id) =>
        getSupplierById(id)
      );

      const [categories, suppliers] = await Promise.all([
        Promise.all(categoryPromises),
        Promise.all(supplierPromises),
      ]);

      const newCategoryMap = {};
      categories.forEach((res, index) => {
        const id = uniqueCategoryIDs[index];
        newCategoryMap[id] = res.isSuccess
          ? res.result?.categoryName || "Không xác định"
          : "Không xác định";
      });

      const supplierDict = {};
      suppliers.forEach((response, index) => {
        const id = uniqueSupplierIDs[index];
        console.log(`Processing supplier ID ${id}:`, response);

        if (response && response.isSuccess) {
          supplierDict[id] = response.result;
          console.log(`Added supplier ${id} to dict:`, response.result);
        } else {
          supplierDict[id] = {
            supplierName: "Không xác định",
            supplierAddress: "Không xác định",
          };
          console.log(`Added default supplier for ${id}`);
        }
      });

      setCategoryMap(newCategoryMap);
      setLocalSupplierMap(supplierDict);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Lỗi khi tải thông tin");
    }
  };

  useEffect(() => {
    if (orders.length > 0) {
      const allOrderDetails = orders.flatMap(
        (order) => order.orderDetails || []
      );
      console.log("Processed order details:", allOrderDetails);
      fetchCategoryAndSupplierNames(allOrderDetails);
    }
  }, [orders]);

  useEffect(() => {
    if (initialSupplierMap) {
      setLocalSupplierMap(initialSupplierMap);
    }
  }, [initialSupplierMap]);

  const getProductInfo = (orderDetails) => {
    if (!orderDetails || orderDetails.length === 0) return null;
    return orderDetails.map((detail, index) => (
      <div key={index} className="border-b border-gray-100 last:border-0 py-2">
        <p className="font-medium">{detail.product?.productName}</p>
        <div className="text-sm text-gray-600 mt-1">
          <p>Serial Number: {detail.product?.serialNumber}</p>
          <p>Danh mục: {categoryMap[detail.product?.categoryID]}</p>
          <p>Số lượng: {detail.quantity}</p>
          <p>Đơn giá: {formatPrice(detail.unitPrice)}</p>
        </div>
      </div>
    ));
  };

  // Sort orders by latest order date
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
  );

  const calculateProductPriceRent = (values) => {
    const { durationUnit, durationValue } = values;
    if (!durationOptions[durationUnit]) {
      message.error("Đơn vị thời gian không hợp lệ");
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

  const calculateRentalEndDate = (startDate, durationValue, durationUnit) => {
    if (!startDate) return null;

    const start = moment(startDate);
    if (!isWithinBusinessHours(start, true)) {
      message.error("Thời gian bắt đầu phải trong khoảng 8:00 - 17:00");
      return null;
    }

    let endDate;
    switch (durationUnit) {
      case 0: // Hours
        endDate = start.clone().add(durationValue, "hours");
        if (!isWithinBusinessHours(endDate, false)) {
          message.error("Thời gian kết thúc phải trong khoảng 8:00 - 20:00");
          return null;
        }
        break;
      case 1: // Days
        endDate = start.clone().add(durationValue, "days").hours(17);
        break;
      case 2: // Weeks
        endDate = start.clone().add(durationValue, "weeks").hours(17);
        break;
      case 3: // Months
        endDate = start.clone().add(durationValue, "months").hours(17);
        break;
      default:
        return null;
    }
    return endDate;
  };

  const calculateExtendReturnDate = (endDate) => {
    if (!endDate) return null;
    return moment(endDate).clone().add(1, "hours");
  };

  const handleFormValuesChange = (changedValues, allValues) => {
    const { rentalExtendStartDate, durationUnit, durationValue } = allValues;

    if (rentalExtendStartDate && durationUnit !== undefined && durationValue) {
      const startDate = moment(rentalExtendStartDate);

      // Set start time to 8:00 if not already set
      if (startDate.hours() < 8) {
        startDate.hours(8).minutes(0).seconds(0);
        form.setFieldsValue({ rentalExtendStartDate: startDate });
      }

      const endDate = calculateRentalEndDate(
        startDate,
        durationValue,
        durationUnit
      );

      if (endDate) {
        // Calculate return date (1 hour after end date)
        const returnDate = moment(endDate).add(1, "hours");

        // Calculate total amount
        const totalAmount = calculateProductPriceRent({
          durationUnit,
          durationValue,
        });

        form.setFieldsValue({
          rentalExtendEndDate: endDate,
          extendReturnDate: returnDate,
          totalAmount: totalAmount,
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

  const validateTimeConstraints = (startDate, endDate, durationUnit) => {
    if (!startDate || !endDate) return false;

    // Check if start date is within business hours (8:00-17:00)
    if (!isWithinBusinessHours(moment(startDate), true)) {
      message.error("Thời gian bắt đầu phải trong khoảng 8:00 - 17:00");
      return false;
    }

    // Check if end date is within extended business hours (8:00-20:00)
    if (!isWithinBusinessHours(moment(endDate), false)) {
      message.error("Thời gian kết thúc phải trong khoảng 8:00 - 20:00");
      return false;
    }

    // Special validation for hourly rentals
    if (durationUnit === 0) {
      const endHour = moment(endDate).hours();
      if (endHour > 20) {
        message.error(
          "Với thuê theo giờ, thời gian kết thúc không được quá 20:00"
        );
        return false;
      }
    }

    return true;
  };

  return (
    <div className="lg:col-span-5 bg-gray-50 shadow-lg rounded-lg md:p-6">
      <h2 className="text-2xl font-bold text-teal-600 mb-8 text-center">
        <span className="border-b-2 border-teal-400 pb-2">
          Đơn hàng của bạn
        </span>
      </h2>

      {sortedOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
         </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sortedOrders.map((order) => (
            <OrderCard
              key={order.orderID}
              order={order}
              orderStatusMap={orderStatusMap}
              deliveryStatusMap={deliveryStatusMap}
              localSupplierMap={localSupplierMap}
              categoryMap={categoryMap}
              onDetailClick={handleClick}
              onPaymentAgain={handlePaymentAgain}
              onExtendClick={handleExtendClick}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onOpenUploadPopup={openUploadPopup}
              getDisplayValue={getDisplayValue}
              getSupplierInfo={getSupplierInfo}
              getProductInfo={getProductInfo}
            />
          ))}
        </div>
      )}

      <ExtendModal
        isVisible={isExtendModalVisible}
        onCancel={() => {
          setIsExtendModalVisible(false);
          setSelectedOrder(null); // Clear selected order on cancel
          form.resetFields(); // Reset form
        }}
        onExtend={handleExtend}
        form={form}
        productPrices={productPrices}
        durationOptions={durationOptions}
        selectedOrder={selectedOrder} // Pass selected order to modal
      />
    </div>
  );
};

const formatDateTime = (date) => moment(date).format("DD/MM/YYYY HH:mm");

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

export default OrderList;
