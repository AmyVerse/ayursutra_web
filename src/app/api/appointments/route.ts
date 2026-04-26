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
import * as Ably from "ably";

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

    // Get patient user information
    const patientUser = await getUserByAyurSutraId(validatedData.patientAyursutraId);
    if (!patientUser) {
      return NextResponse.json(
        { error: "Patient AyurSutra ID not found" },
        { status: 404 }
      );
    }
    const patientId = patientUser.id;
    const patientName = validatedData.patientName || patientUser.name || validatedData.patientAyursutraId;

    // Get doctor user information
    const doctorUser = await getUserByAyurSutraId(validatedData.doctorAyursutraId);
    if (!doctorUser) {
      return NextResponse.json(
        { error: "Doctor AyurSutra ID not found" },
        { status: 404 }
      );
    }
    const doctorId = doctorUser.id;

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
    const notification = await createNotification({
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

    // Send real-time notification via Ably
    try {
      const ablyApiKey = process.env.ABLY_API_KEY;
      if (ablyApiKey) {
        const ably = new Ably.Rest(ablyApiKey);
        const channelName = `notifications:${validatedData.doctorAyursutraId}`;
        const channel = ably.channels.get(channelName);

        const messageData = {
          notificationId: notification.notificationId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          priority: notification.priority,
          senderAyursutraId: notification.senderAyursutraId,
          senderName: patientName,
          receiverAyursutraId: notification.receiverAyursutraId,
          receiverName: "Doctor", // Default placeholder
          data: notification.data,
          createdAt: notification.createdAt,
        };

        console.log(`[ABLY] Publishing new-notification to channel ${channelName}`);
        await channel.publish("new-notification", messageData);
        console.log(`[ABLY] Successfully published to ${channelName}`);
      } else {
        console.warn("[ABLY] ABLY_API_KEY is not defined in environment variables");
      }
    } catch (ablyError) {
      console.error("[ABLY] Appointment notification error:", ablyError);
      // Don't fail the entire request if Ably fails
    }

    return NextResponse.json({
      success: true,
      appointment: appointment[0],
      message: "Appointment created successfully",
    });
  } catch (error) {
    console.error("Create appointment error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
