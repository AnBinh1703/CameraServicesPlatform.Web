import { message, Spin } from "antd"; // Add Spin import
import React, { useState, useEffect } from "react"; // Add useState, useEffect
import { createExtend } from "../../../api/extendApi";
import { getSupplierById } from "../../../api/supplierApi"; // Add this import
import { formatDateTime, formatPrice } from "../../../utils/util";
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
  const [supplierDetails, setSupplierDetails] = useState({});
  const [loadingSuppliers, setLoadingSuppliers] = useState({});

  useEffect(() => {
    orders.forEach(order => {
      if (order.supplierID && !supplierDetails[order.supplierID]) {
        fetchSupplierDetails(order.supplierID);
      }
    });
  }, [orders]);

  const fetchSupplierDetails = async (supplierId) => {
    setLoadingSuppliers(prev => ({ ...prev, [supplierId]: true }));
    try {
      const result = await getSupplierById(supplierId);
      if (result?.data) {
        setSupplierDetails(prev => ({
          ...prev,
          [supplierId]: result.data
        }));
      }
    } catch (error) {
      console.error("Error fetching supplier:", error);
    } finally {
      setLoadingSuppliers(prev => ({ ...prev, [supplierId]: false }));
    }
  };

  const handleExtend = async (order) => {
    const extendData = { orderId: order.orderID };
    const result = await createExtend(extendData);
    if (result) {
      message.success("Gia hạn thành công.");
    } else {
      message.error("Không thể gia hạn.");
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 0: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 1: return 'bg-green-100 text-green-800 border-green-200';
      case 2: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderSupplierInfo = (supplierId) => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-600">Nhà cung cấp</span>
        {loadingSuppliers[supplierId] ? (
          <Spin size="small" />
        ) : (
          <span className="font-medium">
            {supplierDetails[supplierId]?.name || supplierMap[supplierId]}
          </span>
        )}
      </div>
      {supplierDetails[supplierId] && (
        <>
          <div className="flex justify-between">
            <span className="text-gray-600">Email</span>
            <span className="font-medium">{supplierDetails[supplierId].email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Điện thoại</span>
            <span className="font-medium">{supplierDetails[supplierId].phone}</span>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="lg:col-span-5 bg-gradient-to-br from-white to-teal-50 shadow-lg rounded-lg md:p-6">
      <h2 className="text-3xl font-bold text-teal-700 mb-8 text-center">
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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-1">
          {orders.map((order) => (
            <div key={order.orderID} 
                 className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-teal-600 to-teal-400 p-4 text-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Mã đơn: #{order.orderID}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                    {orderStatusMap[order.orderStatus]?.text || orderStatusMap[order.orderStatus]}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase">Thông tin cơ bản</h4>
                      <div className="space-y-3">
                        {renderSupplierInfo(order.supplierID)}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Loại đơn hàng</span>
                          <span className="font-medium">{orderTypeMap[order.orderType]?.text}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tổng tiền</span>
                          <span className="font-bold text-teal-600">{formatPrice(order.totalAmount)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase">Thông tin thanh toán</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tiền đặt cọc</span>
                          <span className="font-medium">{formatPrice(order.deposit) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tiền bảo lưu</span>
                          <span className="font-medium">{formatPrice(order.reservationMoney) || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase">Thời gian</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Thời gian thuê</span>
                          <span className="font-medium">
                            {`${order.durationValue} ${
                              order.durationUnit === 0 ? "giờ" :
                              order.durationUnit === 1 ? "ngày" :
                              order.durationUnit === 2 ? "tuần" : "tháng"
                            }`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bắt đầu</span>
                          <span className="font-medium">{formatDateTime(order.rentalStartDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Kết thúc</span>
                          <span className="font-medium">{formatDateTime(order.rentalEndDate)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase">Giao hàng</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phương thức</span>
                          <span className="font-medium">{deliveryStatusMap[order.deliveryStatus]?.text}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Địa chỉ</span>
                          <span className="font-medium">{order.shippingAddress || 'Nhận tại cửa hàng'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                  <button
                    onClick={() => handleClick(order)}
                    className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg
                             hover:from-teal-500 hover:to-teal-400 transition-all duration-300 
                             shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
