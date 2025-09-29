// Utility functions for Ably real-time notification integration
// This prepares the foundation for pushing notifications to doctors via their AyurSutra IDs

import { createNotification } from "@/lib/ayursutra-id";

interface AblyNotificationData {
  notificationId: string;
  senderAyursutraId: string;
  receiverAyursutraId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  priority: "low" | "medium" | "high";
  timestamp: string;
}

/**
 * Send notification to doctor and prepare for Ably real-time push
 * This function handles the complete flow you described:
 * Button Click → Send to Doctor's AyurSutra ID → Store in DB → Ready for Ably Push
 */
export async function sendNotificationToDoctor(
  senderAyursutraId: string,
  doctorAyursutraId: string,
  type: string,
  title: string,
  message: string,
  additionalData: any = {},
  priority: "low" | "medium" | "high" = "medium"
): Promise<{ success: boolean; notificationId?: string; error?: string }> {
  try {
    // Step 1: Store notification in database
    const notification = await createNotification({
      senderAyursutraId,
      receiverAyursutraId: doctorAyursutraId,
      type: type as any,
      title,
      message,
      data: additionalData,
      priority: priority as any,
    });

    if (!notification) {
      return { success: false, error: "Failed to create notification" };
    }

    // Step 2: Prepare Ably channel data
    const ablyData: AblyNotificationData = {
      notificationId: notification.notificationId,
      senderAyursutraId,
      receiverAyursutraId: doctorAyursutraId,
      type,
      title,
      message,
      data: additionalData,
      priority,
      timestamp: new Date().toISOString(),
    };

    // Step 3: Push to Ably channel (when integrated)
    const channelName = `doctor_${doctorAyursutraId}`;

    // Notification stored and ready for real-time push

    // TODO: Integrate Ably here
    // const ably = new Ably.Realtime({ key: process.env.ABLY_API_KEY });
    // const channel = ably.channels.get(channelName);
    // await channel.publish('notification', ablyData);

    return {
      success: true,
      notificationId: notification.notificationId,
    };
  } catch (error) {
    console.error("Error sending notification to doctor:", error);
    return { success: false, error: "Failed to send notification" };
  }
}

/**
 * Get channel name for a doctor's AyurSutra ID
 * This ensures consistent channel naming for Ably integration
 */
export function getDoctorChannelName(doctorAyursutraId: string): string {
  return `doctor_${doctorAyursutraId}`;
}

/**
 * Get channel name for a patient's AyurSutra ID
 */
export function getPatientChannelName(patientAyursutraId: string): string {
  return `patient_${patientAyursutraId}`;
}

/**
 * Prepare notification data for Ably real-time push
 */
export function prepareAblyNotificationData(
  notificationId: string,
  senderAyursutraId: string,
  receiverAyursutraId: string,
  type: string,
  title: string,
  message: string,
  data: any = {},
  priority: "low" | "medium" | "high" = "medium"
): AblyNotificationData {
  return {
    notificationId,
    senderAyursutraId,
    receiverAyursutraId,
    type,
    title,
    message,
    data,
    priority,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Common notification types for AyurSutra platform
 */
export const NOTIFICATION_TYPES = {
  APPOINTMENT_REQUEST: "appointment_request",
  APPOINTMENT_CONFIRMED: "appointment_confirmed",
  APPOINTMENT_CANCELLED: "appointment_cancelled",
  APPOINTMENT_REMINDER: "appointment_reminder",
  PRESCRIPTION_READY: "prescription_ready",
  FOLLOW_UP_REQUIRED: "follow_up_required",
  SYSTEM_MESSAGE: "system_message",
} as const;

/**
 * Example usage for appointment booking notification
 */
export async function sendAppointmentRequest(
  patientAyursutraId: string,
  doctorAyursutraId: string,
  doctorName: string,
  appointmentDateTime: string
) {
  return await sendNotificationToDoctor(
    patientAyursutraId,
    doctorAyursutraId,
    NOTIFICATION_TYPES.APPOINTMENT_REQUEST,
    "New Appointment Request",
    `A patient would like to book an appointment with you for ${appointmentDateTime}`,
    {
      doctorName,
      appointmentDateTime,
      patientAyursutraId,
      requestedAt: new Date().toISOString(),
    },
    "high"
  );
}
