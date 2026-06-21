import { useState } from "react";
import toast from "react-hot-toast";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAsyncData } from "@/hooks/useAsyncData";
import { formatDate } from "@/utils/format";
import { useNotifications } from "@/contexts/NotificationContext";
import { listNotifications } from "@/services/notifications.service";

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const {
    markRead: ctxMarkRead,
    markAllRead: ctxMarkAllRead,
    remove: ctxRemove,
  } = useNotifications();

  const { data, meta, loading, error, reload } = useAsyncData(
    () => listNotifications({ page, limit: 20 }),
    [page]
  );

  async function handleMarkRead(id) {
    try {
      await ctxMarkRead(id);
      toast.success("Marked as read");
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleMarkAll() {
    try {
      await ctxMarkAllRead();
      toast.success("All notifications marked read");
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this notification?")) return;
    try {
      await ctxRemove(id);
      toast.success("Notification deleted");
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Real-time admin alerts from admissions and contacts"
        actions={
          <Button size="sm" onClick={handleMarkAll}>
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        }
      />

      <Card className="p-4">
        {error ? (
          <div className="alert alert-error">{error}</div>
        ) : loading ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="space-y-3">
              {data?.length ? (
                data.map((n) => (
                  <div
                    key={n.id}
                    className={`flex gap-4 rounded-xl border p-4 ${n.isRead ? "border-slate-100 bg-white" : "border-[var(--color-brand-primary)]/20 bg-emerald-50/40"}`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-[var(--color-brand-dark)]">
                            {n.title}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                        </div>
                        <span className="text-xs text-slate-400">
                          {formatDate(n.createdAt)}
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        {!n.isRead ? (
                          <Button
                            size="xs"
                            onClick={() => handleMarkRead(n.id)}
                          >
                            Mark read
                          </Button>
                        ) : null}
                        <Button
                          size="xs"
                          variant="danger"
                          onClick={() => handleDelete(n.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-12 text-center text-slate-500">No notifications yet</p>
              )}
            </div>
            <Pagination meta={meta} onPageChange={setPage} />
          </>
        )}
      </Card>
    </div>
  );
}
