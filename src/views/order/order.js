import * as Api from '../api.js';
import { addCommas, convertToNumber, navigate } from '../useful-functions.js';
import { deleteFromDb, getFromDb, putToDb } from '../indexed-db.js';

const cartList = document.querySelector('#cart_list');
const usernameInfo = document.querySelector('#username');
const phonenumberInfo = document.querySelector('#phonenumber');
const emailInfo = document.querySelector('#email');
const addressInfo = document.querySelector('#address');
const addressInfoDetail = document.querySelector('#address_detail');
const addressUpdateBtn = document.querySelector('#address_update_btn');
const orderPrice = document.querySelector('#order_price');
const deliveryFee = document.querySelector('#shipping_price');
const orderTotal = document.querySelector('#total_order_price');
const checkoutBtn = document.querySelector('#checkout_btn');

// 배송지 변경
addressUpdateBtn.addEventListener('click', searchAddress);
// Daum 주소 API
function searchAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      let addr = '';
      let extraAddr = '';

      if (data.userSelectedType === 'R') {
        addr = data.roadAddress;
      } else {
        addr = data.jibunAddress;
      }

      if (data.userSelectedType === 'R') {
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
        }
        if (extraAddr !== '') {
          extraAddr = ' (' + extraAddr + ')';
        }
      }
      addressInfo.value = `${addr} ${extraAddr}`;
      addressInfoDetail.placeholder = '상세 주소를 입력해 주세요.';
      addressInfoDetail.focus();
    },
  }).open();
}

async function insertOrderSummary() {
  const { ids, selectedIds, productsTotal } = await getFromDb('order', 'summary');
  // 구매할 아이템이 없으면 상품페이지로 이동
  const hasItemInCart = ids.length !== 0;
  const hasItemToCheckout = selectedIds.length !== 0;

  if (!hasItemInCart) {
    alert('구매할 상품이 없습니다. 제품을 선택해 주세요');
    return navigate('../species/species.html');
  }
  if (!hasItemToCheckout) {
    alert('구매할 상품이 없습니다. 장바구니에서 선택해 주세요');
    return navigate('../cart/cart.html');
  }
  for (const id of selectedIds) {
    const products = await getFromDb('cart', id);

    Array(products).forEach(async (product) => {
      const { title, image, quantity, price } = product;

      cartList.insertAdjacentHTML(
        'beforeend',
        `<div class="item_container" >
        <div class="image">
      <img class="product_image" src="${image}" alt="상품이미지"/>
      </div>
      <div class="content">
      <div>
      <p>${title}</p>
      </div>
      <div>
      <p>${quantity}개<p>
      </div>
     <div>
     <p>
     ${addCommas(price)}원
     </p>
     </div>
    </div>
  </div>
  </div>`,
      );
      orderPrice.innerText = `${addCommas(productsTotal)}원`;

      if (hasItemToCheckout) {
        deliveryFee.innerText = `3,000원`;
        orderTotal.innerText = `${addCommas(productsTotal + 3000)}원`;
      } else {
        deliveryFee.innerText = `0원`;
        orderTotal.innerText = `0원`;
      }
    });
  }
}

insertOrderSummary();
