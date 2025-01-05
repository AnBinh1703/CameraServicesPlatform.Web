import moment from 'moment';
import { getCategoryById } from "../../../../api/categoryApi";
import { getSupplierById } from "../../../../api/supplierApi";

export const formatDateTime = (date) => moment(date).format("DD/MM/YYYY HH:mm");

export const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

export const isWithinBusinessHours = (time, isStartDate = true) => {
  const hours = time.hours();
  if (isStartDate) {
    return hours >= 8 && hours <= 17;
  }
  return hours >= 8 && hours <= 20;
};

export const calculateProductPriceRent = (values, productPrices) => {
  const { durationUnit, durationValue } = values;
  const durationOptions = {
    0: { min: 2, max: 8 }, // Hour
    1: { min: 1, max: 3 }, // Day
    2: { min: 1, max: 2 }, // Week
    3: { min: 1, max: 1 }, // Month
  };

  if (!durationOptions[durationUnit]) {
    return 0;
  }

  if (!durationValue || durationValue <= 0) {
    return 0;
  }

  const { min, max } = durationOptions[durationUnit];
  if (durationValue < min || durationValue > max) {
    return 0;
  }

  let price = 0;
  switch (durationUnit) {
    case 0:
      price = durationValue * productPrices.pricePerHour;
      break;
    case 1:
      price = durationValue * productPrices.pricePerDay;
      break;
    case 2:
      price = durationValue * productPrices.pricePerWeek;
      break;
    case 3:
      price = durationValue * productPrices.pricePerMonth;
      break;
    default:
      price = 0;
  }
  return price;
};

export const calculateRentalEndDate = (startDate, durationValue, durationUnit) => {
  if (!startDate) return null;

  const start = moment(startDate);
  if (!isWithinBusinessHours(start, true)) {
    return null;
  }

  let endDate;
  switch (durationUnit) {
    case 0: // Hours
      endDate = start.clone().add(durationValue, "hours");
      if (!isWithinBusinessHours(endDate, false)) {
        return null;
      }
      break;
    case 1: // Days
      endDate = start.clone().add(durationValue, "days").hours(17);
      break;
    case 2: // Weeks
      endDate = start.clone().add(durationValue, "weeks").hours(17);
      break;
    case 3: // Months
      endDate = start.clone().add(durationValue, "months").hours(17);
      break;
    default:
      return null;
  }
  return endDate;
};

export const fetchCategoryAndSupplierNames = async (orderDetails, setCategoryMap, setLocalSupplierMap) => {
  const uniqueCategoryIDs = [
    ...new Set(orderDetails.map((detail) => detail.product?.categoryID)),
  ].filter((id) => id);
  const uniqueSupplierIDs = [
    ...new Set(orderDetails.map((detail) => detail.product?.supplierID)),
  ].filter((id) => id);

  try {
    const categoryPromises = uniqueCategoryIDs.map((id) =>
      getCategoryById(id)
    );
    const supplierPromises = uniqueSupplierIDs.map((id) =>
      getSupplierById(id)
    );

    const [categories, suppliers] = await Promise.all([
      Promise.all(categoryPromises),
      Promise.all(supplierPromises),
    ]);

    const newCategoryMap = {};
    categories.forEach((res, index) => {
      const id = uniqueCategoryIDs[index];
      newCategoryMap[id] = res.isSuccess
        ? res.result?.categoryName || "Không xác định"
        : "Không xác định";
    });

    const supplierDict = {};
    suppliers.forEach((response, index) => {
      const id = uniqueSupplierIDs[index];
      if (response && response.isSuccess) {
        supplierDict[id] = response.result;
      } else {
        supplierDict[id] = {
          supplierName: "Không xác định",
          supplierAddress: "Không xác định",
        };
      }
    });

    setCategoryMap(newCategoryMap);
    setLocalSupplierMap(supplierDict);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const validateTimeConstraints = (startDate, endDate, durationUnit) => {
  if (!startDate || !endDate) return false;

  if (!isWithinBusinessHours(moment(startDate), true)) {
    return false;
  }

  if (!isWithinBusinessHours(moment(endDate), false)) {
    return false;
  }

  if (durationUnit === 0) {
    const endHour = moment(endDate).hours();
    if (endHour > 20) {
      return false;
    }
  }

  return true;
};
