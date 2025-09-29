import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { doctors, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/doctor/profile - Get current doctor's profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's AyurSutra ID
    const currentUser = await db
      .select({
        ayursutraId: users.ayursutraId,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
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

    if (user.role !== "doctor") {
      return NextResponse.json(
        { success: false, error: "Access denied. User is not a doctor." },
        { status: 403 }
      );
    }

    // Get doctor profile
    const doctorProfile = await db
      .select()
      .from(doctors)
      .where(eq(doctors.ayursutraId, user.ayursutraId!))
      .limit(1);

    if (!doctorProfile.length) {
      // Return user info even if doctor profile doesn't exist yet
      return NextResponse.json({
        success: true,
        user: {
          ayursutraId: user.ayursutraId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        doctor: null,
        message:
          "Doctor profile not found. Please complete your profile setup.",
      });
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
      doctor: doctorProfile[0],
    });
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch doctor profile" },
      { status: 500 }
    );
  }
}
