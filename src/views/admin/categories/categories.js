import * as Api from '../../api.js';

// const parentCategoryInput = document.querySelector('.parent_category');
// const childCategoryInput = document.querySelector('.child_category');
// const speciesInput = document.querySelector('.species');
// const speciesCodeInput = document.querySelector('.species_code');
// const speciesImageInput = document.querySelector('.species_image');
const getCategoryButton = document.querySelector('.get_categories_btn');
const showCategories = document.querySelector('.show_categories');

const getCategoriesList = async () => {
  showCategories.innerHTML = '';
  const res = await Api.get(`/api/v1/categories/list`);
  const parentCategories = res.data[1].parent_category;
  const childCategories = res.data[1].child_category;

  childCategories.forEach(async (item) => {
    const response = await Api.get(`/api/v1/categories/${item}`);
    const speciesDetail = response.categoryByChildCategory;
    speciesDetail.forEach((el) => {
      showCategories.insertAdjacentHTML(
        'beforeend',
        `
        <li>
          <div>
            <input class="parent_category" value="${parentCategories}" placeholder="수산물" />
            <input class="child_category" value="${item}" placeholder="2차" />
            <input class="species" value="${el.species}" placeholder="품종" />
            <input class="species_code" value="${el.species_code}" placeholder="코드" />
            <input class="species_image" value="${el.species_image}" placeholder="이미지" />
          </div>
          <div>
            <button>수정</button>
            <button>삭제</button>
          </div>
        </li>
        `,
      );
    });
  });
};
getCategoryButton.addEventListener('click', getCategoriesList);
