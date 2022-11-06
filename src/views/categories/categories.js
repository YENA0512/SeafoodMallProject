import * as Api from '../../api.js';

const speciesTotal = document.querySelector('.species_total');
const productItemContainer = document.querySelector('.product');

const getCategoriesData = async () => {
  const currentURL = window.location.href;
  const sliceURL = currentURL.substring(33, currentURL.length - 1);
  //TODO: 추후 슬래시 기준으로 자를 로직을 만들것
  const res = await Api.get(`/api/v1/categories/${sliceURL}`);
  const products = res.categoryByChildCategory;

  // 각 물품 구현 부분
  products.forEach((item) => {
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
getCategoriesData();
