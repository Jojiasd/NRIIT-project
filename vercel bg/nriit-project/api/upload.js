import { put } from '@vercel/blob';

// Verify JWT
function verifyToken(authHeader) {
    return authHeader && authHeader.startsWith('Bearer ');
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = req.headers.authorization;
    if (!verifyToken(token)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const file = req.file || req.files?.file;

        if (!file) {
            return res.status(400).json({ message: 'No file provided' });
        }

        // Upload to Vercel Blob
        const blob = await put(file.originalname, file.buffer, {
            access: 'public'
        });

        return res.status(201).json({
            message: 'File uploaded successfully',
            url: blob.url,
            filename: blob.pathname
        });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            message: 'Upload failed',
            error: error.message
        });
    }
}
