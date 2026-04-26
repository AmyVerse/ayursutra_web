"use client";

import * as Ably from "ably";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
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

// Module-level singleton to prevent React Strict Mode multiple-instantiation crashes
let ablyInstance: Ably.Realtime | null = null;
let currentAyursutraId: string | null = null;

export default function NotificationIcon() {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (!session?.user) return;

    const userAyursutraId = session.user?.ayursutraId;
    if (!userAyursutraId) return;

    // Fetch initial unread count
    fetchUnreadCount();

    // Singleton pattern for Ably
    if (!ablyInstance || currentAyursutraId !== userAyursutraId) {
      if (ablyInstance) {
        try { ablyInstance.close(); } catch (e) {}
      }
      
      currentAyursutraId = userAyursutraId;
      ablyInstance = new Ably.Realtime({
        authCallback: async (tokenParams, callback) => {
          try {
            const response = await fetch(
              `/api/ably/auth?ayursutraId=${userAyursutraId}`,
              { 
                method: "POST",
                headers: { "Content-Type": "application/json" }
              }
            );
            if (!response.ok) {
              throw new Error(`Auth failed: ${response.statusText}`);
            }
            const tokenRequest = await response.json();
            callback(null, tokenRequest);
          } catch (error) {
            console.error("Ably authCallback error:", error);
            callback(String(error), null);
          }
        },
      });
    }

    const ably = ablyInstance;

    const channelName = `notifications:${userAyursutraId}`;
    const channel = ably.channels.get(channelName);

    // Track connection status
    const onConnected = () => {
      console.log("[ABLY] Connected successfully to Ably servers!");
      setIsConnected(true);
    };
    const onDisconnected = () => {
      console.log("[ABLY] Disconnected from Ably servers.");
      setIsConnected(false);
    };
    const onFailed = (error: any) => {
      console.error("Ably connection failed:", error);
      setIsConnected(false);
    };

    ably.connection.on("connected", onConnected);
    ably.connection.on("disconnected", onDisconnected);
    ably.connection.on("failed", onFailed);
    
    // Set initial state
    setIsConnected(ably.connection.state === "connected");

    // Listen for new notifications
    const onNewNotification = (message: Ably.InboundMessage) => {
      console.log("[ABLY] Received new-notification event!", message.data);
      setUnreadCount((prev) => prev + 1);

      const notificationData = message.data as any;

      // Show toast notification
      showToast({
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type === "appointment_request" ? "appointment" : "info",
        data: notificationData,
      });

      // Show browser notification if permitted
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification(notificationData.title, {
          body: notificationData.message,
          icon: "/ayur.svg",
          tag: notificationData.notificationId,
        });
      }

      // Play notification sound for appointment requests
      if (notificationData.type === "appointment_request") {
        try {
          const audio = new Audio("/notification-sound.mp3");
          audio.volume = 0.3;
          audio.play().catch(() => {});
        } catch (error) {}
      }
    };

    channel.subscribe("new-notification", onNewNotification);

    // Listen for notification read updates
    const onNotificationRead = (message: Ably.InboundMessage) => {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    };
    
    channel.subscribe("notification-read", onNotificationRead);

    // Request notification permission
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      // Clean up specifically the listeners we just added!
      channel.unsubscribe("new-notification", onNewNotification);
      channel.unsubscribe("notification-read", onNotificationRead);
      
      ably.connection.off("connected", onConnected);
      ably.connection.off("disconnected", onDisconnected);
      ably.connection.off("failed", onFailed);
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
