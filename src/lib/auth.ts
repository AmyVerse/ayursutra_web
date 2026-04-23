import { db } from "@/lib/db";
import { doctors, users } from "@/lib/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  providers: [
    Credentials({
      id: "otp",
      name: "OTP",
      credentials: {
        userId: { label: "User ID", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.userId || typeof credentials.userId !== "string") return null;

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
            role: user.role as "patient" | "doctor",
            ayursutraId: user.ayursutraId,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),

    // === Demo Doctor Provider ===
    Credentials({
      id: "demo-doctor",
      name: "Demo Doctor",
      credentials: {},
      async authorize() {
        // Check if demo doctor exists in your DB or create one dynamically
        let user = await db
          .select()
          .from(users)
          .where(eq(users.email, "demodoctor@example.com"))
          .limit(1);

        if (user.length === 0) {
          // Create the demo doctor
          const [newUser] = await db
            .insert(users)
            .values({
              name: "Demo Doctor",
              email: "demodoctor@example.com",
              role: "doctor",
              ayursutraId: "demo-dr-123",
            })
            .returning();

          return {
            id: newUser.id.toString(),
            email: newUser.email,
            name: newUser.name,
            role: newUser.role as "patient" | "doctor",
            ayursutraId: newUser.ayursutraId,
          };
        }

        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].name,
          role: user[0].role as "patient" | "doctor",
          ayursutraId: user[0].ayursutraId,
        };
      },
    }),

    // === Demo Patient Provider ===
    Credentials({
      id: "demo-patient",
      name: "Demo Patient",
      credentials: {},
      async authorize() {
        let user = await db
          .select()
          .from(users)
          .where(eq(users.email, "demopatient@example.com"))
          .limit(1);

        if (user.length === 0) {
          // Create the demo patient
          const [newUser] = await db
            .insert(users)
            .values({
              name: "Demo Patient",
              email: "demopatient@example.com",
              role: "patient",
              ayursutraId: "demo-pat-456",
            })
            .returning();

          return {
            id: newUser.id.toString(),
            email: newUser.email,
            name: newUser.name,
            role: newUser.role as "patient" | "doctor",
            ayursutraId: newUser.ayursutraId,
          };
        }

        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].name,
          role: user[0].role as "patient" | "doctor",
          ayursutraId: user[0].ayursutraId,
        };
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
          .where(eq(users.id, parseInt(user.id!)))
          .limit(1);

        if (dbUser.length > 0) {
          token.role = dbUser[0].role as "patient" | "doctor";
          token.id = dbUser[0].id.toString();
          token.phone = dbUser[0].phone;
          token.ayursutraId = dbUser[0].ayursutraId;

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
        session.user.ayursutraId = token.ayursutraId as string;
        session.user.doctorInfo = token.doctorInfo as any;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email || user.id}`);
    },
  },
});
