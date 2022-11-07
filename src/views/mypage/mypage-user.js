import * as Api from '../api.js';
import { checkLogin } from '../useful-functions.js';

// 요소(element), input 혹은 상수
const userEmail = document.querySelector('#userEmail');
const userEmailValue = document.querySelector('#userEmailValue');
const userGroupValue = document.querySelector('#userGroupValue');
const emailInput = document.querySelector('#emailInput');
const currentPasswordInput = document.querySelector('#currentPasswordInput');
const passwordInput = document.querySelector('#passwordInput');
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const submitButton = document.querySelector('#submitButton');

checkLogin();
getUserInfo();
addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
}
async function getUserInfo() {
  try {
    const userId = sessionStorage.getItem('userId');
    const user = await Api.get(`/api/v1/users/${userId}`);
    let userName = user.data.email;
    userEmail.innerHTML = `${userName} 님`;
    userEmailValue.innerHTML = user.data.email;
    userGroupValue.innerHTML = checkGroup(user.data.group);
    emailInput.value = user.data.email;
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

// 회원정보 수정 진행
async function handleSubmit(e) {
  e.preventDefault();

  const current_password = currentPasswordInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;
  // 새 비밀번호 잘 입력했는지 확인
  const isPasswordValid = password.length >= 4;
  const isPasswordSame = password === passwordConfirm;

  if (!isPasswordValid) {
    return alert('비밀번호는 4글자 이상이어야 합니다.');
  }

  if (!isPasswordSame) {
    return alert('새 비밀번호가 서로 일치하지 않습니다.');
  }

  // 회원정보 수정 api 요청
  try {
    const userId = sessionStorage.getItem('userId');

    const new_password = '';
    const newData = { current_password, new_password };
    if (password === current_password) {
      return alert('업데이트된 정보가 없습니다');
    } else {
      newData.new_password = password;
    }

    console.log(newData);
    const newUserInfo = await Api.patch(`/api/v1/users`, userId, newData);
    console.log(newUserInfo);
    alert(`회원정보가 정상적으로 수정되었습니다.`);

    // 로그인 페이지 이동
    // window.location.href = '../login';
  } catch (err) {
    console.error(err.stack);
    alert(`${err.message}`);
  }
}
