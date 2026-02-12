// Menu filtering and display functionality

// Render categories for filtering
function renderCategories() {
    const categoriesContainer = document.getElementById('categories-filter');
    if (!categoriesContainer) return;

    categoriesContainer.innerHTML = `
        <button class="filter-btn active" data-category="all">All</button>
        ${categories.map(category => `
            <button class="filter-btn" data-category="${category.name}">${category.name}</button>
        `).join('')}
    `;

    // Add event listeners
    const filterButtons = categoriesContainer.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter menu items
            filterMenuItems(this.dataset.category);
        });
    });
}

// Filter and render menu items
function filterMenuItems(category) {
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) return;

    let filteredItems = menuItems;

    if (category !== 'all') {
        filteredItems = menuItems.filter(item => item.category === category);
    }

    renderMenuItems(filteredItems);
}

// Render menu items
function renderMenuItems(items) {
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) return;

    menuContainer.innerHTML = items.map(item => `
        <div class="menu-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-item-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p class="price">${formatPrice(item.price)}</p>
                <button class="add-to-cart" onclick="addToCart(${item.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Render restaurants list
function renderRestaurants() {
    const restaurantsContainer = document.getElementById('restaurants-list');
    if (!restaurantsContainer) return;

    restaurantsContainer.innerHTML = restaurants.map(restaurant => `
        <div class="restaurant-card">
            <img src="${restaurant.image}" alt="${restaurant.name}">
            <div class="restaurant-info">
                <h3>${restaurant.name}</h3>
                <p>${restaurant.cuisine}</p>
                <p class="rating">⭐ ${restaurant.rating}</p>
                <p>${restaurant.deliveryTime}</p>
                <p>${restaurant.description}</p>
                <a href="menu.html?restaurant=${restaurant.id}" class="btn">View Menu</a>
            </div>
        </div>
    `).join('');
}

// Initialize menu page
document.addEventListener('DOMContentLoaded', function() {
    // Render categories and menu items on menu.html
    if (document.getElementById('categories-filter')) {
        renderCategories();
        renderMenuItems(menuItems); // Show all items initially
    }

    // Render restaurants on restaurant.html
    if (document.getElementById('restaurants-list')) {
        renderRestaurants();
    }

    // Check for restaurant filter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('restaurant');
    if (restaurantId && document.getElementById('menu-items')) {
        const restaurantItems = menuItems.filter(item => item.restaurantId == restaurantId);
        renderMenuItems(restaurantItems);
        // Update page title or add restaurant name
        const restaurant = restaurants.find(r => r.id == restaurantId);
        if (restaurant) {
            document.title = `${restaurant.name} Menu - FAMI-NA Express`;
        }
    }
});

// Helper functions (fallback if not loaded from utils/cart)
if (typeof formatPrice === 'undefined') {
    function formatPrice(price) {
        return `$${price.toFixed(2)}`;
    }
}

if (typeof addToCart === 'undefined') {
    function addToCart(itemId, quantity = 1) {
        // Fallback implementation
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
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

        localStorage.setItem('cart', JSON.stringify(cart));
        if (typeof updateCartCount !== 'undefined') updateCartCount();
        if (typeof showNotification !== 'undefined') showNotification(`${quantity} item(s) added to cart!`);
    }
}

// Make functions globally available
window.renderCategories = renderCategories;
window.filterMenuItems = filterMenuItems;
window.renderMenuItems = renderMenuItems;
window.renderRestaurants = renderRestaurants;
