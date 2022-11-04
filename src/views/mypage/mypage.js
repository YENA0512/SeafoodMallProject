// import * as Api from '../api.js';
// import { validateEmail } from '../useful-functions.js';

// 요소(element), input 혹은 상수
const userEmail = document.querySelector('#userEmail');
const userEmailValue = document.querySelector('#userEmailValue');
const userGroupValue = document.querySelector('#userGroupValue');
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const newPasswordInput = document.querySelector('#newPasswordInput');
const newPasswordConfirmInput = document.querySelector('#newPasswordConfirmInput');
const submitButton = document.querySelector('#submitButton');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  getUserInfo();
  submitButton.addEventListener('click', handleSubmit);
}
async function getUserInfo() {
  const res = await fetch('./user.json');
  //   const users = await Api.get('/api/users');
  const users = await res.json();
  console.log(users);
  let id = 0; //req.params에서 사용자 id값 가져와서 데이터 출력하기
  let userName = users[id].email.split('@')[0];
  userEmail.innerHTML = `${userName} 님`;
  userEmailValue.innerHTML = users[id].email;
  userGroupValue.innerHTML = checkGroup(users[id].group);
  emailInput.value = users[id].email;
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

// 회원정보 수정 진행
async function handleSubmit(e) {
  e.preventDefault();

  const password = passwordInput.value;
  const newPassword = newPasswordInput.value;
  const newPasswordConfirm = newPasswordConfirmInput.value;

  // 새 비밀번호 잘 입력했는지 확인
  const isPasswordValid = newPassword.length >= 4;
  const isPasswordSame = newPassword === newPasswordConfirm;

  if (!isPasswordValid) {
    return alert('비밀번호는 4글자 이상이어야 합니다.');
  }

  if (!isPasswordSame) {
    return alert('새 비밀번호가 서로 일치하지 않습니다.');
  }

  // 회원정보 수정 api 요청
  try {
    const res = await fetch('./user.json');
    //   const users = await Api.get('/api/users');
    const users = await res.json();
    const data = { password };
    const id = 0;
    if (password !== users[id].password) {
      data.password = password;
    }
    //await Api.patch('/api/users', data);
    console.log(data);
    alert(`회원정보가 정상적으로 수정되었습니다.`);

    // 로그인 페이지 이동s
    window.location.href = './user-info.html';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
