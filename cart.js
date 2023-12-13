// cart.js

const cartProductsContainer = document.getElementById('cart-products-container');
const totalAmountContainer = document.getElementById('total-amount');

// Obtener la lista de productos en el carrito desde localStorage
const cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];

// Mostrar productos en el carrito
function displayCartProducts() {
  cartProductsContainer.innerHTML = '';
  let totalAmount = 0;

  cartProducts.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    const productImage = document.createElement('img');
    productImage.src = product.image_link || './nofoto.jpg';
    productImage.alt = product.name;

    const productName = document.createElement('h2');
    productName.textContent = product.name;

    const productPrice = document.createElement('p');
    if (typeof product.price !== 'undefined') {
      productPrice.textContent = `Precio: $${product.price}`;
      totalAmount += parseFloat(product.price); // Convertir a número y sumar al total
    } else {
      productPrice.textContent = 'Precio no disponible';
    }

    productDiv.appendChild(productImage);
    productDiv.appendChild(productName);
    productDiv.appendChild(productPrice);

    cartProductsContainer.appendChild(productDiv);
  });

  // Mostrar el total
  totalAmountContainer.textContent = `Total: $${totalAmount.toFixed(2)}`;
}

// Muestra los productos en el carrito al cargar la página
displayCartProducts();
