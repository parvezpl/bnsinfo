import mongoose from "mongoose";

const ForumPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "", trim: true },
    author: { type: String, required: true, trim: true },
    replies: { type: Number, default: 0 },
    tag: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    time: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.ForumPost ||
  mongoose.model("ForumPost", ForumPostSchema);
