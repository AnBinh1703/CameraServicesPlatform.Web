import { Card, Col, Form, Radio, Row, message } from "antd";
import React, { useEffect, useState } from "react";
import { getVoucherById } from "../../../../api/voucherApi";

const VoucherSelection = ({
  vouchers,
  selectedVoucher,
  setSelectedVoucher,
  handleVoucherSelect,
  selectedVoucherDetails,
}) => {
  const [vourcherCodes, setVoucherCodes] = useState({});

  useEffect(() => {
    const fetchVoucherCodes = async () => {
      const codes = {};
      for (const voucher of vouchers) {
        try {
          const details = await getVoucherById(voucher.vourcherID);
          console.log(
            "Fetched details for voucherID:",
            voucher.vourcherID,
            details
          ); // Log the fetched details
          codes[voucher.vourcherID] = details.vourcherCode;
        } catch (error) {
          message.error("Failed to fetch voucher details.");
        }
      }
      setVoucherCodes(codes);
    };

    fetchVoucherCodes();
  }, [vouchers]);
  useEffect(() => {
    if (!selectedVoucher) {
      handleVoucherSelect({ target: { value: null } });
    }
  }, [selectedVoucher, handleVoucherSelect]);
  const onCardClick = (voucherID) => {
    setSelectedVoucher(voucherID);
    handleVoucherSelect({ target: { value: voucherID } });
  };

  return (
    <Form.Item label="Chọn Voucher">
      <Radio.Group
        onChange={handleVoucherSelect}
        value={selectedVoucher}
        style={{ width: "100%" }}
      >
        <Row gutter={[16, 16]}>
          {vouchers.map((voucher) => {
            const vourcherCode =
              vourcherCodes[voucher.vourcherID] || voucher.vourcherID;
            console.log("vourcherCode", vourcherCode); // Log the voucher code

            return (
              <Col span={8} key={voucher.productVoucherID}>
                <Card
                  title={
                    <div style={{ color: "#1890ff", fontWeight: "bold" }}>
                      {vourcherCode}
                    </div>
                  }
                  bordered={true}
                  style={{
                    cursor: "pointer",
                    borderColor:
                      selectedVoucher === voucher.vourcherID
                        ? "#1890ff"
                        : "#f0f0f0",
                    backgroundColor:
                      selectedVoucher === voucher.vourcherID
                        ? "#e6f7ff"
                        : "#ffffff",
                    borderWidth: selectedVoucher === voucher.vourcherID ? 2 : 1,
                    boxShadow:
                      selectedVoucher === voucher.vourcherID
                        ? "0 4px 8px rgba(0, 0, 0, 0.1)"
                        : "0 2px 4px rgba(0, 0, 0, 0.05)",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => onCardClick(voucher.vourcherID)}
                >
                  {selectedVoucher === voucher.vourcherID &&
                    selectedVoucherDetails && (
                      <div style={{ padding: "8px 0" }}>
                        <div style={{ marginBottom: "8px" }}>
                          <strong style={{ marginRight: "8px" }}>
                            Mã Voucher:
                          </strong>
                          <span>{selectedVoucherDetails.vourcherCode}</span>
                        </div>
                        <div style={{ marginBottom: "8px" }}>
                          <strong style={{ marginRight: "8px" }}>Mô tả:</strong>
                          <span>{selectedVoucherDetails.description}</span>
                        </div>
                        {selectedVoucherDetails.discountAmount && (
                          <div style={{ color: "#f5222d", fontWeight: "bold" }}>
                            Giảm:{" "}
                            {selectedVoucherDetails.discountAmount.toLocaleString()}
                            đ
                          </div>
                        )}
                      </div>
                    )}
                </Card>
              </Col>
            );
          })}
        </Row>
      </Radio.Group>
    </Form.Item>
  );
};

export default VoucherSelection;
