import NextAuth from "@node_modules/next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";
// import { signIn } from 'next-auth/react';

const handler = NextAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    callbacks: {
      // Handle user sessions
      async session({ session }) {
        try {
          const sessionUser = await User.findOne({ email: session.user.email });
          if (sessionUser) {
            session.user.id = sessionUser._id.toString();
          }
          return session; // Ensure a valid session object is returned
        } catch (error) {
          console.error("Error in session callback:", error);
          return session;
        }
      },
  
      // Handle sign-in logic
      async signIn({ profile }) {
        try {
          // Connect to the database
          await connectToDB();
  
          // Check if the user already exists
          const userExists = await User.findOne({ email: profile.email });
  
          // If not, create a new user
          if (!userExists) {
            await User.create({
              email: profile.email,
              username: profile.name.replace(" ", "").toLowerCase(),
              image: profile.picture,
            });
          } else {
            console.log("User already exists:", profile.email);
          }
  
          return true; // Explicitly return true to proceed with sign-in
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false; // Block sign-in if an error occurs
        }
      },
    },
  });
  
  export { handler as GET, handler as POST };