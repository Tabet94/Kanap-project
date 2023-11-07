// retrievingitems and put it on cart variable ..............................
let cart = []
let orderId ;
let isValid;
let storedPrices = [];

// Function to retrieve items from local storage and populate the cart array .............................
function retrieveItemsFromCache() {
  const cachedCart = JSON.parse(localStorage.getItem("addToCart"));
  cart = cachedCart || [];
}

// Function to display a single cart item on the page .............................
const displayItem = (item) => {
  const article = makeArticle(item)
  const div = makeImageDiv(item)
  const cardItemContent = makeCardItemContent(item)
  const settingsDiv = makeSettingsDiv(item)


// Build the HTML structure for the cart item
  cardItemContent.appendChild(settingsDiv)
  article.appendChild(cardItemContent)
  article.appendChild(div)
  displayArticle(article) 
// Update total price and quantity after displaying the new item ...............................
  displayTotalPrice(item) 
  displayTotalQuantity(item)
}

// Function to handle the "Confirm Order" button click event ........................................
const confirmOrder = (event) => {
  event.preventDefault()
  console.log(event)
  if (cart.length === 0) {
    alert('Your Cart is Empty')
    return
  }

// // Create the request body based on the form data .................................
  const body = makeRequestBody()
  if (!isValid) {
    alert('invalid form')
    return;
  }

// // Send a POST request to the server with the order data ......................................
  fetch('http://localhost:3000/api/products/order', {

  method: 'post',
  body: JSON.stringify(body),
  headers: {
    'content-type': 'application/json',
  },
})

  .then((res) => res.json())
  .then((data) => {
    
    if (data.orderId !== '') {
      alert('Your order is confirmed')
      location.href = `confirmation.html?orderId=${data.orderId}`
    }
  })
}
  

// Function to create the request body from the form data ........................................
  const makeRequestBody = () => {
  const firstName = document.querySelector("#firstName").value
  const lastName = document.querySelector("#lastName").value
  const address = document.querySelector("#address").value
  const city = document.querySelector("#city").value
  const email = document.querySelector("#email").value

  const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg")
  const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg")
  const addressErrorMsg = document.querySelector("#addressErrorMsg")
  const cityErrorMsg = document.querySelector("#cityErrorMsg")
  const emailErrorMsg = document.querySelector("#emailErrorMsg")

  const nameRegex = /^[A-Za-z\s]+$/
  const cityRegex = /^[A-Za-z\s\-]+$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  isValid = true;
  firstNameErrorMsg.classList.add('hidden')
  lastNameErrorMsg.classList.add('hidden')
  addressErrorMsg.classList.add('hidden')
  cityErrorMsg.classList.add('hidden')
  emailErrorMsg.classList.add('hidden')


  if (firstName === "" || !nameRegex.test(firstName)) {
    firstNameErrorMsg.classList.remove("hidden");
    isValid = false;
  }

  if (lastName === "" || !nameRegex.test(lastName)) {
    lastNameErrorMsg.classList.remove("hidden");
    isValid = false;
  }

  if (address === "") {
    addressErrorMsg.classList.remove("hidden");
    isValid = false;
  }

  if (city === "" || !cityRegex.test(city)) {
    cityErrorMsg.classList.remove("hidden");
    isValid = false;
  }
  

  if (email === "" || !emailRegex.test(email)) {
    emailErrorMsg.classList.remove("hidden");
    isValid = false;
  }
  const getProductIds = cart.map((item) => item.id);
  return {
    contact: {
      firstName,
      lastName,
      address,
      city,
      email,
    },
  products: getProductIds,  
  }
}



// Function to display the total Quantity of all items in the cart .............................................
const displayTotalQuantity = (item) => {
  let totalQuantity = 0
  const totalQuantityElement = document.querySelector("#totalQuantity")
  cart.forEach((item) => {
    totalQuantity += parseInt(item.quantity)
  })
  totalQuantityElement.textContent = totalQuantity
}

// Function to display the total Price of all items in the cart ........................................................
const displayTotalPrice = (item) => {
  let total = 0;
  cart.forEach((item) => {
    const storedPrice = storedPrices.find((priceData) => priceData.id === item.id)
    if (storedPrice) {
      const totalUnitprice = storedPrice.price * item.quantity
      total += totalUnitprice
    }
  })

  const totalPrice = document.querySelector("#totalPrice")
  totalPrice.textContent = total
}



// Function to attach event listeners to quantity inputs and delete buttons ...............................................
const attachEventListeners = () => {
  const quantityInputs = document.querySelectorAll(".itemQuantity")
  const orderForm = document.querySelector(".cart__order__form")
  const deleteButtons = document.querySelectorAll(".deleteItem")
 
  orderForm.addEventListener("submit", confirmOrder)
  quantityInputs.forEach((input) => {
    input.addEventListener("change", updateQuantity)
  })

  
// Function to handle the "Delete" button click event ............................................
const deleteItem = (event) => {
  const button = event.target
  const article = button.closest(".cart__item")
  const itemId = article.dataset.id
  const itemColor = article.dataset.color

  const itemIndex = cart.findIndex(
    (item) => item.id === itemId && item.color === itemColor
  );

  if (itemIndex !== -1) {
    const deletedItem = cart[itemIndex]
    cart.splice(itemIndex, 1)
    saveCartToLocalStorage()

    article.remove()
    updateTotal()

    // Remove the deleted item's price from storedPrices array ...................................................
    const deletedItemId = deletedItem.id
    storedPrices = storedPrices.filter(priceData => priceData.id !== deletedItemId)

    displayTotalPrice()
    displayTotalQuantity()
  }
}


// Attach event listener to each delete button ............................................................
  deleteButtons.forEach((button) => {
    button.addEventListener("click", deleteItem)
  })
}


const saveCartToLocalStorage = () => {
  localStorage.setItem("addToCart", JSON.stringify(cart))
}

const updateQuantity = (event) => {
  const input = event.target
  const article = input.closest(".cart__item")
  const itemId = article.dataset.id
  const itemColor = article.dataset.color
  const quantity = parseInt(input.value)

  cart.forEach((item) => {
    if (item.id === itemId && item.color === itemColor) {
      item.quantity = quantity
    }
  })

  saveCartToLocalStorage()
  updateTotal (event) 
  
}
const updateTotal =(event) => {
  cart.forEach((item) => {
    displayTotalPrice(item)
    displayTotalQuantity(item)
  })
}
const displayArticle = (article) => {
  const cartItems = document.querySelector("#cart__items")
  cartItems.appendChild(article)
}

const makeArticle = (item) => {
  const article = document.createElement("article")
  article.classList.add("cart__item")
  article.dataset.id = item.id
  article.dataset.color = item.color
  return article;
}

const makeImageDiv = (item) => {
  const div = document.createElement("div")
  div.classList.add("cart__item__img")
  const image = document.createElement("img")
  image.src = item.imageUrl
  image.alt = item.altTxt
  console.log("Alt Text:", item.altTxt);
  div.appendChild(image)
  return div;
}

const makeCardItemContent = (item) => {
  const div = document.createElement("div")
  div.classList.add("cart__item__content")

  const description = document.createElement("div")
  description.classList.add("cart__item__content__description")
  
  const h2 = document.createElement("h2")
  h2.textContent = item.name
  
  const p = document.createElement("p")
  p.textContent = item.color
  

  const p2 = document.createElement("p")

  fetch(`http://localhost:3000/api/products/${item.id}`)
    .then((res) => res.json())
    .then((data) => {
    storedPrices.push({ id: item.id, price: data.price });
    displayTotalPrice();
    p2.textContent = data.price + '€';
    })

description.appendChild(h2);
description.appendChild(p);
description.appendChild(p2);
div.appendChild(description);

return div;
}



const makeSettingsDiv = (item) => {
  const settingsDiv = document.createElement("div")
  settingsDiv.classList.add("cart__item__content__settings")

  const quantityDiv = document.createElement("div")
  quantityDiv.classList.add("cart__item__content__settings__quantity")
  
  const quantityLabel = document.createElement("p")
  quantityLabel.textContent = "Quantity: "

  const quantityInput = document.createElement("input")
  quantityInput.type = "number"
  quantityInput.classList.add("itemQuantity")
  quantityInput.name = "itemQuantity"
  quantityInput.min = "1"
  quantityInput.max = "100"
  quantityInput.value = item.quantity
  

  quantityDiv.appendChild(quantityLabel)
  quantityDiv.appendChild(quantityInput)

  const deleteDiv = document.createElement("div")
  deleteDiv.classList.add("cart__item__content__settings__delete")

  const deleteItem = document.createElement("p")
  deleteItem.classList.add("deleteItem")
  deleteItem.textContent = "Delete"

  deleteDiv.appendChild(deleteItem)

  settingsDiv.appendChild(quantityDiv)
  settingsDiv.appendChild(deleteDiv)

  return settingsDiv
}


retrieveItemsFromCache()
cart.forEach(displayItem)
attachEventListeners()



