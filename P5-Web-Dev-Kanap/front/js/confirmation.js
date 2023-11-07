let url = new URLSearchParams(document.location.search);

let id = url.get("orderId");
const orderIdElement = document.querySelector("#orderId")


if (orderIdElement) {
  window.onload = function (event)  {
    orderIdElement.innerHTML = id
    }
}

localStorage.clear();
