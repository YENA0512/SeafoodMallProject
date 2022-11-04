import { addCommas } from '../useful-functions.js';
const itemContainer = document.querySelector('#products_item');
const productPrice = document.querySelector('#price');
const discountPrice = document.querySelector('#price_discount');
const shippingPrice = document.querySelector('#price_shipping');
const totalPrice = document.querySelector('#price_total');

// localStorage에서 상품 리스트 가져오기
const insertProductsfromCart = async () => {
  const cartProducts = localStorage.getItem('cart');

  const products = JSON.parse(cartProducts);

  if (cartProducts !== null) {
    await products.forEach((product) => {
      console.log(products);
      const id = product.id;
      const title = product.title;
      const quantity = product.quantity;
      const image = product.image;
      const price = product.price;

      itemContainer.insertAdjacentHTML(
        'beforeend',
        `<div class="item_container">
    <div>
      <input class="form-check-input" type="checkbox" value="" id="select_check_${id}" />
    </div>
    <div class="image">
      <figure>
        <img class="product_image" src="${image}" alt="상품이미지" id="image_${id}" 
      }/>
      </figure>
    </div>
    <div class="content">
      <div id="title_${id}">
        <p>${title}</p>
      </div>
      <div class="quantity">
        <button class="btn" id="minus_${id}">-</button>
        <input type="number" class="quantity_input" min="1" max="99" value="1"/>
        <button class="btn" id="plus_${id}">+</button>
      </div>
      <div class="calculation">
        <p id="product_price_${id}">${addCommas(price * quantity)}원</p>
      </div>
      <div class="delete">
        <button class="btn" id="delete_${id}">X</button>
      </div>
    </div>
    </div>`,
      );
      //   // 이벤트 추가
      //   document.querySelector(`#delete_${id}`).addEventListener('click', () => deleteItem(id));

      //   document.querySelector(`#checkbox_${id}`).addEventListener('change', () => toggleItem(id));

      //   //   document
      //   //     .querySelector(`#image_${_id}`)
      //   //     .addEventListener('click', navigate(`/product/detail?id=${id}`));

      //   //   document
      //   //     .querySelector(`#title_${id}`)
      //   //     .addEventListener('click', navigate(`/product/detail?id=${id}`));

      //   document
      //     .querySelector(`#plus_${id}`)
      //     .addEventListener('click', () => increaseItemQuantity(id));

      //   document
      //     .querySelector(`#minus_${id}`)
      //     .addEventListener('click', () => decreaseItemQuantity(id));

      //   document
      //     .querySelector(`#quantityInput_${id}`)
      //     .addEventListener('change', () => handleQuantityInput(id));
    });
  }
};

// 상품 가격 계산하기
const insertOrderfromCart = async () => {
  const cartProducts = localStorage.getItem('cart');

  const products = JSON.parse(cartProducts);

  if (cartProducts !== null) {
    await products.forEach((product) => {
      console.log(products);
      const price = product.price;
      const discountprice = product.discountprice;
      const shippingprice = product.shippingprice;

      productPrice.innerText = `${addCommas(price)}원`;
      discountPrice.innerText = `-${addCommas(discountprice)}원`;
      shippingPrice.innerText = `${addCommas(shippingprice)}원`;
      totalPrice.innerText = `${addCommas(price - discountprice + shippingprice)}원`;
    });
  }
};

insertOrderfromCart();
insertProductsfromCart();
