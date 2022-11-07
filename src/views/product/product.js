import * as Api from '../../api.js';
import { addCommas } from '../../useful-functions.js';

const ProductTitle = document.querySelector('.product_title');
const packageCondition = document.querySelector('.package_condition');
const platformCondition = document.querySelector('.platform_condition');
const deliveryCondition = document.querySelector('.delivery_condition');
const totalPrice = document.querySelector('.product_total');
// const cartButton = document.querySelector('.insert_cart');

const pathUrl = window.location.pathname;
const productId = pathUrl.substring(9, pathUrl.length - 1);

// 상품 정보 받아오는 함수
const getProductData = async () => {
  const res = await Api.get(`/api/v1/products/${productId}`);
  const { category, price } = res;

  ProductTitle.innerHTML = category.species;
  packageCondition.innerHTML = addCommas(price.packaging_cost);
  platformCondition.innerHTML = addCommas(price.platform_commision);
  deliveryCondition.innerHTML = addCommas(price.shipping_cost);

  let totalCost =
    price.packaging_cost + price.platform_commision + price.shipping_cost + price.auction_cost;

  totalPrice.innerHTML = addCommas(totalCost);
};
getProductData();
