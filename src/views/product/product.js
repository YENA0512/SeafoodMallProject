// import * as Api from '../api.js';
// import { randomId } from '/useful-functions.js';

const ProductTitle = document.querySelector('.product_title');
const packageCondition = document.querySelector('.package_condition');
const platformCondition = document.querySelector('.platform_condition');
const deliveryCondition = document.querySelector('.delivery_condition');
const totalPrice = document.querySelector('.product_total');
// const cartButton = document.querySelector('.insert_cart');

// 상품 정보 받아오는 함수
const getProductData = async () => {
  const res = await fetch('./product.json');
  // fetch로 테스트용으로 적은것. 결과물은 products 동일
  const product = await res.json();
  const { title, price, package_condition, platform_condition, delivery_condition } = product[0];
  console.log(product);
  console.log(package_condition);

  ProductTitle.innerHTML = title;
  packageCondition.innerHTML = package_condition;
  platformCondition.innerHTML = platform_condition;
  deliveryCondition.innerHTML = delivery_condition;

  let total = package_condition + platform_condition + delivery_condition + price;

  totalPrice.innerHTML = total;
};

// 모음영역
addAllElements();
addAllEvents();

async function addAllElements() {
  getProductData();
}

function addAllEvents() {
  // for eslint pass
}
