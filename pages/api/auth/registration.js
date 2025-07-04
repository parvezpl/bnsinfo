import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

const usersFile = path.join(process.cwd(), 'users.json');

// Create file if not exists
if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([]));
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const users = JSON.parse(fs.readFileSync(usersFile));

        // Check if user already exists
        if (users.find(user => user.email === email)) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        users.push({ email, password: hashedPassword });
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

        return res.status(200).json({ message: 'User registered successfully.' });
    }

    return res.status(405).json({ message: 'Method not allowed.' });
}
