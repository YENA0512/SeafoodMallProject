const categoriesButton = document.querySelector('.categories_btn');
const productsButton = document.querySelector('.products_btn');
const ordersButton = document.querySelector('.orders_btn');
const homeButton = document.querySelector('.home_btn');

categoriesButton.addEventListener('click', () => {
  window.location.href = '/admin/categories';
});
productsButton.addEventListener('click', () => {
  window.location.href = '/admin/products';
});
ordersButton.addEventListener('click', () => {
  window.location.href = '/admin/orders';
});
homeButton.addEventListener('click', () => {
  window.location.href = '/';
});
// const isToken = sessionStorage.token;
// const isAdmin = sessionStorage.role;
