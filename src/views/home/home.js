// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.

// import * as Api from '../api.js';
// import { randomId } from '/useful-functions.js';
import { addCommas } from '../useful-functions.js';

const productItemContainer = document.querySelector('.product');

async function getProductData() {
  const res = await fetch('./products.json');
  // fetch로 테스트용으로 적은것. 결과물은 products 동일
  const products = await res.json();
  products.forEach((item) => {
    const { productImage, productName, productPrice } = item;

    productItemContainer.insertAdjacentHTML(
      'beforeend',
      `
      <div class="product_item">
        <a href="">
          <img class="product_img" src="${productImage}" />
          <h3>${productName}</h3>
          <div>
            <span>${addCommas(productPrice)}</span>
            <span>&nbsp;원</span>
          </div>
        </a>
      </div>
  `,
    );
  });
}
getProductData();
