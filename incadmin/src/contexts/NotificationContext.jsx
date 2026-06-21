import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { getAccessToken } from "@/services/apiClient";
import { API_BASE } from "@/config/env";
import {
  getUnreadCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  deleteNotification,
} from "@/services/notifications.service";

const NotificationContext = createContext(null);

const SOCKET_EVENTS = {
  CONNECTED: "notification:connected",
  NEW: "notification:new",
  UNREAD_COUNT: "notification:unread_count",
  MARKED_READ: "notification:marked_read",
  ALL_READ: "notification:all_read",
};

function resolveSocketUrl() {
  const explicit = import.meta.env.VITE_SOCKET_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  if (/^https?:\/\//.test(API_BASE)) {
    return API_BASE.replace(/\/api$/, "");
  }

  // Dev fallback: hit backend directly and avoid Vite WS proxy noise.
  return "http://localhost:5000";
}

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [recent, setRecent] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  // Fetch initial unread count + recent notifications via HTTP
  const fetchInitial = useCallback(async () => {
    try {
      const [count, { data: items }] = await Promise.all([
        getUnreadCount(),
        listNotifications({ limit: 5 }),
      ]);
      setUnreadCount(count ?? 0);
      setRecent(items ?? []);
    } catch {
      // Silently fail — socket will catch up
    }
  }, []);

  // Connect to Socket.IO when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setUnreadCount(0);
      setRecent([]);
      return;
    }

    fetchInitial();

    const token = getAccessToken();
    if (!token) return;

    const socket = io(resolveSocketUrl(), {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      auth: { token },
      reconnection: true,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on(SOCKET_EVENTS.NEW, (notification) => {
      setUnreadCount((c) => c + 1);
      setRecent((prev) => [notification, ...prev].slice(0, 10));
    });

    socket.on(SOCKET_EVENTS.UNREAD_COUNT, ({ count }) => {
      setUnreadCount(count);
    });

    socket.on(SOCKET_EVENTS.MARKED_READ, ({ id }) => {
      // Don't decrement count here — UNREAD_COUNT event already sets the correct count
      setRecent((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    });

    socket.on(SOCKET_EVENTS.ALL_READ, () => {
      setUnreadCount(0);
      setRecent((prev) => prev.map((n) => ({ ...n, isRead: true })));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, fetchInitial]);

  // Actions — only call the API; socket events handle state updates
  const markRead = useCallback(async (id) => {
    await markNotificationRead(id);
  }, []);

  const markAllRead = useCallback(async () => {
    await markAllNotificationsRead();
  }, []);

  const remove = useCallback(async (id) => {
    await deleteNotification(id);
  }, []);

  const refresh = useCallback(async () => {
    await fetchInitial();
  }, [fetchInitial]);

  const value = useMemo(
    () => ({
      unreadCount,
      recent,
      connected,
      markRead,
      markAllRead,
      remove,
      refresh,
    }),
    [unreadCount, recent, connected, markRead, markAllRead, remove, refresh]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return ctx;
}
