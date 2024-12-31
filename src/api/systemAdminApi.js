import api from "../api/config";

export const getAllSystemAdmins = async (pageNumber, pageSize) => {
  try {
    const response = await api.get("/SystemAdmin/get-all-system-admins", {
      params: { pageNumber, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all system admins:", error);
    throw error;
  }
};

export const createSystemAdmin = async (systemAdminData) => {
  try {
    const response = await api.post(
      "/SystemAdmin/create-system-admin",
      systemAdminData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating system admin:", error);
    throw error;
  }
};

export const getNewCancelAcceptValue = async () => {
  try {
    const response = await api.get("/SystemAdmin/get-new-cancel-accept-value");
    return response.data;
  } catch (error) {
    console.error("Error fetching new cancel accept value:", error);
    throw error;
  }
};

export const getNewCancelValue = async () => {
  try {
    const response = await api.get("/SystemAdmin/get-new-cancel-value");
    return response.data;
  } catch (error) {
    console.error("Error fetching new cancel value:", error);
    throw error;
  }
};

export const getNewReservationMoney = async () => {
  try {
    const response = await api.get("/SystemAdmin/get-new-reservation-money");
    return response.data;
  } catch (error) {
    console.error("Error fetching new reservation money:", error);
    throw error;
  }
};
