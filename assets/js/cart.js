// Cart management functionality

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Add item to cart
function addToCart(itemId, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        const menuItem = menuItems.find(item => item.id === itemId);
        if (menuItem) {
            cart.push({
                id: menuItem.id,
                name: menuItem.name,
                price: menuItem.price,
                image: menuItem.image,
                quantity: quantity
            });
        }
    }

    saveCart(cart);
    showNotification(`${quantity} item(s) added to cart!`);
}

// Remove item from cart
function removeFromCart(itemId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== itemId);
    saveCart(updatedCart);
    showNotification('Item removed from cart!');
}

// Update item quantity in cart
function updateCartItemQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(itemId);
        return;
    }

    const cart = getCart();
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
    }
}

// Calculate cart total
function calculateCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Clear cart
function clearCart() {
    saveCart([]);
    showNotification('Cart cleared!');
}

// Get cart item count
function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Update cart count in header (if main.js is loaded)
function updateCartCount() {
    const count = getCartItemCount();
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// Render cart items (for cart.html)
function renderCartItems() {
    const cart = getCart();
    const cartContainer = document.getElementById('cart-items');

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        updateCartTotal();
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${formatPrice(item.price)}</p>
                <div class="quantity-controls">
                    <button onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    updateCartTotal();
}

// Update cart total display
function updateCartTotal() {
    const total = calculateCartTotal();
    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
        totalElement.textContent = `Total: ${formatPrice(total)}`;
    }
}

// Initialize cart on page load (for cart.html)
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('cart-items')) {
        renderCartItems();
    }
});

// Helper functions (fallback if not loaded from utils)
if (typeof formatPrice === 'undefined') {
    function formatPrice(price) {
        return `$${price.toFixed(2)}`;
    }
}

if (typeof showNotification === 'undefined') {
    function showNotification(message, type = 'info') {
        alert(message);
    }
}

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.clearCart = clearCart;
window.getCartItemCount = getCartItemCount;
window.calculateCartTotal = calculateCartTotal;
