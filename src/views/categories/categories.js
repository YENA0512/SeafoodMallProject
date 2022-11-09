import * as Api from '../../api.js';
import { getUrlParams } from '../../useful-functions.js';

const speciesTotal = document.querySelector('.species_total');
const productItemContainer = document.querySelector('.product');
const noProductItemContainer = document.querySelector('.no_product');
const speciesName = document.querySelector('.species_name');
// const categoryName = document.querySelector('.species_name');
// const orderLowPrice = document.querySelector('.order_low_price');
// const orderHighPrice = document.querySelector('.order_high_price');
// const orderAlphb = document.querySelector('.order_alphb');

const params = getUrlParams();
speciesName.innerHTML = params.keyword;

const getCategoriesData = async () => {
  const res = await Api.get(`/api/v1/products`, `category-search?keyword=${params.keyword}`);
  console.log(res);

  res.forEach((item) => {
    const { _id, category, price } = item;
    console.log(category, price);
    productItemContainer.insertAdjacentHTML(
      'beforeend',
      `
    <div class="product_item">
      <a href="/product/${_id}">
        <img class="product_img" src="${category.species_image}" />
        <h3>${category.species}</h3>
        <div>
          <span>${price.auction_cost}</span>
          <span>&nbsp;원</span>
        </div>
      </a>
    </div>
  `,
    );
  });
  // 물품 개수 확인
  const total = res.length;
  speciesTotal.innerHTML = total;

  if (total === 0) {
    noProductItemContainer.insertAdjacentHTML(
      'beforeend',
      `
     <h1>준비된 물품이 없어요.😢</h1>
      `,
    );
  }
};
getCategoriesData();

// const orderToLowPrice = () => {
//   console.log(products);
// };

// const orderToHighPrice = () => {
//   console.log(products);
// };

// const orderToAlphabet = () => {
//   console.log(products);
// };

// orderLowPrice.addEventListener('click', orderToLowPrice);
// orderHighPrice.addEventListener('click', orderToHighPrice);
// orderAlphb.addEventListener('click', orderToAlphabet);
