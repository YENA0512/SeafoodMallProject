import * as Api from '../../api.js';
import { addCommas } from '../../useful-functions.js';
import { addToDb, putToDb } from '../../indexed-db.js';

const ProductTitle = document.querySelector('.product_title');
const packageCondition = document.querySelector('.package_condition');
const platformCondition = document.querySelector('.platform_condition');
const deliveryCondition = document.querySelector('.delivery_condition');
const totalPrice = document.querySelector('.product_total');
const cartButton = document.querySelector('.insert_cart');
const MoveCart = document.querySelector('.go_cart');

// 로그인 확인
const isLogin = sessionStorage.getItem('userId');
// 추가 버튼 클릭 시 추가(test) /////////////
const pathUrl = window.location.pathname.split('/');
const productId = pathUrl[pathUrl.length - 2];

let category;
let price;
let totalCost;

// 상품 정보 받아오는 함수
const getProductData = async () => {
  const res = await Api.get(`/api/v1/products/${productId}`);
  console.log(res);
  category = res.category;
  price = res.price;

  ProductTitle.innerHTML = category.species;
  packageCondition.innerHTML = addCommas(price.packaging_cost);
  platformCondition.innerHTML = addCommas(price.platform_commision);
  deliveryCondition.innerHTML = addCommas(price.shipping_cost);

  totalCost =
    price.packaging_cost + price.platform_commision + price.shipping_cost + price.auction_cost;

  totalPrice.innerHTML = addCommas(totalCost);
};
getProductData();

const addItemToCart = async () => {
  // 비회원일때는 브라우저에 저장, 회원일때는 서버에 저장
  // 로그인 되어 있으면 서버에 저장된 장바구니 목록을 확인하여 동일한 상품이면 카트 수량을 추가해주기
  // 장바구니 추가 시, indexedDB에 제품 데이터 및
  // 주문수량 (기본값 1)을 저장함.
  const _id = productId;
  const species = category.species;
  const species_image = category.species_image;
  const aution_cost = price.auction_cost;
  const packaging_cost = price.packaging_cost;
  const shipping_cost = price.shipping_cost;

  const cartItem = {
    _id,
    species,
    species_image,
    aution_cost,
    packaging_cost,
    shipping_cost,
    quantity: 1,
  };

  isLogin ? await Api.post('/api/v1/carts', cartItem) : await addToDb('cart', cartItem, productId);

  // 장바구니 요약(=전체 총합)을 업데이트함
  await putToDb('order', 'summary', (data) => {
    // 기존 데이터를 가져옴
    const count = data.productsCount;
    const total = data.productsTotal;
    const ids = data.ids;
    const selectedIds = data.selectedIds;

    // 기존 데이터가 있다면 1을 추가하고, 없다면 초기값 1을 줌
    data.productsCount = (count ?? 0) + 1;

    // 기존 데이터가 있다면 가격만큼 추가하고, 없다면 초기값으로 해당 가격을 줌
    data.productsTotal = (total ?? 0) + totalCost;

    // 기존 데이터(배열)가 있다면 id만 추가하고, 없다면 배열 새로 만듦
    data.ids = data.ids ? [...ids, productId] : [productId];

    // 위와 마찬가지 방식
    data.selectedIds = selectedIds ? [...selectedIds, productId] : [productId];
  });
};

cartButton.addEventListener('click', addItemToCart);
MoveCart.addEventListener('click', () => {
  window.location.href = '/cart';
});
