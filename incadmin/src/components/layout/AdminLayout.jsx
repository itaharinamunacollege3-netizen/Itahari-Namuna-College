import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLoader } from "./DashboardLoader";

export function AdminLayout() {
  const { isBootLoading } = useAuth();

  if (isBootLoading) {
    return <DashboardLoader />;
  }

  return (
    <div className="admin-shell flex h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-brand-dark)]">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="admin-main min-h-0 flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
