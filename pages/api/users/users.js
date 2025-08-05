import { connectDB } from "../../../lib/db";
import User from "../../../lib/schema/user";

export default async function handler(req, res) {
    await connectDB();
    if (req.method === "GET") {
        // Handle GET request
        try {
            const users = await User.find({});
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch users" });
        }
    } else if (req.method === "POST") {
        // Handle POST request
        
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}