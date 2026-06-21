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
  getUnreadBreakdown,
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
  const [unreadBreakdown, setUnreadBreakdown] = useState({
    total: 0,
    admissions: 0,
    contacts: 0,
  });
  const [recent, setRecent] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  const fetchBreakdown = useCallback(async () => {
    try {
      const breakdown = await getUnreadBreakdown();
      setUnreadBreakdown(breakdown);
      if (typeof breakdown?.total === "number") {
        setUnreadCount(breakdown.total);
      }
    } catch {
      // Ignore temporary sync failures
    }
  }, []);

  const decrementFromNotification = useCallback((notification) => {
    if (!notification || notification.isRead) return;

    setUnreadCount((count) => Math.max(0, (count ?? 0) - 1));
    setUnreadBreakdown((prev) => {
      const next = {
        total: Math.max(0, (prev?.total ?? 0) - 1),
        admissions: prev?.admissions ?? 0,
        contacts: prev?.contacts ?? 0,
      };

      if (notification.type === "admission_new" || notification.type === "admission_status") {
        next.admissions = Math.max(0, next.admissions - 1);
      } else if (notification.type === "contact_new") {
        next.contacts = Math.max(0, next.contacts - 1);
      }

      return next;
    });
  }, []);

  // Fetch initial unread count + recent notifications via HTTP
  const fetchInitial = useCallback(async () => {
    try {
      const [count, breakdown, { data: items }] = await Promise.all([
        getUnreadCount(),
        getUnreadBreakdown(),
        listNotifications({ limit: 5 }),
      ]);
      setUnreadCount(count ?? 0);
      setUnreadBreakdown(
        breakdown ?? {
          total: count ?? 0,
          admissions: 0,
          contacts: 0,
        }
      );
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
      setUnreadBreakdown({ total: 0, admissions: 0, contacts: 0 });
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
      setUnreadBreakdown((prev) => {
        const next = {
          ...prev,
          total: (prev.total ?? 0) + 1,
        };

        if (notification?.type === "admission_new" || notification?.type === "admission_status") {
          next.admissions = (prev.admissions ?? 0) + 1;
        } else if (notification?.type === "contact_new") {
          next.contacts = (prev.contacts ?? 0) + 1;
        }

        return next;
      });
      setRecent((prev) => [notification, ...prev].slice(0, 10));
    });

    socket.on(SOCKET_EVENTS.UNREAD_COUNT, ({ count }) => {
      setUnreadCount(count);
      void fetchBreakdown();
    });

    socket.on(SOCKET_EVENTS.MARKED_READ, ({ id }) => {
      // Don't decrement count here — UNREAD_COUNT event already sets the correct count
      setRecent((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      void fetchBreakdown();
    });

    socket.on(SOCKET_EVENTS.ALL_READ, () => {
      setUnreadCount(0);
      setUnreadBreakdown({ total: 0, admissions: 0, contacts: 0 });
      setRecent((prev) => prev.map((n) => ({ ...n, isRead: true })));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, fetchInitial, fetchBreakdown]);

  // Actions — only call the API; socket events handle state updates
  const markRead = useCallback(async (id) => {
    const target = recent.find((notification) => notification.id === id);

    setRecent((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
    decrementFromNotification(target);

    try {
      await markNotificationRead(id);
      void fetchBreakdown();
    } catch (error) {
      await fetchInitial();
      throw error;
    }
  }, [recent, decrementFromNotification, fetchBreakdown, fetchInitial]);

  const markAllRead = useCallback(async () => {
    const previousRecent = recent;

    setRecent((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
    setUnreadCount(0);
    setUnreadBreakdown({ total: 0, admissions: 0, contacts: 0 });

    try {
      await markAllNotificationsRead();
    } catch (error) {
      setRecent(previousRecent);
      await fetchInitial();
      throw error;
    }
  }, [recent, fetchInitial]);

  const remove = useCallback(async (id) => {
    const target = recent.find((notification) => notification.id === id);

    setRecent((prev) => prev.filter((notification) => notification.id !== id));
    decrementFromNotification(target);

    try {
      await deleteNotification(id);
      void fetchBreakdown();
    } catch (error) {
      await fetchInitial();
      throw error;
    }
  }, [recent, decrementFromNotification, fetchBreakdown, fetchInitial]);

  const refresh = useCallback(async () => {
    await fetchInitial();
  }, [fetchInitial]);

  const value = useMemo(
    () => ({
      unreadCount,
      unreadBreakdown,
      recent,
      connected,
      markRead,
      markAllRead,
      remove,
      refresh,
    }),
    [unreadCount, unreadBreakdown, recent, connected, markRead, markAllRead, remove, refresh]
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
