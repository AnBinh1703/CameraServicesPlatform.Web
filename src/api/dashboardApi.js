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
}; // Get system payment statistics
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
}; // Get best selling categories
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

//----------------------------------
// Get month order cost statistics by supplier
export const getMonthOrderCostStatisticsBySupplier = async (
  supplierId,
  startDate,
  endDate
) => {
  try {
    // Format dates as ISO strings (YYYY-MM-DD)
    const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
    const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');

    const response = await api.get(
      `/dashboard/get-month-order-cost-statistics/${supplierId}`,
      {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching month order cost statistics for supplier ${supplierId}:`,
      error
    );
    throw error;
  }
};
// Get best selling categories by supplier
export const getBestSellingCategoriesBySupplier = async (
  supplierId,
  startDate,
  endDate
) => {
  try {
    const response = await api.get(
      `/dashboard/best-selling-categories-by-supplier-id/${supplierId}`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data; // Array of categories
  } catch (error) {
    console.error(
      `Error fetching best selling categories for supplier ${supplierId}:`,
      error
    );
    throw error;
  }
};

// Get supplier product statistics
export const getSupplierProductStatistics = async (supplierId) => {
  try {
    const response = await api.get(
      `/dashboard/get-supplier-product-statistics/${supplierId}`
    );
    return response.data; // Array of products
  } catch (error) {
    console.error(
      `Error fetching product statistics for supplier ${supplierId}:`,
      error
    );
    throw error;
  }
};

// Get account order statistics
export const getAccountOrderStatistics = async (
  accountId,
  startDate,
  endDate
) => {
  try {
    const response = await api.get(
      `/dashboard/get-account-order-statistics-by-account-id/${accountId}`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data; // Order statistics object
  } catch (error) {
    console.error(
      `Error fetching order statistics for account ${accountId}:`,
      error
    );
    throw error;
  }
};

// Get supplier order statistics
export const getSupplierOrderStatistics = async (
  supplierId,
  startDate,
  endDate
) => {
  try {
    const response = await api.get(
      `/dashboard/get-supplier-order-statistics/${supplierId}`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data; // Order statistics object
  } catch (error) {
    console.error(
      `Error fetching order statistics for supplier ${supplierId}:`,
      error
    );
    throw error;
  }
};

// Get calculate total revenue by supplier
export const getCalculateTotalRevenueBySupplier = async (supplierId) => {
  try {
    const response = await api.get(
      `/dashboard/get-calculate-total-revenue-by-supplier/${supplierId}`
    );
    return response.data; // Total revenue
  } catch (error) {
    console.error(
      `Error calculating total revenue for supplier ${supplierId}:`,
      error
    );
    throw error;
  }
};

// Get calculate monthly revenue by supplier
export const getCalculateMonthlyRevenueBySupplier = async (
  supplierId,
  startDate,
  endDate
) => {
  try {
    const response = await api.get(
      `/dashboard/get-calculate-monthly-revenue-by-supplier/${supplierId}`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data; // Array of monthly revenue statistics
  } catch (error) {
    console.error(
      `Error calculating monthly revenue for supplier ${supplierId}:`,
      error
    );
    throw error;
  }
};

// Get supplier rating statistics
export const getSupplierRatingStatistics = async (supplierId) => {
  try {
    const response = await api.get(
      `/dashboard/supplier-rating-statistics/${supplierId}`
    );
    return response.data; // Rating statistics
  } catch (error) {
    console.error(
      `Error fetching rating statistics for supplier ${supplierId}:`,
      error
    );
    throw error;
  }
};

// Get supplier payment statistics
export const getSupplierPaymentStatistics = async (
  supplierId,
  startDate,
  endDate
) => {
  try {
    const response = await api.get(
      `/dashboard/supplier-payment-statistics/${supplierId}`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data; // Supplier payment statistics
  } catch (error) {
    console.error(
      `Error fetching payment statistics for supplier ${supplierId}:`,
      error
    );
    throw error;
  }
};

// Get supplier transaction statistics
export const getSupplierTransactionStatistics = async (
  supplierId,
  startDate,
  endDate
) => {
  try {
    const response = await api.get(
      `/dashboard/supplier-transaction-statistics/${supplierId}`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data; // Supplier transaction statistics
  } catch (error) {
    console.error(
      `Error fetching transaction statistics for supplier ${supplierId}:`,
      error
    );
    throw error;
  }
};

// Get order status statistics by supplier
export const getOrderStatusStatisticsBySupplier = async (supplierId) => {
  try {
    const response = await api.get(
      `/dashboard/get-order-status-statistics-by-supplier-id/${supplierId}`
    );
    return response.data; // Order status statistics
  } catch (error) {
    console.error(
      `Error fetching order status statistics for supplier ${supplierId}:`,
      error
    );
    throw error;
  }
};
