import { Modal } from "antd";
import React from "react";
import ContractOrder from "../../Contract/ContractOrder";
import TrackingOrder from "../TrackingOrder";
const OrderBothModals = ({
  selectedOrder,
  isTrackingModalVisible,
  contractModalVisible,
  handleCloseTrackingModal,
  handleCloseContractModal,
  handleUpdateOrderStatus,
}) => (
  <>
    <Modal
      title="Theo dõi đơn hàng "
      open={isTrackingModalVisible}
      onCancel={handleCloseTrackingModal}
      footer={null}
      width="80%"
      style={{ top: 20 }}
      styles={{ body: { maxHeight: "80vh", overflowY: "auto" } }}
    >
      {selectedOrder && (
        <TrackingOrder
          order={selectedOrder}
          onUpdate={handleUpdateOrderStatus}
        />
      )}
    </Modal>
    <Modal
      title="Hợp đồng"
      visible={contractModalVisible}
      onCancel={handleCloseContractModal}
      footer={null}
      width={800}
    >
      {selectedOrder && <ContractOrder orderID={selectedOrder.orderID} />}
    </Modal>
  </>
);

export default OrderBothModals;
