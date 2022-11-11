import * as Api from '../api.js';
import { blockIfLogin, validateEmail } from '../useful-functions.js';

// 요소(element), input 혹은 상수
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const submitButton = document.querySelector('#submitButton');
const addressInput = document.querySelector('#addressInput1');
const detailAddressInput = document.querySelector('#addressInput2');
const mobileInput = document.querySelector('#mobileInput');
const nameInput = document.querySelector('#nameInput');
const postalCodeInput = document.querySelector('#postalCodeInput');
const addressButton = document.querySelector('#addressButton');

blockIfLogin();
addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
  addressButton.addEventListener('click', searchAddress);
}

// 회원가입 진행
async function handleSubmit(e) {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;
  const name = nameInput.value;
  const mobile = mobileInput.value;
  const zencode = postalCodeInput.value;
  const address = addressInput.value;
  const detail_address = detailAddressInput.value;

  // 잘 입력했는지 확인
  const isEmailValid = validateEmail(email);
  //비번 유효성 최소 4글자, 최대 20글자
  const isPasswordValid = password.length >= 4 && password.length <= 20;

  const isPasswordSame = password === passwordConfirm;

  if (!isPasswordValid) {
    return alert('비밀번호는 4글자 이상 20글자 이하이어야 합니다.');
  }

  if (!isEmailValid) {
    return alert('이메일 형식이 맞지 않습니다.');
  }

  if (!isPasswordSame) {
    return alert('비밀번호가 일치하지 않습니다.');
  }

  if (!mobile || !address || !name || !detail_address) {
    return alert('이름, 휴대폰, 주소 정보를 모두 입력하여 주세요');
  }
  // 회원가입 api 요청
  try {
    const data = { email, password, name, mobile, zencode, address, detail_address };

    await Api.post('/api/v1/users/sign-up', data);

    alert(`정상적으로 회원가입되었습니다.`);

    // 로그인 페이지 이동
    window.location.href = '/login';
  } catch (err) {
    console.error(err.stack);
    alert(`${err.message}`);
  }
}
function searchAddress(e) {
  e.preventDefault();
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
