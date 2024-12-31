import { faClock, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { cancelOrder } from "../../../api/orderApi";

const OrderCancelButton = ({ order }) => {
  const calculateRemainingTime = (orderDate) => {
    const orderTime = new Date(orderDate).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = 24 * 60 * 60 * 1000 - (currentTime - orderTime);
    return timeDifference > 0 ? timeDifference : 0;
  };

  const [remainingTime, setRemainingTime] = useState(
    calculateRemainingTime(order.orderDate)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(calculateRemainingTime(order.orderDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [order.orderDate]);

  const isWithin24Hours = (orderDate) => {
    const orderTime = new Date(orderDate).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - orderTime;
    return timeDifference <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  };

  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours}g:${minutes}p:${seconds}s`;
  };

  const handleCancelOrder = async () => {
    const cancelMessage = prompt("Vui lòng nhập lý do hủy đơn hàng:");
    if (cancelMessage === null) return;

    if (!order.orderID) {
      console.error("ID đơn hàng không xác định");
      return;
    }

    try {
      const result = await cancelOrder(order.orderID, cancelMessage);
      console.log("Phản hồi API:", result);
      if (result && result.isSuccess) {
        alert("Hủy đơn hàng thành công!");
        window.location.reload();
      } else {
        alert("Không thể hủy đơn hàng: " + (result?.messages || "Lỗi không xác định"));
      }
    } catch (err) {
      console.error("Lỗi khi hủy đơn hàng:", err);
      alert("Đã xảy ra lỗi khi hủy đơn hàng");
    }
  };

  return (
    (order.orderStatus === 0 || order.orderStatus === 8) &&
    isWithin24Hours(order.orderDate) && (
      <div className="flex justify-center items-center">
        <span className={`mr-4 font-medium ${
          remainingTime < 3600000 ? 'text-red-500' : 'text-blue-600'
        }`}>
          {formatTime(remainingTime)}
        </span>
        <button
          className="bg-red-500 text-white rounded-md py-2 px-4 my-2 flex items-center group hover:bg-red-600"
          onClick={handleCancelOrder}
        >
          <FontAwesomeIcon icon={faTimes} className="mr-2 group-hover:hidden" />
          <span className="hidden group-hover:inline">
            Yêu cầu hủy đơn hàng
          </span>
        </button>
      </div>
    )
  );
};

export default OrderCancelButton;
