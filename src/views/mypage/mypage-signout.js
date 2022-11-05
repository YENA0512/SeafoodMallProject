import * as Api from '../api.js';
// import { createNavbar } from '../useful-functions.js';

// 요소(element), input 혹은 상수
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const submitButtonSignout = document.querySelector('#submitButtonSignout');
const modal = document.querySelector('#modal');
const modalCloseButton = document.querySelector('#modalCloseButton');
const signoutCompleteButton = document.querySelector('#signoutCompleteButton');
const signoutCancelButton = document.querySelector('#signoutCancelButton');

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

  const password = passwordConfirmInput.value;
  const data = { password };

  try {
    // 우선 입력된 비밀번호가 맞는지 확인 (틀리면 에러 발생함)
    const userToDelete = await Api.post('/api/user/password/check', data);
    const { _id } = userToDelete;

    // 삭제 진행
    await Api.delete('/api/users', _id);

    // 삭제 성공
    alert('회원 정보가 안전하게 삭제되었습니다.');

    // 토큰 삭제
    sessionStorage.removeItem('token');

    window.location.href = '/';
  } catch (err) {
    alert(`회원정보 삭제 과정에서 오류가 발생하였습니다: ${err}`);

    closeModal();
  }
}

// Modal 창 열기
function openModal(e) {
  if (e) {
    e.preventDefault();
  }
  //   modal.classList.add('is-active');
  modal.modal();
}

// Modal 창 닫기
function closeModal(e) {
  if (e) {
    e.preventDefault();
  }
  //   modal.classList.remove('is-active');
  modal.modal('hide');
}

// 키보드로 Modal 창 닫기
function keyDownCloseModal(e) {
  // Esc 키
  if (e.keyCode === 27) {
    closeModal();
  }
}
