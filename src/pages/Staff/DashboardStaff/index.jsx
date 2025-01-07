import { useDashboardData } from './hooks/useDashboardData';
import { Overview } from './components/StatisticCards/Overview';
// Import other components...

const DashboardStaff = () => {
  const { loading, statistics } = useDashboardData();

  return (
    <div className="dashboard-container">
      <DashboardCard title="Tổng quan bảng điều khiển" icon={<BarChartOutlined />}>
        {/* Dashboard content */}
      </DashboardCard>
      
      <Overview statistics={statistics} />
      {/* Other components */}
    </div>
  );
};

export default DashboardStaff;
