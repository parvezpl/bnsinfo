// pages/api/login.ts


export default function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;
        // Simple credential check (replace with database logic)
        if (email === 'user@example.com' && password === 'password123') {
            return res.status(200).json({ message: 'Login successful' });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
