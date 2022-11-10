import * as Api from '../../api.js';

const showOrders = document.querySelector('.show_orders');
const getOrderListButton = document.querySelector('.get_orders_btn');

const checkStatus = (str) => {
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
};

const checkStatusReverse = (str) => {
  let result = '';
  switch (str) {
    case '주문완료':
      //주문완료일 때까지만 주문정보변경, 주문취소 가능 (버튼보이기)
      result = 'order';
      break;
    case '배송전':
      result = 'prepare';
      break;
    case '배송중':
      result = 'shipping';
      break;
    case '배송완료':
      result = 'complete';
      break;
    case '주문취소':
      result = 'cancel';
      break;
  }
  return result;
};

const getOrderList = async () => {
  showOrders.innerHTML = '';
  const res = await Api.get('/api/v1/orders/admin');
  console.log('res는', res);
  const data = res.data;
  console.log('data는', data);
  let i = 1;
  data.forEach(async (item) => {
    showOrders.insertAdjacentHTML(
      'beforeend',
      `
      <li>
      <div id="modi_date${i}"></div>
      <div id="modi_order_id${i}"></div>
      <div id="modi_order_list${i}" class="show_order_list"></div>
      <div>
        <select class="form-select form-select-sm select_box${i}" aria-label=".form-select-sm example">
          <option class="default_mention${i}" selected></option>
        </select>
      </div>
      <div>
        <button type="submit" form="modify" class="btn btn-outline-warning btn-sm modi_order${i}">
          변경
        </button>
        <button type="submit" form="modify" class="btn btn-outline-danger btn-sm cancel_order${i}">
          취소
        </button>
      </div>
    </li>
      `,
    );
    // 리스트 조회 까지
    const modiDate = document.querySelector(`#modi_date${i}`);
    const modiOrderId = document.querySelector(`#modi_order_id${i}`);
    const modiOrderList = document.querySelector(`#modi_order_list${i}`);
    const modiOrderStatus = document.querySelector(`.default_mention${i}`);
    // 날짜 확인
    let orderDateValue = item.createdAt.split('T')[0];
    modiDate.innerHTML = orderDateValue;
    // id 확인
    let orderIdValue = item._id;
    modiOrderId.innerHTML = orderIdValue;
    // order 확인

    let orderItemList = item.order_items;

    // product_items 배열 순회
    orderItemList.forEach((el) => {
      modiOrderList.insertAdjacentHTML(
        `beforeend`,
        `
        <p>${el.product_id.category.species} / ${el.quantity} 개</p>
        `,
      );
    });
    // 다시 조회 시작 인풋 거르기 로직
    const checkOrder = checkStatus(item.order_status);
    const orderStatus = ['주문완료', '배송전', '배송중', '배송완료', '주문취소'];

    // 거르는 함수
    const filterStatus = (str) => {
      const result = orderStatus.filter((order) => {
        return order !== str;
      });
      return result;
    };
    const restStatus = filterStatus(checkOrder);
    restStatus.forEach((obj) => {
      modiOrderStatus.insertAdjacentHTML('afterend', `<option value="${obj}">${obj}</option>`);
    });

    modiOrderStatus.setAttribute('value', `${checkOrder}`);
    modiOrderStatus.innerHTML = checkOrder;

    // 인풋값 수정부분
    const modiOrderButton = document.querySelector(`.modi_order${i}`);
    const selectBox = document.querySelector(`.select_box${i}`);

    // 수정 이벤트
    modiOrderButton.addEventListener('click', async (e) => {
      e.preventDefault();
      // 선택 값 가져오는 함수
      let selectInputValue = selectBox.options[selectBox.selectedIndex].value;
      let order_status = checkStatusReverse(selectInputValue);

      const selectData = {
        _id: orderIdValue,
        order_status,
      };
      await Api.patch(`/api/v1/orders`, `status`, selectData);
      alert('주문상태가 수정 되었습니다.');
    });

    // 리스트 삭제
    const delOrderButton = document.querySelector(`.cancel_order${i}`);
    delOrderButton.addEventListener('click', async (e) => {
      e.preventDefault();
      let isDelete = confirm('정말 삭제하시겠습니까?');
      if (isDelete) {
        const del = await Api.delete('/api/v1/orders/admin', data._id);
        console.log(del);
      }
    });
    i++;
  });
};
getOrderList();

getOrderListButton.addEventListener('click', getOrderList);
