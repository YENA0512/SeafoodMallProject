// import { get } from 'mongoose';
import * as Api from '../api.js';
const orderTableBody = document.querySelector('.ordertable-body');

// 요소(element), input 혹은 상수
const userEmail = document.querySelector('#userEmail');
const userEmailValue = document.querySelector('#userEmailValue');
const userGroupValue = document.querySelector('#userGroupValue');

getUserInfo();
addAllElements();
addAllEvents();

function addAllElements() {
  insertOrders();
}
function addAllEvents() {}

async function getUserInfo() {
  try {
    const userId = sessionStorage.getItem('userId');
    const user = await Api.get(`/api/v1/users/${userId}`);
    let userName = user.data.email;
    userEmail.innerHTML = `${userName} 님`;
    userEmailValue.innerHTML = user.data.email;
    userGroupValue.innerHTML = checkGroup(user.data.group);
  } catch (err) {
    console.error(err.stack);
    alert(`${err.message}`);
  }
}

function checkGroup(userGroup) {
  if (userGroup === 'admin') {
    return '관리자';
  } else if (userGroup === 'seller') {
    return '판매자';
  } else if (userGroup === 'customer') {
    return '소비자';
  }
}

async function insertOrders() {
  const orders = await Api.get('/api/v1/orders');
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
    <td>${order_status}</td>
  </tr>
    `,
    );
  }
}
