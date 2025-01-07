export const formatNumber = (number) => {
  return new Intl.NumberFormat('vi-VN').format(number);
};
