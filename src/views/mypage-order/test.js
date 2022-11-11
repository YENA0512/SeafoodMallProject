import * as Api from '../api.js';
import { checkLogin } from '../useful-functions.js';
const addressInput = document.querySelector('#addressInput1');
const detailAddressInput = document.querySelector('#addressInput2');
const mobileInput = document.querySelector('#mobileInput');
const nameInput = document.querySelector('#nameInput');
const postalCodeInput = document.querySelector('#postalCodeInput');
const submitButton = document.querySelector('#submitButton');

async function handleSubmit(e) {
  e.preventDefault();
  const name = nameInput?.value;
  const mobile = mobileInput?.value;
  const zencode = postalCodeInput?.value;
  const address = addressInput?.value;
  const detail_address = detailAddressInput?.value;
  // 회원정보 수정 api 요청
  try {
    const user_Id = sessionStorage.getItem('userId');
    const orders = await Api.get(`/api/v1/orders`);
    // const _id = orders.data.
    // console.log(user_Id);

    const userData = {
      user_Id,
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

    console.log(newData);
    const newUserInfo = await Api.patch(`/api/v1/orders`, user_Id, newData);
    console.log(newUserInfo);
    alert(`주문정보가 정상적으로 수정되었습니다.`);

    // 로그인 페이지 이동
    window.location.href = './';
  } catch (err) {
    console.error(err.stack);
    alert(`${err.message}`);
  }
}

submitButton.addEventListener('click', handleSubmit);
