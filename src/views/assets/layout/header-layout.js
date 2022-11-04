const res = await fetch('../assets/layout/categories.json');
// fetch로 테스트용으로 적은것. 결과물은 products 동일
const categories = await res.json();

const headerHTML = `
  <h1>
    <a href="#"><img class="main_logo" src="../assets/mainlogo.png" /></a>
  </h1>
  <hr />
  <nav class="nav_bar">
    <div class="dropdown">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        카테고리
      </button>
      <ul class="dropdown-menu"></ul>
    </div>
    <div class="nav_menu">
      <ol>
        <li><a>로그인</a></li>
        <em>&nbsp;|&nbsp;</em>
        <li><a>마이페이지</a></li>
        <em>&nbsp;|&nbsp;</em>
        <li><a>장바구니</a></li>
        <em>&nbsp;|&nbsp;</em>
        <li><a>로그아웃</a></li>
      </ol>
    </div>
  </nav>
`;
const headerTag = document.createElement('header');
headerTag.innerHTML = headerHTML;
document.body.prepend(headerTag);

const dropMenu = document.querySelector('.dropdown-menu');

categories.forEach((item) => {
  const { name, href } = item;

  const liEl = document.createElement('li');
  const aEl = document.createElement('a');

  aEl.setAttribute('class', 'dropdown-item');
  aEl.setAttribute('href', `${href}`);

  aEl.innerHTML = name;
  liEl.appendChild(aEl);

  dropMenu.appendChild(liEl);
});
console.log(dropMenu);

// const getNavHTML = async () => {
//   // 불러오는 module 기준으로 fetch 작성 요구
//   const navResult = await fetch('../assets/layout/nav.html');
//   const data = await navResult.text();

//   return data;
// };

// const getFooterHTML = async () => {
//   // 불러오는 module 기준으로 fetch 작성 요구
//   const navResult = await fetch('../assets/layout/footer.html');
//   const data = await navResult.text();

//   return data;
// };

// getNavHTML()
//   .then((html) => {
//     const body = document.body;
//     html += body.innerHTML;
//     body.innerHTML = html;
//   })
//   .then(async () => {
//     const dropMenu = document.querySelector('.dropdown-menu');
//     const liEl = document.createElement('li');
//     liEl.innerHTML = 'dltlqkf';
//     dropMenu.appendChild(liEl);

//     // const dropMenu = document.querySelector('.dropdown-menu');

//     // const res = await fetch('../assets/layout/categories.json');
//     // // fetch로 테스트용으로 적은것. 결과물은 products 동일
//     // const categories = await res.json();

//     // categories.forEach((item) => {
//     //   const { name, href } = item;

//     //   const liEl = document.createElement('li');
//     //   const aEl = document.createElement('a');

//     //   aEl.setAttribute('class', 'dropdown-item');
//     //   aEl.setAttribute('href', `${href}`);

//     //   aEl.innerHTML = name;
//     //   liEl.appendChild(aEl);

//     //   dropMenu.appendChild(liEl);
//     // });
//     // console.log(dropMenu);
//   });

// getFooterHTML().then((html) => {
//   const body = document.body;

//   html = body.innerHTML + html;
//   body.innerHTML = html;
// });

// // 모든 영역 공통 사항
