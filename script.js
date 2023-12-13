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

        // Intenta cargar la imagen desde la API
        if (product.image_link) {
          // Intenta cargar la imagen desde la API
          productImage.src = product.image_link;

          // Manejar el evento de error de carga de la imagen
          productImage.onerror = function() {
            // Verificar si el error es 404
            if (this.naturalWidth === 0 && this.naturalHeight === 0) {
              // Si hay un error 404 al cargar la imagen desde la API, usa la imagen local predeterminada
              this.src = './nofoto.jpg';
            }
          };
        } else {
          // Si no se proporciona un enlace de imagen, usa la imagen local predeterminada
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
        // Event listener para el botón de carrito dentro del div de información del producto
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
  // Puedes agregar más lógica aquí, como almacenar el producto en una lista de carrito.
}

// Event listener para el botón de carrito en el footer
cartCount.addEventListener('click', () => {
  openCartPage();
});

// Función para abrir la página del carrito
function openCartPage() {
  // Almacena la lista de productos en el carrito en localStorage
  localStorage.setItem('cartProducts', JSON.stringify(cartProducts));

  // Redirige a la página del carrito
  window.location.href = 'carrito.html';
};
