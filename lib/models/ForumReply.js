import mongoose from "mongoose";

const ForumReplySchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "ForumPost" },
    author: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.ForumReply ||
  mongoose.model("ForumReply", ForumReplySchema);
