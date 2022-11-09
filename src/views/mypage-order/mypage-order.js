import * as Api from '../api.js';
import { checkLogin } from '../useful-functions.js';

// 요소(element), input 혹은 상수

const userEmail = document.querySelector('#userEmail');
const userEmailValue = document.querySelector('#userEmailValue');
const userGroupValue = document.querySelector('#userGroupValue');
// const updateOrderInfoModal = document.querySelector('.updateOrderInfoModal');
const addressInput = document.querySelector('#addressInput1');
const detailAddressInput = document.querySelector('#addressInput2');
const mobileInput = document.querySelector('#mobileInput');
const nameInput = document.querySelector('#nameInput');
const postalCodeInput = document.querySelector('#postalCodeInput');
const submitButton = document.querySelector('#submitButton');
// const cancelOrderModal = document.querySelector('.cancelOrderModal');
const deleteCompleteButton = document.querySelector('#deleteCompleteButton');
const deleteCancelButton = document.querySelector('#deleteCancelButton');
// const modalCloseButton = document.querySelector('#modalCloseButton');
// const orderChangeButton = document.querySelector('.orderChangeButton');
// const orderCancelButton = document.querySelector('.orderCancelButton');

const show_orders = document.querySelector('.show_orders');
checkLogin();
getUserInfo();
insertOrders();
addAllElements();
addAllEvents();

function addAllElements() {}
function addAllEvents() {
  //deleteCompleteButton.addEventListener('click', deleteOrderData);
  // deleteCancelButton.addEventListener('click', closeCancelModal);
  // modalCloseButton.addEventListener('click', closeChangeModal);
  //submitButton.addEventListener('click', handleSubmit);
}

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
      return '소비자';
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

async function insertOrders() {
  const orders = await Api.get(`/api/v1/orders`);
  console.log(orders);
  const order = orders.data;
  order.forEach((el) => {
    console.log(el);
    let orderIdValue = el._id;
    let orderDateValue = el.createdAt.split('T')[0];
    let orderPriceValue = el.order_price;
    const orderItem = el.order_items;
    orderItem.forEach((item) => {
      let orderProductValue = item.product_id.category.species;
      let orderProductQuantity = item.quantity;
      let orderProductValues = `${orderProductValue} / 수량 : ${orderProductQuantity}`;
      let orderStatusValue = checkStatus(el.order_status);

      show_orders.insertAdjacentHTML(
        'beforeend',
        `
        <li>
        <div class="col-2 orderIdValue" id="orderIdValue-${orderIdValue}">${orderIdValue}</div>
        <div class="col-2" id="orderDateValue">${orderDateValue}</div>
        <div class="col-3" id="orderProductValue">${orderProductValues}</div>
        <div class="col-2" id="orderPriceValue">${orderPriceValue}</div>
        <div class="col-1_5" id="orderStatusValue">
          <p>${orderStatusValue}</p>
          <button
            type="button"
            class="orderChangeButton"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal1"
            style="display: block"
          >
            정보변경
          </button>
          <div
            class="modal fade"
            id="exampleModal1"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">주문/배송 정보 변경</h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <div class="field mb-3">
                    <label class="label mb-3" for="nameInput">수령자</label>
                    <div class="control">
                      <input
                        class="input"
                        id="nameInput"
                        type="text"
                        placeholder="받으시는 분 성함을 추가해주세요"
                        autocomplete="on"
                      />
                    </div>
                  </div>
                  <div class="field address">
                    <label class="label mb-3" for="addressInput">주소</label>
                    <div class="control">
                      <input
                        class="input mb-2"
                        id="postalCodeInput"
                        type="text"
                        placeholder="주소 검색을 클릭해 주세요."
                        readonly
                      />
                      <input
                        class="input mb-2"
                        id="addressInput1"
                        type="text"
                        placeholder=""
                        autocomplete="on"
                        readonly
                      />
                      <input
                        class="input mb-3"
                        id="addressInput2"
                        type="text"
                        placeholder=""
                        autocomplete="on"
                      />
      
                      <button class="button mb-3" id="addressButton">🔍 주소 검색</button>
                    </div>
                  </div>
                  <div class="field mb-3">
                    <label class="label mb-3" for="mobileInput">휴대폰번호</label>
                    <div class="control">
                      <input
                        class="input"
                        id="mobileInput"
                        type="tel"
                        placeholder="010-0000-0000"
                        pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
                        required
                        autocomplete="on"
                      />
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
                  <button type="button" id="submitButton-${orderIdValue}" class="btn btn-primary">변경 완료</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-1_5">
          <button
            type="button"
            class="orderCancelButton"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal2"
            style="display: block"
          >
            주문취소
          </button>
          <div
            class="modal fade"
            id="exampleModal2"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">주문 취소 안내</h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <p>선택하신 주문은 환불이 불가합니다.<br />주문을 취소하시겠습니까?</p>
                </div>
                <div class="modal-footer">
                  <button class="button" id="deleteCompleteButton-${orderIdValue}" aria-label="close">네</button>
                  <button class="button" id="deleteCancelButton" aria-label="close">아니오</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>

      `,
      );
      if (orderStatusValue === '주문완료') {
        document.querySelector('.orderChangeButton').style.display = 'none';
        document.querySelector('.orderCancelButton').style.display = 'none';
      }
      const submitButton = document.querySelector(`submitButton-${orderIdValue}`);
      const deleteCompleteButton = document.querySelector(`#deleteCompleteButton-${orderIdValue}`);
      const addressButton = document.querySelector('#addressButton');

      addressButton?.addEventListener('click', searchAddress);
      submitButton?.addEventListener('click', (e) => {
        console.log(`orderId : ${orderIdValue}`);
        handleSubmit(orderIdValue, e);
      });
      deleteCompleteButton?.addEventListener('click', (e) => {
        deleteOrderData(orderIdValue, e);
      });
    });
  });
}

// db에서 주문정보 삭제
async function deleteOrderData(orderIdValue, e) {
  console.log(orderIdValue);
  e.preventDefault();
  const order_id = orderIdValue;
  try {
    // 취소 진행
    const res = await Api.delete(`/api/v1/orders`, order_id);
    console.log(res);
    // 취소 성공
    alert('주문이 취소되었습니다.');

    //window.location.href = './';
  } catch (err) {
    alert(`주문 취소 과정에서 오류가 발생하였습니다\n`);
  }
}

async function handleSubmit(orderIdValue, e) {
  e.preventDefault();

  const addressInput = document.querySelector('#addressInput1');
  const detailAddressInput = document.querySelector('#addressInput2');
  const mobileInput = document.querySelector('#mobileInput');
  const nameInput = document.querySelector('#nameInput');
  const postalCodeInput = document.querySelector('#postalCodeInput');
  const name = nameInput?.value;
  const mobile = mobileInput?.value;
  const zencode = postalCodeInput?.value;
  const address = addressInput?.value;
  const detail_address = detailAddressInput?.value;
  // 주문정보 수정 api 요청
  try {
    const user_id = sessionStorage.getItem('userId');
    const order_id = orderIdValue;
    const userData = {
      user_id,
      name,
      mobile,
      zencode,
      address,
      detail_address,
    };
    console.log(userData);
    const newData = { shipping: userData };
    console.log(newData);
    if (!mobile && !address && !name) {
      return alert('업데이트된 정보가 없습니다');
    }

    const newUserInfo = await Api.patch(`/api/v1/orders`, order_id, newData);
    console.log(newUserInfo);
    alert(`주문정보가 정상적으로 수정되었습니다.`);

    // window.location.href = './';
  } catch (err) {
    console.error(err.stack);
    alert(`${err.message}`);
  }
}
function searchAddress() {
  const addressInput = document.querySelector('#addressInput1');
  const detailAddressInput = document.querySelector('#addressInput2');
  const postalCodeInput = document.querySelector('#postalCodeInput');
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
