import api from "../api/config";

export const createExtend = async (extendData) => {
  try {
    const res = await api.post("/extend/create-extend", extendData);
    return res.data;
  } catch (err) {
    console.error("Error creating extend:", err);
    return null;
  }
};
export const getExtendById = async (extensID) => {
  if (!extensID) {
    console.error("Error: extensID is required");
    return null;
  }
  try {
    const res = await api.get(`/extend/get-extend-by-id?extensID=${extensID}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching extend by ID:", err);
    return null;
  }
};
export const getAllExtendsByOrderId = async (
  orderID,
  pageIndex = 1,
  pageSize = 10
) => {
  if (!orderID) {
    console.error("Error: orderID is required");
    return null;
  }
  try {
    const res = await api.get(
      `/extend/get-all-extend-by-order-id?orderID=${orderID}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching all extends by order ID:", err);
    return null;
  }
};

export const formatExtendDuration = (durationUnit, durationValue) => {
  const units = ["giờ", "ngày", "tuần", "tháng"];
  return `${durationValue} ${units[durationUnit] || "giờ"}`;
};