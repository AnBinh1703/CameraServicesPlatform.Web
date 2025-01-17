import api from "../api/config";

// Create a new return detail
export const createReturnDetail = async (data) => {
  try {
    const res = await api.post("/returnDetail/create-return", data);
    return res.data;
  } catch (err) {
    console.error("Error creating return detail:", err);
    return null;
  }
};

// Update an existing return detail by ID
export const updateReturnDetail = async (returnId, data) => {
  try {
    const res = await api.put(
      `/returnDetail/update-return-detail-by-id?ReturnId=${returnId}`,
      data
    );
    return res.data;
  } catch (err) {
    console.error("Error updating return detail:", err);
    return null;
  }
};

// Delete a return detail by ID
export const deleteReturnDetail = async (returnId) => {
  try {
    const res = await api.delete(
      `/returnDetail/delete-return-detail-by-id?ReturnId=${returnId}`
    );
    return res.data;
  } catch (err) {
    console.error("Error deleting return detail:", err);
    return null;
  }
};

// Get a return detail by ID
export const getReturnDetailById = async (returnId) => {
  try {
    const res = await api.get(
      `/returnDetail/get-return-detail-by-id?returnId=${returnId}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching return detail by ID:", err);
    return null;
  }
};

// Get a return detail by Order ID
export const getReturnDetailByOrderId = async (orderId) => {
  try {
    const res = await api.get(
      `/returnDetail/get-return-detail-by-order-id?OrderId=${orderId}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching return detail by Order ID:", err);
    return null;
  }
};

// Get all return details with pagination
export const getAllReturnDetails = async (pageIndex = 1, pageSize = 100) => {
  try {
    const res = await api.get("/returnDetail/get-all-return-detail", {
      params: { pageIndex, pageSize },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching all return details:", err);
    return null;
  }
};
// Create a new return detail for a member
export const createReturnDetailForMember = async (data) => {
  try {
    const res = await api.post("/returnDetail/create-return-for-member", data);
    return res.data;
  } catch (err) {
    console.error("Error creating return detail for member:", err);
    return null;
  }
};
