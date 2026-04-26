const fs = require('fs');
const file = 'src/components/NotificationIcon.tsx';
let content = fs.readFileSync(file, 'utf8');

// Target 1
content = content.replace(
  'export default function NotificationIcon() {',
  '// Module-level singleton to prevent React Strict Mode multiple-instantiation crashes\nlet ablyInstance: Ably.Realtime | null = null;\nlet currentAyursutraId: string | null = null;\n\nexport default function NotificationIcon() {'
);

// Target 2
const oldInit = `    // Initialize Ably connection
    let ably: Ably.Realtime | null = null;
    try {
      ably = new Ably.Realtime({
        authCallback: async (tokenParams, callback) => {
          try {
            const response = await fetch(
              \`/api/ably/auth?ayursutraId=\${userAyursutraId}\`,
              { 
                method: "POST",
                headers: { "Content-Type": "application/json" }
              }
            );
            if (!response.ok) {
              throw new Error(\`Auth failed: \${response.statusText}\`);
            }
            const tokenRequest = await response.json();
            callback(null, tokenRequest);
          } catch (error) {
            console.error("Ably authCallback error:", error);
            callback(String(error), null);
          }
        },
      });
    } catch (error) {
      console.error("Failed to initialize Ably connection:", error);
      return;
    }

    if (!ably) return;`;

const newInit = `    // Singleton pattern for Ably
    if (!ablyInstance || currentAyursutraId !== userAyursutraId) {
      if (ablyInstance) {
        try { ablyInstance.close(); } catch (e) {}
      }
      
      currentAyursutraId = userAyursutraId;
      ablyInstance = new Ably.Realtime({
        authCallback: async (tokenParams, callback) => {
          try {
            const response = await fetch(
              \`/api/ably/auth?ayursutraId=\${userAyursutraId}\`,
              { 
                method: "POST",
                headers: { "Content-Type": "application/json" }
              }
            );
            if (!response.ok) {
              throw new Error(\`Auth failed: \${response.statusText}\`);
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

    const ably = ablyInstance;`;

content = content.replace(oldInit, newInit);

// Target 3: Replace event listeners and cleanup
const oldListeners = `    // Connection status
    ably.connection.on("connected", () => {
      console.log("[ABLY] Connected successfully to Ably servers!");
      setIsConnected(true);
    });

    ably.connection.on("disconnected", () => {
      console.log("[ABLY] Disconnected from Ably servers.");
      setIsConnected(false);
    });

    ably.connection.on("failed", (error) => {
      setIsConnected(false);
      console.error("Ably connection failed:", error);
    });

    // Listen for new notifications
    channel.subscribe("new-notification", (message) => {
      console.log("[ABLY] Received new-notification event!", message.data);
      setUnreadCount((prev) => prev + 1);

      const notificationData = message.data;

      // Show toast notification
      showToast({
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type === "appointment_request" ? "appointment" : "info",
        data: notificationData,
      });

      // Show browser notification if permitted
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification(notificationData.title, {
          body: notificationData.message,
          icon: "/ayur.svg",
          tag: notificationData.notificationId,
        });
      }

      // Play notification sound for appointment requests
      if (message.data.type === "appointment_request") {
        try {
          const audio = new Audio("/notification-sound.mp3");
          audio.volume = 0.3;
          audio.play().catch(() => {});
        } catch (error) {}
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
    };`;

const newListeners = `    // Track connection status
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
    };`;

content = content.replace(oldListeners, newListeners);

fs.writeFileSync(file, content);
console.log('Patch applied.');
