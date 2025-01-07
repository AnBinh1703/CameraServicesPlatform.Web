import api from "../api/config";

// Date formatting utility
const formatDateParam = (date) => {
  if (!(date instanceof Date)) return date;
  return date.toISOString();
};

// Error handling utility
const handleApiError = (error, context) => {
  console.error(`Error in ${context}:`, error);
  if (error.response) {
    // Server responded with error
    console.error('Server error:', error.response.data);
  }
  throw error;
};

// API Methods with improved error handling and date formatting
export const getSystemRatingStatistics = async () => {
  try {
    const response = await api.get("/dashboard/system-rating-statistics");
    return response.data || { totalRatings: 0, averageRating: 0, ratingDistribution: [] };
  } catch (error) {
    handleApiError(error, "getSystemRatingStatistics");
  }
};

export const getSystemPaymentStatistics = async (startDate, endDate) => {
  try {
    const response = await api.get("/dashboard/system-payment-statistics", {
      params: { 
        startDate: formatDateParam(startDate), 
        endDate: formatDateParam(endDate) 
      },
    });
    return response.data || { totalRevenue: 0, paymentCount: 0, revenueByMethod: [] };
  } catch (error) {
    handleApiError(error, "getSystemPaymentStatistics");
  }
};

export const getBestSellingCategories = async (startDate, endDate) => {
  try {
    const response = await api.get("/dashboard/best-selling-categories", {
      params: { 
        startDate: formatDateParam(startDate), 
        endDate: formatDateParam(endDate) 
      },
    });
    return response.data || [];
  } catch (error) {
    handleApiError(error, "getBestSellingCategories");
  }
};

export const getSystemTransactionStatistics = async (startDate, endDate) => {
  try {
    const response = await api.get("/dashboard/system-transaction-statistics", {
      params: { 
        startDate: formatDateParam(startDate), 
        endDate: formatDateParam(endDate) 
      },
    });
    return response.data || { totalRevenue: 0, transactionCount: 0 };
  } catch (error) {
    handleApiError(error, "getSystemTransactionStatistics");
  }
};

export const getMonthOrderPurchaseStatistics = async (startDate, endDate) => {
  try {
    const response = await api.get("/dashboard/get-month-order-purchase-statistics", {
      params: { 
        startDate: formatDateParam(startDate), 
        endDate: formatDateParam(endDate) 
      },
    });
    return response.data || [];
  } catch (error) {
    handleApiError(error, "getMonthOrderPurchaseStatistics");
  }
};

export const getMonthOrderRentStatistics = async (startDate, endDate) => {
  try {
    const response = await api.get("/dashboard/get-month-order-rent-statistics", {
      params: { 
        startDate: formatDateParam(startDate), 
        endDate: formatDateParam(endDate) 
      },
    });
    return response.data || [];
  } catch (error) {
    handleApiError(error, "getMonthOrderRentStatistics");
  }
};

export const getAllMonthOrderCostStatistics = async (startDate, endDate) => {
  try {
    const response = await api.get("/dashboard/get-all-month-order-cost-statistics", {
      params: { 
        startDate: formatDateParam(startDate), 
        endDate: formatDateParam(endDate) 
      },
    });
    return response.data || [];
  } catch (error) {
    handleApiError(error, "getAllMonthOrderCostStatistics");
  }
};

export const getOrderStatusStatistics = async () => {
  try {
    const response = await api.get("/dashboard/get-order-status-statistics");
    return response.data || [];
  } catch (error) {
    handleApiError(error, "getOrderStatusStatistics");
  }
};

export const getMonthOrderCostStatistics = async (startDate, endDate) => {
  try {
    const response = await api.get("/dashboard/get-month-order-cost-statistics", {
      params: { 
        startDate: formatDateParam(startDate), 
        endDate: formatDateParam(endDate) 
      },
    });
    return response.data || [];
  } catch (error) {
    handleApiError(error, "getMonthOrderCostStatistics");
  }
};

// Get system total money statistics
export const getSystemTotalMoneyStatistics = async () => {
  try {
    const response = await api.get(
      "/dashboard/get-system-total-money-statistics"
    );
    return response.data; // System total money statistics
  } catch (error) {
    console.error("Error fetching system total money statistics:", error);
    throw error;
  }
};
// Get user count statistics
export const getUserCount = async () => {
  try {
    const response = await api.get("/dashboard/get-user-count");
    return response.data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};

// Get report count statistics
export const getReportCount = async () => {
  try {
    const response = await api.get("/dashboard/get-report-count");
    return response.data;
  } catch (error) {
    console.error("Error fetching report count:", error);
    throw error;
  }
};

// Get product count statistics
export const getProductCount = async () => {
  try {
    const response = await api.get("/dashboard/get-product-count");
    return response.data;
  } catch (error) {
    console.error("Error fetching product count:", error);
    throw error;
  }
};

// Get supplier count statistics
export const getSupplierCount = async () => {
  try {
    const response = await api.get("/dashboard/get-supplier-count");
    return response.data;
  } catch (error) {
    console.error("Error fetching supplier count:", error);
    throw error;
  }
};

// Get staff count statistics
export const getStaffCount = async () => {
  try {
    const response = await api.get("/dashboard/get-staff-count");
    return response.data;
  } catch (error) {
    console.error("Error fetching staff count:", error);
    throw error;
  }
};

// Get category count statistics
export const getCategoryCount = async () => {
  try {
    const response = await api.get("/dashboard/get-category-count");
    return response.data;
  } catch (error) {
    console.error("Error fetching category count:", error);
    throw error;
  }
};

// Get combo count statistics
export const getComboCount = async () => {
  try {
    const response = await api.get("/dashboard/get-combo-count");
    return response.data;
  } catch (error) {
    console.error("Error fetching combo count:", error);
    throw error;
  }
};

// Get order count statistics
export const getOrderCount = async () => {
  try {
    const response = await api.get("/dashboard/get-order-count");
    return response.data;
  } catch (error) {
    console.error("Error fetching order count:", error);
    throw error;
  }
};

// Get product report count statistics
export const getProductReportCount = async () => {
  try {
    const response = await api.get("/dashboard/get-product-report-count");
    return response.data;
  } catch (error) {
    console.error("Error fetching product report count:", error);
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
      console.warn(`Product not found for ID: ${id}`);
      return { name: `Product ${id}` }; // Fallback display
    }
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return { name: `Product ${id}` }; // Fallback display on error
  }
};