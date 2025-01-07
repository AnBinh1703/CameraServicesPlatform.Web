import api from "../api/config";

// Get system rating statistics
export const getSystemRatingStatistics = async () => {
  try {
    const response = await api.get("/dashboard/system-rating-statistics");
    return response.data; // System rating statistics
  } catch (error) {
    console.error("Error fetching system rating statistics:", error);
    throw error;
  }
};

// Get system payment statistics
export const getSystemPaymentStatistics = async (startDate, endDate) => {
  try {
    const response = await api.get("/dashboard/system-payment-statistics", {
      params: { startDate, endDate },
    });
    return response.data; // System payment statistics
  } catch (error) {
    console.error("Error fetching system payment statistics:", error);
    throw error;
  }
};

// Get best selling categories
export const getBestSellingCategories = async (startDate, endDate) => {
  try {
    const response = await api.get("/dashboard/best-selling-categories", {
      params: { startDate, endDate },
    });
    return response.data; // Array of categories
  } catch (error) {
    console.error("Error fetching best selling categories:", error);
    throw error; // Rethrow to handle it in the component
  }
};

// Get system transaction statistics
export const getSystemTransactionStatistics = async (startDate, endDate) => {
  try {
    const response = await api.get("/dashboard/system-transaction-statistics", {
      params: { startDate, endDate },
    });
    return response.data; // System transaction statistics
  } catch (error) {
    console.error("Error fetching system transaction statistics:", error);
    throw error;
  }
};

// Get month order purchase statistics
export const getMonthOrderPurchaseStatistics = async (startDate, endDate) => {
  try {
    const response = await api.get(
      "/dashboard/get-month-order-purchase-statistics",
      {
        params: { startDate, endDate },
      }
    );
    return response.data; // Month order purchase statistics
  } catch (error) {
    console.error("Error fetching month order purchase statistics:", error);
    throw error;
  }
};

// Get month order rent statistics
export const getMonthOrderRentStatistics = async (startDate, endDate) => {
  try {
    const response = await api.get(
      "/dashboard/get-month-order-rent-statistics",
      {
        params: { startDate, endDate },
      }
    );
    return response.data; // Month order rent statistics
  } catch (error) {
    console.error("Error fetching month order rent statistics:", error);
    throw error;
  }
};

// Get all month order cost statistics
export const getAllMonthOrderCostStatistics = async (startDate, endDate) => {
  try {
    const response = await api.get(
      "/dashboard/get-all-month-order-cost-statistics",
      {
        params: { startDate, endDate },
      }
    );
    return response.data; // All month order cost statistics
  } catch (error) {
    console.error("Error fetching all month order cost statistics:", error);
    throw error;
  }
};

// Get order status statistics
export const getOrderStatusStatistics = async () => {
  try {
    const response = await api.get("/dashboard/get-order-status-statistics");
    return response.data; // Order status statistics
  } catch (error) {
    console.error("Error fetching order status statistics:", error);
    throw error;
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

// Get order status statistics 
export const getMonthOrderCostStatistics = async (startDate, endDate) => {
  try {
    const response = await api.get(
      "/dashboard/get-month-order-cost-statistics",
      {
        params: { startDate, endDate },
      }
    );
    return response.data; // Array of month cost statistics
  } catch (error) {
    console.error("Error fetching month order cost statistics:", error);
    throw error;
  }
};
//==========================
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