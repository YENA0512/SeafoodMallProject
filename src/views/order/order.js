import * as Api from '../api.js';
import { addCommas, navigate } from '../useful-functions.js';
import { deleteFromDb, getFromDb, putToDb } from '../indexed-db.js';

const cartList = document.querySelector('#cart_list');
const usernameInfo = document.querySelector('#username');
const phonenumberInfo = document.querySelector('#phonenumber');
const emailInfo = document.querySelector('#email');
const postalCodeInfo = document.querySelector('#postalCode');
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
      postalCodeInfo.value = data.zonecode;
      addressInfo.value = `${addr} ${extraAddr}`;
      addressInfoDetail.placeholder = '상세 주소를 입력해 주세요.';
      addressInfoDetail.focus();
    },
  }).open();
}

// 장바구니 주문 상품 목록 보여주기
async function insertOrderSummary() {
  const { selectedIds, productsTotal } = await getFromDb('order', 'summary');
  const hasItemToCheckout = selectedIds.length !== 0;
  // 선택된 상품이 없으면 장바구니로 다시 이동
  if (!hasItemToCheckout) {
    alert('구매할 상품이 없습니다. 장바구니에서 선택해 주세요');
    // 장바구니 페이지로 이동
    return window.location.replace('../cart/cart.html');
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
// 주문자 정보 보여주기
async function insertUserData() {
  const userData = await Api.get('/api/v1/users/:id');
  const { name, mobile, email, zencode, address, detail_address } = userData;

  usernameInfo.value = name;
  phonenumberInfo.value = mobile;
  emailInfo.value = email;
  postalCodeInfo.value = zencode;
  addressInfo.value = address;
  addressInfoDetail.value = detail_address;
}

checkoutBtn.addEventListener('click', async () => {
  const userName = usernameInfo.value;
  const phoneNumber = phonenumberInfo.value;
  const email = emailInfo.value;
  const postalCode = postalCodeInfo.value;
  const address = addressInfo.value;
  const addressDetail = addressInfoDetail.value;
  const { selectedIds } = await getFromDb('order', 'summary');

  if (!userName || !phoneNumber || !email || !postalCode || !address || !addressDetail) {
    return alert('배송지 정보를 모두 입력해주세요!');
  }
  const Info = {
    postalCode,
    address,
    addressDetail,
  };
  try {
    for (const productId of selectedIds) {
      // 전체 주문 등록
      // const { quantity } = await getFromDb('cart', productId);
      //
      // const order = {
      //   productId,
      //   quantity,
      // };
      // await Api.post('/api/v1/orders/', order);
      // indexedDB에서 해당 제품 관련 데이터 제거
      await deleteFromDb('cart', productId);
      await putToDb('order', 'summary', (data) => {
        data.ids = data.ids.filter((id) => id !== productId);
        data.selectedIds = data.selectedIds.filter((id) => id !== productId);
        data.productsCount -= 1;
        data.productsTotal -= totalPrice;
      });
    }
    // 변경된 배송지정보를 유저db에 저장
    const data = {
      Info: {
        postalCode,
        address,
        addressDetail,
      },
    };
    await Api.post('/api/v1/users/:id', data);
    alert('결제가 정상적으로 완료되었습니다.');
    window.location.href = '../home/home.html';
  } catch (err) {
    alert(`결제 중 문제가 발생하였습니다:${err.message}`);
  }
});

insertOrderSummary();
insertUserData();
