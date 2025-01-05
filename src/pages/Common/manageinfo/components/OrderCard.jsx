import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllExtendsByOrderId } from "../../../../api/extendApi";
import { cancelOrder } from "../../../../api/orderApi";
import { formatDateTime, formatPrice } from "../utils/orderUtils";
import ReportRatingDialog from './ReportRatingDialog';

const OrderCard = ({
  order,
  orderStatusMap,
  deliveryStatusMap,
  localSupplierMap,
  onDetailClick,
  onPaymentAgain,
  onExtendClick,
  onUpdateOrderStatus,
  onOpenUploadPopup,
  getDisplayValue,
  getSupplierInfo,
  getProductInfo,
  // Remove accountID prop since we'll get it from Redux
}) => {
  const user = useSelector((state) => state.user.user || {});
  const [extendHistory, setExtendHistory] = useState([]);
  const [showExtendHistory, setShowExtendHistory] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);

  useEffect(() => {
    if (order.orderStatus === 3 || order.orderStatus === 12) {
      loadExtendHistory();
    }
  }, [order.orderID]);

  const loadExtendHistory = async () => {
    const response = await getAllExtendsByOrderId(order.orderID);
    if (response?.isSuccess) {
      setExtendHistory(response.result.items);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelMessage.trim()) {
      alert("Vui lòng nhập lý do hủy đơn hàng");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await cancelOrder(order.orderID, cancelMessage);
      if (response?.isSuccess) {
        alert("Hủy đơn hàng thành công");
        setShowCancelDialog(false);
        // Optionally refresh the page or update the order list
        window.location.reload();
      } else {
        alert(response?.messages?.[0] || "Có lỗi xảy ra khi hủy đơn hàng");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi hủy đơn hàng");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
      {/* Header Section - Updated styling */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              Đơn hàng #{order.orderID.slice(0, 8)}...
              <span className="text-xs text-gray-500 font-normal">
                {formatDateTime(order.orderDate)}
              </span>
            </h3>
            <div
              className={`inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs font-medium ${
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
        </div>
      </div>

      {/* Main Content Grid - Updated layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Delivery Status - Enhanced card */}
        <div className="bg-gray-50 p-5 rounded-xl hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-medium text-gray-700">Phương thức giao hàng</h4>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-800">
              {getDisplayValue(deliveryStatusMap, order.deliveryStatus)}
            </p>
            <p className="text-sm text-gray-600">
              {order.shippingAddress || "Nhận tại cửa hàng"}
            </p>
          </div>
        </div>

        {/* Supplier Info */}
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
                Địa chỉ: {localSupplierMap[order.supplierID].supplierAddress}
              </p>
            )}
          </div>
        </div>

        {/* Product Info */}
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
            <h4 className="font-medium text-gray-700 mb-2">Thời gian thuê</h4>
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

      {/* Extend History - New styling */}
      {(order.orderStatus === 3 || order.orderStatus === 12) && extendHistory.length > 0 && (
        <div className="col-span-full mt-4">
          <button
            onClick={() => setShowExtendHistory(!showExtendHistory)}
            className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700"
          >
            <svg className={`w-4 h-4 transition-transform ${showExtendHistory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
            {showExtendHistory ? "Ẩn lịch sử gia hạn" : "Xem lịch sử gia hạn"}
          </button>

          {showExtendHistory && (
            <div className="mt-3 bg-gray-50 p-5 rounded-xl border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Lịch sử gia hạn
              </h4>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {extendHistory.map((extend) => (
                  <div
                    key={extend.extendId}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                  >
                    <div className="space-y-2">
                      <p className="font-medium text-gray-800">
                        {extend.durationValue}{" "}
                        {extend.durationUnit === 0
                          ? "giờ"
                          : extend.durationUnit === 1
                          ? "ngày"
                          : extend.durationUnit === 2
                          ? "tuần"
                          : "tháng"}
                      </p>
                      <div className="text-sm text-gray-600">
                        <p>Bắt đầu: {formatDateTime(extend.rentalExtendStartDate)}</p>
                        <p>Kết thúc: {formatDateTime(extend.rentalExtendEndDate)}</p>
                      </div>
                      {extend.totalAmount && (
                        <p className="text-teal-600 font-medium mt-2">
                          {formatPrice(extend.totalAmount)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons - Updated styling */}
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          onClick={() => onDetailClick(order)}
          className="px-4 py-2 bg-white border-2 border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors focus:ring-2 focus:ring-teal-200 focus:outline-none"
        >
          Chi tiết
        </button>
        {order.orderStatus === 0 && (
          <button
            onClick={() => onPaymentAgain(order)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thanh toán
          </button>
        )}
        {(order.orderStatus === 3 || order.orderStatus === 12) && (
          <button
            onClick={() => onExtendClick(order)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Gia hạn
          </button>
        )}
        {order.orderStatus === 1 && (
          <button
            onClick={() => onUpdateOrderStatus(order.orderID)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Xác nhận đặt hàng
          </button>
        )}
        {order.orderStatus === 2 && (
          <button
            onClick={() => onOpenUploadPopup(order.orderID, "after")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Hình ảnh sau
          </button>
        )}
        {(order.orderStatus === 0 || order.orderStatus === 8) && (
          <button
            onClick={() => setShowCancelDialog(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Hủy đơn hàng
          </button>
        )}
        
        {(order.orderStatus === 7 || 
          order.orderStatus === 10 || 
          order.orderStatus === 11 || 
          order.orderStatus === 2) && (
          <>
            <button
              onClick={() => setShowReportDialog(true)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Báo cáo
            </button>
            <button
              onClick={() => setShowRatingDialog(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Đánh giá
            </button>
          </>
        )}
        
        {/* Report Dialog */}
        <ReportRatingDialog
          isOpen={showReportDialog}
          onClose={() => setShowReportDialog(false)}
          order={order}
          accountID={user.id}
          mode="report"
        />

        {/* Rating Dialog */}
        <ReportRatingDialog
          isOpen={showRatingDialog}
          onClose={() => setShowRatingDialog(false)}
          order={order}
          accountID={user.id}
          mode="rating"
        />
        
        {/* Cancel Order Dialog */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Xác nhận hủy đơn hàng</h3>
              <textarea
                className="w-full p-2 border rounded-lg mb-4 h-32"
                placeholder="Nhập lý do hủy đơn hàng..."
                value={cancelMessage}
                onChange={(e) => setCancelMessage(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  disabled={isSubmitting}
                >
                  Đóng
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang xử lý..." : "Xác nhận hủy"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
