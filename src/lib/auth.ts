import { db } from "@/lib/db";
import { doctors, users } from "@/lib/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  providers: [
    CredentialsProvider({
      id: "otp",
      name: "OTP",
      credentials: {
        userId: { label: "User ID", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.userId) return null;

        try {
          // Fetch user from database
          const dbUser = await db
            .select()
            .from(users)
            .where(eq(users.id, parseInt(credentials.userId)))
            .limit(1);

          if (dbUser.length === 0) return null;

          const user = dbUser[0];

          return {
            id: user.id.toString(),
            email: user.email,
            phone: user.phone,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Fetch user role and additional info
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.id, parseInt(user.id)))
          .limit(1);

        if (dbUser.length > 0) {
          token.role = dbUser[0].role;
          token.id = dbUser[0].id.toString();
          token.phone = dbUser[0].phone;
          token.ayursutraId = dbUser[0].ayursutraId; // Add AyurSutra ID to token

          // If doctor, fetch doctor-specific info
          if (dbUser[0].role === "doctor" && dbUser[0].ayursutraId) {
            const doctorInfo = await db
              .select()
              .from(doctors)
              .where(eq(doctors.ayursutraId, dbUser[0].ayursutraId))
              .limit(1);

            if (doctorInfo.length > 0) {
              token.doctorInfo = doctorInfo[0];
            }
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as "patient" | "doctor";
        session.user.phone = token.phone as string;
        session.user.ayursutraId = token.ayursutraId as string; // Add AyurSutra ID to session
        session.user.doctorInfo = token.doctorInfo as any;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        console.log(`New user signed in: ${user.email || user.phone}`);
      }
    },
  },
};
