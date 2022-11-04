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

getNavHTML()
  .then((html) => {
    const body = document.body;
    html += body.innerHTML;
    body.innerHTML = html;
  })
  .then(async () => {
    const dropMenu = document.querySelector('.dropdown-menu');
    const liEl = document.createElement('li');
    liEl.innerHTML = 'dltlqkf';
    dropMenu.appendChild(liEl);

    // const dropMenu = document.querySelector('.dropdown-menu');

    // const res = await fetch('../assets/layout/categories.json');
    // // fetch로 테스트용으로 적은것. 결과물은 products 동일
    // const categories = await res.json();

    // categories.forEach((item) => {
    //   const { name, href } = item;

    //   const liEl = document.createElement('li');
    //   const aEl = document.createElement('a');

    //   aEl.setAttribute('class', 'dropdown-item');
    //   aEl.setAttribute('href', `${href}`);

    //   aEl.innerHTML = name;
    //   liEl.appendChild(aEl);

    //   dropMenu.appendChild(liEl);
    // });
    // console.log(dropMenu);
  });

getFooterHTML().then((html) => {
  const body = document.body;

  html = body.innerHTML + html;
  body.innerHTML = html;
});

// 모든 영역 공통 사항
