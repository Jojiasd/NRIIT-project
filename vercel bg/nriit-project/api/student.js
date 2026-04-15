// Mock student data
const students = [
    {
        id: '1',
        name: 'Raj Kumar',
        email: 'raj@student.edu',
        phone: '9123456789',
        course: 'B.Tech CSE',
        rollNumber: '1001',
        attendance: 92,
        gpa: '8.5',
        feesStatus: 'Paid'
    },
    {
        id: '2',
        name: 'Priya Singh',
        email: 'priya@student.edu',
        phone: '9234567890',
        course: 'B.Tech IT',
        rollNumber: '1002',
        attendance: 88,
        gpa: '8.2',
        feesStatus: 'Pending'
    }
];

const results = {
    '1': [
        { subject: 'Data Structures', marks: 95, grade: 'A+' },
        { subject: 'Web Development', marks: 88, grade: 'A' },
        { subject: 'Database Systems', marks: 92, grade: 'A+' }
    ],
    '2': [
        { subject: 'Java Programming', marks: 85, grade: 'A' },
        { subject: 'Networks', marks: 82, grade: 'B+' },
        { subject: 'OS Concepts', marks: 89, grade: 'A' }
    ]
};

// Verify JWT
function verifyToken(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    // In production, decode and verify the JWT
    return true;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const token = req.headers.authorization;
    if (!verifyToken(token)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { action } = req.query;

    try {
        // GET DASHBOARD
        if (!action && req.method === 'GET') {
            const student = students[0]; // Get current student
            return res.status(200).json({
                name: student.name,
                attendance: student.attendance,
                gpa: student.gpa,
                feesStatus: student.feesStatus
            });
        }

        // GET PROFILE
        if (action === 'profile' && req.method === 'GET') {
            const student = students[0];
            return res.status(200).json(student);
        }

        // UPDATE PROFILE
        if (action === 'updateProfile' && req.method === 'POST') {
            const { name, phone, course } = req.body;
            const student = students[0];
            
            if (name) student.name = name;
            if (phone) student.phone = phone;
            if (course) student.course = course;

            return res.status(200).json({
                message: 'Profile updated successfully',
                student
            });
        }

        // GET RESULTS
        if (action === 'results' && req.method === 'GET') {
            return res.status(200).json(results['1'] || []);
        }

        return res.status(400).json({ message: 'Invalid action' });
    } catch (error) {
        console.error('Student API error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
