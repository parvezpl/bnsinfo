import mongoose from "mongoose";

const ForumReplySchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "ForumPost" },
    author: { type: String, required: true, trim: true },
    authorEmail: { type: String, default: "", trim: true },
    content: { type: String, required: true, trim: true },
    reactions: {
      type: new mongoose.Schema(
        {
          likeUsers: [{ type: String, trim: true }],
          dislikeUsers: [{ type: String, trim: true }],
        },
        { _id: false }
      ),
      default: () => ({ likeUsers: [], dislikeUsers: [] }),
    },
    comments: [
      {
        userEmail: { type: String, default: "", trim: true },
        userName: { type: String, default: "", trim: true },
        userImage: { type: String, default: "" },
        text: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.ForumReply ||
  mongoose.model("ForumReply", ForumReplySchema);
