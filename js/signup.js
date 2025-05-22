/**
 * eG COLLECTIONS Authentication Module
 * Handles user authentication operations including login and registration
 */

// Configuration
const CONFIG = {
    API_URL: 'http://127.0.0.1:8000/api/',
    AUTH_TOKEN_KEY: 'authToken',
    MESSAGE_TIMEOUT: 3000
};

// DOM Elements
let mainContent = null;
let navigationLinks = {
    home: null,
    login: null,
    register: null
};

/**
 * Displays notification messages to the user
 * @param {string} message - The message to display
 * @param {string} type - Message type ('success', 'error', 'info')
 */
function showMessage(message, type = 'info') {
    // Create message element if it doesn't exist
    let messageContainer = document.querySelector('.message-container');
    
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        document.body.appendChild(messageContainer);
    }
    
    // Create and append the message
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
    
    // Auto-remove after timeout
    setTimeout(() => {
        messageElement.classList.add('message-hiding');
        setTimeout(() => {
            messageContainer.removeChild(messageElement);
        }, 300);
    }, CONFIG.MESSAGE_TIMEOUT);
}

/**
 * Load the home page content
 */
function loadHomePage() {
    if (!mainContent) {
        mainContent = document.getElementById('main-content');
    }
    
    // Here you would load your actual home page content
    mainContent.innerHTML = `
        <section class="hero-slider">
        <div class="hero-slide active" style="background-image: url('images/2-removebg-preview.png');">
            <div class="container">
                <div class="hero-content">
                    <h1>Elegance Redefined</h1>
                    <p>Discover the latest collection that embodies sophistication and style</p>
                    <a href="collections.html?id=men" class="btn-primary">Shop Collection</a>
                </div>
            </div>
        </div>
        <div class="hero-slide" style="background-image: url('images/3-removebg-preview.png');">
            <div class="container">
                <div class="hero-content">
                    <h1>Couples Essentials</h1>
                    <p>Refresh your wardrobe with our curated Couples selection</p>
                    <a href="collections.html?id=women" class="btn-primary">Explore Now</a>
                </div>
            </div>
        </div>
        <div class="hero-controls">
            <button class="hero-prev"><i class="fas fa-chevron-left"></i></button>
            <div class="hero-dots">
                <span class="hero-dot active"></span>
                <span class="hero-dot"></span>
            </div>
            <button class="hero-next"><i class="fas fa-chevron-right"></i></button>
        </div>
    </section>
    `
}

/**
 * Loads the login page
 */
function loadLoginPage() {
    if (!mainContent) {
        mainContent = document.getElementById('main-content');
    }
    
    mainContent.innerHTML = `
        <div class="auth-container">
            <h2>Login</h2>
            <form id="login-form" class="auth-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Login</button>
                </div>
            </form>
            <p class="auth-redirect">Don't have an account? <a href="#" id="register-link-form">Register here</a></p>
        </div>
    `;
    
    // Event listener for login form submission
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Event listener for register redirect
    document.getElementById('register-link-form').addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNavLink('register');
        loadRegisterPage();
    });
}

/**
 * Handles the login form submission
 * @param {Event} e - Form submission event
 */
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showMessage('Please enter both username and password', 'error');
        return;
    }
    
    fetch(`${CONFIG.API_URL}token-auth/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        // Store token and update UI
        localStorage.setItem(CONFIG.AUTH_TOKEN_KEY, data.token);
        updateAuthStatus(true);
        showMessage('Login successful!', 'success');
        loadHomePage();
        setActiveNavLink('home');
    })
    .catch(error => {
        console.error('Authentication error:', error);
        showMessage('Invalid username or password', 'error');
    });
}

/**
 * Loads the registration page
 */
function loadRegisterPage() {
    if (!mainContent) {
        mainContent = document.getElementById('main-content');
    }
    
    mainContent.innerHTML = `
        <div class="auth-container">
            <h2>Create Account</h2>
            <form id="register-form" class="auth-form">
                <div class="form-group">
                    <label for="reg-username">Username</label>
                    <input type="text" id="reg-username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="reg-email">Email</label>
                    <input type="email" id="reg-email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="reg-password">Password</label>
                    <input type="password" id="reg-password" name="password" required>
                </div>
                <div class="form-group">
                    <label for="reg-confirm-password">Confirm Password</label>
                    <input type="password" id="reg-confirm-password" name="confirm-password" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Register</button>
                </div>
            </form>
            <p class="auth-redirect">Already have an account? <a href="#" id="login-link-form">Login here</a></p>
        </div>
    `;
    
    // Event listener for registration form
    document.getElementById('register-form').addEventListener('submit', handleRegistration);
    
    // Event listener for login redirect
    document.getElementById('login-link-form').addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNavLink('login');
        loadLoginPage();
    });
}

/**
 * Handles user registration form submission
 * @param {Event} e - Form submission event
 */
function handleRegistration(e) {
    e.preventDefault();
    
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    // Form validation
    if (!username || !email || !password) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Submit registration
    fetch(`${CONFIG.API_URL}register/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(Object.values(data).flat().join(', '));
            });
        }
        return response.json();
    })
    .then(data => {
        showMessage('Registration successful! Please log in.', 'success');
        setActiveNavLink('login');
        loadLoginPage();
    })
    .catch(error => {
        console.error('Registration error:', error);
        showMessage(error.message || 'Registration failed', 'error');
    });
}

/**
 * Updates the UI based on authentication status
 * @param {boolean} isAuthenticated - Whether user is authenticated
 */
function updateAuthStatus(isAuthenticated) {
    const authToken = localStorage.getItem(CONFIG.AUTH_TOKEN_KEY);
    const isLoggedIn = isAuthenticated || !!authToken;
    
    // Update header UI elements
    const accountLink = document.querySelector('a[href="account.html"]');
    if (accountLink) {
        accountLink.style.display = isLoggedIn ? 'block' : 'none';
    }
    
    // Update nav items
    if (navigationLinks.login && navigationLinks.register) {
        navigationLinks.login.style.display = isLoggedIn ? 'none' : 'block';
        navigationLinks.register.style.display = isLoggedIn ? 'none' : 'block';
    }
    
    // Add logout button if logged in
    if (isLoggedIn && !document.getElementById('logout-btn')) {
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'logout-btn';
            logoutBtn.className = 'header-icon';
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
            logoutBtn.setAttribute('aria-label', 'Logout');
            logoutBtn.addEventListener('click', handleLogout);
            headerActions.appendChild(logoutBtn);
        }
    }
}

/**
 * Handles user logout
 */
function handleLogout() {
    localStorage.removeItem(CONFIG.AUTH_TOKEN_KEY);
    updateAuthStatus(false);
    showMessage('You have been logged out', 'info');
    loadHomePage();
    setActiveNavLink('home');
}

/**
 * Sets the active navigation link
 * @param {string} linkName - Name of the link to activate
 */
function setActiveNavLink(linkName) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to the selected nav item
    if (navigationLinks[linkName]) {
        navigationLinks[linkName].classList.add('active');
    }
}

/**
 * Setup navigation event listeners
 */
function setupNavigation() {
    // Get navigation references
    navigationLinks.home = document.querySelector('.nav-item a[href="index.html"]').parentElement;
    navigationLinks.login = document.querySelector('#login-link').parentElement;
    navigationLinks.register = document.querySelector('#register-link').parentElement;
    
    // Add event listeners
    document.getElementById('login-link').addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNavLink('login');
        loadLoginPage();
    });
    
    document.getElementById('register-link').addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNavLink('register');
        loadRegisterPage();
    });
    
    // Home link
    document.querySelector('.nav-item a[href="index.html"]').addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNavLink('home');
        loadHomePage();
    });
}

/**
 * Checks authentication status on page load
 */
function checkAuthStatus() {
    const authToken = localStorage.getItem(CONFIG.AUTH_TOKEN_KEY);
    
    if (authToken) {
        // Validate token with backend if needed
        fetch(`${CONFIG.API_URL}validate-token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Invalid token');
            }
            updateAuthStatus(true);
        })
        .catch(error => {
            console.error('Token validation error:', error);
            localStorage.removeItem(CONFIG.AUTH_TOKEN_KEY);
            updateAuthStatus(false);
        });
    } else {
        updateAuthStatus(false);
    }
}

/**
 * Initializes the authentication module
 */
function initAuth() {
    mainContent = document.getElementById('main-content');
    
    // Setup navigation
    setupNavigation();
    
    // Check auth status
    checkAuthStatus();
    
    // Load home page by default
    loadHomePage();
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initAuth);

// Make functions available globally since we're not using import/export in this example
window.loadLoginPage = loadLoginPage;
window.loadRegisterPage = loadRegisterPage;
window.loadHomePage = loadHomePage;