import { db } from "@/lib/db";
import { doctors, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // API Key is already verified by middleware

    // Get user ID from request body
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch user from database
    const dbUser = await db
      .select({
        id: users.id,
        ayursutraId: users.ayursutraId,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        emailVerified: users.emailVerified,
        phoneVerified: users.phoneVerified,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);

    if (dbUser.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const user = dbUser[0];
    let additionalData = null;

    // Fetch additional data based on role
    if (user.role === "doctor" && user.ayursutraId) {
      const doctorData = await db
        .select()
        .from(doctors)
        .where(eq(doctors.ayursutraId, user.ayursutraId))
        .limit(1);

      if (doctorData.length > 0) {
        additionalData = doctorData[0];
      }
    }

    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        ayursutraId: user.ayursutraId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emailVerified: user.emailVerified ? true : false,
        phoneVerified: user.phoneVerified ? true : false,
        createdAt: user.createdAt,
      },
      profileData: additionalData,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user details" },
      { status: 500 }
    );
  }
}
