import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import * as Ably from "ably";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// POST /api/notifications/demo - Create demo appointment notification
export async function POST(request: NextRequest) {
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
      .select({ ayursutraId: users.ayursutraId, role: users.role })
      .from(users)
      .where(eq(users.id, parseInt(session.user.id)))
      .limit(1);

    if (!currentUser.length || !currentUser[0].ayursutraId) {
      return NextResponse.json(
        { success: false, error: "User AyurSutra ID not found" },
        { status: 400 }
      );
    }

    const user = currentUser[0];

    // Create demo notification based on user role
    const notificationData =
      user.role === "doctor"
        ? {
            type: "appointment_request",
            title: "New Appointment Request",
            message:
              "A patient has requested a consultation appointment with you",
            senderAyursutraId: "AS-P-DEMO",
            priority: "high",
          }
        : {
            type: "appointment_confirmed",
            title: "Appointment Confirmed",
            message: "Your appointment has been confirmed by Dr. Demo",
            senderAyursutraId: "AS-D-DEMO",
            priority: "medium",
          };

    // Send real-time notification via Ably
    try {
      const ablyApiKey = process.env.ABLY_API_KEY;
      if (ablyApiKey) {
        const ably = new Ably.Rest(ablyApiKey);
        const channel = ably.channels.get(`notifications:${user.ayursutraId}`);

        await channel.publish("new-notification", {
          notificationId: `AS-NOT-DEMO-${Date.now()}`,
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          priority: notificationData.priority,
          senderAyursutraId: notificationData.senderAyursutraId,
          receiverAyursutraId: user.ayursutraId,
          data: JSON.stringify({
            demo: true,
            appointmentType: "consultation",
            requestedAt: new Date().toISOString(),
          }),
          createdAt: new Date().toISOString(),
        });

        // Demo notification sent successfully
      }
    } catch (ablyError) {
      console.error("Ably demo notification error:", ablyError);
      return NextResponse.json(
        { success: false, error: "Failed to send real-time notification" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Demo notification sent successfully",
      notificationData,
      receiverAyursutraId: user.ayursutraId,
    });
  } catch (error) {
    console.error("Error creating demo notification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create demo notification" },
      { status: 500 }
    );
  }
}
