import api from "../api/config";

// Function to get all combos with pagination
export const getAllCombos = async (pageIndex = 1, pageSize = 10) => {
  try {
    const response = await api.get(`/combo/get-all-combo`, {
      params: { pageIndex, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch combos:`, error);
    return {
      isSuccess: false,
      messages: [`Failed to fetch combos`],
    };
  }
};

// Function to get a combo by ID
export const getComboById = async (id, pageIndex = 1, pageSize = 10) => {
  try {
    const response = await api.get(`/combo/get-combo-by-id`, {
      params: { id, pageIndex, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch combo by ID:`, error);
    return {
      isSuccess: false,
      messages: [`Failed to fetch combo by ID`],
    };
  }
};

// Function to create a new combo
export const createCombo = async (comboData) => {
  try {
    const response = await api.post(`/combo/create-combo`, comboData);
    return response.data;
  } catch (error) {
    console.error(`Failed to create combo:`, error);
    return {
      isSuccess: false,
      messages: [`Failed to create combo`],
    };
  }
};

// Function to update an existing combo
export const updateCombo = async (comboData) => {
  try {
    const response = await api.put(`/combo/update-combo`, comboData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update combo:`, error);
    return {
      isSuccess: false,
      messages: [`Failed to update combo`],
    };
  }
};

// Function to get all combos of supplier with pagination
export const getAllCombosOfSupplier = async (pageIndex = 1, pageSize = 100) => {
  try {
    const response = await api.get(
      `/comboOfSupplier/get-all-combo-of-supplier`,
      {
        params: { pageIndex, pageSize },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch combos of supplier:`, error);
    return {
      isSuccess: false,
      messages: [`Failed to fetch combos of supplier`],
    };
  }
};

// Function to get a combo of supplier by ID
export const getComboOfSupplierById = async (
  comboSupplierId,
  pageIndex = 1,
  pageSize = 100
) => {
  try {
    const response = await api.get(
      `/comboOfSupplier/get-combo-of-supplier-by-combo-supplier-id`,
      {
        params: { comboSupplierId, pageIndex, pageSize },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch combo of supplier by ID:`, error);
    return {
      isSuccess: false,
      messages: [`Failed to fetch combo of supplier by ID`],
    };
  }
};

// Function to create a new combo of supplier
export const createComboOfSupplier = async (comboData) => {
  try {
    const response = await api.post(
      `/comboOfSupplier/create-combo-of-supplier`,
      comboData
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to create combo of supplier:`, error);
    return {
      isSuccess: false,
      messages: [`Failed to create combo of supplier`],
    };
  }
};

// Function to update an existing combo of supplier
export const updateComboOfSupplier = async (comboData) => {
  try {
    const response = await api.put(
      `/comboOfSupplier/update-combo-of-supplier`,
      comboData
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update combo of supplier:`, error);
    return {
      isSuccess: false,
      messages: [`Failed to update combo of supplier`],
    };
  }
};
// Function to get combos of a supplier by supplier ID
export const getCombosBySupplierId = async (
  supplierId,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const response = await api.get(
      `/comboOfSupplier/get-combo-of-supplier-by-supplier-id`,
      {
        params: { supplierId, pageIndex, pageSize },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch combos by supplier ID:`, error);
    return {
      isSuccess: false,
      messages: [`Failed to fetch combos by supplier ID`],
    };
  }
};
// Function to get expired combos of supplier
export const getExpiredCombosOfSupplier = async (
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const response = await api.get(
      `/comboOfSupplier/get-combo-of-supplier-expired`,
      {
        params: { pageIndex, pageSize },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch expired combos of supplier:`, error);
    return {
      isSuccess: false,
      messages: [`Failed to fetch expired combos of supplier`],
    };
  }
};

// Function to get near-expired combos of supplier
export const getNearExpiredCombosOfSupplier = async (
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const response = await api.get(`/comboOfSupplier/get-combo-near-expired`, {
      params: { pageIndex, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch near-expired combos of supplier:`, error);
    return {
      isSuccess: false,
      messages: [`Failed to fetch near-expired combos of supplier`],
    };
  }
};
