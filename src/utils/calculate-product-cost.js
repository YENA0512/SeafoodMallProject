const calculateProductCost = (priceObj) => {
  const { auction_cost, seller_commision, platform_commision, packaging_cost } = priceObj;
  const priceSum = auction_cost * (1 + seller_commision / 100) * (1 + platform_commision / 100);
  return priceSum + packaging_cost;
};

export { calculateProductCost };
