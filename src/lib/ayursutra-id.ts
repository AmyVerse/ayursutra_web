import { db } from "@/lib/db";
import { appointments, notifications, users } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";

/**
 * Generate AyurSutra ID for users
 * Format: AS-D-12345 (Doctor) or AS-P-12345 (Patient)
 */
export async function generateAyurSutraId(
  role: "patient" | "doctor"
): Promise<string> {
  const prefix = role === "doctor" ? "AS-D-" : "AS-P-";
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    // Generate random 5-digit number
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    const ayursutraId = `${prefix}${randomNumber}`;

    // Check if this ID already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.ayursutraId, ayursutraId))
      .limit(1);

    if (existingUser.length === 0) {
      return ayursutraId;
    }

    attempts++;
  }

  // Fallback with timestamp if all attempts fail
  const timestamp = Date.now().toString().slice(-5);
  return `${prefix}${timestamp}`;
}

/**
 * Generate Appointment ID
 * Format: AS-APT-12345
 */
export async function generateAppointmentId(): Promise<string> {
  const prefix = "AS-APT-";
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    // Generate random 5-digit number
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    const appointmentId = `${prefix}${randomNumber}`;

    // Check if this ID already exists
    const existingAppointment = await db
      .select()
      .from(appointments)
      .where(eq(appointments.appointmentId, appointmentId))
      .limit(1);

    if (existingAppointment.length === 0) {
      return appointmentId;
    }

    attempts++;
  }

  // Fallback with timestamp if all attempts fail
  const timestamp = Date.now().toString().slice(-5);
  return `${prefix}${timestamp}`;
}

/**
 * Generate Notification ID
 * Format: AS-NOT-12345
 */
export async function generateNotificationId(): Promise<string> {
  const prefix = "AS-NOT-";
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    // Generate random 5-digit number
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    const notificationId = `${prefix}${randomNumber}`;

    // Check if this ID already exists
    const existingNotification = await db
      .select()
      .from(notifications)
      .where(eq(notifications.notificationId, notificationId))
      .limit(1);

    if (existingNotification.length === 0) {
      return notificationId;
    }

    attempts++;
  }

  // Fallback with timestamp if all attempts fail
  const timestamp = Date.now().toString().slice(-5);
  return `${prefix}${timestamp}`;
}

/**
 * Get user by AyurSutra ID
 */
export async function getUserByAyurSutraId(ayursutraId: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.ayursutraId, ayursutraId))
    .limit(1);

  return user.length > 0 ? user[0] : null;
}

/**
 * Get appointment by Appointment ID
 */
export async function getAppointmentById(appointmentId: string) {
  const appointment = await db
    .select()
    .from(appointments)
    .where(eq(appointments.appointmentId, appointmentId))
    .limit(1);

  return appointment.length > 0 ? appointment[0] : null;
}

/**
 * Create notification
 */
export async function createNotification({
  senderAyursutraId,
  receiverAyursutraId,
  type,
  title,
  message,
  data,
  priority = "medium",
  scheduledFor,
}: {
  senderAyursutraId: string;
  receiverAyursutraId: string;
  type:
    | "appointment_request"
    | "appointment_confirmed"
    | "appointment_cancelled"
    | "appointment_rescheduled"
    | "appointment_reminder"
    | "treatment_update"
    | "prescription_ready"
    | "general";
  title: string;
  message: string;
  data?: any;
  priority?: "low" | "medium" | "high" | "urgent";
  scheduledFor?: Date;
}) {
  const notificationId = await generateNotificationId();

  const notification = await db
    .insert(notifications)
    .values({
      notificationId,
      senderAyursutraId,
      receiverAyursutraId,
      type,
      title,
      message,
      data: data ? JSON.stringify(data) : null,
      priority,
      scheduledFor,
    })
    .returning();

  return notification[0];
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  return await db
    .update(notifications)
    .set({
      status: "read",
      readAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(notifications.notificationId, notificationId))
    .returning();
}

/**
 * Generate and assign AyurSutra ID to existing user
 */
export async function assignAyurSutraId(
  userId: number,
  role: "patient" | "doctor"
) {
  const ayursutraId = await generateAyurSutraId(role);

  const updatedUser = await db
    .update(users)
    .set({
      ayursutraId,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return updatedUser[0];
}

/**
 * Get notifications for user
 */
export async function getNotificationsForUser(
  ayursutraId: string,
  status?: "unread" | "read" | "archived",
  limit = 50
) {
  const whereConditions = status
    ? and(
        eq(notifications.receiverAyursutraId, ayursutraId),
        eq(notifications.status, status)
      )
    : eq(notifications.receiverAyursutraId, ayursutraId);

  return await db
    .select()
    .from(notifications)
    .where(whereConditions)
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}
