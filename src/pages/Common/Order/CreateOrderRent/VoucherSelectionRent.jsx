
import React from "react";
import { Select } from "antd";

const { Option } = Select;

const VoucherSelectionRent = ({
  vouchers,
  selectedVoucher,
  setSelectedVoucher,
  handleVoucherSelect,
  selectedVoucherDetails,
}) => {
  return (
    <div>
      <Select
        placeholder="Chọn voucher"
        value={selectedVoucher}
        onChange={(value) => setSelectedVoucher(value)}
        onSelect={handleVoucherSelect}
        style={{ width: "100%" }}
      >
        {vouchers.map((voucher) => (
          <Option key={voucher.voucherID} value={voucher.voucherID}>
            {voucher.voucherName}
          </Option>
        ))}
      </Select>
      {selectedVoucherDetails && (
        <div>
          <p>Giảm giá: {selectedVoucherDetails.discountAmount} VND</p>
        </div>
      )}
    </div>
  );
};

export default VoucherSelectionRent;
