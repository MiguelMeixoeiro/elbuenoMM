// script.js
const itemsPerPage = 5;
const productContainer = document.getElementById('product-container');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const currentPageSpan = document.getElementById('currentPage');
const cartCount = document.getElementById('cart');
const modal = document.getElementById('modal');
const closeModal = document.getElementsByClassName('close')[0];

let cartItems = 0;
let cartProducts = [];
const loadingGif = document.getElementById('loading-gif'); // Agregado para el GIF de carga
const additionalGif1 = document.getElementsByClassName('additional-gif1')[0];
const additionalGif2 = document.getElementsByClassName('additional-gif2')[0];

// Mostrar el GIF de carga antes de hacer la solicitud a la API
loadingGif.style.display = 'block';
additionalGif1.style.display = 'block';
additionalGif2.style.display = 'block';

fetch('http://makeup-api.herokuapp.com/api/v1/products.json')
  .then(response => response.json())
  .then(data => {
    // Ocultar el GIF de carga después de que se completa la solicitud de la API
    loadingGif.style.display = 'none';
    additionalGif1.style.display = 'none';
    additionalGif2.style.display = 'none';

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

        if (product.image_link) {
          productImage.src = product.image_link;

          productImage.onerror = function() {
            if (this.naturalWidth === 0 && this.naturalHeight === 0) {
              this.src = './nofoto.jpg';
            }
          };
        } else {
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
        if (typeof product.price !== 'undefined') {
          productPrice.textContent = `Precio: $${product.price}`;
        } else {
          productPrice.textContent = 'Precio no disponible';
        }

        productInfoDiv.appendChild(productName);
        productInfoDiv.appendChild(productBrand);
        productInfoDiv.appendChild(productPrice);

        productDiv.appendChild(productImage);
        productDiv.appendChild(productInfoDiv);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('buttons-container'); // Nuevo div para los botones

        const heartButton = document.createElement('button');
        heartButton.textContent = '♥';
        heartButton.classList.add('heart-button');
        buttonsContainer.appendChild(heartButton);

        const plusButton = document.createElement('button');
        plusButton.textContent = '+ info';
        plusButton.classList.add('plus-button');
        buttonsContainer.appendChild(plusButton);

        const cartButton = document.createElement('button');
        cartButton.textContent = '🛒';
        cartButton.classList.add('cart-button');
        buttonsContainer.appendChild(cartButton);

        productDiv.appendChild(buttonsContainer); // Agregamos el nuevo div de botones al producto

        productContainer.appendChild(productDiv);

        // Event listeners para los botones
        heartButton.addEventListener('click', () => toggleHeart(heartButton));
        plusButton.addEventListener('click', openModal);
        cartButton.addEventListener('click', () => {
          addToCart(product);
        });
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
  .catch(error => {
    // Ocultar el GIF de carga en caso de error
    loadingGif.style.display = 'none';
    console.error('Error al obtener datos de la API:', error);
  });

// ... (resto del código)

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
  cartProducts.push(product);

  cartCount.textContent = `🛒: ${cartItems}`;
}

// Event listener para el botón de carrito en el footer
cartCount.addEventListener('click', () => {
  openCartPage();
});

// Función para abrir la página del carrito
function openCartPage() {
  localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
  window.location.href = 'carrito.html';
};
