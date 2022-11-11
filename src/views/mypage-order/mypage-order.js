import * as Api from '../api.js';
import { checkLogin } from '../useful-functions.js';

// 요소(element), input 혹은 상수

const userEmail = document.querySelector('#userEmail');
const userEmailValue = document.querySelector('#userEmailValue');
const userGroupValue = document.querySelector('#userGroupValue');
const mypage_orderinfo = document.querySelector('.mypage_orderinfo');
const show_orders = document.querySelector('.show_orders');
checkLogin();
getUserInfo();
insertOrders();

async function getUserInfo() {
  try {
    const userId = sessionStorage.getItem('userId');
    const user = await Api.get(`/api/v1/users/${userId}`);
    let userName = user.data.email;
    if (user.data?.shipping?.name) {
      userName = user.data.shipping.name;
    }

    userEmail.innerHTML = `${userName} 님`;
    userEmailValue.innerHTML = user.data.email;
    userGroupValue.innerHTML = checkGroup(user.data.group);
  } catch (err) {
    console.error(err.stack);
    alert(`${err.message}`);
  }
}

function checkGroup(userGroup) {
  switch (userGroup) {
    case 'admin':
      return '관리자';
    case 'seller':
      return '판매자';
    case 'customer':
      return '일반 회원';
  }
}

function checkStatus(str) {
  let result = '';
  switch (str) {
    case 'order':
      //주문완료일 때까지만 주문정보변경, 주문취소 가능 (버튼보이기)
      result = '주문완료';
      break;
    case 'prepare':
      result = '배송전';
      break;
    case 'shipping':
      result = '배송중';
      break;
    case 'complete':
      result = '배송완료';
      break;
    case 'cancel':
      result = '주문취소';
      break;
  }
  return result;
}
function showNullWindow() {
  mypage_orderinfo.innerHTML = `<p class="h3 text-center">주문내역이 없습니다.</p>
  <p class="text-center">오늘바다에서 준비한 오늘의 싱싱한 수산물을 만나러 가보실까요?</p><br />
  <button type="button" onclick="location.href='/';" id="linkButton" class="text-center button btn btn-primary">바로가기</a>`;
  mypage_orderinfo.style.padding = '20% 10%';
  mypage_orderinfo.style.textAlign = 'center';
  const linkButton = document.querySelector('#linkButton');
}
function printOrderItems(orderItem, orderIdValue) {
  let orderProducts = document.querySelector(`#orderProductValue-${orderIdValue}`);
  orderProducts = '';
  if (orderItem.length > 1) {
    for (let item of orderItem) {
      let product = item?.product_id?.category?.species;
      let productQuantity = item.quantity;
      orderProducts += `${product} / 수량 : ${productQuantity}<br>`;
    }
  } else {
    let product = orderItem[0]?.product_id?.category?.species;
    let productQuantity = orderItem[0].quantity;
    orderProducts = `${product} / 수량 : ${productQuantity}\n`;
  }

  return orderProducts;
}
async function insertOrders() {
  const orders = await Api.get(`/api/v1/orders`);

  const order = orders.data;

  if (order.length === 0) {
    showNullWindow();
  }
  order.forEach((el) => {
    let orderIdValue = el._id;
    let orderDateValue = el.createdAt.split('T')[0];
    let orderPriceValue = el.order_price.toLocaleString();
    const orderItem = el.order_items;

    //printOrderItems(orderItem, orderIdValue);
    // let orderProductValue = item.product_id.category.species
    let orderStatusValue = checkStatus(el.order_status);
    show_orders.insertAdjacentHTML(
      'beforeend',
      `
        <li id="orderItemList-${orderIdValue}">
  <div class="col-2 orderIdValue" id="orderIdValue-${orderIdValue}">${orderIdValue}</div>
  <div class="col-2" id="orderDateValue">${orderDateValue}</div>
  <div class="col-3" id="orderProductValue-${orderIdValue}">${printOrderItems(
        orderItem,
        orderIdValue,
      )}</div>
  <div class="col-2" id="orderPriceValue" style="text-align:right;">${orderPriceValue}원</div>
  <div class="col-1_5" id="orderStatusValue-${orderIdValue}">
    <p>${orderStatusValue}</p>
    <button
      type="button"
      class="btn btn-success btn-sm orderChangeButton"
      style="background-color: #04B2D9"
      id="orderChangeButton-${orderIdValue}"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal1-${orderIdValue}"
      style="display: block"
    >
      정보변경
    </button>
    <div
      class="modal fade"
      id="exampleModal1-${orderIdValue}"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <p class="h5 modal-title">주문/배송 정보 변경</p>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="field mb-3">
              <label class="label" for="nameInput">수령자</label>
              <div class="control">
                <input
                  class="input"
                  id="nameInput-${orderIdValue}"
                  type="text"
                  placeholder="받으시는 분 성함을 추가해주세요"
                  autocomplete="on"
                />
              </div>
            </div>
            <div class="field address">
              <label class="label" for="addressInput">주소</label>
              <div class="control">
                <input
                  class="input mb-2"
                  id="postalCodeInput-${orderIdValue}"
                  type="text"
                  placeholder="주소 검색을 클릭해 주세요."
                  readonly
                />
                <input
                  class="input mb-2"
                  id="addressInput1-${orderIdValue}"
                  type="text"
                  placeholder=""
                  autocomplete="on"
                  readonly
                />
                <input
                  class="input mb-3"
                  id="addressInput2-${orderIdValue}"
                  type="text"
                  placeholder=""
                  autocomplete="on"
                />
                <button class="button mb-3 btn btn-warning" id="addressButton-${orderIdValue}">🔍 주소 검색</button>
              </div>
            </div>
            <div class="field mb-3">
              <label class="label" for="mobileInput">휴대폰</label>
              <div class="control">
                <input
                  class="input"
                  id="mobileInput-${orderIdValue}"
                  type="tel"
                  placeholder="01000000000"
                  pattern="[0-9]{3}[0-9]{4}[0-9]{4}"
                  required
                  autocomplete="on"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
            <button type="button" id="submitButton-${orderIdValue}" class="btn btn-primary">
              변경 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="col-1_5">
    <button
      type="button"
      class="orderCancelButton btn btn-sm btn-outline-danger"
      id="orderCancelButton-${orderIdValue}"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal2-${orderIdValue}"
      style="display: block"
    >
      주문취소
    </button>
    <div
      class="modal fade"
      id="exampleModal2-${orderIdValue}"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <p class="h5 modal-title">주문 취소 안내</p>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p style="font-size:18px;line-height:30px;">선택하신 내역이 주문 취소 처리 됩니다.<br />주문을 취소하시겠습니까?</p>
          </div>
          <div class="modal-footer">
            <button class="button btn btn-secondary" id="deleteCompleteButton-${orderIdValue}" aria-label="close">
              네
            </button>
            <button class="button btn btn-primary" id="deleteCancelButton" data-bs-dismiss="modal" aria-label="Close">아니오</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</li>
      `,
    );

    if (orderStatusValue === '주문취소') {
      document.querySelector(`#orderStatusValue-${orderIdValue}`).style.color = 'red';
      document.querySelector(`#orderChangeButton-${orderIdValue}`).disabled = 'true';
      document.querySelector(`#orderCancelButton-${orderIdValue}`).disabled = 'true';
    }
    const submitButton = document.querySelector(`#submitButton-${orderIdValue}`);
    const deleteCompleteButton = document.querySelector(`#deleteCompleteButton-${orderIdValue}`);
    const addressButton = document.querySelector(`#addressButton-${orderIdValue}`);
    // const orderChangeButton = document.querySelector(`#orderChangeButton-${orderIdValue}`);

    addressButton.addEventListener('click', () => {
      searchAddress(orderIdValue);
    });
    submitButton?.addEventListener('click', (e) => {
      handleSubmit(orderIdValue, e);
    });
    deleteCompleteButton?.addEventListener('click', (e) => {
      deleteOrderData(orderIdValue, e);
    });
    // orderChangeButton?.addEventListener('click', (e) => {
    //   insertUserData(orderIdValue, e);
    // });
  });
}

// db에서 주문정보 삭제
async function deleteOrderData(orderIdValue, e) {
  e.preventDefault();
  const order_id = orderIdValue;
  try {
    // 취소 진행
    const res = await Api.delete(`/api/v1/orders`, order_id);

    // 취소 성공
    alert('주문이 취소되었습니다.');
    // const deletedItem = document.querySelector(`#orderItemList-${orderIdValue}`);
    // deletedItem.remove();

    window.location.href = './';
  } catch (err) {
    alert(`주문 취소 과정에서 오류가 발생하였습니다\n`);
  }
}

async function handleSubmit(orderIdValue, e) {
  e.preventDefault();
  const order_id = orderIdValue;
  let addressInput = document.querySelector(`#addressInput1-${orderIdValue}`);
  let detailAddressInput = document.querySelector(`#addressInput2-${orderIdValue}`);
  let mobileInput = document.querySelector(`#mobileInput-${orderIdValue}`);
  let nameInput = document.querySelector(`#nameInput-${orderIdValue}`);
  let postalCodeInput = document.querySelector(`#postalCodeInput-${orderIdValue}`);

  const name = nameInput?.value;
  const mobile = mobileInput?.value;
  const zencode = postalCodeInput?.value;
  const address = addressInput?.value;
  const detail_address = detailAddressInput?.value;
  // 주문정보 수정 api 요청
  try {
    const user_id = sessionStorage.getItem('userId');

    const userData = {
      user_id,
      name,
      mobile,
      zencode,
      address,
      detail_address,
    };

    const newData = { shipping: userData };

    if (!mobile || !address || !name) {
      return alert('수령자, 주소, 휴대폰 정보를 모두 입력해주세요');
    }

    const newUserInfo = await Api.patch(`/api/v1/orders`, order_id, newData);
    alert(`주문정보가 정상적으로 수정되었습니다.`);

    window.location.href = './';
  } catch (err) {
    console.error(err.stack);
    alert(`${err.message}`);
  }
}
function searchAddress(orderIdValue) {
  const addressInput = document.querySelector(`#addressInput1-${orderIdValue}`);
  const detailAddressInput = document.querySelector(`#addressInput2-${orderIdValue}`);
  const postalCodeInput = document.querySelector(`#postalCodeInput-${orderIdValue}`);
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

      postalCodeInput.value = data.zonecode;
      addressInput.value = `${addr} ${extraAddr}`;
      detailAddressInput.placeholder = '상세 주소를 입력해 주세요.';
      detailAddressInput.focus();
    },
  }).open();
}
