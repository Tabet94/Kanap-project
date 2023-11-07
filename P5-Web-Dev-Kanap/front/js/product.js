// Extract the "id" parameter from the current URL's query string .....................................
const params = new URL(document.location).searchParams;
const id = params.get("id");
let addProductLocalStorage = []

// Construct the URL for fetching a specific product based on the extracted "id" ........................................
const url = `http://localhost:3000/api/products/${id}`;

// Define a variable to store the fetched product data ......................................................
let product 

// Function to fetch and display a specific product ....................................................
const getProduct = () => {

  // Fetch product data from the specified URL
  fetch(url)
  .then (function(res) {
    return res.json()
  })
  .then (function(data){
    
  // Store the fetched product data in the "product" variable ..............................................
    product = data 

  // Add the product title, price, image, description, and color options to the page ...................................
    const addTitle = (document.getElementById("title").innerHTML=data.name)
    const addPrice = document.getElementById("price")
    fetch(`http://localhost:3000/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          addPrice.innerHTML = data.price 
          product.price = data.price
        })

    const addImg = document.createElement("img")
    document.querySelector(".item__img").appendChild(addImg)
    addImg.setAttribute("alt", data.name)
    addImg.setAttribute("src", `${data.imageUrl}`)
    const addDescription = (document.getElementById("description").innerHTML=data.description)
    const addOption = document.getElementById("colors")
    for(color in data.colors ) {
    addOption.innerHTML += `<option value="${data.colors[color]}">${data.colors[color]}</option>`
    }
  })
}

// Get the "Add to Cart" button element ...............................................................
const addToCart = document.getElementById("addToCart");

// Add a click event listener to the "Add to Cart" button ......................................................
addToCart.addEventListener("click", () => {

// Get the selected quantity and color
const quantity = + document.getElementById("quantity").value;
const color = document.getElementById("colors").value;

// Check if both quantity and color are selected .........................................................
  if (quantity<1 && !color) {
    alert("Please select quantity and color before adding to the cart.");
    return; 
  // Check if quantity is selected .................................................................
  }else if (quantity<1) {
    alert('add quantity')
    return
// Check if the color is selected ......................................................................
  } else if (!color ) {
    alert('select color')
    return;
  }

  // Create an object representing the selected product with quantity, color, and other details ........................................................
  const addProduct = {
    quantity: quantity,
    color: color,
    id: id,
    imageUrl: product.imageUrl,
    altTxt : product.altTxt,
    name: product.name
  }

// Initialize an array to store products in the cart, read from local storage if available .....................................................
if (localStorage.getItem("addToCart") !== null) {
  addProductLocalStorage = JSON.parse(localStorage.getItem("addToCart"));
}

// Check if the selected product already exists in the cart ............................................................
const productExistsInCart = addProductLocalStorage.find(
  (item) => item.id === id && item.color === color
);

if (productExistsInCart) {
  // If the selected product already exists in the cart, update its quantity ................................................................
  productExistsInCart.quantity += quantity;
} else {
  // If the selected product is not in the cart, add it to the cart array ....................................................
  addProductLocalStorage.push(addProduct);
}

// Update local storage with the latest cart data ...............................................
localStorage.setItem("addToCart", JSON.stringify(addProductLocalStorage));


window.location.href = "cart.html";
})


getProduct()



