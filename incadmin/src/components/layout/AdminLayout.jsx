import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLoader } from "./DashboardLoader";

export function AdminLayout() {
  const { isBootLoading } = useAuth();
  const { pathname } = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (isBootLoading) return;
    setMobileSidebarOpen(false);
  }, [isBootLoading, pathname]);


  return (
    <div className="admin-shell flex h-screen overflow-hidden bg-(--color-bg) text-(--color-brand-dark)">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setMobileSidebarOpen((prev) => !prev)} />
        <main className="admin-main min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
