// Main JavaScript file for general functionality

document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer components
    loadComponent('header', 'components/header.html');
    loadComponent('footer', 'components/footer.html');

    // Initialize cart count
    updateCartCount();

    // Initialize auth status
    updateAuthStatus();

    // Hamburger menu toggle
    setTimeout(() => {
        const hamburger = document.querySelector('.hamburger');
        const nav = document.querySelector('.nav');
        const closeMenu = document.querySelector('.close-menu');

        if (hamburger && nav) {
            hamburger.addEventListener('click', function() {
                nav.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
        }

        if (closeMenu && nav) {
            closeMenu.addEventListener('click', function() {
                nav.classList.remove('active');
                hamburger.classList.remove('active');
            });
        }
    }, 100); // Delay to ensure components are loaded

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (validateEmail(email)) {
                showNotification('Thank you for subscribing!');
                this.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }

    // Page load animation: fade-in and slide down for main content
    // This applies to all pages with a <main> element
    const main = document.querySelector('main');
    if (main) {
        // Start with hidden state
        main.style.opacity = '0';
        main.style.transform = 'translateY(20px)';
        main.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        // Trigger animation after a short delay to ensure rendering
        setTimeout(() => {
            main.style.opacity = '1';
            main.style.transform = 'translateY(0)';
        }, 100);
    }
});

// Update cart count in header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Update authentication status in header
function updateAuthStatus() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const authLinks = document.getElementById('auth-links');

    if (authLinks) {
        if (user) {
            authLinks.innerHTML = `
                <a href="profile.html">${user.name}</a>
                <a href="#" onclick="logout()">Logout</a>
            `;
        } else {
            authLinks.innerHTML = `
                <a href="login.html">Login</a>
                <a href="register.html">Register</a>
            `;
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    showNotification('Logged out successfully!');
    updateAuthStatus();
    window.location.href = 'index.html';
}

// Load component function (if not available from utils)
if (typeof loadComponent === 'undefined') {
    function loadComponent(elementId, componentPath) {
        fetch(componentPath)
            .then(response => response.text())
            .then(data => {
                document.getElementById(elementId).innerHTML = data;
            })
            .catch(error => console.error('Error loading component:', error));
    }
}

// Validate email function (if not available from utils)
if (typeof validateEmail === 'undefined') {
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// Show notification function (if not available from utils)
if (typeof showNotification === 'undefined') {
    function showNotification(message, type = 'info') {
        alert(message);
    }
}
