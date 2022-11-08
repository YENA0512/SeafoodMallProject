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
  // TODO: parentCategory 수정되면 1번으로 바꿀것, 혹은 수산물을 찾는 로직을 만들것.
  const parentCategories = res.data[1].parent_category;
  const childCategories = res.data[1].child_category;
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
            <input
              id="modi_parent_category"
              class="${i}"
              value="${parentCategories}"
              placeholder="수산물"
              readonly
            />
            <input id="modi_child_category" class="${i}" value="${item}" placeholder="2차" required />
            <input id="modi_species" class="${i}" value="${el.species}" placeholder="품종" required />
            <input
              id="modi_species_code"
              class="${i}"
              value="${el.species_code}"
              placeholder="코드"
              required
            />
            <input
              id="modi_species_image"
              class="${i}"
              value="${el.species_image}"
              placeholder="이미지 경로"
            />
          </div>
          <div>
            <button type="button" class="btn btn-outline-warning modi_category btn-sm ${i}">수정</button>
            <button type="button" class="btn btn-outline-danger modi_category btn-sm ${i}">삭제</button>
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
  if (!child_category || !species || !species_code) {
    console.log('값 부족!');
  } else {
    const data = {
      parent_category,
      child_category,
      species,
      species_code,
    };
    // TODO: 지금 오징어에 넣은 '/' 때문에 계속 오류 뜨나본데? 해결요망
    // try {
    await Api.post('/api/v1/categories/', data);
    alert('정상적으로 추가 되었습니다!');
    // } catch (err) {
    //   alert(`문제가 발생하였습니다. 잠시후에 다시 시도해주세요. errorCode: ${err}`);
    // }
  }
};
// 카테고리 수정 api
// const modifyCategoriesList = async () => {
//   const res = document.getElementById('1');
//   console.log(res);
// };
// modifyCategoriesList();

makecategoriesButton.addEventListener('click', makeCategoriesList);
getCategoryButton.addEventListener('click', getCategoriesList);
