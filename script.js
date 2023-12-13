// script.js

const itemsPerPage = 5;
const productContainer = document.getElementById('product-container');
const paginationContainer = document.getElementById('pagination-container');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const currentPageSpan = document.getElementById('currentPage');
const cartCount = document.getElementById('cart');
const modal = document.getElementById('modal');
const closeModal = document.getElementsByClassName('close')[0];

let cartItems = 0;

fetch('http://makeup-api.herokuapp.com/api/v1/products.json')
  .then(response => response.json())
  .then(data => {
    console.log('Data from API:', data);

    let currentPage = 1;

    function displayProducts(page) {
      console.log('Displaying products for page:', page);

      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      const productsToShow = data.slice(startIndex, endIndex);

      productContainer.innerHTML = '';

      productsToShow.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        const productImage = document.createElement('img');

        // Intenta cargar la imagen desde la API
        if (product.image_link) {
          productImage.src = product.image_link;
        } else {
          // Si no se puede cargar desde la API, usa una imagen local predeterminada
          productImage.src = './nofoto.jpg';
        }

        productImage.alt = product.name;

        const productInfoDiv = document.createElement('div');
        productInfoDiv.classList.add('product-info');

        const productName = document.createElement('h2');
        productName.textContent = product.name;

        const productBrand = document.createElement('p');
        productBrand.textContent = `Marca: ${product.brand}`;

        const productPrice = document.createElement('p');
        const randomPrice = Math.floor(Math.random() * (100 - 10 + 1) + 10);
        productPrice.textContent = `Precio: $${randomPrice.toFixed(2)}`;

        productInfoDiv.appendChild(productName);
        productInfoDiv.appendChild(productBrand);
        productInfoDiv.appendChild(productPrice);

        productDiv.appendChild(productImage);
        productDiv.appendChild(productInfoDiv);

        const heartButton = document.createElement('button');
        heartButton.textContent = '♥';
        heartButton.classList.add('heart-button');
        productDiv.appendChild(heartButton);

        const plusButton = document.createElement('button');
        plusButton.textContent = '+ info';
        plusButton.classList.add('plus-button');
        productDiv.appendChild(plusButton);

        const cartButton = document.createElement('button');
        cartButton.textContent = '🛒';
        cartButton.classList.add('cart-button');
        productDiv.appendChild(cartButton);

        productContainer.appendChild(productDiv);

        // Event listeners para los botones
        heartButton.addEventListener('click', () => toggleHeart(heartButton));
        plusButton.addEventListener('click', openModal);
        cartButton.addEventListener('click', () => addToCart(product));
      });

      const totalPages = Math.ceil(data.length / itemsPerPage);
      currentPageSpan.textContent = page;

      prevPageBtn.disabled = page === 1;
      nextPageBtn.disabled = page === totalPages;
    }

    function updatePage(direction) {
      currentPage += direction;
      displayProducts(currentPage);
    }

    prevPageBtn.addEventListener('click', () => updatePage(-1));
    nextPageBtn.addEventListener('click', () => updatePage(1));

    displayProducts(currentPage);
  })
  .catch(error => console.error('Error al obtener datos de la API:', error));

// Función para cambiar el estado del corazón
function toggleHeart(heartButton) {
  heartButton.classList.toggle('filled');
}

// Función para abrir el modal
function openModal() {
  modal.style.display = 'block';
}

// Event listener para cerrar el modal
closeModal.onclick = function() {
  modal.style.display = 'none';
};

// Función para agregar al carrito
function addToCart(product) {
  cartItems++;
  cartCount.textContent = `Carrito: ${cartItems}`;
  // Puedes agregar más lógica aquí, como almacenar el producto en una lista de carrito.
}
