// Mock fees data
const feesData = {
    '1': {
        totalDue: 150000,
        totalPaid: 100000,
        balance: 50000,
        payments: [
            { date: '2026-01-15', amount: 50000, status: 'Paid' },
            { date: '2026-01-20', amount: 50000, status: 'Paid' }
        ]
    }
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
        // GET FEES INFO
        if (!action && req.method === 'GET') {
            const fees = feesData['1'];
            return res.status(200).json({
                totalDue: fees.totalDue,
                totalPaid: fees.totalPaid,
                balance: fees.balance,
                payments: fees.payments
            });
        }

        // PAY FEES
        if (action === 'pay' && req.method === 'POST') {
            const { amount, paymentMethod } = req.body;

            if (!amount || !paymentMethod) {
                return res.status(400).json({ message: 'Amount and payment method required' });
            }

            // TODO: Process payment with payment gateway
            const fees = feesData['1'];
            fees.totalPaid += amount;
            fees.balance -= amount;
            fees.payments.push({
                date: new Date().toISOString().split('T')[0],
                amount,
                status: 'Paid'
            });

            return res.status(200).json({
                message: 'Payment processed successfully',
                fees
            });
        }

        return res.status(400).json({ message: 'Invalid action' });
    } catch (error) {
        console.error('Fees API error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
