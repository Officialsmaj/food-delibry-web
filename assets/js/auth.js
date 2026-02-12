// Authentication functionality with API integration

const API_BASE = 'http://localhost:3001/api';

// Register a new user
async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            showNotification('Registration successful! Please login.');
            return true;
        } else {
            showNotification(data.message || 'Registration failed', 'error');
            return false;
        }
    } catch (error) {
        showNotification('Network error', 'error');
        return false;
    }
}

// Login user
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            showNotification('Login successful!');
            updateAuthStatus();
            window.location.href = 'index.html';
            return true;
        } else {
            showNotification(data.message || 'Login failed', 'error');
            return false;
        }
    } catch (error) {
        showNotification('Network error', 'error');
        return false;
    }
}

// Get current user
async function getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            return data.user;
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            return null;
        }
    } catch (error) {
        return null;
    }
}

// Logout user
async function logoutUser() {
    try {
        await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
    } catch (error) {
        // Ignore errors
    }
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    showNotification('Logged out successfully!');
    updateAuthStatus();
    window.location.href = 'index.html';
}

// Check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('token');
}

// Update user profile (simplified for now)
function updateUserProfile(userData) {
    // For now, just show notification - full profile update can be added later
    showNotification('Profile update not implemented yet');
    return false;
}

// Add order to user's history (API-based)
async function addOrderToHistory(order) {
    // This will be handled by the orders API
    // For now, do nothing
}

// Get user's order history
async function getUserOrderHistory() {
    try {
        const response = await fetch(`${API_BASE}/orders`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        return response.ok ? data : [];
    } catch (error) {
        return [];
    }
}

// Initialize auth forms
document.addEventListener('DOMContentLoaded', function() {
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password')
            };

            if (userData.name && userData.email && userData.password) {
                if (validateEmail(userData.email)) {
                    if (await registerUser(userData)) {
                        this.reset();
                    }
                } else {
                    showNotification('Please enter a valid email address.', 'error');
                }
            } else {
                showNotification('Please fill in all fields.', 'error');
            }
        });
    }

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const email = formData.get('email');
            const password = formData.get('password');

            await loginUser(email, password);
        });
    }

    // Profile form (simplified)
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        getCurrentUser().then(currentUser => {
            if (currentUser) {
                // Populate form with current user data
                document.getElementById('profile-name').value = currentUser.name;
                document.getElementById('profile-email').value = currentUser.email;

                profileForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const formData = new FormData(this);
                    const userData = {
                        name: formData.get('name'),
                        email: formData.get('email')
                    };

                    if (userData.name && userData.email) {
                        if (validateEmail(userData.email)) {
                            updateUserProfile(userData);
                        } else {
                            showNotification('Please enter a valid email address.', 'error');
                        }
                    } else {
                        showNotification('Please fill in name and email fields.', 'error');
                    }
                });
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    // Redirect if not logged in for protected pages
    const protectedPages = ['profile.html', 'orders.html'];
    if (protectedPages.includes(window.location.pathname.split('/').pop()) && !isLoggedIn()) {
        window.location.href = 'login.html';
    }
});

// Helper functions (fallback if not loaded from utils)
if (typeof validateEmail === 'undefined') {
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

if (typeof showNotification === 'undefined') {
    function showNotification(message, type = 'info') {
        alert(message);
    }
}

if (typeof updateAuthStatus === 'undefined') {
    function updateAuthStatus() {
        // This function is defined in main.js, but as a fallback
        getCurrentUser().then(user => {
            const authLinks = document.getElementById('auth-links');
            if (authLinks) {
                if (user) {
                    authLinks.innerHTML = `
                        <a href="profile.html">${user.name}</a>
                        <a href="#" onclick="logoutUser()">Logout</a>
                    `;
                } else {
                    authLinks.innerHTML = `
                        <a href="login.html">Login</a>
                        <a href="register.html">Register</a>
                    `;
                }
            }
        });
    }
}

// Make functions globally available
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.getCurrentUser = getCurrentUser;
window.isLoggedIn = isLoggedIn;
window.updateUserProfile = updateUserProfile;
window.addOrderToHistory = addOrderToHistory;
window.getUserOrderHistory = getUserOrderHistory;
