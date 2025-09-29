"use client";

import * as Ably from "ably";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import NotificationModal from "./NotificationModal";

interface Notification {
  id: number;
  notificationId: string;
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
  data?: string;
  status: "unread" | "read" | "archived";
  priority: "low" | "medium" | "high" | "urgent";
  scheduledFor?: string;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotificationIcon() {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (!session?.user) return;

    const userAyursutraId = session.user?.ayursutraId;
    if (!userAyursutraId) return;

    // Fetch initial unread count
    fetchUnreadCount();

    // Initialize Ably connection
    let ably: Ably.Realtime | null = null;
    try {
      ably = new Ably.Realtime({
        authUrl: `/api/ably/auth?ayursutraId=${userAyursutraId}`,
        authMethod: "GET",
      });
    } catch (error) {
      console.error("Failed to initialize Ably connection:", error);
      return;
    }

    if (!ably) return;

    const channelName = `notifications:${userAyursutraId}`;
    const channel = ably.channels.get(channelName);

    // Connection status
    ably.connection.on("connected", () => {
      setIsConnected(true);
    });

    ably.connection.on("disconnected", () => {
      setIsConnected(false);
    });

    ably.connection.on("failed", (error) => {
      setIsConnected(false);
      console.error("Ably connection failed:", error);
    });

    // Listen for new notifications
    channel.subscribe("new-notification", (message) => {
      setUnreadCount((prev) => prev + 1);

      // Show browser notification if permitted
      if (Notification.permission === "granted") {
        const notificationData = message.data;
        new Notification(notificationData.title, {
          body: notificationData.message,
          icon: "/ayur.svg",
          tag: notificationData.notificationId,
          badge: "/ayur.svg",
        });
      }

      // Play notification sound for appointment requests
      if (message.data.type === "appointment_request") {
        try {
          const audio = new Audio("/notification-sound.mp3");
          audio.volume = 0.3;
          audio.play().catch(() => {
            // Ignore audio play errors
          });
        } catch (error) {
          // Ignore audio errors
        }
      }
    });

    // Listen for notification read updates
    channel.subscribe("notification-read", (message) => {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    });

    // Request notification permission
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      // Clean up subscriptions only - let Ably handle connection lifecycle
      if (channel) {
        try {
          channel.unsubscribe();
        } catch (error) {
          // Silently handle cleanup errors
        }
      }
    };
  }, [session?.user]);

  const fetchUnreadCount = async () => {
    try {
      if (!session?.user) return;
      const userAyursutraId = session.user?.ayursutraId;
      if (!userAyursutraId) return;
      const response = await fetch(
        `/api/notifications?ayursutraId=${userAyursutraId}&status=unread`
      );
      const data = await response.json();

      if (data.success) {
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
      >
        {/* Notification Bell Icon */}
        <Bell className="w-5 h-5 text-gray-700" />

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-semibold shadow-md border border-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}

        {/* Connection Status Indicator */}
        <span
          className={`absolute top-1 left-1 w-2 h-2 rounded-full border border-white shadow-sm ${
            isConnected ? "bg-emerald-400" : "bg-gray-400"
          }`}
          title={isConnected ? "Connected" : "Disconnected"}
        />
      </button>

      <NotificationModal
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        unreadCount={unreadCount}
      />
    </div>
  );
}
