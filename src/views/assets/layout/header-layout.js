import headerStyle from './header-style.js';
import * as Api from '../../api.js';

const notLoginHeaderHTML = `
  <style>${headerStyle}</style>
  <h1>
    <a href="/"><img class="main_logo" src="/mainlogo.png" /></a>
  </h1>
  <hr />
  <nav class="nav_bar">
    <div class="dropdown">
      <button
        class="btn dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        카테고리
      </button>
      <ul class="dropdown-menu"></ul>
    </div>
    <div class="nav_menu">
      <ul>
        <li><a href="/login">로그인</a></li>
        <em>|</em>
        <li><a href="/cart">장바구니</a></li>
      </ul>
    </div>
  </nav>
`;

const LoginHeaderHTML = `
  <style>${headerStyle}</style>

  <h1>
    <a href="/"><img class="main_logo" src="/mainlogo.png" /></a>
  </h1>
  <hr />
  <nav class="nav_bar">
    <div class="dropdown">
      <button
        class="btn dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        카테고리
      </button>
      <ul class="dropdown-menu"></ul>
    </div>
    <div class="nav_menu">
      <ul>
        <li><a href="/mypage">마이페이지</a></li>
        <em>|</em>
        <li><a href="/cart">장바구니</a></li>
        <em>|</em>
        <li class="log_out">로그아웃</li>
      </ul>
    </div>
  </nav>
`;

// 카테고리 수신 및 생성
const getCategoriesList = async () => {
  const dropMenu = document.querySelector('.dropdown-menu');

  const res = await Api.get('/api/v1/categories/list');
  const categories = res.data[0].child_category;

  let i = 1;
  categories.forEach((item) => {
    const liEl = document.createElement('li');
    const aEl = document.createElement('a');

    aEl.setAttribute('id', `order${i}`);
    aEl.setAttribute('class', `dropdown-item`);
    aEl.setAttribute('href', `#`);

    aEl.innerHTML = item;
    liEl.appendChild(aEl);

    dropMenu.appendChild(liEl);

    const dropItem = document.querySelector(`#order${i}`);

    dropItem.addEventListener('click', (e) => {
      const name = e.target.text;
      aEl.href = `/categories/category-search?keyword=${name}`;
    });
    i++;
  });
};

// 로그인 여부에 따라 네브바 변경
const isLogin = () => {
  const isToken = sessionStorage.token;

  if (!isToken) {
    const headerTag = document.createElement('header');
    headerTag.innerHTML = notLoginHeaderHTML;
    document.body.prepend(headerTag);
  } else {
    const headerTag = document.createElement('header');
    headerTag.innerHTML = LoginHeaderHTML;
    document.body.prepend(headerTag);
  }
};

isLogin();
getCategoriesList();

const logoutBtn = document.querySelector('.log_out');

logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('userId');

  window.location.href = '/';
});
