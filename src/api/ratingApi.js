import api from "../api/config";

// Create a new rating
export const createRating = async (
  productID,
  accountID,
  ratingValue,
  reviewComment
) => {
  try {
    const res = await api.post(`/rating/create-rating`, {
      productID,
      accountID,
      ratingValue,
      reviewComment,
    });
    return res.data;
  } catch (err) {
    console.error("Error creating rating:", err);
    return null;
  }
};

// Update an existing rating
export const updateRating = async (
  ratingId,
  productID,
  accountID,
  ratingValue,
  reviewComment
) => {
  try {
    const res = await api.put(`/rating/update-rating/${ratingId}`, {
      productID,
      accountID,
      ratingValue,
      reviewComment,
    });
    return res.data;
  } catch (err) {
    console.error("Error updating rating:", err);
    return null;
  }
};

// Delete a rating by ID
export const deleteRating = async (ratingId) => {
  try {
    const res = await api.delete(`/rating/delete-rating-by-id`, {
      params: { ratingId },
    });
    return res.data;
  } catch (err) {
    console.error("Error deleting rating:", err);
    return null;
  }
};

// Get ratings by product ID with pagination
export const getRatingsByProductId = async (
  productId,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const res = await api.get(`/rating/get-ratings-by-product-id`, {
      params: { productId, pageIndex, pageSize },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching ratings for product:", err);
    return null;
  }
};

// Get a specific rating by rating ID
export const getRatingById = async (ratingId) => {
  try {
    const res = await api.get(`/rating/get-ratings-by-rating-id`, {
      params: { ratingId },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching rating by ID:", err);
    return null;
  }
};

// Get all ratings with pagination
export const getAllRatings = async (pageIndex = 1, pageSize = 10) => {
  try {
    const res = await api.get(`/rating/get-all-ratings`, {
      params: { pageIndex, pageSize },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching all ratings:", err);
    return null;
  }
};

// Get ratings by account ID with pagination
export const getRatingsByAccountId = async (accountId, pageIndex = 1, pageSize = 10) => {
  try {
    const res = await api.get(`/rating/get-ratings-by-account-id`, {
      params: { accountId, pageIndex, pageSize },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching ratings for account:", err);
    return null;
  }
};

// Get ratings by product and account ID with pagination
export const getRatingsByProductAndAccountId = async (
  productId,
  accountId,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const res = await api.get(`/rating/get-ratings-by-product-and-account-id`, {
      params: { productId, accountId, pageIndex, pageSize },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching ratings for product and account:", err);
    return null;
  }
};
