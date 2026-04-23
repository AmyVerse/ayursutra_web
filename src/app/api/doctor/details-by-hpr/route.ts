import { db } from "@/lib/db";
import { doctors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hprId = searchParams.get("hprId");

    if (!hprId) {
      return NextResponse.json(
        { success: false, error: "HPR ID is required" },
        { status: 400 }
      );
    }

    // Find doctor profile by HPR ID
    const doctorProfile = await db
      .select({
        name: doctors.name,
        specialization: doctors.specialization,
        experience: doctors.experience,
        location: doctors.location,
        ayursutraId: doctors.ayursutraId,
        isVerified: doctors.isVerified,
      })
      .from(doctors)
      .where(eq(doctors.hprId, hprId))
      .limit(1);

    if (doctorProfile.length === 0) {
      return NextResponse.json(
        { success: false, error: "Doctor with this HPR ID not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      doctor: doctorProfile[0],
    });
  } catch (error) {
    console.error("Error fetching doctor details by HPR:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
