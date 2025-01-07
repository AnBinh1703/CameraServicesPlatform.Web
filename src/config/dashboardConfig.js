const cardColors = [
  { gradient: "linear-gradient(135deg, #3498db, #2980b9)", textColor: "#fff" },
  { gradient: "linear-gradient(135deg, #2ecc71, #27ae60)", textColor: "#fff" },
  { gradient: "linear-gradient(135deg, #e74c3c, #c0392b)", textColor: "#fff" },
  { gradient: "linear-gradient(135deg, #9b59b6, #8e44ad)", textColor: "#fff" },
  { gradient: "linear-gradient(135deg, #f1c40f, #f39c12)", textColor: "#fff" },
  { gradient: "linear-gradient(135deg, #1abc9c, #16a085)", textColor: "#fff" },
  { gradient: "linear-gradient(135deg, #e67e22, #d35400)", textColor: "#fff" },
  { gradient: "linear-gradient(135deg, #34495e, #2c3e50)", textColor: "#fff" },
  { gradient: "linear-gradient(135deg, #16a085, #1abc9c)", textColor: "#fff" },
  { gradient: "linear-gradient(135deg, #8e44ad, #9b59b6)", textColor: "#fff" },
  { gradient: "linear-gradient(135deg, #FF9F43, #FFB976)", textColor: "#fff" },
  { gradient: "linear-gradient(135deg, #FF6B6B, #FF8E8E)", textColor: "#fff" },
];

export const getStatCards = (stats) => {
  return [
    {
      title: "Tổng thu",
      value: stats.totalRevenue,
      suffix: "VNĐ",
      color: cardColors[0],
    },
    {
      title: "Số lượng thanh toán",
      value: stats.paymentCount,
      color: cardColors[1],
    },
    {
      title: "Thanh toán hoàn thành",
      value: stats.completedPayments,
      color: cardColors[2],
    },
    {
      title: "Thanh toán đang chờ",
      value: stats.pendingPayments,
      color: cardColors[3],
    },
    {
      title: "Tổng doanh thu",
      value: stats.totalMoney,
      suffix: "VNĐ",
      color: cardColors[0],
    },
    {
      title: "Người dùng",
      value: stats.userCount,
      color: cardColors[1],
    },
    {
      title: "Báo cáo",
      value: stats.reportCount,
      color: cardColors[2],
    },
    {
      title: "Sản phẩm",
      value: stats.productCount,
      color: cardColors[3],
    },
    {
      title: "Nhà cung cấp",
      value: stats.supplierCount,
      color: cardColors[4],
    },
    {
      title: "Nhân viên",
      value: stats.staffCount,
      color: cardColors[5],
    },
    {
      title: "Danh mục",
      value: stats.categoryCount,
      color: cardColors[6],
    },
    {
      title: "Combo",
      value: stats.comboCount,
      color: cardColors[7],
    },
    {
      title: "Đơn hàng",
      value: stats.orderCount,
      color: cardColors[8],
    },
    {
      title: "Báo cáo sản phẩm",
      value: stats.productReportCount,
      color: cardColors[9],
    },
    {
      title: "Tổng số đánh giá",
      value: stats.totalRatings || 0,
      color: cardColors[10],
    },
    {
      title: "Đánh giá trung bình",
      value: (stats.averageRating || 0).toFixed(1),
      suffix: "⭐",
      color: cardColors[11],
    },
  ];
};
