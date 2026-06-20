import { Link, useLocation } from "react-router-dom";
import { Bell, LogOut, Moon, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { getRouteLabel } from "@/constants/navigation";
import { formatToday } from "@/utils/format";
import { getUnreadCount } from "@/services/notifications.service";

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const [unread, setUnread] = useState(0);
  const pageLabel = getRouteLabel(pathname);

  useEffect(() => {
    getUnreadCount()
      .then(setUnread)
      .catch(() => setUnread(0));
  }, [pathname]);

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

        <Link to="/notifications" className="admin-icon-btn relative" aria-label="Notifications">
          <Bell className="h-[18px] w-[18px]" />
          {unread > 0 ? (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[var(--navbar-bg)]" />
          ) : (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-400 ring-2 ring-[var(--navbar-bg)]" />
          )}
        </Link>

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
