import * as Api from '../../api.js';

const makeParentCategoryInput = document.querySelector('.make_parent_category');
const makeChildCategoryInput = document.querySelector('.make_child_category');
const makeSpeciesInput = document.querySelector('.make_species');
const makeSpeciesCodeInput = document.querySelector('.make_species_code');
// const makeSpeciesImageInput = document.querySelector('.make_species_image');
const getCategoryButton = document.querySelector('.get_categories_btn');
const showCategories = document.querySelector('.show_categories');
const makecategoriesButton = document.querySelector('.make_categories');

const getCategoriesList = async () => {
  showCategories.innerHTML = '';
  const res = await Api.get(`/api/v1/categories/list`);
  const parentCategories = res.data[2].parent_category;
  const childCategories = res.data[2].child_category;
  childCategories.forEach(async (item) => {
    const response = await Api.get(`/api/v1/categories/${item}`);
    const speciesDetail = response.categoryByChildCategory;

    let i = 1;
    speciesDetail.forEach((el) => {
      showCategories.insertAdjacentHTML(
        'beforeend',
        `
        <li>
          <div>
            <input id="modi_parent_category" class="${i}" value="${parentCategories}" placeholder="수산물" />
            <input id="modi_child_category" class="${i}" value="${item}" placeholder="2차" />
            <input id="modi_species" class="${i}" value="${el.species}" placeholder="품종" />
            <input id="modi_species_code" class="${i}" value="${el.species_code}" placeholder="코드" />
            <input id="modi_species_image" class="${i}" value="${el.species_image}" placeholder="이미지" />
          </div>
          <div>
            <button id="modi_category" class="${i}">수정</button>
            <button class="${i}">삭제</button>
          </div>
        </li>
        `,
      );
      i++;
    });
  });
};
// 카테고리 생성 api
const makeCategoriesList = async () => {
  const parent_category = makeParentCategoryInput.value;
  const child_category = makeChildCategoryInput.value;
  const species = makeSpeciesInput.value;
  const species_code = makeSpeciesCodeInput.value;
  // const image_path = makeSpeciesImageInput.value;
  const data = {
    parent_category,
    child_category,
    species,
    species_code,
  };
  await Api.post('/api/v1/categories/', data);
};
// 카테고리 수정 api
// const modifyCategoriesList = async () => {
//   const res = document.getElementById('1');
//   console.log(res);
// };
// modifyCategoriesList();

makecategoriesButton.addEventListener('click', makeCategoriesList);
getCategoryButton.addEventListener('click', getCategoriesList);
