import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Logo, LogoMark } from "@/components/cms/Logo";
import { LOGOUT_ITEM, NAV_SECTIONS } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { cn } from "@/utils/cn";

export function Sidebar({ mobileOpen = false, onMobileClose = () => {} }) {
  const { logout } = useAuth();
  const { unreadBreakdown } = useNotifications();
  const [collapsed, setCollapsed] = useState(false);
  const effectiveCollapsed = collapsed && !mobileOpen;
  const pathCountMap = {
    "/admissions": unreadBreakdown?.admissions ?? 0,
    "/contacts": unreadBreakdown?.contacts ?? 0,
  };

  const formatCountLabel = (count) => {
    if (count <= 0) return "";
    if (count > 99) return "99+ notifications";
    return `${count}`;
  };

  const badgeClassByPath = (path, compact = false) => {
    if (path === "/admissions") {
      return compact
        ? "bg-emerald-500 text-white"
        : "bg-emerald-500 text-white";
    }
    if (path === "/contacts") {
      return compact
        ? "bg-sky-500 text-white"
        : "bg-sky-500 text-white";
    }
    return compact ? "bg-rose-500 text-white" : "bg-rose-500 text-white";
  };

  return (
    <>
      <button
        type="button"
        className={cn(
          "fixed inset-0 z-40 bg-black/45 transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onMobileClose}
        aria-label="Close sidebar"
      />

      <aside
        className={cn(
          "admin-sidebar fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[var(--sidebar-border)] transition-all duration-300 ease-in-out lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:shrink-0 lg:self-start",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          effectiveCollapsed ? "lg:w-[76px]" : "lg:w-[260px]"
        )}
      >
      <div
        className={cn(
          "flex shrink-0 items-center border-b border-[var(--sidebar-border)] py-5",
          effectiveCollapsed ? "justify-center px-2" : "justify-between px-4"
        )}
      >
        {effectiveCollapsed ? (
          <LogoMark size="md" />
        ) : (
          <Logo size="md" compact showText />
        )}

        {!effectiveCollapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="btn btn-ghost btn-xs btn-circle hidden shrink-0 text-[var(--text-muted)] hover:text-[var(--color-brand-dark)] lg:inline-flex"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {effectiveCollapsed ? (
        <div className="flex justify-center border-b border-[var(--sidebar-border)] py-2">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="btn btn-ghost btn-xs btn-circle hidden text-[var(--text-muted)] hover:text-[var(--color-brand-dark)] lg:inline-flex"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-5">
            {!effectiveCollapsed ? (
              <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.12em] text-[var(--sidebar-section)]">
                {section.title}
              </p>
            ) : null}
            <ul className="space-y-1">
              {section.items.map(({ label, path, icon: Icon }) => {
                const itemCount = pathCountMap[path] ?? 0;

                return (
                <li key={path}>
                  <NavLink
                    to={path}
                    title={effectiveCollapsed ? label : undefined}
                    onClick={() => {
                      if (mobileOpen) onMobileClose();
                    }}
                    className={({ isActive }) =>
                      cn(
                        "relative flex items-center rounded-xl text-[15px] font-medium transition-all duration-150",
                        effectiveCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                        isActive
                          ? "bg-[var(--color-brand-primary)] text-white shadow-sm"
                          : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)]"
                      )
                    }
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0 stroke-[1.75]" />
                    {!effectiveCollapsed ? (
                      <>
                        <span className="truncate">{label}</span>
                        {itemCount > 0 ? (
                          <span
                            className={cn(
                              "ml-auto inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none",
                              badgeClassByPath(path)
                            )}
                          >
                            {formatCountLabel(itemCount)}
                          </span>
                        ) : null}
                      </>
                    ) : null}
                    {effectiveCollapsed && itemCount > 0 ? (
                      <span
                        className={cn(
                          "absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold",
                          badgeClassByPath(path, true)
                        )}
                      >
                        {itemCount > 9 ? "9+" : itemCount}
                      </span>
                    ) : null}
                  </NavLink>
                </li>
              )})}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--sidebar-border)] px-3 py-4">
        <button
          type="button"
          onClick={() => {
            if (mobileOpen) onMobileClose();
            void logout();
          }}
          title={effectiveCollapsed ? LOGOUT_ITEM.label : undefined}
          className={cn(
            "flex w-full items-center rounded-xl text-[15px] font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30",
            effectiveCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
          )}
        >
          <LOGOUT_ITEM.icon className="h-[18px] w-[18px] shrink-0 stroke-[1.75]" />
          {!effectiveCollapsed ? LOGOUT_ITEM.label : null}
        </button>
      </div>
      </aside>
    </>
  );
}
