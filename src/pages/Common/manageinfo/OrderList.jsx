import { DatePicker, Form, Input, message, Modal, Select } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { getCategoryById } from "../../../api/categoryApi";
import { createExtend } from "../../../api/extendApi";
import { getProductById } from "../../../api/productApi"; // Add this import
import { getSupplierById } from "../../../api/supplierApi";
import { formatDateTime, formatPrice } from "../../../utils/util";

const OrderList = ({
  orders,
  supplierMap: initialSupplierMap,
  orderStatusMap,
  deliveryStatusMap,
  orderTypeMap,
  handleClick,
  handlePaymentAgain,
  updateOrderStatusPlaced,
  openUploadPopup,
}) => {
  const [categoryMap, setCategoryMap] = useState({});
  const [localSupplierMap, setLocalSupplierMap] = useState({});
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

    // Get product ID from order details
    const productId = order.orderDetails[0]?.product?.productID;
    if (productId) {
      try {
        const response = await getProductById(productId);
        if (response.isSuccess) {
          const product = response.result;
          setProductPrices({
            pricePerHour: product.pricePerHour,
            pricePerDay: product.pricePerDay,
            pricePerWeek: product.pricePerWeek,
            pricePerMonth: product.pricePerMonth,
          });
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    }

    form.setFieldsValue({
      orderID: order.orderID,
      rentalExtendStartDate: moment(order.rentalEndDate),
      durationUnit: 0,
      durationValue: durationOptions[0].min,
    });
  };

  const handleExtend = async (values) => {
    try {
      const extendData = {
        orderID: values.orderID,
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
      } else {
        message.error(result.message || "Không thể gia hạn");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi gia hạn");
    }
  };

  const getDisplayValue = (map, key) => {
    console.log("getDisplayValue called with map and key:", map, key);
    if (!map || !map[key]) return "Không xác định";
    return typeof map[key] === "object" ? map[key].text : map[key];
  };

  const getSupplierInfo = (supplierId) => {
    console.log("getSupplierInfo called with ID:", supplierId);
    console.log("localSupplierMap state:", localSupplierMap);

    if (!supplierId) {
      console.log("No supplierId provided");
      return "Không xác định";
    }

    const supplier = localSupplierMap[supplierId];
    console.log("Found supplier:", supplier);

    if (supplier) {
      console.log("Returning supplier name:", supplier.supplierName);
      return supplier.supplierName || "Không xác định";
    }

    console.log("No supplier found, returning default");
    return "Không xác định";
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
    console.log("Starting fetchCategoryAndSupplierNames with:", orderDetails);

    const uniqueCategoryIDs = [
      ...new Set(orderDetails.map((detail) => detail.product?.categoryID)),
    ].filter((id) => id);
    const uniqueSupplierIDs = [
      ...new Set(orderDetails.map((detail) => detail.product?.supplierID)),
    ].filter((id) => id);

    console.log("Unique category IDs:", uniqueCategoryIDs);
    console.log("Unique supplier IDs:", uniqueSupplierIDs);

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

      console.log("API responses - categories:", categories);
      console.log("API responses - suppliers:", suppliers);

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

      console.log("Final supplier dictionary:", supplierDict);
      setCategoryMap(newCategoryMap);
      setLocalSupplierMap(supplierDict);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Lỗi khi tải thông tin");
    }
  };

  useEffect(() => {
    console.log("Orders changed:", orders);
    if (orders.length > 0) {
      const allOrderDetails = orders.flatMap(
        (order) => order.orderDetails || []
      );
      console.log("Processed order details:", allOrderDetails);
      fetchCategoryAndSupplierNames(allOrderDetails);
    }
  }, [orders]);

  const getProductInfo = (orderDetails) => {
    console.log("getProductInfo called with orderDetails:", orderDetails);
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

    // Convert to moment if it's not already
    const start = moment(startDate);
    let endDate;

    switch (durationUnit) {
      case 0: // Hours
        endDate = start.clone().add(durationValue, "hours");
        break;
      case 1: // Days
        endDate = start.clone().add(durationValue, "days");
        break;
      case 2: // Weeks
        endDate = start.clone().add(durationValue, "weeks");
        break;
      case 3: // Months
        endDate = start.clone().add(durationValue, "months");
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

  const handleFormValuesChange = (_, allValues) => {
    const { rentalExtendStartDate, durationUnit, durationValue } = allValues;
    if (rentalExtendStartDate && durationUnit !== undefined && durationValue) {
      const endDate = calculateRentalEndDate(
        rentalExtendStartDate,
        durationValue,
        durationUnit
      );
      const price = calculateProductPriceRent(allValues);

      if (endDate) {
        // Calculate return date (1 hour after end date)
        const returnDate = calculateExtendReturnDate(endDate);

        // Calculate total amount
        const totalAmount = calculateProductPriceRent(allValues);

        // Update form values
        form.setFieldsValue({
          rentalExtendEndDate: endDate,
          extendReturnDate: returnDate,
          totalAmount: totalAmount,
        });
      }
    }
  };

  const ExtendModal = () => (
    <Modal
      title="Gia hạn đơn hàng"
      open={isExtendModalVisible}
      onCancel={() => setIsExtendModalVisible(false)}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleExtend}
        onValuesChange={handleFormValuesChange}
      >
        <Form.Item name="orderID" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="durationUnit"
          label="Đơn vị thời gian"
          rules={[
            { required: true, message: "Vui lòng chọn đơn vị thời gian" },
          ]}
        >
          <Select>
            <Select.Option value={0}>
              Giờ - Chọn thời gian tối thiểu {durationOptions[0].min} tối đa{" "}
              {durationOptions[0].max}
            </Select.Option>
            <Select.Option value={1}>
              Ngày- Chọn thời gian tối thiểu {durationOptions[1].min} tối đa{" "}
              {durationOptions[1].max}
            </Select.Option>
            <Select.Option value={2}>
              Tuần- Chọn thời gian tối thiểu {durationOptions[2].min} tối đa{" "}
              {durationOptions[2].max}
            </Select.Option>
            <Select.Option value={3}>
              Tháng- Chọn thời gian tối thiểu {durationOptions[3].min}- tối đa{" "}
              {durationOptions[3].max}
            </Select.Option>
          </Select>
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
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
        >
          <DatePicker showTime />
        </Form.Item>

        <Form.Item
          name="rentalExtendEndDate"
          label="Ngày kết thúc gia hạn"
          rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
        >
          <DatePicker showTime />
        </Form.Item>

        <Form.Item
          name="extendReturnDate"
          label="Ngày trả đồ"
          rules={[{ required: true, message: "Vui lòng chọn ngày trả đồ" }]}
        >
          <DatePicker showTime disabled />
        </Form.Item>

        <Form.Item
          name="totalAmount"
          label="Tổng tiền"
          rules={[{ required: true, message: "Vui lòng nhập tổng tiền" }]}
        >
          <Input type="number" min={0} />
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

  return (
    <div className="lg:col-span-5 bg-gray-50 shadow-lg rounded-lg md:p-6">
      <h2 className="text-2xl font-bold text-teal-600 mb-8 text-center">
        <span className="border-b-2 border-teal-400 pb-2">
          Đơn hàng của bạn
        </span>
      </h2>

      {sortedOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-500 text-lg">Chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sortedOrders.map((order) => (
            <div
              key={order.orderID}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              {/* Header Section - Add subtitle */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Đơn hàng #{order.orderID}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(order.orderDate)}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.orderStatus === 0
                      ? "bg-yellow-100 text-yellow-800"
                      : order.orderStatus === 1
                      ? "bg-blue-100 text-blue-800"
                      : order.orderStatus === 2
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {getDisplayValue(orderStatusMap, order.orderStatus)}
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Delivery Status - Add this section */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Phương thức giao hàng
                    </h4>
                    <p className="text-sm text-gray-600">
                      {getDisplayValue(deliveryStatusMap, order.deliveryStatus)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.shippingAddress || "Nhận tại cửa hàng"}
                    </p>
                  </div>
                </div>

                {/* Supplier & Order Info */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Thông tin nhà cung cấp
                    </h4>
                    <p className="text-sm text-gray-600">
                      {getSupplierInfo(order.supplierID)}
                    </p>
                    {localSupplierMap[order.supplierID]?.supplierAddress && (
                      <p className="text-sm text-gray-500 mt-1">
                        Địa chỉ:{" "}
                        {localSupplierMap[order.supplierID].supplierAddress}
                      </p>
                    )}
                  </div>
                </div>

                {/* Product Info - New Section */}
                <div className="space-y-4 md:col-span-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Thông tin sản phẩm
                    </h4>
                    <div className="divide-y divide-gray-100">
                      {getProductInfo(order.orderDetails)}
                    </div>
                  </div>
                </div>

                {/* Rental Details */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Thời gian thuê
                    </h4>
                    <p className="text-sm text-gray-600">
                      {`${order.durationValue} ${
                        order.durationUnit === 0
                          ? "giờ"
                          : order.durationUnit === 1
                          ? "ngày"
                          : order.durationUnit === 2
                          ? "tuần"
                          : "tháng"
                      }`}
                    </p>
                    <div className="mt-2 text-sm">
                      <p>Bắt đầu: {formatDateTime(order.rentalStartDate)}</p>
                      <p>Kết thúc: {formatDateTime(order.rentalEndDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Thông tin thanh toán
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        Tiền đặt cọc:{" "}
                        <span className="font-medium">
                          {formatPrice(order.deposit)}
                        </span>
                      </p>
                      <p>
                        Tiền bảo lưu:{" "}
                        <span className="font-medium">
                          {formatPrice(order.reservationMoney)}
                        </span>
                      </p>
                      <p className="text-teal-600 font-medium">
                        Tổng tiền: {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => handleClick(order)}
                  className="px-4 py-2 bg-white border border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
                >
                  Chi tiết
                </button>
                {order.orderStatus === 0 && (
                  <button
                    onClick={() => handlePaymentAgain(order)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Thanh toán
                  </button>
                )}
                {order.orderStatus === 3 ||
                  (order.orderStatus === 12 && (
                    <button
                      onClick={() => handleExtendClick(order)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Gia hạn
                    </button>
                  ))}
                {order.orderStatus === 1 && (
                  <button
                    onClick={() => handleUpdateOrderStatus(order.orderID)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Xác nhận đặt hàng
                  </button>
                )}
                {order.orderStatus === 2 && (
                  <>
                    <button
                      onClick={() => openUploadPopup(order.orderID, "after")}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Hình ảnh sau
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <ExtendModal />
    </div>
  );
};

export default OrderList;
