import {
  createNotification,
  getNotificationsForUser,
  getUserByAyurSutraId,
} from "@/lib/ayursutra-id";
import * as Ably from "ably";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createNotificationSchema = z.object({
  senderAyursutraId: z.string().min(1),
  receiverAyursutraId: z.string().min(1),
  type: z.enum([
    "appointment_request",
    "appointment_confirmed",
    "appointment_cancelled",
    "appointment_rescheduled",
    "appointment_reminder",
    "treatment_update",
    "prescription_ready",
    "general",
  ]),
  title: z.string().min(1),
  message: z.string().min(1),
  data: z.any().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  scheduledFor: z.string().optional(),
});

// GET /api/notifications - Get notifications for user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ayursutraId = searchParams.get("ayursutraId");
    const status = searchParams.get("status") as
      | "unread"
      | "read"
      | "archived"
      | null;
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!ayursutraId) {
      return NextResponse.json(
        { error: "AyurSutra ID is required" },
        { status: 400 }
      );
    }

    let notifications = await getNotificationsForUser(
      ayursutraId,
      status || undefined,
      limit
    );

    // Enhance notifications with sender and receiver names
    const enhancedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        const senderUser = await getUserByAyurSutraId(
          notification.senderAyursutraId
        );

        return {
          ...notification,
          senderName: senderUser?.name || notification.senderAyursutraId,
        };
      })
    );

    return NextResponse.json({
      success: true,
      notifications: enhancedNotifications,
      count: enhancedNotifications.length,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create new notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createNotificationSchema.parse(body);

    const notification = await createNotification({
      ...validatedData,
      scheduledFor: validatedData.scheduledFor
        ? new Date(validatedData.scheduledFor)
        : undefined,
    });

    // Send real-time notification via Ably
    try {
      const ablyApiKey = process.env.ABLY_API_KEY;
      if (ablyApiKey) {
        // Get sender and receiver names for enhanced notification data
        const senderUser = await getUserByAyurSutraId(
          validatedData.senderAyursutraId
        );
        const receiverUser = await getUserByAyurSutraId(
          validatedData.receiverAyursutraId
        );

        const senderName = senderUser?.name || validatedData.senderAyursutraId;
        const receiverName =
          receiverUser?.name || validatedData.receiverAyursutraId;

        const ably = new Ably.Rest(ablyApiKey);
        const channelName = `notifications:${validatedData.receiverAyursutraId}`;
        const channel = ably.channels.get(channelName);

        const messageData = {
          notificationId: notification.notificationId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          priority: notification.priority,
          senderAyursutraId: notification.senderAyursutraId,
          senderName: senderName,
          receiverAyursutraId: notification.receiverAyursutraId,
          receiverName: receiverName,
          data: notification.data,
          createdAt: notification.createdAt,
        };

        await channel.publish("new-notification", messageData);
      }
    } catch (ablyError) {
      console.error("Ably notification error:", ablyError);
      // Don't fail the entire request if Ably fails
    }

    return NextResponse.json({
      success: true,
      notification,
      message: "Notification created successfully",
    });
  } catch (error) {
    console.error("Create notification error:", error);

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
