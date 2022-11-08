import * as Api from '../../api.js';

const defaultMention = document.querySelector('.default_mention');
const selectBox = document.querySelector('.select_box');
const getProductsButton = document.querySelector('.get_products_btn');

const getCategoriesList = async () => {
  const res = await Api.get('/api/v1/categories/list');
  const categories = res.data[0].child_category;

  categories.forEach((item) => {
    defaultMention.insertAdjacentHTML('afterend', `<option value="${item}">${item}</option>`);
  });
};
getCategoriesList();

let inputValue = '';
const showValue = () => {
  inputValue = selectBox.options[selectBox.selectedIndex].value;
  console.log(inputValue);
};
getProductsButton.addEventListener('click', showValue);

const getProductsList = async () => {
  const res = await Api.get(`/api/v1/products`, `category-search?keyword=${inputValue}`);
  console.log(res);
};
getProductsButton.addEventListener('click', getProductsList);
