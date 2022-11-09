import * as Api from '../api.js';
import { validateEmail, getUrlParams } from '../useful-functions.js';

// 요소(element), input 혹은 상수
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const submitButton = document.querySelector('#submitButtonLogin');

addAllElements();
addAllEvents();

//html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
}

// 로그인 진행
async function handleSubmit(e) {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  // 잘 입력했는지 확인
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;

  if (!isEmailValid || !isPasswordValid) {
    return alert('비밀번호가 4글자 이상인지, 이메일 형태가 맞는지 확인해 주세요.');
  }

  // 로그인 api 요청
  try {
    const data = { email, password };

    const result = await Api.post('/api/v1/users/login', data);

    const { token } = result.data;

    const userToken = parseJwt(token);
    const userId = userToken.userId;
    // role추가
    const role = userToken.role;

    // 로그인 성공, 토큰을 세션 스토리지에 저장
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userId', userId);
    // role 저장
    sessionStorage.setItem('role', role);
    alert(`어서오세요. 정상적으로 로그인되었습니다.`);

    // 로그인 성공

    // admin(관리자) 일 경우, sessionStorage에 기록함
    // if (isAdmin) {
    //   sessionStorage.setItem('admin', 'admin');
    // }

    // 기존 다른 페이지에서 이 로그인 페이지로 온 경우, 다시 돌아가도록 해 줌.
    const { previouspage } = getUrlParams();

    if (previouspage) {
      window.location.href = previouspage;

      return;
    }

    // 기존 다른 페이지가 없었던 경우, 그냥 기본 페이지로 이동
    window.location.href = '../';
  } catch (err) {
    console.error(err.stack);
    alert(`이런이런! ${err.message}`);
  }
}
function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}
