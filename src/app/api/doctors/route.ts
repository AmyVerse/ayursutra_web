import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { doctors, users } from "@/lib/db/schema";
import { and, desc, eq, ilike } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/doctors - Get all doctors or search by specialization/location
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get("specialization");
    const location = searchParams.get("location");
    const search = searchParams.get("search"); // General search
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build conditions array
    const conditions = [eq(doctors.isVerified, true)];

    if (specialization) {
      conditions.push(ilike(doctors.specialization, `%${specialization}%`));
    }

    if (location) {
      conditions.push(ilike(doctors.location, `%${location}%`));
    }

    if (search) {
      conditions.push(ilike(doctors.name, `%${search}%`));
    }

    const doctorsList = await db
      .select({
        id: doctors.id,
        ayursutraId: doctors.ayursutraId,
        name: doctors.name,
        specialization: doctors.specialization,
        experience: doctors.experience,
        patientsChecked: doctors.patientsChecked,
        rating: doctors.rating,
        biography: doctors.biography,
        location: doctors.location,
        isVerified: doctors.isVerified,
        userEmail: users.email,
        userPhone: users.phone,
      })
      .from(doctors)
      .innerJoin(users, eq(doctors.ayursutraId, users.ayursutraId))
      .where(conditions.length > 1 ? and(...conditions) : conditions[0])
      .orderBy(desc(doctors.rating), desc(doctors.patientsChecked))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      doctors: doctorsList,
      total: doctorsList.length,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}

// POST /api/doctors - Create or update doctor profile
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      specialization,
      experience,
      biography,
      location,
      hprId,
      abhaId,
    } = body;

    // Validate required fields
    if (!name || !specialization || !location) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, specialization, and location are required",
        },
        { status: 400 }
      );
    }

    // Get user's AyurSutra ID
    const currentUser = await db
      .select({ ayursutraId: users.ayursutraId })
      .from(users)
      .where(eq(users.id, parseInt(session.user.id)))
      .limit(1);

    if (!currentUser.length || !currentUser[0].ayursutraId) {
      return NextResponse.json(
        { success: false, error: "User AyurSutra ID not found" },
        { status: 400 }
      );
    }

    const userAyursutraId = currentUser[0].ayursutraId;

    // Check if doctor profile already exists
    const existingDoctor = await db
      .select()
      .from(doctors)
      .where(eq(doctors.ayursutraId, userAyursutraId))
      .limit(1);

    if (existingDoctor.length > 0) {
      // Update existing doctor
      const updatedDoctor = await db
        .update(doctors)
        .set({
          name,
          specialization,
          experience: experience || "0", // Keep as text
          biography,
          location,
          hprId,
          abhaId,
          updatedAt: new Date(),
        })
        .where(eq(doctors.ayursutraId, userAyursutraId))
        .returning();

      return NextResponse.json({
        success: true,
        message: "Doctor profile updated successfully",
        doctor: updatedDoctor[0],
      });
    } else {
      // Create new doctor profile
      const newDoctor = await db
        .insert(doctors)
        .values({
          ayursutraId: userAyursutraId,
          name,
          specialization,
          experience: experience || "0", // Keep as text
          biography,
          location,
          hprId,
          abhaId,
        })
        .returning();

      return NextResponse.json(
        {
          success: true,
          message: "Doctor profile created successfully",
          doctor: newDoctor[0],
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error creating/updating doctor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save doctor profile" },
      { status: 500 }
    );
  }
}
