import React from "react";
import { Modal, Row, Col, Card } from "antd";

const VoucherSelector = ({
  isVisible,
  vouchers,
  handleVoucherSelect,
  selectedVoucher,
  handleClose,
}) => {
  return (
    <Modal
      title="Chọn Voucher"
      visible={isVisible}
      onCancel={handleClose}
      footer={null}
      width={800} // Increased width for better layout
    >
      <Row gutter={[16, 16]}>
        {vouchers.map((voucher) => (
          <Col xs={24} sm={12} md={8} lg={6} key={voucher.vourcherID}>
            <Card
              hoverable
              onClick={() => handleVoucherSelect(voucher)}
              className={`p-4 border ${
                selectedVoucher?.vourcherID === voucher.vourcherID
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
              style={{ minHeight: "150px" }} // Ensures uniform card heights
            >
              <Card.Meta
                title={
                  <div
                    style={{ whiteSpace: "normal", wordWrap: "break-word", fontWeight: "bold" }}
                  >
                    {voucher.vourcherCode}
                  </div>
                }
                description={<span>{voucher.description}</span>}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

export default VoucherSelector;
