import { assignAyurSutraId } from "@/lib/ayursutra-id";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user to check if they already have an AyurSutra ID
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = existingUser[0];

    // If user already has an AyurSutra ID, return it
    if (user.ayursutraId) {
      return NextResponse.json({
        success: true,
        ayursutraId: user.ayursutraId,
        message: "AyurSutra ID already exists",
      });
    }

    // Generate and assign new AyurSutra ID
    const updatedUser = await assignAyurSutraId(userId, user.role);

    return NextResponse.json({
      success: true,
      ayursutraId: updatedUser.ayursutraId,
      message: `AyurSutra ID generated successfully!`,
    });
  } catch (error) {
    console.error("Generate AyurSutra ID error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
