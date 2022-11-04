// const get = async () => {
//   const res = await fetch("'../assets/layout/nav.html'");
//   console.log(res);
// };

// get();

// const dropMenu = document.querySelector('.dropdown-menu');
// console.log(dropMenu);

// const getNavCategories = async () => {
//   const res = await fetch('../assets/layout/categories.json');
//   // fetch로 테스트용으로 적은것. 결과물은 products 동일
//   const categories = await res.json();
//   categories.forEach((item) => {
//     const { name, href } = item;
//     dropMenu.insertAdjacentHTML(
//       'beforeend',
//       `
//       <li><a class="dropdown-item" href="${href}">${name}</a></li>
//       `,
//     );
//   });
//   console.log(dropMenu);
// };
// getNavCategories();
