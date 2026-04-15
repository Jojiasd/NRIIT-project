let newsData = [
    {
        id: '1',
        title: 'Admissions Open for 2026-27',
        content: 'NRIIT is now accepting admissions for B.Tech and M.Tech programs. Apply now!',
        date: new Date('2026-04-10'),
        author: 'Admin'
    },
    {
        id: '2',
        title: 'Annual Tech Fest 2026',
        content: 'Join us for the biggest tech fest with competitions, workshops, and networking.',
        date: new Date('2026-04-05'),
        author: 'Admin'
    },
    {
        id: '3',
        title: 'New AI Lab Inaugurated',
        content: 'State-of-the-art AI and ML lab launched for student research.',
        date: new Date('2026-03-28'),
        author: 'Admin'
    }
];

// Verify JWT
function verifyToken(authHeader) {
    return authHeader && authHeader.startsWith('Bearer ');
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { action } = req.query;

    try {
        // GET ALL NEWS (public)
        if (!action && req.method === 'GET') {
            return res.status(200).json(
                newsData.map(n => ({
                    ...n,
                    date: n.date.toISOString()
                }))
            );
        }

        // CREATE NEWS (requires auth)
        if (action === 'create' && req.method === 'POST') {
            const token = req.headers.authorization;
            if (!verifyToken(token)) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const { title, content } = req.body;

            if (!title || !content) {
                return res.status(400).json({ message: 'Title and content required' });
            }

            const newNews = {
                id: Math.random().toString(36).substr(2, 9),
                title,
                content,
                date: new Date(),
                author: 'Admin'
            };

            newsData.push(newNews);

            return res.status(201).json({
                message: 'News published successfully',
                news: {
                    ...newNews,
                    date: newNews.date.toISOString()
                }
            });
        }

        // DELETE NEWS (requires auth)
        if (action === 'delete' && req.method === 'POST') {
            const token = req.headers.authorization;
            if (!verifyToken(token)) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const { newsId } = req.body;

            const index = newsData.findIndex(n => n.id === newsId);
            if (index === -1) {
                return res.status(404).json({ message: 'News not found' });
            }

            newsData.splice(index, 1);

            return res.status(200).json({
                message: 'News deleted successfully'
            });
        }

        return res.status(400).json({ message: 'Invalid action' });
    } catch (error) {
        console.error('News API error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
