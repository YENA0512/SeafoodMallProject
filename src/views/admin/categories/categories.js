import * as Api from '../../api.js';

const makeParentCategoryInput = document.querySelector('.make_parent_category');
const makeChildCategoryInput = document.querySelector('.make_child_category');
const getCategoryButton = document.querySelector('.get_categories_btn');
const showCategories = document.querySelector('.show_categories');
const makecategoriesButton = document.querySelector('.make_categories');

// 카테고리 가져오기
const getCategoriesList = async () => {
  showCategories.innerHTML = '';
  const res = await Api.get(`/api/v1/categories/list/admin`);
  console.log(res);

  let i = 1;
  res.forEach((item) => {
    showCategories.insertAdjacentHTML(
      'beforeend',
      `
        <li>
          <div>
            <input
              id="modi_parent_category"
              value="${item.parent_category}"
              placeholder="수산물"
              readonly
            />
            <input id="modi_child_category_${item._id}" value="${item.child_category}" placeholder="2차" required />
          </div>
          <div>
            <button type="submit" form="modify" class="btn btn-outline-warning modi_category${i} btn-sm">수정</button>
            <button type="submit" form="modify" class="btn btn-outline-danger del_category${i} btn-sm">삭제</button>
          </div>
        </li>
        `,
    );
    // 카테고리 수정
    // TODO: 만약 내용이 디비의 내용과 같다면 프론트단에서 막는 로직설정
    const modiButton = document.querySelector(`.modi_category${i}`);
    modiButton.addEventListener('click', async () => {
      const modiParentCate = document.querySelector(`#modi_parent_category`);
      const modiChildCate = document.querySelector(`#modi_child_category_${item._id}`);
      let parent_category = modiParentCate.value;
      let ChildCategoryValue = modiChildCate.value;
      const child_category = ChildCategoryValue.trim();
      if (!ChildCategoryValue || modiChildCate.value === '') {
        console.log('값 부족!');
        makeChildCategoryInput.value = '';
      } else {
        const patchData = {
          parent_category,
          child_category,
        };
        await Api.patch(`/api/v1/categories`, item._id, patchData);
      }
    });

    const delButton = document.querySelector(`.del_category${i}`);
    delButton.addEventListener('click', async () => {
      const modiParentCate = document.querySelector(`#modi_parent_category`);
      const modiChildCate = document.querySelector(`#modi_child_category_${item._id}`);

      const parent_category = modiParentCate.value;
      const child_category = modiChildCate.value;

      const patchData = {
        parent_category,
        child_category,
      };
      await Api.delete(`/api/v1/categories`, item._id, patchData);
    });
    i++;
  });
};

// 카테고리 생성 api
const makeCategoriesList = async () => {
  const parentCategortValue = makeParentCategoryInput.value;
  const childCategoryValue = makeChildCategoryInput.value;
  // 트림으로 공백은 삭제해주기
  const child_category = childCategoryValue.trim();

  if (!child_category || child_category === '') {
    console.log('값 부족!');
    makeChildCategoryInput.value = '';
  } else {
    const postData = {
      parent_category: parentCategortValue,
      child_category: child_category,
    };

    await Api.post('/api/v1/categories/', postData);
    alert('정상적으로 추가 되었습니다!');
    makeChildCategoryInput.innerHTML = '';
  }
};

makecategoriesButton.addEventListener('click', makeCategoriesList);
getCategoryButton.addEventListener('click', getCategoriesList);
