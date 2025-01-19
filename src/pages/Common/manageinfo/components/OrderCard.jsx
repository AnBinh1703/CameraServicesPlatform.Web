import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllExtendsByOrderId } from "../../../../api/extendApi";
import {
  cancelOrder,
  updateOrderStatusCompleted,
} from "../../../../api/orderApi";
import { getProductReportByAccountId } from "../../../../api/productReportApi"; // Updated import
import { formatDateTime, formatPrice } from "../utils/orderUtils";
import ReportRatingDialog from "./ReportRatingDialog";

const OrderCard = ({
  order,
  orderStatusMap,
  orderTypeMap,
  deliveryStatusMap,

  onDetailClick,
  onPaymentAgain,
  onExtendClick,
  onUpdateOrderStatus,
  onOpenUploadPopup,
  getSupplierInfo,
  getProductInfo,
}) => {
  const user = useSelector((state) => state.user.user || {});
  const [extendHistory, setExtendHistory] = useState([]);
  const [showExtendHistory, setShowExtendHistory] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [productReports, setProductReports] = useState([]);
  const [showReportHistory, setShowReportHistory] = useState(false);
  const [supplierDetails, setSupplierDetails] = useState({
    supplierName: "Đang tải...",
    contactNumber: "Đang tải...",
    supplierAddress: "Đang tải...",
  });
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmingProduct, setIsConfirmingProduct] = useState(false);

  useEffect(() => {
    if (order.orderStatus === 3 || order.orderStatus === 12) {
      loadExtendHistory();
    }
  }, [order.orderID]);

  useEffect(() => {
    if (order.orderDetails && order.orderDetails.length > 0) {
      loadProductReports();
    }
  }, [order.orderDetails]);

  useEffect(() => {
    const loadSupplierInfo = async () => {
      if (order.supplierID) {
        const details = await getSupplierInfo(order.supplierID);
        setSupplierDetails(details);
      }
    };
    loadSupplierInfo();
  }, [order.supplierID, getSupplierInfo]);

  const loadExtendHistory = async () => {
    const response = await getAllExtendsByOrderId(order.orderID);
    if (response?.isSuccess) {
      setExtendHistory(response.result.items);
    }
  };

  const loadProductReports = async () => {
    const accountId = user.id; // Assuming user ID is available
    const response = await getProductReportByAccountId(accountId);
    if (response?.isSuccess) {
      const validReports = response.result.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setProductReports(validReports);
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

  // Helper function to safely format dates
  const safeFormatDateTime = (date) => {
    return date ? formatDateTime(date) : "Chưa xác định";
  };

  // Helper function to safely format prices
  const safeFormatPrice = (price) => {
    return price !== null ? formatPrice(price) : "Chưa xác định";
  };

  // Add helper function inside component if needed
  const getStatusText = (map, key) => {
    if (!map || !map[key]) return "Không xác định";
    return typeof map[key] === "object" ? map[key].text : map[key];
  };

  // Add status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "bg-blue-100 text-blue-800"; // Chờ xử lý
      case 1:
        return "bg-green-100 text-green-800"; // Sản phẩm sẵn sàng được giao
      case 2:
        return "bg-yellow-100 text-yellow-800"; // Hoàn thành
      case 3:
        return "bg-purple-100 text-purple-800"; // Đã nhận sản phẩm
      case 4:
        return "bg-cyan-100 text-cyan-800"; // Đã giao hàng
      case 5:
        return "bg-cyan-100 text-cyan-800"; // Thanh toán thất bại
      case 6:
        return "bg-lime-100 text-lime-800"; // Đang hủy
      case 7:
        return "bg-red-100 text-red-800"; // Đã hủy thành công
      case 8:
        return "bg-orange-100 text-orange-800"; // Đã Thanh toán
      case 9:
        return "bg-pink-100 text-pink-800"; // Hoàn tiền đang chờ xử lý
      case 10:
        return "bg-amber-100 text-amber-800"; // Hoàn tiền thành công
      case 11:
        return "bg-yellow-100 text-yellow-800"; // Hoàn trả tiền đặt cọc
      case 12:
        return "bg-violet-100 text-violet-800"; // Gia hạn
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Add this function near your other helper functions
  const getOrderTypeColor = (type) => {
    switch (type) {
      case 0:
        return "bg-indigo-100 text-indigo-800"; // Mua
      case 1:
        return "bg-green-100 text-green-800"; // Thuê
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Add this helper function near your other helper functions
  const getOrderTypeText = (type) => {
    switch (type) {
      case 0:
        return "Mua";
      case 1:
        return "Thuê";
      default:
        return "Không xác định";
    }
  };

  const handleConfirmOrder = async (orderId) => {
    setIsConfirming(true);
    try {
      await onUpdateOrderStatus(orderId);
      // Reload page after successful confirmation
      window.location.reload();
    } catch (error) {
      console.error("Error confirming order:", error);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleConfirmProduct = async (orderId) => {
    setIsConfirmingProduct(true);
    try {
      const response = await updateOrderStatusCompleted(orderId);
      if (response?.isSuccess) {
        message.success("Xác nhận nhận sản phẩm thành công");
        window.location.reload();
      } else {
        message.error("Không thể xác nhận nhận sản phẩm");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xác nhận nhận sản phẩm");
    } finally {
      setIsConfirmingProduct(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
      {/* Header Section - Updated styling */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-teal-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              Đơn hàng #{order.orderID}
              <span className="text-xs text-gray-500 font-normal">
                {formatDateTime(order.orderDate)}
              </span>
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  order.orderStatus
                )}`}
              >
                {getStatusText(orderStatusMap, order.orderStatus)}
              </div>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getOrderTypeColor(
                  order.orderType
                )}`}
              >
                {getOrderTypeText(order.orderType)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid - Updated layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Delivery Status - Enhanced card */}
        <div className="bg-gray-50 p-5 rounded-xl hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h4 className="font-medium text-gray-700">Phương thức giao hàng</h4>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-800">
              {getStatusText(deliveryStatusMap, order.deliveriesMethod)}
            </p>

            <p className="text-sm text-gray-600">{order.shippingAddress}</p>
          </div>
        </div>

        {/* Supplier Info */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">
              Thông tin nhà cung cấp
            </h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>Tên: {supplierDetails.supplierName}</p>
              <p>Số điện thoại: {supplierDetails.contactNumber}</p>
              <p>Địa chỉ: {supplierDetails.supplierAddress}</p>
            </div>
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
        {order.orderType !== 0 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Thời gian thuê</h4>
              <p className="text-sm text-gray-600">
                {order.durationValue > 0
                  ? `${order.durationValue} ${
                      order.durationUnit === 0
                        ? "giờ"
                        : order.durationUnit === 1
                        ? "ngày"
                        : order.durationUnit === 2
                        ? "tuần"
                        : "tháng"
                    }`
                  : "Chưa xác định"}
              </p>
              <div className="mt-2 text-sm">
                <p>Bắt đầu: {safeFormatDateTime(order.rentalStartDate)}</p>
                <p>Kết thúc: {safeFormatDateTime(order.rentalEndDate)}</p>
              </div>
            </div>
          </div>
        )}
        {/* Payment Info */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">
              Thông tin thanh toán
            </h4>
            <div className="space-y-2 text-sm">
              {order.deposit !== null && order.deposit !== 0 && (
                <p>
                  Tiền đặt cọc:{" "}
                  <span className="font-medium">
                    {safeFormatPrice(order.deposit)}
                  </span>
                </p>
              )}
              {order.reservationMoney !== null &&
                order.reservationMoney !== 0 && (
                  <p>
                    Tiền giữ chỗ:{" "}
                    <span className="font-medium">
                      {safeFormatPrice(order.reservationMoney)}
                    </span>
                  </p>
                )}
              <p className="text-teal-600 font-medium">
                Tổng tiền: {safeFormatPrice(order.totalAmount)}
              </p>
              <p>
                Trạng thái:{" "}
                <span className="font-medium">
                  {order.isPayment ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* CancelCancel Info */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Thông tin hủy</h4>
            <div className="space-y-2 text-sm">
              <p className="text-teal-600 font-medium">
                Lí do hủy: {order.cancelMessage}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Extend History - New styling */}
      {(order.orderStatus === 3 || order.orderStatus === 12) &&
        extendHistory.length > 0 && (
          <div className="col-span-full mt-4">
            <button
              onClick={() => setShowExtendHistory(!showExtendHistory)}
              className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700"
            >
              <svg
                className={`w-4 h-4 transition-transform ${
                  showExtendHistory ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              {showExtendHistory ? "Ẩn lịch sử gia hạn" : "Xem lịch sử gia hạn"}
            </button>

            {showExtendHistory && (
              <div className="mt-3 bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
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
                          <p>
                            Bắt đầu:{" "}
                            {formatDateTime(extend.rentalExtendStartDate)}
                          </p>
                          <p>
                            Kết thúc:{" "}
                            {formatDateTime(extend.rentalExtendEndDate)}
                          </p>
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

      {/* Product Report History */}
      {productReports.length > 0 && (
        <div className="mt-6 border-t border-gray-100 pt-6">
          <button
            onClick={() => setShowReportHistory(!showReportHistory)}
            className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700"
          >
            <svg
              className={`w-4 h-4 transition-transform ${
                showReportHistory ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
            {showReportHistory ? "Ẩn lịch sử báo cáo" : "Xem lịch sử báo cáo"}
          </button>

          {showReportHistory && (
            <div className="mt-4 space-y-4">
              {productReports.map((report) => (
                <div
                  key={report.productReportID}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">
                        Trạng thái: {report.statusType}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {report.reason}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDateTime(report.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
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
            onClick={() => onPaymentAgain(order.orderID)} // Change this line
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thanh toán
          </button>
        )}
        {order.isPayment &&
          ((order.orderStatus === 3 && order.orderType === 1) ||
            (order.orderStatus === 12 && order.orderType === 1)) && (
            <button
              onClick={() => onExtendClick(order)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Gia hạn
            </button>
          )}
        {order.isPayment && order.orderStatus === 1 && (
          <button
            onClick={() => handleConfirmOrder(order.orderID)}
            disabled={isConfirming}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${
              isConfirming
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isConfirming ? "Đang xử lý..." : "Xác nhận đã nhận "}
          </button>
        )}

        {order.orderStatus === 3 ||
          order.orderStatus === 1 ||
          (order.orderStatus === 4 && (
            <button
              onClick={() => handleConfirmProduct(order.orderID)}
              disabled={isConfirmingProduct}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                isConfirmingProduct
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isConfirmingProduct ? "Đang xử lý..." : "Xác nhận  sản phẩm"}
            </button>
          ))}
        {/* {order.isPayment &&
          order.orderStatus === 1 &&
          order.orderType === 11 && (
            <button
              onClick={() => handleConfirmProduct(order.orderID)}
              disabled={isConfirmingProduct}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                isConfirmingProduct
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isConfirmingProduct ? "Đang xử lý..." : "Xác nhận  sản phẩm"}
            </button>
          )} */}
        {order.isPayment &&
          order.orderStatus === 4 &&
          order.orderType === 0 && (
            <button
              onClick={() => handleConfirmProduct(order.orderID)}
              disabled={isConfirmingProduct}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                isConfirmingProduct
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isConfirmingProduct ? "Đang xử lý..." : "Xác nhận  sản phẩm"}
            </button>
          )}
        {order.isPayment &&
          order.orderType === 1 &&
          (order.orderStatus === 1 ||
            order.orderStatus === 3 ||
            order.orderStatus === 4 ||
            order.orderStatus === 12) && (
            <button
              onClick={() => onOpenUploadPopup(order.orderID, "after")}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Thêm hình ảnh trước khi trả hàng
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
          order.orderStatus === 2 ||
          (order.orderStatus === 4 && order.orderType == 0)) && (
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
              <h3 className="text-lg font-semibold mb-4">
                Xác nhận hủy đơn hàng
              </h3>
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
