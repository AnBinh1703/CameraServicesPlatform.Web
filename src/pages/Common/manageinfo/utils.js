import moment from 'moment';

export const calculateProductPriceRent = (values, productPrices, durationOptions) => {
  const { durationUnit, durationValue } = values;
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
    case 0: price = durationValue * productPrices.pricePerHour; break;
    case 1: price = durationValue * productPrices.pricePerDay; break;
    case 2: price = durationValue * productPrices.pricePerWeek; break;
    case 3: price = durationValue * productPrices.pricePerMonth; break;
    default: price = 0;
  }
  return price;
};

export const calculateRentalEndDate = (startDate, durationValue, durationUnit) => {
  if (!startDate) return null;
  
  const start = moment(startDate);
  let endDate;

  switch (durationUnit) {
    case 0: endDate = start.clone().add(durationValue, 'hours'); break;
    case 1: endDate = start.clone().add(durationValue, 'days'); break;
    case 2: endDate = start.clone().add(durationValue, 'weeks'); break;
    case 3: endDate = start.clone().add(durationValue, 'months'); break;
    default: return null;
  }
  return endDate;
};

export const calculateExtendReturnDate = (endDate) => {
  if (!endDate) return null;
  return moment(endDate).clone().add(1, 'hours');
};
