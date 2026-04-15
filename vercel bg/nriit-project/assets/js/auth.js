// ============ AUTH HELPER FUNCTIONS ============

// Hash password (Note: Use bcryptjs on backend for real hashing)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Compare passwords
async function comparePasswords(password, hash) {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
}

// Verify JWT token
function verifyToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const decoded = JSON.parse(atob(parts[1]));
        const now = Math.floor(Date.now() / 1000);

        if (decoded.exp && decoded.exp < now) {
            return null; // Token expired
        }

        return decoded;
    } catch (err) {
        console.error('Token verification failed:', err);
        return null;
    }
}

// Get user info from token
function getUserFromToken(token) {
    const decoded = verifyToken(token);
    return decoded ? {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
    } : null;
}

// Check if user is admin
function isAdmin(token) {
    const user = getUserFromToken(token);
    return user && user.role === 'admin';
}

// Check if user is student
function isStudent(token) {
    const user = getUserFromToken(token);
    return user && user.role === 'student';
}

// Refresh token (call backend for new token)
async function refreshToken() {
    try {
        const oldToken = localStorage.getItem('token');
        if (!oldToken) return false;

        const response = await fetch('/api/auth?action=refresh', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${oldToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            return true;
        }
        return false;
    } catch (err) {
        console.error('Token refresh failed:', err);
        return false;
    }
}

// Logout and clear auth
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth/login.html';
}

export {
    hashPassword,
    comparePasswords,
    verifyToken,
    getUserFromToken,
    isAdmin,
    isStudent,
    refreshToken,
    logout
};
