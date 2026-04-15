// Mock attendance data
const attendanceData = {
    '1': {
        totalClasses: 150,
        classesAttended: 138,
        percentage: 92,
        monthlyData: [
            { month: 'January', present: 20, total: 22 },
            { month: 'February', present: 18, total: 20 },
            { month: 'March', present: 22, total: 22 },
            { month: 'April', present: 18, total: 19 },
            { month: 'May', present: 20, total: 22 },
            { month: 'June', present: 20, total: 22 },
            { month: 'July', present: 20, total: 23 }
        ]
    }
};

// Verify JWT
function verifyToken(authHeader) {
    return authHeader && authHeader.startsWith('Bearer ');
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = req.headers.authorization;
    if (!verifyToken(token)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const attendance = attendanceData['1']; // Get current student's attendance
        
        return res.status(200).json({
            totalClasses: attendance.totalClasses,
            classesAttended: attendance.classesAttended,
            percentage: attendance.percentage,
            monthlyData: attendance.monthlyData
        });
    } catch (error) {
        console.error('Attendance API error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
