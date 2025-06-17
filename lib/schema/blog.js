// models/Blog.js
import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  summary: {
    type: String,
  },
  content: {
    type: String, // Store HTML or Markdown
    required: true,
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0], // yyyy-mm-dd
  },
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
