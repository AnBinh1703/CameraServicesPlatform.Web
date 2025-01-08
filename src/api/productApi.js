import api from "../api/config";
import { handleApiError } from "./handleApiError"; // Adjust the path as necessary

export const getAllProduct = async (pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/product/get-all-product?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );

    if (res.status === 200 && res.data) {
      return res.data.result;
    }

    return [];
  } catch (err) {
    console.error("Error fetching products:", err);
    return null;
  }
};

// Create product for buy
// Create product for buy
export const createProductBuy = async (formData) => {
  try {
    const response = await api.post(`/product/create-product-buy`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product for buy:", error);
    throw error;
  }
};

// Create product for rent
export const createProductRent = async (formData) => {
  try {
    const response = await api.post(`/product/create-product-rent`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product for rent:", error);
    throw error;
  }
};

export const getProductById = async (id, pageIndex = 1, pageSize = 10) => {
  try {
    const response = await api.get(`/product/get-product-by-id`, {
      params: {
        id,
        pageIndex,
        pageSize,
      },
    });

    if (response.data && response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error("Product not found");
    }
  } catch (error) {
    const errorMessage = handleApiError(error);
    throw new Error(errorMessage);
  }
};

export const getProductBySupplierId = async (
  supplierId,
  pageIndex,
  pageSize
) => {
  try {
    const response = await api.get(
      `/product/get-product-by-supplierId?filter=${supplierId}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );

    if (response.status === 200 && response.data && response.data.isSuccess) {
      return response.data.result;
    }

    return null;
  } catch (error) {
    console.error("Error fetching products by supplier ID:", error);
    return null;
  }
};

export const getProductByName = async (
  filter,
  pageIndex = 1,
  pageSize = 20
) => {
  try {
    const response = await api.get(`/product/get-product-by-name`, {
      params: {
        filter,
        pageIndex,
        pageSize,
      },
    });

    if (response.status === 200 && response.data && response.data.isSuccess) {
      return response.data.result; // Returning result which contains items
    }

    return null;
  } catch (error) {
    console.error("Error fetching products by name:", error);
    return null;
  }
};

export const getProductByCategoryName = async (
  filter,
  pageIndex = 1,
  pageSize = 20
) => {
  try {
    const response = await api.get(
      `/product/get-product-by-category-name?filter=${filter}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );

    if (response.status === 200 && response.data && response.data.isSuccess) {
      return response.data.result;
    }

    return null;
  } catch (error) {
    console.error("Error fetching products by category name:", error);
    return null;
  }
};

export const getProductByCategoryId = async (filter, pageIndex, pageSize) => {
  try {
    const response = await api.get(
      `/product/get-product-by-category-id?filter=${filter}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );

    if (response.status === 200 && response.data && response.data.isSuccess) {
      return response.data.result;
    }

    return null;
  } catch (error) {
    console.error("Error fetching products by category ID:", error);
    return null;
  }
};

export const updateProduct = async (formData) => {
  try {
    const response = await api.put(`product/update-product`, formData, {
      headers: {
        accept: "text/plain",
        // Removed "Content-Type": "multipart/form-data" to allow Axios to set it automatically
      },
    });

    if (response.status === 200 && response.data.isSuccess) {
      return response.data.result;
    }

    console.error("Failed to update product:", response.data.messages);
    return null;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    if (!productId) {
      console.error("Product ID is required to delete a product.");
      return false;
    }

    const response = await api.delete("/product/delete-product", {
      params: { productId },
    });

    if (response.status === 200) {
      console.log("Product deleted successfully.");
      return true;
    }

    console.error("Failed to delete product:", response.data.messages);
    return false;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
};

export const updateProductRent = async (data) => {
  try {
    const response = await api.put(`/product/update-product-rent`, data, {});

    if (response.status === 200 && response.data.isSuccess) {
      return response.data.result;
    }

    console.error("Failed to update product for rent:", response.data.messages);
    return null;
  } catch (error) {
    console.error("Error updating product for rent:", error);
    throw error;
  }
};

export const getProposalProductFollowVoucher = async (pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/product/proposal-product-follow-vourcher?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );

    if (res.status === 200 && res.data) {
      return res.data.result;
    }

    return [];
  } catch (err) {
    console.error("Error fetching products following voucher:", err);
    handleApiError(err);
    return null;
  }
};

// Fetch all products following a job buy, requires accountId
export const getProposalProductFollowJobBuy = async (
  accountId,
  pageIndex,
  pageSize
) => {
  if (!accountId) {
    console.error("accountId is required");
    return null;
  }

  try {
    const res = await api.get(
      `/product/proposal-product-follow-job-buy?accountId=${accountId}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );

    if (res.status === 200 && res.data) {
      return res.data.result;
    }

    return [];
  } catch (err) {
    console.error("Error fetching products following job buy:", err);
    handleApiError(err);
    return null;
  }
};

// Fetch all products following a hobby, requires accountId
export const getProposalProductFollowHobby = async (
  accountId,
  pageIndex,
  pageSize
) => {
  if (!accountId) {
    console.error("accountId is required");
    return null;
  }

  try {
    const res = await api.get(
      `/product/proposal-product-follow-hobby?accountId=${accountId}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );

    if (res.status === 200 && res.data) {
      return res.data.result;
    }

    return [];
  } catch (err) {
    console.error("Error fetching products following hobby:", err);
    handleApiError(err);
    return null;
  }
};
