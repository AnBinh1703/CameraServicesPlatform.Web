import { message } from 'antd';
import { useState } from 'react';
import {
  updateOrderStatusCompleted,
  cancelOrder,
  updateOrderStatusShipped,
  // ... other imports
} from '../api/orderApi';

export const useOrderActions = (onUpdate) => {
  const [cancelMessage, setCancelMessage] = useState("");

  const handleCompleteOrder = async (orderId) => {
    try {
      const response = await updateOrderStatusCompleted(orderId);
      if (response?.isSuccess) {
        message.success("Đơn hàng đã được hoàn thành!");
        onUpdate(orderId, 2);
      } else {
        message.error("Không thể hoàn thành đơn hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi hoàn thành đơn hàng.");
    }
  };

  // ... other handlers

  return {
    cancelMessage,
    setCancelMessage,
    handleCompleteOrder,
    handleCancelOrder,
    handleShipOrder,
    handleApproveOrder,
    handleAcceptCancelOrder,
    handlePendingRefund,
    handleUpdateOrderStatusPlaced,
  };
};
