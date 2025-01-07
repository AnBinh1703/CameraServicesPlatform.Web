import {
  AppstoreOutlined,
  DollarCircleOutlined,
  FlagOutlined,
  GiftOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';

// ...existing cardColors array...

export const getStatCards = (stats) => {
  return [
    {
      title: "Tổng doanh thu",
      value: stats.totalMoney,
      prefix: DollarCircleOutlined,
      suffix: "VNĐ",
      color: cardColors[0],
    },
    {
      title: "Người dùng",
      value: stats.userCount,
      prefix: UserOutlined,
      color: cardColors[1],
    },
    // ...remaining card configurations with the same pattern...
    {
      title: "Đánh giá trung bình",
      value: (stats.averageRating || 0).toFixed(1),
      prefix: StarOutlined,
      suffix: "⭐",
      color: cardColors[11],
    },
  ];
};
