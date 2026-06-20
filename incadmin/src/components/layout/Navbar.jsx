import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, CheckCheck, LogOut, Moon, Search, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { getRouteLabel } from "@/constants/navigation";
import { formatToday, timeAgo } from "@/utils/format";

const TYPE_ICONS = {
  admission_new: "📋",
  contact_new: "✉️",
  admission_status: "🔄",
  system: "⚙️",
};

function NotificationItem({ notification, onMarkRead }) {
  return (
    <div
      className={`flex gap-3 rounded-lg p-3 transition-colors ${
        notification.isRead
          ? "bg-transparent"
          : "bg-emerald-50/50 dark:bg-emerald-500/5"
      }`}
    >
      <span className="mt-0.5 text-base leading-none">
        {TYPE_ICONS[notification.type] ?? "🔔"}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-sm leading-tight ${notification.isRead ? "text-[var(--text-muted)]" : "font-semibold text-[var(--color-brand-dark)]"}`}>
          {notification.title}
        </p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)] line-clamp-2">
          {notification.message}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[11px] text-slate-400">
            {timeAgo(notification.createdAt)}
          </span>
          {!notification.isRead && (
            <button
              type="button"
              className="text-[11px] font-medium text-[var(--color-brand-primary)] hover:underline"
              onClick={() => onMarkRead(notification.id)}
            >
              Mark read
            </button>
          )}
        </div>
      </div>
      {!notification.isRead && (
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-brand-primary)]" />
      )}
    </div>
  );
}

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const pageLabel = getRouteLabel(pathname);

  const { unreadCount, recent, markRead, markAllRead } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  function handleMarkRead(id) {
    markRead(id);
  }

  function handleMarkAll() {
    markAllRead();
  }

  function handleViewAll() {
    setDropdownOpen(false);
    navigate("/notifications");
  }

  return (
    <header className="admin-navbar shrink-0">
      <div className="flex min-w-0 flex-1 items-center gap-5">
        <nav className="hidden shrink-0 items-center gap-2 text-sm sm:flex">
          <Link to="/dashboard" className="text-[var(--text-muted)] transition-colors hover:text-[var(--color-brand-dark)]">
            Home
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          <span className="font-semibold text-[var(--color-brand-dark)]">{pageLabel}</span>
        </nav>

        <label className="relative min-w-0 flex-1 max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="search"
            className="admin-search-input w-full"
            placeholder="Search anything..."
            aria-label="Search"
          />
        </label>
      </div>

      <div className="flex shrink-0 items-center gap-3 md:gap-4">
        <p className="hidden text-sm text-[var(--text-muted)] xl:block">{formatToday()}</p>

        <button
          type="button"
          onClick={toggleTheme}
          className="admin-icon-btn"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
        </button>

        {/* Notification bell with dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            className="admin-icon-btn relative"
            aria-label="Notifications"
            onClick={() => setDropdownOpen((v) => !v)}
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-[var(--navbar-bg)]">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--color-surface)] shadow-xl sm:w-96">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
                <h3 className="text-sm font-bold text-[var(--color-brand-dark)]">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </h3>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="text-xs font-medium text-[var(--color-brand-primary)] hover:underline"
                    onClick={handleMarkAll}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification list */}
              <div className="max-h-80 overflow-y-auto p-2">
                {recent.length > 0 ? (
                  <div className="space-y-1">
                    {recent.map((n) => (
                      <NotificationItem
                        key={n.id}
                        notification={n}
                        onMarkRead={handleMarkRead}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-8 text-center">
                    <Bell className="h-8 w-8 text-[var(--text-muted)] opacity-40" />
                    <p className="text-sm text-[var(--text-muted)]">
                      No notifications yet
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-[var(--border-subtle)] p-2">
                <button
                  type="button"
                  className="w-full rounded-lg py-2 text-center text-sm font-medium text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)]/5"
                  onClick={handleViewAll}
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="hidden h-8 w-px bg-[var(--sidebar-border)] md:block" />

        <div className="hidden items-center gap-3 md:flex">
          <div className="avatar placeholder">
            <div className="w-10 rounded-full bg-[var(--color-brand-primary)] text-white">
              <span className="text-sm">{user?.name?.charAt(0) ?? "A"}</span>
            </div>
          </div>
          <div className="hidden text-left lg:block">
            <p className="text-sm font-semibold leading-tight text-[var(--color-brand-dark)]">
              {user?.name ?? "Administrator"}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {user?.email ?? "admin@itahari-namuna.edu.np"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void logout()}
          className="admin-icon-btn"
          aria-label="Logout"
        >
          <LogOut className="h-[18px] w-[18px]" />
        </button>
      </div>
    </header>
  );
}
