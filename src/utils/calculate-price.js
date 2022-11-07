const calculateCartPrice = (priceObj, quantity) => {
  const { auction_cost, seller_commision, platform_commision, packaging_cost, shipping_cost } =
    priceObj;
  const priceSum = auction_cost * (1 + seller_commision / 100) * (1 + platform_commision / 100);
  return priceSum * quantity + shipping_cost + packaging_cost;
};

export { calculateCartPrice };
