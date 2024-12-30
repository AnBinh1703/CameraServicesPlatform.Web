import { Modal } from "antd";
import React from "react";
import DetailAllProduct from "./DetailAllProduct";

const ProductDetailsModal = ({ visible, product, onClose }) => {
  return (
    <Modal
      title="Chi Tiết Sản Phẩm"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <DetailAllProduct 
        product={product}
        onClose={onClose}
      />
    </Modal>
  );
};

export default ProductDetailsModal;
