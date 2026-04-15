// ============ GLOBAL FUNCTIONS ============

// Check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('token');
}

// Get JWT token from storage
function getToken() {
    return localStorage.getItem('token');
}

// Set JWT token in storage
function setToken(token) {
    localStorage.setItem('token', token);
}

// Remove token (logout)
function removeToken() {
    localStorage.removeItem('token');
}

// Format date to readable format
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// API error handler
function handleError(error) {
    console.error('Error:', error);
    return {
        success: false,
        message: error.message || 'An error occurred'
    };
}

// Validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
function validatePassword(password) {
    return password.length >= 6;
}

// Show loading spinner
function showLoader(element) {
    element.innerHTML = '<p style="text-align: center;">Loading...</p>';
}

// Convert bytes to readable format
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Debounce function for search
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

export {
    isLoggedIn,
    getToken,
    setToken,
    removeToken,
    formatDate,
    handleError,
    validateEmail,
    validatePassword,
    showLoader,
    formatBytes,
    debounce
};
