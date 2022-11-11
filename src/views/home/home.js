// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.

import * as Api from '../api.js';
// import { randomId } from '/useful-functions.js';
import { addCommas } from '../useful-functions.js';

const productItemContainer = document.querySelector('.product');

async function getProductData() {
  const res = await Api.get(`/api/v1/products/list`);
  const products = res.data;
  console.log(products);
  let i = 1;
  products.forEach((item) => {
    productItemContainer.insertAdjacentHTML(
      'beforeend',
      `
      <div class="product_item">
        <a class="all_products_${i} item">
          <img class="product_img" src="${item.category.species_image}" />
          <h3>${item.category.species}</h3>
          <div>
            <span>${addCommas(item.price.product_cost)}</span>
            <span>원</span>
          </div>
        </a>
      </div>
  `,
    );

    let allProductA = document.querySelector(`.all_products_${i}`);
    allProductA.setAttribute('href', `/product/${item._id}`);

    i++;
  });
}
getProductData();
