import { colors } from './colors';
// Import all required icons...

export const orderStatusMap = {
  0: {
    text: "Chờ xử lý",
    color: colors.primary,
    // ... rest of status definitions
  },
  // ... other statuses
};

export const transactionTypeMap = {
  0: { text: "Mua hàng", color: colors.primary },
  1: { text: "Thuê", color: colors.success },
};

export const transactionStatusMap = {
  1: { text: "Đang xử lý", color: colors.warning },
  2: { text: "Hoàn thành", color: colors.success },
};
