const calculateCartPrice = (product_cost, quantity) => {
  const cartCost = product_cost * quantity;
  return cartCost;
};

export { calculateCartPrice };
