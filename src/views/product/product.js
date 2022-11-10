import * as Api from '../../api.js';
import { addCommas } from '../../useful-functions.js';
import { addToDb, putToDb } from '../../indexed-db.js';

const ProductTitle = document.querySelector('.product_title');
const packageCondition = document.querySelector('.package_condition');
const platformCondition = document.querySelector('.platform_condition');
const sellerCondition = document.querySelector('.seller_condition');
const auctionCondition = document.querySelector('.auction_condition');
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

// 상품 정보 받아오는 함수
const getProductData = async () => {
  const res = await Api.get(`/api/v1/products/${productId}`);
  console.log(res);
  category = res.category;
  price = res.price;

  ProductTitle.innerHTML = category.species;
  auctionCondition.innerHTML = addCommas(price.auction_cost);
  packageCondition.innerHTML = addCommas(price.packaging_cost);
  platformCondition.innerHTML = price.platform_commision;
  sellerCondition.innerHTML = price.seller_commision;

  totalPrice.innerHTML = addCommas(price.product_cost);
};
getProductData();

//TODO: 리펙토링 필수
const LoginAddItemToCart = async () => {
  const product_id = productId;

  // API POST
  const loginCartItem = { product_id, quantity: 1 };
  await Api.post('/api/v1/carts', loginCartItem);
};

const notLoginAddItemToCart = async () => {
  const _id = productId;
  const species = category.species;
  const species_image = category.species_image;
  const product_cost = price.product_cost;

  const cartItem = {
    _id,
    species,
    species_image,
    product_cost,
    quantity: 1,
  };

  await addToDb('cart', cartItem, productId);

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
    data.productsTotal = (total ?? 0) + product_cost;

    // 기존 데이터(배열)가 있다면 id만 추가하고, 없다면 배열 새로 만듦
    data.ids = data.ids ? [...ids, productId] : [productId];

    // 위와 마찬가지 방식
    data.selectedIds = selectedIds ? [...selectedIds, productId] : [productId];
  });
};

cartButton.addEventListener('click', () => {
  isLogin ? LoginAddItemToCart() : notLoginAddItemToCart();
});
MoveCart.addEventListener('click', () => {
  isLogin ? (window.location.href = '/cart-login') : (window.location.href = '/cart');
});
