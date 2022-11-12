import * as Api from '../../api.js';
import { getUrlParams, addCommas } from '../../useful-functions.js';

const speciesTotal = document.querySelector('.species_total');
const productItemContainer = document.querySelector('.product');
const noProductItemContainer = document.querySelector('.no_product');
const speciesName = document.querySelector('.species_name');

const params = getUrlParams();
speciesName.innerHTML = params.keyword;

let res;
const getCategoriesData = async () => {
  res = await Api.get(`/api/v1/products`, `category-search?keyword=${params.keyword}`);

  const easy = (data) => {
    data.forEach((item) => {
      const { _id, category, price } = item;
      if (!price.product_cost) {
        price.product_cost = 0;
      }
      productItemContainer.insertAdjacentHTML(
        'beforeend',
        `
      <div class="product_item">
        <a href="/product/${_id}">
          <img class="product_img" src="${category.species_image}" />
          <h3>${category.species}</h3>
          <div>
            <span>${addCommas(price.product_cost)}</span>
            <span>원</span>
          </div>
        </a>
      </div>
    `,
      );
    });
  };
  easy(res);

  const orderLowPriceBtn = document.querySelector('.order_low_price');
  const orderHighPriceBtn = document.querySelector('.order_high_price');
  const orderAlphbBtn = document.querySelector('.order_alphb');
  // 낮은 가격순
  const orderLowPrice = () => {
    const result = res.sort((a, b) => a.price.product_cost - b.price.product_cost);
    productItemContainer.innerHTML = '';
    easy(result);
  };
  // 높은 가격순
  const orderHighPrice = () => {
    const result = res.sort((a, b) => b.price.product_cost - a.price.product_cost);
    productItemContainer.innerHTML = '';
    easy(result);
  };
  // 가나다 순
  const orderAlphb = () => {
    const result = res.sort((a, b) => {
      if (a.category.species > b.category.species) return 1;
      if (a.category.species < b.category.species) return -1;
      return 0;
    });
    productItemContainer.innerHTML = '';
    easy(result);
  };

  orderLowPriceBtn.addEventListener('click', orderLowPrice);
  orderHighPriceBtn.addEventListener('click', orderHighPrice);
  orderAlphbBtn.addEventListener('click', orderAlphb);

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
