import { message } from "antd";
import React, { useEffect, useState } from "react";
import { getCategoryById } from "../../../api/categoryApi";
import { createExtend } from "../../../api/extendApi";
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

  const handleExtend = async (order) => {
    console.log("handleExtend called with order:", order);
    const extendData = { orderId: order.orderID };
    const result = await createExtend(extendData);
    if (result) {
      message.success("Gia hạn thành công.");
    } else {
      message.error("Không thể gia hạn.");
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
  const sortedOrders = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

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
                {order.orderStatus === 2 && (
                  <button
                    onClick={() => handleExtend(order)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Gia hạn
                  </button>
                )}
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
    </div>
  );
};

export default OrderList;
