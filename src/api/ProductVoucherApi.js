import api from "../api/config";

// Fetch all product vouchers with pagination
export const getAllProductVouchers = async (pageIndex = 1, pageSize = 10) => {
  try {
    const response = await api.get(`/productVoucher/get-all-product-voucher`, {
      params: { pageIndex, pageSize },
    });
    return response.data; // Access the full response directly
  } catch (error) {
    console.error("Error fetching all product vouchers:", error);
    return null;
  }
};

// Fetch a product voucher by its ID with pagination
export const getProductVoucherById = async (
  id,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const response = await api.get(
      `/productVoucher/get-product-voucher-by-id`,
      {
        params: { id, pageIndex, pageSize },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product voucher by ID:", error);
    return null;
  }
};

// Fetch product vouchers associated with a specific product ID with pagination
export const getProductVoucherByProductId = async (
  productId,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const response = await api.get(
      "/productVoucher/get-product-voucher-by-product-id",
      {
        params: { productId, pageIndex, pageSize },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product voucher by Product ID:", error);
    return null;
  }
};

// Fetch product vouchers associated with a specific supplier ID with pagination
export const getProductVoucherBySupplierId = async (
  supplierId,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const response = await api.get(
      "/productVoucher/get-product-voucher-by-supplier-id",
      {
        params: { supplierId, pageIndex, pageSize },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product voucher by Supplier ID:", error);
    return null;
  }
};

// Create a new product voucher
export const createProductVoucher = async (productID, vourcherID) => {
  try {
    const response = await api.post(`/productVoucher/create-product-voucher`, {
      productID,
      vourcherID,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product voucher:", error);
    return null;
  }
};

// Update an existing product voucher
export const updateProductVoucher = async (
  productVoucherID,
  productID,
  voucherID
) => {
  try {
    const response = await api.put("/productVoucher/update-product-voucher", {
      productVoucherID,
      productID,
      voucherID,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product voucher:", error);
    return null;
  }
};

// Delete a product voucher by its ID
export const deleteProductVoucher = async (voucherId) => {
  try {
    const response = await api.delete(
      `/productVoucher/delete-product-voucher`,
      {
        params: { voucherId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting product voucher:", error);
    return null;
  }
};
