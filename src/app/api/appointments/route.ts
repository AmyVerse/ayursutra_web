import {
  createNotification,
  generateAppointmentId,
  getUserByAyurSutraId,
} from "@/lib/ayursutra-id";
import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createAppointmentSchema = z.object({
  patientAyursutraId: z.string().min(1),
  doctorAyursutraId: z.string().min(1),
  dateTime: z.string(),
  notes: z.string().optional(),
  treatmentType: z.string().optional(),
  duration: z.number().default(60),
  patientName: z.string().optional(), // Optional patient name if provided from Flutter
});

// GET /api/appointments - Get appointments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ayursutraId = searchParams.get("ayursutraId");
    const status = searchParams.get("status");

    if (!ayursutraId) {
      return NextResponse.json(
        { error: "AyurSutra ID is required" },
        { status: 400 }
      );
    }

    let query = db
      .select()
      .from(appointments)
      .where(
        eq(appointments.patientAyursutraId, ayursutraId) ||
          eq(appointments.doctorAyursutraId, ayursutraId)
      );

    const appointmentsList = await query.orderBy(appointments.dateTime);

    return NextResponse.json({
      success: true,
      appointments: appointmentsList,
      count: appointmentsList.length,
    });
  } catch (error) {
    console.error("Get appointments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Create new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createAppointmentSchema.parse(body);

    const appointmentId = await generateAppointmentId();

    // Get user IDs from AyurSutra IDs (for foreign keys)
    // Note: You'll need to implement getUserByAyurSutraId if not already done
    const patientId = 1; // Placeholder - get from ayursutraId
    const doctorId = 2; // Placeholder - get from ayursutraId

    // Get patient user information to include their name
    let patientName = validatedData.patientName;

    // If patient name wasn't provided in request, try to fetch from database
    if (!patientName) {
      const patientUser = await getUserByAyurSutraId(
        validatedData.patientAyursutraId
      );
      patientName = patientUser?.name || validatedData.patientAyursutraId;
    }

    const appointment = await db
      .insert(appointments)
      .values({
        appointmentId,
        patientId,
        doctorId,
        patientAyursutraId: validatedData.patientAyursutraId,
        doctorAyursutraId: validatedData.doctorAyursutraId,
        dateTime: new Date(validatedData.dateTime),
        notes: validatedData.notes,
        treatmentType: validatedData.treatmentType,
        duration: validatedData.duration,
        status: "pending",
      })
      .returning();

    // Create notification for doctor
    await createNotification({
      senderAyursutraId: validatedData.patientAyursutraId,
      receiverAyursutraId: validatedData.doctorAyursutraId,
      type: "appointment_request",
      title: "New Appointment Request",
      message: `You have a new appointment request from ${patientName} (${validatedData.patientAyursutraId})`,
      data: {
        appointmentId: appointment[0].appointmentId,
        dateTime: validatedData.dateTime,
        treatmentType: validatedData.treatmentType,
        patientName: patientName,
        patientAyursutraId: validatedData.patientAyursutraId,
      },
      priority: "high",
    });

    return NextResponse.json({
      success: true,
      appointment: appointment[0],
      message: "Appointment created successfully",
    });
  } catch (error) {
    console.error("Create appointment error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
