
import React from "react";

const OrderReviewRent = ({
  product,
  form,
  deliveryMethod,
  supplierInfo,
  selectedVoucherDetails,
  totalAmount,
}) => {
  return (
    <div>
      <h3>Xem lại đơn hàng thuê</h3>
      <p>Sản phẩm: {product.productName}</p>
      <p>Phương thức giao hàng: {deliveryMethod === 0 ? "Giao hàng nhanh" : "Nhận tại cửa hàng"}</p>
      {deliveryMethod === 1 && supplierInfo && (
        <div>
          <p>Tên nhà cung cấp: {supplierInfo.name}</p>
          <p>Địa chỉ: {supplierInfo.address}</p>
        </div>
      )}
      {selectedVoucherDetails && (
        <p>Voucher: {selectedVoucherDetails.voucherName} - Giảm {selectedVoucherDetails.discountAmount} VND</p>
      )}
      <p>Tổng số tiền: {totalAmount} VND</p>
      {/* Add more review fields as necessary */}
    </div>
  );
};

export default OrderReviewRent;
