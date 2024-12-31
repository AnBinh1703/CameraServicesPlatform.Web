import { message } from "antd";
import React from "react";
import { createExtend } from "../../../api/extendApi";
import OrderItem from "./OrderItem";

const OrderList = ({
  orders,
  supplierMap,
  orderStatusMap,
  deliveryStatusMap,
  orderTypeMap,
  handleClick,
  handlePaymentAgain,
  updateOrderStatusPlaced,
  openUploadPopup,
}) => {
  const handleExtend = async (order) => {
    const extendData = { orderId: order.orderID };
    const result = await createExtend(extendData);
    if (result) {
      message.success("Extend created successfully.");
    } else {
      message.error("Failed to create extend.");
    }
  };

  return (
    <div className="lg:col-span-5 bg-white shadow-lg rounded-lg   md:p-4">
      <h2 className="text-2xl font-bold text-teal-600 mb-8 text-center">
        <span className="border-b-2 border-teal-400 pb-2">
          Đơn hàng của bạn
        </span>
      </h2>

      {orders.length === 0 ? (
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
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-600">
                  Mã đơn hàng
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-600">
                  Mã nhà cung cấp
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-600">
                  Trạng thái
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-600 hidden md:table-cell">
                  Địa chỉ giao hàng
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-600 hidden lg:table-cell">
                  Phương thức giao hàng
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-600">
                  Loại
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-600 hidden sm:table-cell">
                  Ngày đặt hàng
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-600">
                  Tổng số tiền
                </th>
                <th className="px-4 py-4"></th>
                <th className="px-4 py-4"></th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((order) => (
                <OrderItem
                  key={order.orderID}
                  order={order}
                  supplierMap={supplierMap}
                  orderStatusMap={orderStatusMap}
                  deliveryStatusMap={deliveryStatusMap}
                  orderTypeMap={orderTypeMap}
                  handleClick={handleClick}
                  handlePaymentAgain={handlePaymentAgain}
                  updateOrderStatusPlaced={updateOrderStatusPlaced}
                  openUploadPopup={openUploadPopup}
                  handleExtend={handleExtend}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;
