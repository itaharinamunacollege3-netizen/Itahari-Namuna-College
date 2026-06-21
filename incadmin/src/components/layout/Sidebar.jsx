import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Logo, LogoMark } from "@/components/cms/Logo";
import { LOGOUT_ITEM, NAV_SECTIONS } from "@/constants/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/utils/cn";

const STORAGE_KEY = "inc_admin_sidebar_collapsed";

export function Sidebar() {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  return (
    <aside
      className={cn(
        "admin-sidebar sticky top-0 flex h-screen shrink-0 flex-col self-start border-r border-[var(--sidebar-border)] transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[76px]" : "w-[260px]"
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center border-b border-[var(--sidebar-border)] py-5",
          collapsed ? "justify-center px-2" : "justify-between px-4"
        )}
      >
        {collapsed ? (
          <LogoMark size="md" />
        ) : (
          <Logo size="md" compact showText />
        )}

        {!collapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="btn btn-ghost btn-xs btn-circle shrink-0 text-[var(--text-muted)] hover:text-[var(--color-brand-dark)]"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {collapsed ? (
        <div className="flex justify-center border-b border-[var(--sidebar-border)] py-2">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="btn btn-ghost btn-xs btn-circle text-[var(--text-muted)] hover:text-[var(--color-brand-dark)]"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-5">
            {!collapsed ? (
              <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.12em] text-[var(--sidebar-section)]">
                {section.title}
              </p>
            ) : null}
            <ul className="space-y-1">
              {section.items.map(({ label, path, icon: Icon }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    title={collapsed ? label : undefined}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center rounded-xl text-[15px] font-medium transition-all duration-150",
                        collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                        isActive
                          ? "bg-[var(--color-brand-primary)] text-white shadow-sm"
                          : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)]"
                      )
                    }
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0 stroke-[1.75]" />
                    {!collapsed ? label : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--sidebar-border)] px-3 py-4">
        <button
          type="button"
          onClick={() => void logout()}
          title={collapsed ? LOGOUT_ITEM.label : undefined}
          className={cn(
            "flex w-full items-center rounded-xl text-[15px] font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30",
            collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
          )}
        >
          <LOGOUT_ITEM.icon className="h-[18px] w-[18px] shrink-0 stroke-[1.75]" />
          {!collapsed ? LOGOUT_ITEM.label : null}
        </button>
      </div>
    </aside>
  );
}
