import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String, // full post content
    required: true,
  },
  type: {
    type: String,
    enum: ['short', 'announcement', 'note', 'legal-update'],
    default: 'short',
  },
  image: {
    type: String, // optional thumbnail
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  published: {
    type: Boolean,
    default: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
  },
});

export default mongoose.models.Post || mongoose.model('Post', postSchema);
