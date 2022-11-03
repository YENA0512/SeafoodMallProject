// import * as Api from '../api.js';
// import { randomId } from '/useful-functions.js';
const speciesTotal = document.querySelector('.species_total');
const productItemContainer = document.querySelector('.product');

addAllElements();
addAllEvents();

async function addAllElements() {
  getProductData();
}

function addAllEvents() {
  // for eslint pass
}

async function getProductData() {
  const res = await fetch('./products.json');
  // fetch로 테스트용으로 적은것. 결과물은 products 동일
  const products = await res.json();
  console.log(products);
  // 각 물품 구현 부분
  products.forEach(async (item) => {
    const { productImage, productName, productPrice } = item;

    productItemContainer.insertAdjacentHTML(
      'beforeend',
      `
    <div class="product_item">
      <img class="product_img" src="${productImage}" />
      <h3>${productName}</h3>
      <div>
        <span>${productPrice}</span>
        <span>&nbsp;원</span>
      </div>
    </div>
  `,
    );
  });
  // 물품 개수 확인
  let total = products.length;
  speciesTotal.innerHTML = total;
}
