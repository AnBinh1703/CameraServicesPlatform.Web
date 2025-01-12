import api from "../api/config";

export const getAllProductReports = async (pageIndex = 1, pageSize = 10) => {
  try {
    const res = await api.get(`/productReport/get-all-product-report`, {
      params: { pageIndex, pageSize },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi tải tất cả báo cáo sản phẩm:", err);
    return null;
  }
};
export const getProductReportById = async (
  id,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const res = await api.get(`/productReport/get-product-report-by-id`, {
      params: { id, pageIndex, pageSize },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi tải báo cáo sản phẩm theo ID:", err);
    return null;
  }
};
export const getProductReportBySupplierId = async (
  supplierId,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const res = await api.get(
      `/productReport/get-product-report-by-supplierId`,
      {
        params: { id: supplierId, pageIndex, pageSize },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Lỗi khi tải báo cáo sản phẩm theo ID nhà cung cấp:", err);
    return null;
  }
};
export const getProductReportByProductId = async (
  id,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const res = await api.get(`/productReport/get-product-report-by-productId`, {
      params: { id, pageIndex, pageSize },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi tải báo cáo sản phẩm theo ID sản phẩm:", err);
    return null;
  }
};
export const createProductReport = async (data) => {
  try {
    const res = await api.post(`/productReport/create-product-report`, data);
    return res.data;
  } catch (err) {
    console.error("Lỗi khi tạo báo cáo sản phẩm:", err);
    return null;
  }
};
export const updateProductReport = async (
  productReportID,
  statusType,
  endDate,
  reason
) => {
  try {
    const res = await api.put(`/productReport/update-product-report`, {
      productReportID,
      statusType,
      endDate,
      reason,
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi cập nhật báo cáo sản phẩm:", err);
    return null;
  }
};
export const deleteProductReport = async (productReportId) => {
  try {
    const res = await api.delete(`/productReport/delete-product-report`, {
      params: { productReportId },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi xóa báo cáo sản phẩm:", err);
    return null;
  }
};

export const approveProductReport = async (productReportID, message) => {
  try {
    const res = await api.put(`/productReport/approved-product-report`, {
      productReportID,
      message,
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi phê duyệt báo cáo sản phẩm:", err);
    return null;
  }
};

export const rejectProductReport = async (productReportID, message) => {
  try {
    const res = await api.put(`/productReport/reject-product-report`, {
      productReportID,
      message,
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi từ chối báo cáo sản phẩm:", err);
    return null;
  }
};

// Get product reports by account ID
export const getProductReportByAccountId = async (accountId, pageIndex = 1, pageSize = 10) => {
  try {
    const res = await api.get(`/productReport/get-product-report-by-account-id`, {
      params: { accountId, pageIndex, pageSize },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi tải báo cáo sản phẩm theo ID tài khoản:", err);
    return null;
  }
};

// Get product reports by product ID and account ID
export const getProductReportByProductIdAndAccountId = async (
  productId,
  accountId,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const res = await api.get(`/productReport/get-product-report-by-productId-and-account-id`, {
      params: { productId, accountId, pageIndex, pageSize },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi tải báo cáo sản phẩm theo ID sản phẩm và ID tài khoản:", err);
    return null;
  }
};
