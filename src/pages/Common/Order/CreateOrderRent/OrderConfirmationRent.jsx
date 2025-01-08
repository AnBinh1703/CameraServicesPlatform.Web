
import React from "react";

const OrderConfirmationRent = ({ selectedVoucherDetails, totalAmount }) => {
  return (
    <div>
      <h3>Xác nhận đơn hàng thuê</h3>
      {selectedVoucherDetails && (
        <p>Voucher: {selectedVoucherDetails.voucherName} - Giảm {selectedVoucherDetails.discountAmount} VND</p>
      )}
      <p>Tổng số tiền: {totalAmount} VND</p>
    </div>
  );
};

export default OrderConfirmationRent;
