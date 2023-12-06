const productList = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");
let productData = [];
const cartList = document.querySelector(".shoppingCart-tableList");
// productList.innerHTML = str;
function init() {
  getProductList();
}
init();
function getProductList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/products`
    )
    .then(function (response) {
      productData = response.data.products;
      renderProductList();
    });
}
// 商品
function combineProductHTMLItem(item) {
  return ` <li class="productCard">
        <h4 class="productType">新品</h4>
        <img
          src=${item.images}
          alt=""
        />
        <a href="#" class="addCardBtn js-addCart" data-id=${item.id}>加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$${item.origin_price}</del>
        <p class="nowPrice">NT$${item.price}</p>
        </li>`;
}
function renderProductList() {
  let str = "";
  productData.forEach(function (item) {
    str += combineProductHTMLItem(item);
  });
  productList.innerHTML = str;
}
// 清單列表
productSelect.addEventListener("change", function (e) {
  const category = e.target.value;
  if (category == "全部") {
    renderProductList();
    return;
  }
  let str = "";
  productData.forEach(function (item) {
    if (item.category == category) {
      str += combineProductHTMLItem(item);
    }
  });
  productList.innerHTML = str;
});
// 加入購物車
productList.addEventListener("click", function (e) {
  // 取消預設
  e.preventDefault();
  let addCartClass = e.target.getAttribute("class");

  if (addCartClass !== "addCardBtn js-addCart") {
    return;
  }
  let productId = e.target.getAttribute("data-id");
  let numCheck = 1;
  cartData.forEach(function (item) {
    if (item.product.id === productId) {
      numCheck = item.quantity += 1;
    }
  });
  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`,
      {
        data: {
          productId: productId,
          quantity: numCheck,
        },
      }
    )
    .then(function (response) {
      alert("加入購物車");
      getCartList();
    });
});
getCartList();
// 取得購物車
function getCartList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`
    )
    .then(function (response) {
      document.querySelector(".js-total").textContent =
        response.data.finalTotal;
      cartData = response.data.carts;
      let str = "";
      cartData.forEach(function (item) {
        str += `<tr>
        <td>
          <div class="cardItem-title">
            <img src=${item.product.images} alt="" />
            <p>${item.product.title}</p>
          </div>
        </td>
        <td>NT$${item.product.price}</td>
        <td>${item.quantity}</td>
        <td>NT$${item.product.price * item.quantity}</td>

        <td class="discardBtn">
          <a href="#" class="material-icons" data-id=${item.id}> clear </a>
        </td>
      </tr>`;
      });

      cartList.innerHTML = str;
    });
}
// 刪除單筆商品
cartList.addEventListener("click", function (e) {
  e.preventDefault();
  const cartId = e.target.getAttribute("data-id");
  if (cartId == null) {
    return;
  }
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts/${cartId}`
    )
    .then(function (response) {
      alert("刪除單筆購物車成功");
      getCartList();
    });
});
const discardAllBtn = document.querySelector(".discardAllBtn");
// 刪除整個購物車
discardAllBtn.addEventListener("click", function (e) {
  e.preventDefault();
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`
    )
    .then(function (response) {
      alert("刪除全部購物車成功");
      getCartList();
    })
    .catch(function (response) {
      alert("部購物車已清空，請勿重複點擊");
    });
});

// 預定表單
const orderInfBtn = document.querySelector(".orderInfo-btn");
orderInfBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (cartData.length == 0) {
    alert("請加入購物車");
    return;
  }
  const customerName = document.querySelector("#customerName").value;
  const customerPhone = document.querySelector("#customerPhone").value;
  const customerEmail = document.querySelector("#customerEmail").value;
  const customerAddress = document.querySelector("#customerAddress").value;
  const tradeWay = document.querySelector("#tradeWay").value;
  if (
    customerName == "" ||
    customerPhone == "" ||
    customerEmail == "" ||
    customerAddress == "" ||
    tradeWay == ""
  ) {
    alert("請輸入訂單資訊");
    return;
  }
  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/orders`,
      {
        data: {
          user: {
            name: customerName,
            tel: customerPhone,
            email: customerEmail,
            address: customerAddress,
            payment: tradeWay,
          },
        },
      }
    )
    .then(function (e) {
      alert("建立訂單成功");
      getCartList();
    });
  document.querySelector(".orderInfo-form").reset();
});
