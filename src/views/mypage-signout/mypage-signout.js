import * as Api from '../api.js';
import { checkLogin } from '../useful-functions.js';

// 요소(element), input 혹은 상수
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const submitButtonSignout = document.querySelector('#submitButtonSignout');
const signoutModal = document.querySelector('.modal');
const modalCloseButton = document.querySelector('.modalCloseButton');
const signoutCompleteButton = document.querySelector('.signoutCompleteButton');
const signoutCancelButton = document.querySelector('.signoutCancelButton');

checkLogin();
addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllEvents() {
  submitButtonSignout.addEventListener('click', openModal);
  modalCloseButton.addEventListener('click', closeModal);
  document.addEventListener('keydown', keyDownCloseModal);
  signoutCompleteButton.addEventListener('click', deleteUserData);
  signoutCancelButton.addEventListener('click', closeModal);
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

    window.location.href = '/';
  } catch (err) {
    alert(
      `회원정보 삭제 과정에서 오류가 발생하였습니다\n비밀번호를 올바르게 치셨는지 확인해주세요`,
    );

    closeModal();
  }
}

function openModal() {
  $(signoutModal).show();
}
function closeModal() {
  $(signoutModal).hide();
}

// 키보드로 Modal 창 닫기
function keyDownCloseModal(e) {
  // Esc 키
  if (e.keyCode === 27) {
    closeModal();
  }
}
