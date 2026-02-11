// Checkout functionality

// Render order summary
function renderOrderSummary() {
    const cart = getCart();
    const orderSummary = document.getElementById('order-summary');

    if (!orderSummary) return;

    if (cart.length === 0) {
        orderSummary.innerHTML = '<p>Your cart is empty. <a href="menu.html">Browse menu</a></p>';
        return;
    }

    const subtotal = calculateCartTotal();
    const deliveryFee = subtotal > 25 ? 0 : 2.99; // Free delivery over $25
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + deliveryFee + tax;

    orderSummary.innerHTML = `
        <h3>Order Summary</h3>
        ${cart.map(item => `
            <div class="order-item">
                <span>${item.name} x${item.quantity}</span>
                <span>${formatPrice(item.price * item.quantity)}</span>
            </div>
        `).join('')}
        <div class="order-item">
            <span>Subtotal</span>
            <span>${formatPrice(subtotal)}</span>
        </div>
        <div class="order-item">
            <span>Delivery Fee</span>
            <span>${formatPrice(deliveryFee)}</span>
        </div>
        <div class="order-item">
            <span>Tax</span>
            <span>${formatPrice(tax)}</span>
        </div>
        <div class="order-total">
            <span>Total</span>
            <span>${formatPrice(total)}</span>
        </div>
    `;

    // Store total for checkout
    localStorage.setItem('orderTotal', total);
}

// Handle checkout form submission
function handleCheckout(e) {
    e.preventDefault();

    const cart = getCart();
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    if (!isLoggedIn()) {
        showNotification('Please login to place an order.', 'error');
        window.location.href = 'login.html';
        return;
    }

    // Get form data
    const formData = new FormData(e.target);
    const deliveryInfo = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        zipCode: formData.get('zipCode'),
        instructions: formData.get('instructions')
    };

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'zipCode'];
    const missingFields = requiredFields.filter(field => !deliveryInfo[field]);

    if (missingFields.length > 0) {
        showNotification(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
        return;
    }

    if (!validateEmail(deliveryInfo.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }

    // Create order
    const order = {
        id: generateId(),
        items: cart,
        deliveryInfo: deliveryInfo,
        total: parseFloat(localStorage.getItem('orderTotal')),
        status: 'pending',
        date: new Date().toISOString()
    };

    // Add order to user's history
    addOrderToHistory(order);

    // Clear cart
    clearCart();

    // Store order for confirmation page (if exists)
    localStorage.setItem('lastOrder', JSON.stringify(order));

    showNotification('Order placed successfully!');
    window.location.href = 'orders.html';
}

// Render orders history
function renderOrdersHistory() {
    const orders = getUserOrderHistory();
    const ordersContainer = document.getElementById('orders-container');

    if (!ordersContainer) return;

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p>You haven\'t placed any orders yet.</p>';
        return;
    }

    ordersContainer.innerHTML = orders.reverse().map(order => `
        <div class="order-card">
            <h3>Order #${order.id.slice(-8)}</h3>
            <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${capitalize(order.status)}</p>
            <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
            <p><strong>Items:</strong></p>
            <ul>
                ${order.items.map(item => `<li>${item.name} x${item.quantity}</li>`).join('')}
            </ul>
            <p><strong>Delivery Address:</strong> ${order.deliveryInfo.address}, ${order.deliveryInfo.city}</p>
        </div>
    `).join('');
}

// Initialize checkout functionality
document.addEventListener('DOMContentLoaded', function() {
    // Render order summary on checkout page
    if (document.getElementById('order-summary')) {
        renderOrderSummary();
    }

    // Handle checkout form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    // Render orders on orders page
    if (document.getElementById('orders-container')) {
        renderOrdersHistory();
    }
});

// Helper functions (fallback if not loaded from utils/cart/auth)
if (typeof getCart === 'undefined') {
    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }
}

if (typeof calculateCartTotal === 'undefined') {
    function calculateCartTotal() {
        const cart = getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}

if (typeof clearCart === 'undefined') {
    function clearCart() {
        localStorage.setItem('cart', JSON.stringify([]));
        if (typeof updateCartCount !== 'undefined') updateCartCount();
    }
}

if (typeof isLoggedIn === 'undefined') {
    function isLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    }
}

if (typeof addOrderToHistory === 'undefined') {
    function addOrderToHistory(order) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        const users = JSON.parse(localStorage.getItem('foodieUsers')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex !== -1) {
            if (!users[userIndex].orders) {
                users[userIndex].orders = [];
            }
            users[userIndex].orders.push(order);
            localStorage.setItem('foodieUsers', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
    }
}

if (typeof getUserOrderHistory === 'undefined') {
    function getUserOrderHistory() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return currentUser ? currentUser.orders || [] : [];
    }
}

if (typeof formatPrice === 'undefined') {
    function formatPrice(price) {
        return `$${price.toFixed(2)}`;
    }
}

if (typeof validateEmail === 'undefined') {
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

if (typeof generateId === 'undefined') {
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

if (typeof capitalize === 'undefined') {
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

if (typeof showNotification === 'undefined') {
    function showNotification(message, type = 'info') {
        alert(message);
    }
}

// Make functions globally available
window.renderOrderSummary = renderOrderSummary;
window.handleCheckout = handleCheckout;
window.renderOrdersHistory = renderOrdersHistory;
