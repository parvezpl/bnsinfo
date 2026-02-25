// models/Blog.js
import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String, // Short preview shown on card
    required: true,
  },
  content: {
    type: String, // Store HTML or Markdown
    // required: true,
  },
  image: {
    data: Buffer,
    contentType: String
  },
  authorlogo: {
    type: String, // URL or base64 string for author's logo
  },
  author: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0], // yyyy-mm-dd
  },
  reactions: {
    type: new mongoose.Schema(
      {
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
        dislikes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
      },
      { _id: false }
    ),
    default: () => ({ likes: [], dislikes: [] }),
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      userName: {
        type: String,
        default: '',
      },
      userImage: {
        type: String,
        default: '',
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
