import { CheckOutlined, CheckCircleOutlined, SmileOutlined, CarOutlined } from "@ant-design/icons";

export const ORDER_STEPS = [
  {
    title: "Phê duyệt đơn hàng",
    description: "Xác nhận và phê duyệt đơn hàng mới",
    status: 0,
    icon: <CheckOutlined />,
    action: "approve",
    color: "green",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
    textColor: "text-green-700",
  },
  // ... other steps
];

export const ORDER_DETAILS_COLUMNS = [
  {
    title: "Mã chi tiết đơn hàng",
    dataIndex: "orderDetailsID",
    key: "orderDetailsID",
  },
  // ... other columns
];

export const EXTEND_COLUMNS = [
  {
    title: "Mã gia hạn",
    dataIndex: "extendId",
    key: "extendId",
  },
  // ... other columns
];
