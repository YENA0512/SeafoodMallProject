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
const addressInput = document.querySelector('#addressInput1');
const detailAddressInput = document.querySelector('#addressInput2');
const mobileInput = document.querySelector('#mobileInput');
const nameInput = document.querySelector('#nameInput');
const postalCodeInput = document.querySelector('#postalCodeInput');
const addressButton = document.querySelector('#addressButton');
checkLogin();
getUserInfo();

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
  addressButton.addEventListener('click', searchAddress);
}
async function getUserInfo() {
  try {
    const userId = sessionStorage.getItem('userId');
    const user = await Api.get(`/api/v1/users/${userId}`);
    let userName = user.data.email;
    if (user.data?.shipping?.name) {
      userName = user.data?.shipping?.name;
      nameInput.value = user.data.shipping.name;
    }
    if (user.data?.shipping?.mobile) {
      mobileInput.value = user.data.shipping.mobile;
    }
    if (user.data?.shipping?.zencode) {
      postalCodeInput.value = user.data.shipping.zencode;
    }
    if (user.data?.shipping?.address) {
      addressInput.value = user.data.shipping.address;
    }
    if (user.data?.shipping?.detail_address) {
      detailAddressInput.value = user.data.shipping.detail_address;
    }
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
      return '일반 회원';
  }
}

// 회원정보 수정 진행
async function handleSubmit(e) {
  e.preventDefault();

  const current_password = currentPasswordInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;
  const name = nameInput.value;
  const mobile = mobileInput.value;
  const zencode = postalCodeInput.value;
  const address = addressInput.value;
  const detail_address = detailAddressInput.value;

  // 새 비밀번호 잘 입력했는지 확인
  //비번 유효성 최소 4글자, 최대 20글자
  const isPasswordValid = password.length >= 4 && password.length <= 20;
  const isPasswordSame = password === passwordConfirm;

  if (!isPasswordValid && password) {
    return alert('비밀번호는 4글자 이상 20글자 이하이어야 합니다.');
  }

  if (!isPasswordSame && password) {
    return alert('새 비밀번호가 서로 일치하지 않습니다.');
  }

  // 회원정보 수정 api 요청
  try {
    const userId = sessionStorage.getItem('userId');

    let newData = {};
    if (password && password === current_password) {
      return alert('업데이트된 정보가 없습니다');
    } else if (!mobile || !address || !name) {
      return alert('이름, 휴대폰, 주소 정보를 모두 입력하여 주세요');
    } else if (!current_password) {
      return alert('현재 비밀번호를 입력해주세요');
    }
    if (!password) {
      newData = {
        current_password,
        name,
        mobile,
        zencode,
        address,
        detail_address,
      };
    } else if (password) {
      const new_password = '';
      newData = {
        current_password,
        new_password,
        name,
        mobile,
        zencode,
        address,
        detail_address,
      };
      newData.new_password = password;
    }

    const newUserInfo = await Api.patch(`/api/v1/users`, userId, newData);

    alert(`회원정보가 정상적으로 수정되었습니다.`);

    window.location.href = './';
  } catch (err) {
    console.error(err.stack);
    alert(`${err.message}`);
  }
}
function searchAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      let addr = '';
      let extraAddr = '';

      if (data.userSelectedType === 'R') {
        addr = data.roadAddress;
      } else {
        addr = data.jibunAddress;
      }

      if (data.userSelectedType === 'R') {
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
        }
        if (extraAddr !== '') {
          extraAddr = ' (' + extraAddr + ')';
        }
      }

      postalCodeInput.value = data.zonecode;
      addressInput.value = `${addr} ${extraAddr}`;
      detailAddressInput.placeholder = '상세 주소를 입력해 주세요.';
      detailAddressInput.focus();
    },
  }).open();
}
