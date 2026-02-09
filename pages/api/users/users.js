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
    } else if (req.method === "PUT" || req.method === "PATCH") {
        try {
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ error: "User id is required" });
            }

            const { name, role, status, isPaid, bio } = req.body || {};
            const update = {};
            if (typeof name === "string") update.name = name;
            if (typeof role === "string") update.role = role;
            if (typeof status === "string") update.status = status;
            if (typeof isPaid === "boolean") update.isPaid = isPaid;
            if (typeof bio === "string") update.bio = bio;

            const user = await User.findByIdAndUpdate(id, update, { new: true });
            if (!user) return res.status(404).json({ error: "User not found" });

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: "Failed to update user" });
        }
    } else {
        res.setHeader("Allow", ["GET", "POST", "PUT", "PATCH"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
