import * as Api from '../api.js';

const orderTableBody = document.querySelector('.ordertable-body');
addAllElements();
addAllEvents();

function addAllElements() {
  insertOrders();
}
function addAllEvents() {}
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
