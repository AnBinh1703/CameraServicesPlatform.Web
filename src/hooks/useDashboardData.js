import { useEffect, useState } from 'react';
import { message } from 'antd';
import {
  getBestSellingCategoriesBySupplier,
  getSupplierProductStatistics,
  getMonthOrderCostStatisticsBySupplier,
  // ... other imports
} from '../../api/dashboardApi';

export const useDashboardData = (supplierId, dateRange) => {
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    bestSellingCategories: [],
    productStats: [],
    orderCosts: [],
    orderStats: {},
    totalRevenue: 0,
    monthlyRevenue: [],
    ratings: [],
    payments: [],
    transactions: [],
    orderStatus: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!supplierId || !dateRange[0] || !dateRange[1]) return;

      setLoading(true);
      try {
        const [startDate, endDate] = dateRange.map((date) => date.format('YYYY-MM-DD'));

        const [
          bestSellingCategories,
          productStats,
          orderCosts,
          // ... other API calls
        ] = await Promise.all([
          getBestSellingCategoriesBySupplier(supplierId, startDate, endDate),
          getSupplierProductStatistics(supplierId),
          // ... other API calls
        ]);

        setStatistics({
          bestSellingCategories: bestSellingCategories || [],
          productStats: productStats || [],
          // ... set other statistics
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        message.error('Không thể tải dữ liệu bảng điều khiển');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [supplierId, dateRange]);

  return { loading, statistics };
};
