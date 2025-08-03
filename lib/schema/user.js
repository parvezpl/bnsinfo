import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    image: String,
    role: {
        type: String,
        enum: ['user', 'admin', 'author'], // You can add more roles if needed
        default: 'user',
    },
    bio: {
        type: String,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true }); // Optional: adds createdAt and updatedAt fields

export default mongoose.models.User || mongoose.model("User", UserSchema);
