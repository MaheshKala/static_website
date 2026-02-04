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
