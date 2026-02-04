document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.btn[href="#"]');
    const cartTableBody = document.querySelector('.cart-table tbody');
    const cartTotalElement = document.querySelector('.cart-total p strong');

    // Get cart from local storage or initialize an empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to add item to cart
    function addToCart(product) {
        // Check if product is already in cart
        const existingProductIndex = cart.findIndex(item => item.name === product.name);
        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }
        // Save to local storage
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} has been added to your cart.`);
    }

    // Function to render cart items
    function renderCart() {
        if (!cartTableBody) return;
        cartTableBody.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${itemTotal.toFixed(2)}</td>
                <td><button class="remove-btn" data-index="${index}">Remove</button></td>
            `;
            cartTableBody.appendChild(row);
        });

        if (cartTotalElement) {
            cartTotalElement.textContent = `$${total.toFixed(2)}`;
        }

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                removeFromCart(index);
            });
        });
    }

    // Function to remove item from cart
    function removeFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    // Add to cart event listeners
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const product = {
                    name: productCard.querySelector('h3').textContent,
                    price: parseFloat(productCard.querySelector('p').textContent.replace('$', '')),
                    image: productCard.querySelector('img').src,
                };
                addToCart(product);
            }
        });
    });

    // Render the cart on the cart page
    if (window.location.pathname.endsWith('cart.html')) {
        renderCart();
    }

    // --- Wishlist Functionality ---

    const addToWishlistButtons = document.querySelectorAll('.add-to-wishlist');

    // Get wishlist from local storage or initialize an empty array
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Function to update wishlist buttons based on what's in localStorage
    function updateWishlistButtons() {
        addToWishlistButtons.forEach(button => {
            const productCard = button.closest('.product-card');
            if (!productCard) return;
            const productName = productCard.dataset.name;
            const isInWishlist = wishlist.some(item => item.name === productName);
            if (isInWishlist) {
                button.textContent = 'Added to Wishlist';
                button.disabled = true;
            }
        });
    }

    // Function to add item to wishlist
    function addToWishlist(product) {
        const existingProduct = wishlist.find(item => item.name === product.name);
        if (existingProduct) {
            alert(`${product.name} is already in your wishlist.`);
        } else {
            wishlist.push(product);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            alert(`${product.name} has been added to your wishlist.`);
            return true; // Indicate success
        }
        return false; // Indicate failure or duplicate
    }

    // Add to wishlist event listeners
    addToWishlistButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const product = {
                    name: productCard.dataset.name,
                    price: productCard.dataset.price,
                    image: productCard.dataset.image,
                };
                
                if (addToWishlist(product)) {
                    e.target.textContent = 'Added to Wishlist';
                    e.target.disabled = true;
                }
            }
        });
    });

    // Check button states on page load
    updateWishlistButtons();

    // --- End Wishlist Functionality ---

    // --- Wishlist Page Rendering ---

    function renderWishlist() {
        const wishlistContainer = document.querySelector('.wishlist-container');
        if (!wishlistContainer) return;

        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

        wishlistContainer.innerHTML = ''; // Clear existing content

        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
            return;
        }

        const wishlistGrid = document.createElement('div');
        wishlistGrid.className = 'product-grid'; // Reuse the product grid styling

        wishlist.forEach((item, index) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            // The image path was saved from either the root (index.html) or from pages/.
            // This ensures the path is always correct relative to the pages/wishlist.html file.
            const imagePath = item.image.startsWith('images/') ? `../${item.image}` : item.image;

            productCard.innerHTML = `
                <img src="${imagePath}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.price}</p>
                <button class="btn remove-from-wishlist" data-index="${index}">Remove</button>
            `;
            wishlistGrid.appendChild(productCard);
        });

        wishlistContainer.appendChild(wishlistGrid);

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-from-wishlist').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                removeFromWishlist(index);
            });
        });
    }

    function removeFromWishlist(index) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        renderWishlist(); // Re-render the wishlist to reflect removal
    }

    // Render wishlist on the wishlist page
    if (window.location.pathname.endsWith('wishlist.html')) {
        renderWishlist();
    }

    // --- End Wishlist Page Rendering ---

    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you shortly.');
            contactForm.reset();
        });
    }

    // Handle checkout form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Clear cart after checkout
            localStorage.removeItem('cart');
            window.location.href = 'order-confirmation.html';
        });
    }
});
