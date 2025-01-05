// ...existing code...

export const getAllExtendsByOrderId = async (orderID, pageIndex = 1, pageSize = 10) => {
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
