// Authentication functionality

// User data storage key
const USERS_KEY = 'foodieUsers';
const CURRENT_USER_KEY = 'currentUser';

// Get users from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Register a new user
function registerUser(userData) {
    const users = getUsers();

    // Check if user already exists
    if (users.find(user => user.email === userData.email)) {
        showNotification('User with this email already exists!', 'error');
        return false;
    }

    // Create new user
    const newUser = {
        id: generateId(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // In a real app, this should be hashed
        orders: []
    };

    users.push(newUser);
    saveUsers(users);
    showNotification('Registration successful! Please login.');
    return true;
}

// Login user
function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        showNotification('Login successful!');
        updateAuthStatus();
        window.location.href = 'index.html';
        return true;
    } else {
        showNotification('Invalid email or password!', 'error');
        return false;
    }
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

// Logout user
function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
    showNotification('Logged out successfully!');
    updateAuthStatus();
    window.location.href = 'index.html';
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Update user profile
function updateUserProfile(userData) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };
        saveUsers(users);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[userIndex]));
        showNotification('Profile updated successfully!');
        return true;
    }

    return false;
}

// Add order to user's history
function addOrderToHistory(order) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
        if (!users[userIndex].orders) {
            users[userIndex].orders = [];
        }
        users[userIndex].orders.push(order);
        saveUsers(users);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[userIndex]));
    }
}

// Get user's order history
function getUserOrderHistory() {
    const currentUser = getCurrentUser();
    return currentUser ? currentUser.orders || [] : [];
}

// Initialize auth forms
document.addEventListener('DOMContentLoaded', function() {
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password')
            };

            if (userData.name && userData.email && userData.password) {
                if (validateEmail(userData.email)) {
                    registerUser(userData);
                    this.reset();
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
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const email = formData.get('email');
            const password = formData.get('password');

            loginUser(email, password);
        });
    }

    // Profile form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        const currentUser = getCurrentUser();
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
                    showNotification('Please fill in all fields.', 'error');
                }
            });
        } else {
            window.location.href = 'login.html';
        }
    }

    // Redirect if not logged in for protected pages
    const protectedPages = ['profile.html', 'orders.html'];
    if (protectedPages.includes(window.location.pathname.split('/').pop()) && !isLoggedIn()) {
        window.location.href = 'login.html';
    }
});

// Helper functions (fallback if not loaded from utils)
if (typeof generateId === 'undefined') {
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

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
        const user = getCurrentUser();
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
