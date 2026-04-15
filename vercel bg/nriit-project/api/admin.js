// Mock admin data
const adminData = {
    students: [
        { id: '1', name: 'Raj Kumar', email: 'raj@student.edu', course: 'B.Tech CSE', rollNumber: '1001' },
        { id: '2', name: 'Priya Singh', email: 'priya@student.edu', course: 'B.Tech IT', rollNumber: '1002' },
        { id: '3', name: 'Amit Patel', email: 'amit@student.edu', course: 'M.Tech CSE', rollNumber: '2001' }
    ],
    faculty: [
        { id: '1', name: 'Dr. Sharma', email: 'sharma@nriit.edu', department: 'CSE' },
        { id: '2', name: 'Prof. Gupta', email: 'gupta@nriit.edu', department: 'IT' },
        { id: '3', name: 'Dr. Verma', email: 'verma@nriit.edu', department: 'ECE' }
    ]
};

// Verify JWT
function verifyToken(authHeader) {
    return authHeader && authHeader.startsWith('Bearer ');
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
        // GET DASHBOARD STATS
        if (!action && req.method === 'GET') {
            return res.status(200).json({
                totalStudents: adminData.students.length,
                totalFaculty: adminData.faculty.length,
                newsCount: 3
            });
        }

        // GET STUDENTS
        if (action === 'students' && req.method === 'GET') {
            return res.status(200).json(adminData.students);
        }

        // SEARCH STUDENTS
        if (action === 'search' && req.method === 'GET') {
            const { query } = req.query;
            const results = adminData.students.filter(s =>
                s.name.toLowerCase().includes(query.toLowerCase()) ||
                s.email.toLowerCase().includes(query.toLowerCase())
            );
            return res.status(200).json(results);
        }

        // DELETE STUDENT
        if (action === 'deleteStudent' && req.method === 'POST') {
            const { studentId } = req.body;
            const index = adminData.students.findIndex(s => s.id === studentId);
            
            if (index === -1) {
                return res.status(404).json({ message: 'Student not found' });
            }

            adminData.students.splice(index, 1);
            return res.status(200).json({ message: 'Student deleted successfully' });
        }

        // GET FACULTY
        if (action === 'faculty' && req.method === 'GET') {
            return res.status(200).json(adminData.faculty);
        }

        // ADD FACULTY
        if (action === 'addFaculty' && req.method === 'POST') {
            const { name, email, department } = req.body;

            if (!name || !email || !department) {
                return res.status(400).json({ message: 'All fields required' });
            }

            const newFaculty = {
                id: Math.random().toString(36).substr(2, 9),
                name,
                email,
                department
            };

            adminData.faculty.push(newFaculty);

            return res.status(201).json({
                message: 'Faculty added successfully',
                faculty: newFaculty
            });
        }

        // DELETE FACULTY
        if (action === 'deleteFaculty' && req.method === 'POST') {
            const { facultyId } = req.body;
            const index = adminData.faculty.findIndex(f => f.id === facultyId);

            if (index === -1) {
                return res.status(404).json({ message: 'Faculty not found' });
            }

            adminData.faculty.splice(index, 1);
            return res.status(200).json({ message: 'Faculty deleted successfully' });
        }

        // SEARCH FACULTY
        if (action === 'searchFaculty' && req.method === 'GET') {
            const { query } = req.query;
            const results = adminData.faculty.filter(f =>
                f.name.toLowerCase().includes(query.toLowerCase()) ||
                f.email.toLowerCase().includes(query.toLowerCase())
            );
            return res.status(200).json(results);
        }

        // GENERATE REPORTS
        if (action === 'report' && req.method === 'GET') {
            const { type } = req.query;

            if (type === 'attendance') {
                return res.status(200).json([
                    { name: 'Raj Kumar', percentage: 92 },
                    { name: 'Priya Singh', percentage: 88 },
                    { name: 'Amit Patel', percentage: 95 }
                ]);
            }

            if (type === 'fees') {
                return res.status(200).json([
                    { month: 'January', collected: 500000, pending: 100000 },
                    { month: 'February', collected: 480000, pending: 120000 },
                    { month: 'March', collected: 520000, pending: 80000 }
                ]);
            }

            return res.status(400).json({ message: 'Invalid report type' });
        }

        return res.status(400).json({ message: 'Invalid action' });
    } catch (error) {
        console.error('Admin API error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
