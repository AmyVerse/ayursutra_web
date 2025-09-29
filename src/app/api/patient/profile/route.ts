import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Fetch real patient data from the users table using the session user ID
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Fetch user from DB
  const currentUser = await db
    .select({
      id: users.id,
      ayursutraId: users.ayursutraId,
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
      dateOfBirth: users.createdAt, // Replace with actual DOB if you add it
      // Add more fields as needed
    })
    .from(users)
    .where(eq(users.id, parseInt(session.user.id)))
    .limit(1);

  if (!currentUser.length || !currentUser[0].ayursutraId) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 }
    );
  }

  const user = currentUser[0];

  if (user.role !== "patient") {
    return NextResponse.json(
      { success: false, error: "Access denied. User is not a patient." },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    user: {
      ayursutraId: user.ayursutraId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    patient: user,
  });
}
