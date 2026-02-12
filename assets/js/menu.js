// Menu filtering and display functionality with API integration

const API_BASE = 'http://localhost:3001/api';

let categories = [];
let restaurants = [];
let menuItems = [];

// Load data from API
async function loadData() {
    try {
        const [categoriesRes, restaurantsRes, menuRes] = await Promise.all([
            fetch(`${API_BASE}/menu`), // We'll use menu endpoint to get categories
            fetch(`${API_BASE}/restaurants`),
            fetch(`${API_BASE}/menu`)
        ]);

        if (categoriesRes.ok) {
            const menuData = await categoriesRes.json();
            // Extract unique categories from menu items
            categories = [...new Set(menuData.map(item => item.category))].map(name => ({ name }));
            categories.unshift({ name: 'all' }); // Add 'all' category
        }

        if (restaurantsRes.ok) {
            restaurants = await restaurantsRes.json();
        }

        if (menuRes.ok) {
            menuItems = await menuRes.json();
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Render categories for filtering
function renderCategories() {
    const categoriesContainer = document.getElementById('categories-filter');
    if (!categoriesContainer) return;

    categoriesContainer.innerHTML = categories.map(category => `
        <button class="filter-btn ${category.name === 'all' ? 'active' : ''}" data-category="${category.name}">${category.name === 'all' ? 'All' : category.name}</button>
    `).join('');

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
document.addEventListener('DOMContentLoaded', async function() {
    await loadData();

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
    async function addToCart(itemId, quantity = 1) {
        try {
            const response = await fetch(`${API_BASE}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ itemId, quantity })
            });
            if (response.ok) {
                if (typeof updateCartCount !== 'undefined') updateCartCount();
                if (typeof showNotification !== 'undefined') showNotification(`${quantity} item(s) added to cart!`);
            } else {
                if (typeof showNotification !== 'undefined') showNotification('Failed to add to cart', 'error');
            }
        } catch (error) {
            if (typeof showNotification !== 'undefined') showNotification('Network error', 'error');
        }
    }
}

// Make functions globally available
window.renderCategories = renderCategories;
window.filterMenuItems = filterMenuItems;
window.renderMenuItems = renderMenuItems;
window.renderRestaurants = renderRestaurants;
