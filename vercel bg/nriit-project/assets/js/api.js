// ============ API FUNCTIONS ============

const API_BASE = '/api';

// Make API request
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const token = localStorage.getItem('token');

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
        const response = await fetch(url, finalOptions);
        
        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/auth/login.html';
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth API
const authAPI = {
    login: (email, password) => 
        apiCall('/auth', {
            method: 'POST',
            body: JSON.stringify({ action: 'login', email, password })
        }),

    register: (data) =>
        apiCall('/auth', {
            method: 'POST',
            body: JSON.stringify({ action: 'register', ...data })
        }),

    forgotPassword: (email) =>
        apiCall('/auth', {
            method: 'POST',
            body: JSON.stringify({ action: 'forgotPassword', email })
        })
};

// Student API
const studentAPI = {
    getDashboard: () =>
        apiCall('/student', { method: 'GET' }),

    getProfile: () =>
        apiCall('/student?action=profile', { method: 'GET' }),

    updateProfile: (data) =>
        apiCall('/student?action=updateProfile', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    getResults: () =>
        apiCall('/student?action=results', { method: 'GET' }),

    getAttendance: () =>
        apiCall('/attendance', { method: 'GET' }),

    getFees: () =>
        apiCall('/fees', { method: 'GET' }),

    payFees: (amount, method) =>
        apiCall('/fees?action=pay', {
            method: 'POST',
            body: JSON.stringify({ amount, paymentMethod: method })
        })
};

// Admin API
const adminAPI = {
    getDashboard: () =>
        apiCall('/admin', { method: 'GET' }),

    getStudents: () =>
        apiCall('/admin?action=students', { method: 'GET' }),

    searchStudents: (query) =>
        apiCall(`/admin?action=search&query=${query}`, { method: 'GET' }),

    deleteStudent: (studentId) =>
        apiCall('/admin?action=deleteStudent', {
            method: 'POST',
            body: JSON.stringify({ studentId })
        }),

    getFaculty: () =>
        apiCall('/admin?action=faculty', { method: 'GET' }),

    addFaculty: (data) =>
        apiCall('/admin?action=addFaculty', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    deleteFaculty: (facultyId) =>
        apiCall('/admin?action=deleteFaculty', {
            method: 'POST',
            body: JSON.stringify({ facultyId })
        }),

    getReport: (type) =>
        apiCall(`/admin?action=report&type=${type}`, { method: 'GET' })
};

// News API
const newsAPI = {
    getAll: () =>
        apiCall('/news', { method: 'GET' }),

    create: (data) =>
        apiCall('/news?action=create', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    delete: (newsId) =>
        apiCall('/news?action=delete', {
            method: 'POST',
            body: JSON.stringify({ newsId })
        })
};

// Upload API
const uploadAPI = {
    uploadFile: (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('token');
        return fetch(`${API_BASE}/upload`, {
            method: 'POST',
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: formData
        }).then(res => res.json());
    }
};

export {
    apiCall,
    authAPI,
    studentAPI,
    adminAPI,
    newsAPI,
    uploadAPI
};
