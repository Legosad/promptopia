import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  // IMPORTANT for production
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    /**
     * ✅ SIGN IN
     * - NEVER block sign-in due to DB issues
     * - OAuth success should always proceed
     */
    async signIn({ profile }) {
      try {
        if (!profile?.email) return true;

        await connectToDB();

        const existingUser = await User.findOne({ email: profile.email });

        if (!existingUser) {
          await User.create({
            email: profile.email,
            username: profile.name?.replace(/\s+/g, "").toLowerCase(),
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.error("Sign-in DB error (ignored):", error);
        return true; // 🔑 NEVER return false in production
      }
    },

    /**
     * ✅ SESSION
     * - Attach DB user ID to session
     * - Safe even if DB fails
     */
    async session({ session }) {
      try {
        if (!session?.user?.email) return session;

        await connectToDB();

        const user = await User.findOne({ email: session.user.email });

        if (user) {
          session.user.id = user._id.toString();
        }

        return session;
      } catch (error) {
        console.error("Session DB error:", error);
        return session;
      }
    },
  },
});

export { handler as GET, handler as POST };
