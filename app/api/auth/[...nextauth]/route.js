import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt", // 👈 REQUIRED
  },

  callbacks: {
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
            isAdmin: false,
          });
        }

        return true;
      } catch (error) {
        console.error("Sign-in DB error (ignored):", error);
        return true;
      }
    },
    async jwt({ token }) {
      if (!token?.email) return token;

      await connectToDB();

      const user = await User.findOne({ email: token.email });

      if (user) {
        token.id = user._id.toString();
        token.isAdmin = user.isAdmin; // 👈 IMPORTANT
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin; // 👈 IMPORTANT
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
