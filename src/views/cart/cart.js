import { addCommas, convertToNumber, navigate } from '../useful-functions.js';
import { deleteFromDb, getFromDb, putToDb } from '../indexed-db.js';

// 요소 가져오기 /////////////
const cartProductsContainer = document.querySelector('#cart_list');
const allSelectCheckbox = document.querySelector('#all_select');
const partialDeleteLabel = document.querySelector('#partial_delete');
const productsCountElem = document.querySelector('#productsCount');
const productsTotalElem = document.querySelector('#product_price');
const deliveryFeeElem = document.querySelector('#shipping_price');
const orderTotalElem = document.querySelector('#total_order_price');
const purchaseButton = document.querySelector('#purchase_button');

const addAllElements = () => {
  // 결제정보
  insertOrderSummary();
  // 전체 체크박스 업데이트
  updateAllSelectCheckbox();
  // 카트 목록
  insertProductsfromCart();
};

const addAllEvents = () => {
  // 전체선택 버튼 클릭
  allSelectCheckbox.addEventListener('change', toggleAll);
  // 선택삭제 버튼 클릭
  partialDeleteLabel.addEventListener('click', deleteSelectedItems);
  // 구매하기 버튼 클릭
  purchaseButton.addEventListener('click', saveToOrder);
};

// 로그인 확인
async function saveToOrder() {
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    alert('로그인 후 이용가능합니다');
    window.location.href = '/login';
  }
}

// 장바구니가 비었을 때
const addEmptyHtml = () => {
  cartProductsContainer.insertAdjacentHTML(
    'beforeend',
    `<div class="empty_cart"><p>장바구니에 상품이 없습니다.😢</p></div>`,
  );
};

addAllElements();
addAllEvents();

// 비회원 데이터 Read : indexedDB 이용
async function insertProductsfromCart() {
  const products = await getFromDb('cart');
  const { selectedIds } = await getFromDb('order', 'summary');
  // 장바구니가 비었을 때
  if (products.length == 0) {
    addEmptyHtml();
  }
  products.forEach((product) => {
    const id = product._id;
    const title = product.species;
    const image = product.species_image;
    const quantity = product.quantity;
    const productPrice = product.product_cost;
    const isSelected = selectedIds.includes(id);

    cartProductsContainer.insertAdjacentHTML(
      'beforeend',
      `<div class="item_container" id="productItem-${id}">
    <input class="form-check-input" type="checkbox" value="" id="checkbox-${id}" ${
        isSelected ? 'checked' : ''
      }   />
     
  <div class="content">
  <div class="image col-3">
  <figure>
<img class="product_image " src="${image}" alt="상품이미지" id="image-${id}"/>
</figure>
</div>
    <div id="title-${id}" class="col-2">
      <p>${title}</p>
    </div>
    <div class="quantity col-3">
      <button class="btn btn-outline-secondary" style="
      border: none;
  " id="minus-${id}" ${quantity <= 1 ? 'disabled' : ''} ${isSelected ? 'checked' : ''}
      >-</button>
      <input type="number" class="quantity_input"  min="1" max="99" value="${quantity}" id="quantityInput-${id}" ${
        isSelected ? 'checked' : ''
      }
    }/>
      <button class="btn btn-outline-secondary" style="
      border: none;
  "id="plus-${id}" ${quantity >= 99 ? 'disabled' : ''} ${isSelected ? 'checked' : ''}
    }
     >+</button>

    </div>
    <div class="calculation col-2">
     <p id="unitPrice-${id}" style="display:none">${addCommas(productPrice)}원</p>
     <p id="quantity-${id}" style="display:none">${quantity}</p>
      <p id="total-${id}">${addCommas(productPrice * quantity)}원</p>
    </div>
    <div class="delete col-2">
      <button class="btn btn-dark btn-sm" id="delete-${id}">삭제</button>
    </div>
  </div>
  </div>`,
    );
    // 삭제 버튼 클릭
    document.querySelector(`#delete-${id}`).addEventListener('click', () => deleteItem(id));
    // 체크박스 선택
    document.querySelector(`#checkbox-${id}`).addEventListener('change', () => toggleItem(id));
    // 수량 빼기 버튼 클릭
    document
      .querySelector(`#minus-${id}`)
      .addEventListener('click', () => decreaseItemQuantity(id));
    // 수량 추가 버튼 클릭
    document.querySelector(`#plus-${id}`).addEventListener('click', () => increaseItemQuantity(id));
    // 수량 입력
    document
      .querySelector(`#quantityInput-${id}`)
      .addEventListener('change', () => handleQuantityInput(id));
    // 페이지 이동
    document.querySelector(`#image-${id}`).addEventListener('click', navigate(`/product/${id}`));
    document.querySelector(`#title-${id}`).addEventListener('click', navigate(`/product/${id}`));
  });
}

// 상품 선택 함수
async function toggleItem(id) {
  const itemCheckbox = document.querySelector(`#checkbox-${id}`);
  const isChecked = itemCheckbox.checked;

  // 결제정보 업데이트 및, 체크 상태에서는 수량을 수정 가능 (언체크는 불가능)으로 함
  if (isChecked) {
    await updateOrderSummary(id, 'add-checkbox');
    setQuantityBox(id, 'able');
  } else {
    await updateOrderSummary(id, 'removeTemp-checkbox');
    setQuantityBox(id, 'disable');
  }
}

// 전체 선택 함수
async function toggleAll(e) {
  // 전체 체크냐 전체 체크 해제이냐로 true 혹은 false
  const isCheckAll = e.target.checked;
  const { ids } = await getFromDb('order', 'summary');

  ids.forEach(async (id) => {
    const itemCheckbox = document.querySelector(`#checkbox-${id}`);
    const isItemCurrentlyChecked = itemCheckbox.checked;

    // 일단 아이템(제품) 체크박스에 전체 체크 혹은 언체크 여부를 반영함.
    itemCheckbox.checked = isCheckAll;

    // 결제정보 업데이트 필요 여부 확인
    const isAddRequired = isCheckAll && !isItemCurrentlyChecked;
    const isRemoveRequired = !isCheckAll && isItemCurrentlyChecked;

    // 결제정보 업데이트 및, 체크 상태에서는 수정 가능으로 함
    if (isAddRequired) {
      updateOrderSummary(id, 'add-checkbox');
      setQuantityBox(id, 'able');
    }

    // 결제정보 업데이트 및, 언체크 상태에서는 수정 불가능으로 함
    if (isRemoveRequired) {
      updateOrderSummary(id, 'removeTemp-checkbox');
      setQuantityBox(id, 'disable');
    }
  });
}
// 수량 증가 함수
async function increaseItemQuantity(id) {
  // 결제정보카드 업데이트
  await updateOrderSummary(id, 'add-plusButton');

  // 제품아이템카드 업데이트
  await updateProductItem(id, 'increase');

  // indexedDB의 cart 데이터 업데이트
  await putToDb('cart', id, (data) => {
    data.quantity = data.quantity + 1;
  });

  // 수량 변경박스(-버튼, 입력칸, +버튼) 상태 업데이트
  setQuantityBox(id, 'plus');
}

// 수량 감소 함수
async function decreaseItemQuantity(id) {
  // 결제정보카드 업데이트
  await updateOrderSummary(id, 'minusButton');

  // 제품아이템카드 업데이트
  await updateProductItem(id, 'decrease');

  // indexedDB의 cart 데이터 업데이트
  await putToDb('cart', id, (data) => {
    data.quantity = data.quantity - 1;
  });

  // 수량 변경박스(-버튼, 입력칸, +버튼) 상태 업데이트
  setQuantityBox(id, 'minus');
}

// 수량 입력 함수
async function handleQuantityInput(id) {
  // 우선 입력값이 범위 1~99 인지 확인
  const inputElem = document.querySelector(`#quantityInput-${id}`);
  const quantity = parseInt(inputElem.value);

  if (quantity < 1 || quantity > 99) {
    return alert('수량은 1~99 사이가 가능합니다.');
  }

  // 결제정보카드 업데이트
  await updateOrderSummary(id, 'add-input');

  // 제품아이템카드 업데이트
  await updateProductItem(id, 'input');

  // indexedDB의 cart 데이터 업데이트
  await putToDb('cart', id, (data) => {
    data.quantity = quantity;
  });

  // 수량 변경박스(-버튼, 입력칸, +버튼) 상태 업데이트
  setQuantityBox(id, 'input');
}

// -버튼, 숫자입력칸, +버튼 활성화 여부 및 값을 세팅함.
function setQuantityBox(id, type) {
  // 세팅 방식 결정을 위한 변수들
  const isPlus = type.includes('plus');
  const isMinus = type.includes('minus');
  const isInput = type.includes('input');
  const isDisableAll = type.includes('disable');

  // 세팅을 위한 요소들
  const minusButton = document.querySelector(`#minus-${id}`);
  const quantityInput = document.querySelector(`#quantityInput-${id}`);
  const plusButton = document.querySelector(`#plus-${id}`);

  // 우선 기본적으로 활성화시킴
  minusButton.removeAttribute('disabled');
  quantityInput.removeAttribute('disabled');
  plusButton.removeAttribute('disabled');

  // 전체 비활성화 시키는 타입일 경우 (제품 체크를 해제했을 때 등)
  if (isDisableAll) {
    minusButton.setAttribute('disabled', '');
    quantityInput.setAttribute('disabled', '');
    plusButton.setAttribute('disabled', '');
    return;
  }

  // input칸 값을 업데이트하기 위한 변수 설정
  let quantityUpdate;
  if (isPlus) {
    quantityUpdate = +1;
  } else if (isMinus) {
    quantityUpdate = -1;
  } else if (isInput) {
    quantityUpdate = 0;
  } else {
    quantityUpdate = 0;
  }

  // input칸 값 업데이트
  const currentQuantity = parseInt(quantityInput.value);
  const newQuantity = currentQuantity + quantityUpdate;
  quantityInput.value = newQuantity;

  // 숫자는 1~99만 가능
  const isMin = newQuantity === 1;
  const isMax = newQuantity === 99;

  if (isMin) {
    minusButton.setAttribute('disabled', '');
  }

  if (isMax) {
    plusButton.setAttribute('disabled', '');
  }
}

// 전체선택 체크박스를, 현재 상황에 맞추어
// 체크 또는 언체크 상태로 만듦
async function updateAllSelectCheckbox() {
  const { ids, selectedIds } = await getFromDb('order', 'summary');

  const isOrderEmpty = ids.length === 0;
  const isAllItemSelected = ids.length === selectedIds.length;

  // 장바구니 아이템(제품) 수가 0이 아니고,
  // 또 전체 아이템들이 선택된 상태라면 체크함.
  if (!isOrderEmpty && isAllItemSelected) {
    allSelectCheckbox.checked = true;
  } else {
    allSelectCheckbox.checked = false;
  }
}
// 선택 시 삭제(비회원)
async function deleteSelectedItems() {
  const { selectedIds } = await getFromDb('order', 'summary');

  selectedIds.forEach((id) => deleteItem(id));
  window.location.href = './';
}

// 삭제(비회원)
async function deleteItem(id) {
  // indexedDB의 cart 목록에서 id를 key로 가지는 데이터를 삭제함.
  await deleteFromDb('cart', id);

  // 결제정보를 업데이트함.
  await updateOrderSummary(id, 'removePermanent-deleteButton');

  // 제품 요소(컴포넌트)를 페이지에서 제거
  document.querySelector(`#productItem-${id}`).remove();

  // 전체선택 체크박스를 업데이트함
  updateAllSelectCheckbox();

  window.location.href = './';
}

// 결제정보 카드 업데이트 및, indexedDB 업데이트를 진행함.
async function updateOrderSummary(id, type) {
  // 업데이트 방식 결정을 위한 변수들
  const isCheckbox = type.includes('checkbox');
  const isInput = type.includes('input');
  const isDeleteButton = type.includes('deleteButton');
  const isMinusButton = type.includes('minusButton');
  const isPlusButton = type.includes('plusButton');
  const isAdd = type.includes('add');
  const isRemoveTemp = type.includes('removeTemp');
  const isRemovePermanent = type.includes('removePermanent');
  const isRemove = isRemoveTemp || isRemovePermanent;
  const isItemChecked = document.querySelector(`#checkbox-${id}`).checked;
  const isDeleteWithoutChecked = isDeleteButton && !isItemChecked;

  // 업데이트에 사용될 변수
  let price;
  let quantity;

  // 체크박스 혹은 삭제 버튼 클릭으로 인한 업데이트임.
  if (isCheckbox || isDeleteButton) {
    const priceElem = document.querySelector(`#total-${id}`);
    price = convertToNumber(priceElem.innerText);

    quantity = 1;
  }

  // - + 버튼 클릭으로 인한 업데이트임.
  if (isMinusButton || isPlusButton) {
    const unitPriceElem = document.querySelector(`#unitPrice-${id}`);
    price = convertToNumber(unitPriceElem.innerText);

    quantity = 0;
  }

  // input 박스 입력으로 인한 업데이트임
  if (isInput) {
    const unitPriceElem = document.querySelector(`#unitPrice-${id}`);
    const unitPrice = convertToNumber(unitPriceElem.innerText);

    const inputElem = document.querySelector(`#quantityInput-${id}`);
    const inputQuantity = convertToNumber(inputElem.value);

    const quantityElem = document.querySelector(`#quantity-${id}`);
    const currentQuantity = convertToNumber(quantityElem.innerText);

    price = unitPrice * (inputQuantity - currentQuantity);

    quantity = 0;
  }

  // 업데이트 방식
  const priceUpdate = isAdd ? +price : -price;
  const countUpdate = isAdd ? +quantity : -quantity;

  // 현재 결제정보의 값들을 가져오고 숫자로 바꿈.
  const currentCount = convertToNumber(productsCountElem.innerText);
  const currentProductsTotal = convertToNumber(productsTotalElem.innerText);
  const currentFee = convertToNumber(deliveryFeeElem.innerText);
  const currentOrderTotal = convertToNumber(orderTotalElem.innerText);

  // 결제정보 관련 요소들 업데이트
  if (!isDeleteWithoutChecked) {
    productsCountElem.innerText = `${currentCount + countUpdate}개`;
    productsTotalElem.innerText = `${addCommas(currentProductsTotal + priceUpdate)}원`;
  }

  // 기존 결제정보가 비어있었어서, 배송비 또한 0인 상태였던 경우
  const isFeeAddRequired = isAdd && currentFee === 0;

  if (isFeeAddRequired) {
    deliveryFeeElem.innerText = `3000원`;
    orderTotalElem.innerText = `${addCommas(currentOrderTotal + priceUpdate + 3000)}원`;
  }

  if (!isFeeAddRequired && !isDeleteWithoutChecked) {
    orderTotalElem.innerText = `${addCommas(currentOrderTotal + priceUpdate)}원`;
  }

  // 이 업데이트로 인해 결제정보가 비게 되는 경우
  const isCartNowEmpty = currentCount === 1 && isRemove;

  if (!isDeleteWithoutChecked && isCartNowEmpty) {
    deliveryFeeElem.innerText = `0원`;

    // 다시 한 번, 현재 값을 가져와서 3000을 빼 줌
    const currentOrderTotal = convertToNumber(orderTotalElem.innerText);
    orderTotalElem.innerText = `${addCommas(currentOrderTotal - 3000)}원`;

    // 전체선택도 언체크되도록 함.
    updateAllSelectCheckbox();
  }

  // indexedDB의 order.summary 업데이트
  await putToDb('order', 'summary', (data) => {
    const hasId = data.selectedIds.includes(id);

    if (isAdd && !hasId) {
      data.selectedIds.push(id);
    }

    if (isRemoveTemp) {
      data.selectedIds = data.selectedIds.filter((_id) => _id !== id);
    }

    if (isRemovePermanent) {
      data.ids = data.ids.filter((_id) => _id !== id);
      data.selectedIds = data.selectedIds.filter((_id) => _id !== id);
    }

    if (!isDeleteWithoutChecked) {
      data.productsCount += countUpdate;
      data.productsTotal += priceUpdate;
    }
  });

  // 전체선택 체크박스 업데이트
  updateAllSelectCheckbox();
}

// 아이템(제품)카드의 수량, 금액 등을 업데이트함
async function updateProductItem(id, type) {
  // 업데이트 방식을 결정하는 변수들
  const isInput = type.includes('input');
  const isIncrease = type.includes('increase');

  // 업데이트에 필요한 요소 및 값들을 가져오고 숫자로 바꿈.
  const unitPriceElem = document.querySelector(`#unitPrice-${id}`);
  const unitPrice = convertToNumber(unitPriceElem.innerText);

  const quantityElem = document.querySelector(`#quantity-${id}`);
  const currentQuantity = convertToNumber(quantityElem.innerText);

  const totalElem = document.querySelector(`#total-${id}`);
  const currentTotal = convertToNumber(totalElem.innerText);

  const inputElem = document.querySelector(`#quantityInput-${id}`);
  const inputQuantity = convertToNumber(inputElem.value);

  // 업데이트 진행
  if (isInput) {
    quantityElem.innerText = `${inputQuantity}개`;
    totalElem.innerText = `${addCommas(unitPrice * inputQuantity)}원`;
    return;
  }

  const quantityUpdate = isIncrease ? +1 : -1;
  const priceUpdate = isIncrease ? +unitPrice : -unitPrice;

  quantityElem.innerText = `${currentQuantity + quantityUpdate}개`;
  totalElem.innerText = `${addCommas(currentTotal + priceUpdate)}원`;
}

// 페이지 로드 시 실행되며, 결제정보 카드에 값을 삽입함.
async function insertOrderSummary() {
  try {
    const { productsCount, productsTotal } = await getFromDb('order', 'summary');

    const hasItems = productsCount !== 0;

    productsCountElem.innerText = `${productsCount}개`;
    productsTotalElem.innerText = `${addCommas(productsTotal)}원`;

    if (hasItems) {
      deliveryFeeElem.innerText = `3,000원`;
      orderTotalElem.innerText = `${addCommas(productsTotal + 3000)}원`;
    } else {
      deliveryFeeElem.innerText = `0원`;
      orderTotalElem.innerText = `0원`;
    }
  } catch (err) {
    console.error(err.stack);
    if (err.message.includes('destructure')) {
      addEmptyHtml();
    }
  }
}
