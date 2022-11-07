const calculateCartPrice = (priceObj, quantity) => {
  const { auction_cost, seller_commision, platform_commision, packaging_cost, shipping_cost } =
    priceObj;
  const priceSum =
    auction_cost * (1 + seller_commision / 100) * (1 + platform_commision / 100) +
    packaging_cost +
    shipping_cost;
  return priceSum * quantity;
};

export { calculateCartPrice };
