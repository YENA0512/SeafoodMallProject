const getNavHTML = async () => {
  // 불러오는 module 기준으로 fetch 작성 요구
  const navResult = await fetch('../assets/layout/nav.html');
  const data = await navResult.text();

  return data;
};

const getFooterHTML = async () => {
  // 불러오는 module 기준으로 fetch 작성 요구
  const navResult = await fetch('../assets/layout/footer.html');
  const data = await navResult.text();

  return data;
};

getNavHTML().then((html) => {
  console.log(html);
  const body = document.body;

  html += body.innerHTML;
  body.innerHTML = html;
});

getFooterHTML().then((html) => {
  console.log(html);
  const body = document.body;

  html = body.innerHTML + html;
  body.innerHTML = html;
});

// 모든 영역 공통 사항
const dropMenu = document.querySelector('.dropdown-menu');

const getCategories = async () => {
  const res = await fetch('../assets/layout/categories.json');
  // fetch로 테스트용으로 적은것. 결과물은 products 동일
  const categories = await res.json();

  categories.forEach((item) => {
    const { name, href } = item;
    dropMenu.insertAdjacentHTML(
      'beforeend',
      `
      <li><a class="dropdown-item" href="${href}">${name}</a></li>
      `,
    );
  });
};

getCategories();
