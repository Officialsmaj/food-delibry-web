// Checkout functionality with API integration

const API_BASE = 'http://localhost:3001/api';

// Render order summary
async function renderOrderSummary() {
    const cart = await getCart();
    const orderSummary = document.getElementById('order-summary');

    if (!orderSummary) return;

    if (cart.length === 0) {
        orderSummary.innerHTML = '<p>Your cart is empty. <a href="menu.html">Browse menu</a></p>';
        return;
    }

    const subtotal = await calculateCartTotal();
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
async function handleCheckout(e) {
    e.preventDefault();

    const cart = await getCart();
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

    // Calculate total
    const subtotal = await calculateCartTotal();
    const deliveryFee = subtotal > 25 ? 0 : 2.99;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;

    try {
        // Create order via API
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                items: cart,
                total: total,
                paymentMethod: 'card' // Default for now
            })
        });

        if (response.ok) {
            const order = await response.json();
            // Clear cart
            // Note: Cart clearing would be handled by the API in a real implementation
            showNotification('Order placed successfully!');
            window.location.href = 'orders.html';
        } else {
            showNotification('Failed to place order', 'error');
        }
    } catch (error) {
        showNotification('Network error', 'error');
    }
}

// Render orders history
async function renderOrdersHistory() {
    try {
        const response = await fetch(`${API_BASE}/orders`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const orders = response.ok ? await response.json() : [];
        const ordersContainer = document.getElementById('orders-container');

        if (!ordersContainer) return;

        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p>You haven\'t placed any orders yet.</p>';
            return;
        }

        ordersContainer.innerHTML = orders.reverse().map(order => `
            <div class="order-card">
                <h3>Order #${order.id}</h3>
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${capitalize(order.status)}</p>
                <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
                <p><strong>Items:</strong></p>
                <ul>
                    ${order.items.map(item => `<li>${item.name} x${item.quantity}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching orders:', error);
        const ordersContainer = document.getElementById('orders-container');
        if (ordersContainer) {
            ordersContainer.innerHTML = '<p>Error loading orders.</p>';
        }
    }
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
    async function getCart() {
        try {
            const response = await fetch(`${API_BASE}/cart`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            return response.ok ? await response.json() : [];
        } catch (error) {
            return [];
        }
    }
}

if (typeof calculateCartTotal === 'undefined') {
    async function calculateCartTotal() {
        const cart = await getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}

if (typeof clearCart === 'undefined') {
    function clearCart() {
        // Cart clearing via API not implemented yet
        showNotification('Clear cart not implemented yet');
    }
}

if (typeof isLoggedIn === 'undefined') {
    function isLoggedIn() {
        return !!localStorage.getItem('token');
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

// Setup Stripe payment form
function setupPaymentForm() {
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');

    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Create payment intent
        const response = await fetch(`${API_BASE}/payments/create-payment-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ amount: localStorage.getItem('orderTotal') * 100 }) // Amount in cents
        });

        const { clientSecret } = await response.json();

        // Confirm payment
        const { error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            }
        });

        if (error) {
            showNotification(error.message, 'error');
        } else {
            // Payment succeeded, proceed with order creation
            await handleCheckout(event);
        }
    });
}

// Make functions globally available
window.renderOrderSummary = renderOrderSummary;
window.handleCheckout = handleCheckout;
window.renderOrdersHistory = renderOrdersHistory;
