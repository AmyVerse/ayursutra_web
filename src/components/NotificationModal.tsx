"use client";

import { AlertCircle, Bell, CheckCheck, Clock, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  unreadCount: number;
}

// This is a simplified modal component that will be managed by NotificationIcon
export default function NotificationModal(props: NotificationModalProps) {
  const { isOpen, onClose, unreadCount } = props;
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (isOpen && session?.user) {
      fetchNotifications();
    }
  }, [isOpen, session?.user, filter]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      if (!session?.user) return;
      const userAyursutraId = session.user?.ayursutraId;
      if (!userAyursutraId) return;

      const params = new URLSearchParams();
      params.append("ayursutraId", userAyursutraId);
      if (filter === "unread") {
        params.append("status", "unread");
      }

      const response = await fetch(`/api/notifications?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(
        `/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.notificationId === notificationId
              ? {
                  ...notification,
                  status: "read" as const,
                  readAt: new Date().toISOString(),
                }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "PATCH",
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) => ({
            ...notification,
            status: "read" as const,
            readAt: notification.readAt || new Date().toISOString(),
          }))
        );
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-[9998] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-80 md:w-96 bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Notifications
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border-b border-gray-100 space-y-2 sm:space-y-0">
          <div className="flex space-x-2 w-full sm:w-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-initial ${
                filter === "all"
                  ? "bg-teal-100 text-teal-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-initial ${
                filter === "unread"
                  ? "bg-teal-100 text-teal-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Unread
            </button>
          </div>
          <button
            onClick={markAllAsRead}
            className="px-3 py-1.5 text-xs sm:text-sm text-teal-600 hover:text-teal-800 transition-colors w-full sm:w-auto text-center sm:text-left"
          >
            Mark all read
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <Bell className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-500 text-sm">
                You're all caught up! New notifications will appear here.
              </p>
            </div>
          ) : (
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 sm:p-4 rounded-lg border transition-colors cursor-pointer ${
                    notification.status === "unread"
                      ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => markAsRead(notification.notificationId)}
                >
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div
                      className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                        notification.priority === "urgent"
                          ? "bg-red-100"
                          : notification.priority === "high"
                            ? "bg-orange-100"
                            : notification.priority === "medium"
                              ? "bg-yellow-100"
                              : "bg-gray-100"
                      }`}
                    >
                      {notification.type === "appointment_request" ? (
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                      ) : notification.type === "appointment_confirmed" ? (
                        <CheckCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </p>
                        {notification.status === "unread" && (
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2"></div>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 sm:mt-2">
                        {formatDateTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
