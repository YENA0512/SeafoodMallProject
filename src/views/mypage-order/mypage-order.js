import * as Api from '../api.js';
import { checkLogin } from '../useful-functions.js';

// 요소(element), input 혹은 상수
const orderTableBody = document.querySelector('.ordertable-body');
const userEmail = document.querySelector('#userEmail');
const userEmailValue = document.querySelector('#userEmailValue');
const userGroupValue = document.querySelector('#userGroupValue');
const updateOrderInfoModal = document.querySelector('#updateOrderInfoModal');
const addressInput = document.querySelector('#addressInput1');
const detailAddressInput = document.querySelector('#addressInput2');
const mobileInput = document.querySelector('#mobileInput');
const nameInput = document.querySelector('#nameInput');
const postalCodeInput = document.querySelector('#postalCodeInput');
const addressButton = document.querySelector('#addressButton');
const submitButton = document.querySelector('#submitButton');
const cancelOrderModal = document.querySelector('#cancelOrderModal');
const deleteCompleteButton = document.querySelector('#deleteCompleteButton');
const deleteCancelButton = document.querySelector('#deleteCancelButton');
const modalCloseButton = document.querySelector('#modalCloseButton');

checkLogin();
getUserInfo();
addAllElements();
addAllEvents();

function addAllElements() {
  insertOrders();
}
function addAllEvents() {
  // sub;
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

async function insertOrders() {
  const orders = await Api.get(`/api/v1/orders`);
  console.log(orders);
  for (const order of orders) {
    const { order_date, product, quantity, price, order_status } = order;
    orderTableBody.insertAdjacentHTML(
      'beforeend',
      `
    <tr>
    <td>${order_date}</td>
    <td>${product}</td>
    <td>${quantity}</td>
    <td>${price * quantity}</td>
    <td id="orderStatus">${order_status}</td>
  </tr>
    `,
    );
  }
}
