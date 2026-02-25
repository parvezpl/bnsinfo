import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../pages/api/auth/[...nextauth]';
import { connectDB } from '../../../../../../lib/db';
import Blog from '../../../../../../lib/schema/blog/blog';
import User from '../../../../../../lib/schema/user';

export const runtime = 'nodejs';

function toResponse(blogDoc, userId = null) {
  const reactions = blogDoc?.reactions || { likes: [], dislikes: [] };
  const likes = Array.isArray(reactions.likes) ? reactions.likes : [];
  const dislikes = Array.isArray(reactions.dislikes) ? reactions.dislikes : [];
  const comments = Array.isArray(blogDoc?.comments) ? blogDoc.comments : [];

  const userReaction = userId
    ? likes.some((id) => String(id) === String(userId))
      ? 'like'
      : dislikes.some((id) => String(id) === String(userId))
        ? 'dislike'
        : null
    : null;

  return {
    ok: true,
    likes: likes.length,
    dislikes: dislikes.length,
    commentsCount: comments.length,
    userReaction,
    comments: comments
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((item) => ({
        id: String(item._id),
        userName: item.userName || 'User',
        userImage: item.userImage || '',
        text: item.text || '',
        createdAt: item.createdAt,
      })),
  };
}

async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return null;

  const fromSessionId = session?.user?.id;
  if (fromSessionId && mongoose.Types.ObjectId.isValid(String(fromSessionId))) {
    return {
      userId: String(fromSessionId),
      userName: session?.user?.name || 'User',
      userImage: session?.user?.image || '',
    };
  }

  let user = await User.findOne({ email }, { _id: 1, name: 1, image: 1 }).lean().exec();
  if (!user) {
    const created = await User.create({
      name: session?.user?.name || '',
      email,
      image: session?.user?.image || '',
      role: 'user',
      isPaid: false,
    });
    user = { _id: created._id, name: created.name, image: created.image };
  }

  return {
    userId: String(user._id),
    userName: user.name || session?.user?.name || 'User',
    userImage: user.image || session?.user?.image || '',
  };
}

export async function GET(_req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ ok: false, error: 'Invalid blog id.' }, { status: 400 });
    }

    const blog = await Blog.findById(id, { reactions: 1, comments: 1 }).lean().exec();
    if (!blog) {
      return NextResponse.json({ ok: false, error: 'Blog not found.' }, { status: 404 });
    }

    const currentUser = await getCurrentUser();
    return NextResponse.json(toResponse(blog, currentUser?.userId || null));
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error.message || 'Failed to load interactions.' },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ ok: false, error: 'Invalid blog id.' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const action = String(body?.action || '').trim();
    const text = String(body?.text || '').trim();
    const currentUser = await getCurrentUser();
    if (!currentUser?.userId) {
      return NextResponse.json(
        { ok: false, error: 'Please login first.' },
        { status: 401 }
      );
    }
    const userId = currentUser.userId;

    const blog = await Blog.findById(id).exec();
    if (!blog) {
      return NextResponse.json({ ok: false, error: 'Blog not found.' }, { status: 404 });
    }

    if (!blog.reactions) blog.reactions = { likes: [], dislikes: [] };
    if (!Array.isArray(blog.comments)) blog.comments = [];

    if (action === 'like' || action === 'dislike') {
      const likes = (blog.reactions.likes || []).map((item) => String(item));
      const dislikes = (blog.reactions.dislikes || []).map((item) => String(item));

      const hasLiked = likes.includes(userId);
      const hasDisliked = dislikes.includes(userId);

      if (action === 'like') {
        blog.reactions.dislikes = (blog.reactions.dislikes || []).filter(
          (item) => String(item) !== userId
        );
        blog.reactions.likes = hasLiked
          ? (blog.reactions.likes || []).filter((item) => String(item) !== userId)
          : [...(blog.reactions.likes || []), userId];
      } else {
        blog.reactions.likes = (blog.reactions.likes || []).filter(
          (item) => String(item) !== userId
        );
        blog.reactions.dislikes = hasDisliked
          ? (blog.reactions.dislikes || []).filter((item) => String(item) !== userId)
          : [...(blog.reactions.dislikes || []), userId];
      }

      // Keep reaction lists unique and consistent.
      blog.reactions.likes = Array.from(
        new Set((blog.reactions.likes || []).map((item) => String(item)))
      );
      blog.reactions.dislikes = Array.from(
        new Set((blog.reactions.dislikes || []).map((item) => String(item)))
      );
    } else if (action === 'comment') {
      if (!text) {
        return NextResponse.json({ ok: false, error: 'Comment is required.' }, { status: 400 });
      }
      if (text.length > 1000) {
        return NextResponse.json(
          { ok: false, error: 'Comment must be 1000 characters or less.' },
          { status: 400 }
        );
      }
      blog.comments.push({
        user: userId,
        userName: currentUser.userName || 'User',
        userImage: currentUser.userImage || '',
        text,
        createdAt: new Date(),
      });
    } else {
      return NextResponse.json({ ok: false, error: 'Invalid action.' }, { status: 400 });
    }

    blog.markModified('reactions');
    blog.markModified('comments');
    await blog.save();

    return NextResponse.json(toResponse(blog.toObject(), userId));
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error.message || 'Failed to update interactions.' },
      { status: 500 }
    );
  }
}
