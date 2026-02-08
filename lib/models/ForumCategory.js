import mongoose from "mongoose";

const ForumCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
    count: { type: Number, default: 0 },
    slug: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.ForumCategory ||
  mongoose.model("ForumCategory", ForumCategorySchema);
