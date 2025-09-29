import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifications, users } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/notifications/mark-all-read - Mark all notifications as read for user
export async function PATCH(request: NextRequest) {
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

    // Mark all unread notifications as read
    const updatedNotifications = await db
      .update(notifications)
      .set({
        status: "read",
        readAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(notifications.receiverAyursutraId, userAyursutraId),
          eq(notifications.status, "unread")
        )
      )
      .returning();

    return NextResponse.json({
      success: true,
      message: `${updatedNotifications.length} notifications marked as read`,
      updatedCount: updatedNotifications.length,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mark notifications as read" },
      { status: 500 }
    );
  }
}
