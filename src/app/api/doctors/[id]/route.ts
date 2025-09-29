import { db } from "@/lib/db";
import { doctors, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/doctors/[id] - Get specific doctor details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doctorId = parseInt(id);

    if (isNaN(doctorId)) {
      return NextResponse.json(
        { success: false, error: "Invalid doctor ID" },
        { status: 400 }
      );
    }

    const doctor = await db
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
        hprId: doctors.hprId,
        abhaId: doctors.abhaId,
        createdAt: doctors.createdAt,
      })
      .from(doctors)
      .innerJoin(users, eq(doctors.ayursutraId, users.ayursutraId))
      .where(eq(doctors.id, doctorId))
      .limit(1);

    if (doctor.length === 0) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      doctor: doctor[0],
    });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch doctor" },
      { status: 500 }
    );
  }
}

// PATCH /api/doctors/[id] - Update doctor stats (patients checked, rating)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doctorId = parseInt(id);
    const body = await request.json();
    const { patientsChecked, rating } = body;

    if (isNaN(doctorId)) {
      return NextResponse.json(
        { success: false, error: "Invalid doctor ID" },
        { status: 400 }
      );
    }

    const updateData: any = { updatedAt: new Date() };

    if (patientsChecked !== undefined) {
      updateData.patientsChecked = parseInt(patientsChecked);
    }

    if (rating !== undefined) {
      updateData.rating = rating.toString();
    }

    const updatedDoctor = await db
      .update(doctors)
      .set(updateData)
      .where(eq(doctors.id, doctorId))
      .returning();

    if (updatedDoctor.length === 0) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Doctor stats updated successfully",
      doctor: updatedDoctor[0],
    });
  } catch (error) {
    console.error("Error updating doctor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update doctor" },
      { status: 500 }
    );
  }
}
