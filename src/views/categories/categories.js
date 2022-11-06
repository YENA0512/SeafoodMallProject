import * as Api from '../../api.js';

const speciesTotal = document.querySelector('.species_total');
const productItemContainer = document.querySelector('.product');

const getProductData = async () => {
  // const res = await fetch('./products.json');
  // // fetch로 테스트용으로 적은것. 결과물은 products 동일
  // const products = await res.json();
  // console.log(products);
  const currentURL = window.location.href;
  console.log(currentURL);
  const sliceURL = currentURL.substring(33, currentURL.length - 1);
  console.log(sliceURL);
  // const decodeing = decodeURI(decodeURIComponent(currentURL));
  // console.log(decodeing);
  const res = await Api.get(`/api/v1/categories/${sliceURL}`);
  const products = res.categoryByChildCategory;
  console.log(res);
  // 각 물품 구현 부분
  products.forEach(async (item) => {
    const { species_image, species, _id } = item;

    productItemContainer.insertAdjacentHTML(
      'beforeend',
      `
    <div class="product_item">
      <img class="product_img" src="${species_image}" />
      <h3>${species}</h3>
      <div>
        <span>${_id}</span>
        <span>&nbsp;원</span>
      </div>
    </div>
  `,
    );
  });
  // 물품 개수 확인
  let total = products.length;
  speciesTotal.innerHTML = total;
};

addAllEvents();
addAllElements();

async function addAllElements() {
  getProductData();
}

function addAllEvents() {
  // for eslint pass
}
