import { addCommas } from '../useful-functions.js';
import { addToDb, deleteFromDb, getFromDb, putToDb } from '../indexed-db.js';

// 요소 가져오기
const cartProductsContainer = document.querySelector('#cart_list');
const allSelectCheckbox = document.querySelector('#all_select');
const partialDeleteLabel = document.querySelector('#partial_delete');
// const productsCountElem = document.querySelector("#productsCount");
const productsTotalElem = document.querySelector('#product_price');
const deliveryFeeElem = document.querySelector('#shipping_price');
const orderTotalElem = document.querySelector('#total_order_price');
const purchaseButton = document.querySelector('#purchase_button');

// 추가 버튼 클릭 시 추가(test)
document.getElementById('addBtn').addEventListener('click', async (product) => {
  // 객체 destructuring
  const { _id: id, price } = product;

  // 장바구니 추가 시, indexedDB에 제품 데이터 및
  // 주문수량 (기본값 1)을 저장함.
  await addToDb(
    'cart',
    // test데이터
    {
      _id: '1234qwer',
      title: '고등어',
      image:
        'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      price: 30000,
      quantity: 1,
    },
  );

  // 장바구니 요약(=전체 총합)을 업데이트함.
  await putToDb('order', 'summary', (data) => {
    // 기존 데이터를 가져옴
    // const count = data.productsCount;
    const total = data.productsTotal;
    const ids = data.ids;
    const selectedIds = data.selectedIds;

    // 기존 데이터가 있다면 1을 추가하고, 없다면 초기값 1을 줌
    // data.productsCount = count ? count + 1 : 1;

    // 기존 데이터가 있다면 가격만큼 추가하고, 없다면 초기값으로 해당 가격을 줌
    data.productsTotal = total ? total + price : price;

    // 기존 데이터(배열)가 있다면 id만 추가하고, 없다면 배열 새로 만듦
    data.ids = ids ? [...ids, id] : [id];

    // 위와 마찬가지 방식
    data.selectedIds = selectedIds ? [...selectedIds, id] : [id];
  });
});

// 데이터 읽어오기
async function insertProducts() {
  const products = await getFromDb('cart');
  console.log(products);
  // const { selectedIds } = await getFromDb('order');
  products.forEach(async (product) => {
    const { _id, title, image, quantity, price } = product;

    // const isSelected = selectedIds.includes(_id);

    cartProductsContainer.insertAdjacentHTML(
      'beforeend',
      `<div class="item_container" id="productItem-${_id}">
      <input class="form-check-input" type="checkbox" value="" id="checkbox-${_id}" />
          <div class="image">
          <figure>
        <img class="product_image" src="${image}" alt="상품이미지" id="image-${_id}"/>
        </figure>
    </div>
    <div class="content">
      <div id="title-${_id}">
        <p>${title}</p>
      </div>
      <div class="quantity">
        <button class="btn" id="minus-${_id}"
        >-</button>
        <input type="number" class="quantity_input" min="1" max="99" value="1" id="quantityInput-${_id}"/>
        <button class="btn" id="plus-${_id}"
       >+</button>
      </div>
      <div class="calculation">
        <p id="total-${_id}">${addCommas(price * quantity)}원</p>
      </div>
      <div class="delete">
        <button class="btn" id="delete-${_id}}">X</button>
      </div>
    </div>
    </div>`,
    );
  });
}

insertProducts();
