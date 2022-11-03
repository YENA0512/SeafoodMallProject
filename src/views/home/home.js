// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.

// import * as Api from '../api.js';
// import { randomId } from '/useful-functions.js';

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  getProductData();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  // for eslint pass
}

const productItemContainer = document.querySelector('.product');

async function getProductData() {
  const res = await fetch('./products.json');
  // fetch로 테스트용으로 적은것. 결과물은 products 동일
  const products = await res.json();
  console.log(products);
  products.forEach(async (item) => {
    const { productImage, productName, productPrice } = item;

    productItemContainer.insertAdjacentHTML(
      'beforeend',
      `
    <div class="product_item">
      <img class="product_img" src="${productImage}" />
      <h3>${productName}</h3>
      <div>
        <span>${productPrice}</span>
        <span>&nbsp;원</span>
      </div>
    </div>
  `,
    );
  });
}

/*

// async function getDataFromApi() {
//   // 예시 URI입니다. 현재 주어진 프로젝트 코드에는 없는 URI입니다.
//   const data = await Api.get('/api/user/data');
//   // const random = randomId();

// }

// 요소(element), input 혹은 상수
const landingDiv = document.querySelector('#landingDiv');
const greetingDiv = document.querySelector('#greetingDiv');

function insertTextToLanding() {
  landingDiv.insertAdjacentHTML(
    'beforeend',
    `
      <h2>n팀 쇼핑몰의 랜딩 페이지입니다. 자바스크립트 파일에서 삽입되었습니다.</h2>
    `,
  );
}

function insertTextToGreeting() {
  greetingDiv.insertAdjacentHTML(
    'beforeend',
    `
      <h1>반갑습니다! 자바스크립트 파일에서 삽입되었습니다.</h1>
    `,
  );
}

function alertLandingText() {
  alert('n팀 쇼핑몰입니다. 안녕하세요.');
}

function alertGreetingText() {
  alert('n팀 쇼핑몰에 오신 것을 환영합니다');
}
*/
