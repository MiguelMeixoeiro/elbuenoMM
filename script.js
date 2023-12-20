const itemsPerPage = 5;
const productContainer = document.getElementById('product-container');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const currentPageSpan = document.getElementById('currentPage');
const cartCount = document.getElementById('cart');
const modal = document.getElementById('modal');
const closeModal = document.getElementsByClassName('close')[0];
const loadingGif = document.getElementById('loading-gif');
const additionalGif1 = document.getElementsByClassName('additional-gif1')[0];
const additionalGif2 = document.getElementsByClassName('additional-gif2')[0];
const wishlistButton = document.createElement('button');


document.querySelector('.nav-icons .fa-heart').addEventListener('click', () => {
    openWishlistModal();
});

function openWishlistModal() {
    const wishlistContent = wishlist.length > 0
        ? wishlist.map(product => `<p>${product.name}</p>`).join('')
        : 'Tu wishlist está vacía';

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Wishlist</h2>
            ${wishlistContent}
        </div>
    `;

    modal.style.display = 'block';
}



let cartItems = 0;
let cartProducts = [];
let wishlist = [];

loadingGif.style.display = 'block';
additionalGif1.style.display = 'block';
additionalGif2.style.display = 'block';

fetch('http://makeup-api.herokuapp.com/api/v1/products.json')
    .then(response => response.json())
    .then(data => {
        loadingGif.style.display = 'none';
        additionalGif1.style.display = 'none';
        additionalGif2.style.display = 'none';

        console.log('Data from API:', data);

        let currentPage = 1;

        function displayProducts(page) {
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
                buttonsContainer.classList.add('buttons-container');

                const heartButton = document.createElement('button');
                heartButton.textContent = '♥';
                heartButton.classList.add('heart-button');

                // Verificar si el producto está en la wishlist
                if (wishlist.some(item => item.id === product.id)) {
                    heartButton.classList.add('filled');
                }

                buttonsContainer.appendChild(heartButton);

                const plusButton = document.createElement('button');
                plusButton.textContent = '+ info';
                plusButton.classList.add('plus-button');
                buttonsContainer.appendChild(plusButton);

                const cartButton = document.createElement('button');
                cartButton.textContent = '🛒';
                cartButton.classList.add('cart-button');
                buttonsContainer.appendChild(cartButton);

                productDiv.appendChild(buttonsContainer);
                productContainer.appendChild(productDiv);

                heartButton.addEventListener('click', () => toggleHeart(heartButton, product));
                plusButton.addEventListener('click', openModal);
              
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
        loadingGif.style.display = 'none';
        console.error('Error al obtener datos de la API:', error);
    });

function toggleHeart(heartButton, product) {
    heartButton.classList.toggle('filled');

    const productIndex = wishlist.findIndex(item => item.id === product.id);

    if (heartButton.classList.contains('filled')) {
        if (productIndex === -1) {
            wishlist.push(product);
        }
    } else {
        if (productIndex !== -1) {
            wishlist.splice(productIndex, 1);
        }
    }
}

function openModal(product) {
    const productInfoContent = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Información Adicional</h2>
            <p>Nombre: ${product.name}</p>
            <p>Marca: ${product.brand}</p>
            <p>Precio: ${typeof product.price !== 'undefined' ? `$${product.price}` : 'Precio no disponible'}</p>
            <p>Otra información relevante...</p>
        </div>
    `;

    modal.innerHTML = productInfoContent;
    modal.style.display = 'block';
}



function addToCart(product) {
    cartItems++;
    cartProducts.push(product);
    cartCount.textContent = `🛒: ${cartItems}`;
}


document.getElementById('cartButton').addEventListener('click', function() {
    window.location.href = 'carrito.html';
});

function openCartPage() {
    localStorage.setItem('cartButton', JSON.stringify(cartProducts));
    window.location.href = 'carrito.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const heartIcon = document.querySelector('.nav-icons a.nav-link i.fas.fa-heart');

    if (heartIcon) {
        heartIcon.addEventListener('click', () => {
            openWishlistModal();
        });
    } else {
        console.error('No se encontró el elemento con la clase .nav-icons a.nav-link i.fas.fa-heart');
    }
});

function openAdditionalInfoModal(product) {
    const additionalInfoContent = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Información Adicional</h2>
            <p>Nombre: ${product.name}</p>
            <p>Marca: ${product.brand}</p>
            <p>Precio: ${typeof product.price !== 'undefined' ? `$${product.price}` : 'Precio no disponible'}</p>
            <p>Otra información relevante...</p>
        </div>
    `;

    modal.innerHTML = additionalInfoContent;
    modal.style.display = 'block';
}
// function closeModal() {
//     modal.style.display = 'none';
// }