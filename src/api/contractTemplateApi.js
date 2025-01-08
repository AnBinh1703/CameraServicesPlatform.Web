import api from "../api/config";

export const getContractTemplateByProductId = async (productID) => {
  try {
    const response = await api.get(
      "/contractTemplate/get-contract-template-by-product-id",
      {
        params: { productID },
      }
    );
    return response.data.result.items;
  } catch (error) {
    console.error("Error fetching contract templates by product ID:", error);
    throw error;
  }
};

export const createContractTemplate = async (templateData) => {
  try {
    const response = await api.post(
      "/contractTemplate/create-contract-template",
      templateData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating contract template:", error);
    throw error;
  }
};

export const updateContractTemplateById = async (
  contractTemplateId,
  templateData
) => {
  try {
    const response = await api.put(
      "/contractTemplate/update-contract-template-by-id",
      templateData,
      {
        params: { contractTemplateId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating contract template:", error);
    throw error;
  }
};

export const deleteContractTemplateById = async (contractTemplateId) => {
  try {
    const response = await api.delete(
      "/contractTemplate/delete-contract-template-by-id",
      {
        params: { contractTemplateId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting contract template:", error);
    throw error;
  }
};

export const getContractTemplateById = async (contractTemplateId) => {
  try {
    const response = await api.get(
      "/contractTemplate/get-contract-template-by-id",
      {
        params: { contractTemplateId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching contract template by ID:", error);
    throw error;
  }
};

export const getAllContractTemplates = async (pageIndex = 1, pageSize = 10) => {
  try {
    const response = await api.get(
      "/contractTemplate/get-all-contract-templates",
      {
        params: {
          pageIndex,
          pageSize,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all contract templates:", error);
    throw error;
  }
};

export const getContractTemplateByAccountId = async (accountID) => {
  try {
    const response = await api.get(
      "/contractTemplate/get-contract-template-by-account-id",
      {
        params: { accountID },
      }
    );
    return {
      items: response.data.result.items,
      productID: response.data.result.productID, // Added productID
    };
  } catch (error) {
    console.error("Error fetching contract templates by account ID:", error);
    throw error;
  }
};
