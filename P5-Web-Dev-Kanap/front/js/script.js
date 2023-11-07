// Define the URL from which to fetch the product data .........................................................
const url = " http://localhost:3000/api/products"
const container = document.getElementById("items")


// Function to fetch and display the products ........................................................
const getProducts = () => {
    
// Fetch product data from the specified URL .........................................................
  fetch(url)
    .then (function(res){
      return res.json()
    })
    .then (function(data){

// display each product in the container .........................................................
      for(product in data){
        container.innerHTML += ` <a href="./product.html?id=${data[product]._id}">
          <article>
            <img src="${data[product].imageUrl}" alt="${data[product].altTxt}>
            <h3 class="productName">${data[product].name}</h3>
            <p class="productDescription">${data[product].description}</p>
            </article>
          </a>`
        }
  })
}

// Call the getProducts function to initiate fetching and displaying the products ........................................................
getProducts()




