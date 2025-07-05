import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "../../../lib/db";
import User from "../../../lib/schema/user";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET, // ✅ Secret added here

  callbacks: {
    async signIn({ user }) {
      await connectDB();
      // Check if the user already exists
      let existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        // If user doesn't exist, create one
        existingUser = await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          role: "user",      // default role
          isPaid: false,     // default paid status
        });
      }
      return true; // Allow sign in
    },

    async session({ session }) {
      await connectDB();

      // Find the user by email to get role and isPaid
      const dbUser = await User.findOne({ email: session.user.email });
      session.user.id = dbUser._id;
      session.user.role = dbUser.role;
      session.user.isPaid = dbUser.isPaid;

      return session;
    },
  },
};

export default NextAuth(authOptions);
