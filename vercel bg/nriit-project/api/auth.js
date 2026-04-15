import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Mock database - Replace with Oracle DB in production
const users = new Map();

// Helper: Create JWT token
function createToken(user) {
    return jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// Helper: Verify token
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}

// Helper: Hash password
async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

// Helper: Compare password
async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { action } = req.query;

    try {
        // LOGIN
        if (action === 'login' && req.method === 'POST') {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password required' });
            }

            // Mock user retrieval - Replace with Oracle DB query
            const user = users.get(email);

            if (!user || !(await comparePassword(password, user.password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = createToken(user);
            return res.status(200).json({
                token,
                user: { id: user.id, email: user.email, name: user.name, role: user.role }
            });
        }

        // REGISTER
        if (action === 'register' && req.method === 'POST') {
            const { name, email, phone, password, role } = req.body;

            if (!name || !email || !password || !role) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            if (users.has(email)) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            const hashedPassword = await hashPassword(password);
            const user = {
                id: Math.random().toString(36).substr(2, 9),
                name,
                email,
                phone,
                password: hashedPassword,
                role: role || 'student'
            };

            users.set(email, user);

            return res.status(201).json({
                message: 'Registration successful',
                user: { id: user.id, email: user.email, name: user.name }
            });
        }

        // FORGOT PASSWORD
        if (action === 'forgotPassword' && req.method === 'POST') {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: 'Email required' });
            }

            // TODO: Send reset email
            return res.status(200).json({
                message: 'Password reset link sent to your email'
            });
        }

        // REFRESH TOKEN
        if (action === 'refresh' && req.method === 'POST') {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            const decoded = verifyToken(token);
            if (!decoded) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            const user = Array.from(users.values()).find(u => u.id === decoded.userId);
            const newToken = createToken(user);

            return res.status(200).json({ token: newToken });
        }

        return res.status(400).json({ message: 'Invalid action' });
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
