import React from 'react';
import { Card, Statistic } from 'antd';
import { Line } from 'react-chartjs-2';

const PaymentStatisticsChart = ({ payments, formatter }) => {
  if (!payments) return null;

  return (
    <Card title="Thống kê thanh toán" className="shadow-md">
      <Statistic
        title="Tổng doanh thu"
        value={payments.totalRevenue}
        precision={0}
        formatter={(value) => formatter.format(value)}
      />
      <Line
        data={{
          labels: payments.monthlyRevenue?.map((m) => `${m.month}/${m.year}`),
          datasets: [{
            label: "Doanh thu theo tháng",
            data: payments.monthlyRevenue?.map((m) => m.totalRevenue),
            borderColor: "#36a2eb",
            tension: 0.1,
          }],
        }}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </Card>
  );
};

export default PaymentStatisticsChart;
