document.addEventListener('DOMContentLoaded', () => {
    // --- Hamburger Menu ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const header = document.querySelector('header');

    if (hamburgerMenu && header) {
        hamburgerMenu.addEventListener('click', () => {
            header.classList.toggle('nav-open');
        });
    }

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

    // Get wishlist from local storage or initialize an empty array
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    const wishlistButtons = document.querySelectorAll('.wishlist-btn');

    // Function to update heart button states based on what's in localStorage
    function updateWishlistButtons() {
        wishlistButtons.forEach(button => {
            const productCard = button.closest('.product-card');
            if (!productCard) return;

            const productName = productCard.dataset.name;
            const isInWishlist = wishlist.some(item => item.name === productName);
            
            if (isInWishlist) {
                button.classList.add('added');
            } else {
                button.classList.remove('added');
            }
        });
    }

    // Toggles an item in the wishlist
    function toggleWishlistItem(product, button) {
        const productIndex = wishlist.findIndex(item => item.name === product.name);

        if (productIndex > -1) {
            // Item is in wishlist, so remove it
            wishlist.splice(productIndex, 1);
            button.classList.remove('added');
        } else {
            // Item is not in wishlist, so add it
            wishlist.push(product);
            button.classList.add('added');
        }

        // Save the updated wishlist to local storage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));

        // If on the wishlist page, re-render the list
        if (window.location.pathname.endsWith('wishlist.html')) {
            renderWishlist();
        }
    }

    // Add event listeners to new heart buttons
    wishlistButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const product = {
                    name: productCard.dataset.name,
                    price: productCard.dataset.price,
                    image: productCard.dataset.image,
                };
                toggleWishlistItem(product, e.target);
            }
        });
    });

    // Set initial state of heart buttons on page load
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

    // --- Checkout Page Summary ---
    function renderCheckoutSummary() {
        const summaryItems = document.querySelector('.order-summary-items');
        const summarySubtotal = document.getElementById('summary-subtotal');
        const summaryShipping = document.getElementById('summary-shipping');
        const summaryTotal = document.getElementById('summary-total');

        if (!summaryItems) return;

        // The cart is already loaded at the top of the script
        let subtotal = 0;
        
        summaryItems.innerHTML = ''; // Clear previous items

        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('order-summary-item');
            itemDiv.innerHTML = `
                <p>${item.name} (x${item.quantity})</p>
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
            `;
            summaryItems.appendChild(itemDiv);
        });

        const shippingCost = 5.00; // Fixed shipping cost
        const total = subtotal + shippingCost;

        summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
        summaryShipping.textContent = `$${shippingCost.toFixed(2)}`;
        summaryTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Render the checkout summary on the checkout page
    if (window.location.pathname.endsWith('checkout.html')) {
        renderCheckoutSummary();
    }

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
