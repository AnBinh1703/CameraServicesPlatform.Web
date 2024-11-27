import { Button, Modal, Spin } from "antd";
import React from "react";
import DetailProduct from "./DetailProduct";
import EditProductForm from "./EditProductForm";

// Edit Product Modal Component
export const EditProductModal = ({
  isEditModalVisible,
  handleModalClose,
  selectedProduct,
  handleUpdateSuccess,
}) => (
  <Modal
    title="Chỉnh Sửa Sản Phẩm"
    open={isEditModalVisible}
    onCancel={handleModalClose}
    footer={[
      <Button key="close" onClick={handleModalClose}>
        Đóng
      </Button>,
    ]}
  >
    <EditProductForm
      visible={isEditModalVisible}
      product={selectedProduct}
      onUpdateSuccess={handleUpdateSuccess}
      onClose={handleModalClose}
    />
  </Modal>
);

// View Product Modal Component
export const ViewProductModal = ({
  isModalVisible,
  handleClose,
  selectedProduct,
  loading,
  handleEdit,
  handleDelete,
}) => (
  <Modal
    title="Chi Tiết Sản Phẩm"
    open={isModalVisible}
    onCancel={handleClose}
    footer={[
      <Button key="close" onClick={handleClose}>
        Đóng
      </Button>,
    ]}
  >
    {loading ? (
      <Spin tip="Đang tải...">
        <div style={{ minHeight: "200px" }} />
      </Spin>
    ) : (
      <DetailProduct product={selectedProduct} />
    )}
  </Modal>
);

export default ProductModals;