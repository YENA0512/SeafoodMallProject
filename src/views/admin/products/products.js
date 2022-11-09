import * as Api from '../../api.js';

const makeChildCategoryInput = document.querySelector('.make_child_category');
const makeProductButton = document.querySelector('.make_product');
const defaultMention = document.querySelector('.default_mention');
const selectBox = document.querySelector('.select_box');
const getProductsButton = document.querySelector('.get_products_btn');
const showProducts = document.querySelector('.show_product');
const makeParentCateInput = document.querySelector('.make_parent_category');
const makeChildCateInput = document.querySelector('.make_child_category');
const makeSpeciesInput = document.querySelector('.make_species');
const makeSpeciesCodeInput = document.querySelector('.make_species_code');
const makeImageInput = document.querySelector('.make_species_image');
const makeAuctionInput = document.querySelector('.make_price_auction');
const makeSellerInput = document.querySelector('.make_price_seller');
const makePlatformInput = document.querySelector('.make_price_platform');

const getCategoriesList = async () => {
  const res = await Api.get('/api/v1/categories/list');
  const categories = res.data[0].child_category;

  categories.forEach((item) => {
    defaultMention.insertAdjacentHTML('afterend', `<option value="${item}">${item}</option>`);
  });
};

let selectInputValue = ''; // 선택 값
const showValue = () => {
  selectInputValue = selectBox.options[selectBox.selectedIndex].value;
  console.log(selectInputValue);
  if (selectInputValue === '카테고리를 선택하세요.') {
    makeChildCategoryInput.value = '';
  } else {
    makeChildCategoryInput.value = selectInputValue;
  }
};

const makeProductsList = async () => {
  let parent_category = makeParentCateInput.value;
  let childCategoryValue = makeChildCateInput.value;
  let speciesValue = makeSpeciesInput.value;
  let speciesCodeValue = makeSpeciesCodeInput.value;
  let imageValue = makeImageInput.value;
  let auctionValue = makeAuctionInput.value;
  let sellerCoValue = makeSellerInput.value;
  let platformCoValue = makePlatformInput.value;

  const child_category = childCategoryValue.trim();
  const species = speciesValue.trim();
  const species_code = speciesCodeValue.trim();
  let species_image = imageValue.trim();
  const auction_cost = auctionValue.trim();
  const seller_commision = sellerCoValue.trim();
  const platform_commision = platformCoValue.trim();

  if (!species_image) {
    species_image = 'imagePath';
  }
  if (
    !child_category ||
    !species ||
    !species_code ||
    !auction_cost ||
    !seller_commision ||
    !platform_commision
  ) {
    console.log('값 부족!');
    // alert('값을 입력해주세요.');
  } else {
    const postData = {
      category: {
        parent_category,
        child_category,
        species,
        species_code,
        species_image,
      },
      price: {
        auction_cost,
        seller_commision,
        platform_commision,
        packaging_cost: 1000,
      },
      stock: 100,
    };

    await Api.post(`/api/v1/products`, postData);
    alert('정상적으로 추가 되었습니다!');
    console.log(postData);
    makeParentCateInput.value = '';
    makeChildCateInput.value = '';
    makeSpeciesInput.value = '';
    makeSpeciesCodeInput.value = '';
    makeImageInput.value = '';
    makeAuctionInput.value = '';
    makeSellerInput.value = '';
    makePlatformInput.value = '';
    getProductsList();
  }
};

const getProductsList = async () => {
  showProducts.innerHTML = '';
  const res = await Api.get(`/api/v1/products`, `category-search?keyword=${selectInputValue}`);
  console.log(res);
  let i = 1;
  res.forEach((item) => {
    showProducts.insertAdjacentHTML(
      'beforeend',
      `
      <li>
        <div>
          <input
            id="modi_parent_category"
            value="${item.category.parent_category}"
            placeholder="수산물"
            readonly
          />
          <input id="modi_child_category_${item._id}" value="${item.category.child_category}" placeholder="2차" readonly />
          <input id="modi_species_${item._id}" value="${item.category.species}" placeholder="품종" required />
          <input id="modi_species_code_${item._id}" value="${item.category.species_code}" placeholder="코드" required />
          <input id="modi_image_${item._id}" value="${item.category.species_image}" placeholder="이미지" />
          <input id="modi_auction_${item._id}" value="${item.price.auction_cost}" placeholder="위판가" required />
          <input id="modi_seller_commision_${item._id}" value="${item.price.seller_commision}" placeholder="판매자 수수료" required />
          <input id="modi_platform_commision_${item._id}" value="${item.price.platform_commision}" placeholder="플랫폼 수수료" required />
        </div>
        <div>
          <button type="submit" form="modify" class="btn btn-outline-warning modi_product${i} btn-sm">수정</button>
          <button type="submit" form="modify" class="btn btn-outline-danger del_product${i} btn-sm">삭제</button>
        </div>
      </li>
      `,
    );
    // 상품 수정
    const modiButton = document.querySelector(`.modi_product${i}`);
    modiButton.addEventListener('click', async () => {
      const modiParentCate = document.querySelector(`#modi_parent_category`);
      const modiChildCate = document.querySelector(`#modi_child_category_${item._id}`);
      const modiSpecise = document.querySelector(`#modi_species_${item._id}`);
      const modiSpeciseCode = document.querySelector(`#modi_species_code_${item._id}`);
      const modiImage = document.querySelector(`#modi_image_${item._id}`);
      const modiAuction = document.querySelector(`#modi_auction_${item._id}`);
      const modiSellerCo = document.querySelector(`#modi_seller_commision_${item._id}`);
      const modiPlatformCo = document.querySelector(`#modi_platform_commision_${item._id}`);

      let parent_category = modiParentCate.value;
      let childCategoryValue = modiChildCate.value;
      let speciesValue = modiSpecise.value;
      let speciesCodeValue = modiSpeciseCode.value;
      let imageValue = modiImage.value;
      let auctionValue = modiAuction.value;
      let sellerCoValue = modiSellerCo.value;
      let platformCoValue = modiPlatformCo.value;

      const child_category = childCategoryValue.trim();
      const species = speciesValue.trim();
      const species_code = speciesCodeValue.trim();
      let species_image = imageValue.trim();
      const auction_cost = auctionValue.trim();
      const seller_commision = sellerCoValue.trim();
      const platform_commision = platformCoValue.trim();

      if (!species_image) {
        species_image = 'imagePath';
      }
      if (
        !child_category ||
        !species ||
        !species_code ||
        !auction_cost ||
        !seller_commision ||
        !platform_commision
      ) {
        console.log('값 부족!');
      } else {
        const patchData = {
          category: {
            parent_category,
            child_category,
            species,
            species_code,
            species_image,
          },
          price: {
            auction_cost,
            seller_commision,
            platform_commision,
          },
        };

        await Api.patch(`/api/v1/products`, item._id, patchData);
      }
    });
    // 상품 삭제
    const delButton = document.querySelector(`.del_product${i}`);
    delButton.addEventListener('click', async () => {
      await Api.delete(`/api/v1/products`, item._id);
    });
    i++;
  });
};

getCategoriesList();
getProductsList();

getProductsButton.addEventListener('click', showValue);
getProductsButton.addEventListener('click', getProductsList);
makeProductButton.addEventListener('click', makeProductsList);
