import * as Api from '../api.js';
import { checkLogin } from '../useful-functions.js';

// 요소(element), input 혹은 상수
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const signoutCompleteButton = document.querySelector('.signoutCompleteButton');

checkLogin();
addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllEvents() {
  signoutCompleteButton?.addEventListener('click', deleteUserData);
}

// db에서 회원정보 삭제
async function deleteUserData(e) {
  e.preventDefault();
  const userId = sessionStorage.getItem('userId');

  const password = passwordConfirmInput.value;
  const data = { password };

  try {
    // 삭제 진행
    await Api.delete(`/api/v1/users`, userId, data);

    // 삭제 성공
    alert('회원 정보가 안전하게 삭제되었습니다.');

    // 토큰 삭제
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('role');

    window.location.href = '/';
  } catch (err) {
    alert(
      `회원정보 삭제 과정에서 오류가 발생하였습니다\n비밀번호를 올바르게 치셨는지 확인해주세요`,
    );
  }
}
