// import * as Api from '../api.js';
// import { randomId } from '/useful-functions.js';

const ProductTitle = document.querySelector('.product_title');
const packageCondition = document.querySelector('.package_condition');
const platformCondition = document.querySelector('.platform_condition');
const deliveryCondition = document.querySelector('.delivery_condition');
const totalPrice = document.querySelector('.product_total');
const cartButton = document.querySelector('.insert_cart');

// 상품 정보 받아오는 함수
const getProductData = async () => {
  const res = await fetch('./product.json');
  // fetch로 테스트용으로 적은것. 결과물은 products 동일
  const product = await res.json();
  const { title, price, package_condition, platform_condition, delivery_condition } = product[0];
  console.log(product);
  console.log(package_condition);

  ProductTitle.innerHTML = title;
  packageCondition.innerHTML = package_condition;
  platformCondition.innerHTML = platform_condition;
  deliveryCondition.innerHTML = delivery_condition;

  let total = package_condition + platform_condition + delivery_condition + price;

  totalPrice.innerHTML = total;
};

const cartModal = `
  <div class="modal">
    <div class="modal_mention">
      장바구니에 담겼습니다!<br />
      장바구니로 이동 하시겠습니까?
    </div>
    <div class="modal_btn">
      <button class="continue">쇼핑 계속하기</button>
      <button class="move" href="">장바구니로 이동</button>
    </div>
  </div>
`;

const moveCart = () => {
  const modalDiv = document.createElement('div');
  modalDiv.setAttribute('class', 'modal_layout');
  modalDiv.innerHTML = cartModal;
  document.body.prepend(modalDiv);
  // 모달창 외 영역 클릭시 닫힘
  modalDiv.addEventListener('click', ({ target }) => {
    if (target.className === 'modal_layout') {
      document.body.removeChild(modalDiv);
    }
  });
  // 쇼핑 계속하기 버튼 클릭시 닫힘
  const cancelButton = document.querySelector('.continue');
  console.log(cancelButton);

  cancelButton.addEventListener('click', () => {
    document.body.removeChild(modalDiv);
  });
};

cartButton.addEventListener('click', moveCart);

// 모음영역
addAllElements();
addAllEvents();

async function addAllElements() {
  getProductData();
}

function addAllEvents() {
  // for eslint pass
}
